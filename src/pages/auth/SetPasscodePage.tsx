import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CodeInput from '../../components/ui/CodeInput';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import useAuthStore from '../../store/authStore';

const SetPasscodePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserPasscode, isLoading } = useAuthStore();
  
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [enableBiometrics, setEnableBiometrics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  
  // Check if biometrics are available
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  
  // Get userId from location state
  const userId = location.state?.userId;
  
  // Redirect if userId is missing
  useEffect(() => {
    if (!userId) {
      navigate('/auth/signin', { replace: true });
    }
  }, [userId, navigate]);
  
  // Check if biometrics are available
  useEffect(() => {
    // This is a mock check - in a real app, we would use the Web Authentication API
    const checkBiometrics = async () => {
      try {
        // Mock detection - in reality, we would check for PublicKeyCredential
        // if (window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        //   const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        //   setBiometricsAvailable(available);
        // }
        
        // For demo, we'll assume it's available on modern browsers
        setBiometricsAvailable(true);
      } catch (error) {
        setBiometricsAvailable(false);
      }
    };
    
    checkBiometrics();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passcode
    if (passcode.length !== 6) {
      setError('Passcode must be 6 digits');
      return;
    }
    
    // Validate confirmation
    if (passcode !== confirmPasscode) {
      setConfirmError('Passcodes do not match');
      return;
    }
    
    try {
      await setUserPasscode({
        userId,
        passcode,
        enableBiometrics,
      });
      
      toast.success('Passcode set successfully');
      navigate('/welcome');
    } catch (error) {
      toast.error('Failed to set passcode');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Set a passcode</h2>
        <p className="text-sm text-gray-600 mt-1">
          Create a 6-digit passcode to secure your account
        </p>
      </div>
      
      <CodeInput
        length={6}
        onChange={setPasscode}
        autoFocus
        error={error || undefined}
        label="Enter 6-digit passcode"
      />
      
      <CodeInput
        length={6}
        onChange={setConfirmPasscode}
        error={confirmError || undefined}
        label="Confirm passcode"
      />
      
      {biometricsAvailable && (
        <div className="mt-4">
          <Toggle
            id="biometrics"
            label="Enable biometric authentication"
            checked={enableBiometrics}
            onChange={setEnableBiometrics}
            description="Use Face ID, Touch ID, or Windows Hello to sign in"
          />
        </div>
      )}
      
      <div className="pt-2">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={passcode.length !== 6 || confirmPasscode.length !== 6}
        >
          Complete Setup
        </Button>
      </div>
    </form>
  );
};

export default SetPasscodePage;