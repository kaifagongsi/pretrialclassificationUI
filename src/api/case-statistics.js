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

export function caseOutWithOrg(query) {
  return request({
    url: '/caseStatistic/caseOutWithOrg',
    method: 'get',
    params: query
  })
}

