import request from "../utils/request.js";

export const getAllEvaluationService = () => {
    return request.get('/evaluations/list')
}