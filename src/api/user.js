import request from '@/utils/request'

export function login(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/auth/login',
    method: 'post',
    data: data
  })
}

export function getInfo() {
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/getUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
