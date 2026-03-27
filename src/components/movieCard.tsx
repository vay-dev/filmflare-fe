import React from "react";
import { Play, Plus, Star, Info } from "lucide-react";
import type { MovieInterface } from "../interfaces/movie.interface";
import "./styles/movieCard.scss";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

interface MovieCardProps {
  movie: MovieInterface;
  isLarge?: boolean;
  showDetails?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isLarge = false,
  showDetails = false,
}) => {
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const getMovieGenres = (genreIds: number[]) => {
    return (
      genreIds
        ?.map((id) => genres.find((genre) => genre.id === id)?.name)
        .filter(Boolean)
        .slice(0, 3) || []
    );
  };

  const formatRating = (rating: number) => {
    return Math.round(rating * 10) / 10;
  };

  return (
    <div className={`movie-card ${isLarge ? "movie-card--large" : ""}`}>
      <div className="movie-card__image-container">
        <img
          src={
            movie.poster_path ? `${movie.poster_path}` : "/no-image.png"
          }
          alt={movie.title}
          className="movie-card__image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/no-image.png";
          }}
        />
        <div className="movie-card__overlay">
          <div className="movie-card__actions">
            <button className="btn-action btn-action--play">
              <Play className="icon" />
            </button>
            <button className="btn-action btn-action--add">
              <Plus className="icon" />
            </button>
            <button className="btn-action btn-action--info">
              <Info className="icon" />
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="movie-card__details">
          <h3 className="movie-card__title">{movie.title}</h3>
          <div className="movie-card__meta">
            <div className="movie-card__rating">
              <Star className="star-icon" />
              <span>{formatRating(movie.vote_average)}</span>
            </div>
            <span className="movie-card__year">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>
          <div className="movie-card__genres">
            {getMovieGenres(movie.genre_ids).map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
          {movie.overview && (
            <p className="movie-card__overview">
              {movie.overview.length > 120
                ? `${movie.overview.substring(0, 120)}...`
                : movie.overview}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieCard;
