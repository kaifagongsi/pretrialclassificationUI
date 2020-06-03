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
    url: process.env.VUE_APP_BASE_API + '/auth/logout',
    method: 'post'
  })
}

export function userList(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/getUserList/' + data.page + '/' + data.limit,
    method: 'post',
    data: data
  })
}

export function createUserinfo(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/addUserInfo/',
    method: 'post',
    data: data
  })
}

export function checkRepeatLoginName(date) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/checkLoginName',
    method: 'post',
    data: date
  })
}

export function getUserInfoByLoginName(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/getUserInfoByLoginName/' + data,
    method: 'get',
  })
}

export function deleteUserByLoginname(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/deleteUserByLoginname/' + data,
    method: 'delete',
  })
}

export function departmentRotation(data) {
  let ymlName = ''
  if (process.env.VUE_APP_BASE_API.includes('127.0.0.1')) {
    ymlName = 'application-dev.yml'
  }else {
    ymlName = 'application-prod.yml'
  }
  debugger
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/departmentRotation/' + ymlName + "/" + data,
    method: 'get'
  })
}
