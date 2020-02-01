<template>
  <!-- 品项列表 -->
  <div class="sales-item-table">
    <div class="btnbar">
      <el-autocomplete
        v-model="commonName"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
      />
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="handleAdd"
      >添 加</el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        @click="handleDel"
      >删 除</el-button>
      <el-button
        type="primary"
        size="small"
        @click="handleDeduction"
      >抵 扣</el-button>
      <el-button
        type="primary"
        size="small"
        @click="handleExchange"
      >积分兑换</el-button>
    </div>
    <el-table
      :data="itemData"
      height="100%"
      class="item-table"
      border
      fit
      default-expand-all
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.list">
            <el-table-column
              align="center"
              label="品项名称"
              fixed="left"
            >
              <template slot-scope="{row}">
                {{ row.goods_name }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="单价"
              fixed="left"
            >
              <template slot-scope="{row}">
                {{ row.price }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="数量"
              fixed="left"
            >
              <template slot-scope="{row}">
                {{ row.quantity }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="欠货数量"
              fixed="left"
            >
              <template>
                0
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="小计"
              fixed="left"
            >
              <template slot-scope="{row}">
                {{ row.quantity * row.price }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="实收小计"
              fixed="left"
            >
              <template slot-scope="{row}">
                {{ row.quantity * row.price }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="有效业绩小计"
              fixed="left"
            >
              <template slot-scope="{row}">
                {{ row.quantity * row.price }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="50px"
        align="center"
      />
      <el-table-column
        align="center"
        label="所属套餐"
      >
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="套餐价格"
      >
        <template slot-scope="{row}">
          {{ row.total_amount }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="套餐数量"
      >
      <template slot-scope="{row}">
        <el-input v-model="row.quantity" type="number" @input="inputGoodsNumber(row)" />
      </template>
     
      </el-table-column>
      <el-table-column
        align="center"
        label="套餐总价"
      >
        <template slot-scope="{row}">
          {{ row.goods_total_amount }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="优惠方式"
      >
        <template slot-scope="{row}">
          {{ row.preferential_way_name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="折扣"
      >
        <template slot-scope="{row}"  v-show='row.preferential_way==1||row.preferential_way>=5'>
          <el-input v-model="row.discount" align="center" type="number" />
        </template>
        <template slot-scope="{row}" v-show='row.preferential_way!=1&&row.preferential_way<5'>
          {{ row.discount }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="抵扣金额"
      >
        <template slot-scope="{row}">
          {{ row.coupon }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="兑换金额"
      >
        <template slot-scope="{row}">
          {{ row.exchange }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="积分兑换金额"
      >
        <template slot-scope="{row}">
          {{ row.integral }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="套餐实收总计"
      >
        <template slot-scope="{row}">
          {{ (row.receive - row.integral - row.coupon - row.exchange) > 0 ? (row.receive - row.integral - row.coupon - row.exchange) : 0 }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="套餐实付总计"
      >
        <template slot-scope="{row}">
          {{ row.pay }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="套餐有效业绩总计"
      >
        <template slot-scope="{row}">
          {{ (row.receive - row.integral - row.coupon - row.exchange) > 0 ? (row.receive - row.integral - row.coupon - row.exchange) : 0 }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="备注"
      >
        <template>
          备注
        </template>
      </el-table-column>
    </el-table>
    <!-- 积分兑换 -->
    <integral-dialog ref="integralDialog" @setIntegral="setIntegral" />
    <deductionsDialog ref="deductionsDialog" @handleSetMoney="handleSetMoney" />
  </div>
</template>
<script>
import integralDialog from './integralDialog' // 积分兑换
import deductionsDialog from './deductionsDialog' // 抵扣
import { saleSearch, saleCardPackage, apiPostSaleConfirm } from '@/api/ManageSales/Order.js'
export default {
  name: '',
  components: {
    integralDialog,
    deductionsDialog
  },
  data() {
    return {
      include_package_ids: [],
      customer_type: '', // 用户类型
      customer_id: ' ', // 用户id
      selectIds: [], // 选中的套餐
      commonName: '',
      restaurants: [], // 普通列表数据
      state: '',
      timeout: null,
      itemData: [], // 列表数据
      listQuery: {
        name: ''
      },
      provisional: { // 判断是否选择
        value: ' '
      },
      oneShop: { } // 临时单个商品数据
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 算法
    // 商品数量
    inputGoodsNumber(item){
      for(let i in this.itemData){
        if(item.package_id==this.itemData[i].package_id){
          if(this.itemData[i].quantity<=0){
            this.itemData[i].quantity=1
          }
          this.itemData[i].quantity=Math.round(this.itemData[i].quantity)
          this.itemData[i].goods_total_amount=this.itemData[i].total_amount* this.itemData[i].quantity
        }
      }
      this.handleSetTable()
    },
    // 向父组件传表数据
    handleSetTable() {
      this.include_package_ids = this.itemData.map(item => {
        if (item.goods_type === 2) {
          return item.id
        }
      })
      this.$emit('handleSetTableData', this.itemData)
    },
    // 表格选中后获取id
    handleSelectionChange(val) {
      console.log(val)
      this.selectIds = val.map(item => {
        return item.ids
      })
    },
    // 父组件传套餐
    init(data) {
      data.ids = '套餐' + data.id // 组合id
      for (let i = 0; i < this.itemData.length; i++) {
        if (this.itemData[i].ids === data.ids) {
          this.$message({
            message: '套餐不能重复添加！',
            type: 'warning'
          })
          return false
        }
      }
      // eslint-disable-next-line no-sequences
      data.ids = '套餐' + data.id // 组合id
      data.goods_type = 2 // 1产品，2套餐
      data.package_id = data.id // 套餐id
      data.discount_type = '不优惠' // 优惠方式
      data.goods_total_amount=data.total_amount, // 套餐总价
      data.quantity = 1 // 套餐或产品购买数量
      data.discount = 0 // 折扣
      data.coupon = 0 // 抵扣金额
      data.exchange = 0 // 兑换金额
      data.integral = 0 // 积分兑换金额
      data.receive = data.total_amount // 实收金额
      data.pay = 0 // 实付金额
      data.dic_card = 0 // 套餐卡属性（新客卡、正常卡等）
      data.dic_activity_type = 1 // 套餐活动类型[1:几选几;2:满额;3:期限卡;4:折扣设置;5:充值活动]
      data.is_staff_price = 0 // 是否以员工价购买[0:否;1:是]
      data.include_super_level = 0 // / 是否包含超高项目
      this.itemData.push(data)
      this.handleSetTable()
    },
    // 从父组件传用户id
    setUserId(id, ctype) {
      this.customer_id = id
      this.customer_type = ctype
    },
    getList() { // 获取查询列表
      saleSearch({ name: '' }).then(response => {
        const items = response.data
        this.restaurants = items.map(v => {
          this.$set(v, 'value', v.name)
          return v
        })
      })
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 1000 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 删除套餐
    handleDel() {
      if (this.selectIds.length === 0) {
        this.$message({
          message: '请选择套餐',
          type: 'warning'
        })
        return false
      }
      for (let i = 0; i < this.selectIds.length; i++) {
        for (let j = 0; j < this.itemData.length; j++) {
          if (this.selectIds[i] === this.itemData[j].ids) {
            this.itemData.splice(j, 1)
          }
        }
      }
      this.handleSetTable()
    },
    // 抵扣方法
    handleDeduction() {
      if (this.customer_id === ' ') {
        this.$message({
          message: '请选择用户',
          type: 'warning'
        })
        return false
      }
      if (this.selectIds.length === 0) {
        this.$message({
          message: '请选择套餐',
          type: 'warning'
        })
        return false
      }
      if (this.selectIds.length > 1) {
        this.$message({
          message: '一次只能选择一个套餐',
          type: 'warning'
        })
        return false
      }
      for (let i = 0; i < this.selectIds.length; i++) {
        for (let j = 0; j < this.itemData.length; j++) {
          if (this.selectIds[i] === this.itemData[j].ids) {
             if (this.itemData[j].preferential_way == 0) {
              this.$message({
                message: '该套餐无法使用抵扣',
                type: 'warning'
              })
              return false

            }
            this.$refs.deductionsDialog.init(this.customer_id, this.itemData[j].list, this.customer_type)
          }
        }
      }
    },
    // 获取兑换金额
    handleSetMoney(coupon, exchange) {
      for (let i = 0; i < this.selectIds.length; i++) {
        for (let j = 0; j < this.itemData.length; j++) {
          if (this.selectIds[i] === this.itemData[j].ids) {
            this.itemData[j].coupon = coupon
            this.itemData[j].exchange = exchange
            this.handleSetTable()
          }
        }
      }
    },
    // 积分兑换
    handleExchange() {
      if (this.customer_id === ' ') {
        this.$message({
          message: '请选择用户',
          type: 'warning'
        })
        return false
      }
      if (this.selectIds.length === 0) {
        this.$message({
          message: '请选择套餐',
          type: 'warning'
        })
        return false
      }
      if (this.selectIds.length > 1) {
        this.$message({
          message: '一次只能选择一个套餐',
          type: 'warning'
        })
        return false
      }
      for (let i = 0; i < this.selectIds.length; i++) {
        for (let j = 0; j < this.itemData.length; j++) {
          if (this.selectIds[i] === this.itemData[j].ids) {
            if (this.itemData[j].is_staff_price == 0) {
              this.$message({
                message: '该套餐无法使用积分兑换',
                type: 'warning'
              })
              return false

            }
            this.$refs.integralDialog.init(this.customer_id, this.itemData[j].list)
          }
        }
      }
    },
    // 获取积分兑换金额
    setIntegral(data) {
      for (let i = 0; i < this.selectIds.length; i++) {
        for (let j = 0; j < this.itemData.length; j++) {
          if (this.selectIds[i] === this.itemData[j].ids) {
            this.itemData[j].integral = data
            this.handleSetTable()
          }
        }
      }
    },
    // 单个商品添加到表
    handleAdd() {
      if (this.customer_id === ' ') {
        this.$message({
          message: '请选择用户',
          type: 'warning'
        })
        return false
      }
      if (this.provisional.value === ' ') {
        this.$message({
          message: '请选择品项',
          type: 'warning'
        })
        return false
      }
      const gtype_name = this.provisional.gtype === 1 ? '产品' : '套餐'
      const list = {
        combination_id: ' ',
        common_send: ' ',
        goods_id: this.oneShop.id,
        goods_name: this.oneShop.name,
        gtype: this.provisional.gtype,
        gtype_name: gtype_name,
        id: ' ',
        name: this.oneShop.name,
        price: this.oneShop.price,
        quantity: 1,
        source: ' ',
        value: ' '
      }
      const arr = []
      arr.push(list)
      const obj = {
        goods_type: this.provisional.gtype, // 1产品，2套餐
        ids: gtype_name + this.oneShop.id, // 组合id
        id: this.oneShop.id, // id
        name: this.oneShop.name, //  套餐名称
        total_amount: this.oneShop.price, // 套餐单价
        goods_total_amount:this.oneShop.price, // 套餐总价
        preferential_way:this.oneShop.preferential_way, // 优惠类型
        preferential_way_name:this.oneShop.preferential_way_name, // 优惠方式
        package_id: 0, // 套餐id产品0
        quantity: 1, // 套餐或产品购买数量
        discount: 1, // 折扣
        coupon: 0, // 抵扣金额
        exchange: 0, // 兑换金额
        integral: 0, // 积分兑换金额
        receive: this.oneShop.price, // 实收金额
        pay: 0, // 实付金额
        dic_card: 1, // 套餐卡属性（新客卡、正常卡等）
        dic_activity_type: 1, // 套餐活动类型[1:几选几;2:满额;3:期限卡;4:折扣设置;5:充值活动]
        is_staff_price: 0, // 是否以员工价购买[0:否;1:是]
        include_super_level: 0, // 是否包含超高项目
        list: arr
      }
      this.itemData.push(obj) // 保存到表
      this.handleSetTable() // 给父组件传表数据
    },
    // 选择后
    handleSelect(item) {
      if (item.gtype === 1) { // 判断是产品还是套餐1产品,2套餐
        apiPostSaleConfirm({ goods_id: item.id, goods_type: 1, customer_id: this.customer_id, include_package_ids: [] }).then(response => { // 销售开单-品项添加审查
          if (response.data.auth === 'forbidden') {
            this.$message.error(JSON.stringify(response.data.areason[0]))
          }
          if (response.data.auth === 'access') {
            saleCardPackage({ id: item.id, gtype: item.gtype, ctype: this.customer_type }).then(response => {
              this.provisional = item
              this.oneShop = response.data
            })
          }
        })
      } else {
        apiPostSaleConfirm({ goods_id: item.id, goods_type: 2, customer_id: this.customer_id, include_package_ids: this.include_package_ids }).then(response => { // 销售开单-品项添加审查
          if (response.data.auth === 'forbidden') {
            this.$message.error(JSON.stringify(response.data.areason[0]))
          }
          if (response.data.auth === 'access') {
            this.$emit('getAct', item.id) // 传套餐id给父组件，弹窗套餐窗口
          }
        })
      }
    },
    handleFilter() {
      // -
    },
    // - 打开品项选择/积分兑换
    openDialog(type) {
      this.$emit('open', type)
    }
  }
}
</script>
<style lang="scss" scoped>
.sales-item-table {
  width: 100%;
  height: 100%;
  min-height: 240px;
  .btnbar {
    border: 1px solid #ccc;
    border-radius: 5px 5px 0 0;
    padding: 10px;
  }
  .item-table {
    width: 100%;
    border: 1px solid #ccc;
    border-top: 0;
    border-radius: 0 0 5px 5px;
  }
}
</style>
