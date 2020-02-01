import request from '@/utils/request'
export function whBackorderList(query) {
  return request({
    url: '/v1/wh-backorder/index',
    method: 'get',
    params: query
  })
}
export function whBackorderView(query) {
  return request({
    url: '/v1/wh-backorder/view',
    method: 'get',
    params: query
  })
}
export function whReturnIndex(query) {
  return request({
    url: '/v1/wh-return/index',
    method: 'get',
    params: query
  })
}
export function whReturnCreate(data) {
  return request({
    url: 'v1/wh-return/create',
    method: 'post',
    data: data
  })
}
export function whReplaceCreate(query) {
  return request({
    url: '/v1/wh-replace/gcreate',
    method: 'get',
    params: query
  })
}
export function whReplaceCreatePut(data) {
  return request({
    url: '/v1/wh-replace/create',
    method: 'post',
    data
  })
}
