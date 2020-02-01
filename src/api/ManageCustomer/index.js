import request from '@/utils/request'
const getList = {
  get: (params) => {
    return request({
      url: '/v1/customer/index',
      method: 'get',
      params
    }).then(res => {
      return res
    })
  }
  
}
export default getList
