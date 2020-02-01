import request from '@/utils/request'
export function createStock(data) {
  return request({
    url: '/v1/wh-out-stock/create',
    method: 'post',
    data
  })
}
export function updateStock(data) {
  return request({
    url: '/v1/wh-out-stock/update',
    method: 'put',
    data
  })
}
export function deleteStock(id) {
  return request({
    url: '/v1/wh-out-stock/delete?id=' + id,
    method: 'delete'
  })
}
export function stockInList(query) {
  return request({
    url: '/v1/wh-out-stock/list',
    method: 'get',
    params: query
  })
}

export function stockReject(data) {
  return request({
    url: '/v1/wh-out-stock/disable',
    method: 'post',
    data
  })
}

export function stockAgree(data) {
  return request({
    url: '/v1/wh-out-stock/enable',
    method: 'post',
    data
  })
}
export function stockCancel(data) {
  return request({
    url: '/v1/wh-out-stock/cancel',
    method: 'post',
    data
  })
}
export function stockConfirm(data) {
  return request({
    url: '/v1/wh-out-stock/confirm',
    method: 'post',
    data
  })
}
export function stockCheck(data) {
  return request({
    url: '/v1/wh-out-stock/confirm',
    method: 'post',
    data
  })
}
export function getNewStock() {
  return request({
    url: '/v1/wh-out-stock/gcreate',
    method: 'get'
  })
}
export function editStock(query) {
  return request({
    url: '/v1/wh-out-stock/gupdate',
    method: 'get',
    params: query
  })
}

export function getProductNum(query) {
  return request({
    url: '/v1/wh-out-stock/search',
    method: 'get',
    params: query
  })
}

export function getStocylist(query) {
  return request({
    url: '/v1/wh-out-stock/list',
    method: 'get',
    params: query

  })
}
export function stockList(query) {
  return request({
    url: '/v1/wh-out-stock/find-data',
    method: 'get',
    params: query

  })
}

export function addOrderList(query) {
  return request({
    url: '/v1/wh-out-stock/search',
    method: 'get',
    params: query

  })
}
