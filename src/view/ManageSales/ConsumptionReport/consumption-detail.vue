<template>
  <!-- 消耗明细 -->
  <div class="app-container consumption-detail">
    <div class="filter-container">
      <el-date-picker
        v-model="date"
        type="daterange"
        class="filter-item filter-input"
        range-separator="-"
        style="width: 300px;"
        start-placeholder="查询开始日期"
        end-placeholder="查询结束日期"
        value-format="timestamp"
        @change="daterangeChange($event)"
      />
      <el-input
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item filter-input"
        clearable
        placeholder="请输入会员姓名"
      />
      <el-input
        v-model="listQuery.code"
        style="width: 150px;"
        class="filter-item filter-input"
        clearable
        placeholder="请输入会员编号"
      />
      <el-button
        type="primary"
        class="filter-item"
        icon="el-icon-search"
        @click="handleFilter"
      >查 询</el-button>
      <el-button
        type="primary"
        class="filter-item"
      >高级查询</el-button>
      <el-button
        type="primary"
        class="filter-item"
      >导 出</el-button>
    </div>

    <div class="cunsumption-table-body">
      <el-table
        ref="tableData"
        v-loading="listLoading"
        :data="tableData"
        class="consumption-out-table"
        height="100%"
        stripe
        fit
        @selection-change="handleSelectionChange"
      >
        <!-- 嵌套数据表 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.detail" class="consumption-in-table" fit>
              <el-table-column align="center" label="顾客类型">
                <template slot-scope="{row}">
                  {{ row.consume_customer_type }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="顾客姓名">
                <template slot-scope="{row}">
                  {{ row.consume_customer_name }}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" label="项目类别">
                <template slot-scope="{row}">
                  {{ row.project_class }}
                </template>
              </el-table-column>
              <el-table-column min-width="170" show-overflow-tooltip align="center" label="项目名称">
                <template slot-scope="{row}">
                  {{ row.project_name }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="单财">
                <template slot-scope="{row}">
                  {{ row.unit_price }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="消耗次数">
                <template slot-scope="{row}">
                  {{ row.quantity }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="消耗次数">
                <template slot-scope="{row}">
                  {{ row.quantity }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="剩余次数">
                <template slot-scope="{row}">
                  {{ row.remain_quantity }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="调整金额">
                <template slot-scope="{row}">
                  {{ row.adjustment_amount }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="财耗金额">
                <template slot-scope="{row}">
                  {{ row.subtotal }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="服务技师">
                <template slot-scope="{row}">
                  {{ row.staff_name }}
                </template>
              </el-table-column>
              <el-table-column min-width="120" align="center" show-overflow-tooltip label="服务技师账号">
                <template slot-scope="{row}">
                  {{ row.staff_account }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="评价状态">
                <template slot-scope="{row}">
                  {{ row.customer_shop_name }}
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="备注">
                <template slot-scope="{row}">
                  {{ row.remark }}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <!-- 主数据表 -->
        <el-table-column min-width="170" show-overflow-tooltip align="center" label="订单号">
          <template slot-scope="{row}">
            {{ row.order_no }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单类型">
          <template slot-scope="{row}">
            {{ row.status }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="会员姓名">
          <template slot-scope="{row}">
            {{ row.customer_name }}
          </template>
        </el-table-column>
        <el-table-column min-width="120" align="center" label="会员编号">
          <template slot-scope="{row}">
            {{ row.customer_no }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="管理类别">
          <template slot-scope="{row}">
            {{ row.dic_manage_cate }}
          </template>
        </el-table-column>
        <el-table-column min-width="120" align="center" label="电话号码">
          <template slot-scope="{row}">
            {{ row.customer_phone }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="顾客星级">
          <template slot-scope="{row}">
            {{ row.dic_customer_star }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="顾客属性">
          <template slot-scope="{row}">
            {{ row.dic_customer_attr }}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="120px" show-overflow-tooltip label="所属门店">
          <template slot-scope="{row}">
            {{ row.customer_shop_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作人">
          <template slot-scope="{row}">
            {{ row.operator_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="140px" label="操作时间">
          <template slot-scope="{row}">
            {{ row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="180px" label="操作">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="mini"
              @click="openDialog('writeOff', row.customer_id)"
            >冲 销</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="openDialog('resetWriteOff', row.customer_id)"
            >冲销重结</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      :current-page="listQuery.page"
      :page-sizes="[10,20,30]"
      :page-size="listQuery.page_size"
      :total="total"
      class="main-page"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog title="冲销确认" :visible.sync="dialogVisible" width="400px" :before-close="handleCancel">
      <el-form ref="formData" :model="formData">
        <el-form-item
          label="冲销原因"
          prop="reason"
          :rules="{required: true, message: '请输入原因', trigger: 'blur'}"
        >
          <el-input v-model="formData.reason" type="textarea" :rows="2" placeholder="多行输入" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取消</el-button>
        <el-button type="primary" @click="submitForm('formData')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { consume } from '@/api/ManageSales/SalesConsume'
const consumeApi = new consume()

export default {
  name: 'SalesDetail',
  components: {},
  data() {
    return {
      date: [],
      tableData: [],
      dialogVisible: false,
      dialogType: '',
      multipleSelection: [],
      total: 1,
      listQuery: {
        page: 1,
        page_size: 10,
        start: '',
        end: '',
        name: '',
        code: ''
      },
      formData: {
        type: null,
        reason: ''
      },
      spanArr: [],
      position: 0,
      listLoading: false
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    // 初始化
    loadList() {
      this.listLoading = true
      consumeApi.detail(this.listQuery).then(res => {
        const item = res.data
        console.log(res)
        this.total = parseInt(item.totalCount)
        this.tableData = item.listData
        this.listLoading = false
        this.$nextTick(_ => {
          this.$refs.tableData.doLayout()
        }) // 解决Table错位的问题
      })
    },

    // 检索
    handleFilter() {
      this.loadList()
    },

    // 弹窗
    openDialog(type, id) {
      this.dialogVisible = true
      this.dialogType = type
      this.writeOffId = id
      console.log(type, id)
    },

    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // request
          this.formData.type = this.dialogType === 'writeOff' ? 1 : 2
          consumeApi.update(this.formData, this.writeOffId)
            .then(res => {
              console.log(res)
              this.$message.success('操作成功！')
            })
          this.handleCancel()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 弹窗关闭
    handleCancel() {
      this.$refs['formData'].resetFields()
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
      this.loadList()
    },

    // 当前页
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.loadList()
    },

    // 检索日期处理
    daterangeChange(daterange) {
      if (daterange[0]) {
        this.listQuery.start = Math.floor(daterange[0] / 1000)
        this.listQuery.end = Math.floor(daterange[1] / 1000)
      } else {
        this.listQuery.start = ''
        this.listQuery.end = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.consumption-detail {
  .filter-container {
    .filter-input {
      margin-right: 10px;
    }
  }
  .cunsumption-table-body {
    height: calc(100vh - 260px);
  }
  .consumption-out-table {
    border: 1px solid #dde1e7;
    border-bottom: 0;
  }
}
.consumption-detail >>> .el-table__expanded-cell{
  padding: 0;
  // padding-bottom: 10px;
}
.consumption-detail >>> .el-table__expanded-cell th,
.consumption-detail >>> .el-table__expanded-cell tr{
  background-color: #f5f1ff;
}
</style>
