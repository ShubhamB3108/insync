import mongoose,{Schema,Document} from "mongoose";


export interface ITask extends Document{

    task:string;
    description?:string;
    workspaceId:string;
    owner:mongoose.Types.ObjectId;
    status: "complete" | "todo";

}   

const taskSchema:Schema = new mongoose.Schema<ITask>(
    {
        task:{
            type:String,
            required:true,
            lowercase:true,
            trim:true
        },

        description:{
            type:String,
            trim:true
        },

        workspaceId:{
            type:String,
        },

        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },

        status:{
            type:String,
            enum:["complete" , "todo" , "inprogress"],
            default:"todo",
            required:true
        },

    }
    ,{timestamps:true})



export const Task = mongoose.model<ITask>("Task",taskSchema)
