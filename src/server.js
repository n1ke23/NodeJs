import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { getPaths } from './helpers/utils.js';
import contactRouter from './contacts/contacts.router.js'

export class ContactsServer {
    constructor() {
        this.server = null;
    }

    start() {
        this.initServer();
        this.initConfig();
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

    initMiddlewares() {
        this.server.use(express.json());
        this.server.use(morgan('tiny'));
        this.server.use(cors())
    }

    initRoutes() {
        this.server.use('/contacts', contactRouter)
    }

    initErrorHandler() {
        this.server.use((err, req, res, next) => {
            const statusCode = err.status || 500
            console.log(err);
            return res.status(statusCode).send(err.message)
        })
    }

    startListening() {
        dotenv.config()
        const PORT = process.env.PORT || 3000
        this.server.listen(PORT, () => {
            console.log('Server started on port ', PORT);
        })
    }
}

