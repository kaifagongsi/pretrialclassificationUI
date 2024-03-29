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

export function caseOutInBulk(list,worker){
  return request({
    url: '/caseClassification/caseOutInBulk',
    method: 'post',
    params: {
      list: list,
      worker: worker
    },
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

export function searchByVagueCondition(query) {
  return request({
    url: '/caseClassification/searchByVagueCondition',
    method: 'get',
    params: query
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
  return request({
    url: '/caseClassification/lastFinishAndMoreIPCMI',
    method: 'get',
    params: {
      id: id
    }
  })
}

export  function cpcToIpc(cci,cca) {
  return request({
    url: '/caseClassification/cpc2ipc',
    method: 'get',
    params: {
      cci: cci,
      cca: cca
    }
  })
}


export function searchFuzzyMatchResult(id,abcd){
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseClassification/searchfuzzymatchresult/'+id,
    method: 'post',
    data: abcd
  })
}