import jwt, {JwtPayload} from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";
import {ACCESS_TOKEN_SECRET} from "../config/config";

export interface AuthRequest extends Request {
    userExternalId: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({error: 'No token provided'});
        return;
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET!, (error, decoded) => {
        if (error) {
            res.status(403).json({error: 'Invalid or expired token'});
            return;
        }

        const payload = decoded as JwtPayload;
        req.userExternalId = payload.userExternalId as string;
        next();
    });
}

export {authMiddleware};
