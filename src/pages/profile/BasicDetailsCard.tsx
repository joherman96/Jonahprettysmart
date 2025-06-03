import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { saveBasicDetails, uploadProfilePhoto } from '../../services/profile.service';
import useAuthStore from '../../store/authStore';

// ... (previous imports and constants)

const BasicDetailsCard: React.FC = () => {
  // ... (previous state and refs)

  // Add new state for cropping
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, size: 200 });
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { user } = useAuthStore();
  const userId = user?.id;

  // ... (previous handlers)

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

  // ... (rest of the component remains the same, but update the photo section UI)

  return (
    // ... (previous JSX)
    
    {/* Update Photo Section */}
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
            // Add drag handlers here
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
        // ... (existing photo display/upload button code)
      )}
      
      {/* Hidden canvas for cropping */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
    
    // ... (rest of the JSX)
  );
};

export default BasicDetailsCard;