export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  access_token: string;
}

export interface UpdateUserDto {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

