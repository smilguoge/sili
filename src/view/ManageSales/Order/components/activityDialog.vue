<template>
  <!-- 抵扣 -->
  <el-dialog
    title="套餐"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="deduction-dialog"
    width="1200px"
  >
    <div class="deduction-total-bar">
      <el-col :span="24" :offset="1">
        <span class="tit-font">{{ dataObj.name }}</span>
        <span class="tit-font">达标总金额</span>
        <span class="num info-color">{{ dataObj.total_amount }}</span>
        <span class="tit-font">项目次数</span>
        <span class="num info-color">{{ dataObj.total_num }}</span>
      </el-col>
    </div>
    <div style=" padding-left: 50px; padding-top: 20px;">
      项目名称<el-autocomplete
        v-model="commonName"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
      />
      次数<el-input
        v-model="commonObj.quantity"
        style="width: 160px;"
        placeholder="请输入次数"
        type="number"
      />
      <el-button
        style="margin-left:18px"
        size="mini"
        type="primary"
        plain
        @click.native="handleAdd"
      >确认</el-button>
      赠送品项查询
      <el-autocomplete
        v-model="giveName"
        :fetch-suggestions="querySearchAsyncTwo"
        placeholder="请输入内容"
        @select="handleSelectTwo"
      />
      次数<el-input
        v-model="giveObj.quantity"
        style="width: 160px;"
        placeholder="请输入次数"
        type="number"
      />
      <el-button
        style="margin-left:18px"
        size="mini"
        type="primary"
        plain
        @click.native="handleAddTwo"
      >确认</el-button>
    </div>
    <el-col :span="22" :offset="1">
      <div class="deduction-table">
        <div class="deduction-head">
          <span class="tit-font">已选项目</span>
        </div>
        <el-table
          :data="list"
          height="240px"
          class="item-table"
          fit
        >
          <el-table-column
            align="center"
            label="组合"
          >
            <template slot-scope="{row}">
              {{ row.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="类别"
          >
            <template slot-scope="{row}">
              {{ row.gtype == 1 ? '产品' : '项目' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="名称"
          >
            <template slot-scope="{row}">
              {{ row.goods_name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="品项类型"
          >
            <template slot-scope="{row}">
              {{ row.gtype_name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="购买次数"
          >
            <template slot-scope="{row}">
              <el-input v-model="row.quantity" type="number" />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="购买金额"
          >
            <template slot-scope="{row}">
              {{ row.price }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="类型"
          >
            <template slot-scope="{row}">
              {{ row.source }}
            </template>
          </el-table-column>
          <el-table-column 
            width="50px"
            align="center">
             <template slot-scope="{row}">
               <i class="el-icon-delete" style="color:#f00" @click="handleDelete(row.id)"></i>
            </template>
            
        </el-table-column>
        </el-table>
      </div>
    </el-col>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-col :span="23">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit()"
        >确 定</el-button>
      </el-col>
      <div style="clear:both" />
    </div>
  </el-dialog>
</template>
<script>
import { saleCardPackage, apiSaleCardPackageSearch } from '@/api/ManageSales/Order.js'
export default {
  name: '',
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      // -
      deductionData: {
        name1: '666.00',
        table1: [],
        table2: []
      },
      list: [], // 表数据
      dataObj: { // 套餐信息
        id: '',
        name: '',
        total_amount: '',
        total_num: ''
      },
      commonName: '',
      commonNO: '', // 普通数量
      commonObj: {
        name: '',
        quantity: ''
      }, // 普通临时数据
      giveName: '',
      giveNO: '', // 赠送数量
      giveObj: {
        name: '',
        quantity: ''
      }, // 赠送临时数据
      dialogVisible: false,
      flagTime: 0,
      restaurants: [], // 普通列表数据
      restaurantsTwo: [], // 赠送列表数据
      state: '',
      timeout: null
    }
  },
  created() {
    // -
  },
  methods: {
    init(id, res) { // 从父组件传套餐id
    console.log(id, res)
      // saleCardPackage({ id: id, gtype: gtype, ctype: ctype }).then(response => {
        this.dataObj = res
        this.dialogVisible = true
        this.dataObj.id = id
        this.getList(id)
      // })
    },
    getList(id) { // 获取 普通列表 跟 赠送列表
      apiSaleCardPackageSearch({ id: id, pcom_type: 1 }).then(response => {
        const items = response.data.list
        this.restaurants = items.map(v => {
          this.$set(v, 'value', v.goods_name)
          return v
        })
      })
      apiSaleCardPackageSearch({ id: id, pcom_type: 2 }).then(response => {
        const items = response.data.list
        this.restaurantsTwo = items.map(v => {
          this.$set(v, 'value', v.goods_name)
          return v
        })
      })
    },
    handleSubmit(formName) {
      // eslint-disable-next-line no-unused-vars
      let sums = 0
      for (let i = 0; i < this.list.length; i++) {
        sums += this.list[i].quantity * 1
      }
      console.log(sums, this.dataObj.total_num)
      if (sums > this.dataObj.total_num) {
        this.$message({
          message: '品项次数大于组合总次数',
          type: 'warning'
        })
        return false
      }
      if (this.list.length > 0) {
        const obj = {
          id: this.dataObj.id,
          name: this.dataObj.name,
          total_amount: this.dataObj.total_amount,
          total_num: this.dataObj.total_num,
          preferential_way:this.dataObj.preferential_way,
          preferential_way_name:this.dataObj.preferential_way_name,
          list: this.list
        }
        this.dialogVisible = false
        this.$emit('handleSetData', obj)
        this.list = []
      } else {
        this.$message({
          message: '请选择品项',
          type: 'warning'
        })
      }
    },
    handleCancel() {
      this.dialogVisible = false
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 1000 * Math.random())
    },
    querySearchAsyncTwo(queryString, cb) {
      var restaurants = this.restaurantsTwo
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
    // 选择后
    handleSelect(item) {
      this.commonObj = item
    },
    handleSelectTwo(item) {
      this.giveObj = item
    },
    handleAdd() {
      if (this.commonObj.name !== '') {
        if (this.commonObj.quantity === '') {
          this.$message({
            message: '请输入数量',
            type: 'warning'
          })
        } else {
          for(let i in this.list){
            if(this.commonObj.id==this.list[i].id){
               this.$message({
                message: '该项目已选',
                type: 'warning'
              })
              return
            }
          }
          console.log(this.commonObj)
          this.list.push(this.commonObj)
          this.commonObj = { name: '' }
          this.commonNO = ''
          this.commonName = ''
        }
      } else {
        this.$message({
          message: '请选择项目',
          type: 'warning'
        })
      }
    },
    handleAddTwo() {
      if (this.giveObj.name !== '') {
        if (this.giveObj.quantity === '') {
          this.$message({
            message: '请输入赠送数量',
            type: 'warning'
          })
        } else {
           for(let i in this.list){
            if(this.giveObj.id==this.list[i].id){
               this.$message({
                message: '该项目已选',
                type: 'warning'
              })
              return
            }
          }
          this.list.push(this.giveObj)
          this.giveObj = { name: '' }
          this.giveName = ''
          this.giveNO = ''
        }
      } else {
        this.$message({
          message: '请选择赠送项目',
          type: 'warning'
        })
      }
    },
    handleDelete(id){
      for (let j = 0; j < this.list.length; j++) {
        if (id == this.list[j].id) {
          this.list.splice(j, 1)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.deduction-dialog{
  .deduction-total-bar {
      height: 50px;
      margin: -10px 50px 0;
      border-left: 4px solid #6666FE;
      border-radius: 4px;
      background-color: #F5F7FA;
      line-height: 50px;
      font-size: 14px;
      .num {
        font-size: 16px;
      }
    }
  .deduction-table {
    margin: 20px 0;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    overflow: hidden;
    .deduction-head {
      height: 36px;
      line-height: 36px;
      padding: 0 24px;
      background-color: #F5F7FA;
      border-bottom: 1px solid #DCDFE6
    }
  }
}
</style>
