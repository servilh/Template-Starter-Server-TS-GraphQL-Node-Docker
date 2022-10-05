import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import "reflect-metadata";
import Game from '../../../../common/src/models/game';
import { ObjectId } from "mongodb";
import { collections } from "../../services/database.service";

@InputType()
class GameInput {
    @Field()
    name!: string;
    @Field()
    price!: number;
    @Field()
    category!: string;
    @Field({ nullable: true })
    id!: string;
}

@Resolver()
export class GameResolver {

    @Query(() => [Game])
    async getGames() {
        return (await collections.games?.find({}).toArray());

    }

    @Query(() => Game)
    async getGame(@Arg("id") id: string) {
        const query = { _id: new ObjectId(id) };
        return (await collections.games?.findOne(query));
    }

    @Mutation(() => String)
    async createGame(
        @Arg("game") game: GameInput
    ) {
        const result = await collections.games?.insertOne(game);

        return result?.insertedId;
    }

    @Mutation(() => String)
    async upsertGame(
        @Arg("game") game: GameInput
    ) {

        if (game.id) {
            const query = { _id: new ObjectId(game.id) };
            const result = await collections.games?.updateOne(query, {
                $set: {
                    name: game.name,
                    category: game.category,
                    price: game.price
                }
            });
            return game.id;
        } else {
            const result = await collections.games?.insertOne(game);
            return result?.insertedId;
        }
    }

    @Mutation(() => String)
    async deleteGame(@Arg("id") id: string) {
        const query = { _id: new ObjectId(id) };
        if (collections.games) {
            const result = await collections.games.deleteOne(query);
            return id;        }

    }
}