<template>
  <div>
    <el-dialog
      title="款项交接"
      :visible.sync="SnycsMoney"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      append-to-body
      class="Money-center"
    >
      <div class="Money-body">
        <el-form
          ref="changeData"
          :model="changeData"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
        >
          <div class="Money-yin">
            <div class="Money-form">
              <div class="Money-from-div">
                <div class="Money-bgc clearfix">
                  <el-col :span="24" class="Money-item">
                    <span class="tit-font">交接日期：</span>
                    <span class="info-color">{{ mainData.time | parseTime('{y} / {m} / {d}') }}</span>
                  </el-col>
                  <el-col :span="8" class="Money-item">
                    <span class="tit-font">今日业绩：</span>
                    <span class="main-color">{{ mainData.achievement }}</span>
                  </el-col>
                  <el-col :span="8" class="Money-item">
                    <span class="tit-font">订金实收：</span>
                    <span class="info-color">{{ mainData.deposit }}</span>
                  </el-col>
                  <el-col :span="8" class="Money-item">
                    <span class="tit-font">POS金额：</span>
                    <span class="info-color">{{ mainData.pos }}</span>
                  </el-col>
                  <el-col :span="8" class="Money-item">
                    <span class="tit-font">已交接金额：</span>
                    <span class="suc-color">{{ mainData.transfer }}</span>
                  </el-col>
                  <el-col :span="8" class="Money-item">
                    <span class="tit-font">未结POS单：</span>
                    <span class="err-color">{{ mainData.unfinished_pos }}</span>
                  </el-col>
                  <el-col :span="8" class="Money-item">
                    <span class="tit-font">销售暂存单：</span>
                    <span class="err-color">{{ mainData.order_draft }}</span>
                  </el-col>
                </div>
              </div>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="交接金额:" prop="un_transfer">
                    <el-input v-model="changeData.un_transfer" placeholder="请输入金额" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="接款人员:" prop="to_staff_id">
                    <el-select v-model="changeData.to_staff_id" filterable placeholder="请选择接款人">
                      <el-option
                        v-for="item in staffList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="密码:" prop="pwd">
                    <el-input v-model="changeData.pwd" type="password" placeholder="请输入密码" autocomplete="off" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="备注事项:">
                <el-input
                  v-model="changeData.remark"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入备注内容"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('changeData')">确认交接</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { MoneydataGet, MoneylistGet, MoneydataPost } from '@/api/home.js'
export default {
  name: 'Money',
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    SnycsMoney: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      ruleForm: {},
      rules: {
        un_transfer: [
          { required: true, message: '请输入交接金额', trigger: 'blur' },
          { pattern: /^[\d]+$/, message: '金额只能是数字', trigger: 'blur' }
        ],
        to_staff_id: [
          { required: true, message: '请选择接款人', trigger: 'change' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9\W_]{6,30}$/, message: '密码由6~30位数字、字母组成' }
        ]
      },
      staffList: [],
      mainData: {},
      changeData: {
        to_staff_id: '', // 被交接人ID
        un_transfer: '', // 交接金额
        pwd: '', // 密码
        transfer_date: '', // 交接日
        remark: '' // 备注
      }
    }
  },
  watch: {
    SnycsMoney() {
      this.getData()
      this.getStaff()
    }
  },
  created() {
    // this.getData()
    // this.getStaff()
  },
  methods: {
    getData() {
      MoneydataGet().then(res => {
        // console.log(res.data)
        const items = res.data
        this.mainData = items
        this.changeData.transfer_date = items.time
      })
    },
    getStaff() {
      // FIXME: 门店id需要进行全局存储
      const data = {
        shop_id: 0
      }
      MoneylistGet(data).then(res => {
        this.staffList = res.data
      })
    },
    handleClose(done) {
      // FIXME: 临时移除关闭二次确认
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      // this.MoneyClose()
      this.resetForm('changeData')
      // })
      // .catch(_ => {})
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('是否确定交接？').then(_ => {
            MoneydataPost(this.changeData).then(res => {
              // console.log(res);
              this.$message({
                message: '交接成功',
                type: 'success'
              })
              this.resetForm('changeData')
            })
          })
        } else {
          this.$message({
            message: '请正确填写必填项！',
            type: 'warning'
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('cancel')
      // this.$emit('update:SnycsMoney', false)
    }
    // MoneyClosepost() {
    //   this.$refs.upload2.$el.click()
    // },
    // MoneyClose() {
    //   this.$refs.upload.$el.click()
    // }
  }
}
</script>
<style scoped>
.Money-body {
  width: 100%;
  margin-top: -15px;
}
.Money-yin {
  width: 100%;
  overflow: hidden;
}
.Money-form {
  padding: 0 20px;
  box-sizing: border-box;
}
.Money-from-div {
  width: 100%;
}
.Money-bgc {
  width: 100%;
  background: #F8F7FA;
  padding: 8px 0 8px 24px ;
  margin-bottom: 20px;
  border-radius: 6px;
}
.Money-item {
  height: 40px;
  line-height: 40px;
}
</style>
