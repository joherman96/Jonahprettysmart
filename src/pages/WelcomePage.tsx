import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const hasStarted = localStorage.getItem('hasStartedProfile') === 'true';
  
  const handleStart = () => {
    localStorage.setItem('hasStartedProfile', 'true');
    navigate('/blank');
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