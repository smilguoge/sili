import request from '@/utils/request'
export function createStock(data) {
  return request({
    url: '/v1/wh-in-stock/create',
    method: 'post',
    data
  })
}
export function updateStock(data) {
  return request({
    url: '/v1/wh-in-stock/update',
    method: 'put',
    data
  })
}
export function deleteStock(id) {
  return request({
    url: '/v1/wh-in-stock/delete?id=' + id,
    method: 'delete'
  })
}
export function stockList(query) {
  return request({
    url: '/v1/wh-in-stock/list',
    method: 'get',
    params: query

  })
}
export function stockListMore(query) {
  return request({
    url: '/v1/wh-in-stock/find-data',
    method: 'get',
    params: query

  })
}

export function stockReject(data) {
  return request({
    url: '/v1/wh-in-stock/disable',
    method: 'post',
    data
  })
}

export function stockAgree(data) {
  return request({
    url: '/v1/wh-in-stock/enable',
    method: 'post',
    data
  })
}
export function stockCancel(data) {
  return request({
    url: '/v1/wh-in-stock/cancel',
    method: 'post',
    data
  })
}
export function stockConfirm(data) {
  return request({
    url: '/v1/wh-in-stock/confirm',
    method: 'post',
    data
  })
}
export function stockCheck(data) {
  return request({
    url: '/v1/wh-in-stock/confirm',
    method: 'post',
    data
  })
}
export function getNewStock() {
  return request({
    url: '/v1/wh-in-stock/gcreate',
    method: 'get'
  })
}
export function editStock(id) {
  return request({
    url: '/v1/wh-in-stock/gupdate?id=' + id,
    method: 'get'
  })
}

export function getProductNum(query) {
  return request({
    url: '/v1/wh-in-stock/search',
    method: 'get',
    params: query
  })
}

export function getStocylist(query) {
  return request({
    url: '/v1/wh-in-stock/list',
    method: 'get',
    params: query

  })
}
export function getStocyInf(query) {
  return request({
    url: '/v1/wh-in-stock/find-data',
    method: 'get',
    params: query

  })
}
