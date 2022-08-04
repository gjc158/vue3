// store/index.ts
import { createStore} from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import user from './modules/user'
import home from './modules/home'


export default createStore({
  modules: {
    user,
    home
  },
  // 配置插件
  plugins: [
    // 默认存储在localStorage上
    createPersistedState({
      // 本地存储
      key: 'test_vuex_state',
      // 指定需要存储的模块
      paths: ['user', 'home']
    })
  ]
})
