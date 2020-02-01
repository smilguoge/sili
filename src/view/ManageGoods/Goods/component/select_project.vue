<template>
  <div id="select_project">
    <el-dialog :close-on-click-modal="false" width="50%" center title="选择产品" :visible.sync="dialogTableVisible" @close="close">
      <div id="select_project_form">
        <div class="search">
          <el-autocomplete
            v-model="state1"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
          />
        </div>
        <el-button icon="el-icon-search" type="primary">查询</el-button>
      </div>
      <div id="select_project_table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55" />
          <el-table-column align="center" label="产品编码">
            <template slot-scope="scope">{{ scope.row.code }}</template>
          </el-table-column>
          <el-table-column align="center" prop="product_class_name" label="产品类型" />
          <el-table-column align="center" prop="name" label="产品全称" />
          <el-table-column align="center" prop="short_name" label="产品简称" />
          <el-table-column align="center" prop="specs" label="规格" />
          <el-table-column align="center" prop="quantity" label="库房存量" />
          <el-table-column align="center" prop="dic_unit" label="单位" />
        </el-table>
      </div>
      <div class="btn">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" class="sure">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddDetail',
  data() {
    return {
      dialogTableVisible: true,
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      multipleSelection: [],
      state1: '',
      restaurants: [
        { value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' },
        {
          value: 'Hot honey 首尔炸鸡（仙霞路）',
          address: '上海市长宁区淞虹路661号'
        }
      ]
    }
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$emit('hide')
    },
    // 搜索
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss" scoped>
#select_project {
  #select_project_form {
    display: flex;
    margin-bottom: 20px;
    justify-content: center;
    .search{
      width: 70%;
      .el-autocomplete{
        width: 90%;
      }
    }
  }
  .btn{
    display: flex;
    justify-content: center;
    margin-top: 20px;
    .sure{
      margin-left: 30px;
    }
  }
}
</style>
<style>
#select_project .el-dialog__header {
  border-bottom: 1px solid #e6e6e6 !important;
}
</style>
