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

export function updateUserInfo(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/updateUserInfo/',
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
    method: 'get'
  })
}

export function deleteUserByLoginname(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/deleteUserByLoginname/' + data,
    method: 'delete'
  })
}

export function departmentRotation(data) {
  let ymlName = ''
  if (process.env.VUE_APP_BASE_API.includes('127.0.0.1')) {
    ymlName = 'application-dev.yml'
  } else {
    ymlName = 'application-prod.yml'
  }
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/departmentRotation/' + ymlName + '/' + data,
    method: 'get'
  })
}


export function checkUserInfoEmail(email) {
  return request({
    url:  process.env.VUE_APP_BASE_API + '/user/chenckUserEmail/'+email,
    method: 'post'
  })
}

/**
 *  初始化部门
 */
export  function getInitDep1s() {
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/getInitDep1s',
    method: 'get'
  })
}

/**
 *  根据部门获取处室
 */
export function getDep2sByDep1(dep1) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/getInitDep2sByDep1/' + dep1,
    method: 'get'
  })
}


export function getUserOnLine() {
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/getUserOnLine',
    method: 'get'
  })

}

/**
 * 修改密码
 * @returns 
 */
export function changePssword(oldPassword,newPassword,loginname){
  return request({
    url: process.env.VUE_APP_BASE_API + '/user/changePssword/' + oldPassword+ "/" + newPassword + "/" + loginname,
    method: 'post'
  })
}