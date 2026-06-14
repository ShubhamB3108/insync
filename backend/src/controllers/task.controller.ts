import { Task } from "../models/tasks.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import type { ITask } from "../models/tasks.model.js";
import type { Request,Response } from "express";
import mongoose from "mongoose";
import { Workspace } from "../models/workspace.model.js";
import { User } from "../models/user.model.js";

export const createTask = AsyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const { task, description } = req.body;

    const owner = req.user!._id;
    const workspaceId = req.user!.workspaceId

    const createdTask = await Task.create({
      task,
      description,
      workspaceId,
      owner,
    });

    const workspace = await Workspace.findOne({ workspaceId:workspaceId });

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    workspace.tasks.push(createdTask!._id);
    await workspace.save();

    const user = await User.findById(owner);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.tasks.push(createdTask._id);
    await user.save();

    const id = createdTask._id;
    const status = createdTask.status;
    const name = user.firstName;

    res.status(200).json(
        new ApiResponse(
            200,
            { id, name, task, description, status },
            "The task has been created"
        )
    );
});

export const activeTasks = AsyncHandler(
  async (req: Request, res: Response) => {
    
    const workspaceId = req.user!.workspaceId

    const workspace = await Workspace.findOne({ workspaceId:workspaceId });
    
    if (!workspace) {
      throw new ApiError(404, "Workspace not found");
    }

    const allTask = workspace.tasks;

    const activeTasks = await Task.find({
      _id: { $in: allTask },
      status: "todo",
    }).populate("owner", "firstName");

    const completedTasks = await Task.find({
      _id: { $in: allTask },
      status: "complete",
    }).populate("owner", "firstName");

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          activeTasks,
          completedTasks,
        },
        "These are the active tasks"
      )
    );
  }
);

export const toggleStatus = AsyncHandler(async (req:Request,res:Response)=>{
    
    const {taskId} = req.params

    const task = await Task.findById(taskId)

    task!.status = task!.status === "todo"?"complete":"todo"

    await task!.save()
    
    res.status(200).json(
        new ApiResponse(
            200,
            task,
            "the status has been toggled"
        )
    )
})


export const deleteTask = AsyncHandler(async (req:Request,res:Response)=>{
    const {taskId} = req.params

    await Task.findByIdAndDelete(taskId);


    res.status(200).json(
        new ApiResponse(
            200,
            "the task has been deleted"
        )
    )

})