<template>
  <div class="box">
    <el-dialog
      :title="dialogType == 'created' ? '新建页面' : '修改页面'"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="beforeClose"
    >
      <el-form ref="formData" :model="formData" :rules="rules" inline>
        <el-row class="row">
          <div class="row-item">
            <el-form-item label="星級等级" prop="dic_star" style="margin-right: 0;">
              <el-select v-model="formData.dic_star" placeholder="请选择星级" clearable style="width:230px">
                <el-option
                  v-for="item in dic_customer_star"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>

          <div class="row-item">
            <el-form-item label="积分状态" prop="status" style="margin-right: 20px;">
              <el-select v-model="formData.status" placeholder="请选择状态" clearable style="width:230px">
                <el-option
                  v-for="item in integralStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="dialogType == 'created' && item.value == 0 ? true : false"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-row>

        <el-row class="row">
          <div class="row-item">
            <el-form-item label="获得积分" prop="integral" style="margin-left:10px">
              <el-input
                v-model="formData.integral"
                style="width:230px"
                maxlength="8"
                show-word-limit
                placeholder="请输入积分"
              />
            </el-form-item>
          </div>

          <div class="row-item">
            <el-form-item label="生效时间" prop="date">
              <el-date-picker
                v-model="formData.date"
                style="width:250px"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
                @change="daterangeChange($event)"
              />
            </el-form-item>
          </div>
        </el-row>

        <el-row class="row">
          <div class="row-item">
            <el-form-item label="消费满次数">
              <el-checkbox v-model="formData.check1" />
            </el-form-item>

            <el-form-item prop="sale_count" :rules="validateField('sale_count')">
              <el-input
                v-model="formData.sale_count"
                width="100px"
                maxlength="5"
                show-word-limit
                placeholder="请输入次数"
                :disabled="formData.check1 ? false : true"
              />
            </el-form-item>
          </div>

          <div class="row-item">
            <el-form-item label="消费满金额">
              <el-checkbox v-model="formData.check2" />
            </el-form-item>

            <el-form-item prop="sale_money" :rules="validateField('sale_money')">
              <el-input
                v-model="formData.sale_money"
                width="100px"
                maxlength="10"
                show-word-limit
                placeholder="请输入金额"
                :disabled="formData.check2 ? false : true"
              />
            </el-form-item>
          </div>
        </el-row>

        <el-row class="row">
          <div class="row-item">
            <el-form-item label="消耗满次数">
              <el-checkbox v-model="formData.check3" />
            </el-form-item>

            <el-form-item prop="consume_count" :rules="validateField('consume_count')">
              <el-input
                v-model="formData.consume_count"
                width="100px"
                maxlength="5"
                show-word-limit
                placeholder="请输入次数"
                :disabled="formData.check3 ? false : true"
              />
            </el-form-item>
          </div>

          <div class="row-item">
            <el-form-item label="消耗满金额">
              <el-checkbox v-model="formData.check4" />
            </el-form-item>

            <el-form-item prop="consume_money" :rules="validateField('consume_money')">
              <el-input
                v-model="formData.consume_money"
                width="100px"
                maxlength="10"
                show-word-limit
                placeholder="请输入金额"
                :disabled="formData.check4 ? false : true"
              />
            </el-form-item>
          </div>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose('formData')">取消</el-button>
        <el-button type="primary" @click="submit('formData')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  createIntegralSpclset,
  updateIntegralSpclset
} from '@/api/BaseModule/SalesSet'

