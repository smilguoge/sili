<template>
  <div class="owe-goods">
    <div id='owe-goods-table'>
      <el-table
        ref="multipleTable"
        border
        :data="tableData"
        show-summary
        style="width: 100%"
        :summary-method="getSummaries"
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align='center'
          type="selection"
          width="55"
        />
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
          label="欠货时间"
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
        <el-table-column align='center' label="操作" width='180'>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleDetail(scope.$index, scope.row)">查看详情</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleBack(scope.$index, scope.row)">还货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="tanc">
      <OweGoodsDetail ref="OweGoodsDetail" v-if="is_show==1" @hide="hide" />
      <ReturnMoney ref="ReturnMoney" v-if="is_show==2" @hide="hide" />
    </div>
  </div>
</template>
<script>

import OweGoodsDetail from './owe_goods_detail'
import ReturnMoney from './return_money'
import { whBackorderView, whReturnIndex } from '@/api/ManageGoods/owe.js'
export default {
  name: 'owe-goods',
  components: { OweGoodsDetail, ReturnMoney },
  data() {
    return {
      is_show: null,
      tableData: [],
      selectIds: []
    }
  },
  created() {
    console.log(this.tableData)
  },

  methods: {
    // 表格选中后获取id
    handleSelectionChange(val) {
      this.selectIds = val.map(item => {
        return item.id
      })
    },
    getlist() {
      this.$parent.getlist()
    },
    setTableList(list) {
      this.tableData = list
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      // console.log(columns,data)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        } else if (index === 1) {
          sums[index] = ''
          return
        }
        // 数字判断
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    // 显示详情弹窗
    handleDetail(index, row) {
      // 进行详情获取
      whBackorderView({ id: row.id }).then(response => {
        this.$refs.OweGoodsDetail.info = {
          order_no: response.data.order_no,
          user_name: response.data.user_name,
          product_name: response.data.product_name,
          quantity: response.data.quantity,
          surplus_quantity: response.data.surplus_quantity,
          card_package_name: response.data.card_package_name,
          wh_backorder_id: row.id
        }
        this.$refs.OweGoodsDetail.tableData = response.data.arrdetail
      })
      this.is_show = 1
    },
    // 隐藏弹窗组件
    hide() {
      this.is_show = null
    },
    // 显示还货弹窗
    handleBack(index, row) {
      // 还贷渲染
      whReturnIndex({ wh_backorder_id: row.id }).then(response => {
        this.$refs.ReturnMoney.form = {
          product_name: response.data.product_name,
          quantity: response.data.quantity,
          num: row.surplus_quantity
        }
        this.$refs.ReturnMoney.options = response.data.arrWarehouse['warehouse']
        this.$refs.ReturnMoney.value = response.data.arrWarehouse['detail']
        this.$refs.ReturnMoney.wh_backorder_id = row.id
      })
      this.is_show = 2
    }
  }
}
</script>

<style>
#owe-goods-table .el-table__row td:nth-child(9) .cell,
#owe-goods-table .el-table__footer-wrapper td:nth-child(9) .cell{
        color:red;
}
.el-drawer {
  overflow-y: auto
}
</style>
