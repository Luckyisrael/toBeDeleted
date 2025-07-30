import { UserProfileProps } from 'app/types/user-types';
import { GuestUserProfileProps } from 'app/types/user-types';

export type UserStoreProps = {
  user: UserProfileProps | null;
  accessToken: null | string;
  refreshToken: null | string;
  setUser: (user: UserProfileProps | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (refresh_token: string | null) => void;
};

export type GuestUserStoreProps = {
  user: GuestUserProfileProps | null;
  accessToken: null | string;
  refreshToken: null | string;
  setUser: (user: UserProfileProps | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (refresh_token: string | null) => void;
};
