import express from "express";
import { getClient } from "../db";
import { ObjectId } from "mongodb";
import { Puppy } from "../models/Puppy";
import multer from 'multer'; 

const puppiesRouter = express.Router(); 

const errorResponse = (error: any, res: any) => {
    console.error("FAIL", error);
    res.status(500).json({ message: "Internal Server Error" });
};

puppiesRouter.get("/puppies/:breed", async(req,res) => {
    try{
        const puppyBreed = req.params.breed; 
        const client = await getClient(); 
        const results = await client.db().collection<Puppy>("puppies").find({"breed":puppyBreed}).toArray(); 
        res.status(200); 
        res.json(results); 
    }catch(err){
        errorResponse(err, res); 
    }
}); 

puppiesRouter.post("/puppies", async(req, res) => {
    try{
        const puppy: Puppy = req.body; 
        const client = await getClient(); 
        await client.db().collection<Puppy>("puppies").insertOne(puppy); 
        res.status(201); 
        res.json(puppy); 
    }catch(err){
        errorResponse(err,res); 
    }
}); 

puppiesRouter.delete("/puppies/:id", async(req, res) => {
    try{
        const _id: ObjectId = new ObjectId(req.params.id); 
        const client = await getClient(); 
        const result = await client.db().collection<Puppy>("puppies").deleteOne({_id}); 
        if (result.deletedCount) {
            res.sendStatus(204); 
        }else {
            res.status(404); 
            res.send("Puppy not found"); 
        }
    } catch(error){
        errorResponse(error,res); 
    }
}); 

// puppiesRouter.put("/puppies/:")

export default puppiesRouter;