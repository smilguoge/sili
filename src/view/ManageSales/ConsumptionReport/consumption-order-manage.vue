<template>
  <!-- 消耗暂存单管理 -->
  <div class="app-container consumption-order-manage">
    <div class="filter-container clearfix">
      <el-input
        v-model="listQuery.code"
        class="input-160 filter-item filter-input"
        placeholder="请输入会员编号"
        prefix-icon="el-icon-search"
        clearable
      />
      <el-input
        v-model="listQuery.name"
        class="input-160 filter-item filter-input"
        placeholder="请输入会员姓名"
        prefix-icon="el-icon-search"
        clearable
      />
      <el-select
        v-model="listQuery.attr"
        class="input-160 filter-item filter-input"
        placeholder="请选择顾客属性"
        clearable
      >
        <el-option label="嘉宾" value="1" />
        <el-option label="售前" value="2" />
        <el-option label="售后" value="3" />
      </el-select>
      <el-date-picker
        v-model="timearr"
        type="daterange"
        class="dateCompontent filter-item filter-input"
        unlink-panels
        range-separator="—"
        start-placeholder="选择统计时间段"
        end-placeholder="选择统计时间段"
        value-format="timestamp"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查 询</el-button>
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
        <el-table-column label="消耗订单号" align="center" fixed="left" min-width="140px">
          <template slot-scope="{row}">
            <el-link type="primary" @click="toConsumption(row.order_id)">{{ row.order_no }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="会员编号" align="center" min-width="100px">
          <template slot-scope="{row}">
            <span>{{ row.customer_no }}</span>
          </template>
        </el-table-column>
        <el-table-column label="会员姓名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.customer_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="磁卡编号" align="center" min-width="140px">
          <template slot-scope="{row}">
            <span>{{ row.shopname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="顾客属性" align="center">
          <template slot-scope="{row}">
            <span>{{ row.customer_attr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" align="center" min-width="120px">
          <template slot-scope="{row}">
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="耗材金额" align="center">
          <template slot-scope="{row}">
            <span>{{ row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column label="赠送积分" align="center">
          <template slot-scope="{row}">
            <span>{{ row.integral }}</span>
          </template>
        </el-table-column>
        <el-table-column label="护理美容院" min-width="120px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.shop_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.operator_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center" min-width="160px">
          <template slot-scope="{row}">
            <span>{{ row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="main-page">
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
  </div>
</template>

<script>
import { consume } from '@/api/ManageSales/SalesConsume'
const consumeApi = new consume()

export default {
  name: 'InlineEditTable',
  data() {
    return {
      list: null,
      changeData: {},

      total: null,
      listQuery: {
        page: 1,
        page_size: 10,
        name: '',
        code: '',
        attr: '',
        start: '',
        end: ''
      },

      // 配置参数
      dialogVisible: false,
      listLoading: false,
      timearr: [] // 检索时间
    }
  },
  created() {
    this.getList(this.listQuery)
  },
  methods: {
    getList(params) {
      this.listLoading = true
      consumeApi.list(params)
        .then(res => {
          const item = res.data
          if (item.orderlist.lenght !== 0) {
            this.list = item.orderlist
            this.total = parseInt(item.totalCount)
            this.listLoading = false
          } else {
            this.list = []
            this.$message.warning('没有更多数据')
            this.listLoading = false
          }
        })
    },

    handleFilter() {
      if (this.timearr[0]) {
        this.listQuery.start = Math.floor(this.timearr[0] / 1000)
        this.listQuery.end = Math.floor(this.timearr[1] / 1000)
      } else {
        this.listQuery.start = ''
        this.listQuery.end = ''
      }
      this.getList(this.listQuery)
    },

    toConsumption(orderId) {
      // 转到开单
      console.log('消耗暂存单转至消耗开单：', orderId)
      this.$router.push({
        name: 'consumption-order',
        params: {
          type: 'orderManage',
          id: orderId
        }
      })
    },

    // - 分页
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList(this.listQuery)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList(this.listQuery)
    }
  }
}
</script>

<style lang="scss" scoped>
.consumption-order-manage {
  .input-160 {
    width: 160px !important;
  }
  .dateCompontent {
    width: 300px;
  }
  .filter-input {
    margin-right: 8px;
  }
  .table-wrap-ly {
    height: calc(100vh - 260px);
    flex: 1;
    transition: 0.2s;
    -webkit-transition: 0.2s;
  }
}
</style>
