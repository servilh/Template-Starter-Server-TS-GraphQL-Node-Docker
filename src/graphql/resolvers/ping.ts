import {Query, Resolver} from 'type-graphql';
import "reflect-metadata";

@Resolver()
export class PingResolver {
    
    @Query(() => String)
    ping() {
        return "Pong";
    }
}