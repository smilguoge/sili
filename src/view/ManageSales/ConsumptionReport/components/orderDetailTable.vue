<template>
  <!-- 订单明细: 消耗开单主界面 顾客表格 -->
  <div class="order-detail-table">
    <div class="btnbar">
      <el-button
        type="primary"
        size="small"
        @click="handleOpen('itemSelect')"
      >选择已购项目</el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        @click="handleDelete"
      >删 除</el-button>
    </div>
    <el-table
      ref="mainItemTable"
      v-loading="listLoading"
      :data="itemData"
      height="100%"
      class="item-table"
      border
      fit
      @selection-change="handleSelect"
    >
      <el-table-column
        type="selection"
        width="50px"
        align="center"
      />
      <el-table-column
        align="center"
        label="顾客类型"
      >
        <template slot-scope="{row}">
          <span>{{ handleShow(row.ctype_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="会员姓名"
      >
        <template slot-scope="{row}">
          <span>{{ row.customer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="订单号"
        min-width="140px"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{ row.order_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="项目编码"
        min-width="130px"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{ row.project_code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="项目名称"
        min-width="130px"
      >
        <template slot-scope="{row}">
          <span>{{ row.project_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="套餐名称"
        min-width="130px"
      >
        <template slot-scope="{row}">
          <span>{{ row.card_package_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="总金额"
      >
        <template slot-scope="{row}">
          <span>{{ row.package_price }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="单财"
      >
        <template slot-scope="{row}">
          <span>{{ row.unit_price }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="调整金额"
      >
        <template slot-scope="{row}">
          <span>{{ row.total_adjust_price }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="购买次数"
      >
        <template slot-scope="{row}">
          <span>{{ row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="剩余次数"
      >
        <template slot-scope="{row}">
          <span>{{ row.remain_quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="本次消费次数"
        min-width="110px"
      >
        <template slot-scope="{row}">
          <span>{{ row.choose_quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="耗材小计"
      >
        <template slot-scope="{row}">
          <span>{{ row.subtotal }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="服务技师"
      >
        <template slot-scope="{row, $index}">
          <el-link type="primary" @click="handleOpen('staff', $index)">
            <span>{{ row.staff_id ? row.staff_name : '选择技师' }}</span>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="耗材"
      >
        <template slot-scope="{row, $index}">
          <el-link type="primary" @click="handleOpen('marking', $index)">详 情</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="有效期"
        min-width="220px"
      >
        <template slot-scope="{row}">
          <span>{{ row.effect_start_at | parseTime('{y}-{m}-{d}') }}</span>
          <span>&nbsp; 至 &nbsp;</span>
          <span>{{ row.effect_end_at | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="购买日期"
        min-width="120px"
      >
        <template slot-scope="{row}">
          <span>{{ row.created_at | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="最后护理日期"
        min-width="120px"
      >
        <template slot-scope="{row}">
          <span v-if="row.last_consume">{{ row.last_consume | parseTime('{y}-{m}-{d}') }}</span>
          <span v-if="!row.last_consume">{{ '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="备注"
        min-width="120px"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{ row.name21 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="100"
        fixed="right"
      >
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleEdit(row, $index)">编 辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹框 -->
    <el-dialog
      title="编辑项目信息"
      :visible.sync="editVisible"
      :before-close="handleCancel"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      class="item-edit-dialog"
      width="400px"
    >
      <el-form
        ref="formData"
        label-position="right"
        class="store-dialog-ly"
        :rules="rules"
        :model="formData"
        label-width="90px"
      >
        <el-col :span="22">
          <el-form-item
            label="顾客类型"
            prop="ctype_id"
          >
            <el-select
              v-model="formData.ctype_id"
              class="w100"
              clearable
              placeholder="请选择顾客类型"
              @change="handleSelectChange"
            >
              <el-option
                v-for="item in optionData"
                :key="item.value"
                :label="item.label"
                :value="item.value+''"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item
            label="会员姓名"
            :prop="formData.ctype_id!=3?'':'customer_name'"
          >
            <el-input
              v-model="formData.customer_name"
              :disabled="formData.ctype_id!=3?true:false"
              class="w100"
              :placeholder="formData.ctype_id!=3?'':'请检索会员姓名'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item
            label="项目备注"
            prop="name"
          >
            <el-input
              v-model="formData.remark"
              class="w100"
              type="textarea"
              placeholder="请输入备注信息"
            />
          </el-form-item>
        </el-col>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-col :span="23">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </el-col>
        <div style="clear:both" />
      </div>
      <div style="clear:both" />
    </el-dialog>

    <!-- 选择项目 -->
    <item-select-dialog
      ref="itemSelectDialog"
      v-model="itemVisible"
      :table-data="projectTable"
      @submit="submitItem($event)"
    />
    <!-- 选择技师 -->
    <select-staff-dialog ref="selectStaffDialog" v-model="staffVisible" :list-data="staffData" @submit="handleStaff($event)" />
    <!-- 耗材调整 -->
    <marking-dialog ref="markingDialog" v-model="markingVisible" :list-data="markingData" @submit="handleMarking($event)" />
  </div>
</template>
<script>
import itemSelectDialog from './itemSelectDialog' // 选择项目
import selectStaffDialog from './selectStaffDialog' // 选择技师
import markingDialog from './markingDialog' // 耗材调整
export default {
  name: '',
  components: {
    itemSelectDialog, // 选择项目
    selectStaffDialog,
    markingDialog
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    customerType: {
      type: Array,
      default() {
        return []
      }
    },
    customerData: {
      type: Object,
      default() {
        return {}
      }
    },
    staffList: {
      type: Array,
      default() {
        return []
      }
    },
    markingList: {
      type: Array,
      default() {
        return []
      }
    },
    projectList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // -
      itemData: [], // 主表数据
      formData: {}, // 主表编辑表单
      selectData: [], // 主表多选数据
      projectTable: [], // 已购项目数据
      optionData: [], // 顾客类型
      staffData: [], // 技师数据
      markingData: [], // FIXME: 暂无耗材详细数据
      dataIndex: null, // 当前编辑数据的索引
      rules: {
        ctype_id: [
          {
            required: true,
            message: '请选择顾客类型',
            trigger: 'change'
          }
        ],
        customer_name: [
          {
            required: true,
            message: '请选择会员',
            trigger: 'change'
          }
        ]
      },
      itemVisible: false,
      editVisible: false,
      staffVisible: false,
      markingVisible: false,
      listLoading: false
    }
  },
  watch: {
    value(arr) {
      // 表数据发生变化时取消用户勾选，防止唯一标识失效
      this.$refs.mainItemTable.clearSelection()
      this.itemData = arr
      this.$nextTick(_ => {
        this.$refs.mainItemTable.doLayout()
      }) // 解决Table错位的问题
    },
    customerType(arr) {
      this.optionData = JSON.parse(JSON.stringify(arr))
    },
    staffList(arr) {
      this.staffData = arr
    },
    markingList(arr) {
      this.markingData = arr
    },
    projectList(arr) {
      this.projectTable = arr
    },
    itemData(newArr) {
      /**
       * 给每一条数据添加唯一标识（随机数 + 时间戳），批删用
       * 数组元素添加财耗小计属性
       * 计算财耗总额并更新
       * FIXME: 计算护理积分并更新 （未实现）
       * TODO: 更新从表对应剩余次数
       */
      let totalPrice = 0
      newArr.forEach(ele => {
        const random = Math.floor(Math.random() * 10000)
        const timestamp = random + '' + new Date().getTime()
        ele.subtotal = ele.choose_quantity * ele.unit_price + ele.total_adjust_price
        totalPrice += ele.subtotal
        ele.onlyNum = timestamp
      })
      this.$emit('updateTotal', totalPrice)
      // this.$set(this.customerData, 'total', totalPrice) // 更新财耗总额
    }
  },
  created() {},
  methods: {
    test() {
      // FIXME: 开发用，待删除
      this.$message.info('开发中...')
    },
    // - 顾客类型回显
    handleShow(val) {
      let reslabel
      this.optionData.filter(ele => {
        if (ele.value == val) {
          reslabel = ele.label
        }
      })
      return reslabel
    },
    // - 多选处理
    handleSelect(ele) {
      this.selectData = ele
    },
    // - 批量删除处理
    handleDelete() {
      if (this.selectData.length) {
        this.listLoading = true
        // 删除主表数据
        this.selectData.forEach((item, index) => {
          this.itemData.forEach((itemI, indexI) => {
            if (item === itemI) {
              this.itemData.splice(indexI, 1)
            }
          })
        })
        // 退回品项表数据
        const changeArr = []
        this.selectData.forEach((item, index) => {
          // 保存删除数据ID以及数量
          changeArr.push({
            id: item.sale_card_packagedtl_id,
            num: item.choose_quantity * 1
          })
        })
        /**
         * FIXME: 删除操作数据回退未完成
         */
        changeArr.forEach((item, index) => {
          this.projectTable.forEach((itemI, indexI) => {
            if (item.id === itemI.sale_card_packagedtl_id) {
              const ele = JSON.parse(JSON.stringify(this.projectTable[indexI]))

              // this.projectTable[indexI].remain_quantity += parseInt(item.num)
              ele.remain_quantity += parseInt(item.num)

              this.$set(this.projectTable, indexI, ele)
            }
          })
        })
        changeArr.forEach((item, index) => {
          this.itemData.forEach((itemI, indexI) => {
            if (item.id === itemI.sale_card_packagedtl_id) {
              this.itemData[indexI].remain_quantity += parseInt(item.num)
            }
          })
        })
        // FIXME: 父组件数据更新操作
        // this.$emit('update', this.projectTable)

        this.$refs.mainItemTable.clearSelection()
        this.listLoading = false
      } else {
        this.$message.warning('请先选中数据再删除！')
      }
    },
    // - 打开已购表/技师选择/耗材详细
    handleOpen(type, index) {
      this.dataIndex = index
      if (type === 'itemSelect') {
        this.itemVisible = !this.itemVisible
      } else if (type === 'staff') {
        this.staffVisible = !this.staffVisible
      } else {
        this.markingVisible = !this.markingVisible
      }
    },
    // - 保存编辑
    handleSubmit() {
      this.itemData.splice(this.dataIndex, 1, this.formData)
      this.handleCancel()
    },
    // - 打开编辑
    handleEdit(row, index) {
      this.editVisible = true
      this.dataIndex = index
      this.formData = JSON.parse(JSON.stringify(row))
    },
    // - 关闭编辑
    handleCancel() {
      this.editVisible = false
      this.dataIndex = null
      this.formData = {}
    },
    // - 顾客类型选择判断
    handleSelectChange(val) {
      /**
       * 顾客类型为本人时，会员名称不可用，且自动赋值为当前开单会员名称
       * 顾客类型为嘉宾时，会员名称不可用，
       * 顾客类型为老客时，会员名称可检索数据库会员信息
       */
      if (val == 1) {
        this.formData.customer_name = this.customerData.name
      } else {
        this.formData.customer_name = ''
      }
    },
    submitItem(arr) {
      // - 保存已购表勾选数据
      const arrData = JSON.parse(JSON.stringify(arr))
      arrData.forEach((item, index) => {
        this.itemData.forEach((itemI, indexI) => {
          if (item.sale_card_packagedtl_id === itemI.sale_card_packagedtl_id) {
            this.itemData[indexI].remain_quantity = item.remain_quantity
          }
        })
      })
      if (arr.length) {
        for (let i = 0; i < arrData.length; i++) {
          this.itemData.push(arrData[i])
        }
      }
      this.$refs['itemSelectDialog'].handleCancel()
    },
    // - 保存技师
    handleStaff(obj) {
      /**
       * obj.id 服务技师ID
       * obj.name 服务技师Name
       */
      this.itemData[this.dataIndex].staff_name = obj.name
      this.itemData[this.dataIndex].staff_id = obj.id
      this.dataIndex = null
    },
    // - 保存耗材
    handleMarking() {
      this.test()
    }
  }
}
</script>
<style lang="scss" scoped>
.order-detail-table {
  width: 100%;
  height: 100%;
  min-height: 240px;
  .btnbar {
    border: 1px solid #DCDFE6;
    border-radius: 5px 5px 0 0;
    padding: 10px;
  }
  .item-table {
    width: 100%;
    border: 1px solid #DCDFE6;
    border-top: 0;
    border-radius: 0 0 5px 5px;
  }
}
</style>
