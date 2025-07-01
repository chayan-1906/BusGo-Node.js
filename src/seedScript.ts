import "colors";
import mongoose from "mongoose";
import {connectDB} from "./config/connect";
import BusModel, {IBus} from "./models/BusSchema";
import {buses, cities, generateSeats, governmentBus} from './seedData';
import generateNanoIdWithAlphabet from "./utils/generateUUID";

const generateRandomTime = (baseDate: Date) => {
    const hour = Math.floor(Math.random() * 12) + 6;
    const minute = Math.random() > 0.5 ? 30 : 0;

    const dateTime = new Date(baseDate);
    dateTime.setHours(hour, minute, 0, 0);

    return dateTime;
}

// Ensure each bus has either AC or Non AC while preserving other tags
const normalizeBusTags = (tags: string[]): string[] => {
    const hasAC = tags.some(tag => tag === 'A/C');
    const hasNonAC = tags.some(tag => tag === 'Non A/C');

    // Remove AC tags only
    const filteredTags = tags.filter(tag => tag !== 'A/C' && tag !== 'Non A/C');

    // Add exactly one AC designation
    if (hasAC && !hasNonAC) {
        return ['A/C', ...filteredTags];
    } else if (hasNonAC && !hasAC) {
        return ['Non A/C', ...filteredTags];
    } else {
        // If both or neither, randomly assign one
        return Math.random() > 0.5 ? ['A/C', ...filteredTags] : ['Non A/C', ...filteredTags];
    }
};

export async function seedDatabase() {
    try {
        await connectDB();

        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database connection not ready');
        }

        await mongoose.connection.dropDatabase();
        console.log('Deleted entire database'.green.bold);

        // Wait a bit after dropping database
        await new Promise(resolve => setTimeout(resolve, 2000));

        const busesToInsert: Partial<IBus>[] = [];
        console.log('Generating buses 🚌'.yellow.bold);
        for (const from of cities) {
            for (const to of cities) {
                if (from === to) continue; // Skip same-city routes

                for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
                    const travelDate = new Date();
                    travelDate.setDate(travelDate.getDate() + dayOffset);

                    // First, add government bus for this route
                    const govDepartureTime = generateRandomTime(travelDate);
                    const govTravelHours = Math.floor(Math.random() * 12) + 4;
                    const govTravelMinutes = Math.random() > 0.5 ? 30 : 0;
                    const govArrivalTime = new Date(govDepartureTime);
                    govArrivalTime.setHours(govArrivalTime.getHours() + govTravelHours);
                    govArrivalTime.setMinutes(govArrivalTime.getMinutes() + govTravelMinutes);

                    busesToInsert.push({
                        busId: `${governmentBus.busId}_${from}_${to}_${dayOffset}`,
                        busExternalId: generateNanoIdWithAlphabet(),
                        from,
                        to,
                        departureTime: govDepartureTime,
                        arrivalTime: govArrivalTime,
                        duration: Math.floor((govArrivalTime.getTime() - govDepartureTime.getTime()) / 60000),
                        availableSeats: 28,
                        price: governmentBus.price,
                        originalPrice: governmentBus.originalPrice,
                        company: governmentBus.company,
                        busTags: normalizeBusTags(governmentBus.busTags),
                        rating: governmentBus.rating,
                        totalReviews: governmentBus.totalReviews,
                        badges: governmentBus.badges,
                        seats: generateSeats(),
                    });

                    // Then add 4 private buses for this route
                    for (let k = 0; k < 4; k++) {
                        const bus = buses[k % buses.length];

                        const departureTime = generateRandomTime(travelDate);
                        const travelHours = Math.floor(Math.random() * 12) + 4;
                        const travelMinutes = Math.random() > 0.5 ? 30 : 0;
                        const arrivalTime = new Date(departureTime);
                        arrivalTime.setHours(arrivalTime.getHours() + travelHours);
                        arrivalTime.setMinutes(arrivalTime.getMinutes() + travelMinutes);

                        busesToInsert.push({
                            busId: `${bus.busId}_${from}_${to}_${dayOffset}_${k}`,
                            busExternalId: generateNanoIdWithAlphabet(),
                            from,
                            to,
                            departureTime,
                            arrivalTime,
                            duration: Math.floor((arrivalTime.getTime() - departureTime.getTime()) / 60000),
                            availableSeats: 28,
                            price: bus.price,
                            originalPrice: bus.originalPrice,
                            company: bus.company,
                            busTags: normalizeBusTags(bus.busTags),
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
        // Insert in smaller batches to avoid timeout
        const batchSize = 100;
        for (let i = 0; i < busesToInsert.length; i += batchSize) {
            const batch = busesToInsert.slice(i, i + batchSize);
            await BusModel.insertMany(batch);
            console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(busesToInsert.length / batchSize)}`.green);
        }
        console.log('Database seeded successfully ✅'.green.bold);
    } catch (error: any) {
        console.error('Error in seeding database:'.red.bold, error);
    } finally {
        // Only close if connection exists and is open
        /*if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('🔌 Database connection closed'.gray);
        }*/
    }
}

// seedDatabase();
