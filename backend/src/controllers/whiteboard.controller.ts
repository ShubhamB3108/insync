import type { Request,Response } from "express";
import { Whiteboard } from "../models/whiteboard.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";

export const createWhiteboard = AsyncHandler(
  async (req: Request, res: Response) => {
    const { title, workspaceId, type } = req.body;

    const whiteboard = await Whiteboard.create({
      title,
      type,
      workspaceId,
      owner: req.user!.firstName,
      scene: {
        elements: [],
        appState: {},
        files: {},
      },
    });

    return res.status(201).json({
      success: true,
      message: "Whiteboard created successfully",
      whiteboard,
    });
  }
);


export const getWorkspaceWhiteboards = AsyncHandler(
  async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    const whiteboards = await Whiteboard.find({
      workspaceId:workspaceId!
    })
      .populate("owner", "username email")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      whiteboards,
    });
  }
);

export const getWhiteboard = AsyncHandler(
  async (req: Request, res: Response) => {
    const { whiteboardId } = req.params;

    const whiteboard = await Whiteboard.findById(
      whiteboardId
    ).populate("owner", "username email");

    if (!whiteboard) {
      return res.status(404).json({
        success: false,
        message: "Whiteboard not found",
      });
    }

    return res.status(200).json({
      success: true,
      whiteboard,
    });
  }
);

export const updateWhiteboard = AsyncHandler(
  async (req: Request, res: Response) => {
    const { whiteboardId } = req.params;
    const { scene } = req.body;

  const whiteboard =   await Whiteboard.findByIdAndUpdate(
        whiteboardId,
        {
            scene,
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
        );

    if (!whiteboard) {
      return res.status(404).json({
        success: false,
        message: "Whiteboard not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Whiteboard updated successfully",
      whiteboard,
    });
  }
);

export const deleteWhiteboard = AsyncHandler(
  async (req: Request, res: Response) => {
    const { whiteboardId } = req.params;

    const whiteboard = await Whiteboard.findByIdAndDelete(
      whiteboardId
    );

    if (!whiteboard) {
      return res.status(404).json({
        success: false,
        message: "Whiteboard not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Whiteboard deleted successfully",
    });
  }
);