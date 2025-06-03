import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { saveBasicDetails, uploadProfilePhoto } from '../../services/profile.service';
import useAuthStore from '../../store/authStore';

const BasicDetailsCard: React.FC = () => {
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, size: 200 });
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    preferredName: '',
    pronouns: '',
    customPronouns: '',
    yearInSchool: '',
    major: '',
    minor: '',
    photoUrl: '',
    photoBrightness: 1
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  
  const { user } = useAuthStore();
  const userId = user?.id;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setOriginalImage(previewUrl);
    
    // Reset crop box to center
    const img = new Image();
    img.onload = () => {
      const size = 200;
      setCropBox({
        x: (img.width - size) / 2,
        y: (img.height - size) / 2,
        size
      });
    };
    img.src = previewUrl;
  };

  const handleSavePhoto = async () => {
    if (!originalImage || !userId || !canvasRef.current) return;

    try {
      setIsLoading(true);

      // Create canvas for cropping
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to final dimensions
      canvas.width = 400;
      canvas.height = 400;

      // Load original image
      const img = new Image();
      img.src = originalImage;
      
      // Draw cropped region with brightness
      ctx.filter = `brightness(${formData.photoBrightness})`;
      ctx.drawImage(
        img,
        cropBox.x, cropBox.y, cropBox.size, cropBox.size,
        0, 0, 400, 400
      );

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.9);
      });

      // Upload photo
      const photoUrl = await uploadProfilePhoto(userId, new File([blob], 'profile.jpg'));
      
      // Update form data
      setFormData(prev => ({ ...prev, photoUrl }));
      setOriginalImage(null); // Hide crop interface
      
      toast.success('Photo saved successfully');
    } catch (error) {
      toast.error('Failed to save photo');
      console.error('Photo save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.preferredName.trim()) {
      toast.error('Please enter your preferred name');
      return false;
    }
    if (!formData.pronouns) {
      toast.error('Please select your pronouns');
      return false;
    }
    if (formData.pronouns === 'Other' && !formData.customPronouns.trim()) {
      toast.error('Please enter your custom pronouns');
      return false;
    }
    if (!formData.yearInSchool) {
      toast.error('Please select your year in school');
      return false;
    }
    if (!formData.major.trim()) {
      toast.error('Please enter your major');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !userId) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      await saveBasicDetails(userId, {
        preferredName: formData.preferredName.trim(),
        pronouns: formData.pronouns === 'Other' ? formData.customPronouns.trim() : formData.pronouns,
        yearInSchool: formData.yearInSchool,
        major: formData.major.trim(),
        minor: formData.minor?.trim() || null,
        photoUrl: formData.photoUrl || null
      });
      
      toast.success('Profile details saved');
      navigate('/profile/lifestyle-quiz');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save profile details');
    } finally {
      setIsLoading(false);
    }
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload Section */}
            <div className="flex flex-col items-center mb-6">
              {originalImage ? (
                <div className="relative w-full max-w-md aspect-square">
                  <img
                    src={originalImage}
                    alt="Original photo"
                    className="w-full h-full object-contain"
                  />
                  <div
                    className="absolute border-2 border-white shadow-lg cursor-move"
                    style={{
                      left: cropBox.x,
                      top: cropBox.y,
                      width: cropBox.size,
                      height: cropBox.size,
                      filter: `brightness(${formData.photoBrightness})`
                    }}
                  />
                  <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">
                      Brightness
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      value={formData.photoBrightness}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        photoBrightness: parseFloat(e.target.value)
                      }))}
                      className="w-full"
                      aria-label="Adjust photo brightness"
                      aria-valuemin={0.5}
                      aria-valuemax={1.5}
                      aria-valuenow={formData.photoBrightness}
                    />
                  </div>
                  <Button
                    onClick={handleSavePhoto}
                    isLoading={isLoading}
                    className="mt-4"
                  >
                    Save Photo
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer inline-block"
                  >
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Upload Photo</p>
                  </label>
                </div>
              )}
              
              {/* Hidden canvas for cropping */}
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Preferred Name */}
              <div>
                <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700">
                  Preferred Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="preferredName"
                  type="text"
                  value={formData.preferredName}
                  onChange={e => setFormData(prev => ({ ...prev, preferredName: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                  aria-required="true"
                />
              </div>

              {/* Pronouns */}
              <div>
                <label htmlFor="pronouns" className="block text-sm font-medium text-gray-700">
                  Pronouns <span className="text-red-500">*</span>
                </label>
                <select
                  id="pronouns"
                  value={formData.pronouns}
                  onChange={e => setFormData(prev => ({ ...prev, pronouns: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                  aria-required="true"
                >
                  <option value="">Select pronouns</option>
                  <option value="She/Her">She/Her</option>
                  <option value="He/Him">He/Him</option>
                  <option value="They/Them">They/Them</option>
                  <option value="Other">Other...</option>
                </select>

                {formData.pronouns === 'Other' && (
                  <input
                    id="customPronouns"
                    type="text"
                    value={formData.customPronouns}
                    onChange={e => setFormData(prev => ({ ...prev, customPronouns: e.target.value }))}
                    className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter your pronouns"
                    required
                    aria-required="true"
                  />
                )}
              </div>

              {/* Year in School */}
              <div>
                <label htmlFor="yearInSchool" className="block text-sm font-medium text-gray-700">
                  Year in School <span className="text-red-500">*</span>
                </label>
                <select
                  id="yearInSchool"
                  value={formData.yearInSchool}
                  onChange={e => setFormData(prev => ({ ...prev, yearInSchool: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                  aria-required="true"
                >
                  <option value="">Select year</option>
                  <option value="First">First Year</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              {/* Major */}
              <div>
                <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                  Major <span className="text-red-500">*</span>
                </label>
                <input
                  id="major"
                  type="text"
                  value={formData.major}
                  onChange={e => setFormData(prev => ({ ...prev, major: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                  aria-required="true"
                />
              </div>

              {/* Minor */}
              <div>
                <label htmlFor="minor" className="block text-sm font-medium text-gray-700">
                  Minor
                </label>
                <input
                  id="minor"
                  type="text"
                  value={formData.minor}
                  onChange={e => setFormData(prev => ({ ...prev, minor: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsCard;