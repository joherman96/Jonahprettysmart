import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';

const SAMPLE_MAJORS = [
  'Computer Science',
  'Economics',
  'Biology',
  'History',
  'Psychology'
];

interface FormData {
  preferredName: string;
  pronouns: string;
  customPronouns: string;
  yearInSchool: string;
  major: string;
  minor: string | null;
  photoUrl: string;
  photoBrightness: number;
}

interface FormErrors {
  preferredName?: string;
  pronouns?: string;
  customPronouns?: string;
  yearInSchool?: string;
  major?: string;
  photo?: string;
}

const BasicDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    preferredName: '',
    pronouns: '',
    customPronouns: '',
    yearInSchool: '',
    major: '',
    minor: null,
    photoUrl: '',
    photoBrightness: 1
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [majorSuggestions, setMajorSuggestions] = useState<string[]>([]);
  const [minorSuggestions, setMinorSuggestions] = useState<string[]>([]);
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.preferredName.trim()) {
      newErrors.preferredName = 'Preferred name is required';
    }
    
    if (!formData.pronouns) {
      newErrors.pronouns = 'Please select your pronouns';
    } else if (formData.pronouns === 'Other' && !formData.customPronouns.trim()) {
      newErrors.customPronouns = 'Please specify your pronouns';
    }
    
    if (!formData.yearInSchool) {
      newErrors.yearInSchool = 'Please select your year in school';
    }
    
    if (!formData.major.trim()) {
      newErrors.major = 'Major is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, photoUrl: previewUrl }));
      
      // TODO: Implement actual photo upload
      // const uploadedUrl = await uploadProfilePhoto(userId, file);
      // setFormData(prev => ({ ...prev, photoUrl: uploadedUrl }));
      
    } catch (error) {
      toast.error('Failed to upload photo');
      console.error('Photo upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // TODO: Implement actual data save
      // await saveBasicDetails(userId, {
      //   ...formData,
      //   pronouns: formData.pronouns === 'Other' ? formData.customPronouns : formData.pronouns
      // });
      
      toast.success('Profile details saved');
      navigate('/profile/lifestyle-quiz');
    } catch (error) {
      toast.error('Failed to save profile details');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMajorSearch = (value: string) => {
    const suggestions = SAMPLE_MAJORS.filter(major =>
      major.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5);
    setMajorSuggestions(suggestions);
  };
  
  const handleMinorSearch = (value: string) => {
    const suggestions = SAMPLE_MAJORS.filter(major =>
      major.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5);
    setMinorSuggestions(suggestions);
  };
  
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
            {/* Profile Photo */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {formData.photoUrl ? (
                  <div className="relative">
                    <img
                      src={formData.photoUrl}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover"
                      style={{ filter: `brightness(${formData.photoBrightness})` }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      aria-label="Remove photo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    aria-label="Upload profile photo"
                  >
                    <Upload size={24} className="text-gray-500" />
                  </button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                aria-label="Upload profile photo"
              />
              
              {formData.photoUrl && (
                <div className="mt-4 w-full">
                  <label className="block text-sm text-gray-600 mb-1">
                    Photo Brightness
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={formData.photoBrightness}
                    onChange={e => setFormData(prev => ({ ...prev, photoBrightness: parseFloat(e.target.value) }))}
                    className="w-full"
                    aria-label="Adjust photo brightness"
                  />
                </div>
              )}
            </div>
            
            {/* Preferred Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.preferredName}
                onChange={e => setFormData(prev => ({ ...prev, preferredName: e.target.value }))}
                className={`w-full h-11 px-4 rounded-lg border ${
                  errors.preferredName ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                placeholder="What should we call you?"
                aria-label="Enter your preferred name"
              />
              {errors.preferredName && (
                <p className="mt-1 text-sm text-red-500">{errors.preferredName}</p>
              )}
            </div>
            
            {/* Pronouns */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pronouns <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.pronouns}
                onChange={e => setFormData(prev => ({ ...prev, pronouns: e.target.value }))}
                className={`w-full h-11 px-4 rounded-lg border ${
                  errors.pronouns ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                aria-label="Select your pronouns"
              >
                <option value="">Select pronouns</option>
                <option value="She/Her">She/Her</option>
                <option value="He/Him">He/Him</option>
                <option value="They/Them">They/Them</option>
                <option value="Other">Other...</option>
              </select>
              {errors.pronouns && (
                <p className="mt-1 text-sm text-red-500">{errors.pronouns}</p>
              )}
              
              {formData.pronouns === 'Other' && (
                <input
                  type="text"
                  value={formData.customPronouns}
                  onChange={e => setFormData(prev => ({ ...prev, customPronouns: e.target.value }))}
                  className={`mt-2 w-full h-11 px-4 rounded-lg border ${
                    errors.customPronouns ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="Enter your pronouns"
                  aria-label="Enter custom pronouns"
                />
              )}
              {errors.customPronouns && (
                <p className="mt-1 text-sm text-red-500">{errors.customPronouns}</p>
              )}
            </div>
            
            {/* Year in School */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year in School <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.yearInSchool}
                onChange={e => setFormData(prev => ({ ...prev, yearInSchool: e.target.value }))}
                className={`w-full h-11 px-4 rounded-lg border ${
                  errors.yearInSchool ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                aria-label="Select your year in school"
              >
                <option value="">Select year</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Major <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.major}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, major: e.target.value }));
                    handleMajorSearch(e.target.value);
                  }}
                  className={`w-full h-11 px-4 rounded-lg border ${
                    errors.major ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="Start typing your major"
                  aria-label="Enter your major"
                />
                {majorSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {majorSuggestions.map((suggestion, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, major: suggestion }));
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minor (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.minor || ''}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, minor: e.target.value || null }));
                    handleMinorSearch(e.target.value);
                  }}
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Start typing your minor"
                  aria-label="Enter your minor (optional)"
                />
                {minorSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {minorSuggestions.map((suggestion, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, minor: suggestion }));
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

export default BasicDetailsPage;