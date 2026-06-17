import { Message } from "../models/message.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import type { IMessage } from "../models/message.model.js";
import type { Request,Response } from "express";
import mongoose from "mongoose";
import { Workspace } from "../models/workspace.model.js";
import { User } from "../models/user.model.js";
import { io } from "../index.js";

export const createMessage = AsyncHandler(async (req:Request,res:Response)=>{

        if(!req.user){
            throw new ApiError(404,"no user found")
        }

        if(!req.params.workspaceId){
            throw new ApiError(404,"no workspace found")
        }
        if(!req.body){
            throw new ApiError(404,"no req body found")
        }
        const {message} = req.body;
        const senderId:mongoose.Types.ObjectId = req.user._id;
        const workspaceId = req.params.workspaceId as string;
        const senderName = req.user.firstName as string
        const workspace = await Workspace.findOne({workspaceId:workspaceId});

        if(!workspace){
            throw new ApiError(404,"workspace not found")
        }

        const newMessage = await Message.create({
                message,
                senderId,
                senderName,
                workspaceId,

        })

        io.to(workspaceId).emit("message-created",newMessage)
        
        workspace!.messages.push(newMessage._id)
        await workspace!.save()

        res.status(200).json(
            new ApiResponse(
                200,
                newMessage,
                "new message has been created"
            )
        )

        
})

export const getMessages = AsyncHandler(async (req:Request,res:Response)=>{

    if(!req.params.workspaceId){
        throw new ApiError(404,"params not found")
    }
    const workspaceId = req.params.workspaceId as string;
    const message = await Workspace.findOne({workspaceId:workspaceId!}).populate("messages");
    
    res.status(200).json(
        new ApiResponse(200,message?.messages,"these are the messages")
    )

})

export const deleteMessage = AsyncHandler(async (req:Request,res:Response)=>{
    
    const workspaceId = req.params.workspaceId
    if(!workspaceId){
        throw new ApiError(404,"workspace not fopund")
    }
    if(!req.body.id){
        throw new ApiError(404,"message not fopund")
    }
    await Message.findByIdAndDelete(req.body.id!)

    await Workspace.findOneAndUpdate(
            {workspaceId:workspaceId},
            {
                $pull: {
                messages: req.body.id,
                },
            }
            );

    io.to(workspaceId).emit("message-deleted", { id: req.body.id! })

    res.status(200).json(
        new ApiResponse(
            200,    
            {},
            "Message Deleted"
        )
    )

})

export const updateMessage = AsyncHandler(async (req: Request, res: Response) => {
    const { workspaceId : workspaceId, id: id, newMessage: newMessage } = req.body;
    if (!workspaceId || !id || !newMessage) {
        throw new ApiError(400, "Missing required parameters (workspaceId, id, or message)");
    }

    const targetMessage = await Message.findById(id);

    if (!targetMessage) {
        throw new ApiError(404, "Message not found");
    }

    const updatedMessage = await Message.findByIdAndUpdate(
        id,
        { message: newMessage },
        { returnDocument: "after" } 
    );

    if (!updatedMessage) {
        throw new ApiError(500, "Failed to update the message document");
    }

    io.to(workspaceId).emit("message-updated", updatedMessage);

    res.status(200).json(
        new ApiResponse(
            200,
            updatedMessage, 
            "The message has been updated successfully"
        )
    );
});