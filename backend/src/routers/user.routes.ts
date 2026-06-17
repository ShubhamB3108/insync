import { Router } from "express";
import {registerUser,loginUser,refreshAccessToken, logoutUser, getUserDetails} from '../controllers/user.controller.js'

import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRoute = Router();

userRoute.route("/register").post(registerUser)
userRoute.route("/login").post(loginUser)

userRoute.route('/user-details').get(verifyJWT,getUserDetails)
userRoute.route('/refresh-token').post(refreshAccessToken)

export default userRoute