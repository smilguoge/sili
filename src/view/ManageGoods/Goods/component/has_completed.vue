<template>
  <div class="has_completed">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        align='center'
        prop="order_no"
        label="销售订单号"
        sortable
      />
      <el-table-column
        align="center"
        prop="customer_name"
        label="顾客姓名"
      />
      <el-table-column
        align="center"
        prop="customer_no"
        label="会员编号"
      />
      <el-table-column
        align='center'
        prop="card_package_name"
        label="所属套餐"
      />
      <el-table-column
        align='center'
        prop="product_class"
        label="产品分类"
      />
      <el-table-column
        align='center'
        prop="product_short_name"
        label="产品简称"
      />
      <el-table-column
        align='center'
        prop="product_name"
        label="产品全称"
      />
      <el-table-column
        align='center'
        prop="quantity"
        label="欠货数量"
      />
      <el-table-column
        align='center'
        prop="surplus_quantity"
        label="剩余欠货"
      />
      <el-table-column
        align='center'
        label="还货时间"
        sortable
        width='180'
      >
        <template slot-scope="{row}">
          {{ row.created_at | parseTime('{y}.{m}.{d} {h}: {i}') }}
        </template>
      </el-table-column>
      <el-table-column
        align='remark'
        prop="address"
        label="备注"
      />
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'has_completed',
  components: {},
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
      
    }
  },
  created() {
   
  },

  methods: {
   
   
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
