<template>
  <!-- 代金券支付 -->
  <el-dialog
    v-el-drag-dialog
    title="代金券支付"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    top="20px"
    :fullscreen="false"
    class="payment-dialog"
    width="1100px"
    @open="onOpenPaymentDialog"
  >
    <el-form
      :model="payData"
    >
      <el-row class="row-background h68" style="margin-top:-20px">
        <el-col :span="1" class="iconfont-bar">
          <i class="iconfont icon-qian2" style="color:#F4EA2A" />
        </el-col>
        <el-col :span="12">
          <el-form-item label="订金:" label-width="70px">
            <el-input
              v-model="payData.dingJinMoney"
              class="pay-input"
              placeholder="请输入金额"
            />
            <span class="tit-font">剩余订金：</span>
            <span class="err-color">{{ (payData.maxDingJinMoney-payData.dingJinMoney).toFixed(2) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="活动订金:">
            <el-input
              v-model="payData.huoDongDingJinMoney"
              class="pay-input"
              placeholder="请输入金额"
            />
            <span class="tit-font">剩余订金：</span>
            <span class="err-color">{{ (payData.maxHuoDongDingJinMoney-payData.huoDongDingJinMoney).toFixed(2) }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-background h68">
        <el-col :span="1" class="iconfont-bar">
          <i class="iconfont icon-weixinzhifu" style="color:#6BCC03" />
        </el-col>
        <el-col :span="12">
          <el-form-item label="微信:" label-width="70px">
            <el-input
              v-model="payData.weixinMoney"
              class="pay-input"
              placeholder="请输入金额"
            />
            <el-popover
              placement="right"
              width="326"
              trigger="click"
            >
              <el-image
                style="width:300px; height:300px"
                :src="imgUrl"
                fit="fill"
              />
              <el-button
                slot="reference"
                type="primary"
                size="small"
                plain
              >扫码支付</el-button>
            </el-popover>
            <span v-if="payData.weiXinPayed" class="suc-color ispay-font">{{ '已支付' }}</span>
            <span v-else class="err-color ispay-font">{{ '未支付' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="微信支付金额:">
            <span class="info-color ">{{ payData.weiXinPayed?payData.weixinMoney:'0.00' }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-background h68">
        <el-col :span="1" class="iconfont-bar">
          <i class="iconfont icon-zhifubao" style="color:#06B4FD" />
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付宝:" label-width="70px">
            <el-input
              v-model="payData.zhiFuBaoMoney"
              class="pay-input"
              placeholder="请输入金额"
            />
            <el-popover
              placement="right"
              width="326"
              trigger="click"
            >
              <el-image
                style="width:300px; height:300px"
                :src="imgUrl"
                fit="fill"
              />
              <el-button
                slot="reference"
                type="primary"
                size="small"
                plain
              >扫码支付</el-button>
            </el-popover>
            <span v-if="payData.zhiFuBaoPayed" class="suc-color ispay-font">{{ '已支付' }}</span>
            <span v-else class="err-color ispay-font">{{ '未支付' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="支付宝支付金额:">
            <span class="info-color ">{{ payData.zhiFuBaoPayed?payData.zhiFuBaoMoney:'0.00' }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-background h68">
        <el-col :span="1" class="iconfont-bar">
          <i class="iconfont icon-qianbao1" style="color:#F4EA2A" />
        </el-col>
        <el-col :span="22">
          <el-form-item label="现金:" label-width="70px">
            <el-input
              v-model="payData.xiangJinMoney"
              class="pay-input"
              placeholder="请输入金额"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-background h68">
        <el-col :span="1" class="iconfont-bar">
          <i class="iconfont icon-guanlian" style="color:#6666FE" />
        </el-col>
        <el-col :span="23">
          <el-form-item label="子产业:" label-width="70px">
            <el-select v-model="payData.ziChanYeSelect" class="pay-input" placeholder="请选择子产业">
              <el-option v-for="(item,index) in payData.ziChanYeList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
            <el-input
              v-model="payData.ziChanYeMoney"
              style="width:320px"
              class="pay-input"
              placeholder="请输入金额"
              type="number"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-background h68">
        <el-col :span="1" class="iconfont-bar">
          <i class="iconfont icon-jifen1" style="color:#F4EA2A" />
        </el-col>
        <el-col :span="12">
          <el-form-item label="积分:" label-width="70px">
            <el-input
              v-model="integral.inputIntegral"
              class="pay-input"
              placeholder="请输入积分"
              :disabled="!integral.isExchange"
              @blur="saleCouponCheck"
            />
            <span class="tit-font">有效总积分：</span>
            <span class="err-color">{{ getMaxIntegral }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="积分兑换金额:">
            <span class="info-color ">{{ getInputIntegralAmount }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-background">
        <el-col :span="1" class="iconfont-bar">
          <i class="iconfont icon-cardb" style="color:#06B4FD" />
        </el-col>
        <el-col :span="22">
          <el-form-item label="POS单:" label-width="70px">
            <div class="pos-table">
              <div class="pos-table-head">
                <el-button
                  type="primary"
                  class="pos-tool-btn"
                  plain
                  size="small"
                  @click="openDialog"
                >新 增</el-button>
              </div>
              <el-table :data="payData.posOrderList" height="200px" fit>
                <el-table-column label="POS机类型" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.posMachineName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="POS单信息" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.posOrderBalance+'元，编码'+row.posOrderId }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="实际交易额" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.posFinallyMoney.toFixed(2) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="row">
                    <el-button type="danger" size="mini" @click="onRemovePosOrder(row.$index)">删 除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="pay-total-bar">
        <el-col :span="6" class="right-line pay-total-wrap">
          <span>总金额:</span>
          <span class="main-color num">{{ finallyTotalMoney.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6" :offset="1" class="pay-total-wrap">
          <span>已付金额:</span>
          <span class="info-color num">{{ finallyPayedMoney.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6" class="pay-total-wrap">
          <span>未付金额:</span>
          <span class="err-color num">{{ finallyUnpayedMoney.toFixed(2) }}</span>
        </el-col>
      </div>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-col :span="23">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button
          type="primary"
          @click="handlerSubmit"
        >确 定</el-button>
      </el-col>
      <div style="clear:both" />
    </div>

    <!-- 添加单据信息 -->
    <el-dialog
      v-el-drag-dialog
      title="添加单据信息"
      :visible.sync="dialogChildVisible"
      :before-close="handleChildCancel"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="400px"
    >
      <el-form
        label-width="90px"
      >
        <el-form-item label="POS机类型">
          <el-select v-model="payData.posOrder.posMachineId" class="w100" placeholder="请选择POS机" @change="onChangePos">
            <el-option v-for="(item,index) in payData.posOrder.posMachineList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="POS单详情">
          <el-select v-model="payData.posOrder.posOrderId" class="w100" placeholder="请选择信息">
            <el-option v-for="(item,index) in payData.posOrder.posOrderList" :key="index" :label="item.balance+'元，编码'+item.pos_order_id" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="实际交易额">
          <el-input
            v-model="payData.posOrder.posFinallyMoney"
            class="w100"
            placeholder="请输入金额"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-col :span="23">
          <el-button @click="handleChildCancel">取 消</el-button>
          <el-button
            type="primary"
            @click="onAddPosOrder()"
          >确 定</el-button>
        </el-col>
        <div style="clear:both" />
      </div>
    </el-dialog>
    <!-- 业绩分配 -->
    <test-dialog v-model="distributVisible" :goods-info="goodsInfo" :customerId="customerId" @cancel="cancel" />
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { paymentGcreate, paymentFindData, paymentCheck } from '@/api/ManageSales/Payment'
import { saleCouponCreate, integralCheck, saleCouponCheck } from '@/api/ManageSales/voucher.js'
import testDialog from './voucherDistributDialog'
export default {
  name: '',
  components: { testDialog },
  directives: { elDragDialog, testDialog },
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    customerId: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      // -
      firstOpenPaymentDialog: true,
      payData: { // 支付方式弹窗数据
        dingJinMoney: '',
        maxDingJinMoney: 0,
        huoDongDingJinMoney: '',
        maxHuoDongDingJinMoney: 0,
        weixinMoney: '',
        weiXinPayed: false,
        zhiFuBaoMoney: '',
        zhiFuBaoPayed: false,
        xiangJinMoney: '',
        ziChanYeList: [],
        ziChanYeSelect: '',
        ziChanYeMoney: '',
        posOrder: { // pos单弹窗数据
          posMachineList: [],
          posMachineId: '',
          posOrderList: [],
          posOrderBalance: 0,
          posOrderId: '',
          posFinallyMoney: ''
        },
        posOrderList: [ // pos单列表
          // {
          //   posMachineId: 0,
          //   posMachineName: '',
          //   posOrderBalance: '',
          //   posOrderId: '',
          //   posFinallyMoney: 0
          // }
        ]
      },
      integral: {
        isExchange: false,
        myIntegral: 0,
        totalIntegral: 0,
        integralExchangeRateSet: 0,
        inputIntegral: ''
      },
      input_integral_amount: 0,
      goodsInfo: [],
      num: 1,
      distributVisible: false,
      dialogVisible: false,
      dialogChildVisible: false,
      imgUrl: 'http://img4.imgtn.bdimg.com/it/u=302619714,1453174966&fm=26&gp=0.jpg'
    }
  },
  computed: {
    posMachineName() {
      var id = this.payData.posOrder.posMachineId
      var list = this.payData.posOrder.posMachineList
      for (var i = 0, len = list.length; i < len; i++) {
        // eslint-disable-next-line eqeqeq
        if (list[i]['id'] == id) { return list[i]['name'] }
      }
      return ''
    },
    // 积分金额
    getInputIntegralAmount() {
      return this.input_integral_amount > 0 ? this.input_integral_amount : 0
    },
    getMaxIntegral() {
      return this.integral.myIntegral > this.integral.totalIntegral ? this.integral.totalIntegral : this.integral.myIntegral
    },
    posOrderId() {
      var id = this.payData.posOrder.posOrderId
      var list = this.payData.posOrder.posOrderList
      for (var i = 0, len = list.length; i < len; i++) {
        // eslint-disable-next-line eqeqeq
        if (list[i]['id'] == id) { return list[i]['pos_order_id'] }
      }
      return ''
    },
    posOrderBalance() {
      var id = this.payData.posOrder.posOrderId
      var list = this.payData.posOrder.posOrderList
      for (var i = 0, len = list.length; i < len; i++) {
        // eslint-disable-next-line eqeqeq
        if (list[i]['id'] == id) { return list[i]['balance'] }
      }
      return ''
    },
    finallyPayedMoney() { // 最终已经支付金额
      var total = this.payData.dingJinMoney * 1 +
        this.payData.huoDongDingJinMoney * 1 +
        this.payData.xiangJinMoney * 1 +
        (this.input_integral_amount > 0 ? this.input_integral_amount : 0) * 1
      if (this.payData.ziChanYeSelect > 0) {
        total += this.payData.ziChanYeMoney * 1
      }
      if (this.weiXinPayed) { total += this.weixinMoney * 1 }
      if (this.zhiFuBaoPayed) { total += this.zhiFuBaoMoney * 1 }

      var posOrderList = this.payData.posOrderList
      for (var i = 0, len = posOrderList.length; i < len; i++) {
        total += posOrderList[i]['posFinallyMoney'] * 1
      }

      return total
    },
    finallyUnpayedMoney() { // 最终未付款金额
      return this.finallyTotalMoney - this.finallyPayedMoney
    },
    finallyTotalMoney() {
      var total = 0
      if (this.goodsInfo.length > 0) {
        for (let i = 0; i < this.goodsInfo.length; i++) {
          total += parseInt(this.goodsInfo[i]['original_price']) * parseInt(this.goodsInfo[i]['quantity'])
        }
        return total
      }
      return 0
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    }
  },
  created() {
    // -
  },
  methods: {
    // eslint-disable-next-line vue/return-in-computed-property
    ini() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.firstOpenPaymentDialog = true
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dialogVisible = true
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.payData = { // 支付方式弹窗数据
        dingJinMoney: '',
        maxDingJinMoney: 0,
        huoDongDingJinMoney: '',
        maxHuoDongDingJinMoney: 0,
        weixinMoney: '',
        weiXinPayed: false,
        zhiFuBaoMoney: '',
        zhiFuBaoPayed: false,
        xiangJinMoney: '',
        ziChanYeList: [],
        ziChanYeSelect: '',
        ziChanYeMoney: '',
        posOrder: { // pos单弹窗数据
          posMachineList: [],
          posMachineId: '',
          posOrderList: [],
          posOrderBalance: 0,
          posOrderId: '',
          posFinallyMoney: ''
        },
        posOrderList: [ // pos单列表
        ],
        input_integral_amount: 0
      }
      this.integral = {
        isExchange: false,
        myIntegral: 0,
        totalIntegral: 0,
        integralExchangeRateSet: 0,
        inputIntegral: '',
        amount: 0
      }
    },
    setGoodInfo(goodsInfo) {
      this.goodsInfo = goodsInfo
    },
    onOpenPaymentDialog() {
      if (!this.firstOpenPaymentDialog) { return }
      this.firstOpenPaymentDialog = false
      paymentGcreate({ customer_id: this.customerId }).then(res => {
        var data = res.data
        this.payData.maxDingJinMoney = data.deposit
        this.payData.maxHuoDongDingJinMoney = data.deposit_act
        this.payData.ziChanYeList = data.deposit_ind
        this.payData.posOrder.posMachineList = data.pos
      })
      // 获取积分情况
      integralCheck({
        customer_id: this.customerId,
        goods_info: this.goodsInfo
      }).then(res => {
        this.integral = res.data
      })
    },
    // 用户输入积分支付检测
    saleCouponCheck(value) {
      var integral = (this.getMaxIntegral > this.integral.inputIntegral ? this.integral.inputIntegral : this.getMaxIntegral)
      var input_integral_amount = integral * this.integral.integralExchangeRateSet
      var _this = this
      saleCouponCheck({
        input_integral_amount: input_integral_amount,
        goods_info: this.goodsInfo
      }).then(res => {
        var count = 0
        if (res.data.coupon_lists.length > 0) {
          console.log(res.data.coupon_lists)
          for (let index = 0; index < res.data.coupon_lists.length; index++) {
            console.log(res.data.coupon_lists[index]['amount'])
            count += parseFloat(res.data.coupon_lists[index]['amount'])
          }
        }
        _this.input_integral_amount = count
        if (this.finallyUnpayedMoney < 0) {
          this.$message({
            message: '已付金额已超总金额,请处理其他金额,以积分抵扣为优先原则!',
            type: 'warning'
          })
        }
      })
    },
    // -
    openDialog() {
      this.dialogChildVisible = !this.dialogChildVisible
    },
    cancel() {
      this.distributVisible = false
    },
    handleChildCancel() {
      // -
      this.dialogChildVisible = false
    },
    handleCancel() {
      // -
      this.dialogVisible = false
      // this.$parent.paymentVisible = false
    },
    handlerSubmit() {
      // 提交处理
      // 判断各项是否有超出行为
      if ((this.payData.maxDingJinMoney - this.payData.dingJinMoney) < 0) {
        this.$message({
          message: '剩余定金不足',
          type: 'warning'
        })
        return false
      }
      if ((this.payData.maxHuoDongDingJinMoney - this.payData.huoDongDingJinMoney) < 0) {
        this.$message({
          message: '剩余活动定金不足',
          type: 'warning'
        })
        return false
      }
      if (this.finallyUnpayedMoney !== 0) {
        this.$message({
          message: '已付金额需要等于已付金额',
          type: 'warning'
        })
        return false
      }
      var pustData = []
      // 组织请求所需数据
      pustData = {
        deposit: this.payData.dingJinMoney ? this.payData.dingJinMoney : 0,
        deposit_act: this.payData.huoDongDingJinMoney ? this.payData.huoDongDingJinMoney : 0,
        cash: this.payData.xiangJinMoney ? this.payData.xiangJinMoney : 0,
        customer_id: this.customerId,
        total_amount: this.finallyPayedMoney - (this.input_integral_amount > 0 ? this.input_integral_amount : 0) * 1, // 如果有积分抵扣的话,总金额去掉积分金额
        pos: [],
        deposit_ind: []
      }
      // 是否有子产业
      if (this.payData.ziChanYeSelect > 0) {
        pustData['deposit_ind'] = {
          id: this.payData.ziChanYeSelect,
          amount: this.payData.ziChanYeMoney
        }
      }
      // 是否有pos
      if (this.payData.posOrderList.length > 0) {
        const posData = []
        for (let i = 0; i < this.payData.posOrderList.length; i++) {
          posData.push({
            id: this.payData.posOrderList[i]['posOrderId'],
            amount: this.payData.posOrderList[i]['posFinallyMoney']
          })
        }
        pustData['pos'] = posData
      }
      // 开启业绩分配
      // 提交给支付确认接口
      if (pustData.total_amount > 0) {
        paymentCheck(pustData).then(res => {
          if (res.code === 200) {
            // 提交给礼券创建接口
            var createCouponData = {
              pay_orders: res.data
            }
            createCouponData['customer_id'] = this.customerId
            createCouponData['goods_info'] = this.goodsInfo
            createCouponData['total_integral_amount'] = this.input_integral_amount
            saleCouponCreate(createCouponData).then(res => {
              if (res.code === 200) {
                // 开启业绩分配
                this.distributVisible = true
                this.handleCancel()
              } else {
                this.$message({
                  message: res.message,
                  type: 'warning'
                })
                return false
              }
            })
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
            return false
          }
        })
      } else {
        // 提交给礼券创建接口
        var createCouponData = []
        createCouponData['pay_orders'] = {}
        createCouponData['customer_id'] = this.customerId
        createCouponData['goods_info'] = this.goodsInfo
        createCouponData['total_integral_amount'] = this.input_integral_amount
        saleCouponCreate(createCouponData).then(res => {
          if (res.code === 200) {
            // 开启业绩分配
            this.distributVisible = true
            this.handleCancel()
            this.$message({
              message: '礼券支付成功',
              type: 'success'
            })
            return false
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
            return false
          }
        })
      }
    },
    // post机获取
    onChangePos(val) {
      paymentFindData({ action: 'pos', pos_type: val }).then(res => {
        this.payData.posOrder.posOrderList = res.data
      })
    },
    // post机记录删除
    onRemovePosOrder(index) {
      this.payData.posOrderList.splice(index, 1)
    },
    // 添加post记录
    onAddPosOrder() {
      var this_ = this
      this.payData.posOrderList.push({
        posMachineId: this_.payData.posOrder.posMachineId,
        posMachineName: this_.posMachineName,
        posOrderBalance: this_.posOrderBalance * 1,
        posOrderId: this_.posOrderId,
        posFinallyMoney: this_.payData.posOrder.posFinallyMoney * 1
      })

      this.payData.posOrder.posMachineId = ''
      this.payData.posOrder.posOrderList = []
      this.payData.posOrder.posOrderBalance = 0
      this.payData.posOrder.posOrderId = ''
      this.payData.posOrder.posFinallyMoney = ''

      this.handleChildCancel()
    }
  }
}
</script>
<style lang="scss" scoped>
.payment-dialog {
  .pay-input {
    width: 180px;
    margin-right: 10px;
  }
  .ispay-font {
    margin-left: 10px;
  }
  .h68 {
    height: 68px;
  }
  .row-background {
    padding: 16px 0 0 8px;
    margin: 10px 20px ;
    border-radius: 4px;
    background-color: #F5F7FA;
    overflow: hidden;
  }
  .iconfont-bar {
    text-align: right;
    line-height: 38px;
    .iconfont {
      font-size: 30px;
    }
  }
  .pos-table {
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    background-color: #fff;
    overflow: hidden;
    .pos-table-head {
      width: 100%;
      border-bottom: 1px solid #DCDFE6;
      .pos-tool-btn {
        width: 80px;
        margin: 10px 16px;
      }
    }
  }
  .pay-total-bar {
    height: 70px;
    margin: 10px 20px;
    border-left: 4px solid #6666FE;
    border-radius: 4px;
    background-color: #F5F7FA;
    text-align: center;
    line-height: 70px;
    font-weight: 700;
    font-size: 16px;
    .right-line {
      border-right: 4px solid #fff;
    }
  }
  .num {
    font-weight: 400;
    font-size: 18px;
  }
}
</style>
