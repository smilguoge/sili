import request from '@/utils/request'
const clearingApi = {
  // 盘点明细列表
  getInventoryList(params) {
    return request({
      url: 'v1/wh-inventory/index',
      method: 'get',
      params
    }).then(res => {
      return res.data
    })
  },
  // 新建盘点明细渲染
  addInventory(params){
    return request({
      url: 'v1/wh-inventory/gcreate',
      method: 'get',
      params
    }).then(res => {
      return res.data
    })
  },
  // 盘点明细查询
  getInventoryDetail(params){
    return request({
      url: 'v1/wh-inventory-dtl/index',
      method: 'get',
      params
    }).then(res => {
      return res.data
    })
  },
  // 新建盘点明细
  create(data) {
    return request({
      url: '/v1/wh-inventory/create',
      method: 'post',
      data
    })
  },
  //修改盘点明细
  update(data, id) {
    return request({
      url: '/v1/wh-inventory-dtl/update?id=' + id,
      method: 'put',
      data
    })
  },
  //取消判断
  delete(id) {
    return request({
      url: '/v1/wh-inventory/delete?id=' + id,
      method: 'delete'
    })
  },
  //更新盘点状态
  updateState(data, id) {
    return request({
      url: '/v1/wh-inventory/update?id=' + id,
      method: 'put',
      data
    })
  },
  //新建盘点处罚
  punishment(data) {
    return request({
      url: '/v1/wh-punishment/create',
      method: 'post',
      data
    })
  },
  //获取产品列表
  search(params) {
    return request({
      url: '/v1/wh-inventory/search',
      method: 'get',
      params
    })
  },
}
export default clearingApi