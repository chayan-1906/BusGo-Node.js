import 'colors';
import {Request, Response} from "express";
import {ApiResponse} from "../utils/ApiResponse";
import {AuthRequest} from "../middleware/AuthMiddleware";
import TicketModel, {ITicket} from "../models/TicketSchema";
import BusModel, {IBus, ISeat} from "../models/BusSchema";
import {generateMissingCode, generateNotFoundCode} from "../utils/generateErrorCodes";
import UserModel, {IUser} from "../models/UserSchema";
import {IPopulatedTicket} from "../interfaces";

export const getTicketsForUser = async (req: Request, res: Response) => {
    console.log('getTicketsForUser called');
    try {
        const {userExternalId}: { userExternalId: string } = req as AuthRequest;

        const tickets: IPopulatedTicket[] = await TicketModel.find({userExternalId})
            .populate<{ bus: Pick<IBus, 'busId' | 'busExternalId' | 'from' | 'to' | 'busTags' | 'company' | 'departureTime' | 'arrivalTime' | 'price'> }>('bus')
            .sort({bookedAt: -1});  // sorted by recency

        console.log('tickets length:'.white.bgGreen.bold, tickets.length);

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

export const bookTicket = async (req: Request, res: Response) => {
    console.log('bookTicket called:', req.body);
    try {
        const {userExternalId} = req as AuthRequest;

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

        console.log('available seats before booking:', bus.availableSeats);
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
        bus.availableSeats -= seatNumbers.length;
        const updatedBus = await bus.save();
        console.log(`available seats after booking ${seatNumbers.length} seats:`, updatedBus.availableSeats);

        console.log('Booked ticket:'.white.bgGreen.bold, ticket);

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
