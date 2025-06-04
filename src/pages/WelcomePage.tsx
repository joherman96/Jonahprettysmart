import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut } from 'lucide-react';
import Button from '../components/ui/Button';
import useAuthStore from '../store/authStore';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    navigate('/auth/signin');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">RoomieMatch</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <LogOut size={16} className="mr-1" />
              Sign out
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="h-16 w-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={32} className="text-primary-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RoomieMatch!</h1>
          <p className="text-gray-600 mb-6">
            You've successfully authenticated. This is just a placeholder page - the real roommate matching features will be built in the next phase.
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Next steps will include:
            </p>
            <ul className="text-sm text-gray-600 text-left list-disc ml-5 space-y-1">
              <li>Building your roommate profile</li>
              <li>Setting your preferences</li>
              <li>Finding your perfect roommate match</li>
            </ul>
          </div>
          
          <div className="mt-8">
            <Button onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;