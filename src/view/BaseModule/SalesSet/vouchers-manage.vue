<template>
  <div class="manage-center">
    <div class="manage-body">
      <transition name="bounce">
        <div v-if="show" class="manage-left">
          <structure :snyc-get.sync="getList" />
        </div>
      </transition>
      <div class="manahe-button">
        <el-button
          class="manage-button-1"
          :class="!show ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
          @click="show = !show"
        />
      </div>
      <!-- lefe -->
      <div class="manage-right">
        <div class="manage-right-top">
          <el-container>
            <div class="filter-container">
              <el-input
                v-model="listQuery.title"
                placeholder="请输入券名称"
                class="filter-item"
                style="width: 140px;"
                clearable
                size="mini"
              />
              <el-select v-model="getList.type" class="filter-item" placeholder="请选择券来源" clearable style="width: 140px" size="mini">
                <el-option
                  v-for="item in stautsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="getList.coupon_class"
                placeholder="请选择券种类"
                clearable
                style="width: 140px"
                class="filter-item"
                size="mini"
              >
                <el-option
                  v-for="item in CouponType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="getList.is_overdue"
                placeholder="请选择状态"
                clearable
                style="width: 140px"
                class="filter-item"
                size="mini"
              >
                <el-option
                  v-for="item in CouponState"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
              <el-date-picker
                v-model="listQuery.date"
                type="daterange"
                class="filter-item"
                range-separator="-"
                start-placeholder="选择创建时间段"
                end-placeholder="选择创建时间段"
                style="width:300px;margin-right:10px"
                size="mini"
                format="yyyy - MM - dd "
                value-format="timestamp"
              />
              <el-button type="primary" class="filter-item" size="mini" @click="vmGet()">查 询</el-button>
              <el-button type="primary" class="filter-item" size="mini">批量修改</el-button>
              <el-button type="primary" class="filter-item" size="mini">高级查询</el-button>
              <el-button type="primary" class="filter-item" size="mini" @click="VouManAdd()">新 建</el-button>
              <el-button type="primary" class="filter-item" size="mini">导 入</el-button>
              <el-button type="primary" class="filter-item" size="mini">导 出</el-button>
            </div>
          </el-container>
        </div>
        <div class="manage-right-table">
          <div class="manage-right-table-center">
            <el-table
              ref="multipleTable"
              border
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column align="center" type="selection" width="55" />
              <el-table-column align="center" prop="code" show-overflow-tooltip label="券编码" min-width="120" />
              <el-table-column align="center" prop="name" show-overflow-tooltip label="券名称" min-width="120" />
              <el-table-column align="center" label="券来源">
                <template slot-scope="scope">
                  <span v-if="scope.row.type==0">礼券</span>
                  <span v-if="scope.row.type==1">活动赠送</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="coupon_class_name" label="券种类"/>
              <el-table-column align="center" label="抵扣方式" min-width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.deduction_method==0">少补多不退</span>
                  <span v-if="scope.row.deduction_method==1">累计使用</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="activity_file_num" show-overflow-tooltip min-width="120" label="活动文件号" />
              <el-table-column align="center" prop="total_num" label="总张数" />
              <el-table-column align="center" prop="start_send_at" label="赠送开始日期" min-width="120" />
              <el-table-column align="center" prop="end_send_at" label="赠送结束日期" min-width="120" />
              <el-table-column align="center" label="失效方式">
                <template slot-scope="scope">
                  <span v-if="scope.row.failure_mode==0">周期</span>
                  <span v-if="scope.row.failure_mode==1">时间段</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="effective_day" label="有效天数" />
              <el-table-column align="center" prop="start_use_at" label="使用开始时间" min-width="120" />
              <el-table-column align="center" prop="end_use_at" label="使用截止时间" min-width="120" />
              <el-table-column align="center" prop="amount" label="面额" />
              <el-table-column align="center" prop="operator_name" label="操作人" min-width="100" />
              <el-table-column align="center" prop="created_at" label="操作时间" min-width="120" />

              <el-table-column align="center" label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index,scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="manage-right-table-pag">
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :page-size="pagesize"
            background
            @current-change="current_change"
          />
        </div>
      </div>
    </div>
    <!--  -->
    <div class="Introduce">
      <!-- 新增 修改-->
      <vmadd ref="alter" :snyc-test.sync="dialogVisible" />
    </div>
  </div>
</template>
<script>
import Structure from '@/view/BaseModule/SalesSet/component/vm-structure.vue'
import Pagination from '@/component/Pagination/index'
import { CouponData, vmDelete, vmgGcreate } from '@/api/BaseModule/SalesSet'
import Vmadd from '@/view/BaseModule/SalesSet/component/vouchers-manage-add.vue'

