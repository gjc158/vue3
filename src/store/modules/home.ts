export interface State {
  count: number
}

export default{
  namespaced: true,
  state() {
    return {
      count: 0
    }
  },
  mutations: {
    setCount(state: State, count: number): void{
      state.count = count
    }
  },
  getters: {
    getCount(state: State): number{
      return state.count
    }
  }
}
