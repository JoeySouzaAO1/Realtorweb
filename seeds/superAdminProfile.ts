// seeds/superAdminProfile.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vgjbljjluvlexargpigo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnamJsampsdXZsZXhhcmdwaWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDUwMjUsImV4cCI6MjA1OTI4MTAyNX0.6YBGOCF_6ns40Be5vztj3GoE9wydsEUT03iY8yD-pVE';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function seedSuperAdminProfile() {
    const superAdminProfile = {
        email: 'superadmin@testmail.com',
        name: 'Super Admin',
        // Add other fields as necessary
    };

    // Insert super admin profile
    const { data, error } = await supabase
        .from('realtor_profile')
        .insert([superAdminProfile]);

    if (error) {
        console.error('Error inserting super admin profile:', error);
    } else {
        console.log('Inserted super admin profile:', data);
    }

    // Cleanup: Delete the inserted super admin profile
    await supabase
        .from('realtor_profile')
        .delete()
        .eq('email', superAdminProfile.email);
}