import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import './assets/css/customize.css'
import * as ElIcons from '@element-plus/icons-vue'

try {
    const app = createApp(App)
    app.use(router)
    app.use(store)
    app.use(ElementPlus, {locale})
    for (let icon in ElIcons) {
        app.component(icon, ElIcons[icon])
    }
    app.mount('#app')
} catch (error) {
    console.error('應用啟動失敗:', error)
    document.getElementById('app').innerHTML = '<div style="padding: 20px; color: red;">應用啟動失敗，請檢查控制台錯誤</div>'
}