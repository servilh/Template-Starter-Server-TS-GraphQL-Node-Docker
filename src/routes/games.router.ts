// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Game from "../../../common/src/models/game";
import ApiResult from "../../../common/src/models/apiResult";
// Global Config
export const gamesRouter = express.Router();

gamesRouter.use(express.json());
// GET
gamesRouter.get("/", async (_req: Request, res: Response) => {
    try {
        if(collections.games) {
            const games = await collections.games.find({}).toArray();
            
            res.status(200).send(games);
        }
        
    } catch (error:any) {
        res.status(500).send(error.message);
    }
});
gamesRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        
        const query = { _id: new ObjectId(id) };
        if(collections.games) {
            const game = (await collections.games.findOne(query)) as Game | null;

            if (game) {
                res.status(200).send(game);
            }
        }
        
    } catch (error) {
        res.status(404).send(new ApiResult( `Unable to find matching document with id: ${req.params.id}` ));
    }
});
// POST
gamesRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newGame = req.body as Game;
        if(collections.games) {
            const result = await collections.games.insertOne(newGame);

            result
                ? res.status(201).send(new ApiResult( `Successfully created a new game with id ${result.insertedId}`))
                : res.status(500).send(new ApiResult( "Failed to create a new game." ));
        }        
    } catch (error: any) {
        console.error(error);
        res.status(400).send(error.message);
    }
});
// PUT
gamesRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedGame: Game = req.body as Game;
        const query = { _id: new ObjectId(id) };
        if(collections.games) {
            const result = await collections.games.updateOne(query, { $set: updatedGame });
            result
            ? res.status(200).send(new ApiResult( `Successfully updated game with id ${id}` ))
            : res.status(304).send(new ApiResult( `Game with id: ${id} not updated` ));
        }
        
       
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
// DELETE
gamesRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        if(collections.games) {
            const result = await collections.games.deleteOne(query);

            if (result && result.deletedCount) {
                res.status(202).send(new ApiResult( `Successfully removed game with id ${id}` ));
            } else if (!result) {
                res.status(400).send(new ApiResult( `Failed to remove game with id ${id}` ));
            } else if (!result.deletedCount) {
                res.status(404).send(new ApiResult( `Game with id ${id} does not exist`));
            }
        }
        
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});