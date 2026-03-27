import api from './api';
import type { Video, VideoFormData, Genre } from '../interfaces/video.interface';

export const videoService = {
  // Get all videos
  getVideos: async (): Promise<Video[]> => {
    const response = await api.get<Video[]>('/videos/');
    return response.data;
  },

  // Get single video by ID
  getVideo: async (id: number): Promise<Video> => {
    const response = await api.get<Video>(`/videos/${id}/`);
    return response.data;
  },

  // Create new video (admin only)
  createVideo: async (data: VideoFormData): Promise<Video> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('release_date', data.release_date);
    formData.append('producer', data.producer);
    formData.append('star_actors', data.star_actors);

    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }
    if (data.video_file) {
      formData.append('video_file', data.video_file);
    }
    if (data.youtube_trailer_key) {
      formData.append('youtube_trailer_key', data.youtube_trailer_key);
    }

    // Add genres
    data.genres.forEach(genreId => {
      formData.append('genres', genreId.toString());
    });

    const response = await api.post<Video>('/videos/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update video (admin only)
  updateVideo: async (id: number, data: Partial<VideoFormData>): Promise<Video> => {
    const formData = new FormData();

    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.release_date) formData.append('release_date', data.release_date);
    if (data.producer) formData.append('producer', data.producer);
    if (data.star_actors) formData.append('star_actors', data.star_actors);
    if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
    if (data.video_file) formData.append('video_file', data.video_file);
    if (data.genres) {
      data.genres.forEach(genreId => {
        formData.append('genres', genreId.toString());
      });
    }

    const response = await api.patch<Video>(`/videos/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete video (admin only)
  deleteVideo: async (id: number): Promise<void> => {
    await api.delete(`/videos/${id}/`);
  },

  // Toggle like on video
  toggleLike: async (id: number): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/videos/${id}/toggle_like/`);
    return response.data;
  },

  // Toggle favorite on video
  toggleFavorite: async (id: number): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/videos/${id}/toggle_favorite/`);
    return response.data;
  },

  // Rate video (1-5)
  rateVideo: async (id: number, rating: number): Promise<{ message: string; rating: number }> => {
    const response = await api.post<{ message: string; rating: number }>(`/videos/${id}/rate/`, { rating });
    return response.data;
  },

  // Get user's favorite videos
  getFavorites: async (): Promise<Video[]> => {
    const response = await api.get<Video[]>('/videos/my_favorites/');
    return response.data;
  },

  // Get all genres
  getGenres: async (): Promise<Genre[]> => {
    const response = await api.get<Genre[]>('/genres/');
    return response.data;
  },
};
