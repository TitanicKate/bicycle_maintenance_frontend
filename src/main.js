import {createApp} from 'vue'
import {createPinia} from "pinia";
import {createPersistedState} from "pinia-persistedstate-plugin";
import App from './App.vue'
import router from './router';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
const pinia = createPinia()
const persistedState = createPersistedState()
pinia.use(persistedState)

app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app')
