import React, { useCallback } from 'react';
import { Box, Flex, ThemeIcon } from '@mantine/core';
import { useClickOutside, useDisclosure } from '@mantine/hooks';
import { IconSetting } from '@/components/atoms/icons';

interface ISettingMenuProps {
  playback: {
    rate: number[]; // ['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2']
    onSelect: (value: number) => void;
    valueSelected: number;
  };
}

export const SettingMenu: React.FC<ISettingMenuProps> = ({ playback }) => {
  const [
    isOpenSettingMenu,
    { toggle: toggleSettingMenu, open: openSettingMenu, close: closeSettingMenu },
  ] = useDisclosure();
  const [isOpenPlayback, { toggle: togglePlayback, open: openPlayback, close: closePlayback }] =
    useDisclosure();

  const ref = useClickOutside(() => {
    closeSettingMenu();
    closePlayback();
  });

  const handleOpenSettingMenu = useCallback(() => {
    isOpenPlayback ? closeSettingMenu() : toggleSettingMenu();
    isOpenPlayback && closePlayback();
  }, [isOpenPlayback, toggleSettingMenu, closePlayback]);

  const handleSelectPlayback = useCallback((value: number) => {
    playback.onSelect(value);
    closePlayback();
    openSettingMenu();
  }, []);

  return (
    <Box ref={ref}>
      <ThemeIcon bg={'none'} color={'white'} size={'xl'} onClick={handleOpenSettingMenu}>
        <IconSetting />
      </ThemeIcon>
      <Flex
        direction="column"
        pos={'absolute'}
        style={{
          visibility: isOpenSettingMenu ? 'visible' : 'hidden',
          right: '10px',
          bottom: '10px',
          background: 'rgba(28,28,28,.9)',
          textShadow: '0 0 2px rgba(0,0,0,.5)',
          transition: 'opacity .1s cubic-bezier(0,0,.2,1)',
          borderRadius: '12px',
          minWidth: '100px',
          color: 'white',
          zIndex: 1,
        }}
      >
        <Box
          style={{ height: '40px', background: 'red' }}
          onClick={() => {
            openPlayback();
            closeSettingMenu();
          }}
        >
          Playback Speed {playback.valueSelected}x
        </Box>
        <Box style={{ height: '40px' }}>Quality</Box>
        <Box style={{ height: '40px' }}>Subtitles</Box>
      </Flex>
      <Flex
        direction="column"
        pos={'absolute'}
        style={{
          visibility: isOpenPlayback ? 'visible' : 'hidden',
          right: '10px',
          bottom: '10px',
          background: 'rgba(28,28,28,.9)',
          textShadow: '0 0 2px rgba(0,0,0,.5)',
          transition: 'opacity .1s cubic-bezier(0,0,.2,1)',
          borderRadius: '12px',
          minWidth: '100px',
          color: 'white',
          zIndex: 2,
        }}
      >
        {playback.rate.map((value) => (
          <Box h={'40px'} onClick={() => handleSelectPlayback(value)}>
            {value}x
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
