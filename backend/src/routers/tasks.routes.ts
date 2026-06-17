
import { activeTasks, createTask, deleteTask, toggleStatus } from "../controllers/task.controller.js";
import { isWorkspaceMember, verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";


export const tasksRoute = Router({mergeParams:true});

tasksRoute.route('/create-task').post(verifyJWT,isWorkspaceMember,createTask)
tasksRoute.route('/get-tasks').get(verifyJWT,isWorkspaceMember,activeTasks)
tasksRoute.route('/toggle/:taskId').patch(toggleStatus)
tasksRoute.route('/delete/:taskId').delete(deleteTask)

