export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  mfaRequired?: boolean;
  email?: string;
}
