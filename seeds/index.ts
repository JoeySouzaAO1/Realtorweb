// seeds/index.ts
import { seedRealtorProfiles } from './realtorProfiles';
import { seedSuperAdminProfile } from './superAdminProfile';

async function runSeeds() {
    try {
        console.log('Seeding super admin profile...');
        await seedSuperAdminProfile();
        console.log('Super admin profile seeded successfully.');

        console.log('Seeding realtor profiles...');
        await seedRealtorProfiles();
        console.log('Realtor profiles seeded successfully.');
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
}

runSeeds()
    .then(() => {
        console.log('Seeding completed successfully.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error during seeding:', error);
        process.exit(1);
    });