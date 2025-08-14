import {createRouter, createWebHistory} from "vue-router";
import Login from '../views/Login.vue'
import Layout from "../views/Layout.vue";
import Home from '../views/home/Home.vue'
import Users from "../views/user/Users.vue";
import Orders from "../views/order/Orders.vue";
import Resources from "../views/rouseces/Resources.vue";
import Evaluation from "../views/evaluation/Evaluation.vue";
import Market from "../views/market/Market.vue";
import Announcement from "../views/announcement/Announcement.vue";
import PersonalSetting from "../views/user/PersonalSetting.vue";
import useUserStore from "../stores/user.js";

const routes = [
    {path: '/login', component: Login},
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {path: '/home', component: Home},
            {path: '/orders', component: Orders},
            {path: '/users', component: Users},
            {path: '/resources', component: Resources},
            {path: '/announcement', component: Announcement},
            {path: '/evaluation', component: Evaluation},
            {path: '/market', component: Market},
            {path: '/personalSetting', component: PersonalSetting},
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

router.beforeEach((to, from, next) => {
    let userStore = useUserStore()
    // 假设 / 等页面需要登录后访问，未登录则跳回登录页
    if (to.path !== '/login' && !userStore.token) {
        next('/login');
    } else {
        next();
    }
});

export default router;