import {ITicket} from "../models/TicketSchema";

export interface IPopulatedTicket extends Omit<ITicket, 'busId'> {
    bus: {
        busId: string;
        busExternalId: string;
        from: string;
        to: string;
        busType: string;
        company: string;
        departureTime: Date;
        arrivalTime: Date;
        price: number;
    }
}
