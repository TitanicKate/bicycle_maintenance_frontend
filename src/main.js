import {createApp} from 'vue'
import {createPinia} from "pinia";
import {createPersistedState} from "pinia-persistedstate-plugin";
import App from './App.vue'
import router from './router';
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

const app = createApp(App)
const pinia = createPinia()
const persistedState = createPersistedState()
pinia.use(persistedState)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(pinia)
app.mount('#app')
