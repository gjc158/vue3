import store from '@/store/index'

// 路由守卫
export function beforeEachHandler(to: any, from: any, next: () => void) {
  const _q_token = to.query.token
  console.info(_q_token)
  if (_q_token) {
    store.commit('user/setToken', _q_token)
  }
  next()
}

