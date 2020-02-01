<template>
  <div>
    <div class="how-options">
      <el-form
        ref="optionsForm"
        :model="optionsForm"
        label-width="100px"
        class="con-form"
        :inline="true"
      >
        <div style="display:inline-block">
          <el-form-item label="项目总次数：">
            <el-input v-model="total_num" type="number" />
          </el-form-item>

          <el-form-item label="总金额：">
            <el-input v-model="total_amount" type="number" />
          </el-form-item>
        </div>

        <div class="pcom_type">
          <div class="tit">
            <el-row>
              <span style="padding:0 10px">项目结合</span>
              <el-button @click="handleProjectAdd">新增组合</el-button>
              <el-button @click="handleProjectDel">删除</el-button>
            </el-row>
          </div>
          <div class="tables">
            <div v-for="(item,index) in projectPackge" :key="index" class="m-table">
              <el-form ref="filterForm">
                <div class="m-header">
                  <el-form-item>
                    <el-checkbox v-model="item.checked" style="padding:0 5px" />
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="item.name" />
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="item.total_num" style="width:50px" disabled />选择
                    <el-input v-model="item.select_num" style="width:50px" />
                  </el-form-item>
                  <el-form-item>
                    <el-radio-group v-model="item.is_combination_type">
                      <el-radio :label="0">是否以内</el-radio>
                      <el-radio :label="1">是否固定</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item>
                    <div style="float:right">
                      <el-button @click="openDialogEdit(index, '项目结合')">添加</el-button>
                      <!-- <el-button @click="openDialog('Update')">修改</el-button> -->
                      <!-- <el-button @click="openDialog('Delete')">删除</el-button> -->
                    </div>
                  </el-form-item>
                </div>
                <div class="m-content">
                  <el-table
                    :data="item.detail"
                    border
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column type="selection" min-width="3%" align="center" />
                    <el-table-column align="center" label="品项名称">
                      <template slot-scope="{row}"> {{ row.goods_name }} </template>
                    </el-table-column>
                    <el-table-column align="center" label="最少购买次数">
                      <template slot-scope="{row}">
                        <el-input v-model="row.least_num" placeholder="请输入次数" type="number" />
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="最多购买次数">
                      <template slot-scope="{row}">
                        <el-input v-model="row.atmost_num" placeholder="请输入次数" type="number" />
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否必选">
                      <template slot-scope="{row}">
                        <el-radio-group v-model="row.is_select">
                          <el-radio :label="0">否</el-radio>
                          <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                      <template slot-scope="scope">
                        <el-button @click="handleDelete(index, scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form>
            </div>
          </div>
        </div>

        <div class="pcom_type">
          <div class="tit">
            <el-row>
              <span style="padding:0 10px">赠送项目</span>
              <el-button @click="handleProjectAddTwo">新增组合</el-button>
              <el-button @click="handleProjectDelTwo">删除</el-button>
            </el-row>
          </div>
          <div class="tables">
            <div v-for="(item,index) in givePackge" :key="index" class="m-table">
              <el-form>
                <div class="m-header">
                  <el-form-item>
                    <el-checkbox v-model="item.checked" style="padding:0 5px" />
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="item.name" />
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="item.total_num" style="width:50px" disabled />选择
                    <el-input v-model="item.select_num" style="width:50px" type="number" />
                  </el-form-item>
                  <el-form-item>
                    <el-radio-group v-model="item.is_combination_type">
                      <el-radio :label="0">是否以内</el-radio>
                      <el-radio :label="1">是否固定</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item>
                    项目总次数<el-input v-model="item.project_num" style="width:50px" type="number" />
                  </el-form-item>
                  <el-form-item>
                    <div style="float:right">
                      <el-button @click="openDialogEdit(index, '赠送项目')">添加</el-button>
                      <!-- <el-button @click="openDialog('Update')">修改</el-button> -->
                      <!-- <el-button @click="openDialog('Delete')">删除</el-button> -->
                    </div>
                  </el-form-item>
                </div>
                <div class="m-content">
                  <el-table
                    :data="item.detail"
                    border
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column type="selection" min-width="3%" align="center" />
                    <el-table-column align="center" label="品项名称">
                      <template slot-scope="{row}"> {{ row.goods_name }} </template>
                    </el-table-column>
                    <el-table-column align="center" label="赠送次数">
                      <template slot-scope="{row}">
                        <el-input v-model="row.send_num" placeholder="请输入次数" type="number" />
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否必选">
                      <template slot-scope="{row}">
                        <el-radio-group v-model="row.is_select">
                          <el-radio :label="0">否</el-radio>
                          <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                      <template slot-scope="scope">
                        <el-button @click="handleDeleteTwo(index, scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </el-form>

      <el-row type="flex" class="row-bg" justify="center">
        <el-button @click="resetForm('setmealForm')">取消</el-button>
        <el-button type="primary" @click="submitForm()">保存</el-button>
      </el-row>

      <!-- 选择品项 -->
      <el-dialog title="选择品项" :visible.sync="pcom_dialog" width="50%" :append-to-body="true">
        <div v-if="dataObj.arrType.length > 0" style="margin-bottom: 50px;">
          <el-radio-group v-model="pcom_form.gtype" @change="handleSelect()">
            <el-radio v-for="(item, index) in dataObj.arrType" :key="index" :label="item.code">{{ item.name }}</el-radio>
          </el-radio-group>
          请先选择品项
        </div>
        <el-form v-show="pcom_form.gtype == 1">
          <div class="new-float-left">
            <!-- <el-form-item>
              <el-input v-model="pcom_search" placeholder="请输入内容" prefix-icon="el-icon-search" />
            </el-form-item> -->

            <el-form-item>
              <el-table
                ref="pcom_multipleSelection"
                :data="yesProduct"
                tooltip-effect="dark"
                style="width: 100%"
                border
                height="480"
                @selection-change="handleYesProduct"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="名称" width="120" />
                <el-table-column prop="code" label="编码" />
                <el-table-column prop="sell_price" label="金额(元)" />
              </el-table>
            </el-form-item>
          </div>
          <div class="new-float-left">
            <el-form-item>
              <div class="t-header">
                <span style="margin-left: 10px;">已选择</span>
              </div>
              <el-table
                :data="myProduct"
                tooltip-effect="dark"
                style="width: 100%"
                border
                height="480"
              >
                <el-table-column prop="name" label="名称" width="120" />
                <el-table-column prop="code" label="编码" />
                <el-table-column prop="sell_price" label="金额(元)" />
              </el-table>
            </el-form-item>
          </div>
        </el-form>
        <el-form v-show="pcom_form.gtype == 5">
          <div class="new-float-left">
            <!-- <el-form-item>
              <el-input v-model="pcom_search" placeholder="请输入内容" prefix-icon="el-icon-search" />
            </el-form-item> -->

            <el-form-item>
              <el-table
                ref="pcom_multipleSelection"
                :data="yesProject"
                tooltip-effect="dark"
                style="width: 100%"
                border
                height="480"
                @selection-change="handleYesProject"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="名称" width="120" />
                <el-table-column prop="code" label="编码" />
                <el-table-column prop="sell_price" label="金额(元)" />
              </el-table>
            </el-form-item>
          </div>
          <div class="new-float-left">
            <el-form-item>
              <div class="t-header">
                <span style="margin-left: 10px;">已选择</span>
              </div>
              <el-table
                :data="myProject"
                tooltip-effect="dark"
                style="width: 100%"
                border
                height="480"
              >
                <el-table-column prop="name" label="名称" width="120" />
                <el-table-column prop="code" label="编码" />
                <el-table-column prop="sell_price" label="金额(元)" />
              </el-table>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="pcom_dialog = false">取 消</el-button>
          <el-button type="primary" @click="handleOK">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { apiPutCardPackageDtlUpdate } from '@/api/BaseModule/SalesSet'
