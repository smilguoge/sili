<template>
  <div class="exchange">
    <el-dialog title="兑换" :close-on-click-modal="false" width="50%" :visible.sync="dialogTableVisible" @close="close">
      <!--表1 -->
      <div class="box">
        <!-- <el-button type="primary" @click="add1">添加</el-button> -->
        <el-button type="primary" @click="handlerDelectChild1">删除</el-button>
        <div class="exchange_table">
          <el-table
            ref="multipleTable1"
            height="250"
            :summary-method="getSummaries"
            show-summary
            border
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" prop="name" label="产品名称*" width="200" />
            <el-table-column align="center" prop="surplus_quantity" label="欠货数量" />
            <el-table-column align="center" prop="total_price" label="实收金额" />
            <el-table-column align="center" label="兑换数量*" prop="replace_quantity">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.date"
                >{{ scope.row.date }}</div>
                <div v-else>
                  <el-input
                    v-model="scope.row.replace_quantity"
                    placeholder="请输入内容"
                    @change="changeExchange(scope.$index)"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="single_price" label="销售价" />
            <el-table-column align="center" prop="total1" label="小计" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ totalExchang(scope.$index) }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--表2 -->
      <div class="box">
        <el-button type="primary" @click="add2">添加</el-button>
        <el-button type="primary" @click="handlerDelectChild2">删除</el-button>
        <div class="exchange_table">
          <el-table
            ref="multipleTable2"
            height="250"
            border
            :summary-method="getSummaries2"
            show-summary
            :data="tableData2"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" label="产品名称*" width="200">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.has"
                >{{ scope.row.name }}</div>
                <div v-else>
                  <el-autocomplete
                    v-model="scope.row.name"
                    class="inline-input"
                    :fetch-suggestions="querySearch2"
                    placeholder="请输入内容"
                    @select="handleSelect2"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="兑换数量*" prop="quantity">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.date"
                >{{ scope.row.date }}</div>
                <div v-else>
                  <el-input v-model="scope.row.quantity" placeholder="请输入内容" />
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="sell_price" label="销售价" />
            <el-table-column align="center" prop="total2" label="小计">
              <template slot-scope="scope">
                <div>{{ totalExchang2(scope.$index) }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div id="difference">
        补差金额<span>{{ getDifference }}</span>
      </div>
      <div id="btn">
        <el-button type="primary" @click="exchangeReturn(2)">等价交换</el-button>
        <el-button type="primary" @click="exchangeReturn(1)">兑换</el-button>
        <el-button type="primary" @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import OweGoodsDetail from './owe_goods_detail'
import { whReplaceCreatePut } from '@/api/ManageGoods/owe.js'
export default {
  name: 'Exchange',
  components: {},
  data() {
    return {
      num: 0,
      dialogTableVisible: true,
      // 表1
      tableData: [{}],
      multipleSelection: [],
      state: '',
      restaurants: [
        { 'value': '壹分米客家传统调制米粉(天山店)', 'address': '天山西路428号' },
        { 'value': '福荣祥烧腊（平溪路店）', 'address': '上海市长宁区协和路福泉路255弄57-73号' },
        { 'value': '速记黄焖鸡米饭', 'address': '上海市长宁区北新泾街道金钟路180号1层01号摊位' },
        { 'value': '红辣椒麻辣烫', 'address': '上海市长宁区天山西路492号' },
        { 'value': '(小杨生煎)西郊百联餐厅', 'address': '长宁区仙霞西路88号百联2楼' },
        { 'value': '阳阳麻辣烫', 'address': '天山西路389号' },
        { 'value': '南拳妈妈龙虾盖浇饭', 'address': '普陀区金沙江路1699号鑫乐惠美食广场A13' }
      ],
      input: '',

      // 表2
      tableData2: [{}],
      multipleSelection2: [],
      state2: '',
      restaurants2: [],
      input2: ''
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    getDifference() {
      var tableTotal1 = 0
      var tableTotal2 = 0
      for (let index = 0; index < this.tableData.length; index++) {
        tableTotal1 += this.totalExchang(index)
      }
      for (let index = 0; index < this.tableData2.length; index++) {
        tableTotal2 += this.totalExchang2(index)
      }
      return tableTotal2 - tableTotal1
    }
  },
  created() {

  },
  methods: {
    totalExchang(index) {
      return parseInt(this.tableData[index]['replace_quantity'] ? this.tableData[index]['replace_quantity'] : 0) * parseFloat(this.tableData[index]['single_price'])
    },
    totalExchang2(index) {
      return parseInt(this.tableData2[index] && this.tableData2[index]['quantity'] ? this.tableData2[index]['quantity'] : 0) * parseFloat(this.tableData2[index]['sell_price'] ? this.tableData2[index]['sell_price'] : 0)
    },
    // 计算总数
    changeExchange(index) {
      // 进行统计计算
      if (this.tableData[index]['replace_quantity'] > this.tableData[index]['surplus_quantity']) {
        this.$message({
          message: '兑换数量不能大于欠货数量',
          type: 'warning'
        })
        this.tableData[index]['replace_quantity'] = this.tableData[index]['surplus_quantity']
        return false
      }
    },
    handleSelectClick2(index) {
      console.log(index)
    },
    handlerDelectChild1(index) {
      if (this.$refs.multipleTable1.selection.length > 0) {
        for (let index = 0; index < this.$refs.multipleTable1.selection.length; index++) {
          for (let j = 0; j < this.tableData.length; j++) {
            if (this.tableData[j]['wh_backorder_id'] === this.$refs.multipleTable1.selection[index]['wh_backorder_id']) {
              this.tableData.splice(j, 1)
              break
            }
          }
        }
      }
    },
    handlerDelectChild2(index) {
      if (this.$refs.multipleTable2.selection.length > 0) {
        for (let index = 0; index < this.$refs.multipleTable2.selection.length; index++) {
          for (let j = 0; j < this.tableData2.length; j++) {
            if (this.tableData2[j]['wh_backorder_id'] === this.$refs.multipleTable2.selection[index]['wh_backorder_id']) {
              this.tableData2.splice(j, 1)
              break
            }
          }
        }
      }
    },
    // 提交
    exchangeReturn(val) {
      // 判断欠货是否有填写数量
      if (this.tableData.lenght === 0) {
        this.$message({
          message: '请先选择欠货记录再进行兑换',
          type: 'warning'
        })
        return false
      }
      if (this.tableData2.lenght === 0) {
        this.$message({
          message: '请先添加兑货记录再进行兑换',
          type: 'warning'
        })
        return false
      }
      for (let index = 0; index < this.tableData.length; index++) {
        if (!(this.tableData[index]['replace_quantity'] > 0)) {
          this.$message({
            message: '请先选择欠货兑换数量',
            type: 'warning'
          })
          return false
        }
      }
      for (let index = 0; index < this.tableData2.length; index++) {
        if (this.totalExchang2(index) === 0) {
          this.$message({
            message: '请先选择兑换选项不能为空',
            type: 'warning'
          })
          return false
        }
      }
      var product_info = []
      var replace_info = []
      for (let index = 0; index < this.tableData.length; index++) {
        product_info.push({
          wh_backorder_id: this.tableData[index]['wh_backorder_id'],
          product_id: this.tableData[index]['product_id'],
          product_name: this.tableData[index]['name'],
          replace_quantity: this.tableData[index]['replace_quantity'],
          total_price: this.tableData[index]['total_price'],
          sale_price: this.tableData[index]['single_price']
        })
      }
      for (let index = 0; index < this.tableData2.length; index++) {
        replace_info.push({
          product_id: this.tableData2[index]['id'],
          product_name: this.tableData2[index]['name'],
          quantity: this.tableData2[index]['quantity'],
          sale_price: this.tableData2[index]['sell_price']
        })
      }
      // 提交
      var data = {
        type: val,
        difference_price: this.getDifference,
        product_info: product_info,
        replace_info: replace_info
      }
      whReplaceCreatePut(data).then(response => {
        if (response.code === 200) {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.$parent.getlist()
          this.close()
        } else {
          this.$message({
            message: response.message,
            type: 'warning'
          })
        }
      })
    },
    // 关闭弹窗
    close() {
      this.$parent.is_tanc = null
      // this.$emit('hide')
    },
    onSubmit() {},
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    add1() {
      this.tableData.push({
        num: this.num
      })
      // eslint-disable-next-line no-undef
      this.num++
    },
    // 表1合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        } else if (index === 1) {
          return
        } else {
          var values = 0
          if (column.property === 'total1') {
            values = data.map(item => parseInt(item['replace_quantity'] ? item['replace_quantity'] : 0) * parseFloat(item['single_price']))
          } else {
            values = data.map(item => Number(item[column.property]))
          }
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
        }
      })

      return sums
    },

    // 表2搜索
    querySearch2(queryString, cb) {
      var restaurants = this.restaurants2
      var results = queryString ? restaurants.filter(this.createFilter2(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter2(queryString) {
      return (state) => {
        return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelect2(item) {
      // 判断当前是哪一个操作
      for (let index = 0; index < this.tableData2.length; index++) {
        if (this.tableData2[index]['name'] && !this.tableData2[index]['sell_price']) {
          item['num'] = this.tableData2[index]['num']
          this.tableData2[index] = item
        }
      }
    },
    add2() {
      // 判断
      for (let index = 0; index < this.tableData2.length; index++) {
        if (!this.tableData2[index]['name'] || !this.tableData2[index]['sell_price']) {
          this.$message({
            message: '请先选择已添加项',
            type: 'warning'
          })
          return true
        }
      }
      for (let index = 0; index < this.tableData2.length; index++) {
        this.tableData2[index]['has'] = true
      }
      this.tableData2.push({
        num: this.num
      })
      // eslint-disable-next-line no-undef
      this.num++
    },
    // 表2多选
    handleSelectionChange2(val) {
      this.multipleSelection = val
    },
    // 表2合计
    getSummaries2(param) {
      const { columns, data } = param
      const sums = []
      console.log(columns)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        } else if (index === 1) {
          return
        } else {
          var values = 0
          if (column.property === 'total2') {
            values = data.map(item => parseInt((item && item['quantity']) ? item['quantity'] : 0) * (item['sell_price'] ? item['sell_price'] : 0))
          } else {
            values = data.map(item => parseFloat(item[column.property]))
          }
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
        }
      })
      return sums
    }
  }
}
</script>

<style  lang="scss" scoped>
.exchange_table{
  margin:20px 0;
}
#difference{
  display: flex;
  align-items: center;
  span{
    border: 1px solid #e6e6e6;
    margin-left: 20px;
    padding: 5px 30px;
  }
}
#btn{
  display: flex;
  margin-top: 20px;
  justify-content: center;
}
</style>
