<template>
  <!-- 促销管理 活动套餐表单管理 -->
  <div class="drawer-box">
    <div class="close" @click="close()">
      <i class="iconfont icon-shouqi1" />
    </div>
    <div class="form-wrap">
      <el-tabs
        v-model="formactive"
        @tab-click="handleClick"
      >
        <el-tab-pane label="基础信息" name="first">
          <!--  -->

          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="st-form" inline>
            <el-row>
              <el-col :span="8" class="h58">
                <el-form-item label="活动文件号" prop="filecode">
                  <el-input v-model="ruleForm.filecode" placeholder="请输入活动文件号" />
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="促销活动" prop="dic_promotion">
                  <el-select v-model="ruleForm.dic_promotion" class="el-input" placeholder="请选择">
                    <el-option v-for="(item, index) in arrPromotion" :key="index" :label="item.name" :value="item.code+''" />
                    <!-- <el-option v-for="(item, index) in arrPromotion" :key="index" :label="item.name" :value="item.code" /> -->
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="活动名称" prop="name">
                  <el-input v-model="ruleForm.name" placeholder="请输入活动名称" />
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="开始日期" prop="start_time">
                  <el-date-picker v-model="ruleForm.start_time" value-format="timestamp" type="date" placeholder="选择开始日期" @change="timeChange" />
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="结束日期" prop="end_time">
                  <el-date-picker v-model="ruleForm.end_time" value-format="timestamp" type="date" placeholder="选择结束日期" @change="timeChange" />
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="赠送积分" prop="send_integral">
                  <el-input v-model="ruleForm.send_integral" placeholder="请输入赠送积分" />
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="卡属性" prop="dic_card">
                  <el-select v-model="ruleForm.dic_card" class="el-input" placeholder="请选择卡属性">
                    <el-option v-for="(item, index) in arrCard" :key="index" :label="item.name" :value="item.code+''" />
                    <!-- <el-option v-for="(item, index) in arrCard" :key="index" :label="item.name" :value="item.code" /> -->
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="有效期" prop="effective_day">
                  <el-input v-model="ruleForm.effective_day" disabled />
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="是否延期">
                  <el-switch v-model="ruleForm.is_delay" active-value="1" inactive-value="0" />
                </el-form-item>

                <el-form-item label="" prop="delay_day">
                  <el-input v-model="ruleForm.delay_day" placeholder="延期天数" :disabled="!(ruleForm.is_delay*1)" class="m-chk-input" />
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="适用折上折" prop="is_more_discount">
                  <el-radio-group v-model="ruleForm.is_more_discount" class="m-group">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="折上折方式" :prop="(ruleForm.is_more_discount*1)?'dic_more_discount':''">
                  <el-select v-model="ruleForm.dic_more_discount" :disabled="(ruleForm.is_more_discount*1)?false:true" class="el-input" placeholder="请选择">
                    <!-- <el-option v-for="(item, index) in arrDiscount" :key="index" :label="item.name" :value="item.code+''" /> -->
                    <el-option v-for="(item, index) in arrDiscount" :key="index" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="是否常用" prop="is_commonly">
                  <el-radio-group v-model="ruleForm.is_commonly" class="m-group">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <!-- FIXME: 门店数组待处理 -->
              <el-col :span="16" class="h58">
                <el-form-item label="适用区 / 店" prop="chose_shop">
                  <el-radio-group v-model="ruleForm.chose_shop">
                    <el-radio label="0">全部</el-radio>
                    <el-radio label="1">指定</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="" prop="storeout">
                  <el-input v-model="ruleForm.storeRange" class="s-input" :disabled="!(ruleForm.chose_shop*1)" />
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="是否单次活动">
                  <el-radio-group v-model="ruleForm.is_single_activity" class="m-group">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="是否限用券" prop="is_coupon">
                  <el-switch v-model="ruleForm.is_coupon" active-value="1" inactive-value="0" />
                </el-form-item>
                <el-form-item label="" prop="coupon_num">
                  <el-input
                    v-model="ruleForm.coupon_num"
                    :disabled="!(ruleForm.is_coupon*1)"
                    style="{widht: '100px'}"
                    placeholder="张数"
                    class="m-chk-input"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="是否积分兑换" prop="is_integral_exchange">
                  <el-switch v-model="ruleForm.is_integral_exchange" active-value="1" inactive-value="0" />
                </el-form-item>
                <el-form-item label="" prop="integral_exchange">
                  <el-input
                    v-model="ruleForm.integral_exchange"
                    :disabled="!(ruleForm.is_integral_exchange*1)"
                    style="{widht: '100px'}"
                    placeholder="所需积分"
                    class="m-chk-input"
                  />
                </el-form-item>
              </el-col>

              <!-- FIXME: 新增字段待修改字段名 -->
              <el-col :span="8" class="h58">
                <el-form-item label="是否限制兑换" prop="is_integral_exchange">
                  <el-switch v-model="ruleForm.is_integral_exchange" active-value="1" inactive-value="0" />
                </el-form-item>
                <el-form-item label="" prop="integral_exchange">
                  <el-input
                    v-model="ruleForm.integral_exchange"
                    :disabled="!(ruleForm.is_integral_exchange*1)"
                    style="{widht: '100px'}"
                    placeholder="限制次数"
                    class="m-chk-input"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="显示终端">
                  <el-checkbox v-model="ruleForm.is_show_pc" true-label="1" false-label="0">PC</el-checkbox>
                  <el-checkbox v-model="ruleForm.is_show_wechat" true-label="1" false-label="0">微信</el-checkbox>
                </el-form-item>
              </el-col>

              <el-col :span="8" class="h58">
                <el-form-item label="是否体验价">
                  <el-checkbox v-model="ruleForm.is_experience_price" true-label="1" false-label="0" />
                </el-form-item>
              </el-col>

              <el-col :span="22">
                <el-form-item label="活动介绍" prop="introduction">
                  <el-input v-model="ruleForm.introduction" type="textarea" class="m-textarea w100" rows="4" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="center">
              <el-button @click="close">取  消</el-button>
              <!-- <el-button @click="resetForm('ruleForm')">重 置</el-button> -->
              <el-button type="primary" @click="submitForm('ruleForm')">立即保存</el-button>
            </el-row>
            <div class="item-block m-btns" />
          </el-form>
        </el-tab-pane>

        <el-tab-pane
          :disabled="false"
          label="套餐明细"
          name="second"
        >
          <SetmealDetail ref="setmealDetail" @close="close" />
        </el-tab-pane>
        <el-tab-pane
          :disabled="false"
          label="购买条件设置"
          name="third"
        >
          <Condition />
        </el-tab-pane>
        <el-tab-pane
          :disabled="false"
          label="图片设置"
          name="fourth"
        >
          <PictureSet />
        </el-tab-pane>
        <el-tab-pane
          :disabled="false"
          label="特殊设置"
          name="five"
        >
          <SpecialSet />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import PictureSet from './picture-set'
