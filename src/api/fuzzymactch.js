import request from '@/utils/request'

export function matchAll(query) {
    return request({
      url: process.env.VUE_APP_BASE_API + '/fuzzymactch/matchAll',
      method: 'get',
      params: query
    })
}

export function matchAllState(query) {
    return request({
      url: process.env.VUE_APP_BASE_API + '/fuzzymactch/getMatchState',
      method: 'get',
      params: query
    })
}

export function uploadFileApi(params){
  return request({
    url: process.env.VUE_APP_BASE_API + '/fuzzymactch/uploadFile',
    method: 'post',
    data: params,
    responseType:'blob'
  })
 
}