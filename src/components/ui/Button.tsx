import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  onClick,
  isLoading = false,
}) => {
  const baseClasses = "w-full h-11 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out shadow-sm flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary: "bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-400",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-primary-500",
  };
  
  const loadingClasses = isLoading ? "opacity-80 cursor-not-allowed" : "";
  const disabledClasses = disabled && !isLoading ? "opacity-50 cursor-not-allowed bg-gray-300 hover:bg-gray-300 text-gray-500" : "";
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${loadingClasses} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
            <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;