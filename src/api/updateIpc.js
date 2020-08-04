import request from '@/utils/request'

export function selectInitList(query,state) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/updateipc/selectInitList/' + query.page + '/' + query.limit + '/' + state,
    method: 'get'
  })
}


export function updateIpcState(id,state) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/updateipc/updateIpcState/' + id + '/'  + state,
    method: 'get'
  })
}
