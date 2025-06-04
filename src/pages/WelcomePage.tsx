import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasStarted = localStorage.getItem('hasStartedProfile') === 'true';
  const userId = location.state?.userId;
  
  const handleStart = () => {
    localStorage.setItem('hasStartedProfile', 'true');
    if (!userId) {
      navigate('/welcome');
      return;
    }
    navigate('/profile/lifestyle-quiz', { state: { userId } });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Button
        onClick={handleStart}
        aria-label={hasStarted ? 'Continue Creating' : 'Start Creating Account'}
      >
        {hasStarted ? 'Continue Creating' : 'Start Creating Account'}
      </Button>
    </div>
  );
};

export default WelcomePage;