import {Router} from "express";
import {authenticate, refreshToken} from "../controllers/UserController";

const router = Router();

router.post('/login', authenticate);            // /api/v1/user/login
router.post('/refresh-token', refreshToken);    // /api/v1/user/refresh-token

export default router;
