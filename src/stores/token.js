// 定义store
import {ref} from "vue";
import {defineStore} from "pinia";

export const useTokenStore = defineStore('token', () => {
    const token = ref('');

    const setToken = (newToken) => {
        token.value = newToken;
    }

    const clearToken = () => {
        token.value = '';
    }

    return {
        token,
        setToken,
        clearToken
    }
}, {
    persist: true,
})

export default useTokenStore;