import request from '@/utils/request'

export function findMainByState(query) {
  return request({
    // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
    url: '/caseDisposition/caseAllocation/findMainByState',
    method: 'get',
    params: query
  })
}

export function findWorkerById(id) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseDisposition/caseAllocation/findWorkerById',
    method: 'get',
    params: id
  })
}

export function findUserInfo() {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseDisposition/caseAllocation/findUserInfo',
    method: 'get'
  })
}
export function updateWorker(data) {
  debugger
  console.log(data)
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseDisposition/caseAllocation/updateWorker',
    method: 'post',
    data: data
  })
}
export function sendEmail(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseDisposition/caseAllocation/sendEmail',
    method: 'post',
    data: data
  })
}
export function getInitDep1s() {
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

export function matchNeed() {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseClassification/matchNeed/',
    method: 'get'
  })
}

export function changOneResult(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseDisposition/caseChange/changeOne',
    method: 'post',
    data: data
  })
}

export function deleteOne(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseDisposition/caseChange/deleteOne',
    method: 'delete',
    data: data
  })
}

export function caseFinishAllByAdmin(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseDisposition/caseChange/caseFinishAll',
    method: 'post',
    data: data
  })
}