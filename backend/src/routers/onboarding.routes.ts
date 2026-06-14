import { createWorkspace, joinWorkspace, urlAvailable } from "../controllers/workspace.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { toggleOnBoardStatus } from "../controllers/workspace.controller.js";

export const onboardRoute = Router();

onboardRoute.route('/url-available').post(urlAvailable)
onboardRoute.route('/create-workspace').post(verifyJWT,createWorkspace)
onboardRoute.route('/toggleOnBoard-status').get(verifyJWT,toggleOnBoardStatus)
onboardRoute.route('/join-workspace').post(verifyJWT,joinWorkspace)