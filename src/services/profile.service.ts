import { db } from '../utils/db'; // adjust import path if necessary

export async function saveBasicDetails(
  userId: string,
  data: {
    preferredName: string;
    pronouns: string;
    otherPronouns?: string;
    yearInSchool: string;
    major: string;
    minor?: string | null;
    photoUrl: string;
  }
): Promise<{ success: boolean }> {
  // Validate required fields
  const { preferredName, pronouns, yearInSchool, major, photoUrl } = data;
  if (!preferredName) {
    throw new Error('Preferred name is required');
  }
  if (!pronouns) {
    throw new Error('Pronouns are required');
  }
  if (pronouns === 'Other…' && !data.otherPronouns) {
    throw new Error('Please specify your pronouns');
  }
  if (!yearInSchool) {
    throw new Error('Year in school is required');
  }
  if (!major) {
    throw new Error('Major is required');
  }
  if (!photoUrl) {
    throw new Error('Profile photo URL is required');
  }

  // Merge basic details into users.profile_data JSONB
  const basicDetailsJson = JSON.stringify({
    preferredName,
    pronouns,
    ...(data.otherPronouns && { otherPronouns: data.otherPronouns }),
    yearInSchool,
    major,
    minor: data.minor || null,
    photoUrl
  });

  const query = `
    UPDATE users
    SET profile_data = jsonb_set(
      COALESCE(profile_data, '{}'),
      '{basicDetails}',
      $1::jsonb
    )
    WHERE id = $2
  `;
  await db.query(query, [basicDetailsJson, userId]);

  return { success: true };
}

export async function saveLifestyleQuiz(
  userId: string,
  data: {
    bedtime: number;
    wakeTime: number;
    cleanliness: number;
    noiseTolerance: number;
    guestFrequency: number;
    petFriendliness: number;
    smokingPreference: number;
    travelFrequency: number;
    studyLocation: number;
  }
): Promise<{ success: boolean }> {
  const keys = Object.keys(data) as (keyof typeof data)[];
  for (const key of keys) {
    const val = data[key];
    if (typeof val !== 'number' || val < 0 || val > 10) {
      throw new Error(`Invalid value for ${key}`);
    }
  }

  const query = `
    UPDATE users
    SET profile_data = jsonb_set(
      COALESCE(profile_data, '{}'),
      '{lifestyleQuiz}',
      $1::jsonb
    )
    WHERE id = $2
  `;
  await db.query(query, [JSON.stringify(data), userId]);

  return { success: true };
}