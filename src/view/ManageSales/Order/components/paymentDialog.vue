<template>
  <!-- 支付 -->
  <el-dialog
    title="支付"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    top="30px"
    :fullscreen="false"
    class="payment-dialog"
    width="1100px"
    @open="onOpenPaymentDialog"
  >
    <el-form
      :model="payFormData"
    >
      <el-row class="row-background h68" style="margin-top:-20px">
        <el-col :span="1" class="iconfont-bar">
          <i class="iconfont icon-qian2" style="color:#F4EA2A" />
        </el-col>
        <el-col :span="12">
          <el-form-item label="订金:" label-width="70px">
            <el-input
              v-model="payFormData.dingJinMoney"
              class="pay-input"
              placeholder="请输入金额"
              type="number"
            />
            <span class="tit-font">剩余订金：</span>
            <span class="err-color">{{ toFixedNum(payFormData.maxDingJinMoney-payFormData.dingJinMoney,2) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="活动订金:">
            <el-input
              v-model="payFormData.huoDongDingJinMoney"
              class="pay-input"
              placeholder="请输入金额"
              type="number"
            />
            <span class="tit-font">剩余订金：</span>
            <span class="err-color">{{ toFixedNum(payFormData.maxHuoDongDingJinMoney-payFormData.huoDongDingJinMoney,2) }}</span>
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
              v-model="payFormData.weixinMoney"
              class="pay-input"
              placeholder="请输入金额"
              type="number"
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
            <span v-if="payFormData.weiXinPayed" class="suc-color ispay-font">{{ '已支付' }}</span>
            <span v-else class="err-color ispay-font">{{ '未支付' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="微信支付金额:">
            <span class="info-color ">{{ payFormData.weiXinPayed?payFormData.weixinMoney:'0.00' }}</span>
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
              v-model="payFormData.zhiFuBaoMoney"
              class="pay-input"
              placeholder="请输入金额"
              type="number"
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
            <span v-if="payFormData.zhiFuBaoPayed" class="suc-color ispay-font">{{ '已支付' }}</span>
            <span v-else class="err-color ispay-font">{{ '未支付' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="支付宝支付金额:">
            <span class="info-color ">{{ payFormData.zhiFuBaoPayed?payFormData.zhiFuBaoMoney:'0.00' }}</span>
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
              v-model="payFormData.xiangJinMoney"
              class="pay-input"
              placeholder="请输入金额"
              type="number"
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
            <el-select v-model="payFormData.ziChanYeSelect" class="pay-input" placeholder="请选择子产业" @change="onChangeZiChanYeSelect">
              <el-option v-for="(item,index) in payFormData.ziChanYeList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-input
              v-model="payFormData.ziChanYeMoney"
              style="width:320px"
              class="pay-input"
              placeholder="请输入金额"
              type="number"
            />
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
              <el-table :data="payFormData.posOrderList" height="200px" fit>
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
                    <span>{{ toFixedNum(row.posFinallyMoney,2) }}</span>
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
          <span class="main-color num">{{ toFixedNum(finallyTotalMoney,2) }}</span>
        </el-col>
        <el-col :span="6" :offset="1" class="pay-total-wrap">
          <span>已付金额:</span>
          <span class="info-color num">{{ toFixedNum(finallyPayedMoney,2) }}</span>
        </el-col>
        <el-col :span="6" class="pay-total-wrap">
          <span>未付金额:</span>
          <span class="err-color num">{{ toFixedNum(finallyUnpayedMoney,2) }}</span>
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
          @click="onSubmitPaymentDialog"
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
          <el-select v-model="payFormData.posOrder.posMachineId" class="w100" placeholder="请选择POS机" @change="onChangePos">
            <el-option v-for="(item,index) in payFormData.posOrder.posMachineList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="POS单详情">
          <el-select v-model="payFormData.posOrder.posOrderId" class="w100" placeholder="请选择信息">
            <el-option v-for="(item,index) in payFormData.posOrder.posOrderList" :key="index" :label="item.balance+'元，编码'+item.pos_order_id" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="实际交易额">
          <el-input
            v-model="payFormData.posOrder.posFinallyMoney"
            class="w100"
            placeholder="请输入金额"
            type="number"
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
      </div></el-dialog>
  </el-dialog>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { paymentGcreate, paymentFindData, paymentCheck } from '@/api/ManageSales/Payment'
import { toFixedNum } from '@/utils/math'
export default {
  name: '',
  directives: { elDragDialog },
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    finallyTotalMoney: { // 最终需要支付的金额
      type: Number,
      default() {
        return 0
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
      toFixedNum,
      firstOpenPaymentDialog: true, // 第一次打开窗口吗
      payFormData: { // 支付方式弹窗数据
        dingJinMoney: 0,
        maxDingJinMoney: 0,
        huoDongDingJinMoney: 0,
        maxHuoDongDingJinMoney: 0,
        weixinMoney: 0,
        weiXinPayed: false,
        zhiFuBaoMoney: 0,
        zhiFuBaoPayed: false,
        xiangJinMoney: 0,
        ziChanYeList: [],
        ziChanYeSelect: 0,
        ziChanYeSelectName: '',
        ziChanYeMoney: 0,
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
      payBackData: {}, // 支付成功返回的数据
      dialogVisible: false,
      dialogChildVisible: false,
      imgUrl: 'http://img4.imgtn.bdimg.com/it/u=302619714,1453174966&fm=26&gp=0.jpg'
    }
  },
  computed: {
    posMachineName() {
      var id = this.payFormData.posOrder.posMachineId
      var list = this.payFormData.posOrder.posMachineList
      for (var i = 0, len = list.length; i < len; i++) {
        // eslint-disable-next-line eqeqeq
        if (list[i]['id'] == id) { return list[i]['name'] }
      }
      return ''
    },
    posOrderId() {
      var id = this.payFormData.posOrder.posOrderId
      var list = this.payFormData.posOrder.posOrderList
      for (var i = 0, len = list.length; i < len; i++) {
        // eslint-disable-next-line eqeqeq
        if (list[i]['id'] == id) { return list[i]['pos_order_id'] }
      }
      return ''
    },
    posOrderBalance() {
      var id = this.payFormData.posOrder.posOrderId
      var list = this.payFormData.posOrder.posOrderList
      for (var i = 0, len = list.length; i < len; i++) {
        // eslint-disable-next-line eqeqeq
        if (list[i]['id'] == id) { return list[i]['balance'] }
      }
      return ''
    },
    finallyPayedMoney() { // 最终已经支付金额
      var total = this.payFormData.dingJinMoney * 1 +
        this.payFormData.huoDongDingJinMoney * 1 +
        this.payFormData.xiangJinMoney * 1 +
        this.payFormData.ziChanYeMoney * 1

      if (this.weiXinPayed) { total += this.weixinMoney * 1 }
      if (this.zhiFuBaoPayed) { total += this.zhiFuBaoMoney * 1 }

      var posOrderList = this.payFormData.posOrderList
      posOrderList = posOrderList || []
      for (var i = 0, len = posOrderList.length; i < len; i++) {
        total += posOrderList[i]['posFinallyMoney'] * 1
      }

      return total
    },
    finallyUnpayedMoney() { // 最终未付款金额
      return this.finallyTotalMoney - this.finallyPayedMoney
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    }
  },
  created() {

  },
  methods: {
    onOpenPaymentDialog() {
      paymentGcreate({ customer_id: this.customerId }).then(res => {
        var data = res.data
        this.payFormData.maxDingJinMoney = data.deposit
        this.payFormData.maxHuoDongDingJinMoney = data.deposit_act
        this.payFormData.ziChanYeList = data.deposit_ind
        this.payFormData.posOrder.posMachineList = data.pos
      })
    },
    onSubmitPaymentDialog() {
      if (!this.checkPaymentForm()) {
        return
      }

      var par = {
        'deposit': this.payFormData.dingJinMoney,
        'deposit_ind': {
          'id': this.payFormData.ziChanYeSelect,
          'amount': this.payFormData.ziChanYeMoney
        },
        'deposit_act': this.payFormData.huoDongDingJinMoney,
        'pos': (function(posOrderList) {
          {
            var list = []
            for (var i = 0, len = posOrderList.length; i < len; i++) {
              list.push({
                id: posOrderList[i]['posOrderId'],
                amount: posOrderList[i]['posFinallyMoney']
              })
            }
            return list
          }
        }(this.payFormData.posOrderList ? this.payFormData.posOrderList : [])),
        'cash': this.payFormData.xiangJinMoney,
        'wx': {
          'id': 0,
          'amount': 0
        },
        'ali': {
          'id': 0,
          'amount': 0
        },
        'customer_id': this.customerId,
        'total_amount': this.finallyTotalMoney
      }
      paymentCheck(par).then((res) => {
        this.$message({
          message: '支付成功',
          type: 'success'
        })
        successBack(res.data)
      })

      var this_ = this
      function successBack(payBackInfo) {
        var payFormData = {}
        for (var attr in this_.payFormData) { payFormData[attr] = this_.payFormData[attr] }

        this_.$emit('onSubmitPaymentDialog', payFormData, payBackInfo)
        this_.handleCancel()
      }
    },
    checkPaymentForm() {
      var checkList = [
        {
          'key': 'dingJinMoney',
          'note': '请填写定金',
          'type': 'number'
        },
        {
          'key': 'huoDongDingJinMoney',
          'note': '请填写活动定金',
          'type': 'number'
        },
        {
          'key': 'weixinMoney',
          'note': '请填写微信支付金额',
          'type': 'number'
        },
        {
          'key': 'zhiFuBaoMoney',
          'note': '请填写支付宝金额',
          'type': 'number'
        },
        {
          'key': 'xiangJinMoney',
          'note': '请填写现金',
          'type': 'number'
        },
        /* {
          'key': 'ziChanYeSelect',
          'note': '请选择子产业',
          'type': 'number'
        },*/
        {
          'key': 'ziChanYeMoney',
          'note': '请填写子产业金额',
          'type': 'number'
        }
      ]
      for (var i = 0, len = checkList.length; i < len; i++) {
        switch (checkList[i]['type']) {
          case 'number':
            if (!this.payFormData[checkList[i]['key']].toString().length) {
              this.$message({
                message: checkList[i]['note'],
                type: 'warning'
              })
              return false
            }
            break
          case 'array':
            if (!this.payFormData[checkList[i]['key']].length) {
              this.$message({
                message: checkList[i]['note'],
                type: 'warning'
              })
              return false
            }
            break
        }
      }

      if (this.payFormData.ziChanYeMoney && !this.payFormData.ziChanYeSelect) {
        this.$message({
          message: '请选择子产业',
          type: 'warning'
        })
        return false
      }

      return true
    },
    // -
    openDialog() {
      this.dialogChildVisible = !this.dialogChildVisible
    },
    handleCancel() {
      // -
      this.$parent.paymentVisible = false
    },
    handleChildCancel() {
      // -
      this.dialogChildVisible = false
    },
    onChangeZiChanYeSelect(val) {
      var name = ''
      var list = this.payFormData.ziChanYeList
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i]['id'] == val) {
          name = list[i]['name']
          break
        }
      }
      this.payFormData.ziChanYeSelectName = name
    },
    onChangePos(val) {
      paymentFindData({ action: 'pos', pos_type: val }).then(res => {
        this.payFormData.posOrder.posOrderList = res.data
      })
    },
    onRemovePosOrder(index) {
      this.payFormData.posOrderList.splice(index, 1)
    },
    onAddPosOrder() {
      var this_ = this
      this.payFormData.posOrderList = this.payFormData.posOrderList ? this.payFormData.posOrderList : []
      this.payFormData.posOrderList.push({
        posMachineId: this_.payFormData.posOrder.posMachineId,
        posMachineName: this_.posMachineName,
        posOrderBalance: this_.posOrderBalance * 1,
        posOrderId: this_.posOrderId,
        posFinallyMoney: this_.payFormData.posOrder.posFinallyMoney * 1
      })

      this.payFormData.posOrder.posMachineId = ''
      this.payFormData.posOrder.posOrderList = []
      this.payFormData.posOrder.posOrderBalance = 0
      this.payFormData.posOrder.posOrderId = ''
      this.payFormData.posOrder.posFinallyMoney = ''

      this.handleChildCancel()
    },
    updatePayFormData(payFormData) {
      if (payFormData && payFormData.toString() == '[object Object]' &&
        Object.getOwnPropertyNames(payFormData).length) {
        this.payFormData = payFormData
      } else {
        this.payFormData = { // 支付方式弹窗数据
          dingJinMoney: 0,
          maxDingJinMoney: 0,
          huoDongDingJinMoney: 0,
          maxHuoDongDingJinMoney: 0,
          weixinMoney: 0,
          weiXinPayed: false,
          zhiFuBaoMoney: 0,
          zhiFuBaoPayed: false,
          xiangJinMoney: 0,
          ziChanYeList: [],
          ziChanYeSelect: '',
          ziChanYeSelectName: '',
          ziChanYeMoney: 0,
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
        }
      }
    },
    updatePayBackData(payBackData) {
      if (payBackData && payBackData.toString() == '[object Object]' &&
        Object.getOwnPropertyNames(payBackData).length) {
        this.payBackData = payBackData
      } else {
        this.payBackData = {}
      }
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
