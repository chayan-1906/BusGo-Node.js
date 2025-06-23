import "colors";
import mongoose from "mongoose";
import {connectDB} from "./config/connect";
import BusModel, {IBus} from "./models/BusSchema";
import {buses, cities, generateSeats} from './seedData';
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
        for (const from of cities) {
            for (const to of cities) {
                if (from === to) continue; // Skip same-city routes

                for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                    const travelDate = new Date();
                    travelDate.setDate(travelDate.getDate() + dayOffset);

                    for (let k = 0; k < 5; k++) {
                        const bus = buses[k % buses.length]; // rotate 5 buses

                        // Departure time
                        const departureTime = generateRandomTime(travelDate);

                        // Simulate journey duration: 4–15 hours + 0 or 30 mins
                        const travelHours = Math.floor(Math.random() * 12) + 4; // 4–15
                        const travelMinutes = Math.random() > 0.5 ? 30 : 0;

                        // Arrival time
                        const arrivalTime = new Date(departureTime);
                        arrivalTime.setHours(arrivalTime.getHours() + travelHours);
                        arrivalTime.setMinutes(arrivalTime.getMinutes() + travelMinutes);

                        // Duration string
                        const totalMinutes = Math.floor((arrivalTime.getTime() - departureTime.getTime()) / 60000);
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        const duration = `${hours}h ${minutes}m`;

                        busesToInsert.push({
                            busId: `${bus.busId}_${from}_${to}_${dayOffset}_${k}`,
                            busExternalId: generateNanoIdWithAlphabet(),
                            from,
                            to,
                            departureTime,
                            arrivalTime,
                            duration,
                            availableSeats: 28,
                            price: bus.price,
                            originalPrice: bus.originalPrice,
                            company: bus.company,
                            busTags: bus.busTags,
                            rating: bus.rating,
                            totalReviews: bus.totalReviews,
                            badges: bus.badges,
                            seats: generateSeats(),
                        });
                    }
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
