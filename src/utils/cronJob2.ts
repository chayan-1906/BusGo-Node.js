import cron from 'node-cron';
import {seedDatabase} from "../seedScript";

// Schedule a job to run every minute
/*cron.schedule('* * * * *', () => {
    console.log('Running a task every minute');
});*/

// Schedule a job to run every 5 minute
cron.schedule('*/5 * * * *', () => {
    (async () => {
        // console.log('Running a task every 5 minute');
        await seedDatabase();
    })();
});
