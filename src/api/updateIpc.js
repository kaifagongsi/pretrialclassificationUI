import request from '@/utils/request'

export function selectInitList(state) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/updateipc/selectInitList/' + state,
    method: 'get'
  })
}


export function updateIpcState(id,state) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/updateipc/updateIpcState/' + id + '/'  + state,
    method: 'get'
  })
}
