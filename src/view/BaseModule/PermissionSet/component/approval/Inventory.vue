<template>
  <el-dialog
    title="盈亏惩处审批单"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    top="20px"
    class="inventory-approval-dialog"
    width="1000px"
  >
    <el-form :model="recordInfo" label-position="left" label-width="90px">
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="单据号:">
            <span class="info-color">{{ recordInfo.document_number }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="盘点人:">
            <span class="info-color">{{ recordInfo.inventory_staff }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="盘点日期:">
            <span class="info-color">{{
              recordInfo.inventory_at | parseTime("{y}-{m}-{d}")
            }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="盘点状态:">
            <span class="info-color">{{ recordInfo.check_results }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="1">
          <div class="table-box">
            <div class="table-title">盈亏明细单</div>
            <el-table :data="inventory_detail" highlight-current-row border fit max-height="300px">
              <el-table-column
                prop="product_code"
                label="产品编号"
                min-width="100"
                align="center"
              />
              <el-table-column
                prop="product_name"
                label="产品全称"
                min-width="100"
                align="center"
              />
              <el-table-column
                prop="product_class"
                label="产品类别"
                min-width="100"
                align="center"
              />
              <el-table-column prop="change_quantity" label="盈亏数量" min-width="100" align="center">
                  <template slot-scope="{row}">
                      <span v-if="parseInt(row.change_quantity)>0" class="suc-color">{{'+'+row.change_quantity}}</span>
                      <span v-else class="err-color">{{row.change_quantity}}</span>
                  </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="1">
          <div class="table-box">
            <div class="table-title">
              <span>处罚单明细单</span>
              <div class="btn-group">
                <el-button type="primary" size="mini">新增</el-button>
              </div>
            </div>
            <el-table :data="table" highlight-current-row border fit max-height="300px">
              <el-table-column
                prop="punishment_name"
                label="处罚责任人姓名"
                min-width="100"
                align="center"
              />
              <el-table-column
                prop="punishment_position"
                label="处罚责任人岗位"
                min-width="100"
                align="center"
              />
              <el-table-column
                prop="punishment_money"
                label="应处罚金额（元）"
                min-width="100"
                align="center"
              />
              <el-table-column
                prop="actual_punishment_money"
                label="实际处罚金额"
                min-width="100"
                align="center"
              />
              <el-table-column
                label="操作"
                fixed="right"
                width="100"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="审批意见:" prop="approval">
            <el-input
              v-model="recordInfo.approval"
              type="textarea"
              rows="3"
              placeholder="请输入审批意见"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="1" class="approvalLine">
          <!-- 审批组件 -->
          <el-timeline>
            <el-timeline-item type="info" placement="top">
              <el-card class="line-card">
                <el-col :span="4">
                  <el-avatar :size="62" class="name-wrap">{{
                    creatorInfo.name
                  }}</el-avatar>
                </el-col>
                <el-col :span="20">
                  <h4>
                    {{ creatorInfo.name + " - " + creatorInfo.position.name }}
                  </h4>
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
                  <el-avatar :size="62" class="name-wrap">{{
                    item.operator_staff ? item.operator_staff.name : ""
                  }}</el-avatar>
                </el-col>
                <el-col :span="20">
                  <h4>
                    {{
                      (item.operator_staff
                        ? item.operator_staff.name + "-"
                        : "") + item.position.name
                    }}
                  </h4>
                  <p v-if="item.operator_staff">{{ item.remark }}</p>
                  <p :class="handleTxtColor(item.status)">
                    {{ item.status_name }}
                  </p>
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
                    <span>{{ sendInfo.length + "人抄送" }}</span>
                  </h4>
                  <p>
                    <span v-for="item in sendInfo" :key="item.id">{{
                      item.name + "；"
                    }}</span>
                  </p>
                </el-col>
                <div style="clear:both" />
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
      <div v-if="recordStatus == 1" class="approve-status-img pass"></div>
      <div v-else-if="recordStatus == -1" class="approve-status-img refuse"></div>
      <div v-else></div>
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
import { approvalRecordDetail } from "@/api/BaseModule/PermissionSet";
import { refundApproveOperate } from '@/api/ManageSales/FrontMoney/FrontMoneyManage'
const appApi = new approvalRecordDetail()
export default {
  name: "RefundApproval",
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
      recordStatus: null,
      approve_enable: 0,
      dlt_id: "",
      module_id: "",
      depositTypeList: [],
      table: [],
      recordInfo: {
        document_number: "",
        inventory_staff: "",
        check_results: "",
        inventory_at: ""
      },
      inventory_detail: [],
      punishment: [],
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
            message: "请输入审批意见",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    approveId(val) {
      this.recordId = val;
      this.getInfo();
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
      this.$emit("closeDialog", false);
    },
    handleStatus(val) {
      // - 审批信息前面的颜色
      if (val == 1) {
        return "success";
      } else if (val == 2 || val == -1) {
        return "warning";
      } else {
        return "primary";
      }
    },
    // 审批状态名称的颜色
    handleTxtColor(val) {
      if (val == 1) {
        return "suc-color";
      } else if (val == 2 || val == -1) {
        return "err-color";
      } else {
        return "main-color";
      }
    },
    // 审批通过
    handlePass(type) {
      if (this.approve_enable == 0) {
        this.$message.error("您没有相关操作权限！");
        return;
      }
      let txt = "审批通过";
      if (type == -1) {
        txt = "退回";
      }
      this.$confirm("确认要执行" + txt + "操作吗？").then(() => {
        const params = {
          module_id: this.module_id,
          remark: this.recordInfo.approval,
          status: type
        };
        refundApproveOperate(params, this.dlt_id)
          .then(res => {
            if (res.code == 200) {
              this.$message.success(res.message);
              setTimeout(() => {
                this.handleClose();
              }, 1000);
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(res => {});
      }).catch(() => {});
    },
    handleTime(timer) {
      // - 处理时间戳
      if (timer == 0 || !timer) {
        return "";
      }
      let newTime = null;
      if ((timer + "").length < 13) {
        newTime = new Date(Math.floor(timer * 1000));
      } else {
        newTime = new Date(parseInt(timer));
      }

      const time = new Date(newTime);
      const year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let hours = time.getHours();
      let minute = time.getMinutes();

      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }

      return year + "-" + month + "-" + date + " " + hours + ":" + minute;
    },
    // 获取流程信息
    getInfo() {
      const id = this.recordId;
      appApi.index(id)
        .then(res => {
            console.log(res);
          if (res.code == 200) {
            const data = res.data;
            const master_detail = data.master_detail;
            this.recordInfo = master_detail.WhInventory;
            this.punishmentInfo = master_detail.punishment;
            this.inventory_detail = master_detail.WhInventoryDtl;

            this.recordStatus = data.record_status;
            this.approve_enable = data.approve_enable;
            this.dlt_id = data.dlt_id;
            this.module_id = data.module_id;
            this.creatorInfo = data.creator;
            this.nodeInfo = data.node;
            this.sendInfo = data.send_to;
          } else {
          }
        })
        .catch(res => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.inventory-approval-dialog {
  .el-form {
    max-height: 600px;
    padding-top: 10px;
    overflow-y: auto;
    position: relative;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .table-box {
      margin-bottom: 20px;
    .table-title {
      height: 44px;
      line-height: 44px;
      padding: 0 10px;
      border: 1px solid #dfe6ec;
      border-bottom: none;
      .btn-group {
        float: right;
      }
    }
  }
  .approvalLine {
    margin-top: 24px;
    .line-card {
      .name-wrap {
        font-size: 14px;
        background-color: #895DFE
      }
      h4,
      p {
        margin: 10px 0;
      }
    }
  }
  .approve-status-img {
      width: 140px;
      height: 140px;
      position: absolute;
      right: 120px;
      top: -6px;
        background-repeat: no-repeat;
        background-position: center;
        z-index: 99;
  }
  .approve-status-img.pass {
      background-image: url('~@/assets/approve/approve-pass.png')
  }
  .approve-status-img.refuse {
      background-image: url('~@/assets/approve/approve-refuse.png')
  }
}
</style>
