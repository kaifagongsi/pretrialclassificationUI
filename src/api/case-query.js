import request from '@/utils/request'

export function findAllCase(query) {
  return request({
    // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
    url: '/caseQuery/caseConditionQuery/findAllCase',
    method: 'get',
    params: query
  })
}

export function saveEditInfo(query) {
  return request({
    // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
    url: '/caseQuery/caseConditionQuery/findClassInfoByID',
    method: 'get',
    params: query
  })
}
