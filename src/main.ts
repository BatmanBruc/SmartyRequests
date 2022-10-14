import Antd from 'ant-design-vue';
import { createApp } from 'vue'
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)

app.use(router).use(Antd).use(store)

app.mount('#app')
