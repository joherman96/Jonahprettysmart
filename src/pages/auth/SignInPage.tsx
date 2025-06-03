import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/authStore';
import { validateAllowedDomain } from '../../services/auth.service';

const signInSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .refine(email => validateAllowedDomain(email), {
      message: 'Only gmail.com and .edu email addresses are allowed'
    }),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
});

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { signInUser, sendVerification, autoVerifyUserEmail, isLoading } = useAuthStore();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  
  const validateForm = (): boolean => {
    try {
      signInSchema.parse(credentials);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Sign in or sign up the user
      const { userId, email } = await signInUser(credentials);
      
      // Check if we should skip email verification
      if (import.meta.env.VITE_SKIP_EMAIL_VERIFICATION === 'true') {
        try {
          await autoVerifyUserEmail(userId);
          toast.success('Email auto-verified for development');
          navigate('/auth/passcode', { state: { userId, email } });
          return;
        } catch (error) {
          toast.error('Failed to auto-verify email');
          console.error('Auto-verification error:', error);
          return;
        }
      }
      
      // Send verification email for production flow
      try {
        await sendVerification(userId, email);
        toast.success('Verification code sent to your email');
        toast.success('DEBUG: Check console – verification code was generated', {
          duration: 10000
        });
      } catch (error) {
        toast.error('DEBUG: sendVerification error – check console for details');
        console.error('Verification email error:', error);
        return;
      }
      
      // Navigate to verification page
      navigate('/auth/verify', { 
        state: { userId, email } 
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };
  
  const isFormValid = credentials.email && credentials.password && credentials.password.length >= 8;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Sign in or sign up</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter your details to continue
        </p>
      </div>
      
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        value={credentials.email}
        onChange={handleChange}
        placeholder="you@example.com"
        required
        error={errors.email}
        autoFocus
      />
      
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Minimum 8 characters"
        required
        error={errors.password}
      />
      
      <div className="pt-2">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!isFormValid}
        >
          Continue
        </Button>
      </div>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
};

export default SignInPage