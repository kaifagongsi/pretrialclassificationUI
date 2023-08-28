import request from '@/utils/request'

export function findAllCase(query) {
  return request({
    // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
    url: '/caseQuery/caseConditionQuery/findAllCase',
    method: 'get',
    params: query
  })
}

export function findClassInfoByID(query) {
  return request({
    // url: 'http://192.168.8.108:9100/caseDisposition/caseAllocation/findMainByState',
    url: '/caseQuery/caseConditionQuery/findClassInfoByID',
    method: 'get',
    params: query
  })
}

export function findUpdateInfoByID(query) {
  return request({
    url: '/caseQuery/caseConditionQuery/findUpdateInfoByID',
    method: 'get',
    params: query
  })
}

export function exportToExcel(query) {
  return request({
    url: '/caseQuery/caseConditionQuery/exportExcel',
    method: 'post',
    params: {
      list: query
    },
    responseType: 'blob',
    headers: {      
    }
  })
}

/**
 * 2021.11.11修改 根据保护中心拆分打包导出Excel
 * @param {*} query 
 * @returns 
 */
export function exportExcelToZip(query) {
  return request({
    url: '/caseQuery/caseConditionQuery/exportExcelToZip',
    method: 'post',
    params: {
      list: query
    },
    responseType: 'blob',
    headers: {      
    }
  })
}

export function caseExportFinish(query) {
  return request({
    url: '/caseQuery/caseConditionQuery/caseExportFinish',
    method: 'post',
    params: {
      list: query
    }
  })
}

export function exportAllExcelToZip( search ){
  return request({
    url: '/caseQuery/caseConditionQuery/exportAllExcelToZip',
    method: 'get',
    params: search,
    timeout: 100000,
    responseType: 'blob'
  })
}