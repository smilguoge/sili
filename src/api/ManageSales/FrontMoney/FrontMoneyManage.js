import request from '@/utils/request'

// 订金管理

// 订金管理主界面
export function index(data) {
  return request({
    url: '/v1/deposit/index',
    method: 'get',
    params: data
  })
}
// 退订金、核销、冲销
export function batchUpdate(data) {
  return request({
    url: '/v1/deposit/batch-update',
    method: 'put',
    'Content-Type': 'application/json',
    data
  })
}

// 订金使用明细
export function detailIndex(data) {
  return request({
    url: '/v1/deposit-record/index',
    method: 'get',
    params: data
  })
}
// 订金充值界面
export function gcreate(id) {
  return request({
    url: '/v1/deposit/gcreate?customer_id=' + id,
    method: 'get'
  })
}
// 订金充值 提交
export function create(data) {
  return request({
    url: '/v1/deposit/create',
    'Content-Type': 'application/json',
    method: 'post',
    data
  })
}
// pos单查询
export function findPOSData(id) {
  return request({
    url: '/v1/payment/find-data?action=pos&pos_type=' + id,
    method: 'get'
  })
}

// 顾客查询
export function findCustomer(keyword) {
  return request({
    url: '/v1/customer/search?type=deposit&keyword=' + keyword,
    method: 'get'
  })
}

// 员工查询
export function findStaff(data) {
  return request({
    url: '/v1/staff/search',
    method: 'get',
    params: data
  })
}
// 员工分摊职务验证
export function confirmStaff(data) {
  return request({
    url: '/v1/staff/confirm',
    method: 'post',
    data
  })
}
// 业绩分摊 计算
export function depositCalc(data) {
  return request({
    url: '/v1/deposit/check',
    'Content-Type': 'application/json',
    method: 'post',
    data
  })
}

// 退订金 审批详情
export function refundApproveIndex(id) {
  return request({
    url: '/v1/approve-record-dtl/index?record_id=' + id,
    method: 'get'
  })
}

// 退订金 审批操作
export function refundApproveOperate(data, id) {
  return request({
    url: '/v1/approve-record-dtl/update?id=' + id,
    method: 'put',
    data
  })
}