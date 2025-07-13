'use client';

import { useCallback, useRef } from 'react';
import { IconPicnicTable } from '@tabler/icons-react';
import {
  Box,
  Button,
  Center,
  CheckIcon,
  Flex,
  Menu,
  MenuItem,
  Popover,
  ScrollArea,
  Select,
  Slider,
  Tabs,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import {
  IconExitFullScreen,
  IconFullScreen,
  IconPause,
  IconPictureInPicture,
  IconPlay,
  IconSetting,
  IconSkipBack,
  IconSkipFoward,
  IconVolumeLarge,
  IconVolumeMuted,
  IconVolumeSmall,
} from '@/components/atoms/icons';
import { ProgressBar } from '@/components/atoms/progress-bar';
import { useVideoPlayer } from '@/hooks/use-video-player/use-video-player';
import { images } from '@/public/images';

interface IVideoPlayerProps {
  src: string;
}

const PLAYBACK_RATE_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const VideoPlayer: React.FC<IVideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownOpened, { toggle: toggleSelect }] = useDisclosure();

  const {
    videoState,
    handlePlay,
    handlePause,
    handleFullScreen,
    handleSeek,
    handleChangeVolume,
    hanldeMute,
    handlePlaybackRate,
    handleShowControls,
    handlePictureInPicture,
    updateVideoSate,
    formatTime,
  } = useVideoPlayer(videoRef);

  const togglePlay = useCallback(() => {
    if (videoState.isPlaying) {
      handlePause();
      return;
    }
    handlePlay();
  }, [videoState.isPlaying]);

  const handleSeekBack = useCallback(() => {
    const seekValue = videoState.currentTime - 5;

    if (seekValue <= videoState.currentTime) return;
    handleSeek(seekValue);
  }, [videoState.currentTime]);

  const handleSeekForward = useCallback(() => {
    const seekValue = videoState.currentTime + 5;

    if (seekValue >= videoState.duration) return;
    handleSeek(seekValue);
  }, [videoState.duration, videoState.currentTime]);

  const handleVolumeUp = useCallback(() => {
    if (videoState.volume >= 1) return;
    handleChangeVolume(Math.min(videoState.volume + 0.1, 1));
  }, [videoState.volume]);

  const handleVolumeDown = useCallback(() => {
    if (videoState.volume <= 0.1) return;
    handleChangeVolume(Math.min(videoState.volume - 0.1, 1));
  }, [videoState.volume]);

  const handleMouseEnter = useCallback(() => {
    videoState.isPlaying && handleShowControls(true);
  }, [videoState.isPlaying]);

  const handleMouseLeave = useCallback(() => {
    videoState.isPlaying && handleShowControls(false);
  }, [videoState.isPlaying]);

  const handleVideoEnded = useCallback(() => {
    handleShowControls(true);
    handlePlay();
  }, []);

  const handleSelectPlayBackRate = useCallback(
    (value: string | null) => {
      handlePlaybackRate(Number(value));
      toggleSelect();
    },
    [handlePlaybackRate, toggleSelect]
  );

  const toggleFullScreen = useCallback(() => {
    handleFullScreen(containerRef);
  }, [handleFullScreen, containerRef]);

  useHotkeys([
    ['space', togglePlay],
    ['f', toggleFullScreen],
    ['arrowLeft', handleSeekBack],
    ['arrowRight', handleSeekForward],
    ['arrowUp', handleVolumeUp],
    ['arrowDown', handleVolumeDown],
    ['m', hanldeMute],
  ]);

  return (
    <ScrollArea w={'100%'} h={'100%'} ref={containerRef}>
      <Box w={'100%'} h={'56.25vw'} mah={'calc(100vh - 169px)'} bg={'black'}>
        <Box
          pos={'relative'}
          w={'100%'}
          h={'100%'}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={togglePlay}
          onDoubleClick={() => handleFullScreen(containerRef)}
        >
          <Flex w={'100%'} h={'100%'} justify={'center'}>
            <video ref={videoRef} src={src} width={'100%'} onEnded={handleVideoEnded} />
          </Flex>

          <Box
            h={'100%'}
            bottom={'0'}
            bgp={'bottom'}
            bgr={'repeat-x'}
            pos={'absolute'}
            w={'100%'}
            style={{
              visibility: videoState.isShowControls ? 'visible' : 'hidden',
              backgroundImage: `url('${images.gradientBottom.src}')`,
            }}
          />
          <Center pos={'absolute'} left={'50%'} top={'50%'}>
            <Box
              style={{
                transform: 'translate(-50%, -50%)',
                opacity: videoState.isShowLargeIcon ? 1 : 0,
                transition: 'opacity .5s linear',
              }}
            >
              <ThemeIcon
                unstyled
                style={{
                  width: 52,
                  height: 52,
                  transform: videoState.isShowLargeIcon ? 'scale(2)' : 'scale(1)',
                  transition: 'transform .5s linear',
                  background: 'rgba(41, 32, 32, 0.5)',
                  borderRadius: '50%',
                  color: 'white',
                }}
              >
                {videoState.isPlaying ? <IconPlay /> : <IconPause />}
              </ThemeIcon>
            </Box>
          </Center>
          <Box
            px={'12px'}
            pos={'absolute'}
            bottom={'0px'}
            w={'100%'}
            style={{ visibility: videoState.isShowControls ? 'visible' : 'hidden' }}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <ProgressBar
              onChange={handleSeek}
              color="#F03"
              step={1}
              min={0}
              max={videoState.duration}
              value={videoState.currentTime}
              label={<Text>{formatTime(videoState.currentTime)}</Text>}
            />
            <Flex justify={'space-between'} style={{ textShadow: '0 0 2px rgba(0,0,0,.5)' }}>
              <Flex flex={'1'}>
                <ThemeIcon bg={'none'} color={'white'} size={'xl'} onClick={togglePlay}>
                  {videoState.isPlaying ? <IconPause /> : <IconPlay />}
                </ThemeIcon>
                <ThemeIcon onClick={handleSeekBack} bg={'none'} color={'white'} size={'xl'}>
                  <IconSkipBack />
                </ThemeIcon>
                <ThemeIcon onClick={handleSeekForward} bg={'none'} color={'white'} size={'xl'}>
                  <IconSkipFoward />
                </ThemeIcon>
                <ThemeIcon bg={'none'} color={'white'} size={'xl'} onClick={hanldeMute}>
                  {videoState.isMuted || videoState.volume == 0 ? (
                    <IconVolumeMuted />
                  ) : videoState.volume >= 0.5 ? (
                    <IconVolumeLarge />
                  ) : (
                    <IconVolumeSmall />
                  )}
                </ThemeIcon>
                <Flex w={'70px'} align={'center'}>
                  <ProgressBar
                    color={'white'}
                    value={videoState.volume}
                    onChange={handleChangeVolume}
                    max={1}
                    step={0.1}
                    label={<Text>{`${videoState.volume * 100}%`}</Text>}
                    w={'100%'}
                  />
                </Flex>
                <Text pl={'12px '} lh={'42px'} color="white">
                  {`${formatTime(videoState.currentTime)} / ${formatTime(videoState.duration)}`}
                </Text>
              </Flex>

              <Flex>
                <Menu
                  position="top"
                  withinPortal={false}
                  transitionProps={{ transition: 'fade', duration: 300 }}
                >
                  <Menu.Target>
                    <ThemeIcon bg={'none'} size={'xl'}>
                      <IconSetting />
                    </ThemeIcon>
                  </Menu.Target>
                  <Menu.Dropdown miw={'200px'} mih={'250px'} px={0}>
                    <Menu.Label fz={'18px'} style={{ textShadow: 'none' }}>
                      Playback speed
                    </Menu.Label>
                    {PLAYBACK_RATE_OPTIONS.map((value) => (
                      <Menu.Item
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Flex
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Text>{value}x</Text>
                          {value === videoState.playbackRate && <CheckIcon size={14} />}
                        </Flex>
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>

                <ThemeIcon bg={'none'} color={'white'} size={'xl'} onClick={handlePictureInPicture}>
                  {videoState.isPip ? <IconPictureInPicture /> : <IconPictureInPicture />}
                </ThemeIcon>

                <ThemeIcon bg={'none'} color={'white'} size={'xl'} onClick={toggleFullScreen}>
                  {videoState.isFullScreen ? <IconExitFullScreen /> : <IconFullScreen />}
                </ThemeIcon>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Box>

      <Center w={'100%'} mih={'1000px'} bg={'white'}>
        <Text ta={'center'} fz={'100px'}>
          TEST SCROLL WHEN FULL SCREEN
        </Text>
      </Center>
    </ScrollArea>
  );
};
