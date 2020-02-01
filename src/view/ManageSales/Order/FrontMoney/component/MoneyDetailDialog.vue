<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="订金使用明细"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    top="30px"
    :fullscreen="false"
    class="money-detail-dialog"
    width="1100px"
  >
    <div class="search-box">
      <el-form :inline="true" :model="listQuery" class="search-form">
        <div class="line">
          <el-form-item label="统计日期">
            <el-date-picker
              v-model="listQuery.timearr"
              type="daterange"
              class="dateCompontent filter-item"
              unlink-panels
              range-separator="—"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择截止日期"
              value-format="timestamp"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
          </el-form-item>
        </div>
        <div class="line">
          <el-form-item>
            <el-button type="primary">导出</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table">
      <el-table
        v-loading="listLoading"
        class="table-body-ly"
        highlight-current-row
        :data="tableData"
        border
        fit
        max-height="450"
      >
        <el-table-column label="NO." type="index" min-width="50" align="center" />
        <el-table-column label="核销方式" min-width="120" align="center">
          <template slot-scope="{row}">
            <span v-if="row.use_type == '1'">使用</span>
            <span v-else>退款</span>
          </template>
        </el-table-column>
        <el-table-column label="核销金额" prop="amount" min-width="120" align="center" />
        <el-table-column label="交订门店" prop="deposit.shop.name" min-width="120" align="center" />
        <el-table-column label="交订日期" min-width="120" align="center">
          <template slot-scope="{row}">
            <span>{{ row.deposit.created_at | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="核销原因" prop="reason" min-width="180" align="center" />
        <el-table-column label="操作人" prop="staff.name" min-width="120" align="center" />
        <el-table-column label="操作时间" min-width="120" align="center">
          <template slot-scope="{row}">
            <span>{{ row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
    <div slot="footer" class="dialog-footer">
      <el-col :span="23">
        <!-- <el-button @click="handleClose">取 消</el-button> -->
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </el-col>
      <div style="clear:both" />
    </div>
  </el-dialog>
</template>

<script>
import { detailIndex } from '@/api/ManageSales/FrontMoney/FrontMoneyManage'
export default {
  props: {
    visible: {
      type: Boolean,
      default() {
        return false
      }
    },
    curDepositId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      depositId: '',
      listLoading: false,
      total: 1,
      listQuery: {
        timearr: [],
        page: 1,
        page_size: 10
      },
      tableData: []
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    },
    curDepositId(val) {
      this.depositId = val
      this.getList()
    }
  },
  methods: {
    getList() {
      const params = Object.assign({}, this.listQuery)
      if (params.timearr && params.timearr.length > 0) {
        params.use_ts_start = Math.floor(params.timearr[0] / 1000)
        params.use_ts_end = Math.floor(params.timearr[1] / 1000)
      }
      // delete params.timearr
      this.listLoading = true
      params.id = this.depositId
      detailIndex(params).then(res => {
        if (res.code == 200) {
          const data = res.data
          this.total = parseInt(data.total_count, 0)
          const list = data.list
          const deposit = data.deposit
          list.forEach(item => {
            item.deposit = deposit
          })
          this.tableData = list
        } else {
          this.$message.error(res.message)
        }
        this.listLoading = false
      }).catch(res => {
        this.$message.error(res.message)
        this.listLoading = false
      })
    },
    handleClose() {
      this.$emit('closeDialog', false)
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.money-detail-dialog {
  .dialog-footer {
    text-align: right;
  }
}
</style>
