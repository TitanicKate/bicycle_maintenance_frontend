import axios from "axios";
import router from "../router/index.js";
import {ElMessage} from "element-plus";
import useUserStore from "../stores/user.js";

const instance = axios.create({
    baseURL: "/api",
});

instance.interceptors.request.use(
    (config) => {
        let userStore = useUserStore()
        if (userStore.token) {
            config.headers.Authorization = "Bearer " + userStore.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401 || error.response.status === 500) {
            ElMessage.error("请先登录")
            router.push('/login').then(r => {
                useUserStore().logout()
            })
        }
        return Promise.reject(error);
    }
);

export default instance;