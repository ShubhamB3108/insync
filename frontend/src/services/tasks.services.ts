import { api } from "./api";

export interface Task{
    task:string,
    description:string,
}

export interface TaskResBody{
    id:string,
    task:string,
    description:string,
    owner:string,
    status:string,

}
export interface resBody{
    success:boolean,
    message:string,
    data:TaskResBody
}
export const createTask = async(data:Task,workspaceId:string)=>{

    const response = await api.post<TaskResBody>(`/workspace/${workspaceId}/tasks/create-task`,data);
    return response.data;


}

export const getTasks = async(workspaceId:string)=>{
    const response = await api.get(`/workspace/${workspaceId}/tasks/get-tasks`)

    return response.data
}

export const toggleStatus = async(taskId:string,workspaceId:string)=>{
    const response = await api.patch<resBody>(`/workspace/${workspaceId}/tasks/toggle/${taskId}`)
    
    return response.data
}

export const deleteTask = async(taskId:string,workspaceId:string) =>{
    const response = await api.delete<resBody>(`/workspace/${workspaceId}/tasks/delete/${taskId}`)
    console.log(response)
    return response.data
}