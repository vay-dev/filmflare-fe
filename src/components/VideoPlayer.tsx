import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
} from "lucide-react";
import "./styles/videoPlayer.scss";

interface VideoPlayerProps {
  videoUrl: string;
  youtubeTrailerKey?: string | null;
  poster?: string;
  onClose?: () => void;
}

const VideoPlayer = ({
  videoUrl,
  youtubeTrailerKey,
  poster: _poster,
  onClose,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  let hideControlsTimeout: ReturnType<typeof setTimeout>;

  // Update time as video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying) {
      hideControlsTimeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
    }

    return () => clearTimeout(hideControlsTimeout);
  }, [isPlaying, showControls]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume || 0.5;
      setVolume(volume || 0.5);
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  // Disabled seeking functionality
  // const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   const video = videoRef.current;
  //   const progressBar = progressRef.current;
  //   if (!video || !progressBar) return;

  //   const rect = progressBar.getBoundingClientRect();
  //   const pos = (e.clientX - rect.left) / rect.width;
  //   video.currentTime = pos * duration;
  // };

  // const skip = (seconds: number) => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  // };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideControlsTimeout);
  };

  // If no real video file but we have a YouTube trailer key, render the embed
  if (!videoUrl && youtubeTrailerKey) {
    return (
      <div className="video-player video-player--youtube" ref={containerRef}>
        {onClose && (
          <button onClick={onClose} className="video-player__close">
            ×
          </button>
        )}
        <iframe
          className="video-player__youtube"
          src={`https://www.youtube-nocookie.com/embed/${youtubeTrailerKey}?autoplay=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Trailer"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`video-player ${isFullscreen ? "fullscreen" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="video-player__video"
        onClick={togglePlay}
        preload="metadata"
      />

      <div
        className={`video-player__controls ${showControls ? "visible" : ""}`}
      >
        {/* Progress Bar - Read Only */}
        <div ref={progressRef} className="video-player__progress">
          <div
            className="video-player__progress-filled"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="video-player__controls-bottom">
          <div className="video-player__controls-left">
            <button onClick={togglePlay} className="control-btn">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <div className="volume-control">
              <button onClick={toggleMute} className="control-btn">
                {isMuted || volume === 0 ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>

            <span className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="video-player__controls-right">
            <div className="speed-control">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="control-btn"
              >
                <Settings size={20} />
                <span className="speed-label">{playbackSpeed}x</span>
              </button>

              {showSpeedMenu && (
                <div className="speed-menu">
                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => changePlaybackSpeed(speed)}
                      className={`speed-option ${playbackSpeed === speed ? "active" : ""}`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleFullscreen} className="control-btn">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>

      {onClose && (
        <button onClick={onClose} className="video-player__close">
          ×
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
