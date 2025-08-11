import request from "../utils/request.js";

export const addOrderService = (orderData) => {
    return request.post('/orders/add', orderData)
}

export const getPageOrderService = (pageNum, pageSize) => {
    return request.get(`/orders/list/${pageNum}/${pageSize}`)
}

export const getAllOrderService = () => {
    return request.get('/orders/list')
}

export const getOrderService = (id) => {
    return request.get(`/orders/${id}`)
}

export const updateOrderService = (orderData) => {
    return request.put('/orders', orderData)
}

export const deleteOrderService = (id) => {
    return request.delete(`/orders/${id}`)
}

export const deleteBatchOrderService = (ids) => {
    return request.delete('/orders/batch', {data: ids})
}