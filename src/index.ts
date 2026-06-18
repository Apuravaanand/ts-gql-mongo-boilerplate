import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import {
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { resolvers } from './resolvers'
// import { connectToMongo } from "./utils/mongo";
// import { verifyJwt } from "./utils/jwt";
// import { User } from "./schema/user.schema";
// import Context from "./types/context";
// import authChecker from "./utils/authChecker";

async function bootstrap() {
    // 1. build schema
    const schema = await buildSchema({
        resolvers,
        // authChecker
    })

    // 2. init express
    const app = express();
    app.use(cookieParser())

    // 3. apollo server
    const server = new ApolloServer({
        schema,
        context: (ctx: Context) => {
            const context = ctx;

            if (ctx.req.cookies.accessToken) {
                const user = verifyJwt<User>(ctx.req.cookies.accessToken);
                context.user = user;
            }
            return context;
        },
        plugins: [
            process.env.NODE_ENV === "production"
                ? ApolloServerPluginLandingPageProductionDefault()
                : ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
    });

    // 
    await server.start();
    // apply middleware to server
    server.applyMiddleware({ app });
    // Change this line in your bootstrap function
    server.applyMiddleware({ app, path: '/grapghql' });
    // 
    app.listen({ port: 4000 }, () => {
        console.log("App is listening on http://localhost:4000");
    });
    //   connectToMongo();
}

bootstrap()