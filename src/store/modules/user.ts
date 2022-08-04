export interface User {
  userId: number,
  token: string
}

export default {
  namespaced: true,
  state() {
    return {
      userId: null,
      token: '',
      appointData: {}
    }
  },
  mutations: {
    setUserId(state: User, userId: number): void{
      state.userId = userId
    },
    setToken(state: User, token: string): void{
      state.token = token
    }
  },
  getters: {
    getUserId(state: User): number{
      return state.userId
    },
    getUserToken(state: User): string{
      return state.token
    }
  },
  actions: {
    
  }
}