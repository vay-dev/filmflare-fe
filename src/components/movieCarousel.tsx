import React from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./movieCard";
import type { MovieInterface } from "../interfaces/movie.interface";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/movieCarousel.scss";

interface MovieCarouselProps {
  title: string;
  movies: MovieInterface[];
  showDetails?: boolean;
  isLarge?: boolean;
  backgroundMovie?: MovieInterface | null;
}

// Custom arrow components
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className="carousel-btn carousel-btn--right" onClick={onClick}>
      <ChevronRight className="icon" />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className="carousel-btn carousel-btn--left" onClick={onClick}>
      <ChevronLeft className="icon" />
    </button>
  );
};

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  movies,
  showDetails = false,
  isLarge = false,
  backgroundMovie,
}) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  const settings = {
    dots: true,
    infinite: movies.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: movies.length > 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: movies.length > 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: movies.length > 1,
        },
      },
    ],
  };

  return (
    <div className="movie-carousel">
      {backgroundMovie && (
        <div
          className="carousel-background"
          style={{
            backgroundImage: `url(${
              backgroundMovie.backdrop_path || backgroundMovie.poster_path || '/no-image.png'
            })`,
          }}
        />
      )}

      <div className="carousel-content">
        <div className="carousel-header">
          <h2 className="carousel-title">{title}</h2>
        </div>

        <Slider {...settings}>
          {movies.map((movie) => (
            <div key={movie.id} className="carousel-item">
              <MovieCard
                movie={movie}
                showDetails={showDetails}
                isLarge={isLarge}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MovieCarousel;
