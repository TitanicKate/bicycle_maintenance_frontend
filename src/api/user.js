import request from "../utils/request.js";

export const registerService = (registerData) => {
    return request.post('/auth/register', registerData)
}

export const loginService = (loginData) => {
    return request.post('/auth/login', loginData)
}