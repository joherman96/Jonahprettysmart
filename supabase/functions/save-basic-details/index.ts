import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

interface BasicDetailsData {
  preferredName: string;
  pronouns: string;
  yearInSchool: string;
  major: string;
  minor: string | null;
  photoUrl: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { userId, data } = await req.json() as { userId: string; data: BasicDetailsData };

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Validate required fields
    if (!data.preferredName?.trim()) {
      throw new Error('Preferred name is required');
    }
    if (!data.pronouns?.trim()) {
      throw new Error('Pronouns are required');
    }
    if (!data.yearInSchool?.trim()) {
      throw new Error('Year in school is required');
    }
    if (!data.major?.trim()) {
      throw new Error('Major is required');
    }

    // Update user profile
    const { error } = await supabase
      .from('users')
      .update({
        profile_data: {
          basicDetails: {
            ...data,
            updatedAt: new Date().toISOString(),
          },
        },
      })
      .eq('id', userId);

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An error occurred',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});