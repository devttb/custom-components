import { Box } from '@mantine/core';
import { VideoPlayer } from './video-player';

export default {
  title: 'Video Player',
};

export const Usage = () => (
  <Box w={'100%'} h={'56.25vw'} mah={'calc(100vh - 169px)'} bg={'black'}>
    <VideoPlayer src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
  </Box>
);
