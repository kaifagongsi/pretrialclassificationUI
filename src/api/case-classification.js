import request from '@/utils/request'

export function findCaseByState(query) {
  return request({
    url: '/caseClassification/findCaseByState',
    method: 'get',
    params: query
  })
}

export function updateClassificationInfo(data) {
  return request({
    url: '/caseClassification/updateClassificationInfo',
    method: 'post',
    data: data
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

export function correctCase(data){
  return request({
    url: '/caseClassification/caseCorrect',
    method: 'post',
    data: data
  })
}

export function searchByCondition(query) {
  return request({
    url: '/caseClassification/searchByCondition',
    method: 'get',
    params: {
      id: query.id,
      sqr: query.sqr,
      mingcheng: query.mingcheng
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

export  function  judgeMoreIpcmi(id) {
  debugger
  return request({
    url: '/caseClassification/lastFinishAndMoreIPCMI',
    method: 'get',
    params: {
      id: id
    }
  })
}