import Condition from './condition'
import SpecialSet from './special-set'
import SetmealDetail from './setmeal-detail'

export default {
  // - 组织结构组件
  name: 'DrawerBox',
  components: {
    PictureSet,
    Condition,
    SpecialSet,
    SetmealDetail
  },
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default() {
        return ''
      }
    },
    optionPromotion: {
      type: Array,
      required: true
    },
    optionDiscount: {
      type: Array,
      required: true
    },
    optionCard: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      card_package_id: 10043,
      formactive: 'first',
      arrPromotion: [], // 活动选项
      arrDiscount: [], // 折扣方式选项
      arrCard: [], // 卡类型选项
      ruleForm: {
        filecode: '', // 活动文件名
        is_show_pc: '0', // 显示终端 PC
        is_show_wechat: '0', // 显示终端 Wechat
        dic_promotion: '', // 促销活动
        name: '', // 活动名称
        start_at: '', // 开始日期
        end_at: '', // 结束日期
        send_integral: '', // 赠送积分
        dic_card: '', // 卡属性
        effective_day: '365', // 有效期
        is_delay: '0', // 是否延期
        delay_day: '0', // 延期天数
        is_more_discount: '0', // 是否折上折
        dic_more_discount: '0', // 折上折方式

        chose_shop: '0', // 适用区域门店
        storeRange: '', // 指定门店区域

        is_commonly: '0', // 是否常用
        is_single_activity: '0', // 是否单次活动

        is_coupon: '0', // 是否限用券
        coupon_num: '0', // 限用张数

        is_integral_exchange: '0', // 是否积分兑换
        integral_exchange: '0', // 所需积分

        is_experience_price: '0', // 是否体验价
        introduction: '' // 活动介绍
      },
      defaultForm: {
        filecode: '',
        is_show_pc: '0',
        is_show_wechat: '0',
        dic_promotion: '',
        name: '',
        start_at: '',
        end_at: '',
        send_integral: '',
        dic_card: '',
        effective_day: '365',
        is_delay: '0',
        delay_day: '0',
        is_more_discount: '0',
        dic_more_discount: '0',

        chose_shop: '0',
        storeRange: '',

        is_commonly: '0',
        is_single_activity: '0',
        is_coupon: '0',
        coupon_num: '0',
        is_experience_price: '0',
        is_integral_exchange: '0',
        integral_exchange: '0',
        introduction: ''
      },
      rules: {
        filecode: [
          { required: true, message: '请输入活动文件号', trigger: 'blur' },
          { min: 1, max: 15, message: '最多输入 15 个字符', trigger: 'blur' }
        ],
        dic_promotion: [
          { required: true, message: '请选择促销活动', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 15, message: '最多输入 15 个字符', trigger: 'blur' }
        ],
        send_integral: [
          { pattern: /^[\d]+$/, message: '积分只能是数字', trigger: 'blur' }
        ],
        delay_day: [
          { pattern: /^[\d]+$/, message: '天数只能是数字', trigger: 'blur' }
        ],
        coupon_num: [
          { pattern: /^[\d]+$/, message: '张数只能是数字', trigger: 'blur' }
        ],
        integral_exchange: [
          { pattern: /^[\d]+$/, message: '积分只能是数字', trigger: 'blur' }
        ],
        start_time: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        end_time: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        chose_shop: [
          { required: true, message: '请选择适用门店', trigger: 'change' }
        ],
        dic_card: [
          { required: true, message: '请选择卡属性', trigger: 'change' }
        ],
        is_more_discount: [
          { required: true, message: '请选择是否折上折', trigger: 'change' }
        ],
        is_commonly: [
          { required: true, message: '请选择是否常用', trigger: 'change' }
        ],
        is_coupon: [
          { required: true, message: '请选择是否限用券', trigger: 'change' }
        ],
        dic_more_discount: [
          { required: true, message: '请选择折扣方式', trigger: 'change' }
        ]
      },
      drawerType: '',
      flagTime: 0
    }
  },
  watch: {
    'ruleForm.is_coupon': function(val) {
      if (!(val * 1)) {
        this.ruleForm.coupon_num = 0
      }
    },
    'ruleForm.is_integral_exchange': function(val) {
      if (!(val * 1)) {
        this.ruleForm.integral_exchange = 0
      }
    },
    'ruleForm.is_delay': function(val) {
      this.ruleForm.delay_day = (val * 1) ? 365 : 0
    },
    'ruleForm.is_more_discount': function(val) {
      this.ruleForm.dic_more_discount = (val * 1) ? '' : 0
    },
    value: function(val) {
      console.log('child', val)
      this.ruleForm = val
    },
    optionPromotion: function(val) {
      this.arrPromotion = val
    },
    optionDiscount: function(val) {
      this.arrDiscount = val
    },
    optionCard: function(val) {
      this.arrCard = val
    },
    type: function(val) {
      this.drawerType = val
    }
  },
  methods: {
    // 编辑获取id
    setId(card_package_id) {
      this.card_package_id = card_package_id
      this.$refs.setmealDetail.init(card_package_id)
    },
    // 新增获取id
    cardPackage(card_package_id) {
      this.card_package_id = card_package_id
      this.$refs.setmealDetail.init(card_package_id)
      this.formactive = 'second'
    },
    close() {
      this.formactive = 'first'
      this.$emit('close')
      this.resetForm('ruleForm')
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const curr = new Date()
          if (curr - this.flagTime > 1000) {
            this.ruleForm.start_at = Math.floor(this.ruleForm.start_time / 1000)
            this.ruleForm.end_at = Math.floor(this.ruleForm.end_time / 1000)
            if (this.drawerType === 'create') {
              delete this.ruleForm.start_time
              delete this.ruleForm.end_time
              const data = {
                type: 'base',
                data: this.ruleForm
              }
              this.$emit('create', data)
            } else {
              delete this.ruleForm.arrPromotion
              delete this.ruleForm.arrDiscount
              delete this.ruleForm.arrCard
              // delete this.ruleForm.start_time
              // delete this.ruleForm.end_time
              const data = {
                type: 'base',
                params: this.ruleForm
              }
              this.$emit('update', data)
            }
            this.flagTime = curr
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm = JSON.parse(JSON.stringify(this.defaultForm))
    },
    timeChange(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss">
.drawer-box {
  .el-tabs__header{
    margin: 0;
  }
}

  input[type=number] {
    -moz-appearance: textfield;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
<style lang="scss" scoped>
.drawer-box {
  position: relative;

  .form-wrap {
   padding: 10px 10px 0 26px;
  }

  .st-form {
    // padding: 25px 15px 10px 15px;
    padding: 25px 0 10px;

    .item-block {
      display: block;
    }

    .el-input {
      width: 200px;
    }

    .m-group {
      width: 200px;
    }

    .m-chk-input {
      width: 144px;
    }

    .el-textarea {
      width: 600px;
    }

    .h58 {
      height: 58px;
      overflow: hidden;
    }

    .s-input {
      width: 380px;
    }
  }

  .close {
    position: fixed;
    top: 0;
    z-index: 9999;
    width: 20px;
    float: left;
    background-color: #f1f1f1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    cursor: pointer;
  }
}
</style>
