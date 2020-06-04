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
