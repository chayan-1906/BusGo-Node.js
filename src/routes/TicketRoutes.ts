import {Router} from "express";
import {authMiddleware} from "../middleware/AuthMiddleware";
import {bookTicket, getTicketsForUser} from "../controllers/TicketController";

const router = Router();

router.get('/', authMiddleware, getTicketsForUser);         // /api/v1/ticket
router.post('/', authMiddleware, bookTicket);               // /api/v1/ticket

export default router;
