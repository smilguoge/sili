<template>
  <!-- 销售开单 -->
  <div class="app-container">
    <div class="sales-top">
      <div class="detail-wrap">
        <div class="action-bar">
          <div class="customer-l">
            <!-- 顾客详细信息 -->
            <sales-member-form ref="salesMemberForm" @handleSetMember="handleSetMember" @getAchievement="getAchievement" @open="openDialog($event)" />
          </div>
          <div class="staff-r">
            <!-- 功能操作、技师列表 -->
            <sales-menubar @open="openDialog($event)" />
            <sales-staff-table />
          </div>
        </div>
        <div class="shortcut-bar">
          <!-- 快捷栏 -->
          <sales-shortcut-bar ref="salesShortcutBar" @getAct="getAct" />
        </div>
      </div>
      <div class="pay-wrap">
        <!-- 支付模块 -->
        <sales-pay-form :pay-data="paymentDialogPayFormData" :money-data="{shiFuJinE:shiFuJinENum,shiShouJinE:shiShouJinENum,heJi:heJiNum}" :sale-draft-data="saleDraftData" @open="openDialog($event)" />
      </div>
    </div>
    <div class="sales-bottom">
      <!-- 品项列表 -->
      <sales-item-table ref="salesItemTable" @handleSetTableData="handleSetTableData" @getAct="getAct" @open="openDialog($event)" />
    </div>
    <!-- 活动套餐弹窗 -->
    <activityDialog ref="activityDialog" @handleSetData="handleSetData" />
    <!-- 验证手机 -->
    <check-phone-dialog v-model="checkPhoneVisible" />
    <!-- 业绩分摊 -->
    <distribution-dialog v-model="distributionVisible" />
    <!-- 品项选择 -->
    <item-dialog v-model="itemVisible" />
    <!-- 支付方式 -->
    <payment-dialog ref="paymentDialog" v-model="paymentVisible" :customer-id="userData.id" :finally-total-money="finallyTotalMoney" @onSubmitPaymentDialog="onSubmitPaymentDialog" />
    <!-- 积分兑换 -->
    <integral-dialog v-model="integralVisible" />
    <!-- 抵扣 -->
    <deductions-dialog v-model="deductionVisible" />
    <!-- 代金券选择 -->
    <voucher-select-dialog v-model="voucherSelectVisible" :customer_id="userData.id" />
    <!-- 欠货明细 -->
    <owe-goods-dialog v-model="oweGoodsVisible" />
    <!-- 赠送明细 -->
    <give-detail-dialog v-model="giveDetailVisible" />
    <!-- 开单审批 -->
    <order-approval-dialog v-model="orderApprovalVisible" />

    <!-- 满额开单 -->
    <satisf-order-dialog v-model="satisfOrderVisible" />
    <!-- 几选几开单 -->
    <select-order-dialog v-model="selectOrderVisible" :sale-card-package-par="{id:userData.id,gtype:gtype,ctype:ctype}" :sale-card-package-search-par="{id:userData.id}" @onSubmit="onSubmitSelectOrderDialog" />
    <!-- 折扣开单 -->
    <discount-order-dialog v-model="discountOrderVisible" />
    <!-- name xu date 20/01/07  订金-->
    <money-Dialog v-model="moneyVisible" :customer-data="userData" />
  </div>
</template>

<script>
import { fetchList } from '@/api/demo/article'
import { saleDraftCheck, saleCardPackage } from '@/api/ManageSales/Order'

