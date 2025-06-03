// User types
export interface User {
  id: string;
  email: string;
  email_verified: Date | null;
  created_at: Date;
  updated_at: Date;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface VerificationData {
  userId: string;
  email: string;
}

export interface VerificationCodeData {
  userId: string;
  code: string;
}

export interface PasscodeData {
  userId: string;
  passcode: string;
  enableBiometrics: boolean;
}