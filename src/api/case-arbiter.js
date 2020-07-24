import request from '@/utils/request'

export function getArbiterInitList(query) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseArbiter/getArbiterInitList/' + query.page + '/' + query.limit,
    method: 'get'
  })
}

export function checkIpcServer(data, code) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseArbiter/checkIPC/' + code,
    method: 'post',
    data: data
  })
}

export function checkIpcCsetsServer(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseArbiter/checkCsets/',
    method: 'post',
    data: data
  })
}

export function saveAribiterClassfication(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseArbiter/saveAribiterClassfication',
    method: 'post',
    data: data
  })
}

export function findClassInfoByID(query) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseArbiter/findClassInfoByID/' + query,
    method: 'get'
  })
}

export function getArbiterPersonList(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseArbiter/findAribiterPersonList',
    method: 'post',
    data: data
  })
}

export function updateAribiterPerson(data, id) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseArbiter/updateAribiterPerson/' + id,
    method: 'post',
    data: data
  })
}

export function findAdjudicatorWorker(id) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseArbiter/findAdjudicatorWorker/' + id,
    method: 'get'
  })
}

export function arbiterChuAn(id) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseArbiter/arbiterChuAn/' + id,
    method: 'get'
  })
}
