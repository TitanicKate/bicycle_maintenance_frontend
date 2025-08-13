import request from "../utils/request.js";

export const addAnnouncementService = (announcementData) => {
    return request.post('/announcements/add', announcementData)
}

export const getPageAnnouncementService = (pageNum, pageSize) => {
    return request.get(`/announcements/list/${pageNum}/${pageSize}`)
}

export const getAllAnnouncementService = () => {
    return request.get('/announcements/list')
}

export const getAnnouncementService = (id) => {
    return request.get(`/announcements/${id}`)
}

export const updateAnnouncementService = (announcementData) => {
    return request.put('/announcements', announcementData)
}

export const deleteAnnouncementService = (id) => {
    return request.delete(`/announcements/${id}`)
}

export const deleteBatchAnnouncementService = (ids) => {
    return request.delete('/announcements/batch', {data: ids})
}