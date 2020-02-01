// name xuguqiu date 2020  01-04
const state = {
  mnoeySet_up: ''
}
const mutations = {
  MONEYSET_UP: (state, data) => {
    state.mnoeySet_up = data
  }
}
const actions = {
  mnoeySet_up({ commit }, data) {
    commit('MONEYSET_UP', data)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
