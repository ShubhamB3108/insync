import mongoose, { Document, Schema, Types } from "mongoose";

export interface IWhiteboard extends Document {
  title: string;
  type: "flowchart" | "mindmap" | "kanban" | "wireframe" | "brainstorm";

  workspaceId: string;
  owner: string,

  scene: {
    elements: any[];
    appState: Record<string, any>;
    
  };

  createdAt: Date;
  updatedAt: Date;
}

const WhiteboardSchema = new Schema<IWhiteboard>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "flowchart",
        "mindmap",
        "kanban",
        "wireframe",
        "brainstorm",
      ],
      default: "flowchart",
      required: true,
    },

    workspaceId: {
      type:String
    },

    owner: {
      type:String
    },

    scene: {
      elements: {
        type: [Schema.Types.Mixed],
        default: [],
      },

      appState: {
        type: Schema.Types.Mixed,
        default: {},
      },

      
    },
  },
  {
    timestamps: true,
  }
);


export const Whiteboard = mongoose.model<IWhiteboard>(
  "Whiteboard",
  WhiteboardSchema
);