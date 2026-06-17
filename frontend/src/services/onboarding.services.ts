import { api } from "./api";

interface urlAvailableResponse{
    success:boolean,
    message:string
    data:{
        available:boolean
    }
}
export interface createWorkspaceBody{
    name:string;
    workspaceId:string;
    workspaceType:string
    description?:string;
} 

interface createWorkspaceRes{
    success:boolean,
    message:string,
    data:createWorkspaceBody
}
export const urlAvailable = async (data:{url:string})=>{
    const response = await api.post<urlAvailableResponse>('/workspace/onboard/url-available',data)
    
    return response.data;
}

export const createWorkspace = async (data:createWorkspaceBody)=>{
    const response = await api.post<createWorkspaceRes>('workspace/onboard/create-workspace',data)
    
    return response.data
}

export const toggleOnBoardStatus = async ()=>{
    const response = await api.get('/workspace/onboard/toggleOnBoard-status');
    
    return response
}

export const joinWorkspace = async(data:{workspaceId:string})=>{
    const response = await api.post('/workspace/onboard/join-workspace',data)
    return response;
}