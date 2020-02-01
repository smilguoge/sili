<template>
  <!-- 支付信息 -->
  <div class="sales-pay-form">
    <div class="m-form-ly">
      <el-form :model="payData">
        <el-col :span="7" :offset="1">
          <el-form-item label="订金 :">
            <span class="info-color">{{ toFixedNum(payData.dingJinMoney,2) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="活动订金 :">
            <span class="info-color">{{ toFixedNum(payData.huoDongDingJinMoney,2) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item :label="'应收'+(payData.ziChanYeSelectName?('-'+payData.ziChanYeSelectName):'')+' :'">
            <span class="info-color">{{ toFixedNum(payData.ziChanYeMoney,2) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="微信支付 :">
            <span class="info-color">{{ payData.weiXinPayed?toFixedNum(payData.weixinMoney,2):'0.00' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="支付宝支付 :">
            <span class="info-color">{{ payData.zhiFuBaoPayed?toFixedNum(payData.zhiFuBaoMoney,2):'0.00' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="POS :">
            <span class="info-color">{{ toFixedNum(_posTotalMoney,2) }}</span>
          </el-form-item>
        </el-col>
        <!--<el-col :span="7" :offset="1">
          <el-form-item label="赠送积分 :">
            <span class="info-color">{{ zengSongJiFen }}</span>
          </el-form-item>
        </el-col>-->
        <el-col :span="7" :offset="1">
          <el-form-item label="现金支付 :">
            <span class="info-color">{{ toFixedNum(payData.xiangJinMoney,2) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="实付金额 :">
            <span class="info-color">{{ toFixedNum(moneyData.shiFuJinE,2) }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="22" :offset="1">
          <div class="deduction-total-bar">
            <el-col
              :span="11"
              :offset="1"
            >
              <span class="tit-font">实收金额：</span>
              <span class="num info-color">{{ toFixedNum(moneyData.shiShouJinE,2) }}</span>
            </el-col>
            <el-col :span="11">
              <span class="tit-font">合计：</span>
              <span class="num main-color">{{ toFixedNum(moneyData.heJi,2) }}</span>
            </el-col>
          </div>
        </el-col>
      </el-form>
      <div style="clear:both" />
    </div>
    <div class="m-menubar-ly">
      <el-button
        class="menu-btn"
        type="primary"
        @click="openDialog('payment')"
      >支付方式</el-button>
      <!--<el-button
        class="menu-btn"
        type="primary"
        @click="check(2)"
      >结 账</el-button>-->
      <el-button
        class="menu-btn"
        type="primary"
        @click="onCheckout"
      >结 账</el-button>
      <el-button
        class="menu-btn"
        type="primary"
        plain
        @click="onSaleDraftBut"
      >暂 存</el-button>
      <el-button
        class="menu-btn"
        type="primary"
        plain
        @click="onCancelSaleDraftBut"
      >取 消</el-button>
    </div>
  </div>
</template>

<script>
import { toFixedNum } from '@/utils/math'
import { saleDraftCreate, saleDraftUpdate, saleDraftUnlock, saleDraftCancel, salePay } from '@/api/ManageSales/Order'

export default {
  name: 'InlineEditTable',
  components: {},
  props: {
    payData: {
      type: Object,
      default() {
        return {}
      }
    },
    moneyData: {
      type: Object,
      default() {
        return {}
      }
    },
    saleDraftData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      toFixedNum
    }
  },
  computed: {
    _posTotalMoney: function() {
      var list = this.payData.posOrderList
      if (!list) {
        return 0
      }

      var total = 0
      for (var i = 0, len = list.length; i < len; i++) {
        total += list[i]['posFinallyMoney']
      }
      return this.payData.posTotalMoney = total
    },
    zengSongJiFen: function() {
      return 100
    }
  },
  created() {
  },
  methods: {
    // 判断套餐类型
    check(val) {
      switch (val) {
        case 1:
          this.openDialog('satisfOrder')
          break
        case 2:
          this.openDialog('selectOrder')
          break
        case 3:
          this.openDialog('discountOrder')
          break
        default:
          console.log('参数错误')
      }
    },
    openDialog(type) {
      this.$emit('open', type)
    },
    onSaleDraftBut() {
      if (!this.saleDraftData.customer_id) {
        this.$message({
          message: '无销售暂存单数据操作',
          type: 'warning'
        })
        return
      }

      if (!this.$parent.saleDraftDataId) { this.onSaleDraftCreate() } else { this.onSaleDraftUpdate() }
    },
    onCancelSaleDraftBut() {
      if (!this.$parent.saleDraftDataId) {
        this.$message({
          message: '无销售暂存单数据操作',
          type: 'warning'
        })
        return
      }

      this.$confirm('确认取消暂存的数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.onSaleDraftCancel()
      })
    },
    // 销售暂存单-创建
    onSaleDraftCreate() {
      saleDraftCreate(this.saleDraftData).then(res => {
        this.$parent.saleDraftDataId = res.data.sale_draft_id

        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    },
    // 销售暂存单-更新
    onSaleDraftUpdate() {
      saleDraftUpdate(this.saleDraftData, this.saleDraftData.sale_draft_id).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    },
    // 销售暂存单-解锁
    onSaleDraftUnlock() {
      saleDraftUnlock({}).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    },
    // 销售暂存单-取消
    onSaleDraftCancel() {
      saleDraftCancel({ id: this.saleDraftData.sale_draft_id }).then(res => {
        this.$parent.saleDraftDataId = 0

        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    },
    // 结账
    onCheckout() {
      if (!this.saleDraftData.customer_id) {
        this.$message({
          message: '请选择用户',
          type: 'warning'
        })
        return
      }

      salePay(this.getSaleDraftData()).then(res => {
        if (this.$parent.saleDraftDataId) {
          this.onSaleDraftCancel()
        }

        this.$confirm(res.message).then(_ => {
          this.$router.go(0)
        }).catch(_ => {
          this.$router.go(0)
        })
      })
    },
    getSaleDraftData() {
      var origin = this.saleDraftData ? this.saleDraftData : {}
      var data = {
        'sale_draft_id': origin.sale_draft_id, // 销售暂存单ID
        'is_approve': origin.is_approve, // 是否需要审批[0:否,1:是]
        'ctype': origin.ctype, // 顾客类型[0:顾客,1:员工]
        'customer_id': origin.customer_id, // 顾客ID
        'total': origin.total, // 销售订单合计
        'receive': origin.receive, // 销售订单实收金额
        'pay': origin.pay, // 销售订单实付金额
        'earnest_money': origin.earnest_money, // 销售订单订金支付金额
        'activity_earnest': origin.activity_earnest, // 销售订单活动订金支付金额
        'cash': origin.cash, // 销售订单现金支付金额
        'wechat': origin.wechat, // 销售订单微信支付金额
        'alipay': origin.alipay, // 销售订单支付宝支付金额
        'dic_pos': origin.dic_pos, // 销售订单POS类型[1:嘉联]
        'pos': origin.pos, // 销售订单POS支付金额
        'dic_son_industry': origin.dic_son_industry || 0, // 销售订单子产业类型[1:暄妍]
        'industry': origin.industry, // 销售订单子产业支付金额
        'send_integral': origin.send_integral, // 销售订单赠送积分，员工购买场景不存在赠送积分为0
        'goods_info': getGoodsInfo(), // 销售订单列表信息
        'deduction_info': [ // 销售订单套餐抵扣明细，数据来源详见http://api.meiyetongsoft.com/index.php?s=/54&page_id=1673
        ],
        'coupon_info': [ // 销售订单券抵扣信息，数据来源详见http://api.meiyetongsoft.com/index.php?s=/54&page_id=1673
        ],
        'exchange_info': [ // 销售订单老卡兑换信息，数据来源详见http://api.meiyetongsoft.com/index.php?s=/54&page_id=1673
        ],
        'consume_info': { // 销售订单消耗信息，数据来源详见http://api.meiyetongsoft.com/index.php?s=/54&page_id=1673
        },
        'performance_info': getPerformanceInfo(), // 销售订单业绩分摊信息
        'pay_info': origin.paymentDialogPayBackData // 销售订单支付信息，数据来源详见http://api.meiyetongsoft.com/index.php?s=/54&page_id=1740
      }

      function getGoodsInfo() {
        function getGoods(list) {
          var items = []
          for (var i = 0, len = list.length; i < len; i++) {
            items.push({
              'goods_id': list[i].goods_id, // 套餐或产品包含品项
              'goods_name': list[i].goods_name, // 品项名称
              'goods_code': list[i].goods_code, // 品项编号
              'valid_day': list[i].valid_day, // 有效期，产品购买场景为0
              'price': list[i].price, // 品项单价
              'expend_price': list[i].expend_price, // 品项调整金额
              'quantity': list[i].quantity, // 品项购买数量
              'subtotal': list[i].subtotal, // 品项小计
              'actual_subtotal': list[i].actual_subtotal, // 品项实收小计
              'owe_quantity': list[i].owe_quantity, // 品项欠货数量，品项类别为项目时为0
              'gtype': list[i].gtype, // 品项类别[1:产品;5:项目]
              'is_package_send': list[i].is_package_send, // 是否购买套餐内附送[0:否;1:是]
              'effect_performance': list[i].effect_performance // 品项有效业绩
            })
          }
          return items
        }

        var originGoodsInfo = origin.goods_info ? origin.goods_info : []
        var goodsInfo = []
        for (var i = 0, len = originGoodsInfo.length; i < len; i++) {
          var goods = {
            'package_id': originGoodsInfo[i].package_id, // 套餐ID，产品购买场景为0
            'name': originGoodsInfo[i].name, // 套餐或产品名称
            'price': originGoodsInfo[i].price, // 套餐或产品单价
            'quantity': originGoodsInfo[i].quantity, // 套餐或产品购买数量
            'discount_type': originGoodsInfo[i].discount_type, // 优惠方式
            'discount': originGoodsInfo[i].discount, // 折扣
            'coupon': originGoodsInfo[i].coupon, // 抵扣金额
            'exchange': originGoodsInfo[i].exchange, // 兑换金额
            'integral': originGoodsInfo[i].integral, // 积分兑换金额
            'receive': originGoodsInfo[i].receive, // 实收金额
            'pay': originGoodsInfo[i].pay, // 实付金额
            'dic_card': originGoodsInfo[i].dic_card, // 套餐卡属性（新客卡、正常卡等）
            'card_package_type': originGoodsInfo[i].card_package_type, // 套餐活动类型[1:几选几;2:满额;3:期限卡;4:折扣设置;5:充值活动]，产品购买场景为0
            'is_staff_price': originGoodsInfo[i].is_staff_price, // 是否以员工价购买[0:否;1:是]，套餐购买场景套餐购买对象属性仅为员工时及产品购买场景产品销售价格等于员工价格时是以员工价购买
            'include_super_level': originGoodsInfo[i].include_super_level, // 是否包含超高项目，产品购买场景为0
            'effect_performance': originGoodsInfo[i].effect_performance, // 套餐有效业绩
            'goods': getGoods(originGoodsInfo[i]['list'] ? originGoodsInfo[i]['list'] : [])
          }

          goodsInfo.push(goods)
        }
        return goodsInfo
      }

      function getPerformanceInfo() {
        var originPerformanceInfo = origin.performance_info ? origin.performance_info : []
        var performanceInfo = []
        for (var i = 0, len = originPerformanceInfo.length; i < len; i++) {
          performanceInfo.push({
            'dic_performance': originPerformanceInfo[i]['id'], // 分摊职位ID
            'staff_id': originPerformanceInfo[i]['customer_id'], // 员工ID
            'position_id': originPerformanceInfo[i]['position'], // 职位ID
            'amount': originPerformanceInfo[i]['achievement'] // 分摊金额
          })
        }

        return performanceInfo
      }

      return data
    }
  }
}
</script>

<style lang="scss" scoped>
.sales-pay-form {
  padding-top: 18px;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .deduction-total-bar {
    height: 50px;
    // margin: -10px 50px 0;
    border-left: 4px solid #6666fe;
    border-radius: 4px;
    background-color: #f5f7fa;
    line-height: 50px;
    font-size: 14px;
    .num {
      font-size: 20px;
    }
  }
  .m-menubar-ly {
    width: 100%;
    height: 60px;
    margin-left: -26px;
    text-align: center;
  }
  .menu-btn {
    margin: 0 14px;
  }
}
</style>