export default {
  name: 'Severaloptions',
  data() {
    return {
      pIndex: '', // 选择的下标
      types: '项目结合', // 类型
      yesProduct: [],
      myProduct: [], // 选中的产品
      yesProject: [],
      myProject: [], // 选中的品项
      changdu: 0,
      changduTwo: 0,
      dataObj: {
        arrDetailType: [],
        arrDiscountType: [],
        arrPackage: [],
        arrProduct: [],
        arrProject: [],
        arrType: [],
        bUpdate: false
      },
      card_package_type: 1,
      total_num: 0,
      total_amount: 0,
      recharge: [{ recharge_money: 0, send_money: 0, recharge: 0 }],
      dis: [{ min_num: 0, max_num: 0, discount: 0 }],
      projectPackge: [ // 项目结合
      ],
      givePackge: [ // 赠送项目
      ],
      card_package_id: 10043,
      optionsForm: {
        total_num: '', // -项目总次数
        total_amount: '', // -总金额
        multipleSelection: [],
        pcom: []
      },
      pcom_dialog: false,
      pcom_form: {
        goods_id: '',
        gtype: '',
        goods_name: '',
        least_num: '',
        atmost_num: '',
        is_select: '',
        send_num: '',
        consume_money: ''
      },
      pcom_search: '',
      pcom_multipleSelection: [],
      pcom_tabdata: []
    }
  },
  created() {
    //
  },
  methods: {
    // 新建赠送组合
    handleProjectAddTwo() {
      const obj = {
        ids: '',
        pcom_type: 2,
        checked: false,
        name: '组合1',
        total_num: 0,
        select_num: 0,
        date_num: 0,
        date_type: 0,
        is_combination_type: 0,
        project_num: 0,
        nurse_maximum: 0,
        total_sales: 0,
        consume_money_num: 0,
        detail: []
      }
      if (this.givePackge.length === 0) {
        obj.ids = '组合1'
        obj.name = '组合1'
        this.changduTwo = 1
      } else {
        this.changduTwo++
        obj.ids = '组合' + this.changduTwo
        obj.name = '组合' + this.changduTwo
      }
      this.givePackge.push(obj)
    },
    // 删除赠送组合
    handleProjectDelTwo() {
      this.givePackge = this.givePackge.filter(item => {
        if (!item.checked) {
          return item
        }
      })
    },
    // 新建组合
    handleProjectAdd() {
      const obj = {
        ids: '',
        pcom_type: 1,
        checked: false,
        name: '组合1',
        total_num: 0,
        select_num: 0,
        date_num: 0,
        date_type: 0,
        is_combination_type: 0,
        project_num: 0,
        nurse_maximum: 0,
        total_sales: 0,
        consume_money_num: 0,
        detail: []
      }
      if (this.projectPackge.length === 0) {
        obj.ids = '组合1'
        obj.name = '组合1'
        this.changdu = 1
      } else {
        this.changdu++
        obj.ids = '组合' + this.changdu
        obj.name = '组合' + this.changdu
      }
      this.projectPackge.push(obj)
    },
    // 删除组合
    handleProjectDel() {
      this.projectPackge = this.projectPackge.filter(item => {
        if (!item.checked) {
          return item
        }
      })
    },
    // 选择品项类型
    handleSelect() {
      if (this.pcom_form.gtype === 1) {
        this.yesProduct = this.dataObj.arrProduct
      } else {
        this.yesProject = this.dataObj.arrProject
      }
    },
    // 确定操作
    handleOK() {
      // eslint-disable-next-line no-unused-vars
      const arr = this.myProduct.map(item => {
        this.$set(item, 'gtype', 1)
        this.$set(item, 'goods_id', item.id)
        this.$set(item, 'goods_name', item.name)
        this.$set(item, 'least_num', 0)
        this.$set(item, 'atmost_num', 0)
        this.$set(item, 'is_select', 0)
        this.$set(item, 'send_num', 0)
        this.$set(item, 'consume_money', 0)
        return item
      })
      // eslint-disable-next-line no-unused-vars
      const arrTwo = this.myProject.map(item => {
        this.$set(item, 'gtype', 5)
        this.$set(item, 'goods_id', item.id)
        this.$set(item, 'goods_name', item.name)
        this.$set(item, 'least_num', 0)
        this.$set(item, 'atmost_num', 0)
        this.$set(item, 'is_select', 0)
        this.$set(item, 'send_num', 0)
        this.$set(item, 'consume_money', 0)
        return item
      })
      if (this.types === '项目结合') {
        const newOld = JSON.parse(JSON.stringify(this.projectPackge[this.pIndex].detail))
        const newA = [...newOld, ...arr, ...arrTwo]
        this.projectPackge[this.pIndex].detail = newA
        this.projectPackge[this.pIndex].total_num = this.projectPackge[this.pIndex].detail.length
        this.pcom_dialog = false
      } else {
        const newOld = this.givePackge[this.pIndex].detail
        const newA = [...newOld, ...arr, ...arrTwo]
        this.givePackge[this.pIndex].detail = newA
        this.givePackge[this.pIndex].total_num = this.givePackge[this.pIndex].detail.length
        this.pcom_dialog = false
      }
    },
    // 是否新建还是修改
    init(dataObj, card_package_id) {
      this.card_package_id = card_package_id
      this.dataObj = dataObj
      if (this.dataObj.arrPcom.length > 0) {
        this.projectPackge = this.dataObj.arrPcom
      }
      if (this.dataObj.arrSendPcom.length > 0) {
        this.givePackge = this.dataObj.arrSendPcom
      }
      this.total_num = this.dataObj.total_num
      this.total_amount = this.dataObj.total_amount
    },
    getData() {
      this.optionsForm.pcom = this.list
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleYesProduct(val) {
      this.myProduct = val
    },
    handleYesProject(val) {
      this.myProject = val
    },
    // 添加产品等
    openDialogEdit(index, types) {
      this.pIndex = index
      this.types = types
      this.pcom_dialog = true
    },
    // 删除产品等
    handleDelete(index, ind) {
      this.projectPackge[index].detail.splice(ind, 1)
    },
    // 删除赠送产品等
    handleDeleteTwo(index, ind) {
      this.givePackge[index].detail.splice(ind, 1)
    },
    openDialog(type) {
      switch (type) {
        case 'Add':
          this.pcom_dialog = true
          break
        case 'Update':
          this.pcom_dialog = true
          break
        case 'Delete':
          this.$confirm('是否确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(() => {})
          break
      }
    },
    submitForm(formName) {
      if (this.givePackge.length > 0 || this.projectPackge.length > 0) {
        const newarr = [...this.givePackge, ...this.projectPackge]
        const query = {
          card_package_id: this.card_package_id,
          card_package_type: 1,
          total_num: this.total_num,
          total_amount: this.total_amount,
          recharge: this.recharge,
          dis: this.dis,
          pcom: newarr
        }
        apiPutCardPackageDtlUpdate(query).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.yesProduct = []
          this.myProduct = []
          this.yesProject = []
          this.myProject = []
          this.changdu = 0
          this.changduTwo = 0
          this.dataObj = {
            arrDetailType: [],
            arrDiscountType: [],
            arrPackage: [],
            arrProduct: [],
            arrProject: [],
            arrType: [],
            bUpdate: false
          }
          this.card_package_type = 1
          this.total_num = 0
          this.total_amount = 0
          this.projectPackge = []
          this.givePackge = []
          this.$emit('handleOff')
        })
      } else {
        this.$message('请选择组合!')
      }
    },
    resetForm(formName) {
      const data = {
        radiotype: '',
        isShow: true
      }
      this.$emit('options', data)
    }
  }
}
</script>
<style lang="scss">
.m-header {
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
<style lang="scss" scoped>
.con-form {
  padding: 20px;
  .pcom_type {
    margin-bottom: 10px;
  }
  .m-chk-input {
    width: 250px;
  }
  .tit {
    border-top: 1px solid #dfe6ec;
    border-left: 1px solid #dfe6ec;
    border-right: 1px solid #dfe6ec;
    line-height: 60px;
    background-color: #e4e7ed;
  }
  .tables {
    border: 1px solid #dfe6ec;
    padding: 10px;
  }
  .m-table {
    margin-bottom: 10px;
    .m-header {
      padding: 10px;
      border-top: 1px solid #dfe6ec;
      border-left: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
    }
  }
  .h-content {
    padding: 10px 15px;
    .t-header {
      border-top: 1px solid #dfe6ec;
      border-left: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      line-height: 60px;
    }
    .header-btns {
      float: right;
      padding-right: 10px;
    }
  }
}
.selectbox {
  width: 300px;
  height: 330px;
  border: 1px solid rgb(187, 187, 187);
  border-radius: 5px;
  .tit {
    line-height: 45px;
    padding-left: 15px;
    border-bottom: 1px solid rgb(187, 187, 187);
  }
  .radio-group {
    padding: 20px;
  }
  .radio-block {
    display: block;
    padding: 10px;
    padding-left: 30px;
  }
  .btns {
    float: right;
    padding-right: 20px;
  }
}
.m-chk-input {
  width: 200px;
}
.t-header {
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  line-height: 40px;
}
</style>
