import axios from "axios";
import {useTokenStore} from '../stores/token.js'

const instance = axios.create({
    baseURL: "/api",
});

instance.interceptors.request.use(
    (config) => {
        let tokenStore = useTokenStore()
        if (tokenStore.token) {
            config.headers.Authorization = "Bearer " + tokenStore.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

import router from "../router/index.js";
import {ElMessage} from "element-plus";

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401 || error.response.status === 500) {
            ElMessage.error("请先登录")
            router.push('/login')
        }
        return Promise.reject(error);
    }
);

export default instance;