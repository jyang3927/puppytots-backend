import * as functions from "firebase-functions"; 
import express, {ErrorRequestHandler} from "express"; 
import cors from 'cors'; 
import dogsRouter from './routes/dogsRouter';
import puppiesRouter from './routes/puppiesRouter';

import * as dotenv from 'dotenv'
dotenv.config(); 

const app = express(); 
app.use(cors()); 
app.use(express.json()); 


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json({ message: "Internal Server Error" });
  };

app.use(errorHandler); 


app.use("/api", puppiesRouter); 
app.use("/api", dogsRouter); 

export const backendAPI = functions.https.onRequest(app);