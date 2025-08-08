import {createRouter, createWebHistory} from "vue-router";

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

const routes = [
    {path: '/login', component: Login},
    {path: '/', component: Home}
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    // 假设 / 等页面需要登录后访问，未登录则跳回登录页
    if (to.path !== '/login' && !token) {
        next('/login');
    } else {
        next();
    }
});

export default router;