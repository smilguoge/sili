<template>
  <div class="app-container">
    <div class="form verify_box">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="original_pwd">
          <el-input v-model="ruleForm.original_pwd" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="new_pwd">
          <el-input v-model="ruleForm.new_pwd" type="password" autocomplete="off" />
        </el-form-item>
        <div class="strong">
          <span>密码强度</span>
          <div>
            <ul>
              <li :class="poor?'active':''" />
              <li :class="good?'active':''" />
              <li :class="strong?'active':''" />
            </ul>
            <div v-if="show">为了提升您的密码安全性，建议使用英文字母加数字或符号的混合密码.</div>
          </div>
        </div>
        <el-form-item label="确认密码" prop="new_verify_pwd">
          <el-input v-model="ruleForm.new_verify_pwd" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="验证码" prop="verify_code">
          <div class="verify">
            <el-input v-model.number="ruleForm.verify_code" />
            <el-button type="danger">发送</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <div>
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="sure('ruleForm')">确认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import API from '@/api/ManageCustomer/customerManagementApi'
export default {
  name: 'ResetPassword',
  components: {},
  data() {
    var reg1 = /(^\d{6,}$)|(^[a-zA-Z]{6,}$)|(^[^a-zA-Z0-9]{6,}$)/ // 数字，字母或符号其中的一种
    var reg7 = /\d*\D*((\d+[a-zA-Z]+[^0-9a-zA-Z]+)|(\d+[^0-9a-zA-Z]+[a-zA-Z]+)|([a-zA-Z]+\d+[^0-9a-zA-Z]+)|([a-zA-Z]+[^0-9a-zA-Z]+\d+)|([^0-9a-zA-Z]+[a-zA-Z]+\d+)|([^0-9a-zA-Z]+\d+[a-zA-Z]+))\d*\D*/ // 数字字母字符任意组合
    var newPasw = (rule, value, callback) => {
      if (value == this.ruleForm.original_pwd) {
        callback(new Error('新密码不能为原密码!'))
      } else {
          if (value.indexOf(' ') == -1) {
          if (reg1.test(value)) {
            this.show = true
            this.poor = true
            this.good = false
            callback()
          } else if (!reg7.test(value)) {
            this.show = true
            this.poor = true
            this.good = true
            this.strong = false
            callback()
          } else {
            this.poor = true
            this.good = true
            this.strong = true
            this.show = false
            callback()
          }
        } else {
          callback('输入的密码不能含有空格，请重新输入')
        }
      }
     
    }
    var surePasw = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value == this.ruleForm.original_pwd) {
        callback(new Error('新密码不能为原密码!'))
      } else {
        callback()
      }
    }
    var sure_pwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.new_pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        action: 'reset',
        id: this.$store.state.isCustomerId,
        original_pwd: '',
        new_pwd: '',
        new_verify_pwd: '',
        verify_code: ''
      },
      rules: {
        original_pwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '密码由6-16位字符组成，可数字、字母、特殊符号',
            trigger: 'blur'
          }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '新密码由6-16位字符组成，可数字、字母、特殊符号',
            trigger: 'blur'
          },
          { validator: newPasw, trigger: 'blur' }
          // ,
          // { validator: sure_pwd, trigger: 'blur' }
        ],
        new_verify_pwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '新密码由6-16位字符组成，可数字、字母、特殊符号',
            trigger: 'blur'
          },
          { validator: surePasw, trigger: 'blur' }
        ],
        verify_code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      // 密码强度
      poor: false,
      good: false,
      strong: false,
      show: false
    }
  },
  created() {},
  methods: {
    
    sure(formName) {
      
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          API.reset(this.ruleForm).then(res => {
            console.log(res)
            if (res.code == 200) {
              this.$message('密码重置成功')
              this.$emit('hid')
            } else {
              this.$message('密码重置失败')
              this.$emit('hid')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.$emit('hid');
      
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  border-top: 1px solid #bbbbbb;
  form {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 20px;
    .el-form-item {
      width: 70%;
      div {
        display: flex;
        justify-content: flex-end;
      }
    }
    .strong {
      display: flex;
      width: 70%;
      span {
        width: 22%;
        text-align: right;
        margin-right: 3%;
        font-size: 14px;
        font-weight: 700;
        color: #606266;
      }
      ul {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        margin-bottom: 11px;
        li {
          width: 25%;
          height: 15px;
          border-radius: 5px;
          background: rgba(187, 187, 187, 0.16);
          margin-right: 8px;
          &.active {
            background: #70ea50;
          }
        }
      }
      & > div {
        width: calc(100% - 100px);
        div {
          color: #e51c23;
          line-height: 1.5rem;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

