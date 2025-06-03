import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface BasicDetailsData {
  preferredName: string;
  pronouns: string;
  yearInSchool: string;
  major: string;
  minor: string | null;
  photoUrl: string | null;
}

export const saveBasicDetails = async (userId: string, data: BasicDetailsData) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-basic-details`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save basic details');
  }

  return response.json();
};

export const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('file', file);

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-profile-photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload photo');
  }

  const { url } = await response.json();
  return url;
};