<template>
  <!-- 临时赠送 -->
  <el-dialog
    title="新增赠送"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    width="1000px"
  >
    <el-form
      :model="changeData"
      label-width="100px"
    >
      <el-col :span="7">
        <el-form-item label="会员名称:">
          <el-autocomplete
            v-model="changeData.customer_name"
            style="width:100%"
            placeholder="请输入会员名称"
            :fetch-suggestions="querySearchAsync"
            @select="handleCustomerSelect"
          />
        </el-form-item>
      </el-col>
      <el-col :span="7" :offset="1">
        <el-form-item label="会员编号:">
          <el-input v-model="changeData.customer_sn" style="width:100%" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="7" :offset="1">
        <el-form-item label="所属门店:">
          <el-input v-model="$store.getters.member.shop_name" style="width:100%" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="赠送人:">
          <el-autocomplete
            v-model="changeData.member_name"
            style="width:100%"
            placeholder="请输入赠送人"
            :fetch-suggestions="querySearchAsync2"
            @select="handleMemberSelect"
          />
        </el-form-item>
      </el-col>
      <el-col :span="7" :offset="1">
        <el-form-item label="赠送类型:">
          <el-select v-model="changeData.send_type" style="width:100%" placeholder="请选择赠送类型">
            <el-option v-for="(item,index) in dicSendType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="7" :offset="1">
        <el-form-item label="赠送日期:">
          <el-date-picker
            v-model="changeData.time"
            type="date"
            style="width:100%"
            placeholder="请选择日期"
            value-format="timestamp"
          />
        </el-form-item>
      </el-col> -->
      <el-col :span="23">
        <el-form-item label="赠送内容:">
          <div class="temporary-table">
            <div class="temporary-head">
              <el-button
                type="primary"
                size="mini"
                @click="openDialog('create')"
              >新 增</el-button>
            </div>
            <el-table
              :data="changeData.goods_info"
              height="240px"
              fit
            >
              <el-table-column
                align="center"
                label="类别"
              >
                <template slot-scope="{row}">
                  {{ getGoodTypeName(row.gtype) }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="名称"
              >
                <template slot-scope="{row}">
                  {{ row.name }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="数量"
              >
                <template slot-scope="{row}">
                  {{ row.quantity }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="200px"
                label="操作"
              >
                <template slot-scope="row">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="openDialog('edit', row.$index)"
                  >修 改</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    @click="handlerDelectChild(row.$index)"
                  >删 除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="23">
        <el-form-item label="备注:">
          <el-input v-model="changeData.message" type="textarea" style="width:100%" />
        </el-form-item>
      </el-col>
    </el-form>

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
    <el-dialog
      title="赠送内容"
      :visible.sync="dialogChildVisible"
      :before-close="handleChildCancel"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="360px"
    >
      <el-form ref="childData" :model="childData" label-width="60px">
        <el-col :span="23">
          <el-form-item label="类别">
            <el-select v-model="childData.gtype" class="w100" placeholder="请选择类别">
              <el-option v-for="(item,index) in dicSendGoodsType" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label="名称">
            <el-autocomplete
              v-model="childData.name"
              class="w100"
              placeholder="请输入名称"
              :fetch-suggestions="querySearchAsync3"
              @select="handleGoodsSelect"
            />
          </el-form-item>
        </el-col>
        <el-col :span="23">
          <el-form-item label="数量">
            <el-input v-model="childData.quantity" class="w100" placeholder="请输入数量" />
          </el-form-item>
        </el-col>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-col :span="23">
          <el-button @click="handleChildCancel">取 消</el-button>
          <el-button
            type="primary"
            @click="handleChildAdd"
          >确 定</el-button>
        </el-col>
        <div style="clear:both" />
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { customerList } from '@/api/ManageSales/Order.js'
import { getCategory } from '@/api/BaseModule/SalesSet.js'
import { MoneylistGet } from '@/api/home'
import { tempSendGcreate, tempSendCreate } from '@/api/ManageCustomer/temp'
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
      // 员工列表
      moneylist: [],
      // 顾客列表
      customerList: [],
      // 保存数据
      changeData: {
        customer_name: '',
        customer_id: '',
        staff_id: '',
        customer_no: '',
        customer_shop_name: '',
        send_type: '',
        time: '',
        message: '',
        goods_info: []
      },
      // 基本设置 - 赠送方式
      dicSendType: {},
      // 基本设置 - 产品类型
      dicSendGoodsType: {},
      dicCategory: {},
      childData: {},
      dialogType: '',
      dialogVisible: false,
      dialogChildVisible: false,
      flagTime: 0
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        this.init()
        this.getCustomerList()
        this.getTempSendGcreate()
        this.getMoneylistGet()
        this.getSetCategory()
      }
    }
  },
  created() {
    //
  },
  methods: {
    init() {
      this.childData = {}
      this.changeData = {
        customer_name: '',
        customer_id: '',
        staff_id: '',
        customer_no: '',
        customer_shop_name: '',
        send_type: '',
        time: '',
        message: '',
        goods_info: []
      }
    },
    // 顾客
    querySearchAsync(queryString, cb) {
      var restaurants = this.customerList
      var results = queryString ? restaurants.filter(this.createStateFilter2(queryString)) : restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 1000 * Math.random())
    },
    // 员工
    querySearchAsync2(queryString, cb) {
      var restaurants = this.moneylist
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 1000 * Math.random())
    },
    // 产品
    querySearchAsync3(queryString, cb) {
      var restaurants
      if (this.childData && this.childData.gtype > 0) {
        switch (this.childData.gtype) {
          case 1:
            restaurants = this.dicCategory['product'] ? this.dicCategory['product'] : []
            break
          case 2:
            restaurants = this.dicCategory['cardPackge'] ? this.dicCategory['cardPackge'] : []
            break
          case 3:
            restaurants = this.dicCategory['coupon'] ? this.dicCategory['coupon'] : []
            break
          default:
            restaurants = []
            break
        }
        if (restaurants.length > 0) {
          // 格式化
          this.list = restaurants.map(v => {
            this.$set(v, 'value', v.name)
            return v
          })
          restaurants = this.list
        }
      } else {
        restaurants = []
      }
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 1000 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        console.log(state)
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    createStateFilter2(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0 ||
           state.phone.toLowerCase().indexOf(queryString.toLowerCase()) === 0 ||
           state.customer_no.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    // 获取员工
    getMoneylistGet() {
      MoneylistGet().then(res => {
        const items = res.data
        this.list = items.map(v => {
          this.$set(v, 'value', v.name)
          return v
        })
        this.moneylist = this.list
      })
    },
    // 基本数据
    getTempSendGcreate() {
      tempSendGcreate().then(response => {
        this.dicSendType = response.data.dic_send_type
        this.dicSendGoodsType = response.data.dic_send_goods_type
      })
    },
    // 获取会员列表
    getCustomerList() {
      customerList({ keyword: '' }).then(response => {
        const items = response.data.list
        this.list = items.map(v => {
          this.$set(v, 'value', v.name)
          return v
        })
        this.customerList = this.list
      })
    },
    // 获取赠送基本信息列表
    getSetCategory() {
      getCategory().then(response => {
        this.dicCategory = response.data
      })
    },
    // 选择后获取用户信息
    handleCustomerSelect(item) {
      this.changeData.customer_id = item.id
      this.changeData.customer_sn = item.customer_no
    },
    handleMemberSelect(item) {
      this.changeData.staff_id = item.id
    },
    handleGoodsSelect(item) {
      this.childData.goods_id = item.id
    },
    // 添加赠送内容
    handleChildAdd() {
      // 判断是否已存在
      if (!this.childData.gtype) {
        this.$message({
          message: '请先选择类型',
          type: 'warning'
        })
        return false
      }
      console.log(this.childData)
      if (!this.childData.goods_id) {
        this.$message({
          message: '请先填写名称',
          type: 'warning'
        })
        return false
      }
      if (!this.childData.quantity > 0) {
        this.$message({
          message: '请先填写数量',
          type: 'warning'
        })
        return false
      }
      if (this.childData.index === 0 || this.childData.index > 0) {
        this.changeData.goods_info[this.changeData.index] = this.childData
      } else {
        // 添加至table中
        this.changeData.goods_info.push(
          this.childData
        )
      }
      this.dialogChildVisible = false
      // 清除childData中的数据
      this.childData = {}
    },
    getGoodTypeName(id) {
      var list = this.dicSendGoodsType
      for (var i = 0, len = list.length; i < len; i++) {
        // eslint-disable-next-line eqeqeq
        if (list[i]['value'] == id) { return list[i]['label'] }
      }
      return ''
    },
    handleSubmit() {
      if (!this.changeData.customer_id) {
        this.$message({
          message: '请先选择会员',
          type: 'warning'
        })
        return false
      }
      if (!this.changeData.send_type) {
        this.$message({
          message: '请先选择发送类型',
          type: 'warning'
        })
        return false
      }
      if (!this.changeData.staff_id) {
        this.$message({
          message: '请先选择赠送人',
          type: 'warning'
        })
        return false
      }
      if (this.changeData.goods_info.length === 0) {
        this.$message({
          message: '赠送内容至少添加一条',
          type: 'warning'
        })
        return false
      }
      // 所需提交数据
      var data = {
        customer_id: parseInt(this.changeData.customer_id),
        send_type: parseInt(this.changeData.send_type),
        staff_id: parseInt(this.changeData.staff_id),
        goods_info: this.changeData.goods_info,
        remark: this.changeData.message
      }
      // 进行提交
      tempSendCreate(data).then(response => {
        if (response.code === 200) {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.handleCancel()
        } else {
          this.$message({
            message: response.message,
            type: 'warning'
          })
        }
      })
    },
    openDialog(type, index) {
      if (type === 'create') {
        // -
        this.childData = {}
        this.dialogChildVisible = true
      } else {
        // -
        this.childData = this.changeData.goods_info[index]
        this.childData.index = index
        this.dialogChildVisible = true
      }
    },
    handlerDelectChild(index) {
      this.changeData.goods_info.splice(index, 1)
    },
    handleChildCancel() {
      this.childData = {}
      this.dialogChildVisible = false
    },
    handleCancel() {
      this.$parent.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.temporary-table {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  overflow: hidden;
  .temporary-head {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    border-bottom: 1px solid #dcdfe6;
  }
}
</style>
