import request from '@/utils/request'

// 首页

// 搜索
export function homesarch(params) {
  return request({
    url: '',
    method: 'get',
    params
  })
}

// 快捷操作检索
export function quicksarch(params) {
  return request({
    url: '',
    method: 'get',
    params
  })
}
// 今日收入消耗客流预约统计
export function statistical(params) {
  return request({
    url: '',
    method: 'get',
    params
  })
}

// money get
export function MoneydataGet(data) {
  return request({
    url: '/v1/capital-transfers/gcreate',
    method: 'get',
    params: data
  })
}
// money get 员工

export function MoneylistGet(data) {
  return request({
    url: '/v1/staff/search',
    method: 'get',
    params: data
  })
}
// money post
export function MoneydataPost(data) {
  return request({
    url: '/v1/capital-transfers/create',
    method: 'post',
    data
  })
}
// money table data get
export function Moneytableget(data) {
  return request({
    url: '/v1/capital-transfers/index',
    method: 'get',
    params: data
  })
}
// money 检查
export function Moneycheck_up(data) {
  return request({
    url: '/v1/capital-transfers/check',
    method: 'post',
    data
  })
}
