import axios from "axios";

const instance = axios.create({
    baseURL: "/api",
});

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;