export interface TokenProps {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfileProps {
  id: string; 
  email: string;
  phoneNumber: string;
  address: string;
  fullName: string; 
  isEmailVerified?: boolean;
  
}

export interface GuestUserProfileProps {
  id: string; 
  email: string;
  phoneNumber: string;
  address: string;
  fullName: string; 
  token: TokenProps;
}
