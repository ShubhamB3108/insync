import mongoose,{Schema,Document} from "mongoose";
import bcrypt from 'bcrypt'
export interface IWorkspace extends Document{
    name:string;
    workspaceId:string;
    workspaceType:string
    description?:string;
    owner: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    tasks:mongoose.Types.ObjectId[];
    messages:mongoose.Types.ObjectId[];
}

const workspaceSchema:Schema = new mongoose.Schema<IWorkspace>({
        name:{
            type:String,
            required:true,
            trim:true
        },
        workspaceType:{
            type:String,
        },
        workspaceId:{
            type:String,
            required:true,
            unique:true,
        },

        description:{
            type:String,
        },
        
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        members:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ],

        tasks:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Task"
            }
        ],

        messages:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Message"
            }
        ]
        

},{timestamps:true})

export const Workspace = mongoose.model<IWorkspace>("Workspace",workspaceSchema)
