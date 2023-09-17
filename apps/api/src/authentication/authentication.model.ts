export interface UserAccess {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshAccessRequest {
  refreshToken: string;
}
