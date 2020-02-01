<template>
  <!-- 定金管理 -->
  <div class="app-container front-money-cont">
    <div class="search-box">
      <el-form :inline="true" :model="listQuery" class="search-form">
        <div class="line">
          <el-form-item>
            <el-input
              v-model="listQuery.customer_no"
              placeholder="请输入会员编号"
              prefix-icon="el-icon-search"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.customer_name"
              placeholder="请输入会员姓名"
              prefix-icon="el-icon-search"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery.customer_attr" placeholder="请选择顾客属性" clearable>
              <el-option
                v-for="item in customerAttr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="listQuery.timearr"
              type="daterange"
              class="dateCompontent filter-item"
              unlink-panels
              range-separator="—"
              start-placeholder="请选择充值开始日期"
              end-placeholder="请选择充值截止日期"
              value-format="timestamp"
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery.deposit_type" placeholder="请选择充值类型" clearable>
              <el-option
                v-for="item in depositType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
          </el-form-item>
        </div>
        <div class="line">
          <el-form-item>
            <el-button type="primary" @click="handleOpenRefundDialog">退订金</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleOpenWriteOffDialog">核销</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">高级查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">导出</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table">
      <el-table
        ref="table"
        v-loading="listLoading"
        class="table-body-ly"
        highlight-current-row
        :data="tableData"
        height="100%"
        border
        fit
      >
        <el-table-column type="index" label="NO." min-width="50" align="center" />
        <el-table-column prop="id" label="订单号" min-width="100" align="center" />
        <el-table-column prop="created_at" label="交订日期" width="130" align="center">
          <template slot-scope="{row}">
            <span>{{ row.created_at | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customer.name" label="顾客姓名" align="center" />
        <el-table-column prop="customer.customer_no" label="会员编号" min-width="120" align="center" />
        <el-table-column
          prop="customer.manage_cate_name"
          label="管理类别"
          min-width="100"
          align="center"
        />
        <el-table-column prop="customer.phone" label="电话号码" width="120" align="center" />
        <el-table-column prop="customer.customer_star_name" label="顾客星级" align="center" />
        <el-table-column
          prop="customer.customer_attr_name"
          label="顾客属性"
          min-width="100"
          align="center"
        />
        <el-table-column prop="customer.shop.name" label="所属美容院" min-width="120" align="center" />
        <el-table-column
          prop="customer.main_service.name"
          label="主服务技师"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="customer.main_service.account"
          label="主服务技师登录帐号"
          min-width="200"
          align="center"
        />
        <el-table-column
          prop="customer.vice_service.name"
          label="副服务技师"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="customer.vice_service.account"
          label="副服务技师登录帐号"
          min-width="200"
          align="center"
        />
        <el-table-column prop="deposit_name" label="充值类型" min-width="100" align="center" />
        <el-table-column label="订金金额" min-width="100" align="center">
          <template slot-scope="{row}">
            <el-link type="primary" @click="handleOpenDeailDialog(row.id)">{{ row.amount }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="send_amount" label="赠送金额" min-width="100" align="center" />
        <el-table-column prop="surplus_amount" label="订金余额" min-width="100" align="center" />
        <el-table-column label="最后一次返订日期" min-width="150" align="center">
          <template slot-scope="{row}">
            <span v-if="row.consume_at != 0">{{ row.consume_at | parseTime('{y}-{m}-{d}') }}</span>
            <span v-else />
          </template>
        </el-table-column>
        <el-table-column prop="staff.name" label="操作人" min-width="100" align="center" />
        <el-table-column label="操作时间" width="150" align="center">
          <template slot-scope="{row}">
            <span>{{ row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="status" label="状态" /> -->
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleOpenChargeDialog(row)">冲销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="m-footer main-page">
        <el-pagination
          v-show="total>0"
          :current-page="listQuery.page"
          :page-sizes="[10,20,30]"
          :page-size="listQuery.page_size"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 退订金 -->
    <el-dialog
      title="退订金"
      :visible.sync="dialogRefundVisible"
      :before-close="handleRefundCancel"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="400px"
    >
      <el-form ref="refundForm" :model="refundData" :rules="refundRules" label-width="90px">
        <el-form-item label="类型" prop="deposit_type">
          <el-radio-group v-model="refundData.deposit_type">
            <el-radio :label="1">订金</el-radio>
            <el-radio :label="3">活动订金</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会员姓名" prop="customer_name">
          <el-autocomplete
            v-model="refundData.customer_name"
            :fetch-suggestions="getCutomer"
            placeholder="请输入姓名"
            class="w100"
            @select="handleRefundCustomerSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="退款原因" prop="remark">
          <el-input v-model="refundData.remark" type="textarea" placeholder="请输入退款原因" />
        </el-form-item>
        <el-form-item label="退款总额" prop="amount">
          <el-input v-model="refundData.amount" v-limit-num class="w100" placeholder="请输入金额" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-col :span="23">
          <el-button @click="handleRefundCancel">取 消</el-button>
          <el-button type="primary" @click="handleRefundConfirm">确 定</el-button>
        </el-col>
        <div style="clear:both" />
      </div>
    </el-dialog>

    <!-- 核销 -->
    <el-dialog
      title="核销"
      :visible.sync="dialogWriteOffVisible"
      :before-close="handleWriteOffCancel"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="400px"
    >
      <el-form ref="writeOffForm" :model="writeOffData" :rules="writeOffRules" label-width="90px">
        <el-form-item label="会员姓名" prop="customer_name">
          <el-autocomplete
            v-model="writeOffData.customer_name"
            :fetch-suggestions="getCutomer"
            placeholder="请输入姓名"
            class="w100"
            @select="handleWriteOffCustomerSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="核销原因" prop="remark">
          <el-input v-model="writeOffData.remark" type="textarea" placeholder="请输入退款原因" />
        </el-form-item>
        <el-form-item label="核销总额" prop="amount">
          <el-input v-model="writeOffData.amount" v-limit-num class="w100" placeholder="请输入金额" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-col :span="23">
          <el-button @click="handleWriteOffCancel">取 消</el-button>
          <el-button type="primary" @click="handleWriteOffConfirm">确 定</el-button>
        </el-col>
        <div style="clear:both" />
      </div>
    </el-dialog>

    <!-- 冲销 -->
    <el-dialog
      title="冲销"
      :visible.sync="dialogChargeVisible"
      :before-close="handleChargeCancel"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      class="charge-dialog"
      width="400px"
    >
      <el-form ref="chargeForm" :model="chargeData" :rules="chargeRules" label-width="90px">
        <el-form-item label="冲销原因" prop="remark">
          <el-input v-model="chargeData.remark" type="textarea" placeholder="请输入退款原因" />
        </el-form-item>
        <el-form-item label="冲销总额" prop="amount">
          <el-input v-model="chargeData.amount" v-limit-num class="w100" placeholder="请输入金额"/>
        </el-form-item>
        <el-form-item label="转到" prop="charge">
          <el-row>
            <el-col :span="24">
              <el-radio v-model="chargeType.type" label="1">活动订金</el-radio>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <el-radio v-model="chargeType.type" label="2">子产业订金</el-radio>
            </el-col>
            <el-col :span="12">
              <el-select
                v-model="chargeType.industry_id"
                class="pay-input"
                placeholder="请选择子产业"
                clearable
              >
                <el-option v-for="item in sonIndustry" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-radio v-model="chargeType.type" label="3">纯冲销</el-radio>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-col :span="23">
          <el-button @click="handleChargeCancel">取 消</el-button>
          <el-button type="primary" @click="handleChargeConfirm">确 定</el-button>
        </el-col>
        <div style="clear:both" />
      </div>
    </el-dialog>

    <money-detail
      :visible="dialogMoneyVisible"
      :cur-deposit-id="currentDepositId"
      @closeDialog="handleDeailDialogClose"
    />
    <refund-approval
      :visible="dialogRefundApprovalVisible"
      :approveId="refund_approve_id"
      @closeDialog="handleRefundApprovalDialogClose"
    />
  </div>
</template>
<script>
import MoneyDetail from './component/MoneyDetailDialog'
import RefundApproval from './component/RefundApprovalDialog'
import { index, batchUpdate, findCustomer } from '@/api/ManageSales/FrontMoney/FrontMoneyManage'

export default {
  name: 'FrontMoney',
  components: {
    MoneyDetail,
    RefundApproval
  },
  data() {
    return {
      listQuery: {
        customer_no: '',
        customer_name: '',
        customer_attr: '',
        timearr: [],
        deposit_type: '',
        page: 1,
        page_size: 10
      },
      customerAttr: [],
      depositType: [],
      sonIndustry: [],
      total: 1,
      tableData: [],
      currentDepositId: '',

      customerList: [],
      refundData: {
        customer_name: "",
        deposit_type: 1,
        customer_id: '',
        remark: '',
        amount: ''
      },
      refundRules: {
        deposit_type: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }
        ],
        customer_name: [
          {
            required: true,
            message: '请选择会员',
            trigger: 'change'
          }
        ],
        remark: [
          {
            required: true,
            message: '请输入原因',
            trigger: 'blur'
          }
        ],
        amount: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'blur'
          }
        ]
      },
      writeOffData: {
        remark: '',
        amount: '',
        customer_name: "",
        customer_id: ''
      },
      writeOffRules: {
        remark: [
          {
            required: true,
            message: '请输入原因',
            trigger: 'blur'
          }
        ],
        amount: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'blur'
          }
        ],
        customer_name: [
          {
            required: true,
            message: '请选择会员',
            trigger: 'change'
          }
        ]
      },
      chargeData: {
        remark: '',
        amount: '',
        customer_id: '',
        deposit_id: '',
        charge: {}
      },
      chargeType: {
        type: '1',
        industry_id: ''
      },
      chargeRules: {
        remark: [
          {
            required: true,
            message: '请输入原因',
            trigger: 'blur'
          }
        ],
        amount: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'blur'
          }
        ],
        charge: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }
        ]
      },
      refund_approve_id: 0,
      listLoading: false,
      customerloading: false,
      dialogMoneyVisible: false,
      dialogRefundVisible: false,
      dialogWriteOffVisible: false,
      dialogChargeVisible: false,
      dialogRefundApprovalVisible: false
    }
  },
  created() {
    this.getList()
    // this.getCutomer()
  },
  methods: {
    getList() {
      const params = Object.assign({}, this.listQuery)
      if (params.timearr && params.timearr.length > 0) {
        params.pay_at_start = Math.floor(params.timearr[0] / 1000)
        params.pay_at_end = Math.floor(params.timearr[1] / 1000)
      }
      // delete params.timearr
      this.listLoading = true
      index(params).then(res => {
        if (res.code == 200) {
          const data = res.data
          const dic = data.dic
          this.total = parseInt(data.total_count, 0)
          this.depositType = dic.deposit_type
          this.customerAttr = dic.dic_customer_attr
          this.sonIndustry = dic.dic_son_industry
          this.tableData = data.list
        } else {
          this.$message.error(res.message)
        }
        this.listLoading = false
        this.$nextTick(() => {
          this.$refs.table.doLayout()
        })
      }).catch(res => {
        this.$message.error(res.message)
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 打开 退订金 dialog
    handleOpenRefundDialog() {
      this.dialogRefundVisible = true
    },
    // 关闭 退订金 dialog
    handleRefundCancel() {
      this.$refs.refundForm.clearValidate()
      this.$refs.refundForm.resetFields()
      this.dialogRefundVisible = false
      this.customerList = []
    },
    // 退订金 dialog 确认
    handleRefundConfirm() {
      this.$refs.refundForm.validate(valid => {
        if (valid) {
          const params = this.refundData
          params.action = 'refund'
          
          batchUpdate(params).then(res => {
            if (res.code == 200) {
              this.refund_approve_id = res.data.approve
              this.$message.success(res.message)
              this.dialogRefundApprovalVisible = true
            } else {
              this.$message.error(res.message)
            }
          }).catch(res => {
            this.$message.error(res.message)
          })
        } else {
          
        }
      })
    },
    // 打开 核销 dialog
    handleOpenWriteOffDialog() {
      this.dialogWriteOffVisible = true
    },
    // 关闭 核销 dialog
    handleWriteOffCancel() {
      this.$refs.writeOffForm.clearValidate()
      this.$refs.writeOffForm.resetFields()
      this.dialogWriteOffVisible = false
      this.customerList = []
    },
    // 核销 dialog 确认
    handleWriteOffConfirm() {
      this.$refs.writeOffForm.validate(valid => {
        if (valid) {
          const params = this.writeOffData
          params.action = 'write_off'
          batchUpdate(params).then(res => {
            console.log(res)
            if (res.code == 200) {
              this.$message.success(res.message)
              this.handleWriteOffCancel()
            } else {
              this.$message.error(res.message)
            }
          }).catch(res => {
            this.$message.error(res.message)
          })
        } else {
          // this.$message.error(res.message);
        }
      })
    },
    // 打开 冲销 dialog
    handleOpenChargeDialog(obj) {
      this.chargeData.deposit_id = obj.id
      this.chargeData.customer_id = obj.customer_id
      this.dialogChargeVisible = true
    },
    // 关闭 冲销 dialog
    handleChargeCancel() {
      this.$refs.chargeForm.clearValidate()
      this.$refs.chargeForm.resetFields()
      this.dialogChargeVisible = false
    },
    // 核销 dialog 确认
    handleChargeConfirm() {
      this.$refs.chargeForm.validate(valid => {
        if (valid) {
          const chargeType = this.chargeType
          const params = Object.assign({}, this.chargeData)
          if (chargeType.type == '2' && chargeType.industry_id == '') {
            this.$message.error('请选择子产业')
            return
          }
          params.action = 'charge'
          params.charge.type = chargeType.type,
          params.charge.industry_id = chargeType.industry_id
          if (chargeType.type != '2') {
            params.charge.industry_id = '0'
          }

          batchUpdate(params).then(res => {
            if (res.code == 200) {
              this.$message.success(res.message)
              this.handleChargeCancel()
            } else {
              this.$message.error(res.message)
            }
          }).catch(res => {
            this.$message.error(res.message)
          })
        } else {
          // this.$message.error(res.message);
        }
      })
    },
    // 打开 订金使用明细 dialog
    handleOpenDeailDialog(val) {
      this.currentDepositId = val + ''
      this.dialogMoneyVisible = true
    },
    // 关闭 订金使用明细 dialog
    handleDeailDialogClose() {
      this.dialogMoneyVisible = false
    },
    // 关闭 退订金流程 dialog
    handleRefundApprovalDialogClose() {
      this.dialogRefundApprovalVisible = false
      this.handleRefundCancel()
    },

    // 获取客户列表
    getCutomer(query, cb) {
      findCustomer(query).then(res => {
        if (res.code == 200) {
          this.customerList = []
          res.data.list.forEach(item => {
            const obj = Object.assign({}, item);
            obj.value = obj.name;
            this.customerList.push(obj)
          })
          cb(this.customerList)
        } else {
          
        }

      }).catch(res => {
        
      })
    },
    // 退订金 会员切换 change
    handleRefundCustomerSelect(obj) {
      this.refundData.customer_id = obj.id;
    },
    // 核销 会员切换 change
    handleWriteOffCustomerSelect(obj) {
      this.writeOffData.customer_id = obj.id;
    }
  }
}
</script>

<style lang="scss" scoped>
.front-money-cont {
  .search-box {
    .line {
      text-align: left;
    }
    .el-form-item {
      margin-bottom: 20px;
    }
  }
  .table {
    height: 100%;
    .table-body-ly {
      max-height: calc(100% - 160px);
    }
    .main-page {
      margin-top: 10px;
    }
  }
}
.charge-dialog {
  .el-radio-group {
    width: 100%;
    .el-row {
      line-height: 36px;
      .el-radio {
        margin-top: 10px;
      }
    }
  }
}
</style>
