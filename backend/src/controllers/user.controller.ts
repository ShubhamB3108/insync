import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {response, type Request,type Response} from 'express'
import { User } from "../models/user.model.js";
import  { Types } from "mongoose";
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { env } from "../utils/env.js";

const generateAccessAndRefreshTokens = async(userId:Types.ObjectId)=>{
    try{
        const user = await User.findById(userId);
        
        const userRefreshToken = user!.generateRefreshToken()
        const userAccessToken =  user!.generateAccessToken()

        user!.refreshToken = userRefreshToken;
        await  user!.save({validateBeforeSave:false})
        return {userAccessToken,userRefreshToken}
    }   

    catch(error){
        throw new ApiError(500,"something went wrong while generating access and refresh token");
    }
}   


export const refreshAccessToken = AsyncHandler(async (req:Request,res:Response)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Access")
    }

    const decodedToken = jwt.verify(incomingRefreshToken,env.refresh_token_secret) as JwtPayload

    const user = await User.findById(decodedToken._id);

    if(!user){
        throw new ApiError(404,"No user found")
    }

    if(user.refreshToken != incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Access")
    }   

   const {userAccessToken,userRefreshToken} = await generateAccessAndRefreshTokens(user._id)

   const options = {
        httpOnly:true,
        secure:true,
        sameSite: "none" as const,
        
    }

   res.status(200)
   .cookie("accessToken",userAccessToken,options)
   .cookie("refreshToken",userRefreshToken,options)
   .json(
    new ApiResponse(
        200,
        {
            userAccessToken,
            userRefreshToken
        },
        "Access Token Refreshed"

    )
   )

})


interface RegisterBody {

    firstName:string,
    lastName:string,
    email:string,
    password:string,
    confirmPassword:string

}
interface LoginBody{
    email:string,
    password:string,
}
export const registerUser = AsyncHandler(
  async (
    req: Request<{}, {}, RegisterBody>,
    res: Response
  ): Promise<void> => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (
      [firstName, lastName, email, password, confirmPassword].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    if (password !== confirmPassword) {
      throw new ApiError(
        400,
        "Confirm Password should be same as Password"
      );
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      throw new ApiError(409, "User already exists");
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    const { userAccessToken, userRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const createdUser = await User.findById(user._id)
      .select("-password -refreshToken");

   const options = {
        httpOnly:true,
        secure:true,
        sameSite: "none" as const,
        
    }

    res
      .status(201)
      .cookie("accessToken", userAccessToken, options)
      .cookie("refreshToken", userRefreshToken, options)
      .json(
        new ApiResponse(
          201,
          createdUser,
          "User created successfully"
        )
      );

    return;
  }
);

export const loginUser  = AsyncHandler(async (req:Request<{},{}, LoginBody>,res:Response):Promise<void> => {
    
    const {email,password} = req.body;

    if([email,password].some((field) => field?.trim() === "")){
        throw new ApiError(400,"All field required")
    }

    let user = await User.findOne({email}).select("+password");

    if(!user){
        throw new ApiError(404,"User not Found");
    }
    
    if(!(await user.isPasswordCorrect(password))){
        throw new ApiError(401,"Invalid Password")
    }
    
    const {userAccessToken,userRefreshToken} = await generateAccessAndRefreshTokens(user._id);

    user = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly:true,
        secure:true,
        sameSite: "none" as const,
        
    }

    res.status(200)
    .cookie("accessToken",userAccessToken,options)
    .cookie("refreshToken",userRefreshToken,options)
    .json(
        new ApiResponse(200,{user:user,userAccessToken,userRefreshToken},"User logged In succesfully")
    )

})

export const logoutUser = AsyncHandler(async (req:Request,res:Response):Promise<void> => {
        await User.findByIdAndUpdate(
            req.user!._id,
            {
                $unset:{
                    refreshToken:1
                }
            }
        )

        const options = {
        httpOnly:true,
        secure:true,
        sameSite: "none" as const
    }

        res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(
            new ApiResponse(
                200,"User Logged out Successfully"
            )
        )
        
})

export const getUserDetails = AsyncHandler(async (req:Request,res:Response)=>{
    const user =  req.user!
      res.status(200).json(
        new ApiResponse(
          200,
          user,
          'user details'
        )
      )

})






