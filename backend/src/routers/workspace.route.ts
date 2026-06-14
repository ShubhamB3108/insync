
import { getWorkSpaceName } from "../controllers/workspace.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";


export const workspaceRoute = Router({mergeParams:true});

workspaceRoute.route('/get-name').post(getWorkSpaceName)

