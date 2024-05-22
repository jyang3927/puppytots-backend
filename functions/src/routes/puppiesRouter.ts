import express from "express";
import { getClient } from "../db";
import { ObjectId } from "mongodb";
import { Puppy } from "../models/Puppy";
// import multer from "multer";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// import crypto from 'crypto'; 

// import sharp from 'sharp'; 

// import dotenv from 'dotenv'; 

//firebase cloud 
// import config from "../config/firebase.config"

// const winston = require("winston");
// const logger = winston.createLogger({
//   level: "info",
//   format: winston.format.json(),
//   transports: [
//     new winston.transports.Console()
//   ],
// });

// dotenv.config(); 

// const bucketName = process.env.BUCKET_NAME;
// const bucketRegion = process.env.BUCKET_REGION;
// const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
// const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// const s3 = new S3Client({region: bucketRegion,})

const puppiesRouter = express.Router();

// initializeApp(config.firebaseConfig); 
//initialize Cloud Storage and get reference to the service 
// const storage = getStorage(); 
// //Set up multer as a middleware to grab photo uploads 
// const upload = multer({storage:multer.memoryStorage()});

// const storage = multer.memoryStorage(); 
// const upload = multer({storage:storage}); 

// upload.single('image')

// const createLog = (req:any, res:any, next:any) => {
//     logger.info("hello");
//     const puppy: Puppy = req.body.puppyData; 
//     logger.info("puppy:", puppy);
//     logger.info("req file: ", req.file);
//     next();
// }

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
    // try{
    //     await upload.single("image");     
    // }catch(err:any){
    //     if(err instanceof multer.MulterError){
    //         console.error("MULTER ERROR", err)}
    //     else{
    //         console.log("UNKOWN ERROR")
    //     }
    // }

    // console.log("FILE", req.files)



    
    // try {
    //     await upload.single('image'); 
    //     console.log("MULTER IMAGE UPLOAD WORKS")
    //     // (req, res, (err: any) => {
    //     //   if (err) {
    //     //     // Handle Multer error here (e.g., log error details)
    //     //     console.error("Multer Error:", err);

    //     //     return res.status(500).json({ message: "Upload failed" });
    //     //   }
    //       // ... (continue with your route logic)
    //     }
    //   catch (error) {
    //     // Handle other potential errors 
    //     console.error("Error IN MULTER:", error);
    //     res.status(500).json({ message: "Internal Server Error" });
    //   }

    // logger.info("req.file: ", req.file);
    // logger.info("Body field:", req.body); 

    try{
        // if(!req.file){
        //     throw Error("MISSING FILE")
        // }

        // const imageName = randomImageName(); 

        // const storageRef = ref(storage, `files/${imageName}`); 

        // //Create file metadata including the content type
        // const metadata = {
        //     contentType: req.file.mimetype,
        // }

        // //upload the file in the bucket storage 
        // const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata); 

        // //grab public url 
        // const downloadURL = await getDownloadURL(snapshot.ref); 
        // console.log("File successfully uploaded"); 

        const puppy: Puppy = req.body; 

        // logger.info("puppy: ", puppy)

        // image will be in req.file 
        // need to grab req.file.buffer --> this is what needs to be sent to s3 
        // const file = req.file; 
        //resize image 
        // const buffer = await sharp(file?.buffer).resize({height: 1920, width: 1080, fit:'contain'}).toBuffer(); 

        //Image name randomized 
        // const imageName = randomImageName(); 

        // const params = {
        //     Bucket: bucketName, 
        //     Key: imageName, 
        //     Body: buffer, 
        //     ContentType: file?.mimetype,
        // }
        // const command = new PutObjectCommand(params)
        // await s3.send(command)

        // puppy["imageName"] = downloadURL; 

        const client = await getClient(); 
        await client.db().collection<Puppy>("puppies").insertOne(puppy); 
        res.status(201); 
        res.json(puppy); 
    }catch(err){
        // if (err instanceof multer.MulterError) {
        //     // A Multer error occurred when uploading.
        //     logger.error("MULTER ERROR")
        //   }else {
            errorResponse(err,res); 
        //   }
    }
}); 

puppiesRouter.delete("/puppies/:id", async(req, res) => {
    try{
        const _id: ObjectId = new ObjectId(req.params.id); 
        const client = await getClient(); 
        const result = await client.db().collection<Puppy>("puppies").deleteOne({_id}); 
        if (result.deletedCount) {
            res.sendStatus(204); 
            return result; 
        }else {
            res.status(404); 
            res.send("Puppy not found"); 
            return result;
        }
    } catch(error){
        errorResponse(error,res); 
        return error;
    }
}); 

// puppiesRouter.put("/puppies/:")

export default puppiesRouter;