export default {
  name: 'VouchersManage',
  components: {
    Structure,
    Pagination,
    Vmadd
  },
  data() {
    return {
      show: true,
      dialogVisible: false,
      getList: {
        is_overdue: 0,
        shop_id_arr: [],
        name: '',
        type: '',
        coupon_class: '',
        is_overdue: '',
        created_at_start: '',
        created_at_end: '',
        page: 1,
        page_size: 10
      },
      listQuery: {
        date: ''
      },
      stautsOptions: [
        // { name: "礼券", value: 0 },
        // { name: "活动赠券", value: 1 }
      ],
      CouponType: [
        // { name: "全部", value: 0 },
        // { name: "项目券", value: 1 },
        // { name: "通用券", value: 2 },
        // { name: "现金卷", value: 3 },
        // { name: "嘉宾卷", value: 4 },
        // { name: "蝶变券", value: 5 }
      ],
      CouponState: [{ name: '未过期', value: 0 }, { name: '已过期', value: 1 }],
      tableData: [],
      multipleSelection: [],
      total: 1,
      pagesize: 10, // 每页的数据条数
      currentPage: 1 // 默认开始页面
    }
  },
  created() {
    this.vmGet()
    this.vmgdataGet()
  },
  methods: {
    vmGet() {
      if (this.listQuery.date.length > 0) {
        const dataS = JSON.parse(JSON.stringify(this.listQuery.date))
        this.getList.created_at_start = Math.round(dataS[0] / 1000)
        this.getList.created_at_end = Math.round(dataS[0] / 1000)
      }
      if (this.getList.shop_id_arr.length == 0) {
        this.tableData = []
        return false
      } else {
        CouponData(this.getList).then(res => {
          this.tableData = res.data.list
          console.log(this.tableData)
          this.tableData.forEach((item, i) => {
            if (item.start_send_at == '0') {
              item.start_send_at = '无'
            } else {
              item.start_send_at = this.dateInit(item.start_send_at)
            }
            if (item.end_send_at == '0') {
              item.end_send_at = '无'
            } else {
              item.end_send_at = this.dateInit(item.end_send_at)
            }
            if (item.strat_use_at == '0') {
              item.start_use_at = '无'
            } else {
              item.start_use_at = this.dateInit(item.start_use_at)
            }
            if (item.end_use_at == '0') {
              item.end_use_at = '无'
            } else {
              item.end_use_at = this.dateInit(item.end_use_at)
            }
            item.created_at = this.dateInit(item.created_at)
          })
          this.total = Number(res.data.count)
          this.currentPage = 1
        })
      }
    },
    // 时间格式
    dateInit(data) {
      const date = new Date(parseInt(data) * 1000)
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let minute = date.getMinutes()
      let second = date.getSeconds()
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second
      const listdate = y + '-' + m + '-' + d
      return listdate
    },
    vmgdataGet() {
      vmgGcreate().then(res => {
        const data = res.data.dic
        this.stautsOptions = data.type
        this.CouponType = data.coupon_class
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    VouManAdd() {
      this.dialogVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('确认删除？')
        .then(_ => {
          const data = { id: row.id }
          // console.log(55)
          vmDelete(data).then(res => {
            const code = res.code
            console.log(code)
            if (code == 200) {
              this.tableData.forEach((item, i) => {
                if (item.id === row.id) {
                  this.tableData.splice(i, 1)
                  this.$message({
                    message: '成功',
                    type: 'success'
                  })
                }
              })
            }
          })
        })
        .catch(_ => {})
    },
    handleEdit(index, row) {
      const indexs = index
      const rows = row
      this.$refs.alter.datainits(indexs, rows)
      this.VouManAdd()
    },
    // 分页
    current_change(currentPage) {
      this.getList.page = currentPage
      this.vmGet()
      // console.log(currentPage);
    }
  }
}
</script>
<style scoped lang="scss">
.manage-center {
  height: 100%;
  box-sizing: border-box;
  .manage-body {
    height: 97%;
    display: flex;
    .manage-left {
      height: 100%;
      width: 292px;
      // padding: 10px;
      box-align: border-box;
      border: 1px solid #dcdfe6;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0 10px 10px;
      overflow: hidden;
      .structure-wrap {
        height: 100%;
      }
    }
    .manahe-button {
      height: 100%;
      position: relative;
      width: 15px;
      .manage-button-1 {
        width: 15px;
        font-size: 12px;
        position: absolute;
        top: 50%;
        border-left: 0;
        border-radius: 0 5px 5px 0;
        margin: 0;
        padding: 0;
        height: 40px;
        background: #f8f7fa;
      }
    }
    .manage-right {
      height: 100%;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      border-radius: 4px;
      overflow: hidden;
      position: relative;

      .manage-right-table {
        height: 62vh;
        position: relative;
        overflow: auto;
        padding-bottom: 30px;
        .manage-right-table-center {
          height: calc(100%-30px);
        }
      }
      .manage-right-table-pag {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 10px;
        background: #fff;
        height: 35px;
        z-index: 100;
      }
    }
  }
}
// 动画
.bounce-enter-active {
  animation: bounce-in 0.2s;
}
.bounce-leave-active {
  animation: bounce-in 0.2s reverse;
}

@keyframes bounce-in {
  0% {
    width: 0px;
  }

  100% {
    width: 290px;
  }
}
</style>
<style>
#app .main-container,
.app-main {
  height: 100%;
}
#app .manage-center .structure-body {
  width: 100% !important;
}
</style>
