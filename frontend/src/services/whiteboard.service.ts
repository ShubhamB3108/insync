/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./api";

export interface Whiteboard {
  _id: string;
  title: string;
  type: string;
  workspaceId: string;
  owner: string;
  createdAt: string;

  scene: {
    elements: readonly any[];
    appState: Record<string, any>;
    
  };
}

interface CreateWhiteboardBody {
  title: string;
  type: string;
  workspaceId: string;
}

interface WhiteboardResponse {
  success: boolean;
  message: string;
  whiteboard: Whiteboard;
}

export const createWhiteboard = async (
  data: CreateWhiteboardBody
) => {
    console.log(data.workspaceId)
  const res = await api.post<WhiteboardResponse>(
    `/workspace/${data.workspaceId}/whiteboard/create-board`,
    data
  );

  return res.data.whiteboard;
};

export const getWorkspaceWhiteboards = async (
  data: { workspaceId: string }
) => {
  const res = await api.get(
    `/workspace/${data.workspaceId}/whiteboard/get-boards`
  );

  return res.data.whiteboards;
};

export const getWhiteboard = async (
  data: { workspaceId: string; whiteboardId: string }
) => {
  const res = await api.get(
    `/workspace/${data.workspaceId}/whiteboard/${data.whiteboardId}`
  );

  return res.data.whiteboard;
};

export const updateWhiteboard = async (
  data: {
    workspaceId: string;
    whiteboardId: string;
    scene: Whiteboard["scene"];
  }
) => {
  const res = await api.put(
    `/workspace/${data.workspaceId}/whiteboard/${data.whiteboardId}`,
    {
      scene: data.scene,
    }
  );

  return res.data.whiteboard;
};

export const deleteWhiteboard = async (
  data: {
    workspaceId: string;
    whiteboardId: string;
  }
) => {
  const res = await api.delete(
    `/workspace/${data.workspaceId}/whiteboard/${data.whiteboardId}`
  );

  return res.data;
};