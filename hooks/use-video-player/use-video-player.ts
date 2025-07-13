import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

interface IVideoState {
  isPlaying: boolean;
  isFullScreen: boolean;
  currentTime: number;
  duration: number; // all time in seconds
  volume: number; // from 0 to 1
  isMuted: boolean; // optional, if you want to track mute state
  playbackRate: number; // speed of video
  isShowControls: boolean; // optional, if you want to track controls visibility
  isShowLargeIcon: boolean;
  isPip: boolean; // picture in picture
}

const initVideoState: IVideoState = {
  isPlaying: false,
  isFullScreen: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  isShowControls: true,
  isShowLargeIcon: false,
  isPip: false,
};

export function useVideoPlayer(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  initProps?: Partial<IVideoState>
) {
  const [videoState, setVideoState] = useState<IVideoState>({ ...initVideoState, ...initProps });

  const updateVideoSate = useCallback((newState: Partial<IVideoState>) => {
    setVideoState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  // handle play video
  const handlePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play();
    updateVideoSate({ isPlaying: true, isShowLargeIcon: true });
  }, [videoState.isPlaying, updateVideoSate, videoRef]);

  //hanlde pause video
  const handlePause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    updateVideoSate({ isPlaying: false, isShowLargeIcon: true });
  }, []);

  // handle exit/fullscreen video
  const handleFullScreen = useCallback(
    (containerRef: React.RefObject<HTMLDivElement | null>) => {
      const container = containerRef.current;

      if (!container) return;

      if (videoState.isFullScreen) {
        document.exitFullscreen();
        updateVideoSate({ isFullScreen: false });
        return;
      }

      container.requestFullscreen();
      updateVideoSate({ isFullScreen: true });
    },
    [videoState.isFullScreen, updateVideoSate]
  );

  // format time of video (hours:minutes:seconds - 00:00:00)
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // handle seek
  const handleSeek = useCallback(
    (value: number) => {
      const video = videoRef.current;
      if (!video) return;

      video.currentTime = value;
      updateVideoSate({ currentTime: value });
    },
    [videoState.currentTime, updateVideoSate, videoRef]
  );

  // handle volume of video
  const handleChangeVolume = useCallback(
    (value: number) => {
      const video = videoRef.current;
      if (!video) return;

      video.volume = value;
      updateVideoSate({ volume: value, isMuted: value === 0 });
    },
    [videoState.isMuted, updateVideoSate, videoRef]
  );

  // handle mute/unmute video
  const hanldeMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    updateVideoSate({ isMuted: !videoState.isMuted });
  }, [videoState.isMuted, updateVideoSate, videoRef]);

  // handle plackback speed of video
  const handlePlaybackRate = useCallback(
    (value: number) => {
      const video = videoRef.current;
      if (!video) return;

      video.playbackRate = value;
      updateVideoSate({ playbackRate: value });
    },
    [videoState.playbackRate, updateVideoSate, videoRef]
  );

  // handle show/hidden controls bar
  const handleShowControls = useCallback(
    (value: boolean) => {
      updateVideoSate({ isShowControls: value });
    },
    [videoState.isShowControls, updateVideoSate]
  );

  // handle picture in picture
  const handlePictureInPicture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (videoState.isPip) {
      document.exitPictureInPicture();
      updateVideoSate({ isPip: false });
      return;
    }

    video.requestPictureInPicture();
    updateVideoSate({ isPip: true });
  }, [videoState.isPip, videoRef]);

  // handle events listener
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      updateVideoSate({ currentTime: video?.currentTime });
    };
    const handleLoadedMetadata = () => {
      updateVideoSate({ duration: isNaN(video.duration) ? 0 : video.duration });
    };
    const handleExitPip = () => {
      updateVideoSate({ isPip: false });
    };

    handleLoadedMetadata();

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('leavepictureinpicture', handleExitPip);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('leavepictureinpicture', handleExitPip);
    };
  }, []);

  // handle show/hidden large icon at center video
  useEffect(() => {
    let timer;

    if (videoState.isShowLargeIcon) {
      setTimeout(() => {
        updateVideoSate({ isShowLargeIcon: false });
      }, 500);
    }

    return clearTimeout(timer);
  }, [videoState.isShowLargeIcon]);

  return {
    videoState,
    updateVideoSate,
    handlePlay,
    handlePause,
    handleFullScreen,
    handleSeek,
    handleChangeVolume,
    hanldeMute,
    handlePlaybackRate,
    handleShowControls,
    handlePictureInPicture,
    formatTime,
  };
}
