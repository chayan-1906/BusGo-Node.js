import cron from "node-cron";
import {seedDatabase} from "../seedScript";

function getNextRunTime(): string {
    const nextRun = new Date();
    nextRun.setDate(nextRun.getDate() + 7);
    return nextRun.toLocaleString();
}

async function startCronJob() {
    console.log('🚀 Starting weekly database seeding cron job...'.magenta.bold);
    console.log('📅 Schedule: Every Sunday at 2:00 AM UTC'.cyan);

    // Run every Sunday at 2:00 AM UTC
    // Cron format: minute hour day-of-month month day-of-week
    // 0 2 * * 0 = At 2:00 AM on Sunday (0 = Sunday)
    const cronJob = cron.schedule('30 12 * * 2', async () => {
        console.log('\n⏰ Cron job triggered - Starting database seeding...'.magenta.bold);
        await seedDatabase();
    });

    // Optional: Run immediately on startup (for testing)
    // Uncomment the line below if you want to seed immediately when the cron starts
    if (process.env.SEED_ON_START === 'true') {
        await seedDatabase();
    }

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
        console.log('\n🛑 Received SIGTERM, stopping cron job...'.yellow.bold);
        cronJob.stop();
        process.exit(0);
    });

    process.on('SIGINT', () => {
        console.log('\n🛑 Received SIGINT, stopping cron job...'.yellow.bold);
        cronJob.stop();
        process.exit(0);
    });

    console.log('✅ Cron job is running. Press Ctrl+C to stop.'.green.bold);

    return cronJob;
}

// Start the cron job
if (require.main === module) {
    startCronJob();
}
