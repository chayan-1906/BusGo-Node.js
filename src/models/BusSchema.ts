import {Document, Model, model, Schema} from "mongoose";
import generateNanoIdWithAlphabet from "../utils/generateUUID";

export interface ISeat {
    seatId: number;
    seatType: 'window' | 'side' | 'path';
    isBooked: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ISeatModel extends Model<ISeat> {
}

const SeatSchema = new Schema<ISeat>({
    seatId: {
        type: Number,
        required: true,
    },
    seatType: {
        type: String,
        enum: ['window', 'side', 'path'],
        required: true,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const SeatModel = model<ISeat, ISeatModel>('Seat', SeatSchema);

export interface IBus extends Document {
    busId: string;
    busExternalId: string;
    from: string;
    to: string;
    departureTime: Date;
    arrivalTime: Date;
    duration: string;
    availableSeats: number;
    price: number;
    originalPrice: number;
    company: string;
    busTags: string[];
    rating: number;
    totalReviews: number;
    badges: string[];
    seats: ISeat[][];
    createdAt: Date;
    updatedAt: Date;
}

interface IBusModel extends Model<IBus> {
}

const BusSchema = new Schema<IBus>({
    busId: {
        type: String,
        required: true,
        unique: true,
    },
    busExternalId: {
        type: String,
        unique: true,
        required: true,
        default: () => generateNanoIdWithAlphabet(),
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    departureTime: {
        type: Date,
        required: true,
    },
    arrivalTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    availableSeats: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    busTags: {
        type: [String],
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
    badges: [{
        type: String,
    }],
    seats: {
        type: [[SeatSchema]],
        default: [],
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.busId = ret._id;
            delete ret._id;
            delete ret.__v;

            return {
                busId: ret.busId,
                ...ret,
            } as IBus;
        },
    },
});

const BusModel = model<IBus, IBusModel>('Bus', BusSchema);

export default BusModel;
