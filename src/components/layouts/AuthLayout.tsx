import { Outlet } from 'react-router-dom';
import { Users } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-auth bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 bg-primary-50 rounded-full flex items-center justify-center mb-4">
            <Users size={28} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">RoomieMatch</h1>
          <p className="text-sm text-gray-500 mt-1">Find your perfect roommate</p>
        </div>
        
        <Outlet />
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
            Built with Bolt.new
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;