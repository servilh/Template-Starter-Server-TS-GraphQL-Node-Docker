import {Arg, Mutation, Query, Resolver} from 'type-graphql';
import "reflect-metadata";

@Resolver()
export class GameResolver {
    
    @Query(() => String)
    getAll() {
        return "alll Games";
    }

    @Mutation(() => Boolean)
    createGame(
        @Arg("name") name: string, 
        @Arg("price") price: number, 
        @Arg("category") category: string
    ){
        console.log(name, category);
        return true;
    }
}