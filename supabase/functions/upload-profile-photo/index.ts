import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

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

    const formData = await req.formData();
    const userId = formData.get('userId') as string;
    const file = formData.get('file') as File;

    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!file) {
      throw new Error('Photo file is required');
    }

    // Upload to storage
    const { data, error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(`${userId}/${Date.now()}.jpg`, file, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(data.path);

    if (urlError) throw urlError;

    return new Response(
      JSON.stringify({ url: publicUrl }),
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