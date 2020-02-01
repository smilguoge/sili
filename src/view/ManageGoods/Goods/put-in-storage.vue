<template>
  <div class="app-container">
    <div class="psty1">
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >新增</el-button>
    </div>
    <div class="filter-container flex">
      <div class="spstyd5">
        <span>单据号：</span>
        <el-input v-model="listQuery.document_no" placeholder="请输入单据号" style="width:90px" />
      </div>
      <div class="spstyp1">
        <span>日期：</span>
        <el-date-picker v-model="start_time" type="date" placeholder="选择日期" size="small" value-format="timestamp" style="width:140px" />
        <b>-</b>
        <el-date-picker v-model="end_time" type="date" placeholder="选择日期" value-format="timestamp" style="width:140px" />
      </div>
      <div class="spsty2">
        <span>入库类型：</span>
        <el-select
          v-model="listQuery.stock_type"
          placeholder="入库类型"
          clearable
          class="filter-item"
          style="width: 100px"
        >
          <el-option v-for="item in stock_list" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </div>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-radio-group v-model="listQuery.status" class="spsty3" @change="handleFilter">
        <el-radio-button v-for="item of statusOptions" :key="item.id" :label="item.id">{{ item.name }}</el-radio-button>
      </el-radio-group>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;"
      :default-sort="{prop: 'updated_at', order: 'descending'}"
    >
      <el-table-column label="单据号" align="center" width="150" sortable prop="document_no">
        <template slot-scope="scope">
          <span class="spsty4" @click="handleUpdate(scope.row)">{{ scope.row.document_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店名称" align="center" width="165" prop="shop_name">
        <template slot-scope="scope">
          <span>{{ scope.row.shop_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对方门店 " align="center" width="165" prop="out_stock_shop">
        <template slot-scope="scope">
          <span>{{ scope.row.out_stock_shop }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库类型" align="center" width="180" prop="stock_type">
        <template slot-scope="scope">
          <span>{{ scope.row.stock_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" width="120" prop="operator">
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" width="160" sortable prop="updated_at">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" width="200" prop="remark">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button v-show="scope.row.bCanUpdate" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-show="scope.row.bCanDelete" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />
    <product-drawer
      v-model="drawerVisible"
      :style="{left: '22%'}"
      :get-data="changeData"
      :stocklist="stock_list"
      :dialogstatus="dialogStatus"
      :putid="putid"
      :b-can-update="bCanUpdate"
      class="m-drawer"
      @save="handleSave($event)"
      @clear="drawerClear"
      @close="closeDrawer"
    />
    <div id="tanc">
      <GuoDrawerReturn v-if="show_tanc==1" @hide="hide" />
      <GuoDrawerShopGoods v-else-if="show_tanc==2" @hide="hide" />
    </div>
  </div>
</template>

<script>
import productDrawer from './component/storageDialog'
import GuoDrawerReturn from './component/guoDrawerReturn'
import GuoDrawerShopGoods from './component/guoDrawerShopGoods'
// import productDrawer from './projectDrawer'
import { stockList, createStock, deleteStock, getStocylist, stockCancel, stockCheck, getNewStock } from '@/api/ManageGoods/PutInStorage'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PanThumb from '@/components/PanThumb'
const statusOptions = [
  { id: 1, name: '未完成' },
  { id: 2, name: '已完成' },
  { id: 3, name: '全部' }
]
export default {
  name: 'InStock',
  components: { PanThumb, Pagination, productDrawer, GuoDrawerReturn, GuoDrawerShopGoods },
  directives: { waves },
  data() {
    return {
      bCanUpdate: false,
      putid: 0,
      tableKey: 0,
      start_time: '',
      end_time: '',
      list: [],
      total: 0,
      listLoading: true,
      stock_list: null,
      listQuery: {
        page: 1,
        start_time: '',
        end_time: '',
        stock_type: '',
        page_size: 20,
        status: 1,
        document_no: ''
      },
      statusOptions,
      temp: {
        version: '',
        os: '',
        path: ''
      },
      dialogFormVisible: false,
      dialogEsc: false,
      dialogStatus: '',
      textMap: {
        update: '编辑入库',
        create: '添加入库'
      },
      changeData: {},
      drawerVisible: false,
      rules: {
      },
      // guo弹窗
      show_tanc: null
    }
  },
  created() {
    this.getList()
    // this.getStocylist()
  },

  methods: {
    closeDrawer() {
      // 关闭抽屉
      this.drawerFlag = false
    },
    handleEnd(row) {
      if (row.status !== 2) {
        stockCheck(row.id).then(response => {
          this.$message({
            message: '撤销成功',
            type: 'success' })
        })
      } else if (row.status == 2) {
        this.$message.error('已经确定收货了！')
      }
    },
    close() {
      this.imagecropperShow = false
    },
    getList() {
      this.listLoading = true
      this.listQuery.start_time = this.start_time / 1000
      if (this.end_time / 1000) {
        this.listQuery.end_time = (this.end_time / 1000) + 86400
      } else {
        this.listQuery.end_time = (this.end_time / 1000)
      }
      stockList(this.listQuery).then(response => {
        this.list = response.data.arrLog
        this.total = parseInt(response.data.totalnum)
        this.stock_list = response.data.arrType
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    drawerClear() {
      this.drawerVisible = false
      this.dialogType = ''
      this.changeData = {}
    },
    changeMark(val) {
      // - 切换遮罩状态
      this.drawerVisible = val
    },
    handleFilter() {
      this.listQuery.page = 1
      console.log(this.listQuery)
      this.getList()
    },
    handleModifyStatus(row, status) {
      row.status = status
      createStock(row).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
        row.status_name = response.data.status_name
      })
    },
    resetTemp() {
      this.temp = {
        version: '',
        os: '',
        path: ''
      }
    },
    handleCreate() {
      this.bCanUpdate = true
      getNewStock().then(response => {
        this.putid = 0
        this.drawerVisible = true
        this.dialogStatus = 'create'
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }, reject => {
      })
    },
    handleUpdate(row) {
      // 郭龙辉 修改后
      if (row.stock_type == '返库入库') {
        this.show_tanc = 1
        console.log('返库入库')
      } else if (row.stock_type == '铺货入库') {
        console.log('铺货入库')
        this.show_tanc = 2
      } else {
        this.putid = row.id
        this.drawerVisible = true
        this.dialogStatus = 'update'
      }
      if (row.bCanUpdate) {
        this.bCanUpdate = true
      } else {
        this.bCanUpdate = false
      }
      console.log(row, 999)
      console.log('dddddd')

      // 郭葛军 修改前
      // this.putid = row.id
      // this.drawerVisible = true
      // this.dialogStatus = 'update'
    },
    handleSave(obj) {
      // 时间戳处理
      if ((this.changeData.effect_time + '').length > 10) {
        this.changeData.effect_time = Math.floor(
          this.changeData.effect_time / 1000
        )
      }
      if (!parseInt(this.changeData.points)) {
        this.changeData.points = 0
      }
      console.log(obj)
      if (this.dialogType === 'create') {
        dataApi.create(obj).then(res => {
          this.getList(this.listQuery)
          this.drawerClear()
          return
        })
      } else {
        dataApi.update(obj, this.editId).then(res => {
          this.getList(this.listQuery)
          this.drawerClear()
          return
        })
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createStock(this.temp).then(response => {
            const addversion = response.data
            addversion.version = this.temp.version
            this.list.unshift(addversion)
            this.dialogFormVisible = false
            this.$message({
              title: '成功',
              message: '创建成功',
              type: 'success'

            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteStock(row.id).then(() => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.getList()
          })
        })
        .catch(() => {})
    },
    // 隐藏tanc组件
    hide() {
      this.show_tanc = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-tagbox.el-tag {
  margin-left: 10px;
}
.spstyd5{margin-right: 10px;font-size: 14px;}
.filter-container span,.spsty2 span{font-size: 14px;}
.flex{
  display: flex;
  align-items:center;
}
.spstyp1 >>> .el-date-editor.el-input{
  width: 120px;
  padding-right: 15px;
}
.spstyp1 >>> .el-date-editor.el-input{
  width: 120px;
}
.spstyp1{
  margin-top: -5px;
}
.spstyd5{
  margin-top: -5px;
}
.spsty2{
  margin-left: 5px;
  margin-right: 25px;
}
.spsty3{
  margin-left: 25px;
  margin-top: -10px;
}
.psty1{
    margin-bottom: 12px;
    margin-top: 20px;
}
.filter-container{
  margin-bottom: 5px;
}
.spsty2 .filter-container .filter-item{
  margin-bottom: 0;
}
.spsty1{
  align-self: baseline;
}
.spsty2 span{vertical-align: 4px;}
.spsty4{
  color: #895DFE;
}
#tanc{
  width: 50%;
	background: #22d8d4;
}
</style>
<style>
#tanc .el-dialog__wrapper{
  left:30%;
  width: 70%;
}
</style>
