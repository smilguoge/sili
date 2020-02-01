<template>
  <!-- 积分兑换 -->
  <el-dialog
    title="积分兑换"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    width="360px"
  >
    <el-form
      ref="integralData"
      :model="integralData"
      label-width="90px"
      :rules="rules"
    >
      <el-form-item
        label="有效积分"
      >
        <el-input
          v-model="integral_info.myIntegral"
          style="width:210px"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="可用积分"
      >
        <el-input
          v-model="payIntegral"
          style="width:210px"
          placeholder="请输入积分"
          type="number"
          @input="changeValue"
        />
      </el-form-item>
      <el-form-item
        label="兑换金额"
      >
        <el-input
          v-model="integral_info.prices"
          style="width:210px"
          disabled
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-col :span="23">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit('integralData')"
        >确 定</el-button>
      </el-col>
      <div style="clear:both" />
    </div>
  </el-dialog>
</template>
<script>
import { integralRefresh, integralConfirm } from '@/api/ManageSales/Order.js'
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
      customer_id: '',
      goods_info: [],
      integralData: {},
      dialogVisible: false,
      rules: {
        integral: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
          { pattern: /^[\d]+$/, message: '积分只能是数字', trigger: 'blur' }
        ]
      },
      flagTime: 0,
      payIntegral: 0,
      integral_info: {
        myIntegral: '',
        maxUseIntegral: '',
        integralExchangeAmount: '',
        integralExchangeRateSet: '',
        payIntegral: 0,
        prices: 0
      }
    }
  },
  created() {
    // -
  },
  methods: {
    // 从父组件获取信息
    init(customer_id, arrs) {
      this.customer_id = customer_id
      this.goods_info = arrs
      integralRefresh({ customer_id: customer_id, goods_info: arrs }).then(response => {
        this.dialogVisible = true
        this.integral_info = response.data
        this.integral_info.payIntegral = response.data.myIntegral
        this.payIntegral = response.data.myIntegral
        this.integral_info.prices = this.payIntegral * this.integral_info.integralExchangeRateSet
      })
    },
    changeValue(val) {
      this.integral_info.payIntegral = val
      this.integral_info.prices = val * this.integral_info.integralExchangeRateSet
    },
    // 确认兑换
    handleSubmit(formName) {
      integralConfirm({ customer_id: this.customer_id, goods_info: this.goods_info, integral_info: this.integral_info }).then(response => {
        this.$message({
          message: '兑换成功！',
          type: 'success'
        })
        this.$emit('setIntegral', this.integral_info.prices)
        this.dialogVisible = false
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.integralData = {}
    },
    handleCancel() {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
