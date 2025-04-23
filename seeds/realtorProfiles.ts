// seeds/realtorProfiles.ts
import { createClient } from '@supabase/supabase-js';
import faker from 'faker';

const supabaseUrl = 'https://vgjbljjluvlexargpigo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnamJsampsdXZsZXhhcmdwaWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDUwMjUsImV4cCI6MjA1OTI4MTAyNX0.6YBGOCF_6ns40Be5vztj3GoE9wydsEUT03iY8yD-pVE';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function seedRealtorProfiles() {
    const profiles = [];
    for (let i = 0; i < 10; i++) {
        const email = `${faker.internet.userName()}@testmail.com`;
        const profile = {
            email: email,
            name: faker.name.findName(),
            // Add other fields as necessary
        };
        profiles.push(profile);
    }

    // Insert profiles
    const { data, error } = await supabase
        .from('realtor_profile')
        .insert(profiles);

    if (error) {
        console.error('Error inserting realtor profiles:', error);
    } else {
        console.log('Inserted realtor profiles:', data);
    }

    // Cleanup: Delete the inserted profiles
    await supabase
        .from('realtor_profile')
        .delete()
        .in('email', profiles.map(profile => profile.email));
}