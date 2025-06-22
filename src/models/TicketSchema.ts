import {Document, Model, model, Schema} from "mongoose";
import generateNanoIdWithAlphabet from "../utils/generateUUID";
import {v4 as uuidV4} from 'uuid';

export interface ITicket extends Document {
    ticketId: string;
    ticketExternalId: string;
    userId: Schema.Types.ObjectId;
    userExternalId: string;
    busId: Schema.Types.ObjectId;
    busExternalId: string;
    date: Date;
    seatNumbers: number[];
    totalFare: number;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
    bookedAt: Date;
    pnr: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ITicketModel extends Model<ITicket> {}

const TicketSchema = new Schema<ITicket>({
    ticketExternalId: {
        type: String,
        unique: true,
        required: true,
        default: () => generateNanoIdWithAlphabet(),
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userExternalId: {
        type: String,
        required: true,
    },
    busId: {
        type: Schema.Types.ObjectId,
        ref: 'Bus',
        required: true,
    },
    busExternalId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    seatNumbers: [{
        type: Number,
        required: true,
    }],
    totalFare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Completed', 'Cancelled'],
        default: 'Upcoming',
    },
    bookedAt: {
        type: Date,
        default: Date.now,
    },
    pnr: {
        type: String,
        unique: true,
        required: true,
        default: () => uuidV4().slice(0, 10).toUpperCase(),
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.ticketId = ret._id;
            delete ret._id;
            delete ret.__v;

            return {
                ticketId: ret.ticketId,
                ...ret,
            } as ITicket;
        },
    },
    toObject: {virtuals: true},
});

TicketSchema.virtual('bus', {
    ref: 'Bus',
    localField: 'busId',
    foreignField: '_id',
    justOne: true,
});

const TicketModel = model<ITicket, ITicketModel>('Ticket', TicketSchema);

export default TicketModel;
