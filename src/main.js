import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import installElementPlus from './plugins/element'
// 导入iconfont
import "./assets/icon/iconfont.css"

// 导入axios
import axios from "axios";


const app = createApp(App)
installElementPlus(app)


// 挂载 axios
app.config.globalProperties.$http = axios
// 设置初始页面
axios.defaults.baseURL="http://localhost:9000/sportsBack"

app.use(router).mount('#app')