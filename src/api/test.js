import request from '@/utils/request'

export function fetchList(query) {
  console.log(query)
  return request({
    url: 'http://192.168.108:9100/caseDisposition/fenlei-baohu-main/findMainByState',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  console.log(data)
  return request({
    url: 'http://192.168.108:9100/caseDisposition/fenlei-baohu-main/postFenleiBaohuMain',
    method: 'post',
    data: data
  })
}

export function updateArticle(data) {
  console.log(data)
  return request({
    url: 'http://192.168.8.108:9100/caseDisposition/fenlei-baohu-main/update',
    method: 'put',
    data
  })
}

export function deleteTest(data) {
  console.log(data)
  return request({
    url: 'http://192.168.8.108:9100/caseDisposition/fenlei-baohu-main/deleteFenleiBaohuMain',
    method: 'delete',
    data: data
  })
}
