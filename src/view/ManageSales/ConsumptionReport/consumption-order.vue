<template>
  <!-- 销耗开单 -->
  <div v-loading="listLoading" class="app-container consumption-order">
    <div class="consume-top">
      <!-- 顾客详细信息 -->
      <consume-member-form v-model="customerData" @submit="handleSettlement($event)" />
    </div>
    <div class="consume-bottom">
      <!-- 订单明细/顾客列表 -->
      <order-detail-table
        v-model="itemTable"
        :staff-list="staffList"
        :project-list="projectTable"
        :marking-list="markingList"
        :customer-data="customerData"
        :customer-type="customerType"
        @updateTotal="handleUpdateTotal($event)"
        @update="handleUpdatePro($event)"
        @open="openDialog($event)"
      />
    </div>
    <!-- 赠送明细 -->
    <give-detail-dialog
      ref="giveDialog"
      v-model="giveVisible"
      @submit="submitGive($event)"
    />
  </div>
</template>

<script>
import { consume } from '@/api/ManageSales/SalesConsume'
const consumeApi = new consume()
// - 页面组件
import consumeMemberForm from './components/consumeMemberForm' // 顾客信息
import orderDetailTable from './components/orderDetailTable' // 订单品项
// - 弹窗组件
import giveDetailDialog from './components/giveDetailDialog' // 赠送明细
export default {
  name: 'ConsumptionOrder',
  components: {
    consumeMemberForm, // 顾客信息
    orderDetailTable, // 订单明细
    // -
    giveDetailDialog // 赠送明细
  },
  data() {
    return {
      list: null,
      listLoading: true,
      customerData: {}, // 会员数据
      projectTable: [], // 已购品项列表数据
      itemTable: [], // 已选择品项列表数据
      staffList: [], // 服务技师列表
      markingList: [], // 耗材详细信息列表
      customerType: [], // 顾客类型

      // - Model Visible
      giveVisible: false // 赠送明细
    }
  },
  watch: {},
  created() {
    this.getData()
  },
  methods: {
    test() {
      this.$message.info('开发中...')
    },
    getData() {
      const reqData = this.$route.params
      // request
      if (reqData.type) {
        this.listLoading = false
        if (reqData.type === 'orderManage') {
          // from 暂存单
          this.$notify({
            title: '提示',
            message: '请在当前订单结算完成前不要离开此界面，避免当前订单数据丢失（包括但不限于 切换界面、关闭 等操作）；当前数据来源：消耗单暂存',
            duration: 10000
          })
          consumeApi.view({ id: reqData.id })
            .then(res => {
              const items = res.data
              this.customerData = items.customer
              this.customerType = items.customer_type
              this.staffList = items.staff
              this.projectTable = items.project
              this.itemTable = items.choose
            })
        } else {
          // from 预约
          this.$notify({
            title: '提示',
            message: '请在当前订单结算完成前不要离开此界面，避免当前订单数据丢失（包括但不限于 切换界面、关闭 等操作）；当前数据来源：预约管理',
            duration: 10000
          })
        }
      } else {
        this.$message({
          type: 'error',
          showClose: true,
          duration: 10000,
          message: 'ID参数错误，请关闭当前页面，通过 “消耗暂存单” 或 “预约管理” 重新进入！'
        })
        return
      }
    },

    openDialog(type) {
      // - type
      // console.log('ok', type)
      switch (type) {
        case 'itemSelect':
          // FIXME: 该分支移除
          // console.log('选择已购项目:', type)
          this.itemVisible = !this.itemVisible
          break
        case 'giveDetail':
          // console.log('赠送明细', type)
          this.giveVisible = !this.giveVisible
          break
        default:
          this.$message.danger('对话框参数错误，请联系管理员')
          console.log('参数错误:' + type)
      }
    },

    submitGive(data) {
      // - request 提交赠送明细
      this.$message.success('操作成功')
      this.$refs['giveDialog'].handleCancel()
    },

    handleUpdatePro(arr) {
      /**
       * 更新 projectTable 的数据
       * 由 orderDetalTable 组件和 itemSelectDialog 组件维护
       */
      this.projectTable = arr
    },

    handleUpdateTotal(val) {
      // 更新财耗总额
      this.$set(this.customerData, 'total', val)
    },

    handleSettlement(type) {
      /**
       * 处理结算/暂存
       *
       * 在常量 data 创建后有进行判断创建新属性以及赋值，用以区分多种不同操作
       * 修改时请先详读接口文档与原型说明
       */
      const _that = this
      const reqData = _that.$route.params // 转入携带数据（暂存跳转/预约跳转）

      // 判断是否输入密码
      if (!_that.customerData.pay_pwd) {
        _that.$message.error('请输入密码再进行结算！')
        return
      }

      // 数据组装
      const data = {
        consume_order: {
          is_staff: _that.customerData.is_staff,
          customer_id: _that.customerData.customer_id,
          pay_pwd: _that.customerData.pay_pwd,
          total: _that.customerData.total,
          integral: 0
        },
        consume_detail: _that.itemTable
      }

      // 判断数据来源是暂存单还是预约管理
      if (reqData.type === 'orderManage') {
        // 数据来源 => 暂存单
        data.consume_order.id = reqData.id
      } else if (reqData.type === 'FIXME:') {
        // 数据来源 => 预约管理
        data.consume_order.booking_id = reqData.id
      } else {
        _that.$message.error("'consume_order.id' 参数错误，请联系管理员！")
        return
      }

      // 判断行为是结算还是暂存
      if (type === 'settlement') {
        // 结算
        data.consume_order.status = '1'
      } else if (type === 'save') {
        // 暂存
        data.consume_order.status = '0'
      } else {
        _that.$message.error("'consume_order.status' 参数错误，请联系管理员！")
        return
      }

      // request
      consumeApi.pay(data).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.consumption-order {
  min-width: 1100px;

    .consume-top {
        width: 100%;
        height: 234px;
        display: flex;
    }

    .consume-bottom {
        width: 100%;
        height: calc(100vh - 446px);
        padding-top: 20px;
    }
}
</style>
