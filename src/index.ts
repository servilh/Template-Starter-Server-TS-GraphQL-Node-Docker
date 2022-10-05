import express, { Express, Request, Response } from 'express';
import { connectToDatabase } from "./services/database.service"
import { startGraphQL } from "./services/graphql.service";
import { gamesRouter } from "./routes/games.router";
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;
const app: Express = express();

main();

async function main() {
    try {
        //DATABASE
        await connectToDatabase();
        // Add headers before the routes are defined
        app.use(function (req, res, next) {

            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            //res.setHeader('Access-Control-Allow-Credentials', true);

            // Pass to next layer of middleware
            next();
        });
       
        //REST API
        app.use("/games", gamesRouter);

        app.listen(port, () => {
            console.log(`Server started2 at http://localhost:${port}`);
        });

        //GRAPHQL 
        await startGraphQL(app);
    } catch (err) {
        console.error(err);
        process.exit();
    }
}