import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getHeader } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  header: getHeader(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, header, token) => {
    console.log(state + header + token)
    state.header = header
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  loginBySelf({ commit }, userInfo) {
    const { loginname, password, codeKey, codeText } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginname: loginname.trim(), password: password, codeKey: codeKey, codeText: codeText }).then(response => {
        const toekenStr = response.data.prefix + response.data.value
        setToken(response.data.header, toekenStr)
        commit('SET_TOKEN', response.data.header, toekenStr)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo: function({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('认证失败，请重新登录')
        }
        const { roles, name, avatar, introduction } = data
        // const { roles name, avatar, introduction } = data

        // roles must be a non-empty array
        /* if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        } */
        var rol = []
        for (let i = 0; i < roles.length; i++) {
          rol.push(roles[i].rolename)
        }
        // 修改了前段权限
        // rol.push(roles[0].rolename)
        // rol.push('admin')
        commit('SET_ROLES', rol)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        data.roles = rol
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
