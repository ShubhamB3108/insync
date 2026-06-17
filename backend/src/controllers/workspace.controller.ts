import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {response, type Request,type Response} from 'express'
import { Workspace } from "../models/workspace.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { env } from "../utils/env.js";

export const urlAvailable = AsyncHandler(async (req:Request,res:Response) =>{
        const {url} = req.body;
        
        const workspace = await Workspace.findOne({workspaceId:url})

        if(!workspace){
            res.status(200).json(
                new ApiResponse(
                    200,
                   {available:true},
                    "The url is available"
                )
            )
        }
        else{
            res.json(new ApiResponse(200,{available:false},"the url is not available"))
        }
})

export const createWorkspace = AsyncHandler(async (req:Request,res:Response)=>{
    const {name,workspaceId,password,workspaceType,description} = req.body;
    
    const owner:mongoose.Types.ObjectId = req.user!._id;
    const member:mongoose.Types.ObjectId = owner

    const workspace = await Workspace.create({
        name,
        workspaceId,
        workspaceType,
        description,
        owner,
        members:[member]
    })


    const user = await User.findById(owner);
    user!.workspaceId = workspaceId

    await user!.save()
    res.status(200).json(
        new ApiResponse(
            200,
            workspace,
            "The Workspace has been Created"
        )
    )

})

export const toggleOnBoardStatus = AsyncHandler(async (req:Request,res:Response)=>{

    const findUser = await User.findById(req.user!._id)

    if(findUser){

        findUser.onBoarded = true
        await findUser.save()

        res.status(200).json(
            new ApiResponse(
                200,
                findUser.onBoarded,
                "The user has been Onboarded"
            )
        )
    }

})

export const joinWorkspace = AsyncHandler(async (req:Request,res:Response)=>{
        const userId = req.user!._id
        const user = await User.findById(userId)

        const {workspaceId} = req.body
        
        const workspace = await Workspace.findOne({workspaceId:workspaceId})
        workspace?.members.push(userId)

        user!.workspaceId = workspaceId
        await workspace!.save()
        await user!.save()

        res.status(200).json(
            new ApiResponse(200,user,"the user has joined")
        )
} )

export const getWorkSpaceName = AsyncHandler(async (req:Request,res:Response)=>{
    const workspaceId = req.params.workspaceId as string
    const workspace = await Workspace.findOne({workspaceId:workspaceId})
    if(!workspace){
        new ApiError(400,"workspace not found")
        return
    }
    res.status(200).json(
        new ApiResponse(
            200,
            workspace!.name,
            "here is the workspace name"
        )
    )
})

export const getMembers = AsyncHandler(async (req:Request,res:Response)=>{
    const workspaceId = req.params.workspaceId as string
    const workspace = await Workspace.findOne({workspaceId:workspaceId!}).populate("members")

    res.status(200).json(
       new ApiResponse( 200,
        workspace,
        "members")
    )
    

})