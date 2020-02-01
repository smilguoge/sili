import request from '@/utils/request'
// 预约管理主界面get
export function makeAppGet(data) {
  return request({
    url: '/v1/booking/index',
    method: 'get',
    params: data
  })
}

export function getCreateinf(data) {
  return request({
    url: '/v1/booking/gcreate',
    method: 'get',
    params: data
  })
}
export function getUpdateinf(data) {
  return request({
    url: '/v1/booking/gupdate',
    method: 'get',
    params: data
  })
}
export function getStaffs(data) {
  return request({
    url: '/v1/customer/search',
    method: 'get',
    params: data
  })
}
export function getProduct(data) {
  return request({
    url: '/v1/booking/pro-list',
    method: 'get',
    params: data
  })
}

// 预约管理新增
export function postBookingCreate(data) {
  return request({
    url: '/v1/booking/create',
    method: 'post',
    data
  })
}
// 预约管理修改
export function postBookingUpdate(data) {
  return request({
    url: '/v1/booking/update',
    method: 'post',
    data
  })
}
// 预约管理开始护理
export function getBookingNursing(data) {
  return request({
    url: '/v1/booking/nursing',
    method: 'get',
    params: data
  })
}
// 预约管理取消
export function deleteBookingDelete(data) {
  return request({
    url: '/v1/booking/delete',
    method: 'delete',
    params: data
  })
}
// 预约管理外出
export function postBookingMeeting(data) {
  return request({
    url: '/v1/booking/meeting',
    method: 'post',
    data
  })
}
// 预约管理取消外出
export function postBookingCancel(data) {
  return request({
    url: '/v1/booking/cancel',
    method: 'post',
    data
  })
}
export function getCustomer(params) {
  return request({
    url: '/v1/customer/search',
    method: 'get',
    params
  })
}

export function createBook(data) {
  return request({
    url: '/v1/booking/create',
    method: 'post',
    data
  })
}

export function updateBook(data, id) {
  return request({
    url: '/v1/booking/update?id=' + id,
    method: 'put',
    data
  })
}
