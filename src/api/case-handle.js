import request from '@/utils/request'

export function deleteDataByID(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseHandle/deleteDataByID/' + data,
    method: 'delete'
  })
}

export function updateSimpleclasscode(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseHandle/updateSimpleclasscode',
    method: 'get',
    params: data
  })
}

export function getUnfinishedList(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseHandle/getUnfinishedList',
    method: 'get',
    params: data
  })
}

export function downloadPDF() {
  return request({
    url: process.env.VUE_APP_BASE_API + '/caseHandle/downloadPDF',
    method: 'get'
  })
}
