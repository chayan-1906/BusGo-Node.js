import 'colors';
import {Request, Response} from "express";
import {ApiResponse} from "../utils/ApiResponse";
import {generateMissingCode, generateNotFoundCode} from "../utils/generateErrorCodes";
import BusModel, {IBus} from "../models/BusSchema";
import {SortOrder} from "mongoose";

export const getBusDetails = async (req: Request, res: Response) => {
    try {
        // const {busId: busExternalId} = req.params;
        const {busId: busExternalId}: {busId?: string} = req.query;
        if (!busExternalId) {
            res.status(400).send(new ApiResponse({
                success: false,
                errorCode: generateMissingCode('busId'),
                errorMsg: 'Bus ID is missing',
            }));
            return;
        }

        const bus: IBus | null = await BusModel.findOne({busExternalId});
        if (!bus) {
            res.status(404).send(new ApiResponse({
                success: false,
                errorCode: generateNotFoundCode('bus'),
                errorMsg: 'Bus not found',
            }));
            return;
        }

        res.status(200).send(new ApiResponse({
            success: true,
            message: 'Bus found 🎉',
            bus,
        }));
    } catch (error: any) {
        console.error('Error in getBusDetails'.red.bold, error);
        res.status(500).send(new ApiResponse({
            success: false,
            error,
            errorMsg: 'Something went wrong',
        }));
    }
}

export const searchBuses = async (req: Request, res: Response) => {
    console.log('searchBuses called:', req.query);
    try {
        const {from, to, date, tags, sortBy}: { from?: string; to?: string; date?: string; tags?: string; sortBy?: string; } = req.query;
        if (!from) {
            res.status(400).send(new ApiResponse({
                success: false,
                errorCode: generateMissingCode('from'),
                errorMsg: 'Source is missing',
            }));
            return;
        }
        if (!to) {
            res.status(400).send(new ApiResponse({
                success: false,
                errorCode: generateMissingCode('to'),
                errorMsg: 'Destination is missing',
            }));
            return;
        }
        if (!date) {
            res.status(400).send(new ApiResponse({
                success: false,
                errorCode: generateMissingCode('date'),
                errorMsg: 'Date is missing',
            }));
            return;
        }

        const selectedDate = new Date(date);
        const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

        const filter: any = {
            from,
            to,
            departureTime: {$gte: startOfDay, $lte: endOfDay},
        };

        if (tags) {
            const parsedTags = tags.split(',') ?? [];
            filter.busTags = {$in: parsedTags};
        }

        let sortOrder: SortOrder = 'asc';  // ascending
        // descending for rating, totalReviews
        if (sortBy === 'rating' || sortBy === 'totalReviews' || sortBy === 'availableSeats') {
            sortOrder = 'desc';
        }
        const sortField = sortBy || 'departureTime';
        const buses = await BusModel.find(filter)
        // .sort({[sortField]: sortOrder});
        console.log('Buses found', buses.length);

        res.status(200).send(new ApiResponse({
            success: true,
            message: 'Buses found 🎉',
            buses,
        }));
    } catch (error: any) {
        console.error('Error in searchBuses'.red.bold, error);
        res.status(500).send(new ApiResponse({
            success: false,
            error,
            errorMsg: 'Something went wrong',
        }));
    }
}
