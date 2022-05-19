import express, { Express, Request, Response } from 'express';
import { connectToDatabase } from "./services/database.service"
import { gamesRouter } from "./routes/games.router";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

connectToDatabase()
    .then(() => {
        app.use("/games", gamesRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });