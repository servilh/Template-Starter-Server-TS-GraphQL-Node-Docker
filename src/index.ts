import express, { Express, Request, Response } from 'express';
import { connectToDatabase } from "./services/database.service"
import { gamesRouter } from "./routes/games.router";
import dotenv from 'dotenv';
import { ApolloServer } from "apollo-server-express";
import { PingResolver } from "./graphql/resolvers/ping";
import "reflect-metadata";
import { buildSchema  } from 'type-graphql';

dotenv.config();
const port = process.env.PORT;
const app: Express = express();


connectToDatabase()
    .then(async () => {
        // Add headers before the routes are defined
        app.use(function (req, res, next) {

            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');

            // Website for Jasmine Testing
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9876');

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
        //GRAPHQL: in route path of express /graphql
        try{
            const server = new ApolloServer({
                schema: await buildSchema({
                  resolvers: [PingResolver],
                  validate: false
                }),
                context: ({ req, res }) => ({ req, res })
              });
            await server.start(); 
            server.applyMiddleware({app, path: '/graphql'})
        }catch(ex) {
            throw new Error("Error starting GRAPHQL: " + ex); 
        }        
        //REST API
        app.use("/games", gamesRouter);

        app.listen(port, () => {
            console.log(`Server started2 at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });