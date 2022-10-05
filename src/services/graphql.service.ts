
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from 'type-graphql';
import { Express } from 'express';

import { PingResolver } from "../graphql/resolvers/ping";
import { GameResolver } from "../graphql/resolvers/gamesResolver";

export async function startGraphQL(app: Express) {
    //GRAPHQL: in route path of express /graphql
    try {
        
        const server = new ApolloServer({
            schema: await buildSchema({
                resolvers: [PingResolver, GameResolver],
                validate: false
            }),
            context: ({ req, res }) => ({ req, res })
        });

        await server.start();

        server.applyMiddleware({ app, path: '/graphql' })

    } catch (ex) {
        throw new Error("GRAPHQL starting FAILED: " + ex);
    }

}