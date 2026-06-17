
import { api } from "./api.js";

export interface RegisterBody {

    firstName:string,
    lastName:string,
    email:string,
    password:string,
    confirmPassword:string

}

export interface LoginBody{
    email:string,
    password:string
}

export interface User{
    _id:string,
    firstName:string,
    email:string
    onBoarded:boolean
    workspaceId:string
}

export interface AuthResponse{
    success:boolean,
    message:string
    data:{
        user:User,
        userAccessToken:string,
        userRefreshToken:string
    }
}

export interface RegisterRes{
    success:boolean;
    message:string;
    data:User;
}
export const registerUser = async (data:RegisterBody) : Promise<RegisterRes> => {
    const response = await api.post<RegisterRes>(`/users/register`,data);
    
    return response.data

}

export const loginUser = async (data:LoginBody) : Promise<AuthResponse> => {
    
    const response = await api.post<AuthResponse>(`/users/login`,data);
    
    return response.data
}

export const logoutUser = async (data:{workspaceId:string}) => {
    
    const response = await api.post<AuthResponse>(`/workspace/${data.workspaceId}/logout`,data);
    
    return response.data
}

export const getUserDetails = async ()=>{
    const res = await api.get('/users/user-details')
    
    return res.data
}
