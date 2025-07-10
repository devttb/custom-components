'use client';

import { useRef } from 'react';
import { Box, Button, Flex, Popover, Select, Slider, Text, ThemeIcon } from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import {
  IconExitFullScreen,
  IconFullScreen,
  IconPause,
  IconPlay,
  IconSetting,
  IconSkipBack,
  IconSkipFoward,
  IconVolumeLarge,
  IconVolumeMuted,
  IconVolumeSmall,
} from '@/components/atoms/icons';
import { useVideoPlayer } from '@/hooks/use-video-player/use-video-player';
import { images } from '@/public/images';

interface IVideoPlayerProps {
  src: string;
}

const PLAYBACK_RATE_OPTIONS = ['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'];

export const VideoPlayer: React.FC<IVideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownOpened, { toggle }] = useDisclosure();

  const {
    videoState,
    handlePlay,
    handleFullScreen,
    handleSeek,
    handleChangeVolume,
    hanldeMute,
    handlePlaybackRate,
    handleShowControls,
    updateVideoSate,
    formatTime,
  } = useVideoPlayer(videoRef);

  useHotkeys([
    ['space', handlePlay],
    ['f', () => handleFullScreen(containerRef)],
    ['arrowLeft', () => handleSeek(videoState.currentTime - 5)],
    ['arrowRight', () => handleSeek(videoState.currentTime + 5)],
    ['arrowUp', () => handleChangeVolume(Math.min(videoState.volume + 0.1, 1))],
    ['arrowDown', () => handleChangeVolume(Math.max(videoState.volume - 0.1, 0))],
    ['m', hanldeMute],
  ]);

  return (
    <Box
      pos={'relative'}
      w={'100%'}
      h={'100%'}
      ref={containerRef}
      onMouseEnter={() => videoState.isPlaying && handleShowControls(true)}
      onMouseLeave={() => videoState.isPlaying && handleShowControls(false)}
    >
      <Flex
        w={'100%'}
        h={'100%'}
        justify={'center'}
        onClick={handlePlay}
        onDoubleClick={() => handleFullScreen(containerRef)}
      >
        <video ref={videoRef} src={src} />
      </Flex>

      <Box
        h={'54px'}
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
      <Box
        pos={'absolute'}
        bottom={'0px'}
        w={'100%'}
        style={{ visibility: videoState.isShowControls ? 'visible' : 'hidden' }}
      >
        <Slider
          mx={'10px'}
          onChange={handleSeek}
          step={1}
          size={'sm'}
          color={'red'}
          min={0}
          max={videoState.duration}
          value={videoState.currentTime}
          styles={{ thumb: { border: 'none', background: 'red' } }}
        ></Slider>

        <Flex justify={'space-between'} style={{ textShadow: '0 0 2px rgba(0,0,0,.5)' }}>
          <Flex flex={'1'}>
            <ThemeIcon bg={'none'} color={'white'} size={'xl'} onClick={handlePlay}>
              {videoState.isPlaying ? <IconPause /> : <IconPlay />}
            </ThemeIcon>
            <ThemeIcon
              onClick={() => handleSeek(videoState.currentTime - 5)}
              bg={'none'}
              color={'white'}
              size={'xl'}
            >
              <IconSkipBack />
            </ThemeIcon>
            <ThemeIcon
              onClick={() => handleSeek(videoState.currentTime + 5)}
              bg={'none'}
              color={'white'}
              size={'xl'}
            >
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
              <Slider
                size={'sm'}
                color={'white'}
                value={videoState.volume}
                onChange={handleChangeVolume}
                max={1}
                step={0.1}
                w={'100%'}
              />
            </Flex>
            <Text pl={'12px '} lh={'42px'} color="white">
              {`${formatTime(videoState.currentTime)} / ${formatTime(videoState.duration)}`}
            </Text>
          </Flex>

          <Flex>
            <Popover position="top">
              <Popover.Target>
                <ThemeIcon bg={'none'} size={'xl'}>
                  <IconSetting />
                </ThemeIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Flex pos={'relative'} w={'100%'}>
                  <Button
                    h={'100%'}
                    pos={'absolute'}
                    px={0}
                    bg={'none'}
                    style={{ color: 'black', fontWeight: 'normal' }}
                    size={'md'}
                    onClick={toggle}
                  >
                    Playback Rate : {videoState.playbackRate}
                  </Button>
                  <Select
                    style={{ visibility: 'hidden' }}
                    dropdownOpened={dropdownOpened}
                    data={PLAYBACK_RATE_OPTIONS}
                    checkIconPosition="right"
                    value={videoState.playbackRate.toString()}
                    onChange={(value) => {
                      handlePlaybackRate(Number(value));
                      toggle();
                    }}
                    comboboxProps={{ withinPortal: false, position: 'top' }}
                  />
                </Flex>
              </Popover.Dropdown>
            </Popover>

            <ThemeIcon
              bg={'none'}
              color={'white'}
              size={'xl'}
              onClick={() => handleFullScreen(containerRef)}
            >
              {videoState.isFullScreen ? <IconExitFullScreen /> : <IconFullScreen />}
            </ThemeIcon>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
