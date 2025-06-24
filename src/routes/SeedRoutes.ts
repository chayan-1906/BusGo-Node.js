import {Router} from "express";
import {seedData} from "../controllers/SeedController";

const router = Router();

router.post('/', seedData);             // /api/v1/seed

export default router;
