import { apiClient } from './client';
import type {
  LoginResponse,
  User,
  UpdateUserDto,
} from '../types/auth.types';

export const authApi = {
  register: async (
    email: string,
    password: string,
  ): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/register', {
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refresh: async (): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/refresh');
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  updateMe: async (data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.put<User>('/auth/me', data);
    return response.data;
  },
};

