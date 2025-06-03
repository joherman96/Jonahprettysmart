import React from 'react';

interface ToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  id,
  label,
  checked,
  onChange,
  description,
}) => {
  return (
    <div className="flex items-start mb-4">
      <div className="flex items-center h-5">
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`
            relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent 
            rounded-full cursor-pointer transition-colors ease-in-out duration-200 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
            ${checked ? 'bg-primary-600' : 'bg-gray-200'}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow 
              transform ring-0 transition ease-in-out duration-200
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700">
          {label}
        </label>
        {description && (
          <p className="text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default Toggle;