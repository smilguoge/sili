<template>
  <!-- 活动套餐设置 -->
  <div class="m-container app-container activity-set">
    <div class=" filter-container m-filter">
      <el-form ref="filterForm" :model="listQuery" :inline="true" class="search-form">
        <el-form-item prop="title">
          <el-input v-model="listQuery.title" clearable placeholder="请输入活动名称" style="width:150px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="listQuery.status" clearable style="width:120px;" placeholder="请选择状态" class="filter-item">
            <el-option v-for="item in stautsOptions" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="date">
          <el-date-picker
            v-model="listQuery.date"
            class="filter-item"
            style="width:310px;"
            type="daterange"
            range-separator="-"
            start-placeholder="请选择创建时间段"
            end-placeholder="请选择创建时间段"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="handleFilter">查 询</el-button>
          <el-button class="filter-item" @click="resetFilter('filterForm')">重 置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="filter-item" type="primary" @click="handleCreate">新 建</el-button>
      <el-button class="filter-item" type="primary">导 出</el-button>
      <el-button class="filter-item" type="primary">导 入</el-button>
    </div>

    <!-- <el-header class="m-header">
    <el-row>
        <el-col :span="20">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate()">新建</el-button>
          <exportexcel
            :datakey="datakey"
            :title="title"
            :export-data="list"
          />
          <el-button type="primary" icon="el-icon-upload2" @click="importExcel()">导入</el-button>
        </el-col>
      </el-row> -->
    <!-- </el-header> -->

    <div
      :style="{width: drawerFlag ? 'calc(100% - 1040px)' : '100%'}"
      class="m-content"
    >
      <div class="m-table">
        <el-table
          ref="singleTable"
          v-loading="listLoading"
          :data="list"
          fit
          highlight-current-row
          width="100%"
          height="100%"
        >
          <el-table-column label="活动名称" align="center" min-width="150">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="促销活动" align="center" min-width="150">
            <template slot-scope="{row}">
              <span>{{ row.promotion }}</span>
            </template>
          </el-table-column>

          <el-table-column label="活动文件号" align="center" min-width="130">
            <template slot-scope="{row}">
              <span>{{ row.filecode }}</span>
            </template>
          </el-table-column>

          <el-table-column label="活动编码" align="center" min-width="140">
            <template slot-scope="{row}">
              <span>{{ row.code }}</span>
            </template>
          </el-table-column>

          <el-table-column label="赠送积分" align="center">
            <template slot-scope="{row}">
              <span>{{ row.send_integral }}</span>
            </template>
          </el-table-column>

          <el-table-column label="是否折上折" align="center" min-width="90">
            <template slot-scope="{row}">
              <span>{{ row.is_more_discount?'是':'否' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" align="center">
            <template slot-scope="{row}">
              <el-tag :type="row.is_expire?'danger':'success'">{{ row.is_expire?'过期':'正常' }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="适用顾客属性" align="center" min-width="116">
            <template slot-scope="{row}">
              <span>{{ row.customer_attr }}</span>
            </template>
          </el-table-column>

          <el-table-column label="开始日期" align="center" min-width="100">
            <template slot-scope="{row}">
              <span>{{ handleTime(row.start_at) | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="结束日期" align="center" min-width="100">
            <template slot-scope="{row}">
              <span>{{ handleTime(row.end_at) | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="适用门店" align="center">
            <template slot-scope="{row}">
              <span>{{ row.chose_shop?'全部':'指定' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作人" align="center" min-width="90">
            <template slot-scope="{row}">
              <span>{{ row.operator }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作时间" align="center" min-width="140">
            <template slot-scope="{row}">
              <span>{{ handleTime(row.updated_at) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" fixed="right" width="150">
            <template slot-scope="{row}">
              <el-button type="primary" size="small" @click="handleEdit(row.id)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="total>0" class="m-footer">
        <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30]" :page-size="listQuery.page_size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- right -->
    <drawerBox
      ref="drawerBox"
      v-model="baseData"
      :option-promotion="arrPromotion"
      :option-discount="arrDiscount"
      :option-card="arrCard"
      :type="drawerType"
      :style="{right: drawerFlag ? '0' : '-1040px'}"
      class="m-drawer"
      @create="handleSave($event)"
      @update="handleUpdate($event)"
      @close="closeDrawer"
    />

  </div>
</template>

<script>
import { ActivityBase } from '@/api/BaseModule/SalesSet'
const baseApi = new ActivityBase()
// import exportexcel from '@/component/ExportExcel/index'
import drawerBox from './activity-set/drawer-box'

export default {
  name: 'ActivityTable',
  components: {
    // exportexcel,
    drawerBox
  },
  data() {
    return {
      listLoading: false,
      list: null,
      baseData: {},
      total: null,
      listQuery: {
        page: 1,
        page_size: 20,
        title: '',
        status: '',
        date: ''
      },
      drawerType: '',
      arrPromotion: [],
      arrDiscount: [],
      arrCard: [],
      stautsOptions: [{ name: '过期', value: 0 }, { name: '正常', value: 1 }],

      // FIXME: 导出(待定)
      // title: ['项目类别', '项目编号', '项目名称', '销售价格', '状态', '操作人', '操作时间'],
      // datakey: ['itemid', 'itemid', 'unit', 'price', 'status', 'username', 'timestamp'],

      drawerFlag: false
    }
  },
  created() {
    this.getList(this.listQuery)
  },
  methods: {
    getList(params) {
      this.listLoading = true
      baseApi.list(params)
        .then(res => {
          const item = res.data
          this.list = item.arrLog
          this.total = parseInt(item.totalnum)
          this.listLoading = false
        })
        .catch(res => {
          console.log(res)
          this.listLoading = false
        })
    },
    handleFilter() {
      // this.getList(this.listQuery)
      this.$message.warning('功能正在开发')
    },
    resetFilter(formName) {
      this.$refs[formName].resetFields()
    },
    handleCreate() {
      // 新增
      this.listLoading = true
      baseApi.gcreate()
        .then(res => {
          const item = res.data
          this.arrPromotion = item.arrPromotion
          this.arrDiscount = item.arrDiscount
          this.arrCard = item.arrCard
          this.drawerType = 'create'
          this.listLoading = false
          this.drawerFlag = true
        })
    },
    handleEdit(id) {
      // 编辑
      if (this.drawerFlag) {
        this.$message.warning('请关闭当前编辑页再进行操作')
        return
      }
      this.listLoading = true
      baseApi.gupdate({ id: id })
        .then(res => {
          this.$refs.drawerBox.setId(id)
          const item = res.data
          this.drawerType = 'edit'
          this.arrPromotion = item.arrPromotion
          this.arrDiscount = item.arrDiscount
          this.arrCard = item.arrCard
          this.baseData = item
          this.baseData.start_time = item.start_at * 1000
          this.baseData.end_time = item.end_at * 1000
          this.drawerFlag = true
          this.listLoading = false
        })
        .catch(res => {
          this.$message.warning('数据请求失败')
          this.listLoading = false
        })
    },
    handleDelete(id) {
      if (this.drawerFlag) {
        this.$message.warning('请先关闭详情视图再进行操作')
        return
      }
      // TODO: 判断是否可以删除
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // request
          baseApi.delete(id)
            .then(res => {
              console.log(res)
              this.$message.success('删除成功!')
            })
            .catch(res => {
              console.log(res)
            })
        })
        .catch(() => {})
    },
    handleSave(data) {
      // 新建提交
      console.log('create', data)
      switch (data.type) {
        case 'base':
          // 基础信息提交
          baseApi.create(data.data)
            .then(res => {
              console.log('新建', res)
              this.getList(this.listQuery)
              this.$refs['drawerBox'].cardPackage(res.data.id) // 传新建基础信息返回活动套餐主表id
              // this.$refs['drawerBox'].formactive = 'second'
            })
            .catch(res => {
              console.log('新建 ERR', res)
            })
          break
        default :
          console.log('参数错误')
          break
      }
    },
    handleUpdate(data) {
      // 修改提交
      console.log('update', data)
      switch (data.type) {
        case 'base':
          // 基础信息提交
          baseApi.update(data.params)
            .then(res => {
              console.log('更新', res)
              this.getList(this.listQuery)
              this.$refs['drawerBox'].formactive = 'second'
            })
            .catch(res => {
              console.log('更新 ERR', res)
            })
          break
        default :
          console.log('参数错误')
          break
      }
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList(this.listQuery)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList(this.listQuery)
    },
    handleTime(val) {
      // 处理时间戳
      if ((val + '').length < 13) {
        return parseInt(val * 1000)
      } else {
        return parseInt(val)
      }
    },
    importExcel() {
      // 导入
    },
    closeDrawer() {
      // 关闭抽屉
      this.drawerFlag = false
    }
  }
}
</script>
<style>
  .new-float-left {
    width:48%;
    float: left;
    margin-right: 1%;
    display: block
  }
</style>
<style lang='css' scoped>
.line {
  text-align: center;
}
.m-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.m-filter {
  overflow: hidden;
}
.m-filter .el-form-item {
  margin-bottom:0
}
.m-footer {
  padding: 20px 0;
}
.m-content {
  width: 100%;
  flex: 1;
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
.m-table{
  height: calc(100vh - 290px);
  width:100%
}
.m-drawer {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  /* width: 70%; */
  width: 1040px;
  height: 100%;
  overflow-y: scroll;
  background-color: #fff;
  transition: 0.5s;
  -webkit-transition: 0.5s;
}
</style>
