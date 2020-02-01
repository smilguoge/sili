import request from '@/utils/request'
export function whSupplyList(query) {
  return request({
    url: '/v1/wh-supply/list',
    method: 'get',
    params: query
  })
}
export function whSupplyGcreate(data) {
  return request({
    url: '/v1/wh-supply/gcreate',
    method: 'get',
    data: data
  })
}
