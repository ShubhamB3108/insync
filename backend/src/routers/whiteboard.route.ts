import { Router } from "express";
import { isWorkspaceMember, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createWhiteboard,
  getWorkspaceWhiteboards,
  getWhiteboard,
  updateWhiteboard,
  deleteWhiteboard,
} from "../controllers/whiteboard.controller.js";

const boardRoute = Router({mergeParams:true});



boardRoute
  .route("/create-board")
  .post(verifyJWT,isWorkspaceMember,createWhiteboard);

boardRoute
  .route("/get-boards")
  .get(getWorkspaceWhiteboards);

boardRoute
  .route("/:whiteboardId")
  .get(getWhiteboard)
  .put(updateWhiteboard)
  .delete(deleteWhiteboard);

export default boardRoute;