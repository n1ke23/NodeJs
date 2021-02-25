import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { getPaths } from './helpers/utils.js';
import contactRouter from './contacts/contacts.router.js'
import mongoose from "mongoose"
import { authRouter } from './auth/auth.router.js';
import { userRouter } from './users/user.router.js';

export class ContactsServer {
    constructor() {
        this.server = null;
    }

    async start() {
        this.initServer();
        this.initConfig();
        await this.initDatabase()
        this.initMiddlewares();
        this.initRoutes();
        this.initErrorHandler();
        this.startListening()
    }

    initServer() {
        this.server = express();
    }

    initConfig() {
        const { __dirname } = getPaths(import.meta.url);

        dotenv.config({ path: path.join(__dirname, "../.env") })
    }

    async initDatabase() {
        try {
            await mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            });
            console.log("Database connection successful");
        } catch (error) {
            console.log(`MongoDB error: ${error.message}`);
            process.exit(1);
        }
    }

    initMiddlewares() {
        this.server.use(express.json());
        this.server.use(morgan('tiny'));
        this.server.use(cors())
    }

    initRoutes() {
        const { __dirname } = getPaths(import.meta.url);
        this.server.use('/contacts', contactRouter);
        this.server.use('/auth', authRouter);
        this.server.use('/users', userRouter);
        this.server.use('/images', express.static(__dirname + "/public/images"))

    }

    initErrorHandler() {
        this.server.use((err, req, res, next) => {
            const statusCode = err.status || 500
            console.log(err);
            return res.status(statusCode).send(err.message)
        })
    }

    startListening() {
        const PORT = process.env.PORT || 3000
        this.server.listen(PORT, () => {
            console.log('Server started on port ', PORT);
        })
    }
}

