<template>
  <!-- 代金券 -->
  <el-dialog
    title="代金券"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="voucher-dialog"
    width="1200px"
  >
    <el-col :span="22" :offset="1">
      <div class="filter-container clearfix">
        <span class="filter-item tit-font">券名称：</span>
        <el-input
          v-model="packageData.name"
          class="filter-item"
          style="width:210px;margin-right:10px"
          placeholder="请输入券名称"
        />
        <el-button
          class="filter-item"
          type="primary"
          @click="getList()"
        >查 询</el-button>
      </div>
      <div class="voucher-table">
        <el-table
          ref="voucherMultipleTable"
          :data="packageData.table"
          height="380px"
          class="item-table"
          fit
        >
          <el-table-column type="selection" width="50px" align="center" :selectable="hasCheckSelect" />
          <el-table-column
            align="center"
            label="券名"
          >
            <template slot-scope="{row}">
              {{ row.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="发送数量"
          >
            <el-input
              v-model="row.send_number"
              slot-scope="{row}"
              type="text"
              placeholder="数量"
              oninput="value=value.replace(/[^\d]/g, '')"
              :disabled="!hasCheckSelect(row)"
            />
          </el-table-column>
          <el-table-column
            align="center"
            label="总张数"
          >
            <template slot-scope="{row}">
              {{ row.total_num }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="剩余张数"
          >
            <template slot-scope="{row}">
              {{ row.total_num - row.received_num }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="来源"
          >
            <template slot-scope="{row}">
              {{ row.type == 1 ? '礼券' : '活动赠送' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            min-width="130px"
            label="顾客可购买张数/最高赠送张数"
          >
            <template slot-scope="{row}">
              {{ row.type == 1 ? row.customer_buy_num : row.max_send_num }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="失效方式"
          >
            <template slot-scope="{row}">
              {{ row.failure_mode == 0 ? '周期' : '时间段' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="有效天数"
          >
            <template slot-scope="{row}">
              {{ row.failure_mode == 0 ? row.effective_day : '' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="开始时间"
            min-width="160px"
          >
            <template slot-scope="{row}">
              {{ row.failure_mode == 1 ? getTime(row.start_send_at) : '' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="结束时间"
            min-width="160px"
          >
            <template slot-scope="{row}">
              {{ row.failure_mode == 1 ? getTime(row.end_send_at) : '' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="券种类"
          >
            <template slot-scope="{row}">
              {{ row.coupon_class_name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="面额"
          >
            <template slot-scope="{row}">
              {{ row.amount }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="赠送金额"
          >
            <template slot-scope="{row}">
              {{ row.send_price }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="适用顾客属性"
            min-width="160px"
          >
            <template slot-scope="{row}">
              {{ getDicCustomerAttr(row.dic_customer_attr) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-col :span="23">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit()"
        >确 定</el-button>
      </el-col>
      <div style="clear:both" />
    </div>

    <!-- 代金券支付 -->
    <test-pay-dialog ref="distributPayVisible" v-model="distributPayVisible" :customerId="customer_id" @cancel="cancel" />
  </el-dialog>
</template>
<script>
import { saleCouponList, saleCouponUpdate } from '@/api/ManageSales/voucher.js'
import testPayDialog from './voucherPayDialog'
import { parseTime } from '@/utils'
export default {
  name: '',
  components: { testPayDialog },
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    customer_id: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      // -
      packageData: {
        name: '',
        table: [],
        dic: []
      },
      goods_info: [
        {
          goods_id: 1001,
          gtype: 3,
          type: 1,
          name: '元旦活动赠券',
          quantity: 1,
          original_price: 1000
        }
      ],
      dialogVisible: false,
      distributVisible: false,
      distributPayVisible: false,
      flagTime: 0
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        this.getList()
      }
    }
  },
  created() {
    // -
  },
  methods: {
    // 时间格式化
    getTime(time) {
      return parseTime(time)
    },
    // 展示使用顾客属性
    getDicCustomerAttr(customer_attr) {
      var customerAttr = customer_attr.split(',')
      var str = []
      if (customerAttr && this.packageData.dic) {
        for (var i = 0; i < customerAttr.length; i++) {
          for (var j = 0; j < this.packageData.dic.dic_customer_attr.length; j++) {
            if (this.packageData.dic.dic_customer_attr[j] && parseInt(this.packageData.dic.dic_customer_attr[j]['value']) === parseInt(customerAttr[i])) {
              str.push(this.packageData.dic.dic_customer_attr[j]['label'])
            }
          }
        }
      }
      return str.join(',')
    },
    // 是否禁止选中
    hasCheckSelect(row) {
      return row.is_disable === 0
    },
    openDialog(val) {
      if (val === 'pay') {
        this.distributPayVisible = !this.distributPayVisible
      } else {
        this.distributVisible = !this.distributVisible
      }
    },
    handleSubmit(formName) {
      // 提交操作
      const selection = this.$refs.voucherMultipleTable.selection
      const goods_info = []
      if (selection.length === 0) {
        this.$message({
          message: '请选择至少一张代金券',
          type: 'warning'
        })
        return false
      }
      // 遍历判断是否有填写发送数量
      for (let i = 0; i < selection.length; i++) {
        // 判断是否为is_disable
        // if (selection[i].is_disable == 1) {
        //   this.$message({
        //     message: '所选择的代金券必须是可选状态!',
        //     type: 'warning'
        //   })
        //   return false
        // }
        // 判断数量是否大于0
        if (!selection[i].send_number || parseInt(selection[i].send_number) === 0) {
          this.$message({
            message: '选择代金券数量必须大于0',
            type: 'warning'
          })
          return false
        }
        // 判断数量是否小于或等于剩余张数
        if (parseInt(selection[i].send_number) > (parseInt(selection[i].total_num) - parseInt(selection[i].received_num))) {
          this.$message({
            message: '选择代金券数量必须不超过剩余张数',
            type: 'warning'
          })
          return false
        }
        goods_info.push({
          goods_id: selection[i].id,
          gtype: 3,
          type: selection[i].type,
          name: selection[i].name,
          quantity: selection[i].send_number,
          original_price: selection[i].original_price
        })
      }
      // 进行提交
      saleCouponUpdate({ customer_id: this.customer_id, goods_info: goods_info }).then(response => {
        // 如果有购买券的话,弹出付款页面
        if (response.data.isBuy) {
          // 赋值
          this.$refs.distributPayVisible.setGoodInfo(response.data.goods_info)
          this.$refs.distributPayVisible.ini()
          this.handleCancel()
        } else if (response.data.isSend) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.handleCancel()
        } else {
          this.$message({
            message: response.message,
            type: 'warning'
          })
        }
      })
      // const curr = new Date()
      // if (curr - this.flagTime > 1000) {
      //   this.handleCancel()
      //   this.flagTime = curr
      // }
    },
    cancel() {
      this.distributVisible = false
      this.distributPayVisible = false
    },
    handleCancel() {
      this.$parent.voucherSelectVisible = false
    },
    // 获取所有优惠券
    getList() {
      saleCouponList({ customer_id: this.customer_id, name: this.packageData.name }).then(response => {
        this.packageData.table = response.data.list
        this.packageData.dic = response.data.dic
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.voucher-dialog{
  .filter-container {
    margin-top: -10px;
    padding: 16px 24px 8px;
    border: 1px solid #DCDFE6;
    border-bottom: 0;
    border-radius: 4px 4px 0 0;
  }

  .voucher-table {
    margin-bottom: 20px;
    border: 1px solid #DCDFE6;
    border-radius: 0 0 4px 4px;
    overflow: hidden;
  }
}

</style>
