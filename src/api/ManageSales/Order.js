import request from '@/utils/request'
export function createStock(data) {
  return request({
    url: '/v1/wh-in-stock/create',
    method: 'post',
    data
  })
}
export function customerList(query) {
  return request({
    url: '/v1/customer/search',
    method: 'get',
    params: query

  })
}
export function userInfo(query) {
  return request({
    url: '/v1/customer/view',
    method: 'get',
    params: query
  })
}
export function findData(query) {
  return request({
    url: '/v1/card-package/find-data',
    method: 'get',
    params: query
  })
}
export function saleCardPackage(query) {
  return request({
    url: '/v1/sale-card-package/index',
    method: 'get',
    params: query
  })
}
export function saleCardPackageSearch(query) {
  return request({
    url: '/v1/sale-card-package/search',
    method: 'get',
    params: query
  })
}
export function saleCardPackageList(query) {
  return request({
    url: '/v1/sale-card-package/lists',
    method: 'get',
    params: query
  })
}
export function saleSearch(query) {
  return request({
    url: '/v1/sale/search',
    method: 'get',
    params: query
  })
}
export function integralRefresh(data) {
  return request({
    url: '/v1/integral/refresh',
    method: 'post',
    data
  })
}
export function integralConfirm(data) {
  return request({
    url: '/v1/integral/confirm',
    method: 'post',
    data
  })
}
export function apiPostCardPackageDeduction(data) {
  return request({
    url: '/v1/card-package-deduction/refresh',
    method: 'post',
    data
  })
}
export function apiPostCardPackageDeductionConfirm(data) {
  return request({
    url: '/v1/card-package-deduction/confirm',
    method: 'post',
    data
  })
}
export function apiPostPositionCheck(data) {
  return request({
    url: '/v1/position/check',
    method: 'post',
    data
  })
}
export function apiPostStaffCheck(data) {
  return request({
    url: '/v1/staff/check',
    method: 'post',
    data
  })
}
export function apiPostSaleConfirm(data) {
  return request({
    url: '/v1/sale/confirm',
    method: 'post',
    data
  })
}
export function apiSaleCardPackageSearch(query) {
  return request({
    url: '/v1/sale-card-package/search',
    method: 'get',
    params: query
  })
}
export function apiGetSaleGcreate(query) {
  return request({
    url: '/v1/sale/gcreate',
    method: 'get',
    params: query
  })
}
export function saleDraftCreate(data) {
  return request({
    url: '/v1/sale-draft/create',
    method: 'post',
    data
  })
}
export function saleDraftUpdate(data, id) {
  return request({
    url: '/v1/sale-draft/update?id=' + id,
    method: 'put',
    data
  })
}
export function saleDraftUnlock(data) {
  return request({
    url: '/v1/sale-draft/unlock',
    method: 'post',
    data
  })
}
export function saleDraftCancel(data) {
  return request({
    url: '/v1/sale-draft/cancel',
    method: 'post',
    data
  })
}
export function saleDraftCheck(data) {
  return request({
    url: '/v1/sale-draft/check',
    method: 'post',
    data
  })
}
export function apiGetStaffSearch(data) {
  return request({
    url: '/v1/staff/search',
    method: 'get',
    params: data
  })
}
export function salePay(data) {
  return request({
    url: '/v1/sale/pay',
    method: 'post',
    data
  })
}
export function saleDraftIndex(query) {
  return request({
    url: '/v1/sale-draft/index',
    method: 'get',
    params: query
  })
}
