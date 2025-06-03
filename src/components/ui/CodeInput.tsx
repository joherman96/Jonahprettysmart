import React, { useRef, useState, useEffect } from 'react';

interface CodeInputProps {
  length: number;
  onChange: (code: string) => void;
  autoFocus?: boolean;
  label?: string;
  error?: string;
}

const CodeInput: React.FC<CodeInputProps> = ({
  length,
  onChange,
  autoFocus = false,
  label,
  error,
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto-focus first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Only accept one digit
    if (value.length > 1) {
      return;
    }
    
    // Only accept digits
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    // Update the code array
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Notify parent of change
    onChange(newCode.join(''));

    // Auto-advance to next input if we have a value
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0 && inputRefs.current[index - 1]) {
        // If current input is empty, focus the previous input
        inputRefs.current[index - 1].focus();
      } else {
        // Clear current input
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
        onChange(newCode.join(''));
      }
    }
    
    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
    
    // Handle right arrow
    if (e.key === 'ArrowRight' && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only accept digits
    if (!/^\d+$/.test(pastedData)) {
      return;
    }
    
    // Fill as many inputs as we can with the pasted data
    const pastedChars = pastedData.slice(0, length).split('');
    const newCode = [...code];
    
    pastedChars.forEach((char, index) => {
      if (index < length) {
        newCode[index] = char;
      }
    });
    
    setCode(newCode);
    onChange(newCode.join(''));
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex(c => c === '');
    if (nextEmptyIndex !== -1 && inputRefs.current[nextEmptyIndex]) {
      inputRefs.current[nextEmptyIndex].focus();
    } else if (inputRefs.current[length - 1]) {
      inputRefs.current[length - 1].focus();
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="flex justify-between gap-2">
        {Array.from({ length }).map((_, index) => (
          <div key={index} className="flex-1">
            <input
              ref={el => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={code[index]}
              onChange={e => handleChange(e, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`
                w-full h-12 text-center font-medium text-lg rounded-lg
                border focus:outline-none focus:ring-2 focus:ring-primary-500 
                focus:border-primary-500 transition-colors duration-200
                ${error ? 'border-red-500' : 'border-gray-300'}
              `}
              aria-label={`Verification digit ${index + 1} of ${length}`}
            />
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CodeInput;