import request from '@/utils/request'

export function findCaseByState(query) {
  return request({
    url: '/caseClassification/findCaseByState',
    method: 'get',
    params: query
  })
}

export function finishcase(finishIds,user) {
  return request({
    url: '/caseClassification/caseFinish',
    method: 'get',
    params: {
      ids: finishIds,
      user: user
    }
  })
}

export function searchByCondition(query) {
  return request({
    url: '/caseClassification/searchByCondition',
    method: 'get',
    params: {
      id: query.id
    }
  })
}

export function getTransWorkerList(query) {
  return request({
    url: '/caseClassification/getTransWorkerList',
    method: 'get',
    params: query
  })
}

export function caseTransfer(query) {
  return request({
    url: '/caseClassification/caseTransfer',
    method: 'post',
    params: {
      list: query
    }
  })
}
