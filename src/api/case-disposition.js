import request from '@/utils/request'

export function findMainByState(query) {
  console.log(query)
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

