<template>
  <!-- 选择已购项目 -->
  <el-dialog
    title="选择已购项目"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="item-select-dialog"
    width="90%"
  >
    <el-col :span="22" :offset="1">
      <!-- <div class="filter-container">
        <el-button
          type="primary"
          size="mini"
          class="filter-item"
        >高级查询</el-button>
        <el-button
          type="primary"
          size="mini"
        >刷 新</el-button>
        <el-button
          type="primary"
          size="mini"
          class="filter-item"
        >确 定</el-button>
      </div> -->
      <div class="item-select-table">
        <el-table
          ref="itemTable"
          v-loading="listLoading"
          :data="itemTable"
          height="420px"
          class="item-table"
          border
          fit
          :row-class-name="handleRowStyle"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" width="50px" type="selection" :selectable="isSelect" />
          <el-table-column align="center" min-width="170px" show-overflow-tooltip fixed="left" label="订单号">
            <template slot-scope="{row}">
              <span>{{ row.order_name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="130px" show-overflow-tooltip label="套餐名称">
            <template slot-scope="{row}">
              <span>{{ row.card_package_name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="140px" show-overflow-tooltip label="项目编号">
            <template slot-scope="{row}">
              <span>{{ row.project_code }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="140px" show-overflow-tooltip label="项目名称">
            <template slot-scope="{row}">
              <span>{{ row.project_name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="总金额">
            <template slot-scope="{row}">
              <span>{{ row.package_price }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="单财">
            <template slot-scope="{row}">
              <span>{{ row.unit_price }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="调整金额">
            <template slot-scope="{row}">
              <span>{{ row.total_adjust_price }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="购买次数">
            <template slot-scope="{row}">
              <span>{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="剩余次数">
            <template slot-scope="{row}">
              <span>{{ row.remain_quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="120px" label="本次消费次数">
            <template slot-scope="{row}">
              <el-input v-model="row.choose_quantity" v-limit-num size="mini" @input="handleNum(row.remain_quantity, row.choose_quantity, row.sale_card_packagedtl_id)" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="财耗小计">
            <template slot-scope="{row}">
              <!-- 单财 * 消费次数 + 总调整金额（项目调整金额 + 套餐调整金额） -->
              <span>{{ row.choose_quantity * row.unit_price + row.total_adjust_price }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="项目状态">
            <template slot-scope="{row}">
              <el-tag :type="row.status?'success':'danger'">
                <span>{{ row.status?'正常':'已过期' }}</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="220px" label="有效期">
            <template slot-scope="{row}">
              <span>{{ row.effect_start_at | parseTime('{y}-{m}-{d}') }}</span>
              <span>&nbsp; 至 &nbsp;</span>
              <span>{{ row.effect_end_at | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="100px" label="购买日期">
            <template slot-scope="{row}">
              <span>{{ row.created_at | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="110px" label="最后护理日期">
            <template slot-scope="{row}">
              <span v-if="row.last_consume">{{ row.last_consume | parseTime('{y}-{m}-{d}') }}</span>
              <span v-if="!row.last_consume">{{ '' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" show-overflow-tooltip min-width="80px" label="备注">
            <template slot-scope="{row}">
              <span>{{ row.mark }}</span>
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
        <el-button disabled>高级查询</el-button>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </el-col>
      <div style="clear:both" />
    </div>
    <div style="clear:both" />
  </el-dialog>
</template>
<script>
export default {
  name: '',
  directives: {},
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // -
      itemTable: [],
      selectData: [],
      dialogVisible: false,
      listLoading: false,
      flagTime: 0
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    tableData(arr) {
      this.itemTable = JSON.parse(JSON.stringify(arr))
      this.itemTable.forEach(ele => {
        ele.choose_quantity = 0
      })
    }
  },
  created() {},
  methods: {
    handleSubmit() {
      const curr = new Date()
      if (curr - this.flagTime > 1000) {
        /**
         * 提交时执行判断：
         * 是否有选择项目；
         * 所选项是否填写消耗数量；
         * 所选项消耗数量是否超过剩余数量；
         */
        if (this.selectData.length) {
          let state = true
          this.selectData.forEach(ele => {
            if (ele.choose_quantity > ele.remain_quantity || !ele.choose_quantity) {
              state = false
            }
          })
          if (state) {
            // 处理项目扣减
            this.selectData.forEach((item, index) => {
              this.itemTable.forEach((itemI, indexI) => {
                if (item.sale_card_packagedtl_id === itemI.sale_card_packagedtl_id) {
                  item.remain_quantity -= item.choose_quantity
                  this.itemTable.splice(indexI, 1, item)
                }
              })
            })
            this.$emit('submit', this.selectData)
          } else {
            this.$message({
              message: '所选项目 “本次消费次数” 不能超过 “剩余次数”，且 “本次消费次数” 不能为空，请重新检查后再添加！',
              duration: 10000,
              showClose: true,
              type: 'error'
            })
          }
        } else {
          this.$message.warning('请先选择项目后再进行操作！')
        }
        this.flagTime = curr
      }
    },
    handleCancel() {
      /**
       * 清空勾选的项目
       * 清空所有输入框
       */
      this.$parent.itemVisible = false
      this.$refs.itemTable.clearSelection()
      this.selectData = []
      this.itemTable.forEach(ele => {
        ele.choose_quantity = 0
      })
    },
    handleNum(val1, val2, proId) {
      /**
       * 同步修改已勾选数组的数据
       * val1: 剩余次数；
       * val2：消费次数 （输入框数据）；
       * proId: 项目数据唯一ID；
       */
      if (val2 > val1) {
        this.$message.warning('消费次数不能超过剩余次数！')
      }
      if (this.selectData.length) {
        this.selectData.forEach(ele => {
          if (ele.sale_card_packagedtl_id === proId) {
            ele.choose_quantity = val2
          }
        })
      }
    },
    handleSelectionChange(arr) {
      // 表数据多选
      this.selectData = JSON.parse(JSON.stringify(arr))
    },
    isSelect(row, index) {
      /**
       * Table复选框禁用规则
       * state：是否失效
       * remain_quantity: 剩余次数
       * is_choose：是否可选
       */
      if (row.state === 0 || !row.remain_quantity || row.is_choose === 0) {
        return false
      } else {
        return true
      }
    },
    handleRowStyle(row) {
      /**
       * Table隐藏剩余次数为0的项目
       * remain_quantity: 剩余次数 Number
       */
      if (!row.row.remain_quantity) {
        return 'hidden-element'
      }
    }
  }
}
</script>
<style>
.hidden-element {
  display: none;
}
</style>
