import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { saveBasicDetails } from '../../services/profile.service';

const SAMPLE_MAJORS = [
  'Computer Science',
  'Economics',
  'Biology',
  'History',
  'Psychology'
];

interface LocationState {
  userId: string;
}

const BasicDetailsCard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get userId from location state
  const userId = (location.state as LocationState)?.userId;
  
  // Redirect if userId is missing
  useEffect(() => {
    if (!userId) {
      navigate('/welcome');
    }
  }, [userId, navigate]);
  
  // Form state
  const [preferredName, setPreferredName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [otherPronouns, setOtherPronouns] = useState('');
  const [yearInSchool, setYearInSchool] = useState('');
  const [major, setMajor] = useState('');
  const [majorSuggestions, setMajorSuggestions] = useState<string[]>([]);
  const [minor, setMinor] = useState<string | null>(null);
  const [minorSuggestions, setMinorSuggestions] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [showCropUI, setShowCropUI] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form errors
  const [errors, setErrors] = useState<{
    preferredName?: string;
    pronouns?: string;
    otherPronouns?: string;
    yearInSchool?: string;
    major?: string;
    photo?: string;
  }>({});
  
  const handlePreferredNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferredName(e.target.value);
    if (errors.preferredName) {
      setErrors(prev => ({ ...prev, preferredName: undefined }));
    }
  };
  
  const handlePronounsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPronouns(value);
    if (value !== 'Other…') {
      setOtherPronouns('');
    }
    if (errors.pronouns) {
      setErrors(prev => ({ ...prev, pronouns: undefined }));
    }
  };
  
  const handleOtherPronounsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherPronouns(e.target.value);
    if (errors.otherPronouns) {
      setErrors(prev => ({ ...prev, otherPronouns: undefined }));
    }
  };
  
  const handleYearInSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYearInSchool(e.target.value);
    if (errors.yearInSchool) {
      setErrors(prev => ({ ...prev, yearInSchool: undefined }));
    }
  };
  
  const handleMajorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMajor(value);
    
    // Update suggestions
    if (value) {
      const suggestions = SAMPLE_MAJORS.filter(m => 
        m.toLowerCase().startsWith(value.toLowerCase())
      );
      setMajorSuggestions(suggestions);
    } else {
      setMajorSuggestions([]);
    }
    
    if (errors.major) {
      setErrors(prev => ({ ...prev, major: undefined }));
    }
  };
  
  const handleMinorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinor(value || null);
    
    // Update suggestions
    if (value) {
      const suggestions = SAMPLE_MAJORS.filter(m => 
        m.toLowerCase().startsWith(value.toLowerCase())
      );
      setMinorSuggestions(suggestions);
    } else {
      setMinorSuggestions([]);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'Please select a valid image file' }));
      return;
    }
    
    setPhotoFile(file);
    setShowCropUI(true);
    if (errors.photo) {
      setErrors(prev => ({ ...prev, photo: undefined }));
    }
  };
  
  const handleCropAndSave = async () => {
    if (!photoFile || !cropCanvasRef.current) return;
    
    try {
      const canvas = cropCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Apply brightness
      ctx.filter = `brightness(${brightness}%)`;
      
      // In a real app, we would:
      // 1. Create an off-screen canvas for cropping
      // 2. Draw the image with proper cropping
      // 3. Convert to blob and upload
      
      // For now, simulate upload
      setPhotoUrl('https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg');
      setShowCropUI(false);
      
    } catch (error) {
      toast.error('Failed to process image');
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!preferredName.trim()) {
      newErrors.preferredName = 'Required';
    }
    
    if (!pronouns) {
      newErrors.pronouns = 'Required';
    } else if (pronouns === 'Other…' && !otherPronouns.trim()) {
      newErrors.otherPronouns = 'Required';
    }
    
    if (!yearInSchool) {
      newErrors.yearInSchool = 'Required';
    }
    
    if (!major.trim()) {
      newErrors.major = 'Required';
    }
    
    if (!photoUrl) {
      newErrors.photo = 'Please upload a photo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      await saveBasicDetails(userId, {
        preferredName,
        pronouns: pronouns === 'Other…' ? otherPronouns : pronouns,
        otherPronouns: pronouns === 'Other…' ? otherPronouns : undefined,
        yearInSchool,
        major,
        minor,
        photoUrl
      });
      
      toast.success('Profile details saved');
      navigate('/profile/lifestyle-quiz', { state: { userId } });
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save profile details');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!userId) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-lg">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/welcome')}
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Back to welcome page"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 ml-2">Basic Details</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Preferred Name */}
            <div>
              <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Name <span className="text-red-500">*</span>
              </label>
              <input
                id="preferredName"
                type="text"
                value={preferredName}
                onChange={handlePreferredNameChange}
                className={`w-full h-11 px-4 rounded-lg border ${
                  errors.preferredName ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                placeholder="e.g., Alex"
                aria-required="true"
                aria-invalid={!!errors.preferredName}
              />
              {errors.preferredName && (
                <p className="mt-1 text-sm text-red-500">{errors.preferredName}</p>
              )}
            </div>
            
            {/* Pronouns */}
            <div>
              <label htmlFor="pronouns" className="block text-sm font-medium text-gray-700 mb-1">
                Pronouns <span className="text-red-500">*</span>
              </label>
              <select
                id="pronouns"
                value={pronouns}
                onChange={handlePronounsChange}
                className={`w-full h-11 px-4 rounded-lg border ${
                  errors.pronouns ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                aria-required="true"
                aria-invalid={!!errors.pronouns}
              >
                <option value="">Select pronouns</option>
                <option value="She/Her">She/Her</option>
                <option value="He/Him">He/Him</option>
                <option value="They/Them">They/Them</option>
                <option value="Other…">Other…</option>
              </select>
              {errors.pronouns && (
                <p className="mt-1 text-sm text-red-500">{errors.pronouns}</p>
              )}
              
              {pronouns === 'Other…' && (
                <div className="mt-2">
                  <input
                    id="otherPronouns"
                    type="text"
                    value={otherPronouns}
                    onChange={handleOtherPronounsChange}
                    className={`w-full h-11 px-4 rounded-lg border ${
                      errors.otherPronouns ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="e.g., Ze/Zir"
                    aria-required="true"
                    aria-invalid={!!errors.otherPronouns}
                  />
                  {errors.otherPronouns && (
                    <p className="mt-1 text-sm text-red-500">{errors.otherPronouns}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Year in School */}
            <div>
              <label htmlFor="yearInSchool" className="block text-sm font-medium text-gray-700 mb-1">
                Year in School <span className="text-red-500">*</span>
              </label>
              <select
                id="yearInSchool"
                value={yearInSchool}
                onChange={handleYearInSchoolChange}
                className={`w-full h-11 px-4 rounded-lg border ${
                  errors.yearInSchool ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                aria-required="true"
                aria-invalid={!!errors.yearInSchool}
              >
                <option value="">Select your year</option>
                <option value="First">First Year</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
              {errors.yearInSchool && (
                <p className="mt-1 text-sm text-red-500">{errors.yearInSchool}</p>
              )}
            </div>
            
            {/* Major */}
            <div>
              <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                Major <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="major"
                  type="text"
                  value={major}
                  onChange={handleMajorInputChange}
                  className={`w-full h-11 px-4 rounded-lg border ${
                    errors.major ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="Start typing your major…"
                  aria-required="true"
                  aria-invalid={!!errors.major}
                />
                {majorSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {majorSuggestions.map((suggestion, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => {
                            setMajor(suggestion);
                            setMajorSuggestions([]);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          {suggestion}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.major && (
                <p className="mt-1 text-sm text-red-500">{errors.major}</p>
              )}
            </div>
            
            {/* Minor */}
            <div>
              <label htmlFor="minor" className="block text-sm font-medium text-gray-700 mb-1">
                Minor (optional)
              </label>
              <div className="relative">
                <input
                  id="minor"
                  type="text"
                  value={minor || ''}
                  onChange={handleMinorInputChange}
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Start typing your minor…"
                />
                {minorSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {minorSuggestions.map((suggestion, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => {
                            setMinor(suggestion);
                            setMinorSuggestions([]);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          {suggestion}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo <span className="text-red-500">*</span>
              </label>
              
              <div className="flex flex-col items-center space-y-4">
                {photoUrl ? (
                  <div className="relative">
                    <img
                      src={photoUrl}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover"
                      style={{ filter: `brightness(${brightness}%)` }}
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center"
                    aria-label="No photo selected"
                  >
                    <span className="text-gray-400">No photo</span>
                  </div>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Photo
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Upload profile photo"
                />
              </div>
              
              {errors.photo && (
                <p className="mt-1 text-sm text-red-500 text-center">{errors.photo}</p>
              )}
            </div>
            
            {/* Photo Cropping UI */}
            {showCropUI && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4">Adjust Photo</h3>
                  
                  <canvas
                    ref={cropCanvasRef}
                    width="400"
                    height="400"
                    className="w-full aspect-square mb-4 border rounded"
                  />
                  
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">
                      Brightness
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCropUI(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCropAndSave}
                    >
                      Save Photo
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsCard;