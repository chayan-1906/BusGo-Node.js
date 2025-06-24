import {Request, Response} from "express";
import {ApiResponse} from "../utils/ApiResponse";
import {seedDatabase} from "../seedScript";
import {SEED_SECRET} from "../config/config";

export const seedData = async (req: Request, res: Response) => {
    try {
        const secret = req.headers['x-seed-secret'];
        if (secret !== SEED_SECRET) {
            res.status(403).json({error: 'Unauthorized'});
            return
        }

        await seedDatabase();

        res.status(200).send(new ApiResponse({
            success: true,
            message: 'Database seeded 🎉',
        }));
    } catch (error: any) {
        console.error('Error in seedData'.red.bold, error);
        res.status(500).send(new ApiResponse({
            success: false,
            error,
            errorMsg: 'Something went wrong',
        }));
    }
}
