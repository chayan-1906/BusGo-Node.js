import 'colors';
import {Request, Response} from "express";
import {ApiResponse} from "../utils/ApiResponse";
import {generateMissingCode, generateNotFoundCode} from "../utils/generateErrorCodes";
import BusModel, {IBus} from "../models/BusSchema";

export const getBusDetails = async (req: Request, res: Response) => {
    try {
        // const {busId: busExternalId} = req.params;
        const {busId: busExternalId} = req.query;
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
    try {
        const {from, to, date}: { from: string; to: string; date: string; } = req.body;
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

        const buses: IBus[] = await BusModel.find({
            from,
            to,
            departureTime: {$gte: startOfDay, $lte: endOfDay},
        });

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
