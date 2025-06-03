import { SignInCredentials, VerificationCodeData, PasscodeData } from '../types';
import { sha256Hash } from '../utils/crypto';

// This would be replaced with actual API calls in a production environment
const MOCK_DELAY = 1000;

// Mock user storage
let mockUsers: any[] = [];
let mockVerificationTokens: any[] = [];

export const validateAllowedDomain = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@(gmail\.com|[A-Z0-9.-]+\.edu)$/i;
  return emailRegex.test(email);
};

export const signIn = async (credentials: SignInCredentials): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  if (!validateAllowedDomain(credentials.email)) {
    throw new Error('Invalid email domain. Only gmail.com and .edu domains are allowed.');
  }
  
  // Check if user exists
  const existingUser = mockUsers.find(user => user.email === credentials.email);
  
  if (existingUser) {
    // This would be a proper password check in production
    return { userId: existingUser.id, email: existingUser.email };
  } else {
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      password_hash: 'mocked-password-hash', // Would be properly hashed in production
      email_verified: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    mockUsers.push(newUser);
    return { userId: newUser.id, email: newUser.email };
  }
};

export const autoVerifyEmail = async (userId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  const user = mockUsers.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Set email as verified
  user.email_verified = new Date();
  
  // Clean up any existing verification tokens
  mockVerificationTokens = mockVerificationTokens.filter(token => token.user_id !== userId);
};

export const sendVerificationEmail = async (userId: string, email: string): Promise<void> => {
  console.log(`DEBUG: Processing verification request for userId: ${userId}, email: ${email}`);
  
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`DEBUG: Verification code for ${email}: ${code}`);
  
  // Hash the code (would use proper secure hashing in production)
  const codeHash = await sha256Hash(code);
  
  // Store verification token
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minute expiry
  console.log(`DEBUG: Token will expire at ${expiresAt.toISOString()}`);
  
  // Remove any existing tokens for this user
  mockVerificationTokens = mockVerificationTokens.filter(token => token.user_id !== userId);
  
  // Add new token
  mockVerificationTokens.push({
    id: `token-${Date.now()}`,
    user_id: userId,
    token_hash: codeHash,
    token_value: code, // Only for demo purposes! Would never store raw tokens in production
    expires_at: expiresAt,
    created_at: new Date()
  });
  
  // Mock email sending
  try {
    console.log(`DEBUG: Attempting to send verification email to ${email}`);
    
    // Check if we're in test mode
    if (import.meta.env.MODE === 'development' || !import.meta.env.VITE_SMTP_HOST) {
      console.log('DEBUG: Running in TEST MAILER MODE – emails will not actually go out');
      
      // Log any missing SMTP credentials
      ['VITE_SMTP_HOST', 'VITE_SMTP_USER', 'VITE_SMTP_PASS'].forEach(key => {
        if (!import.meta.env[key]) {
          console.log(`DEBUG: SMTP credentials missing – ${key} is undefined`);
        }
      });
    }
    
    // Simulate email send delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`DEBUG: Mailer indicated success for ${email}`);
  } catch (error) {
    console.error(`DEBUG: Mailer error for ${email}:`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

export const verifyEmail = async (data: VerificationCodeData): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  const { userId, code } = data;
  
  // Find the token
  const token = mockVerificationTokens.find(t => t.user_id === userId);
  
  if (!token) {
    throw new Error('Verification code not found');
  }
  
  if (token.expires_at < new Date()) {
    throw new Error('Verification code has expired');
  }
  
  // In production, we would hash the input code and compare hashes
  // For demo, we directly compare with the stored code
  if (token.token_value !== code) {
    throw new Error('Invalid verification code');
  }
  
  // Update user's email_verified status
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    user.email_verified = new Date();
  }
  
  // Remove the used token
  mockVerificationTokens = mockVerificationTokens.filter(t => t.id !== token.id);
  
  return true;
};

export const setPasscode = async (data: PasscodeData): Promise<{ token: string }> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  const { userId, passcode, enableBiometrics } = data;
  
  // Update user's passcode
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    // In production, this would be properly hashed
    user.passcode_hash = `mocked-passcode-hash-for-${passcode}`;
    user.biometrics_enabled = enableBiometrics;
  } else {
    throw new Error('User not found');
  }
  
  // Generate JWT token (mocked)
  return { 
    token: `mocked-jwt-token-for-${userId}` 
  };
};