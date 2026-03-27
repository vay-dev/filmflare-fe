import React from "react";
import MovieCard from "./movieCard";
import type { MovieInterface } from "../interfaces/movie.interface";
import "./styles/movieGrid.scss";

interface MovieGridProps {
  movies: MovieInterface[];
  title?: string;
  showDetails?: boolean;
  isLoading?: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  title,
  showDetails = true,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="movie-grid">
        {title && <h2 className="grid-title">{title}</h2>}
        <div className="grid-container">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="grid-item skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-meta"></div>
                <div className="skeleton-text"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="movie-grid">
        {title && <h2 className="grid-title">{title}</h2>}
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <h3>No movies found</h3>
          <p>Try adjusting your search or browse different genres.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {title && <h2 className="grid-title">{title}</h2>}
      <div className="grid-container">
        {movies.map((movie) => (
          <div key={movie.id} className="grid-item">
            <MovieCard movie={movie} showDetails={showDetails} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
