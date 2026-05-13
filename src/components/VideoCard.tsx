import { useState } from 'react';
import { Play, Plus, Heart, Star, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { videoService } from '../services/videoService';
import { toast } from '../services/toastService';
import type { Video } from '../interfaces/video.interface';
import VideoPlayer from './VideoPlayer';
import './styles/videoCard.scss';

interface VideoCardProps {
  video: Video;
  isLarge?: boolean;
  showDetails?: boolean;
  onUpdate?: () => void;
}

export const VideoCard = ({ video, isLarge = false, showDetails = false, onUpdate }: VideoCardProps) => {
  const { isAuthenticated } = useAuth();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLiked, setIsLiked] = useState(video.has_liked);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes_count);
  const [loading, setLoading] = useState(false);

  const handlePlay = () => {
    if (!isAuthenticated) {
      toast.info('Please login to watch videos');
      return;
    }
    setShowPlayer(true);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please login to like videos');
      return;
    }

    setLoading(true);
    try {
      await videoService.toggleLike(video.id);
      const nowLiked = !isLiked;
      setIsLiked(nowLiked);
      setLikesCount(prev => nowLiked ? prev + 1 : prev - 1);
      toast.success(nowLiked ? 'Added to liked videos' : 'Removed from liked videos');
    } catch {
      toast.error('Failed to like video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      await videoService.toggleFavorite(video.id);
      const nowFavorited = !isFavorited;
      setIsFavorited(nowFavorited);
      toast.success(nowFavorited ? 'Added to favorites' : 'Removed from favorites');
      if (onUpdate) onUpdate();
    } catch {
      toast.error('Failed to update favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatRating = (rating: number) => {
    return Math.round(rating * 10) / 10;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).getFullYear();
  };

  if (showPlayer) {
    return (
      <div className="video-player-modal">
        <VideoPlayer
          videoUrl={video.video_file}
          youtubeTrailerKey={video.youtube_trailer_key}
          poster={video.thumbnail}
          onClose={() => setShowPlayer(false)}
        />
      </div>
    );
  }

  return (
    <div className={`video-card ${isLarge ? 'video-card--large' : ''}`}>
      <div className="video-card__image-container">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="video-card__image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/no-image.png";
          }}
        />
        <div className="video-card__overlay">
          {isAuthenticated ? (
            <div className="video-card__actions">
              <button
                onClick={handlePlay}
                className="btn-action btn-action--play"
                title="Play"
              >
                <Play className="icon" />
              </button>
              <button
                onClick={handleFavorite}
                className={`btn-action ${isFavorited ? 'btn-action--favorited' : 'btn-action--add'}`}
                disabled={loading}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorited ? <Check className="icon" /> : <Plus className="icon" />}
              </button>
              <button
                onClick={handleLike}
                className={`btn-action ${isLiked ? 'btn-action--liked' : 'btn-action--like'}`}
                disabled={loading}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart className={`icon ${isLiked ? 'filled' : ''}`} />
              </button>
            </div>
          ) : (
            <div className="video-card__actions">
              <button
                onClick={handlePlay}
                className="btn-action btn-action--play"
                title="Login to watch"
              >
                <Play className="icon" />
              </button>
            </div>
          )}

          <div className="video-card__likes">
            <Heart size={14} />
            <span>{likesCount}</span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="video-card__details">
          <h3 className="video-card__title">{video.title}</h3>

          <div className="video-card__meta">
            {video.average_rating > 0 && (
              <div className="video-card__rating">
                <Star className="star-icon" />
                <span>{formatRating(video.average_rating)}</span>
              </div>
            )}
            <span className="video-card__year">
              {formatDate(video.release_date)}
            </span>
          </div>

          <div className="video-card__genres">
            {video.genres.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="video-card__info">
            <p className="video-card__producer">
              <strong>Producer:</strong> {video.producer}
            </p>
            <p className="video-card__actors">
              <strong>Cast:</strong> {video.star_actors}
            </p>
          </div>

          {video.description && (
            <p className="video-card__overview">
              {video.description.length > 120
                ? `${video.description.substring(0, 120)}...`
                : video.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoCard;
