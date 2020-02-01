import request from '@/utils/request'

export function tempSendList(query) {
  console.log(query)
  return request({
    url: '/v1/temp-send/index',
    method: 'get',
    params: query
  })
}
export function tempSendGcreate() {
  return request({
    url: '/v1/temp-send/gcreate',
    method: 'get'
  })
}
export function tempSendCreate(data) {
  return request({
    url: '/v1/temp-send/create',
    method: 'post',
    data
  })
}
export function tempSendDisable(data) {
  return request({
    url: '/v1/temp-send/disable',
    method: 'post',
    data
  })
}
