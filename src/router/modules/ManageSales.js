/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const Routers = {
  path: '/ManageSales',
  component: Layout,
  redirect: '/ManageSales/Order/sales-order',
  name: 'ManageSales',
  meta: {
    title: '销售消耗', // 销售管理
    icon: 'chart'
  },
  children: [
    // 【开单】
    {
      path: 'Order',
      component: () => import('@/view/ManageSales/Order'),
      name: 'Order',
      redirect: '/ManageSales/Order/sales-order',
      meta: {
        title: '开单'
      },
      children: [{
        path: 'sales-order',
        name: 'sales-order',
        component: () => import('@/view/ManageSales/Order/sales-order'),
        meta: {
          title: '销售开单'
        }
      },
      {
        path: 'sale-order-manage',
        name: 'sale-order-manage',
        component: () => import('@/view/ManageSales/Order/sales-order-manage'),
        meta: {
          title: '销售暂存管理'
        }
      },
      {
        path: 'sales-temporary-gift',
        name: 'sales-temporary-gift',
        component: () => import('@/view/ManageSales/Order/sales-temporary-gift'),
        meta: {
          title: '临时赠送管理'
        }
      },
      {
        path: 'sales-pos-query',
        name: 'sales-pos-query',
        component: () => import('@/view/ManageSales/Order/sales-pos-query'),
        meta: {
          title: 'POS单查询'
        }
      },
      {
        path: 'return-manage',
        name: 'return-manage',
        component: () => import('@/view/ManageSales/Order/index02'),
        meta: {
          title: '退货管理'
        }
      },
      {
        path: 'front-money',
        name: 'front-money',
        component: () => import('@/view/ManageSales/Order/FrontMoney/front-money'),
        meta: {
          title: '订金管理'
        }
      }
      ]
    },
    // 【预约评价】
    {
      path: 'AppointmentAppraise',
      name: 'AppointmentAppraise',
      component: () => import('@/view/ManageSales/AppointmentAppraise/'),
      redirect: '/ManageSales/AppointmentAppraise/appoint-manage',
      meta: {
        title: '预约评价'
      },
      children: [{
        path: 'appoint-manage',
        name: 'appoint-manage',
        component: () => import('@/view/ManageSales/AppointmentAppraise/index01'),
        meta: {
          title: '预约管理'
        }
      },
      {
        path: 'appoint-detail',
        name: 'appoint-detail',
        component: () => import('@/view/ManageSales/AppointmentAppraise/index02'),
        meta: {
          title: '门店预约明细'
        }
      }
      ]
    },
    // 【款项交接】
    {
      path: 'MoneyTransfer',
      name: 'MoneyTransfer',
      component: () => import('@/view/ManageSales/MoneyTransfer/'),
      redirect: '/ManageSales/MoneyTransfer/transfer',
      meta: {
        title: '款项交接'
      },
      children: [{
        path: 'transfer',
        name: 'transfer',
        component: () => import('@/view/ManageSales/MoneyTransfer/moneyTable'),
        meta: {
          title: '款项交接'
        }
      },
      {
        path: 'receive-detail',
        name: 'receive-detail',
        component: () => import('@/view/ManageSales/MoneyTransfer/index02'),
        meta: {
          title: '收款明细'
        }
      }
      ]
    },
    // 【消费消耗】
    {
      path: 'ConsumptionReport',
      name: 'ConsumptionReport',
      component: () => import('@/view/ManageSales/ConsumptionReport/'),
      redirect: '/ManageSales/ConsumptionReport/sales-detail',
      meta: {
        title: '消费消耗'
      },
      children: [
        {
          path: 'consumption-order',
          name: 'consumption-order',
          component: () => import('@/view/ManageSales/ConsumptionReport/consumption-order'),
          meta: {
            title: '消耗开单'
          }
        },
        {
          path: 'consumption-detail',
          name: 'consumption-detail',
          component: () => import('@/view/ManageSales/ConsumptionReport/consumption-detail'),
          meta: {
            title: '消耗明细'
          }
        },
        {
          path: 'consumption-order-manage',
          name: 'consumption-order-manage',
          component: () => import('@/view/ManageSales/ConsumptionReport/consumption-order-manage'),
          meta: {
            title: '消耗暂存单'
          }
        },
        {
          path: 'sales-project',
          name: 'sales-project',
          component: () => import('@/view/ManageSales/ConsumptionReport/index02'),
          meta: {
            title: '产品项目销售明细'
          }
        }
      ]
    }

  ]
}

export default Routers
