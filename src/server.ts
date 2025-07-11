import 'colors';
import cors from "cors";
import express from "express";
import {PORT} from "./config/config";
import {connectDB} from "./config/connect";
import getLocalIp from "./utils/getLocalIP";
import {buildAdminJS} from "./config/setup";
import userRoutes from "./routes/UserRoutes";
import cityRoutes from "./routes/CityRoutes";
import busRoutes from "./routes/BusRoutes";
import ticketRoutes from "./routes/TicketRoutes";
import seedRoutes from "./routes/SeedRoutes";

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/city', cityRoutes);
app.use('/api/v1/bus', busRoutes);
app.use('/api/v1/ticket', ticketRoutes);
app.use('/api/v1/seed', seedRoutes);

const start = async () => {
    try {
        await connectDB();
        await buildAdminJS(app);
        app.listen({port: PORT, host: '0.0.0.0'}, (error?: Error, address?: string) => {
            if (error) {
                console.log('Error in starting server'.red.bold, error.message);
            } else {
                console.log(`Server started on ${PORT}`.blue.italic.bold);
                console.log(`\t- Local:        http://localhost:${PORT}`.blue.bold);
                console.log(`\t- Network:      http://${getLocalIp()}:${PORT}`.blue.bold);
            }
        });
    } catch (error: any) {
        console.log(`Error during server setup:`.red.bold, error);
    }
}

start();
