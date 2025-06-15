declare global {
    namespace Express {
        interface Request {
            userExternalId?: string;
        }
    }
}

export {};