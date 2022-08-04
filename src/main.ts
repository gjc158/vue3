import { createApp } from 'vue'
import './utils/rem'
import App from './App.vue'
import router from "./router"
import store from "./store"
import vant3 from  './plugins/vant3'
import 'styles/index.scss'

import { beforeEachHandler } from './utils/before-each'
import afterEachHandler from './utils/after-each'

router.beforeEach(beforeEachHandler)
router.afterEach(afterEachHandler)

createApp(App)
.use(router)
.use(store)
.use(vant3)
.mount('#app')
