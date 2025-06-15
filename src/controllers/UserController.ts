import 'colors';
import {Request, Response} from "express";
import {OAuth2Client} from "google-auth-library";
import {ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, GOOGLE_CLIENT_ID, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET} from "../config/config";
import jwt, {SignOptions} from "jsonwebtoken";
import {ApiResponse} from "../utils/ApiResponse";
import UserModel, {IUser} from "../models/UserSchema";
import {generateMissingCode, generateNotFoundCode} from "../utils/generateErrorCodes";
import {AuthRequest} from "../middleware/AuthMiddleware";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const generateTokens = (user: IUser) => {
    const accessToken = jwt.sign(
        {userExternalId: user.userExternalId},
        ACCESS_TOKEN_SECRET!,
        {expiresIn: ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn']}
    );

    const refreshToken = jwt.sign(
        {userExternalId: user.userExternalId},
        REFRESH_TOKEN_SECRET!,
        {expiresIn: REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn']},
    );

    return {accessToken, refreshToken};
}

export const authenticate = async (req: Request, res: Response) => {
    const {idToken}: { idToken: string; } = req.body;

    try {
        const {getPayload} = await client.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID,
        });

        const {email, sub: googleId, name, picture: profilePicture, email_verified} = getPayload() || {};
        if (!email_verified) {
            res.status(400).send(new ApiResponse({
                success: false,
                errorCode: 'EMAIL_NOT_VERIFIED',
                errorMsg: 'Email Address is not verified',
            }));
            return;
        }

        let user: IUser | null = await UserModel.findOne({email});
        let isNewUser = false;
        if (!user) {
            isNewUser = true;
            user = await UserModel.create({googleId, email, name, profilePicture}) as IUser;
        }

        const {accessToken, refreshToken} = generateTokens(user);
        res.status(200).send(new ApiResponse({
            success: true,
            message: 'Authenticated 🎉',
            accessToken,
            refreshToken,
            isNewUser,
        }));
    } catch (error: any) {
        console.error('Error in authentication'.red.bold, error);
        res.status(500).send(new ApiResponse({
            success: false,
            error,
            errorMsg: 'Something went wrong',
        }));
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    const {refreshToken: rawRefreshToken}: { refreshToken: string } = req.body;

    if (!rawRefreshToken) {
        res.status(401).send(new ApiResponse({
            success: false,
            errorCode: generateMissingCode('refresh_token'),
            errorMsg: 'Refresh token is missing',
        }));
        return;
    }

    try {
        const decoded = jwt.verify(rawRefreshToken, REFRESH_TOKEN_SECRET!) as AuthRequest;
        const user: IUser | null = await UserModel.findById(decoded.userExternalId);
        if (!user) {
            res.status(404).send(new ApiResponse({
                success: false,
                errorCode: generateNotFoundCode('user'),
                errorMsg: 'User not found',
            }));
            return;
        }

        const newAccessToken = jwt.sign(
            {userExternalId: user.userExternalId},
            ACCESS_TOKEN_SECRET!,
            {expiresIn: ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn']}
        );

        res.status(200).send(new ApiResponse({
            success: true,
            message: 'New access token generated',
            accessToken: newAccessToken,
        }));
    } catch (error: any) {
        console.error('Error in refreshing token'.red.bold, error);
        res.status(500).send(new ApiResponse({
            success: false,
            error,
            errorMsg: 'Something went wrong',
        }));
    }
}
