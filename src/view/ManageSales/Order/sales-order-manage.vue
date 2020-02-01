<template>
  <!-- 销售暂存单管理 -->
  <div class="app-container">
    <div class="filter-container clearfix">
      <el-input
        v-model="listQuery.customer_no"
        class="input-160 filter-item"
        placeholder="请输入会员编号"
        prefix-icon="el-icon-search"
        clearable
      />
      <el-select
        v-model="listQuery.dic_customer_attr"
        class="input-160 filter-item"
        placeholder="请选择顾客属性"
      >
        <el-option v-for="(item,index) in customerAttList" :key="index" :label="item.label" :value="item.value" />
      </el-select>
      <el-select
        v-model="listQuery.status"
        class="input-160 filter-item"
        placeholder="请选择订单状态"
      >
        <el-option label="作废" value="0" />
        <el-option label="挂单" value="1" />
        <el-option label="审批中" value="2" />
        <el-option label="审批完成" value="3" />
      </el-select>
      <el-date-picker
        v-model="dateRange"
        type="datetimerange"
        class="dateCompontent filter-item"
        range-separator="—"
        start-placeholder="选择统计时间段"
        end-placeholder="选择统计时间段"
        value-format="timestamp"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="submitSearch"
      >查 询</el-button>
      <el-button
        disabled
        class="filter-item"
        type="primary"
        icon="el-icon-zoom-in"
      >高级查询</el-button>
      <el-button
        disabled
        class="filter-item"
        type="primary"
        icon="el-icon-upload2"
      >导 出</el-button>
    </div>
    <div class="table-wrap-ly">
      <el-table
        v-loading="listLoading"
        :show-overflow-tooltip="true"
        class="table-body-ly"
        style="width:100%"
        :data="list"
        height="100%"
        border
        stripe
        fit
      >
        <el-table-column
          label="订单号"
          align="center"
          fixed="left"
          min-width="140px"
        >
          <template slot-scope="{row}">{{ row.order_no }}</template>
        </el-table-column>
        <el-table-column
          label="会员编号"
          align="center"
          min-width="140px"
        >
          <template slot-scope="{row}">{{ row.customer_no }}</template>
        </el-table-column>
        <el-table-column
          label="顾客姓名"
          align="center"
          min-width="120px"
        >
          <template slot-scope="{row}">{{ row.customer_name }}</template>
        </el-table-column>
        <el-table-column
          label="磁卡编号"
          align="center"
          min-width="140px"
        >
          <template slot-scope="{row}">{{ row.card_id }}</template>
        </el-table-column>
        <el-table-column
          label="顾客属性"
          align="center"
          min-width="140px"
        >
          <template slot-scope="{row}">{{ row.dic_customer_attr }}</template>
        </el-table-column>
        <el-table-column
          label="手机号码"
          align="center"
          min-width="120px"
        >
          <template slot-scope="{row}">{{ row.phone }}</template>
        </el-table-column>
        <el-table-column
          label="订单总额"
          align="center"
        >
          <template slot-scope="{row}">{{ row.total }}</template>
        </el-table-column>
        <el-table-column
          label="实收业绩"
          align="center"
        >
          <template slot-scope="{row}">{{ row.receive }}</template>
        </el-table-column>
        <el-table-column
          label="实付业绩"
          align="center"
        >
          <template slot-scope="{row}">{{ row.pay }}</template>
        </el-table-column>
        <el-table-column
          label="接待美容院"
          align="center"
        >
          <template slot-scope="{row}">{{ row.consume_shop_name }}</template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
        >
          <template slot-scope="{row}">{{ row.status }}</template>
        </el-table-column>
        <el-table-column
          label="操作人"
          align="center"
          min-width="120px"
        >
          <template slot-scope="{row}">{{ row.operator }}</template>
        </el-table-column>
        <el-table-column
          label="操作时间"
          align="center"
          min-width="160px"
        >
          <template slot-scope="{row}">{{ row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="80"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="revokeSubmit(scope.row.id*1,scope.$index)"
            >撤销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="m-footer main-page">
        <el-pagination
          v-show="total>0"
          :current-page="listQuery.page"
          :page-sizes="[listQuery.page_size,20,30]"
          :page-size="listQuery.page_size"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { saleDraftIndex, saleDraftCancel } from '@/api/ManageSales/Order'

export default {
  name: 'InlineEditTable',
  data() {
    return {
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        page_size: 10,
        customer_no: '',
        dic_customer_attr: '',
        status: '',
        start_ts: '',
        end_ts: ''
      },
      dateRange: [], // 检索时间组
      customerAttList: [],

      // 配置参数
      dialogVisible: false,
      listLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      saleDraftIndex(this.listQuery).then(res => {
        if (res.data.order_drafts.length) {
          this.list = res.data.order_drafts
          this.total = res.data.total_count * 1
        } else {
          this.list = []
          this.total = 0
          this.$message.warning('没有更多数据')
        }
        this.listLoading = false

        this.customerAttList = res.data.dictionary.dic_customer_attr
      })
    },

    submitSearch() {
      if (this.dateRange && this.dateRange.length > 0) {
        this.listQuery.start_ts = Math.floor(this.dateRange[0] / 1000)
        this.listQuery.end_ts = Math.floor(this.dateRange[1] / 1000)
      } else {
        this.listQuery.start_ts = ''
        this.listQuery.end_ts = ''
      }
      this.getList()
    },

    revokeSubmit(id, index) {
      this.$confirm('此操作将驳回这条审批，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saleDraftCancel({ id: id }).then(res => {
          this.$message({
            type: 'success',
            message: '撤销成功'
          })
          // this.list.splice(index,1)
          this.getList()
        })
      }).catch(() => {
      })
    },

    // - 分页
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
.input-160 {
  width: 160px !important;
}
.dateCompontent {
  width: 300px;
}

.table-wrap-ly {
  height: calc(100vh - 260px);
  flex: 1;
  transition: 0.2s;
  -webkit-transition: 0.2s;
}
.table-body-ly {
  max-height: calc(100% - 20px);
  transition: 0.21s ease all;
}
</style>
