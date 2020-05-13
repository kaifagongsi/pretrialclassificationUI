import request from '@/utils/request'

export function countCaseIn(query) {
  return request({
    // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
    url: '/caseStatistic/countCaseIn',
    method: 'get',
    params: query
  })
}

export function countCaseOut(query) {
  return request({
    // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
    url: '/caseStatistic/countCaseOut',
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
export function queryData(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseStatistic/queryData',
    method: 'post',
    data: data
  })
}
