<template>
  <div>
    <el-dialog
      :title="dialogType == 'created' ? '新建页面' : '修改页面'"
      :visible.sync="dialogVisible"
      width="650px"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <el-form ref="formData" :model="formData" :rules="rules" inline>
        <el-row class="row">
          <el-form-item label="星級等级" prop="dic_star">
            <el-select v-model="formData.dic_star" placeholder="请选择星级" clearable>
              <el-option
                v-for="item in dicCustomerStar"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择类型" clearable>
              <el-option
                v-for="item in integralType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-row>

        <el-row class="row">
          <el-form-item label="分佣层级" prop="commission_level">
            <el-select v-model="formData.commission_level" placeholder="请选择分佣层级" clearable>
              <el-option
                v-for="item in commissionLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择状态" clearable>
              <el-option
                v-for="item in integralStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="dialogType == 'created' && item.value == 0 ? true : false"
              />
            </el-select>
          </el-form-item>
        </el-row>

        <el-row class="row">
          <div class="row-item">
            <el-form-item label="生日倍数">
              <el-checkbox v-model="formData.check1" />
            </el-form-item>

            <el-form-item
              prop="birthday_multiple"
              :rules="validateField('birthday_multiple')"
              style="width:160px;"
            >
              <el-input
                v-model="formData.birthday_multiple"
                width="100px"
                maxlength="5"
                show-word-limit
                placeholder="请输入生日倍数"
                :disabled="formData.check1 ? false : true"
              />
            </el-form-item>
          </div>

          <div class="row-item">
            <el-form-item label="星权日倍数">
              <el-checkbox v-model="formData.check2" />
            </el-form-item>

            <el-form-item
              prop="star_multiple"
              :rules="validateField('star_multiple')"
              style="margin-right:0;width:160px;"
            >
              <el-input
                v-model="formData.star_multiple"
                width="100px"
                maxlength="5"
                show-word-limit
                placeholder="请输入星权日倍数"
                :disabled="formData.check2 ? false : true"
              />
            </el-form-item>
          </div>
        </el-row>

        <el-row class="row">
          <el-form-item label="固定积分" prop="integral_fixed" :rules="validateField('integral_fixed')">
            <el-input
              v-model="formData.integral_fixed"
              placeholder="请输入固定积分"
              :disabled="formData.type == 1 || formData.type == 2 ? true : false"
            />
          </el-form-item>

          <el-form-item label="积分比例" prop="integral_rate" :rules="validateField('integral_rate')">
            <el-input
              v-model="formData.integral_rate"
              style="width:190px"
              placeholder="请输入积分比例"
              :disabled="formData.type == 3 || formData.type == 4 ? true : false"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-row>

        <el-row style="margin-left:20px;">
          <el-form-item label="活动生效时间" prop="date">
            <el-date-picker
              v-model="formData.date"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              @change="daterangeChange($event)"
            />
          </el-form-item>
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
import { createIntegral, updateIntegral } from '@/api/BaseModule/SalesSet'

export default {
  name: 'IntegralDialog',
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
    integralType: {
      type: Array,
      default() {
        return []
      }
    },
    commissionLevel: {
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
      type: Object,
      default() {
        return {}
      }
    },
    rowId: {
      type: [String, Number]
    }
  },
  data() {
    return {
      dialogVisible: this.value,
      formData: {
        dic_star: '',
        type: '',
        commission_level: '',
        is_birthday_multiple: '',
        birthday_multiple: '',
        is_star_multiple: '',
        star_multiple: '',
        integral_fixed: '',
        integral_rate: '',
        effective_start_at: '',
        effective_end_at: '',
        status: '',
        check1: false,
        check2: false,
        date: []
      },
      defaultData: {
        dic_star: '',
        type: '',
        commission_level: '',
        is_birthday_multiple: '',
        birthday_multiple: '',
        is_star_multiple: '',
        star_multiple: '',
        integral_fixed: '',
        integral_rate: '',
        effective_start_at: '',
        effective_end_at: '',
        status: 1,
        check1: false,
        check2: false,
        date: []
      },
      rules: {
        dic_star: [
          { required: true, message: '请选择星级', trigger: 'change' }
        ],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        commission_level: [
          { required: true, message: '请选择分佣层级', trigger: 'change' }
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
          this.formData.type = this.editBack.type
          this.formData.commission_level = this.editBack.commission_level
          this.formData.status = this.editBack.status
          this.formData.integral_fixed =
            this.editBack.integral_fixed === 0
              ? ''
              : this.editBack.integral_fixed
          this.formData.integral_rate =
            this.editBack.integral_rate === 0
              ? ''
              : this.editBack.integral_rate
          this.formData.star_multiple =
            this.editBack.star_multiple === 0
              ? ''
              : this.editBack.star_multiple
          this.formData.birthday_multiple =
            this.editBack.birthday_multiple === 0
              ? ''
              : this.editBack.birthday_multiple
          this.formData.check1 =
            this.editBack.is_birthday_multiple !== 0
          this.formData.check2 =
            this.editBack.is_star_multiple !== 0
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
      if (this.formData.check1 && val === 'birthday_multiple') {
        return [
          { required: true, message: '请输入生日倍数', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ]
      }
      if (this.formData.check2 && val === 'star_multiple') {
        return [
          { required: true, message: '请输入星权日倍数', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ]
      }
      if (
        (this.formData.type == 3 || this.formData.type == 4) &&
        val === 'integral_fixed'
      ) {
        return [
          { required: true, message: '请输入固定积分', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ]
      }
      if (
        (this.formData.type == 1 || this.formData.type == 2) &&
        val === 'integral_rate'
      ) {
        return [
          { required: true, message: '请输入积分比例', trigger: 'blur' },
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
        createIntegral(data).then(res => {
          this.$message.success('新增成功!')
        })
      } else {
        data.id = this.rowId
        updateIntegral(this.rowId, data).then(res => {
          this.$message.success('修改成功!')
        })
      }
      this.$emit('on-success', this.formData.status)
      this.$emit('on-close')
      this.resetForm('formData')
    },

    resetData() {
      this.formData.is_birthday_multiple = this.formData.check1 ? 1 : 0
      this.formData.is_star_multiple = this.formData.check2 ? 1 : 0
      this.formData.birthday_multiple =
        this.formData.birthday_multiple == ''
          ? 0
          : this.formData.birthday_multiple
      this.formData.star_multiple =
        this.formData.star_multiple == '' ? 0 : this.formData.star_multiple
      this.formData.effective_start_at = Math.floor(
        this.formData.effective_start_at / 1000
      )
      this.formData.effective_end_at = Math.floor(
        this.formData.effective_end_at / 1000
      )
      if (this.formData.type == 1 || this.formData.type == 2) {
        this.formData.integral_fixed = 0
      } else {
        this.formData.integral_fixed = this.formData.integral_fixed
      }
      if (this.formData.type == 3 || this.formData.type == 4) {
        this.formData.integral_rate = 0
      } else {
        this.formData.integral_rate = this.formData.integral_rate
      }
      delete this.formData.date
      delete this.formData.check1
      delete this.formData.check2
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
  display:inline
}
</style>
