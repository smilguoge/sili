import request from '@/utils/request'

export function paymentGcreate(query) {
  return request({
    url: '/v1/payment/gcreate',
    method: 'get',
    params: query
  })
}
export function paymentFindData(query) {
  return request({
    url: '/v1/payment/find-data',
    method: 'get',
    params: query
  })
}
export function paymentCheck(data) {
  return request({
    url: '/v1/payment/check',
    method: 'post',
    data: data
  })
}
