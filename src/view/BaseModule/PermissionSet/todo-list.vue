<template>
  <!-- 我的代办列表 -->
  <div class="app-container approval-container">
    <div class="search-box">
      <el-form :inline="true" :model="listQuery" class="search-form">
        <div class="line">
          <el-form-item>
            <el-input
              placeholder="请输入流程名称"
              prefix-icon="el-icon-search"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="状态"
              prefix-icon="el-icon-search"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              type="daterange"
              class="dateCompontent filter-item"
              unlink-panels
              range-separator="—"
              start-placeholder="请选择申请开始日期"
              end-placeholder="请选择申请截止日期"
              value-format="timestamp"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
          </el-form-item>
        </div>
        <div class="line">
          <el-form-item>
            <el-button type="primary">代办列表</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">已办列表</el-button>
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
        <el-table-column prop="record_id" label="单据编号" min-width="100" align="center" />
        <el-table-column prop="name" label="流程名称" min-width="100" align="center" />
        <el-table-column prop="module_name" label="流程定义" min-width="100" align="center" />
        <el-table-column label="申请日期" min-width="120" align="center">
          <template slot-scope="{row}">
            <span v-if="row.created_at != 0">{{ row.created_at | parseTime('{y}-{m}-{d}') }}</span>
            <span v-else />
          </template>
        </el-table-column>
        <el-table-column prop="applyer_name" label="申请人" align="center"/>
        <el-table-column prop="status_name" label="流程状态" align="center"/>
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="handleOpenDetailDialog(row)">去处理</el-button>
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

    <!-- "1": "差评处理",
    "2": "退款申请",
    "3": "违规申请",
    "4": "前台请假",
    "5": "院长请假",
    "6": "转让申请",
    "7": "赠送权限",
    "8": "医美转生美",
    "9": "生美转医美",
    "10": "离职审批",
    "11": "固定资产报废",
    "12": "固定资产盘亏/盘盈",
    "13": "货品盘亏/盘盈",
    "14": "项目替换",
    "15": "订金退款",
    "16": "订金冲销(跨天)",
    "17": "订金冲销(跨月)" -->
    <!-- 盘点 -->
    <approval-inventory 
      :visible="ApprovalInventoryVisible" 
      :approveId="currentApproveId_13"
      @closeDialog="handleCloseApproval(13)"
    />
    <!-- 退订金 -->
    <approval-refund
      :visible="ApprovalRefundVisible"
      :approveId="currentApproveId_15"
      @closeDialog="handleCloseApproval(15)"
    />
  </div>
</template>

<script>
import ApprovalInventory from './component/approval/Inventory'
import ApprovalRefund from '@/view/ManageSales/Order/FrontMoney/component/RefundApprovalDialog'
import { approvalDetail } from '@/api/BaseModule/PermissionSet'
const appApi = new approvalDetail()
export default {
  name: 'ApprovalDetail',
  components: {
    ApprovalInventory,
    ApprovalRefund
  },
  data() {
    return {
      listLoading: false,
      listQuery: {
        timearr: [],
        page: 1,
        page_size: 10
      },
      total: 1,
      tableData: [],
      currentApproveId_13: 0,
      currentApproveId_15: 0,
      ApprovalInventoryVisible: false,
      ApprovalRefundVisible: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      appApi.list().then(res => {
        if(res.code == 200) {
          this.tableData = res.data.list
          this.total = parseInt(res.data.total_count)
        } else {
          this.$message.error(res.message);
        }
        this.listLoading = false
      }).catch(res => {
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
    // 打开审批
    handleOpenDetailDialog(obj) {
      
      const moduleId= obj.module_id;
      this["currentApproveId_"+moduleId]= parseInt(obj.record_id);
      if(moduleId == 13) {
        this.ApprovalInventoryVisible = true;
      } else if(moduleId == 15) {
        this.ApprovalRefundVisible = true;
      }
      
    },

    // 关闭盘点盈亏审批
    handleCloseApproval(val) {
      if(val == 13) {
        this.ApprovalInventoryVisible = false;
      } else if(val == 15) {
        this.ApprovalRefundVisible = false;
      }
      
      this.getList();
    }
  }
}
</script>

<style lang="scss" scoped>
.approval-container {
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
</style>
