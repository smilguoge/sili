<template>
  <el-dialog
    title="退订金申请流程"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    top="20px"
    class="refund-approval-dialog"
    width="1000px"
  >
    <el-form :model="recordInfo" label-position="right" label-width="90px">
      <el-col :span="23">
        <el-form-item label="申请人:">
          <span class="info-color">{{ recordInfo.customer_name }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="23">
        <el-form-item label="申请日期:">
          <span class="info-color">{{ recordInfo.created_at | parseTime('{y}-{m}-{d}') }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="23">
        <el-form-item label="类型:">
          <el-radio 
            v-for="item in depositTypeList"
            :key="item.value"
            v-model="recordInfo.deposit_type"
            disabled 
            :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="23">
        <el-form-item label="退款总额:">
          <span class="info-color">{{ recordInfo.amount }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="23">
        <el-form-item label="退款原因:">
          <span class="info-color">{{ recordInfo.remark }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="23">
        <el-form-item label="审批意见:" prop="approval">
          <el-input v-model="recordInfo.approval" type="textarea" rows="3" placeholder="请输入审批意见" />
        </el-form-item>
      </el-col>

      <el-col :span="23" :offset="0" class="approvalLine">
        <!-- 审批组件 -->
        <el-timeline>
          <el-timeline-item
            type="info"
            placement="top"
          >
            <el-card class="line-card">
              <el-col :span="4">
                <el-avatar :size="62" class="name-wrap">{{ creatorInfo.name }}</el-avatar>
              </el-col>
              <el-col :span="20">
                <h4>{{ creatorInfo.name+' - '+creatorInfo.position.name }}</h4>
                <p>发起申请</p>
              </el-col>
              <div style="clear:both" />
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            v-for="item in nodeInfo"
            :key="item.id"
            :timestamp="handleTime(item.approve_at)"
            :type="handleStatus(item.status)"
            placement="top"
          >
            <el-card class="line-card">
              <el-col :span="4">
                <el-avatar :size="62" class="name-wrap">{{ item.operator_staff ? item.operator_staff.name : '' }}</el-avatar>
              </el-col>
              <el-col :span="20">
                <h4>{{ (item.operator_staff ? (item.operator_staff.name+'-') : '')+item.position.name }}</h4>
                <p v-if="item.operator_staff">{{ item.remark }}</p>
                <p :class="handleTxtColor(item.status)">{{ item.status_name }}</p>
              </el-col>
              <div style="clear:both" />
            </el-card>
          </el-timeline-item>
          <el-timeline-item v-if="sendInfo.length > 0">
            <el-card class="line-card">
              <el-col :span="4">
                <el-avatar :size="62" class="name-wrap">
                  <span>归档</span>
                </el-avatar>
              </el-col>
              <el-col :span="20">
                <h4>
                  <span>{{ sendInfo.length + '人抄送' }}</span>
                </h4>
                <p>
                  <span v-for="item in sendInfo" :key="item.id">{{ item.name + '；' }}</span>
                </p>
              </el-col>
              <div style="clear:both" />
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-col>
      <div style="clear:both" />
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-col :span="23">
        <el-button type="primary" @click="handlePass(1)">审批通过</el-button>
        <el-button type="danger" @click="handlePass(-1)">退回</el-button>
        <el-button type="primary" @click="handleClose">转办</el-button>
        <el-button type="primary" @click="handleClose">转发</el-button>
      </el-col>
      <div style="clear:both" />
    </div>
  </el-dialog>
</template>

<script>
import { refundApproveIndex, refundApproveOperate } from '@/api/ManageSales/FrontMoney/FrontMoneyManage'
export default {
  name: 'RefundApproval',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    approveId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialogVisible: false,
      recordId: "",
      approve_enable: 0,
      dlt_id: "",
      module_id: "",
      depositTypeList: [],
      recordInfo: {
        customer_name: "",
        created_at: "",
        deposit_type: "",
        amount: "",
        remark: "",
        approval: ""
      },
      creatorInfo: {
        name: "",
        position: {
          id: "",
          name: ""
        }
      },
      nodeInfo: [],
      sendInfo: [],
      rules: {
        approval: [
          {
            required: true,
            message: '请输入审批意见',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    },
    approveId(val) {
      this.recordId = val
      this.getInfo()
    }
  },
  methods: {
    handleClose() {
      this.$emit('closeDialog', false)
    },
    handleStatus(val) {
      // - 审批信息前面的颜色
      if (val == 1) {
        return 'success'
      } else if (val == 2 || val == -1) {
        return 'warning'
      } else {
        return 'primary'
      }
    },
    // 审批状态名称的颜色
    handleTxtColor(val) {
      if (val == 1) {
        return 'suc-color'
      } else if (val == 2 || val == -1) {
        return 'err-color'
      } else {
        return 'main-color'
      }
    },
    // 审批通过
    handlePass(type) {
      if(this.approve_enable == 0) {
        this.$message.error("您没有相关操作权限！")
        return
      }
      let txt = "审批通过"
      if(type == -1) {
        txt = "退回"
      }
      this
        .$confirm("确认要执行"+txt+"操作吗？")
        .then(() => {
          const params = {
            module_id: this.module_id,
            remark: this.recordInfo.approval,
            status: type
          }
          refundApproveOperate(params, this.dlt_id).then(res => {
            if(res.code == 200) {
              this.$message.success(res.message)
              setTimeout(() => {
                this.handleClose();
              }, 1000)
              
            } else {
              this.$message.error(res.message)
            }
          }).catch(res => {

          })
          
        })

    },
    handleTime(timer) {
      // - 处理时间戳
      if(timer == 0 || !timer) {
        return ""
      }
      let newTime = null
      if ((timer + '').length < 13) {
        newTime = new Date(Math.floor(timer * 1000))
      } else {
        newTime = new Date(parseInt(timer))
      }

      const time = new Date(newTime)
      const year = time.getFullYear()
      let month = time.getMonth() + 1
      let date = time.getDate()
      let hours = time.getHours()
      let minute = time.getMinutes()

      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minute < 10) {
        minute = '0' + minute
      }

      return year + '-' + month + '-' + date + ' ' + hours + ':' + minute
    },
    // 获取流程信息
    getInfo() {
      const id = this.recordId;
      refundApproveIndex(id).then(res => {
        if(res.code == 200) {
          const data = res.data;
          const master_detail = data.master_detail;
          this.recordInfo.customer_name = master_detail.customer.name
          this.recordInfo.created_at = master_detail.created_at
          this.recordInfo.deposit_type = master_detail.deposit_type
          this.recordInfo.amount = master_detail.amount
          this.recordInfo.remark = master_detail.remark
          this.depositTypeList = master_detail.deposit_type_list;

          this.approve_enable = data.approve_enable
          this.dlt_id = data.dlt_id
          this.module_id = data.module_id
          this.creatorInfo = data.creator
          this.nodeInfo = data.node
          this.sendInfo = data.send_to
        } else {

        }
      }).catch(res => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.refund-approval-dialog {
  .el-form {
    max-height: 500px;
    overflow-y: auto;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .approvalLine {
    margin-top: 24px;
    .line-card {
      .name-wrap {
        font-size: 14px;
      }
      h4,
      p {
        margin: 10px 0;
      }
    }
  }
}
</style>
