import request from '@/utils/request'
const Employeeapi = {
  // 首页表单列表
  getList(params,id) {
    return request({
      url: '/v1/staff/index?shop_ids=' + id,
      method: 'get',
      params
    }).then(res => {
      return res
    })
  },

  // 首页新增
  newAdd: (param) => {
    return request({
      url: '/v1/staff/create',
      method: 'post',
      data: param
    }).then(res => {
      return res
      console.log(res)
    })
  },

  // 首页删除
  delt: (id) => {
    return request({
      url: '/v1/staff/delete?id=' + id,
      method: 'delete'
    }).then(res => {
      return res
    })
  },

  // 首页修改
  edit: (data, id) => {
    return request({
      url: '/v1/staff/update?id=' + id,
      method: 'put',
      data: data
    }).then(res => {
      return res
    })
  },

  // 修改详情
  editInfo(id) {
    return request({
      url: '/v1/staff/gupdate?id=' + id,
      method: 'get'
    }).then(res => {
      return res.data
    })
  },

  // 首页查询
  query(data) {
    return request({
      url: '/v1/staff/index',
      method: 'get',
      params: data
    }).then(res => {
      return res
    })
  },

  // 员工异动列表
  moveList(id) {
    return request({
      url: '/v1/staff-change-dtl/index',
      method: 'get',
      params:{
        id:id
      }
    }).then(res => {
      return res.data.list
    })
  },

  // 员工借调结束
  end(id, data) {
    return request({
      url: '/v1/staff-change-dtl/update?id=' + id,
      method: 'put',
      data: data
    }).then(res => {
      return res
    })
  },

  // 人员变动新建
  add_m_info(param) {
    return request({
      url: 'v1/staff-change-dtl/create',
      method: 'post',
      data: param
    }).then(res => {
      return res
    })
  },

  // 员工新增渲染
  initInfo() {
    return request({
      url: 'v1/staff/gcreate',
      method: 'get'
    }).then(res => {
      return res.data
    })
  },

  // 获取介绍人
  get_references() {
    return request({
      url: '/v1/staff/search',
      method: 'get'
    }).then(res => {
      return res
    })
  },

  // 获取职务列表
  get_position(name) {
    return request({
      url: '/v1/position/list',
      method: 'get',
      params: {
        name: name
      }
    }).then(res => {
      return res.data
    })
  },

  // 获取门店列表
  get_shop(name) {
    return request({
      url: '/v1/shop/list',
      method: 'get',
      params: {
        name: name
      }
    }).then(res => {
      return res.data
    })
  },

  // 调出部门接口
  get_department(id) {
    return request({
      url: '/v1/staff-change-dtl/gupdate',
      method: 'get',
      params: {
        id: id
      }
    }).then(res => {
      return res.data
    })
  },
  // 门店关联关系树结构
  get_department_tree() {
    return request({
      url: '/v1/department/list',
      method: 'get',
    }).then(res => {
      return res.data
    })
  },
  get_department_tree2() {
    return request({
      url: '/v1/department/display',
      method: 'get',
    }).then(res => {
      return res.data
    })
  },
  // 顾客/员工订金明细
  get_deposit_details(params) {
    return request({
      url: '/v1/deposit/detail',
      method: 'get',
      params
    }).then(res => {
      return res.data
    })
  },
  // 顾客/员工代金券
  get_vouchers(params) {
    return request({
      url: '/v1/customer-coupon/index',
      method: 'get',
      params
    }).then(res => {
      return res.data
    })
  }
}
export default Employeeapi
