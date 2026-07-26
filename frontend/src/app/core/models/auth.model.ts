export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  expiresIn: number;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
