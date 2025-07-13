import { Box } from '@mantine/core';
import { VideoPlayer } from '@/components/organisms/video-player/video-player';

export default function HomePage() {
  return (
    <Box>
      <VideoPlayer src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
    </Box>
  );
}
