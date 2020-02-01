import request from '@/utils/request'

// 消耗开单
export class consume {
  // 开单渲染（暂存跳转）
  view(params) {
    return request({
      url: '/v1/consume-order/view',
      method: 'get',
      params
    })
  }

  // 开单渲染（预约跳转）
  index(params) {
    return request({
      url: '/v1/consume-order/index',
      method: 'get',
      params
    })
  }

  // 暂存单列表
  list(params) {
    return request({
      url: '/v1/consume-order/list',
      method: 'get',
      params
    })
  }

  // 消耗明细渲染
  detail(params) {
    return request({
      url: '/v1/consume-order/detail',
      method: 'get',
      params
    })
  }

  // 消耗订单冲销
  update(data, id) {
    return request({
      url: '/v1/consume-order/update?id=' + id,
      method: 'put',
      data
    })
  }

  // 消耗订单冲销
  pay(data) {
    return request({
      url: 'v1/consume-order/pay',
      method: 'post',
      data
    })
  }
}
