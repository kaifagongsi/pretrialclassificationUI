import request from '@/utils/request'

export function getArbiterInitList(query) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseArbiter/getArbiterInitList/'+ query.page+ '/' + query.limit,
    method: 'get'
  })
}

export function checkIpcServer(data,code) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseArbiter/checkIPC/'+code,
    method: 'post',
    data: data
  })
}

export function checkIpcCsetsServer(data){
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseArbiter/checkCsets/',
    method: 'post',
    data: data
  })
}
