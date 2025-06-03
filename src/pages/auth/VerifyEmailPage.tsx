import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CodeInput from '../../components/ui/CodeInput';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/authStore';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyUserEmail, sendVerification, isLoading } = useAuthStore();
  
  const skipVerification = import.meta.env.VITE_SKIP_EMAIL_VERIFICATION === "true";
  if (skipVerification) {
    const { userId, email } = location.state as { userId: string; email: string };
    navigate("/auth/passcode", { state: { userId, email } });
    return null;
  }
  
  const [code, setCode] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState<string | null>(null);
  
  // Get userId and email from location state
  const userId = location.state?.userId;
  const email = location.state?.email;
  
  // Check if we should skip verification
  useEffect(() => {
    if (import.meta.env.VITE_SKIP_EMAIL_VERIFICATION === 'true') {
      navigate('/auth/passcode', { 
        state: { userId, email },
        replace: true
      });
      return;
    }
    
    // Redirect if userId or email is missing
    if (!userId || !email) {
      navigate('/auth/signin', { replace: true });
    }
  }, [userId, email, navigate]);
  
  // Handle countdown for resend button
  useEffect(() => {
    if (!resendDisabled) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [resendDisabled]);
  
  const handleResendCode = async () => {
    if (resendDisabled) return;
    
    try {
      await sendVerification(userId, email);
      toast.success('New verification code sent');
      setResendDisabled(true);
      setCountdown(30);
    } catch (error) {
      toast.error('Failed to resend code');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    
    try {
      await verifyUserEmail({ userId, code });
      toast.success('Email verified successfully');
      navigate('/auth/passcode', { state: { userId } });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid verification code');
      toast.error(error instanceof Error ? error.message : 'Invalid verification code');
    }
  };
  
  // If verification is being skipped, don't render the form
  if (import.meta.env.VITE_SKIP_EMAIL_VERIFICATION === 'true') {
    return null;
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Verify your email</h2>
        <p className="text-sm text-gray-600 mt-1">
          We've sent a 6-digit code to <span className="font-medium">{email}</span>
        </p>
      </div>
      
      <CodeInput
        length={6}
        onChange={setCode}
        autoFocus
        error={error || undefined}
        label="Enter verification code"
      />
      
      <div className="pt-2">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={code.length !== 6}
        >
          Verify Email
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <button
          type="button"
          className={`text-sm text-primary-600 hover:text-primary-700 focus:outline-none ${
            resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleResendCode}
          disabled={resendDisabled}
        >
          {resendDisabled 
            ? `Resend code in ${countdown}s` 
            : 'Resend code'}
        </button>
      </div>
    </form>
  );
};

export default VerifyEmailPage;