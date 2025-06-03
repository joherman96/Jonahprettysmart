import { create } from 'zustand';
import { AuthState, SignInCredentials, VerificationCodeData, PasscodeData } from '../types';
import { signIn, sendVerificationEmail, verifyEmail, setPasscode, autoVerifyEmail } from '../services/auth.service';

interface AuthStore extends AuthState {
  // Auth methods
  signInUser: (credentials: SignInCredentials) => Promise<any>;
  sendVerification: (userId: string, email: string) => Promise<void>;
  verifyUserEmail: (data: VerificationCodeData) => Promise<boolean>;
  setUserPasscode: (data: PasscodeData) => Promise<{ token: string }>;
  autoVerifyUserEmail: (userId: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // Sign in or sign up a user
  signInUser: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const result = await signIn(credentials);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to sign in' 
      });
      throw error;
    }
  },
  
  // Auto verify email (for development)
  autoVerifyUserEmail: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await autoVerifyEmail(userId);
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to auto-verify email'
      });
      throw error;
    }
  },
  
  // Send verification email
  sendVerification: async (userId, email) => {
    set({ isLoading: true, error: null });
    try {
      await sendVerificationEmail(userId, email);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to send verification email' 
      });
      throw error;
    }
  },
  
  // Verify email with code
  verifyUserEmail: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const result = await verifyEmail(data);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to verify email' 
      });
      throw error;
    }
  },
  
  // Set user passcode and complete authentication
  setUserPasscode: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = await setPasscode(data);
      
      // Store the token (in a real app, store in secure storage)
      localStorage.setItem('auth_token', token);
      
      // Update auth state
      set({ 
        isAuthenticated: true,
        isLoading: false,
      });
      
      return { token };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to set passcode' 
      });
      throw error;
    }
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },
}));

export default useAuthStore