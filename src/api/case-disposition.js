import request from '@/utils/request'

export function findMainByState(query) {
  console.log(query)
  return request({
    url: 'http://localhost:9100/caseDisposition/caseAllocation/findMainByState',
    method: 'get',
    params: query
  })
}

export function findWorkerById(id) {
  return request({
    url: 'http://localhost:9100/caseDisposition/caseAllocation/findWorkerById',
    method: 'get',
    params: id
  })
}

export function findUserInfo() {
  return request({
    url: 'http://localhost:9100/caseDisposition/caseAllocation/findUserInfo',
    method: 'get'
  })
}
export function updateWorker(data) {
  debugger
  console.log(data)
  return request({
    url: 'http://localhost:9100/caseDisposition/caseAllocation/updateWorker',
    method: 'post',
    data: data
  })
}

