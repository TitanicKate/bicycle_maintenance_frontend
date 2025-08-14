// stores/user.js
import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        // 当前登录用户信息，初始值从本地存储读取
        userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
        // 登录令牌（可选）
        token: localStorage.getItem('token') || ''
    }),
    actions: {
        setToken(token) {
            this.token = token
            localStorage.setItem('token', token)
        },
        // 登录成功后保存用户信息
        setUserInfo(userInfo) {
            this.userInfo = userInfo
            // 存入本地存储，防止页面刷新丢失
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
        },
        // 退出登录，清除用户信息
        logout() {
            this.userInfo = null
            this.token = ''
            localStorage.removeItem('userInfo')
            localStorage.removeItem('token')
        }
    },
    getters: {
        // 判断是否登录
        isLogin: (state) => !!state.userInfo
    }
}, {
    persist: true
})

export default useUserStore;