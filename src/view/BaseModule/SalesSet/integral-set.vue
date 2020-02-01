<template>
  <el-container class="m-container">
    <el-header class="m-header">
      <el-row class="m-row">
        <div>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-plus"
            @click="openDialog('created')"
          >新增</el-button>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-delete"
            @click="openDialog('delete')"
          >删除</el-button>
        </div>
        <el-radio-group v-model="listQuery.status" class="m-row-item" @change="changeStatus">
          <el-radio-button :label="1">正常</el-radio-button>
          <el-radio-button :label="0">失效</el-radio-button>
        </el-radio-group>
      </el-row>
    </el-header>

    <el-main>
      <el-table
        ref="tableList"
        :data="tableList"
        highlight-current-row
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="50" type="selection" />
        <el-table-column align="center" prop="dic_star" label="星级" />
        <el-table-column align="center" prop="type" label="类型" />
        <el-table-column align="center" prop="commission_level" label="分佣层级" />
        <el-table-column align="center" prop="birthday_multiple" label="生日倍数" />
        <el-table-column min-width="120" align="center" prop="star_multiple" label="星权日倍数" />
        <el-table-column align="center" prop="integral_fixed" label="固定积分" />
        <el-table-column align="center" prop="integral_rate" label="积分比例" />
        <el-table-column min-width="150" align="center" label="活动生效开始时间">
          <template slot-scope="{row}">{{ row.effective_start_at | formatDate }}</template>
        </el-table-column>
        <el-table-column min-width="150" align="center" label="活动生效结束时间">
          <template slot-scope="{row}">{{ row.effective_end_at | formatDate }}</template>
        </el-table-column>
        <el-table-column min-width="120" align="center" prop="staff.name" label="操作人" />
        <el-table-column min-width="150" align="center" label="操作时间">
          <template slot-scope="{row}">{{ row.updated_at | formatDate }}</template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态" />
        <el-table-column width="120" align="center" label="操作" fixed="right">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="small"
              :disabled="listQuery.status === 0 ? true : false"
              @click="openDialog('redact', row.id)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-footer class="m-footer">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[5,16]"
        :page-size="listQuery.page_size"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>

    <IntegralDialog
      v-model="dialogVisible"
      :dialog-type="dialogType"
      :dic-customer-star="dicCustomerStar"
      :integral-type="integralType"
      :commission-level="commissionLevel"
      :integral-status="integralStatus"
      :edit-back="editBack"
      :row-id="rowId"
      @on-success="changeStatus($event)"
      @on-close="dialogClose"
    />
  </el-container>
</template>

<script>
import IntegralDialog from './integral-set/integralDialog'
import {
  getIntegralSet,
  getIntegralGcreate,
  getIntegralGupdate,
  deleteIntegral
} from '@/api/BaseModule/SalesSet'
import dateFormat from '@/component/DateFilter/date'

export default {
  name: 'IntegralSet',
  components: {
    IntegralDialog
  },
  filters: {
    // 时间
    formatDate(time) {
      const date = new Date(time)
      return dateFormat.formatDate(date, 'yyyy-MM-dd')
    }
  },
  data() {
    return {
      total: 1,
      tableList: [],
      dialogVisible: false,
      dialogType: '',
      multipleSelection: [],
      listQuery: {
        page: 0,
        page_size: 5,
        status: 1
      },
      dicCustomerStar: [], // 星级
      integralType: [], // 类型
      commissionLevel: [], // 分佣层级
      integralStatus: [], // 状态
      editBack: {}, // 编辑回显
      rowId: '' // 每一行id
    }
  },
  watch: {
    tableList(val) {
      if (val && val.length > 0) {
        val.forEach(item => {
          item.effective_end_at =
            item.effective_end_at.length <= 10
              ? item.effective_end_at * 1000
              : item.effective_end_at
          item.effective_start_at =
            item.effective_start_at.length <= 10
              ? item.effective_start_at * 1000
              : item.effective_start_at
          item.updated_at =
            item.updated_at.length <= 10
              ? item.updated_at * 1000
              : item.updated_at
        })
      }
    }
  },
  created() {
    this.loadSet()
    this.loadList()
  },
  methods: {
    // 加载配置项
    loadSet() {
      getIntegralGcreate().then(res => {
        console.log(res)
        this.dicCustomerStar = res.data.dic.dic_customer_star
        this.integralType = res.data.integralType
        this.commissionLevel = res.data.commissionLevel
        this.integralStatus = res.data.integralStatus
      })
    },

    // 初始化
    loadList() {
      getIntegralSet(this.listQuery).then(res => {
        console.log(res)
        const arr = JSON.parse(JSON.stringify(res))
        this.total = parseInt(arr.data.count)
        this.tableList = arr.data.list
      })
    },

    // 切换状态
    changeStatus(val) {
      this.listQuery.status = val
      this.loadList()
    },

    // 编辑回显
    getGupdate(id) {
      return new Promise((resolve, reject) => {
        getIntegralGupdate(id).then(res => {
          if (res.data.detail) {
            console.log(res)
            this.editBack = JSON.parse(JSON.stringify(res.data.detail))
            this.rowId = id
            resolve()
          }
          this.dialogVisible = true
          this.dialogType = 'redact'
        })
      })
    },

    // 批量删除
    deleteBatch() {
      this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let arr = []
          if (this.listQuery.status === 1) {
            const date = new Date()
            const str = this.multipleSelection.filter(item => item.effective_start_at < date.getTime())
            if (str.length > 0) {
              this.$message.warning('只能删除还未到生效日期的数据')
              return false
            } else {
              this.multipleSelection.forEach(item => {
                if (item.effective_start_at > date.getTime()) {
                  arr.push(item.id)
                }
              })
            }
          } else {
            this.multipleSelection.forEach(item => {
              arr.push(item.id)
            })
          }
          console.log(arr)
          deleteIntegral({ id: arr }).then(res => {
            arr = []
            this.$message.success('删除成功!')
            this.changeStatus(this.listQuery.status)
          })
        })
        .catch(() => {})
    },

    // 弹窗
    openDialog(type, id) {
      switch (type) {
        case 'created':
          this.dialogVisible = true
          this.dialogType = 'created'
          break
        case 'redact':
          this.getGupdate(id)
          break
        case 'delete':
          if (this.multipleSelection.length <= 0) {
            this.$message.warning('请至少选中一条')
            return false
          }
          this.deleteBatch()
          break
      }
    },

    // 弹窗关闭
    dialogClose() {
      this.dialogVisible = false
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(val)
    },

    // 页数
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.changeStatus(this.listQuery.status)
    },

    // 当前页
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.changeStatus(this.listQuery.status)
    }
  }
}
</script>

<style lang="scss" scoped>
.m-header {
  padding: 12px 20px 12px;
  border-bottom: 1px solid #ebeef5;

  .m-row {
    display: flex;
    align-items: center;

    .m-row-item {
      margin-left: 20px;
    }
  }
}
.m-footer {
  display: flex;
  // justify-content: center;
}
</style>
