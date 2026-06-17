
import { logoutUser } from "../controllers/user.controller.js";
import { getMembers, getWorkSpaceName } from "../controllers/workspace.controller.js";
import { verifyJWT,isWorkspaceMember } from "../middlewares/auth.middleware.js";
import { Router } from "express";


export const workspaceRoute = Router({mergeParams:true});

workspaceRoute.route('/get-name').post(verifyJWT,isWorkspaceMember,getWorkSpaceName)
workspaceRoute.route('/get-members').post(verifyJWT,isWorkspaceMember,getMembers)
workspaceRoute.route('/logout').post(verifyJWT,logoutUser)