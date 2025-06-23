import {Router} from "express";
import {getBusDetails, searchBuses} from "../controllers/BusController";
import {getAllCities} from "../controllers/CityController";

const router = Router();

router.get('/', getAllCities);             // /api/v1/city

export default router;
