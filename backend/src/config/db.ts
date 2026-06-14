import mongoose, {Mongoose} from "mongoose";
import {env} from '../utils/env.js';
import { logger } from "../utils/logger.js";
import { dbName } from "../utils/constant.js";

export const connectToDb = async ()=>{
    try{
        const connectionInstance:Mongoose = await mongoose.connect(`${env.mongo_url}/${dbName}`)
        logger.info(`the ${dbName} has been connected and the host is ${connectionInstance.connection.host}`)
    }
    catch(error){
        if(error instanceof Error){
        logger.error(error.message)

        }
    }
}

