import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:9100/auth/login',
    method: 'post',
    data: data
  })
}

export function getInfo() {
  return request({
    url: 'http://localhost:9100/user/getUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
