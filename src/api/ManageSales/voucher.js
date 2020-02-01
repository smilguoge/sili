import request from '@/utils/request'

export function saleCouponList(query) {
  return request({
    url: '/v1/sale-coupon/index',
    method: 'get',
    params: query
  })
}
export function saleCouponUpdate(data) {
  return request({
    url: '/v1/sale-coupon/batch-update',
    method: 'put',
    data
  })
}
export function saleCouponCreate(data) {
  return request({
    url: '/v1/sale-coupon/create',
    method: 'POST',
    data
  })
}
export function integralCheck(data) {
  return request({
    url: '/v1/integral/check',
    method: 'POST',
    data
  })
}
export function saleCouponCheck(data) {
  return request({
    url: '/v1/sale-coupon/check',
    method: 'POST',
    data
  })
}
export function staffLotteryCreate(data) {
  return request({
    url: '/v1/staff-lottery/create',
    method: 'POST',
    data
  })
}

