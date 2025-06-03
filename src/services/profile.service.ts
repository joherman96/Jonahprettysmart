interface BasicDetailsData {
  preferredName: string;
  pronouns: string;
  otherPronouns?: string;
  yearInSchool: string;
  major: string;
  minor?: string | null;
  photoUrl: string;
}

export async function saveBasicDetails(userId: string, data: BasicDetailsData) {
  // Validate required fields
  if (!data.preferredName.trim()) {
    throw new Error('Preferred name is required');
  }
  
  if (!data.pronouns) {
    throw new Error('Pronouns are required');
  }
  
  if (data.pronouns === 'Other…' && !data.otherPronouns?.trim()) {
    throw new Error('Please specify your pronouns');
  }
  
  if (!data.yearInSchool) {
    throw new Error('Year in school is required');
  }
  
  if (!data.major.trim()) {
    throw new Error('Major is required');
  }
  
  if (!data.photoUrl) {
    throw new Error('Profile photo is required');
  }

  try {
    // In a real app, this would be an API call to update the database
    // For now, we'll just simulate success
    console.log('Saving basic details:', { userId, data });
    return { success: true };
  } catch (error) {
    throw new Error('Failed to save profile details');
  }
}