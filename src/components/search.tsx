import React from "react";
import type { BtnValueInterface } from "../interfaces/btnValue.interface";
import { useState } from "react";
import "./styles/search.scss";
import { Search as Glass, X } from "lucide-react";

interface SearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  fetchMoviesByGenre: (genreId: number, genreLabel: string) => void;
  selectedGenre: BtnValueInterface | null;
  setSelectedGenre: React.Dispatch<
    React.SetStateAction<BtnValueInterface | null>
  >;
  activeTab: string;
  setActiveTab: React.Dispatch<
    React.SetStateAction<"all" | "genres" | "trending">
  >;
}

interface TabInterface {
  label: string;
  id: number;
  key: "all" | "genres" | "trending";
}

const Search: React.FC<SearchProps> = ({
  searchTerm,
  setSearchTerm,
  fetchMoviesByGenre,
  activeTab,
  setActiveTab,
  setSelectedGenre,
}) => {
  // ==== array of text ==== //

  // genre buttons
  const genreButtons: BtnValueInterface[] = [
    { id: 28, label: "Action" },
    { id: 35, label: "Comedy" },
    { id: 27, label: "Horror" },
    { id: 878, label: "Sci-Fi" },
    { id: 18, label: "Drama" },
    { id: 16, label: "Animation" },
    { id: 12, label: "Adventure" },
    { id: 14, label: "Fantasy" },
  ];

  const [selectedGenres, setSelectedGenres] = useState<number | null>(null);

  // tabs
  const tabs: TabInterface[] = [
    { id: 1, label: "All", key: "all" },
    { id: 2, label: "Trending", key: "trending" },
    { id: 3, label: "Genres", key: "genres" },
  ];

  // ===== helper functions ===== //
  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // If user starts typing, switch to "All" tab to show search results
    if (e.target.value && activeTab !== "all") {
      setActiveTab("all");
    }
  };

  const handleTabChange = (tabKey: "all" | "genres" | "trending") => {
    setActiveTab(tabKey);

    // Clear search when switching tabs
    if (searchTerm && tabKey !== "all") {
      setSearchTerm("");
    }

    // Reset genre selection when leaving genres tab
    if (tabKey !== "genres") {
      setSelectedGenres(null);
      setSelectedGenre(null);
    }
  };

  const handleGenreSelect = (genre: BtnValueInterface) => {
    fetchMoviesByGenre(genre.id, genre.label);
    setSelectedGenres(genre.id);
    setSelectedGenre(genre);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedGenres(null);
    setSelectedGenre(null);
  };

  return (
    <div className="search__component">
      <div className="input__wrapper">
        <span className="icon-con">
          <Glass className="glass" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTerm}
          placeholder="Search movies..."
          className="input"
        />
        {(searchTerm || selectedGenres) && (
          <span className="close__button" onClick={clearSearch}>
            <X className="close__button__icon" />
          </span>
        )}
      </div>

      {searchTerm && (
        <div className="info__text">
          <span>
            Searching for <span className="search">"{searchTerm}"</span>
          </span>
        </div>
      )}

      {/* tabs below */}
      <div className="tabs mt-3">
        {tabs.map((tab) => (
          <button
            onClick={() => handleTabChange(tab.key)}
            className={`tab ${activeTab === tab.key ? "selected" : ""}`}
            key={tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "genres" && (
        <div className="suggestions">
          <div className="suggestions-header">
            <span className="suggestions-title">Browse by Genre</span>
          </div>
          <div className="suggestions-grid">
            {genreButtons.map((btn) => (
              <span
                className={`suggestions__button ${
                  selectedGenres === btn.id ? "selected" : ""
                }`}
                key={btn.id}
                onClick={() => handleGenreSelect(btn)}
              >
                {btn.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {activeTab === "trending" && (
        <div className="info__text">
          <span>
            Showing most <span className="search">searched movies</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default Search;
