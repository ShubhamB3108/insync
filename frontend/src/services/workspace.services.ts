
import { api } from "./api";

export const getWorkspaceName = async(data:{workspaceId:string}) => {
            const response = await api.post(`/workspace/${data.workspaceId}/get-name`,data)
            
            return response.data
}