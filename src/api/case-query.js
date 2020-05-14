import request from '@/utils/request'

export function findAllCase(query) {
  return request({
    // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
    url: '/caseQuery/caseConditionQuery/findAllCase',
    method: 'get',
    params: query
  })
}

export function findById(id) {
  return request({
    // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
    url: process.env.VUE_APP_BASE_API + '/caseQuery/caseConditionQuery/findById',
    method: 'get',
    params: id
  })
}

export function findBySQH(sqh) {
  return request({
    // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
    url: process.env.VUE_APP_BASE_API + '/caseQuery/caseConditionQuery/findBySQH',
    method: 'get',
    params: sqh
  })
}

export function findByName(name) {
  return request({
    // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
    url: process.env.VUE_APP_BASE_API + '/caseQuery/caseConditionQuery/findByName',
    method: 'get',
    params: name
  })
}

export function findBySQR(sqr) {
  return request({
    // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
    url: process.env.VUE_APP_BASE_API + '/caseQuery/caseConditionQuery/findBySQR',
    method: 'get',
    params: sqr
  })
}
