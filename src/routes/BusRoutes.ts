import {Router} from "express";
import {getBusDetails, searchBuses} from "../controllers/BusController";

const router = Router();

// router.get('/:busId', getBusDetails);       // /api/v1/bus/busExternalId
router.get('/', getBusDetails);             // /api/v1/bus?busId={busExternalId}
router.get('/search', searchBuses);         // /api/v1/bus/search

export default router;
