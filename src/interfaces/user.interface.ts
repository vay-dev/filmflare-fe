export interface User {
  id: number;
  username: string;
  email: string;
  roles: 'admin' | 'user';
  profile_image: string | null;
  bio?: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_image?: File;
}

export interface UserUpdateData {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_image?: File;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}
