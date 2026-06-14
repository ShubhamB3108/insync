
import { activeTasks, createTask, deleteTask, toggleStatus } from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";


export const tasksRoute = Router();

tasksRoute.route('/create-task').post(verifyJWT,createTask)
tasksRoute.route('/get-tasks').get(verifyJWT,activeTasks)
tasksRoute.route('/toggle/:taskId').patch(toggleStatus)
tasksRoute.route('/delete/:taskId').delete(deleteTask)

