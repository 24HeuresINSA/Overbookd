export type UserAccess = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshAccessRequest = {
  refreshToken: string;
};
