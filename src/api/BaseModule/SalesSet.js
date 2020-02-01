import request from '@/utils/request'

// 项目管理
export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

// 产品管理
export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: {
      id
    }
  })
}
// 优惠券table
export function CouponData(data) {
  return request({
    url: '/v1/coupon/index',
    method: 'get',
    params: data
  })
}
// 优惠券structure get data
export function structureGet(data) {
  return request({
    url: '/v1/department/list',
    method: 'get',
    params: data
  })
}
export function projectStructureGet(data) {
  return request({
    url: '/v1/project/tree',
    method: 'get',
    params: data
  })
}
export function productStructureGet(data) {
  return request({
    url: '/v1/product/tree',
    method: 'get',
    params: data
  })
}
export function setStructureGet(data) {
  return request({
    url: '/v1/card-package/tree',
    method: 'get',
    params: data
  })
}
// 优惠券新增渲染
export function vmgGcreate(data) {
  return request({
    url: '/v1/coupon/gcreate',
    method: 'get',
    params: data
  })
}
// 优惠券新增检索
export function vmgretrievalGet(data) {
  return request({
    url: '/v1/coupon/search',
    method: 'get',
    params: data
  })
}
// 优惠券新增
export function vmgAdd(data) {
  return request({
    url: '/v1/coupon/create',
    method: 'post',
    data
  })
}
// 优惠券删除
export function vmDelete(data) {
  return request({
    url: '/v1/coupon/delete',
    method: 'DELETE',
    params: data
  })
}
// 优惠券修改渲染
export function vmAlterdata(data) {
  return request({
    url: '/v1/coupon/gupdate',
    method: 'get',
    params: data
  })
}
// 优惠券修改
export function vmAlter(data) {
  return request({
    url: '/v1/coupon/update',
    method: 'put',
    params: { id: data.id },
    data
  })
}

// - FIXME: 赠送设置
// 赠送设置基本信息列表
export function getSendSet(params) {
  return request({
    url: '/v1/send-set/index',
    method: 'get',
    params
  })
}

// 获取赠送配置项
export function getGcreate() {
  return request({
    url: '/v1/send-set/gcreate',
    method: 'get'
  })
}

// 新建
export function addCreate(data) {
  return request({
    url: '/v1/send-set/create',
    method: 'post',
    data
  })
}

// 检索列表
export function getCategory() {
  return request({
    url: '/v1/send-set/category',
    method: 'get'
  })
}

// 获取数据回显
export function getGupdate(id) {
  return request({
    url: '/v1/send-set/gupdate?id=' + id,
    method: 'get'
  })
}

// 修改赠送信息
export function editUpdate(id, data) {
  return request({
    url: '/v1/send-set/update?id=' + id,
    method: 'put',
    data
  })
}

// 删除
export function batchDelete(data) {
  return request({
    url: '/v1/send-set/batch-delete',
    method: 'post',
    data
  })
}

// 项目检索
export function projectSearch() {
  return request({
    url: '/v1/project/search',
    method: 'get'
  })
}

// - FIXME: 积分设置
// 积分设置信息列表
export function getIntegralSet(params) {
  return request({
    url: '/v1/integral-set/index',
    method: 'get',
    params
  })
}

// 积分设置基础信息渲染
export function getIntegralGcreate() {
  return request({
    url: '/v1/integral-set/gcreate',
    method: 'get'
  })
}

// 积分设置新增接口
export function createIntegral(data) {
  return request({
    url: '/v1/integral-set/create',
    method: 'post',
    data
  })
}

// 积分设置修改渲染接口
export function getIntegralGupdate(id) {
  return request({
    url: '/v1/integral-set/gupdate?id=' + id,
    method: 'get'
  })
}

// 积分设置修改接口
export function updateIntegral(id, data) {
  return request({
    url: '/v1/integral-set/update?id=' + id,
    method: 'put',
    data
  })
}

// 积分设置删除接口
export function deleteIntegral(data) {
  return request({
    url: '/v1/integral-set/batch-delete',
    method: 'post',
    data
  })
}

// - FIXME: 特殊积分规则
// 特殊积分设置信息列表
export function getIntegralSpclset(params) {
  return request({
    url: '/v1/integral-spclset/index',
    method: 'get',
    params
  })
}

// 特殊积分设置添加接口
export function createIntegralSpclset(data) {
  return request({
    url: '/v1/integral-spclset/create',
    method: 'post',
    data
  })
}

// 特殊积分设置修改接口
export function updateIntegralSpclset(id, data) {
  return request({
    url: '/v1/integral-spclset/update?id=' + id,
    method: 'put',
    data
  })
}

// 特殊积分设置修改渲染接口
export function gupdateIntegralSpclset(id) {
  return request({
    url: '/v1/integral-spclset/gupdate?id=' + id,
    method: 'get'
  })
}

// 特殊积分设置新增信息渲染
export function gcreateIntegralSpclset() {
  return request({
    url: '/v1/integral-spclset/gcreate',
    method: 'get'
  })
}

// 特殊积分设置删除接口
export function deleteIntegralSpclset(id) {
  return request({
    url: '/v1/integral-spclset/delete?id=' + id,
    method: 'delete'
  })
}

// - 活动套餐 基础信息
export class ActivityBase {
  list(params) {
    return request({
      url: '/v1/card-package/list',
      method: 'get',
      params
    })
  }
  create(data) {
    return request({
      url: '/v1/card-package/create',
      method: 'post',
      data
    })
  }
  gcreate() {
    return request({
      url: '/v1/card-package/gcreate',
      method: 'get'
    })
  }
  update(data) {
    return request({
      url: '/v1/card-package/update',
      method: 'put',
      data
    })
  }
  gupdate(params) {
    return request({
      url: '/v1/card-package/gupdate',
      method: 'get',
      params
    })
  }
  delete(id) {
    return request({
      url: '/v1/card-package/delete?id=' + id,
      method: 'delete'
    })
  }
}

// - 活动套餐 购买限制
export class activityLimit {
  update(data) {
    return request({
      url: '/v1/card-package-limit/update',
      method: 'put',
      data
    })
  }
  gupdate(params) {
    return request({
      url: '/v1/card-package-limit/gupdate',
      method: 'get',
      params
    })
  }
}

// - 星级规则
export class starRule {
  list(params) {
    return request({
      url: '/v1/upstar-set/index',
      method: 'get',
      params
    })
  }
  gcreate() {
    return request({
      url: '/v1/upstar-set/gcreate',
      method: 'get'
    })
  }
}

// 代金券流水表
export function get_water_table(params) {
  return request({
    url: '/v1/coupon/detail',
    method: 'get',
    params
  }).then(res => {
    return res.data
  })
}
// 活动明细渲染修改页
export function apiGetCardPackageDtlGupdate(query) {
  return request({
    url: '/v1/card-package-dtl/gupdate',
    method: 'get',
    params: query
  })
}
// 活动明细渲染修改页
export function apiPutCardPackageDtlUpdate(data) {
  return request({
    url: '/v1/card-package-dtl/update',
    method: 'put',
    data
  })
}
