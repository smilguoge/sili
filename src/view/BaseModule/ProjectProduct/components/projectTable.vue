<template>
  <!-- <div class="app-container"> -->
  <div class="m-container">
    <!-- Filter -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search-form">
        <el-form-item>
          <el-input
            v-model="listQuery.name"
            style="width: 180px;"
            placeholder="请输入项目名称"
            prefix-icon="el-icon-search"
            class="filter-item"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="listQuery.code"
            style="width: 180px;"
            placeholder="请输入项目编码"
            prefix-icon="el-icon-search"
            class="filter-item"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >查 询</el-button>
        </el-form-item>
      </el-form>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >新建</el-button>
      <el-button
        disabled
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-upload2"
      >导出</el-button>
      <el-radio-group
        v-model="radio"
        style="margin-left:20px;vertical-align:top;"
        @change="handleRadioChange"
      >
        <el-radio-button :label="-1">全部</el-radio-button>
        <el-radio-button :label="1">正常</el-radio-button>
        <el-radio-button :label="0">停用</el-radio-button>
      </el-radio-group>
    </div>
    <!-- Table -->
    <div class="table-wrap-ly" :style="{width:drawerVisible?'50%':'100%'}">
      <el-table
        v-loading="listLoading"
        height="100%"
        class="table-body-ly"
        highlight-current-row
        style="width:100%;"
        :data="list"
        border
        fit
      >
        <el-table-column label="项目类别" fixed="left" align="center" min-width="100px">
          <template slot-scope="{row}">
            <span>{{ row.projectClass.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目编号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" align="center" min-width="120px">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售价格" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sell_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag
              :type="row.status== 1?'success':'danger'"
              close-transition
            >{{ row.status==1?'正常':'停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.operator_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center" min-width="130px">
          <template slot-scope="{row}">
            <span>{{ row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="220"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button size="mini" type="warning" @click="handleView(row.id)">查看</el-button>
            <el-button size="mini" type="primary" @click="handleUpdate(row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row.id)">删除</el-button>
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

    <project-drawer
      ref="projectDrawer"
      v-model="drawerVisible"
      :get-data="changeData"
      :income="treeData"
      :is-view="isView"
      @save="handleSave($event)"
      @clear="drawerClear"
    />
    <div v-show="maskVisible" class="mask" />
  </div>
</template>

<script>
import projectDrawer from './projectDrawer'
import { projectData } from '@/api/BaseModule/ProjectProduct'
const dataApi = new projectData()

export default {
  name: 'InlineEditTable',
  components: { projectDrawer },
  props: {
    income: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      list: [],
      changeData: {},
      defaultData: {
        status: '1'
      },
      radio: -1,

      treeData: [], // 产品分类数据

      total: null,
      listQuery: {
        page: 1,
        page_size: 10,
        name: '',
        code: ''
      },

      isView: false,
      dialogType: '',
      drawerVisible: false,
      maskVisible: false,
      listLoading: false,
      editId: null
    }
  },
  watch: {
    income(data) {
      this.treeData = data // 产品类别树
      // console.log('father', this.treeData)
    }
  },
  created() {
    this.getList(this.listQuery)
  },
  methods: {
    getList(params) {
      this.listLoading = true
      dataApi
        .index(params)
        .then(res => {
          const items = res.data
          if (items.projects.length != 0) {
            this.list = items.projects
            this.total = parseInt(items.total_count)
          } else {
            this.list = []
            this.$message.warning('没有更多数据')
          }
          this.listLoading = false
        })
        .catch(res => {
          this.$message.warning('数据请求失败')
          this.listLoading = false
        })
    },
    handleUpdate(id) {
      // - 修改
      if (this.isView) {
        this.$message.warning('请先关闭详情视图再进行操作')
        return
      }
      // - request
      this.listLoading = true
      // - 请求选项数据
      dataApi.view(id).then(res => {
        const items = res.data
        this.changeData = JSON.parse(JSON.stringify(items))
        this.changeData.effect_time =
          (items.effect_time + '').length > 10
            ? items.effect_time
            : items.effect_time * 1000
        this.listLoading = false
        this.editId = id
        this.dialogType = 'edit'
        this.drawerVisible = true
        this.maskVisible = true
      })
    },
    handleView(id) {
      // - 查看
      // - request
      this.listLoading = true
      // - 请求选项数据
      dataApi.view(id).then(res => {
        const items = res.data
        this.changeData = JSON.parse(JSON.stringify(items))
        this.changeData.effect_time =
          (items.effect_time + '').length > 10
            ? items.effect_time
            : items.effect_time * 1000
        this.listLoading = false
        this.editId = id
        this.dialogType = 'edit'
        this.drawerVisible = true
        this.isView = true
      })
    },
    handleCreate() {
      // - 新建
      if (this.isView) {
        this.$message.warning('请先关闭详情视图再进行操作')
        return
      }
      // - 请求选项数据
      this.drawerVisible = true
      this.maskVisible = true
      this.dialogType = 'create'
      this.changeData = JSON.parse(JSON.stringify(this.defaultData))
    },
    handleSave(obj) {
      // 时间戳处理
      if ((this.changeData.effect_time + '').length > 10) {
        this.changeData.effect_time = Math.floor(
          this.changeData.effect_time / 1000
        )
      }
      // console.log(obj);
      if (this.dialogType === 'create') {
        dataApi.create(obj).then(res => {
          this.getList(this.listQuery)
          this.$message.success(res.message)
          this.drawerClear()
          return
        })
      } else {
        dataApi.update(obj, this.editId).then(res => {
          this.getList(this.listQuery)
          this.$message.success(res.message)
          this.drawerClear()
          return
        })
      }
    },
    handleDelete(id) {
      if (this.isView) {
        this.$message.warning('请先关闭详情视图再进行操作')
        return
      }
      // - request
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          dataApi.delete(id).then(res => {
            this.getList(this.listQuery)
          })
        })
        .catch(res => {})
    },
    drawerClear() {
      this.drawerVisible = false
      this.maskVisible = false
      this.isView = false
      this.dialogType = ''
      this.changeData = {}
      // this.$refs['productDrawer'].resetForm('changeData') // FIXME: 关闭时调用子组件resetForm方法清除表单验证报错
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList(this.listQuery)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList(this.listQuery)
    },
    handleFilter() {
      this.getList(this.listQuery)
    },
    handleRadioChange(val) {
      // console.log(val);
      this.listQuery.status = val
      this.getList(this.listQuery)
    }
  }
}
</script>

<style lang="css" scope>
.m-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.mask {
  background-color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  opacity: 0.6;
  transition: 0.5s;
}
.table-wrap-ly {
  width: 100%;
  height: calc(100vh - 260px);
  flex: 1;
  transition: 0.2s;
  -webkit-transition: 0.2s;
}
.table-body-ly {
  max-height: calc(100% - 70px);
}
</style>
