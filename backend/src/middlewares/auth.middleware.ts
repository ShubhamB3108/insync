import AsyncHandler from "../utils/AsyncHandler.js"
import type { Response,Request } from "express"
import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { env } from "../utils/env.js"
import { Workspace } from "../models/workspace.model.js"
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

export const isWorkspaceMember = AsyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const workspaceId = req.params.workspaceId as string;
    
    const workspace = await Workspace.findOne({
      workspaceId:workspaceId,
    });

    
    if (!workspace) {
      throw new ApiError(404, "Workspace not found");
    }

    const isMember = workspace.members.some(
      (member) =>
        member.toString() === req.user!._id.toString()
    );

    if (!isMember) {
      throw new ApiError(
        403,
        "You are not a member of this workspace"
      );
    }

    next();
  }
);
