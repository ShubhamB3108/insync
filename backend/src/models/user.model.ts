
import mongoose, { Document, Schema, } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { access_token_expiry,refresh_token_expiry } from "../utils/constant.js";
import { env } from "../utils/env.js";

export interface IUser extends Document{
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    onBoarded:boolean;
    workspaceId:string;
    refreshToken?:string;
    tasks:mongoose.Types.ObjectId[]
    isPasswordCorrect(password:string) : Promise<boolean>;
    generateAccessToken() : string;
    generateRefreshToken():string;
}

const userSchema:Schema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            required:true,
        },
        lastName:{
            type:String,

        },
        onBoarded:{
            type: Boolean,
            default:false
        },

        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
            select:false
        },

        workspaceId:{
            type:String,
        }

        ,
        refreshToken:{
            type:String,

        },
        tasks:[
            {
                type:mongoose.Types.ObjectId,
                ref:"Task"
            }
        ]

            
    }
,{timestamps:true})

userSchema.pre("save",async function () {
    if(!this.isModified("password")) {
        return
    }

    this.password = await bcrypt.hash(this.password as string,10)
    
})

userSchema.methods.isPasswordCorrect = async function (password:string){
    
    return await bcrypt.compare(password,this.password)
    
}

userSchema.methods.generateAccessToken = function ():string {
    return jwt.sign(
        {
            _id:this._id,
            
        },
        env.access_token_secret,
        {
            expiresIn:access_token_expiry,
        }
    )
}

userSchema.methods.generateRefreshToken = function ():string{
   return  jwt.sign(
        {
            _id:this._id,
            
        },
        env.refresh_token_secret,
        {
            expiresIn:refresh_token_expiry
        }
    )
}

export const User = mongoose.model<IUser>("User",userSchema)


