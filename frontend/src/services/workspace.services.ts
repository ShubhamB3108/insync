
import { api } from "./api";

export const getWorkspaceName = async(data:{workspaceId:string}) => {
            const response = await api.post(`/workspace/${data.workspaceId}/get-name`,data)
            
            return response.data
}

export const getMembers = async(data:{workspaceId:string}) =>{
    const res = await api.post(`/workspace/${data.workspaceId}/get-members`,data)
    
    return res.data
}