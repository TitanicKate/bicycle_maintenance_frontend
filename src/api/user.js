import request from "../utils/request.js";

export const registerService = (registerData) => {
    return request.post('/auth/register', registerData)
}

export const loginService = (loginData) => {
    return request.post('/auth/login', loginData)
}

export const addUserService = (userData) => {
    return request.post('/users/add', userData)
}

export const deleteUserService = (id) => {
    return request.delete(`/users/${id}`)
}

export const updateUserService = (userData) => {
    return request.put('/users', userData)
}

export const getUserService = (id) => {
    return request.get(`/users/${id}`)
}

export const getAllUserService = () => {
    return request.get('/users/list')
}

export const deleteBatchUserService = (ids) => {
    return request.delete('/users/batch', { data: ids })
}

export const modifyPassword = (modifyData) => {
    return request.put('/users/password', modifyData)
}