// - 页面组件
import salesMemberForm from './components/salesMemberForm' // 顾客信息
import salesMenubar from './components/salesMenubar' // 功能菜单
import salesStaffTable from './components/salesStaffTable' // 技师列表
import salesPayForm from './components/salesPayForm' // 支付信息
import salesShortcutBar from './components/salesShortcutBar' // 快捷选项
import salesItemTable from './components/salesItemTable' // 品项列表
// - 弹窗组件
import checkPhoneDialog from './components/checkPhoneDialog' // 验证手机
import distributionDialog from './components/distributionDialog' // 业绩分摊
import itemDialog from './components/itemDialog' // 品项选择
import paymentDialog from './components/paymentDialog' // 支付
import integralDialog from './components/integralDialog' // 积分兑换
import deductionsDialog from './components/deductionsDialog' // 抵扣
import voucherSelectDialog from './components/voucherSelectDialog' // 代金券选择
import oweGoodsDialog from './components/oweGoodsDialog' // 欠货明细
import giveDetailDialog from './components/giveDetailDialog' // 赠送明细
import orderApprovalDialog from './components/orderApprovalDialog' // 开单审批
import satisfOrderDialog from './components/satisfOrderDialog' // 满额开单
import selectOrderDialog from './components/selectOrderDialog' // 几选几开单
import discountOrderDialog from './components/discountOrderDialog' // 折扣开单
import moneyDialog from './FrontMoney/component/moneyDialog' // 订金
import activityDialog from './components/activityDialog' // 活动套餐弹窗
export default {
  name: 'InlineEditTable',
  components: {
    // -
    activityDialog, // 活动套餐弹窗
    salesMemberForm, // 顾客信息
    salesMenubar, // 功能菜单
    salesStaffTable, // 技师列表
    salesPayForm, // 支付信息
    salesShortcutBar, // 快捷选项
    salesItemTable, // 品项列表
    // -
    checkPhoneDialog, // 验证手机号
    distributionDialog, // 业绩分摊
    itemDialog, // 品项选择
    paymentDialog, // 支付
    integralDialog, // 积分兑换
    deductionsDialog, // 抵扣
    voucherSelectDialog, // 代金券选择
    oweGoodsDialog, // 欠货明细
    giveDetailDialog, // 赠送明细
    orderApprovalDialog, // 开单审批
    satisfOrderDialog, // 满额开单
    selectOrderDialog, // 几选几开单
    discountOrderDialog, // 折扣开单
    moneyDialog // 定金
  },
  data() {
    return {
      saleDraftDataId: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      // - Model Visible
      activityVisible: true,
      checkPhoneVisible: true, // 验证手机 FIXME: 结算后调用
      distributionVisible: false, // 业绩分摊
      paymentVisible: false, // 支付
      itemVisible: false, // 品项选择
      integralVisible: false, // 积分兑换
      deductionVisible: false, // 抵扣
      voucherSelectVisible: false, // 代金券选择
      oweGoodsVisible: false, // 欠货明细
      giveDetailVisible: false, // 赠送明细 FIXME: 结算后调用
      orderApprovalVisible: false, // 开单审批
      satisfOrderVisible: false, // 满额开单
      selectOrderVisible: false, // 几选几开单
      discountOrderVisible: false, // 折扣开单
      moneyVisible: false, // 订金
      performanceInfo: [], // 业绩分摊
      composeList: [], // 套餐品项目数据
      userData: { }, // 选择的会员信息
      paymentDialogPayFormData: {}, // 支付方式表单数据
      paymentDialogPayBackData: {} // 支付方式提交成功返回数据
    }
  },
  computed: {
    saleDraftData() {
      return {
        'sale_draft_id': this.saleDraftDataId, // 销售暂存单ID
        'is_approve': '0', // 是否需要审批[0:否,1:是]
        'ctype': this.userData.staff_id > 0 ? 1 : 0, // 顾客类型[0:顾客,1:员工]
        'customer_id': this.userData.id, // 顾客ID
        'total': this.paymentDialogPayFormData.heJi, // 销售订单合计
        'receive': this.paymentDialogPayFormData.shiShouJinE, // 销售订单实收金额
        'pay': this.paymentDialogPayFormData.shiFuJinE, // 销售订单实付金额
        'earnest_money': this.paymentDialogPayFormData.dingJinMoney, // 销售订单订金支付金额
        'activity_earnest': this.paymentDialogPayFormData.huoDongDingJinMoney, // 销售订单活动订金支付金额
        'cash': this.paymentDialogPayFormData.xiangJinMoney, // 销售订单现金支付金额
        'wechat': this.paymentDialogPayFormData.weixinMoney, // 销售订单微信支付金额
        'alipay': this.paymentDialogPayFormData.zhiFuBaoMoney, // 销售订单支付宝支付金额
        'dic_pos': 0, // 销售订单POS类型[1:嘉联]
        'pos': this.paymentDialogPayFormData.posTotalMoney, // 销售订单POS支付金额
        'dic_son_industry': this.paymentDialogPayFormData.ziChanYeSelect, // 销售订单子产业类型[1:暄妍]
        'industry': this.paymentDialogPayFormData.ziChanYeMoney, // 销售订单子产业支付金额
        'send_integral': 0, // 销售订单赠送积分，员工购买场景不存在赠送积分为0
        'paymentDialogPayFormData': this.paymentDialogPayFormData, // 支付的表单数据
        'paymentDialogPayBackData': this.paymentDialogPayBackData, // 支付的返回数据
        'goods_info': this.composeList, // 销售订单列表信息
        'deduction_info': [ // 销售订单套餐抵扣明细，数据来源详见http://api.meiyetongsoft.com/index.php?s=/54&page_id=1673
        ],
        'coupon_info': [ // 销售订单券抵扣信息，数据来源详见http://api.meiyetongsoft.com/index.php?s=/54&page_id=1673
        ],
        'exchange_info': [ // 销售订单老卡兑换信息，数据来源详见http://api.meiyetongsoft.com/index.php?s=/54&page_id=1673
        ],
        'consume_info': { // 销售订单消耗信息，数据来源详见http://api.meiyetongsoft.com/index.php?s=/54&page_id=1673
        },
        'performance_info': this.performanceInfo, // 销售订单业绩分摊信息
        'pay_info': this.paymentDialogPayBackData // 销售订单支付信息，数据来源详见http://api.meiyetongsoft.com/index.php?s=/54&page_id=1740
      }
    },
    shiFuJinENum() {
      var total = 0
      var composeList = this.composeList
      for (var i = 0, len = composeList.length; i < len; i++) {
        total += composeList[i]['pay'] * 1
      }
      return total
    },
    shiShouJinENum() {
      // 套餐实收总计（假数据）TODO
      // total_amount 暂时用这个字段

      var total = 0
      var composeList = this.composeList
      for (var i = 0, len = composeList.length; i < len; i++) {
        total += composeList[i]['total_amount'] * 1
      }
      return total
    },
    heJiNum() {
      var total = 0
      var composeList = this.composeList
      for (var i = 0, len = composeList.length; i < len; i++) {
        total += composeList[i]['total_amount'] * 1
      }
      return total
    },
    finallyTotalMoney() {
      var total = 0
      var composeList = this.composeList
      for (var i = 0, len = composeList.length; i < len; i++) {
        total += composeList[i]['total_amount'] * 1
      }
      return total
    },
    gtype() {
      return this.composeList[0] ? this.composeList[0]['goods_type'] : 0
    },
    ctype() {
      return this.userData.staff_id > 0 ? 1 : 0
    }
  },
  created() {
    // this.getList()

  },
  methods: {
    getSaleDraftData(customer_id, ctype) {
      var draft = []
      saleDraftCheck({ customer_id: customer_id, ctype: ctype }).then(res => {
        if ((res.data.length instanceof Array || typeof res.data.length === 'array') &&
          !res.data.length) {
          this.saleDraftDataId = 0
          draft = []
        } else {
          this.saleDraftDataId = res.data.id
          draft = JSON.parse(res.data.draft)
        }

        update()
      }).catch(res => {
        this.saleDraftDataId = 0
        draft = []
        update()
      })

      var this_ = this
      function update() {
        draft['goods_info'] = draft['goods_info'] ? draft['goods_info'] : []
        this_.$refs.salesItemTable.itemData = draft['goods_info']
        this_.composeList = this_.$refs.salesItemTable.itemData

        this_.$refs.paymentDialog.updatePayFormData(draft['paymentDialogPayFormData'] ? draft['paymentDialogPayFormData'] : {})
        this_.paymentDialogPayFormData = draft['paymentDialogPayFormData'] ? draft['paymentDialogPayFormData'] : {}

        this_.$refs.paymentDialog.updatePayBackData(draft['paymentDialogPayBackData'] ? draft['paymentDialogPayBackData'] : {})
        this_.paymentDialogPayBackData = draft['paymentDialogPayBackData'] ? draft['paymentDialogPayBackData'] : {}

        this_.$refs.salesMemberForm.$refs.distributionDialog.achiData = draft['performance_info'] ? draft['performance_info'] : []
        this_.performanceInfo = draft['performance_info'] ? draft['performance_info'] : []
      }
    },
    // 从组件获取品项数据
    handleSetTableData(data) {
      console.log('我是品项数据', data)
      this.composeList = data
      this.$refs.salesShortcutBar.setUserId(this.userData.id, this.composeList)
    },
    // 从组件获取客户信息
    handleSetMember(data) {
      this.userData = data
      const ctype = this.userData.staff_id > 0 ? 1 : 0 // 判断是会员还是员工
      this.$refs.salesItemTable.setUserId(data.id, ctype)
      this.$refs.salesShortcutBar.setUserId(data.id, this.composeList)
      console.log('我是选择的用户信息', data)
      this.getSaleDraftData(data.id, ctype)
    },
    // 从组件获取套餐数据
    handleSetData(data) {
      this.$refs.salesItemTable.init(data)
    },
    // 从子组件获取分摊用户信息
    getAchievement(data) {
      this.performanceInfo = data
      console.log('我是分摊用户信息', data)
    },
    test(data) {
      console.log('test', data)
    },
    // 获取套餐组件获取id
    getAct(id) {
      const ctype = this.userData.staff_id > 0 ? 1 : 0 // 判断是会员还是员工
      saleCardPackage({ id: id, gtype: 2, ctype: ctype }).then(response => {
        //套餐类型[1几选几2满额活动3期限卡4折扣设置5充值活动]
       if(response.data.card_package_type==1){
        this.$refs.activityDialog.init(id, response.data)
         }else if(response.data.card_package_type==2){
          this.satisfOrderVisible=true

         }else if(response.data.card_package_type==3){
          this.satisfOrderVisible=true
           
         }else if(response.data.card_package_type==4){
          this.discountOrderVisible=true

         }else if(response.data.card_package_type==5){
          this.satisfOrderVisible=true
           
         }
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        const items = response.data.items
        this.list = items.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          v.originalTitle = v.title //  will be used when user click the cancel botton
          return v
        })
        this.listLoading = false
      })
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    },
    openDialog(type) {
      // - type
      switch (type) {
        case 'distribution':
          // console.log('业绩分摊:', type)
          // this.distributionVisible = true
          this.distributionVisible = !this.distributionVisible
          break
        case 'itemselect':
          // console.log('品项选择:', type)
          this.itemVisible = !this.itemVisible
          break
        case 'payment':
          // console.log('支付:', type)

          if (!this.userData.id) {
            this.$message({
              message: '请选择用户',
              type: 'warning'
            })
            return
          }

          this.paymentVisible = !this.paymentVisible
          break
        case 'integral':
          // console.log('积分兑换:', type)
          this.integralVisible = !this.integralVisible
          break
        case 'deduction':
          // console.log('抵扣:', type)
          this.deductionVisible = !this.deductionVisible
          break
        case 'voucherSelect':
          // console.log('代金券:', type)
          this.voucherSelectVisible = !this.voucherSelectVisible
          break
        case 'oweGoods':
          // console.log('欠货明细:', type)
          this.oweGoodsVisible = !this.oweGoodsVisible
          break
        case 'satisfOrder':
          // console.log('满额:', type)
          this.satisfOrderVisible = !this.satisfOrderVisible
          break
        case 'selectOrder':
          // console.log('几选几:', type)

          if (!this.userData.id) {
            this.$message({
              message: '请选择用户',
              type: 'warning'
            })
            return
          }
          if (!this.gtype) {
            this.$message({
              message: '请选择品项',
              type: 'warning'
            })
            return
          }

          this.selectOrderVisible = !this.selectOrderVisible
          break
        case 'discountOrder':
          // console.log('折扣开单:', type)
          this.discountOrderVisible = !this.discountOrderVisible
          break
        case 'checkPhone':
          // console.log('验证电话号码', type)
          this.checkPhoneVisible = !this.checkPhoneVisible
          break
        case 'giveDetail':
          // console.log('赠送明细', type)
          this.giveDetailVisible = !this.giveDetailVisible
          break
        case 'orderApproval':
          // console.log('赠送明细', type)
          this.orderApprovalVisible = !this.orderApprovalVisible
          break
        case 'money':
          if (!this.userData.id) {
            this.$message.error('请先选择会员！')
          } else {
            this.moneyVisible = !this.moneyVisible
          }
          break
        default:
          console.log('参数错误:', type)
      }
    },
    // 支付方式表单提交事件
    onSubmitPaymentDialog(payFormData, payBackInfo) {
      this.paymentDialogPayFormData = payFormData
      this.paymentDialogPayBackData = payBackInfo
      console.log('支付方式表单提交事件', payFormData)
      console.log('支付方式表单提交成功返回', payBackInfo)
    },
    // 结账表单提交事件
    onSubmitSelectOrderDialog(orderList) {
      console.log('结账表单提交事件', orderList)

      var composeList = this.composeList
      for (var i = 0, len = composeList.length; i < len; i++) {
        for (var c = 0, clen = orderList.length; c < clen; c++) {
          if (composeList[i]['id'] == orderList[c]['combination_id']) {
            var hasSameGoods = false
            var goodsList = composeList[i]['list']
            for (var g = 0, glen = goodsList.length; g < glen; g++) {
              if (goodsList[g]['goods_id'] == orderList[c]['goods_id']) {
                goodsList[g]['quantity'] = goodsList[g]['quantity'] * 1 + orderList[c]['buyNum'] * 1
                hasSameGoods = true
                break
              }
            }
            if (!hasSameGoods) {
              goodsList.push(orderList[c])
            }
          }
        }
      }
    }
  }
}
</script>
<style >
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
</style>
<style scoped>
.app-container {
  min-width: 1500px;
}
.sales-top {
  width: 100%;
  height: 360px;
  display: flex;
}
.detail-wrap {
  width: 64%;
  height: 100%;
}
.action-bar {
  width: 100%;
  height: 300px;
  display: flex;
  flex: 1;
}
.action-bar .customer-l {
  height: 100%;
  width: 50%;
}
.action-bar .staff-r {
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.shortcut-bar {
  width: 100%;
  height: 60px;
  padding-top: 24px;
}
.pay-wrap {
  width: 36%;
  height: 100%;
}
.sales-bottom {
  width: 100%;
  /* min-height: 200px; */
  height: calc(100vh - 590px);
  padding-top: 20px;
}
</style>
