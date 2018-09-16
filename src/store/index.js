import Vue from 'vue'
import Vuex from 'vuex'
import {
  loginInfo
} from '@/api/getData'

Vue.use(Vuex)

const state = {
  adminInfo: {
    avatar: 'default.jpg'
  },
}

const mutations = {
  saveAdminInfo(state, adminInfo) {
    state.adminInfo = adminInfo;
  }
}

const actions = {
  async getAdminData({
    commit
  }) {
    try {
      const res = await loginInfo()
      console.log(res)
      if (res.status == 200) {
        commit('saveAdminInfo', res.data);
      } else {
        throw new Error(res)
      }
    } catch (err) {
      console.log('您尚未登陆或者session失效')
    }
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
})
