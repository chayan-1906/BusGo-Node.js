import 'colors';
import {Request, Response} from "express";
import {ApiResponse} from "../utils/ApiResponse";
import {cities} from "../seedData";

export const getAllCities = async (req: Request, res: Response) => {
    console.log('getAllCities called');
    try {
        const {city}: { city?: string } = req.query;
        /*const buses: IBus[] = await BusModel.find({
            from,
            to,
            departureTime: {$gte: startOfDay, $lte: endOfDay},
        });*/
        const sortedCities = cities.sort((a, b) => a.localeCompare(b));
        const filteredCities = city ? sortedCities.filter(location => location.toLowerCase().includes(city.toLowerCase())) : sortedCities;
        console.log('Cities found', filteredCities.length);

        res.status(200).send(new ApiResponse({
            success: true,
            message: 'Cities found 🎉',
            cities: filteredCities,
        }));
    } catch (error: any) {
        console.error('Error in getAllCities'.red.bold, error);
        res.status(500).send(new ApiResponse({
            success: false,
            error,
            errorMsg: 'Something went wrong',
        }));
    }
}
