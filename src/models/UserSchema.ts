import {Document, Model, model, Schema} from "mongoose";
import generateNanoIdWithAlphabet from "../utils/generateUUID";

export interface IUser extends Document {
    userId: string;
    userExternalId: string;
    googleId?: string;
    phone?: string;
    name?: string;
    email?: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserModel extends Model<IUser> {
}

const UserSchema = new Schema<IUser>({
    userExternalId: {
        type: String,
        unique: true,
        required: true,
        default: () => generateNanoIdWithAlphabet(),
    },
    googleId: {
        type: String,
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    profilePicture: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.userId = ret._id;
            delete ret._id;
            delete ret.__v;

            return {
                userId: ret.userId,
                ...ret,
            } as IUser;
        },
    },
});

const UserModel: IUserModel = model<IUser, IUserModel>('User', UserSchema);

export default UserModel;