export default {
  name: 'SpecialDialog',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    dialogType: {
      type: String,
      required: true
    },
    dicCustomerStar: {
      type: Array,
      default() {
        return []
      }
    },
    integralStatus: {
      type: Array,
      default() {
        return []
      }
    },
    editBack: {
      type: Object
    },
    rowId: {
      type: [String, Number]
    }
  },
  data() {
    const validateNum = (rule, value, callback) => {
      const age = /^[0-9]*$/
      if (!age.test(value)) {
        callback(new Error('请输入数字类型'))
      } else if (value <= 0) {
        callback(new Error('必须大于0'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: this.value,
      formData: {
        dic_star: '',
        is_sale_count: '', // 是否开启消费满次数[0否 1是]
        sale_count: '', // 消费满次数
        is_sale_money: '', // 是否开启消费满金额[0否 1是]
        sale_money: '', // 消费满金额
        is_consume_count: '', // 是否开启消耗满次数[0否 1是]
        consume_count: '', // 消耗满次数
        is_consume_money: '', // 是否开启消耗满金额[0否 1是]
        consume_money: '', // 消耗满金额
        integral: '', // 固定积分
        effective_start_at: '', // 有效期开始时间
        effective_end_at: '', // 有效期结束时间
        status: '', // 状态[0失效 1正常 -1删除]
        check1: false,
        check2: false,
        check3: false,
        check4: false,
        date: []
      },
      defaultData: {
        dic_star: '',
        is_sale_count: '', // 是否开启消费满次数[0否 1是]
        sale_count: '', // 消费满次数
        is_sale_money: '', // 是否开启消费满金额[0否 1是]
        sale_money: '', // 消费满金额
        is_consume_count: '', // 是否开启消耗满次数[0否 1是]
        consume_count: '', // 消耗满次数
        is_consume_money: '', // 是否开启消耗满金额[0否 1是]
        consume_money: '', // 消耗满金额
        integral: '', // 固定积分
        effective_start_at: '', // 有效期开始时间
        effective_end_at: '', // 有效期结束时间
        status: 1, // 状态[0失效 1正常 -1删除]
        check1: false,
        check2: false,
        check3: false,
        check4: false,
        date: []
      },
      rules: {
        dic_star: [
          { required: true, message: '请选择星级', trigger: 'change' }
        ],
        integral: [
          { required: true, message: '请输入积分', trigger: 'blur' },
          { validator: validateNum, trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择活动生效时间', trigger: 'change' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        if (this.dialogType == 'redact') {
          console.log(this.editBack)
          this.formData.dic_star = this.editBack.dic_star
          this.formData.status = this.editBack.status
          this.formData.integral =
            this.editBack.integral === 0 ? '' : this.editBack.integral
          this.formData.sale_count =
            this.editBack.sale_count === 0 ? '' : this.editBack.sale_count
          this.formData.sale_money =
            this.editBack.sale_money === 0 ? '' : this.editBack.sale_money
          this.formData.consume_count =
            this.editBack.consume_count === 0
              ? ''
              : this.editBack.consume_count
          this.formData.consume_money =
            this.editBack.consume_money === 0
              ? ''
              : this.editBack.consume_money
          this.formData.check1 =
            this.editBack.is_sale_count !== 0
          this.formData.check2 =
            this.editBack.is_sale_money !== 0
          this.formData.check3 =
            this.editBack.is_consume_count !== 0
          this.formData.check4 =
            this.editBack.is_consume_money !== 0
          this.formData.effective_end_at =
            this.editBack.effective_end_at * 1000
          this.formData.effective_start_at =
            this.editBack.effective_start_at * 1000;
          (this.formData.date = []),
          this.formData.date.push(
            this.formData.effective_start_at,
            this.formData.effective_end_at
          )
        } else {
          this.formData = JSON.parse(JSON.stringify(this.defaultData))
        }
      }
    }
  },
  methods: {
    // 自定义验证
    validateField(val) {
      const isNum = (rule, value, callback) => {
        const age = /^[0-9]*$/
        if (!age.test(value)) {
          callback(new Error('请输入数字类型'))
        } else if (value <= 0) {
          callback(new Error('必须大于0'))
        } else {
          callback()
        }
      }
      if (this.formData.check1 && val === 'sale_count') {
        return [
          { required: true, message: '请输入次数', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ]
      }
      if (this.formData.check2 && val === 'sale_money') {
        return [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ]
      }
      if (this.formData.check3 && val === 'consume_count') {
        return [
          { required: true, message: '请输入次数', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ]
      }
      if (this.formData.check4 && val === 'consume_money') {
        return [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ]
      }
    },

    // 提交
    saveForm(type) {
      this.resetData()
      let data = {}
      data = JSON.parse(JSON.stringify(this.formData))
      if (type == 'created') {
        createIntegralSpclset(data).then(res => {
          this.$message.success('新增成功!')
        })
      } else {
        data.id = this.rowId
        updateIntegralSpclset(this.rowId, data).then(res => {
          this.$message.success('修改成功!')
        })
      }
      this.$emit('on-success', this.formData.status)
      this.$emit('on-close')
      this.resetForm('formData')
    },

    resetData() {
      this.formData.is_sale_count = this.formData.check1 ? 1 : 0
      this.formData.is_sale_money = this.formData.check2 ? 1 : 0
      this.formData.is_consume_count = this.formData.check3 ? 1 : 0
      this.formData.is_consume_money = this.formData.check4 ? 1 : 0

      this.formData.sale_count =
        this.formData.sale_count == '' ? 0 : this.formData.sale_count
      this.formData.sale_money =
        this.formData.sale_money == '' ? 0 : this.formData.sale_money
      this.formData.consume_count =
        this.formData.consume_count == '' ? 0 : this.formData.consume_count
      this.formData.consume_money =
        this.formData.consume_money == '' ? 0 : this.formData.consume_money
      this.formData.effective_start_at = Math.floor(
        this.formData.effective_start_at / 1000
      )
      this.formData.effective_end_at = Math.floor(
        this.formData.effective_end_at / 1000
      )

      if (!this.formData.check1) {
        this.formData.sale_count = 0
      } else {
        this.formData.sale_count = this.formData.sale_count
      }
      if (!this.formData.check2) {
        this.formData.sale_money = 0
      } else {
        this.formData.sale_money = this.formData.sale_money
      }
      if (!this.formData.check3) {
        this.formData.consume_count = 0
      } else {
        this.formData.consume_count = this.formData.consume_count
      }
      if (!this.formData.check4) {
        this.formData.consume_money = 0
      } else {
        this.formData.consume_money = this.formData.consume_money
      }
      delete this.formData.date
      delete this.formData.check1
      delete this.formData.check2
      delete this.formData.check3
      delete this.formData.check4
    },

    // 验证
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveForm(this.dialogType)
        } else {
          return false
        }
      })
    },

    // 关闭
    beforeClose() {
      this.resetForm('formData')
      this.$emit('on-close')
    },

    // 关闭
    handleClose(formName) {
      this.resetForm(formName)
      this.$emit('on-close')
    },

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formData = JSON.parse(JSON.stringify(this.defaultData))
    },

    // 日期
    daterangeChange(daterange) {
      if (daterange[0]) {
        this.formData.effective_start_at = daterange[0]
        this.formData.effective_end_at = daterange[1]
      } else {
        this.formData.effective_start_at = ''
        this.formData.effective_end_at = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
}
.row-item {
  display: inline;
}
</style>
<style lang="scss">
.box {
  .el-dialog__body {
    padding: 30px 0 !important;
  }
}
</style>
