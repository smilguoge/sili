<template>
  <el-drawer
    class="dialog-wrap-ly"
    direction="rtl"
    size="100%"
    close-on-press-escape
    :show-close="false"
    :wrapper-closable="false"
    :append-to-body="false"
    :modal="false"
    :visible.sync="drawerVisible"
    :before-close="handleCancel"
  >
    <div id="printTest">
      <div class="stror-box">
        <div class="close" @click="handleCancel">
          <i class="iconfont icon-shouqi1" />
        </div>

        <div class="lpsty1">
          <el-button type="primary" size="small">打印</el-button>
          <el-button type="primary" size="small">导出</el-button>
        </div>
        <div class="dw-wrap">
          <div ref="changeData" class="store-dialog-ly">
            <div v-show="dialogstatus =='update'" class="psty3">
              <p class="pstys2">
                <span>单据号：</span>
                <el-input v-model="tempdata.document_no" :disabled="true" />
              </p>
              <p class="pstys2">
                <span>门店：</span>
                <el-input v-model="tempdata.shopname" :disabled="true" />
              </p>
              <p class="pstys3">
                <span>操作人：</span>
                <el-input v-model="tempdata.operator" :disabled="true" />
              </p>
              <p style="width:250px;line-height: 35px;">
                <span>操作时间：</span>

                <span
                  v-if="tempdata.updated_at!==0"
                >{{ tempdata.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </p>
            </div>
            <div class="psty2">
              <p class="pstys2">
                <span class="starimg1">出库类型：</span>
                <el-select
                  v-model="temp.stock_type"
                  filterable
                  clearable
                  placeholder="请选择"
                  :disabled="!dialogture"
                  @change="changevalue"
                >
                  <el-option
                    v-for="item in tempdata.arrType"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </p>
              <p v-if="temp.stock_type==8" class="pstys2">
                <span class="starimg1">供应商名字：</span>
                <el-select
                  v-model="temp.supplier_id"
                  filterable
                  clearable
                  placeholder="请选择"
                  :disabled="!dialogture"
                  @change="changeapp"
                >
                  <el-option
                    v-for="item in arrSupplier"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </p>
              <p v-if="temp.stock_type==8" class="pstys2">
                <span class="starimg1">供应商编号：</span>
                <el-input v-model="suppliercode" type="text" :disabled="true" />
              </p>
              <p v-if="temp.stock_type==1 || temp.stock_type==5" class="pstys2">
                <span class="starimg1">对方单位：</span>
                <el-select
                  v-model="temp.out_stock_shop"
                  filterable
                  clearable
                  placeholder="请选择"
                  prop="out_stock_shop"
                  :disabled="!dialogture"
                >
                  <el-option
                    v-for="item in tempdata.arrShop"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </p>
              <p v-if="((temp.stock_type==3)||(temp.stock_type==4))" class="pstys2">
                <span class="starimg1">对方单位：</span>
                <el-input v-model="temp.out_stock_company" type="text" :disabled="!dialogture" />
              </p>

              <p v-if="temp.stock_type==2" class="pstys2">
                <span class="starimg1">领用人：</span>
                <el-input v-model="temp.out_stock_staff" type="text" :disabled="!dialogture" />
              </p>
              <p v-if="temp.stock_type==6" class="pstys2">
                <span class="starimg1">经办人：</span>
                <el-input v-model="temp.out_stock_staff" type="text" :disabled="!dialogture" />
              </p>
              <p v-if="temp.stock_type==7" class="pstys2">
                <span class="starimg1">取货码：</span>
                <el-input
                  v-model="temp.take_code"
                  type="text"
                  size="small"
                  :disabled="!dialogture"
                />
              </p>
              <p
                v-show="(((dialogstatus =='update')&&(temp.stock_type==1)) || ((dialogstatus =='update')&&(temp.stock_type==5)))"
                class="pstys3"
              >
                <span>收货人：</span>
                <el-input v-model="tempdata.receiving_staff" :disabled="true" />
              </p>
              <p v-show="(dialogstatus =='update')&&(temp.stock_type==4)" class="pstys3">
                <span>审核人：</span>
                <el-input v-model="tempdata.audit_staff" :disabled="true" />
              </p>
              <p v-show="(dialogstatus =='update')&&(temp.stock_type==1)" class="pstys4">
                <span>到货时间：</span>
                <span
                  v-if="tempdata.receiving_at!==0"
                >{{ tempdata.receiving_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </p>
            </div>
            <div class="psty5">
              备注：
              <el-input
                v-model="temp.remark"
                type="textarea"
                placeholder="请输入备注"
                prop="mark"
                :disabled="!dialogture"
              />
              <p style="margin-left:10px;">打印状态:{{ tempdata.print_status ? '已打印':'未打印' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="psconte-btn">
        <p class="pscon2">明细表</p>
        <!-- <el-button v-if="temp.stock_type==8" size="small" @click="addorder">选择采购单</el-button> -->
        <el-button v-if="tempdata.status!==6" size="small" @click="handleAddinf">新增明细</el-button>
        <el-button v-if="tempdata.status!==6" size="small" @click="deleinf">删除明细</el-button>
      </div>
      <el-scrollbar class="scroll-ly psconte" style="height:calc(100vh - 500px)">
        <el-table
          ref="multipleTable"
          :data="temp.detail"
          border
          class="selectable"
          @selection-change="handleChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column label="序号" width="60" prop="id" />
          <el-table-column prop="code" label="产品编码" width="80" />
          <el-table-column prop="name" label="产品全称" width="80" />
          <el-table-column prop="product_class_name" label="产品类别" width="80" />
          <el-table-column
            v-if="((temp.stock_type==2) || (temp.stock_type==4))"
            prop="stock"
            label="当前库存"
            width="80"
            :disabled="shownum"
          />
          <el-table-column prop="specs" label="规格" width="60" />
          <el-table-column
            v-if="dialogstatus!=='create'"
            prop="require_quantity"
            label="请货数量"
            width="80"
            :disabled="shownum"
          />
          <el-table-column prop="dic_unit" label="单位" width="60" />
          <el-table-column prop="quantity" label="发货数量" width="80">
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantity" placeholder="数量" :disabled="shownum" />
            </template>
          </el-table-column>
          <el-table-column prop="warehouse_id" label="仓库" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.warehouse_id" placeholder="请选择" :disabled="!bCanUpdate">
                <el-option
                  v-for="item in tempdata.arrWarehouse"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" class="remark1" width="auto">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.remark"
                placeholder="请输入备注"
                size="mini"
                :disabled="!bCanUpdate"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <div class="footer-btn">
      <el-button v-if="bCanUpdate" @click="handleCancel">取 消</el-button>
      <el-button
        v-if="bCanUpdate"
        type="primary"
        class="footer-btn1"
        @click="dialogstatus==='create'?createstroge():updatestroge()"
      >提交</el-button>
      <el-button v-if="tempdata.status==1" type="primary" @click="handlecheck">确定调拨</el-button>
      <el-button
        v-if="((temp.stock_type==6)&&(tempdata.status==4)) || ((temp.stock_type==4)&&(tempdata.status==4))"
      >退回</el-button>
      <el-button
        v-if="((temp.stock_type==6)&&(tempdata.status==4)) || ((temp.stock_type==4)&&(tempdata.status==4))"
        type="primary"
        @click="handleagreen"
      >同意</el-button>
    </div>
    <el-dialog
      :title="dotitle"
      :visible.sync="dialogFormVisible"
      :close-on-press-escape="dialogEsc"
      :close-on-click-modal="dialogEsc"
      append-to-body
      width="1200px;"
      style="margin-bottom:30px; margin-top:10vh;"
    >
      <div class="checkinput1">
        <el-input v-model="checkinput" placeholder="请输入内容" class="checkinput" clearable />
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="getproinflist"
        >查询</el-button>
      </div>
      <el-scrollbar class="scroll-ly2 psconte2">
        <el-table ref="mTable" :data="tempproinf" style @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="产品编码" width="60" prop="code" />
          <el-table-column prop="product_class_name" label="产品类型" />
          <el-table-column prop="name" label="产品全称" />
          <el-table-column prop="product_class_name" label="产品简称" />
          <el-table-column prop="specs" label="规格" />
          <el-table-column prop="stock" label="库房存量" />
          <el-table-column prop="dic_unit" label="单位" />
        </el-table>
      </el-scrollbar>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updatpromore">确定</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog
      :title="dotitle1"
      :visible.sync="dialogFormVisible4"
      :close-on-press-escape="dialogEsc"
      :close-on-click-modal="dialogEsc"
      append-to-body
      width="1200px"
      style="margin-bottom:30px; margin-top:10vh;"
    >
      <div class="orderlist">
        <div class="orderlist1">
          <div class="orderlist3">
            <el-input v-model="checkorder" placeholder="请输入内容" clearable width="150" />
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="getorderlist"
            >查询</el-button>
          </div>
          <el-scrollbar style="max-height:300px" class="orderlist4">
            <el-table :data="temporderlist" style="width: 100%">
              <el-table-column prop="document_no" label width="auto">
                <template slot-scope="scope">
                  <div type="text" @click="pushorderlist(scope.row)">{{ scope.row.document_no }}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </div>
        <div class="orderlist2">
          <p class="orderlist2p">采购入库单明细</p>
          <el-scrollbar style="max-height:300px">
            <el-table ref :data="temporderinf" style @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column label="产品编码" width="60" prop="product_code" />
              <el-table-column prop="product_class_name" label="产品名称" />
              <el-table-column prop="supplier_name" label="供应商" width="60" />
              <el-table-column prop="product_specs" label="规格" width="60" />
              <el-table-column prop="quantity" label="数量" width="60" />
              <el-table-column prop="product_dic_unit" label="单位" width="60" />
              <el-table-column prop="operator" label="操作人" />
              <el-table-column prop="updated_at" label="操作时间" />
              <el-table-column prop="remark" label="备注" />
            </el-table>
          </el-scrollbar>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updatpromore">确定</el-button>
      </div>
    </el-dialog> -->
  </el-drawer>
</template>

<script>
import {
  getNewStock,
  editStock,
  getProductNum,
  updateStock,
  createStock,
  stockCancel,
  stockConfirm,
  stockReject,
  stockAgree,
  addOrderList
} from '@/api/ManageGoods/PutOutStorage'
export default {
  name: 'EditTable',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    getData: {
      type: Object,
      required: true
    },
    dialogstatus: {
      type: String,
      required: true
    },
    orderstate: {
      type: String,
      required: true
    },
    putid: {
      type: Number,
      required: true,
      default: -1
    },
    stocklist: {
      type: Array,
      // default: function () { return [] }
      default: () => []
    },
    bCanUpdate: {
      type: Boolean
    }
  },
  data() {
    return {
      shownum: false,
      changeorderlist: [],
      temporderinf: [],
      temporderlist: [],
      checkorder: '',
      dialogFormVisible4: false,
      orderlist: [],
      listindex: [],
      suppliercode: '',
      arrSupplier: [],
      showbtn2: '',
      showbtn: true,
      // bCanUpdate: true,
      bUpdateWarehouse: 0,
      dotitle: '产品选择表',
      dotitle1: '选择采购单',
      tempdata: {
        arrType: [],
        arrWarehouse: [],
        out_stock_shop: 0,
        purchase_order: '',
        supplier_id: 0,
        remark: '',
        detail: []
      },
      temp: {
        id: '',
        purchase_order: '',
        stock_type: '',
        out_stock_shop: '',
        remark: '',
        detail: [],
        take_code: '',
        out_stock_staff: '',
        out_stock_company: '',
        supplier_id: ''
      },
      drawerVisible: false,
      changeData: {},
      flagTime: 0,
      dialogture: true,
      dialogFormVisible: false,
      dialogEsc: false,
      checkinput: '',
      proinflist: {},
      tempproinf: {},
      changedata: {},
      changearray: [],
      checkproinf: []
    }
  },
  watch: {
    value(val) {
      this.drawerVisible = val
      this.$emit('mark', val)
    },
    putid(val) {
      if (val == 0) {
        // this.bCanUpdate = true
        this.getNewStock()
      } else {
        this.editStock(val)
      }
    },
    getData(val) {
      this.changeData = val
    },
    dialogstatus(val) {
      if (val == 'create') {
        this.getNewStock()
      }
      if (val == 'create') {
        this.dialogture = true
      } else {
        this.dialogture = false
      }
    }
  },
  created() {
    if (this.$parent.dialogStatus == 'create') {
      this.getNewStock()
    }
  },
  methods: {
    pushorderlist(row) {
      if (this.temporderinf.indexOf(row) == -1) {
        console.log(row)
        this.temporderinf.push(row)
        console.log(this.temporderinf)
      }
    },
    addorder() {
      addOrderList().then(response => {
        console.log(response.data)
        this.orderlist = response.data
        this.temporderlist = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      this.dialogFormVisible4 = true
    },
    changeapp(value) {
      const data = this.arrSupplier.filter(item => {
        return item.id == value
      })
      this.suppliercode = data[0].code

      console.log()
    },
    changevalue() {
      this.temp.purchase_order = ''
      this.out_stock_shop = ''
      this.take_code = ''
      this.temp.out_stock_staff = this.$store.getters.member.name
      this.out_stock_company = ''
    },
    handlereject() {
      const data = { id: this.putid }
      stockReject(data).then(response => {
        this.$message({
          message: '退回',
          type: 'success'
        })
      })
      this.$emit('clear')
      this.$parent.getList()
    },
    handleagreen() {
      const data = { id: this.putid }
      stockAgree(data).then(response => {
        this.$message({
          message: '同意',
          type: 'success'
        })
      })
      this.$emit('clear')
      this.$parent.getList()
    },
    handlecheck() {
      const data = { id: this.putid }
      stockConfirm(data).then(response => {
        this.$message({
          message: '确定到货成功',
          type: 'success'
        })
      })
      this.$emit('clear')
      this.$parent.getList()
    },
    createstroge() {
      console.log(this.temp)
      if (this.temp.stock_type == '') {
        this.$message({
          title: '错误',
          message: '出库类型没有选择',
          type: 'error'
        })
      } else if (this.temp.detail.length > 0) {
        const upstate = this.temp.detail.some(item => {
          return item.warehouse_id == ''
        })
        const quanstate = this.temp.detail.some(item => {
          return item.quantity == 0
        })
        console.log(upstate)
        if (upstate) {
          this.$message({
            title: '错误',
            message: '产品还没添加仓库',
            type: 'error'
          })
        } else if (quanstate) {
          this.$message({
            title: '错误',
            message: '发货数不能为0',
            type: 'error'
          })
        } else {
          const status1 = this.temp.stock_type
          const supplie = (this.temp.supplier_id == '')
          const outstock = (this.temp.out_stock_shop == '')
          const outcompany = (this.temp.out_stock_company == '')
          const outstaff = (this.temp.out_stock_staff == '')
          const takecode = (this.temp.take_code == '')
          if (status1 == 8 && supplie) {
            this.$message({
              title: '错误',
              message: '供应商名字不能为空',
              type: 'error'
            })
          } else if ((status1 == 1 || status1 == 5) && outstock) {
            this.$message({
              title: '错误',
              message: '对方单位不能为空',
              type: 'error'
            })
          } else if ((status1 == 3 || status1 == 4) && outcompany) {
            this.$message({
              title: '错误',
              message: '对方单位不能为空',
              type: 'error'
            })
          } else if (status1 == 2 && outstaff) {
            this.$message({
              title: '错误',
              message: '领用人不能为空',
              type: 'error'
            })
          } else if (status1 == 6 && outstaff) {
            this.$message({
              title: '错误',
              message: '经办人不能为空',
              type: 'error'
            })
          } else if (status1 == 7 && outstaff) {
            this.$message({
              title: '错误',
              message: '取货码不能为空',
              type: 'error'
            })
          } else {
            createStock(this.temp).then(response => {
              this.$emit('clear')
              this.$message({
                title: '成功',
                message: '创建成功',
                type: 'success'
              })
              this.temp.detail = []
              this.temp.purchase_order = ''
              this.temp.stock_type = ''
              this.temp.out_stock_shop = ''
              this.temp.remark = ''
              this.temp.take_code = ''
              this.temp.out_stock_staff = ''
              this.changedata = []
              this.temp.out_stock_company = ''
              // this.$refs.multipleTable.clearSelection()
              this.$parent.getList()
            })
          }
        }
      } else {
        this.$message({
          title: '错误',
          message: '没有添加产品明细',
          type: 'error'
        })
      }
    },
    updatestroge() {
      console.log(this.temp.detail)
      const upstate = this.temp.detail.some(item => {
        return item.warehouse_id == ''
      })
      const quanstate = this.temp.detail.some(item => {
        return item.quantity == 0
      })
      if (this.temp.detail.length > 0) {
        if (upstate) {
          this.$message({
            title: '错误',
            message: '产品还没添加仓库',
            type: 'error'
          })
        } else if (quanstate) {
          this.$message({
            title: '错误',
            message: '发货数量不能为0',
            type: 'error'
          })
        } else {
          updateStock(this.temp).then(response => {
            this.$emit('clear')
            this.$message({
              title: '修改',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.temp.out_stock_staff = this.$store.getters.member.name
            this.out_stock_company = ''
            // this.temp.detail = []
            this.temp.purchase_order = ''
            this.temp.stock_type = ''
            this.temp.out_stock_shop = ''
            this.temp.remark = ''
            this.temp.take_code = ''
            this.temp.out_stock_staff = ''
            this.changedata = []
            this.temp.out_stock_company = ''
            // this.$refs.multipleTable.clearSelection()
            this.$parent.getList()
          })
        }
      } else {
        this.$message({
          title: '错误',
          message: '没有添加产品明细',
          type: 'error'
        })
      }
    },
    deleinf() {
      this.checkproinf.forEach(item => {
        const id = item.id
        this.temp.detail.forEach((item, index) => {
          if (id == item.id) {
            this.temp.detail.splice(index, 1)
          }
        })
      })
    },
    handleChange(val) {
      this.checkproinf = val
    },
    updatpromore() {
      let tempchangedata=this.changedata
      tempchangedata.forEach((item, index) => {
        this.$set(
          tempchangedata[index],
          'product_id',
          this.changedata[index].id
        )
        this.$set(
          tempchangedata[index],
          'warehouse_id',
          this.tempdata.arrWarehouse[0].id
        )
        this.$set(tempchangedata[index], 'quantity', 0)
      })
      const templist = []
      tempchangedata.forEach((item1, index) => {
        let arrtrue = this.temp.detail.some(item2 => {
          return item1.code == item2.code
        })
        if (!arrtrue) {
          const data=Object.assign({},item1)
          templist.push(data)
        }
      })
      this.dialogFormVisible = false
      if (this.temp.detail.length > 0) {
        templist.forEach(item=>{
          this.temp.detail.push(item)
        })
      } else {
        this.temp.detail = templist
      }

    },
    getproinflist() {
      const str1 = this.checkinput
      const templist = []
      this.proinflist.forEach(function(item) {
        if (item.code.indexOf(str1) != -1) {
          templist.push(item)
        }
        if (item.name.indexOf(str1) != -1) {
          templist.push(item)
        }
      })
      this.tempproinf = templist
    },
    getorderlist() {
      const str1 = this.checkorder
      const templist = []
      console.log(this.temporderlist)
      console.log(this.orderlist)
      this.orderlist.forEach(function(item) {
        if (item.document_no.indexOf(str1) != -1) {
          templist.push(item)
        }
      })
      this.temporderlist = templist
    },
    handleSelectionChange(val) {
      this.changedata = val
      const changea = []
      this.changedata.forEach(function(item) {
        changea.push(item.id)
      })
      this.changearray = changea
      this.listindex = []
      changea.forEach(item => {
        this.proinflist.forEach((item2, index) => {
          if (item.code == item2.code) {
            this.listindex.push(index)
          }
        })
      })
    },
    handleSelectionChange1(val) {
      this.changeorderlist = val
      // const changea = []
      // this.changeorderlist.forEach(function(item) {
      //   changea.push(item.id)
      // })
      // this.changearray = changea
    },
    handleAddinf() {
      console.log(this.listindex)
      const arr1 = []
      this.listindex.forEach(item => {
        const str1 = this.tempproinf[item]
        arr1.push(str1)
      })
      console.log(arr1)
      console.log('arr1')
      // [tableData[1], tableData[2]]
      this.dialogFormVisible = true
      setTimeout(() => {
        this.toggleSelection(arr1)
      }, 500)
    },
    toggleSelection(rows) {
      rows.forEach(row => {
        this.$refs.mTable.toggleRowSelection(row)
      })
    },
    getNewStock() {
      getNewStock().then(response => {
        this.tempdata = response.data
        this.proinflist = response.data.arrProduct
        this.tempproinf = response.data.arrProduct
        this.arrSupplier = response.data.arrSupplier
        this.temp.detail = []
        this.temp.stock_type = ''
        this.temp.out_stock_staff = this.$store.getters.member.name
        this.changedata = ''
        this.shownum = false
        setTimeout(() => {
          this.$refs.mTable.clearSelection()
        }, 5000)
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    editStock(id) {
      const data = { id: id }
      editStock(data).then(response => {
        this.tempdata = response.data
        this.proinflist = response.data.arrProduct
        this.tempproinf = response.data.arrProduct
        this.arrSupplier = response.data.arrSupplier
        this.temp.detail = response.data.arrDetail
        this.temp.stock_type = response.data.stock_type
        this.temp.out_stock_shop = response.data.out_stock_shop
        this.temp.out_stock_staff = response.data.out_stock_staff
        this.temp.id = id
        this.bCanUpdate = response.data.bCanUpdate
        if (response.data.status == 6) { this.shownum = true }
        this.bUpdateWarehouse = response.data.bUpdateWarehouse
        // this.showbtn = this.bCanUpdate == true || dialogstatus == 'create'
        // this.showbtn2 = this.orderstate == '未发货'
        this.listindex = []
        this.temp.detail.forEach(item => {
          response.data.arrProduct.forEach((item2, index) => {
            if (item.code == item2.code) {
              this.listindex.push(index)
            }
          })
        })
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleCancel() {
      this.$emit('clear')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.changeData = {}
    }
  }
}
</script>

<style lang="scss" scope>
.orderlist2p {
  border-bottom: 1px solid #e5e5e5;
  padding-left: 20px;
  padding-bottom: 15px;
}
.orderlist1 {
  border: 1px solid #e5e5e5;
  padding-top: 20px;
}
.orderlist4 {
  width: 100%;
}
.orderlist2 {
  border: 1px solid #e5e5e5;
}
.orderlist3 {
  margin-left: 20px;
  margin-right: 20px;
  width: 300px;
  display: flex;
}
.orderlist3 .el-input {
  margin-right: 20px;
  width: 150px;
}
.orderlist {
  display: flex;
  justify-content: space-evenly;
}
.starimg1::before {
  content: "*";
  position: absolute;
  color: #f56c6c;
  line-height: 10px;
  margin-top: 4px;
  margin-left: -8px;
}
.pstyname .el-input {
  width: 100px;
}
.pgsty9 {
  padding-left: 5px;
}
.pstys2 span {
  width: 100px;
  text-align: right;
  display: inline-block;
}
.pstys2 .el-input {
  width: 130px;
  margin-right: 20px;
}
.pstys3 .el-input {
  width: 100px;
  margin-right: 20px;
}
.stispty1 {
  border: 1px solid #dcdfe6;
}
.store-dialog-ly {
  width: 100%;
}
.psty6 .el-input {
  display: inline-block;
  width: 130px;
}
.psty6 span {
  display: inline-block;
}
.psty3,
.psty2 {
  display: flex;
  text-align: left;
}
.psty3 p {
  margin-bottom: 0px;
}
.psty4 {
  width: 250px;
}

.psty5 {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.psty5 .el-textarea {
  display: inline-block;
  margin-left: 10px;
  width: 60%;
}
.stoke1 {
  width: 180px;
}
.pscon2 {
  float: left;
  margin-top: 12px;
}
.el-dialog__header {
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
}
.psty2 {
  display: flex;
  align-items: center;
}
.checkinput1 {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
}
.checkinput {
  width: 400px;
  margin-right: 80px;
}
.scroll-ly2 {
  height: 400px;
  width: 100%;
}
.psconte-btn {
  padding-top: 15px;
  border-top: 1px solid #e5e5e5;
  padding-right: 20px;
  text-align: right;
  padding-bottom: 15px;
  padding-left: 20px;
  margin-left: 20px;
}
.footer-btn {
  text-align: right;
  margin-top: 20px;
  margin-right: 20px;
}
.psconte {
  padding-left: 20px;
  margin-right: 20px;
  margin-right: 20px;
}
.lpsty1 {
  margin-top: 15px;
  text-align: right;
  padding-right: 30px;
  padding-bottom: 15px;
  margin-bottom: 5px;
  border-bottom: 1px solid #e5e5e5;
}
.scroll-ly {
  // overflow-x: hidden;
  width: 100%;
  margin-right: 15px;
  padding-right: 20px;
}
.dialog-wrap-ly {
  position: fixed;
  font-size: 14px;
  height: 100%;
  top: 100px;
  // overflow-y: hidden;
  // overflow-y: scroll;
  // overflow: hidden;
  // overflow-y: scroll;
  // position: fixed;
  // // position:absolute;
  // height: 100%;
  // top: 100px;
  .el-drawer__header {
    display: none;
  }
  .el-drawer__body {
    height: calc(100% - 70px);
  }
  .dw-wrap {
    padding-left: 18px;
    padding-right: 18px;
    color: #606266;
    margin-left: 20px;
    text-align: left;
    display: flex;
    align-items: center;
    .el-row {
      margin-bottom: 20px;
    }
    label {
      font-weight: normal;
    }
    .el-form-item__label {
      text-align: left;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
.close {
  height: calc(100% - 70px);
  position: fixed;
  top: 100px;
  z-index: 9999;
  width: 20px;
  float: left;
  background-color: #e4e7ed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
}
.el-table th > .cell {
  font-size: 14px;
  font-weight: normal;
}

.selectable {
  margin-left: 15px;

  margin-right: 15px;
}
.selectable .cell {
  text-align: center;
}
</style>
<style lang="css">
.store-dialog-ly .el-form-item__error {
  width: 210px;
}
</style>
