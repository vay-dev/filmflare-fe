import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { videoService } from '../services/videoService';
import api from '../services/api';
import type { VideoFormData, Genre } from '../interfaces/video.interface';
import { Upload, Film, FileText, Calendar, User as UserIcon, Star, Image, Video as VideoIcon, AlertCircle, CheckCircle, Search, X, Loader } from 'lucide-react';
import './styles/videoUpload.scss';

interface TmdbResult {
  tmdb_id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_url: string | null;
  vote_average: number;
}

interface TmdbMetadata {
  title: string;
  description: string;
  release_date: string;
  producer: string;
  star_actors: string;
  poster_url: string | null;
  genres: string[];
  youtube_trailer_key: string | null;
}

const VideoUpload = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  // TMDB search state
  const [tmdbQuery, setTmdbQuery] = useState('');
  const [tmdbResults, setTmdbResults] = useState<TmdbResult[]>([]);
  const [tmdbSearching, setTmdbSearching] = useState(false);
  const [tmdbFilling, setTmdbFilling] = useState(false);
  const [tmdbFilled, setTmdbFilled] = useState(false);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    release_date: '',
    producer: '',
    star_actors: '',
    thumbnail: null,
    video_file: null,
    genres: [],
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await videoService.getGenres();
        setGenres(genresData);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // TMDB search with debounce
  const handleTmdbSearch = (q: string) => {
    setTmdbQuery(q);
    setTmdbFilled(false);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    if (!q.trim()) { setTmdbResults([]); return; }
    searchDebounce.current = setTimeout(async () => {
      setTmdbSearching(true);
      try {
        const res = await api.get(`/tmdb/search/?q=${encodeURIComponent(q)}`);
        setTmdbResults(res.data);
      } catch { setTmdbResults([]); }
      finally { setTmdbSearching(false); }
    }, 400);
  };

  const handleTmdbPick = async (result: TmdbResult) => {
    setTmdbResults([]);
    setTmdbQuery(result.title);
    setTmdbFilling(true);
    try {
      const res = await api.get(`/tmdb/metadata/?id=${result.tmdb_id}`);
      const meta: TmdbMetadata = res.data;

      // Match genre names to local genre IDs
      const matchedGenreIds = genres
        .filter(g => meta.genres.some(mg => mg.toLowerCase() === g.name.toLowerCase()))
        .map(g => g.id);

      setFormData(prev => ({
        ...prev,
        title: meta.title,
        description: meta.description,
        release_date: meta.release_date,
        producer: meta.producer,
        star_actors: meta.star_actors,
        genres: matchedGenreIds,
      }));

      if (meta.poster_url) {
        setThumbnailPreview(meta.poster_url);
        // Fetch the poster via backend proxy (avoids CORS) and convert to a File
        try {
          const imgRes = await api.get(`/tmdb/poster/?url=${encodeURIComponent(meta.poster_url)}`, { responseType: 'blob' });
          const blob = imgRes.data;
          const ext = meta.poster_url.split('.').pop()?.split('?')[0] || 'jpg';
          const file = new File([blob], `poster.${ext}`, { type: blob.type });
          setFormData(prev => ({ ...prev, thumbnail: file, youtube_trailer_key: meta.youtube_trailer_key ?? null }));
        } catch (e) {
          console.error('Poster proxy failed:', e);
          setError('Could not fetch poster image. Please upload a thumbnail manually.');
          setFormData(prev => ({ ...prev, youtube_trailer_key: meta.youtube_trailer_key ?? null }));
        }
      } else {
        setFormData(prev => ({ ...prev, youtube_trailer_key: meta.youtube_trailer_key ?? null }));
      }
      setTmdbFilled(true);
    } catch { setError('Failed to fetch TMDB metadata.'); }
    finally { setTmdbFilling(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });

      // Create thumbnail preview
      if (name === 'thumbnail') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result as string);
        };
        reader.readAsDataURL(files[0]);
      }
    }
    setError('');
  };

  const handleGenreToggle = (genreId: number) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(id => id !== genreId)
        : [...prev.genres, genreId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.thumbnail) {
      setError('Please upload a thumbnail image or pick a movie from TMDB first.');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.video_file && !formData.youtube_trailer_key) {
      setError('Upload a video file or pick a movie with a trailer from TMDB.');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      await videoService.createVideo(formData);
      setSuccess(true);

      // Reset form
      setFormData({
        title: '',
        description: '',
        release_date: '',
        producer: '',
        star_actors: '',
        thumbnail: null,
        video_file: null,
        genres: [],
      });
      setThumbnailPreview('');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="video-upload-container">
      <div className="video-upload-box">
        <div className="upload-header">
          <Upload className="upload-icon" size={40} />
          <h1 className="upload-title">Upload Video</h1>
          <p className="upload-subtitle">Add a new video to the platform</p>
        </div>

        {error && (
          <div className="upload-message upload-message--error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="upload-message upload-message--success">
            <CheckCircle size={18} />
            <span>Video uploaded successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">

          {/* TMDB Auto-fill */}
          <div className="tmdb-search">
            <label className="form-label">
              <Search size={16} />
              Auto-fill from TMDB
            </label>
            <div className="tmdb-search__input-wrap">
              <input
                type="text"
                value={tmdbQuery}
                onChange={e => handleTmdbSearch(e.target.value)}
                className="form-input"
                placeholder="Search a movie title to auto-fill metadata…"
              />
              {tmdbSearching && <Loader size={16} className="tmdb-search__spinner" />}
              {tmdbFilled && !tmdbSearching && (
                <span className="tmdb-search__filled">
                  <CheckCircle size={14} /> Filled
                </span>
              )}
              {tmdbQuery && (
                <button type="button" className="tmdb-search__clear" onClick={() => { setTmdbQuery(''); setTmdbResults([]); setTmdbFilled(false); }}>
                  <X size={14} />
                </button>
              )}
            </div>
            {tmdbFilling && <p className="tmdb-search__status">Fetching metadata…</p>}
            {tmdbResults.length > 0 && (
              <ul className="tmdb-search__results">
                {tmdbResults.map(r => (
                  <li key={r.tmdb_id} className="tmdb-search__result" onClick={() => handleTmdbPick(r)}>
                    {r.poster_url && <img src={r.poster_url} alt={r.title} className="tmdb-search__poster" />}
                    <div className="tmdb-search__result-info">
                      <span className="tmdb-search__result-title">{r.title}</span>
                      <span className="tmdb-search__result-year">{r.release_date?.slice(0, 4)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                <Film size={16} />
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter video title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="release_date" className="form-label">
                <Calendar size={16} />
                Release Date *
              </label>
              <input
                type="date"
                id="release_date"
                name="release_date"
                value={formData.release_date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              <FileText size={16} />
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Enter video description"
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="producer" className="form-label">
                <UserIcon size={16} />
                Producer *
              </label>
              <input
                type="text"
                id="producer"
                name="producer"
                value={formData.producer}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter producer name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="star_actors" className="form-label">
                <Star size={16} />
                Star Actors *
              </label>
              <input
                type="text"
                id="star_actors"
                name="star_actors"
                value={formData.star_actors}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter actor names (comma separated)"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Film size={16} />
              Genres
            </label>
            <div className="genre-grid">
              {genres.map(genre => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => handleGenreToggle(genre.id)}
                  className={`genre-button ${formData.genres.includes(genre.id) ? 'selected' : ''}`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="thumbnail" className="form-label">
                <Image size={16} />
                Thumbnail Image
              </label>
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                onChange={handleFileChange}
                className="form-input-file"
                accept="image/*"
              />
              {thumbnailPreview && (
                <div className="thumbnail-preview">
                  <img src={thumbnailPreview} alt="Thumbnail preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="video_file" className="form-label">
                <VideoIcon size={16} />
                Video File
              </label>
              <input
                type="file"
                id="video_file"
                name="video_file"
                onChange={handleFileChange}
                className="form-input-file"
                accept="video/*"
              />
              {formData.youtube_trailer_key && !formData.video_file && (
                <div className="file-info" style={{ borderColor: 'rgba(233,69,96,0.3)', color: '#e94560' }}>
                  <p>YouTube trailer will be used as fallback — no file needed.</p>
                </div>
              )}
              {formData.video_file && (
                <div className="file-info">
                  <p>Selected: {formData.video_file.name}</p>
                  <p>Size: {(formData.video_file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="upload-submit"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoUpload;
