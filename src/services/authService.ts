import api from './api';
import type { AuthResponse, LoginCredentials, RegisterData, User, UserUpdateData, ChangePasswordData } from '../interfaces/user.interface';

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);

    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.bio) formData.append('bio', data.bio);
    if (data.profile_image) formData.append('profile_image', data.profile_image);

    const response = await api.post<AuthResponse>('/auth/register/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.roles === 'admin';
  },

  // Update user profile
  updateProfile: async (data: UserUpdateData): Promise<User> => {
    const formData = new FormData();

    if (data.username) formData.append('username', data.username);
    if (data.email) formData.append('email', data.email);
    if (data.first_name !== undefined) formData.append('first_name', data.first_name);
    if (data.last_name !== undefined) formData.append('last_name', data.last_name);
    if (data.bio !== undefined) formData.append('bio', data.bio);

    // Only append profile_image if a new file is selected
    if (data.profile_image) {
      formData.append('profile_image', data.profile_image);
    }

    const response = await api.put<User>('/auth/update-profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Update localStorage with new user data
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<{ detail: string }> => {
    const response = await api.post<{ detail: string }>('/auth/change-password/', data);
    return response.data;
  },
};
