import 'colors';
import {Response} from "express";
import {ApiResponse} from "../utils/ApiResponse";
import "./types";
import {AuthRequest} from "../middleware/AuthMiddleware";
import TicketModel, {ITicket} from "../models/TicketSchema";
import BusModel, {IBus, ISeat} from "../models/BusSchema";
import {generateMissingCode, generateNotFoundCode} from "../utils/generateErrorCodes";
import UserModel, {IUser} from "../models/UserSchema";

export const getTicketsForUser = async (req: AuthRequest, res: Response) => {
    try {
        const userExternalId: string = req.userExternalId;

        /*const tickets: ITicket[] = await TicketModel.find({userExternalId})
            .populate<{ bus: IBus }>('bus', ['busId busExternalId from to company departureTime arrivalTime place'])
            .sort({bookedAt: -1});*/
        const tickets: ITicket[] = await TicketModel.find({userExternalId})
            .populate<{ bus: Pick<IBus, 'busId' | 'busExternalId' | 'from' | 'to' | 'busType' | 'company' | 'departureTime' | 'arrivalTime' | 'price'> }>('bus')
            .sort({bookedAt: -1});  // sorted by recently

        res.status(200).send(new ApiResponse({
            success: true,
            message: 'Tickets found 🎉',
            tickets: tickets || [],
        }));
    } catch (error: any) {
        console.error('Error in getTicketsForUser'.red.bold, error);
        res.status(500).send(new ApiResponse({
            success: false,
            error,
            errorMsg: 'Something went wrong',
        }));
    }
}

export const bookTicket = async (req: AuthRequest, res: Response) => {
    try {
        const userExternalId = req.userExternalId;

        const user: IUser | null = await UserModel.findOne({userExternalId});
        if (!user) {
            res.status(404).send(new ApiResponse({
                success: false,
                errorCode: generateNotFoundCode('user'),
                errorMsg: 'User not found',
            }));
            return;
        }

        const {busId: busExternalId, date, seatNumbers}: { busId: string; date: string; seatNumbers: number[]; } = req.body;
        if (!busExternalId) {
            res.status(400).send(new ApiResponse({
                success: false,
                errorCode: generateMissingCode('busId'),
                errorMsg: 'Bus ID is missing',
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
        if (!seatNumbers || seatNumbers.length === 0) {
            res.status(400).send(new ApiResponse({
                success: false,
                errorCode: generateMissingCode('seats'),
                errorMsg: 'Seats is missing or not selected',
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

        const unavailableSeats = seatNumbers.filter((seatNum: number) => bus.seats?.some((row) => row?.some((seat: ISeat) => seat.seatId === seatNum && seat.isBooked)));
        if (unavailableSeats.length > 0) {
            res.status(400).send(new ApiResponse({
                success: false,
                errorCode: 'ALREADY_BOOKED',
                errorMsg: `The following seats are already booked: ${unavailableSeats.join(', ')}`,
            }));
            return;
        }

        const totalFare = bus.price * seatNumbers.length;
        const ticket: ITicket = await TicketModel.create({userId: user._id, userExternalId, busId: bus._id, busExternalId, date, seatNumbers, totalFare});

        bus.seats.forEach((row) => {
            row?.forEach((seat) => {
                if (seatNumbers.includes(seat.seatId)) {
                    seat.isBooked = true;
                }
            });
        });
        await bus.save();

        res.status(201).send(new ApiResponse({
            success: true,
            message: 'Ticket booked 🎉',
            ticket,
        }));
    } catch (error: any) {
        console.error('Error in bookTicket'.red.bold, error);
        res.status(500).send(new ApiResponse({
            success: false,
            error,
            errorMsg: 'Something went wrong',
        }));
    }
}
