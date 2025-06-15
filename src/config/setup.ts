import AdminJS from "adminjs";
import {Express} from "express";
import session from "express-session";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";
import ConnectMongoDBSession from "connect-mongodb-session";
import {ADMIN_LOGIN_EMAIL, ADMIN_LOGIN_PASSWORD, COOKIE_PASSWORD, MONGO_URI} from "./config";
import UserModel from "../models/UserSchema";
import BusModel from "../models/BusSchema";
import TicketModel from "../models/TicketSchema";

AdminJS.registerAdapter(AdminJSMongoose);

const DEFAULT_ADMIN = {
    email: ADMIN_LOGIN_EMAIL,
    password: ADMIN_LOGIN_PASSWORD,
}

const authenticate = async (email: string, password: string) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
}

export const buildAdminJS = async (app: Express) => {
    const admin = new AdminJS({
        resources: [
            {resource: UserModel},
            {resource: BusModel},
            {resource: TicketModel},
        ],
        branding: {
            companyName: 'BusGo',
            withMadeWithLove: false,
        },
        // defaultTheme: dark.id,
        // availableThemes: [light, dark, noSidebar],
        rootPath: '/admin',
    });

    const MongoDBStore = ConnectMongoDBSession(session);
    const sessionStore = new MongoDBStore({
        uri: MONGO_URI!,
        collection: 'sessions',
    });

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
        authenticate,
        cookieName: 'adminjs',
        cookiePassword: COOKIE_PASSWORD!,
    }, null, {
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
        secret: COOKIE_PASSWORD!,
        cookie: {
            httpOnly: false,
            secure: false,
        },
        name: 'adminjs'
    });

    app.use(admin.options.rootPath, adminRouter);
}
