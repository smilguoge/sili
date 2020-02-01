<template>
  <!-- 抵扣 -->
  <el-dialog
    title="抵扣"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="deduction-dialog"
    width="1200px"
  >

    <div class="deduction-total-bar">
      <el-col :span="11" :offset="1">
        <span class="tit-font">券累计使用金额：</span>
        <span class="num info-color">{{ coupon }}</span>
      </el-col>
      <el-col :span="11">
        <span class="tit-font">老卡累计使用金额：</span>
        <span class="num info-color">{{ exchange }}</span>
      </el-col>
    </div>
    <el-col :span="22" :offset="1">
      <div class="deduction-table">
        <div class="deduction-head">
          <span class="tit-font">代金券</span>
        </div>
        <el-table
          :data="customer_coupon_lists"
          height="240px"
          class="item-table"
          fit
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50px"
            align="center"
          />
          <el-table-column
            align="center"
            label="券名称"
            fixed="left"
          >
            <template slot-scope="{row}">
              {{ row.coupon.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="券编码"
          >
            <template slot-scope="{row}">
              {{ row.coupon.code }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="券来源"
          >
            <template slot-scope="{row}">
              {{ row.coupon.type === '1' ? '礼券' : '活动赠送' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="失效日期"
          >
            <template slot-scope="{row}">
              {{ row.effective | parseTime('{y}-{m}-{d}') }}
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
            label="剩余金额"
          >
            <template slot-scope="{row}">
              {{ row.money }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="使用金额"
          >
            <template slot-scope="{row}">
              <el-input v-model="row.use_amount" type="number" placeholder="使用金额" @input="handleCoupon(row)" />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="券种类"
          >
            <template slot-scope="{row}">
              {{ row.coupon.dic_coupon_class }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="发放人"
          >
            <template slot-scope="{row}">
              {{ row.operator }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="发放日期"
          >
            <template slot-scope="{row}">
              {{ row.created_at | parseTime('{y}-{m}-{d}') }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <el-col :span="22" :offset="1">
      <div class="deduction-table">
        <div class="deduction-head">
          <span class="tit-font">兑换</span>
        </div>
        <el-table
          :data="sale_card_packagedtl_lists"
          height="240px"
          class="item-table"
          fit
          @selection-change="handleSelectionExchange"
        >
          <el-table-column
            type="selection"
            width="50px"
            align="center"
          />
          <el-table-column
            align="center"
            label="品项编号"
            fixed="left"
          >
            <template slot-scope="{row}">
              {{ row.project_code }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="品项名称"
          >
            <template slot-scope="{row}">
              {{ row.project_name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="套餐名称"
          >
            <template slot-scope="{row}">
              {{ row.saleCardPackage.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="总金额"
          >
            <template slot-scope="{row}">
              {{ row.actual_subtotal }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="单财"
          >
            <template slot-scope="{row}">
              {{ row.expend_price }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="调整金额"
          >
            <template slot-scope="{row}">
              {{ row.adjust_price }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="购买次数"
          >
            <template slot-scope="{row}">
              {{ row.quantity }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="剩余次数"
          >
            <template slot-scope="{row}">
              {{ row.surplus_quantity }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="兑换次数"
          >
            <template slot-scope="{row}">
              <el-input v-model="row.exchange_quantity" type="number" placeholder="次数" @input="handleExchangeCishu(row)" />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="增值倍数"
          >
            <template slot-scope="{row}">
              <el-input v-model="row.multiple" type="number" placeholder="增值倍数" @input="handleExchangeBeishu(row)" />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="失效日期"
          >
            <template slot-scope="{row}">
              {{ row.term_validity | parseTime('{y}-{m}-{d}') }}
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
  </el-dialog>
</template>
<script>
import { apiPostCardPackageDeduction, apiPostCardPackageDeductionConfirm } from '@/api/ManageSales/Order.js'
export default {
  name: '',
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      // -
      coupon: 0, // 抵扣金额
      exchange: 0, // 兑换金额
      customer_coupon_lists: [], // 代金券表数据
      sale_card_packagedtl_lists: [], // 兑换表数据
      deductionData: {
        name1: '666.00',
        table1: [],
        table2: []
      },
      dialogVisible: false,
      flagTime: 0,
      customer_id: '',
      customer_type: '',
      goods_info: [],
      customer_coupon: [], // 券抵扣信息
      sale_card_packagedtl: [] // 老卡兑换信息
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    }
  },
  created() {
    //
  },
  methods: {
    // 优惠券input实时监听
    handleCoupon(data) {
      this.coupon = 0
      for (let i = 0; i < this.customer_coupon.length; i++) {
        if (this.customer_coupon[i].id === data.id) {
          this.customer_coupon[i].use_amount = data.use_amount
          break
        }
      }
      this.countCoupon()
    },
    // 选中的优惠券
    handleSelectionChange(val) {
      this.customer_coupon = val.map(item => {
        const obj = {
          id: item.id,
          coupon_id: item.coupon_id,
          name: item.coupon.name,
          type: item.coupon.type,
          amount: item.amount,
          money: item.money,
          original_price: item.original_price,
          use_amount: item.use_amount,
          deduction_method: item.coupon.deduction_method
        }
        return obj
      })
      this.countCoupon()
    },
    // 计算优惠券价格
    countCoupon() {
      this.coupon = 0
      for (let i = 0; i < this.customer_coupon.length; i++) {
        this.coupon += this.customer_coupon[i].use_amount * 1
      }
    },
    // 兑换次数input实时监听
    handleExchangeCishu(data) {
      this.exchange = 0
      for (let i = 0; i < this.sale_card_packagedtl.length; i++) {
        if (this.sale_card_packagedtl[i].id === data.id) {
          this.sale_card_packagedtl[i].exchange_quantity = data.exchange_quantity
          break
        }
      }
      this.countExchange()
    },
    handleExchangeBeishu(data) {
      this.exchange = 0
      for (let i = 0; i < this.sale_card_packagedtl.length; i++) {
        if (this.sale_card_packagedtl[i].id === data.id) {
          this.sale_card_packagedtl[i].multiple = data.multiple
          break
        }
      }
      this.countExchange()
    },
    // 选中的兑换
    handleSelectionExchange(val) {
      this.sale_card_packagedtl = val.map(item => {
        const obj = {
          id: item.id,
          adjust_price: item.adjust_price,
          used_quantity: item.used_quantity,
          exchange_quantity: item.exchange_quantity,
          price: item.price,
          expend_price: item.expend_price,
          multiple: item.multiple
        }
        return obj
      })
      this.countExchange()
    },
    // 计算兑换价格
    countExchange() {
      this.exchange = 0
      for (let i = 0; i < this.sale_card_packagedtl.length; i++) {
        const datas = this.sale_card_packagedtl[i]
        this.exchange += datas.exchange_quantity * datas.multiple * datas.expend_price
      }
    },
    // 从父组件获取用户数据
    init(customer_id, arrs, customer_type) {
      this.customer_id = customer_id
      this.customer_type = customer_type
      this.goods_info = arrs
      apiPostCardPackageDeduction({ customer_id: customer_id, goods_info: arrs }).then(response => {
        const customerCouponLists = response.data.customer_coupon_lists
        this.customer_coupon_lists = customerCouponLists.map(item => {
          this.$set(item, 'use_amount', item.amount)
          return item
        })
        const cardPackagedtlLists = response.data.sale_card_packagedtl_lists
        this.sale_card_packagedtl_lists = cardPackagedtlLists.map(item => {
          this.$set(item, 'exchange_quantity', item.surplus_quantity)
          this.$set(item, 'multiple', 1)
          return item
        })
        this.dialogVisible = true
      })
    },
    handleSubmit() {
      if (this.coupon + this.exchange > 0) {
        apiPostCardPackageDeductionConfirm({ customer_id: this.customer_id, ctype: this.customer_type, goods_info: this.goods_info, customer_coupon: this.customer_coupon, sale_card_packagedtl: this.sale_card_packagedtl }).then(response => {
          this.$emit('handleSetMoney', this.coupon, this.exchange)
          this.dialogVisible = false
        })
      } else {
        this.$message({
          message: '请选择可兑换优惠券！',
          type: 'warning'
        })
      }
    },
    handleCancel() {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.deduction-dialog{
  .deduction-total-bar {
      height: 50px;
      margin: -10px 50px 0;
      border-left: 4px solid #6666FE;
      border-radius: 4px;
      background-color: #F5F7FA;
      line-height: 50px;
      font-size: 14px;
      .num {
        font-size: 16px;
      }
    }
  .deduction-table {
    margin: 20px 0;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    overflow: hidden;
    .deduction-head {
      height: 36px;
      line-height: 36px;
      padding: 0 24px;
      background-color: #F5F7FA;
      border-bottom: 1px solid #DCDFE6
    }
  }
}
</style>
