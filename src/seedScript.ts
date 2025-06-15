import "colors";
import mongoose from "mongoose";
import {connectDB} from "./config/connect";
import BusModel, {IBus} from "./models/BusSchema";
import {buses, generateSeats, locations} from './seedData';
import generateNanoIdWithAlphabet from "./utils/generateUUID";

const generateRandomTime = (baseDate: Date) => {
    const hour = Math.floor(Math.random() * 12) + 6;
    const minute = Math.random() > 0.5 ? 30 : 0;

    const dateTime = new Date(baseDate);
    dateTime.setHours(hour, minute, 0, 0);

    return dateTime;
}

async function seedDatabase() {
    try {
        await connectDB();

        await BusModel.deleteMany();
        console.log('Buses deleted'.green.bold);

        const busesToInsert: Partial<IBus>[] = [];
        console.log('Generating buses 🚌'.yellow.bold);
        for (let i = 0; i < locations.length; i++) {
            for (let j = i + 1; j < locations?.length; j++) {
                const from = locations[i];
                const to = locations[j];

                const baseDate = new Date();
                for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                    const travelDate = new Date(baseDate);
                    travelDate.setDate(travelDate.getDate() + dayOffset);

                    const returnDate = new Date(travelDate);
                    returnDate.setDate(returnDate.getDate() + 1);


                    buses.forEach(({busId, company, busType, price, originalPrice, rating, totalReviews, badges}) => {
                        busesToInsert.push({
                            busId: `${busId}_${from}_${to}_${dayOffset}`,
                            busExternalId: generateNanoIdWithAlphabet(),
                            from, to,
                            departureTime:generateRandomTime(travelDate),
                            arrivalTime: generateRandomTime(travelDate),
                            duration: '9h 30m',
                            availableSeats: 28,
                            price, originalPrice, company, busType, rating, totalReviews, badges,
                            seats: generateSeats(),
                        });

                        busesToInsert.push({
                            busId: `${busId}_${to}_${from}_${dayOffset + 1}`,
                            busExternalId: generateNanoIdWithAlphabet(),
                            from, to,
                            departureTime: generateRandomTime(returnDate),
                            arrivalTime: generateRandomTime(returnDate),
                            duration: '9h 30m',
                            availableSeats: 28,
                            price, originalPrice, company, busType, rating, totalReviews, badges,
                            seats: generateSeats(),
                        });
                    });
                }
            }
        }
        console.log('Buses generation finished 🚌'.yellow.bold);

        console.log('About to start saving buses ℹ️'.blue.bold);
        await BusModel.insertMany(busesToInsert);
        console.log('Database seeded successfully ✅'.green.bold);
    } catch (error: any) {
        console.error('Error in seeding database:'.red.bold, error);
    } finally {
        await mongoose.connection.close();
    }
}

seedDatabase();
