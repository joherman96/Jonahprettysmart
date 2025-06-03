import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import useAuthStore from '../../store/authStore';

interface LocationState {
  userId: string;
  email: string;
}

const PasscodePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserPasscode, isLoading } = useAuthStore();
  
  // Get state from location
  const state = location.state as LocationState;
  const userId = state?.userId;
  const email = state?.email;
  
  // State for PIN digits and biometrics
  const [pinDigits, setPinDigits] = useState<string[]>(Array(6).fill(''));
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Refs for input elements
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Check if biometrics are available
  useEffect(() => {
    const checkBiometricSupport = async () => {
      try {
        if (window.PublicKeyCredential && 
            PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricsAvailable(available);
        }
      } catch (error) {
        console.error('Error checking biometric support:', error);
        setBiometricsAvailable(false);
      }
    };
    
    checkBiometricSupport();
  }, []);
  
  // Redirect if userId or email is missing
  useEffect(() => {
    if (!userId || !email) {
      navigate('/auth/signin', { replace: true });
    }
  }, [userId, email, navigate]);
  
  const handleDigitChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }
    
    const newPinDigits = [...pinDigits];
    newPinDigits[index] = value;
    setPinDigits(newPinDigits);
    
    // Move focus to next input if we have a value
    if (value && index < 5 && digitRefs.current[index + 1]) {
      digitRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !pinDigits[index]) {
      // Move focus to previous input on backspace if current is empty
      if (index > 0 && digitRefs.current[index - 1]) {
        digitRefs.current[index - 1]?.focus();
      }
    }
  };
  
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').trim();
    
    // Only proceed if we have 6 digits
    if (!/^\d{6}$/.test(pastedData)) {
      return;
    }
    
    const digits = pastedData.split('');
    setPinDigits(digits);
    
    // Focus the last input
    digitRefs.current[5]?.focus();
  };
  
  const registerBiometricCredential = async () => {
    try {
      setIsRegistering(true);
      
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32),
        rp: {
          name: 'RoomieMatch',
          id: window.location.hostname,
        },
        user: {
          id: new Uint8Array(16),
          name: email,
          displayName: email,
        },
        pubKeyCredParams: [{
          type: 'public-key',
          alg: -7, // ES256
        }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
      };
      
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });
      
      if (!credential) {
        throw new Error('Failed to create credential');
      }
      
      // In a real app, we would send this credential to the server
      console.log('Biometric credential created:', credential);
      
      return true;
    } catch (error) {
      console.error('Error registering biometric credential:', error);
      toast.error('Failed to register biometric authentication');
      return false;
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passcode = pinDigits.join('');
    if (passcode.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }
    
    try {
      // If biometrics are enabled, register them first
      if (useBiometrics) {
        const success = await registerBiometricCredential();
        if (!success) {
          return;
        }
      }
      
      // Set the passcode
      await setUserPasscode({
        userId,
        passcode,
        enableBiometrics: useBiometrics,
      });
      
      toast.success('Passcode set successfully');
      navigate('/welcome');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to set passcode');
    }
  };
  
  const allDigitsEntered = pinDigits.every(digit => digit !== '');
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Create a 6-Digit Passcode
        </h2>
        <p className="text-sm text-gray-600">
          Choose a secure code only you will remember.
        </p>
      </div>
      
      <div className="flex justify-between gap-2 mb-6">
        {pinDigits.map((digit, index) => (
          <input
            key={index}
            ref={el => digitRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleDigitChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-11 h-11 border rounded-lg text-center text-lg font-medium
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     transition-colors duration-200"
            aria-label={`Digit ${index + 1} of 6`}
          />
        ))}
      </div>
      
      <div>
        <Toggle
          id="biometrics"
          label="Enable device biometrics"
          checked={useBiometrics}
          onChange={setUseBiometrics}
          description={
            biometricsAvailable
              ? "Use Face ID, Touch ID, or Windows Hello to sign in"
              : "Biometrics not available on this device"
          }
        />
      </div>
      
      <div className="pt-2">
        <Button
          type="submit"
          disabled={!allDigitsEntered || isLoading || isRegistering}
          isLoading={isLoading || isRegistering}
        >
          Continue
        </Button>
      </div>
    </form>
  );
};

export default PasscodePage;