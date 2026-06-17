import mongoose from "mongoose";

export interface IMessage{
    message:string,
    senderId:mongoose.Types.ObjectId,
    senderName:string,
    workspaceId:string,
}

const messageSchema = new mongoose.Schema<IMessage>({
    message:{
        type:String,
    }
    ,
    senderId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }
    ,
    senderName:{
        type:String
    }
    ,
    workspaceId:{
        type:String
    }

},{timestamps:true}) 

export const Message = mongoose.model<IMessage>("Message",messageSchema)