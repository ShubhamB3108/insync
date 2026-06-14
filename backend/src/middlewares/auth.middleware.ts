import AsyncHandler from "../utils/AsyncHandler.js"
import type { Response,Request } from "express"
import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { env } from "../utils/env.js"

interface accessTokenBody{
    _id:string
}
export const verifyJWT = AsyncHandler(async (req:Request,res:Response,next) =>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " ,"");
    if(!token){
        throw new ApiError(401,"Unauthorize Request")
    }

    const decodedToken = jwt.verify(token,env.access_token_secret) as accessTokenBody

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if(!user) {
        throw new ApiError(401,"invalid access Token")
    }

    req.user = user

    next()
})