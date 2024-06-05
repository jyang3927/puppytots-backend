import express from 'express'; 
import {getClient} from '../db'; 
// import { ObjectId } from 'mongodb';
import { Dog } from '../models/Dog';
import { ObjectId } from 'mongodb';

const dogsRouter = express.Router(); 

const errorResponse = (error:any, res: any) => {
    console.error("FAIL", error); 
    res.status(500).json({message:"Internal Server Error"}); 
}; 

dogsRouter.get("/ourDogs/getDogs", async(req,res) => {
    try{
        const client = await getClient(); 
        const results = await client.db().collection<Dog>("dogs").find().toArray(); 
        res.status(200); 
        res.json(results); 
    } catch(err) {
        errorResponse(err,res); 
    }
}); 

dogsRouter.post("/ourDogs/dogPost", async(req, res) => {
    try{
        const dog: Dog = req.body; 
        const client = await getClient(); 
        await client.db().collection<Dog>("dogs").insertOne(dog); 
        res.status(201); 
        res.json(dog); 
    }catch(err){
        errorResponse(err,res); 
    }
}); 

dogsRouter.patch("/dogs/update/:id", async(req, res) => {
    try{
        const _id: ObjectId = new ObjectId(req.params.id); 
        const updatedDog: Dog = req.body; 
        const client = await getClient(); 
        const result = await client
        .db()
        .collection<Dog>("dogs")
        .updateOne(
            {_id}, 
            {$set: 
                {breed: updatedDog.breed,  
                name: updatedDog.name,
                sex: updatedDog.sex, 
                weight: updatedDog.weight, 
                details: updatedDog.details, 
                imageName: updatedDog.imageUrl

            }}); 

        if(result.matchedCount){
            res.status(200); 
            res.json(updatedDog); 
        }else {
            res.status(404); 
            res.send("Dog not found"); 
        }
    }catch(err)
{
    errorResponse(err,res); 
}})


dogsRouter.delete("/ourDogs/:id", async(req,res) => {
    try{
        const _id: ObjectId = new ObjectId(req.params.id); 
        const client = await getClient(); 
        const result = await client.db().collection<Dog>("dogs").deleteOne({_id}); 
        if(result.deletedCount){
            res.sendStatus(204); 
        }else{
            res.status(404); 
            res.send("Dog not found"); 
        }
    } catch(error){
        errorResponse(error,res); 
    }
})
export default dogsRouter; 

