import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "axios";
import VueAxios from 'vue-axios'

axios.defaults.baseURL = "/api"
axios.interceptors.request.use(
    config => {
        if (sessionStorage.getItem("token")){
            config.headers['authorization'] = sessionStorage.getItem("token");
        }
        return config;
    }
)
const app = createApp(App);
app.use(VueAxios, axios);
app.use(ElementPlus);
app.use(router);
app.mount('#app');
