const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function setupBucket() {
  const { data, error } = await supabase.storage.getBucket('reports');
  if (error && error.message.includes('The resource was not found')) {
    console.log('Bucket not found, creating a public bucket...');
    const { data: newBucket, error: createError } = await supabase.storage.createBucket('reports', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 10485760 // 10MB
    });
    if (createError) console.error('Error creating bucket:', createError);
    else console.log('Bucket created:', newBucket);
  } else if (error) {
    console.error('Error checking bucket:', error);
  } else {
    console.log('Bucket already exists:', data.name);
    // Ensure it's public
    if (!data.public) {
      await supabase.storage.updateBucket('reports', { public: true });
      console.log('Updated bucket to be public.');
    }
  }
}
setupBucket();
