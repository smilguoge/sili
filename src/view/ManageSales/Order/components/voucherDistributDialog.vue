<template>
  <!-- 业绩分配-代金券 -->
  <el-dialog
    title="选择销售人员"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="voucher-dis-dialog"
    width="700px"
  >

    <el-col :span="22" :offset="1">
      <div class="filter-container">
        <el-select
          v-model="positionSelect"
          placeholder="请选择职务"
          class="filter-item filter-input"
          @change="changePosition"
        >
          <el-option v-for="(item,index) in position" :key="index" :label="item.name" :value="item.id" />
        </el-select>
        <el-select
          v-model="moneylistSelect"
          placeholder="请选择员工"
          class="filter-item filter-input"
        >
          <el-option v-for="(item,index) in moneylist" :key="index" :label="item.name" :value="item.id" />
        </el-select>
        <el-button
          type="primary"
          size="small"
          class="filter-item"
          @click="handleCreate"
        >添 加</el-button>
        <el-button
          type="primary"
          size="small"
          class="filter-item"
          style="margin-left: 10px"
          @click="handleDelete"
        >删 除</el-button>
      </div>
    </el-col>
    <el-col :span="22" :offset="1">
      <div class="distribution-table">
        <el-table
          :data="selectList"
          style="width:100%"
          height="260px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50px"
            align="center"
          />
          <el-table-column
            label="职务"
            align="center"
          >
            <template slot-scope="{row}">
              <span class="info-color">{{ row.position }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="姓名"
            align="center"
          >
            <template slot-scope="{row}">
              <span class="info-color">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="次数"
            align="center"
          >
            <template slot-scope="{row}">
              <span class="info-color">{{ row.lottery }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <div style="clear:both" />
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-col :span="23">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmission"
        >确 定</el-button>
      </el-col>
      <div style="clear:both" />
    </div>
  </el-dialog>
</template>
<script>
import { MoneylistGet } from '@/api/home'
import { getPosition } from '@/api/BaseModule/SetManage'
import { staffLotteryCreate } from '@/api/ManageSales/voucher.js'
export default {
  name: '',
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    goodsInfo: {
      type: Array,
      default() {
        return []
      }
    },
    customerId: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      // -
      positionSelect: '',
      moneylistSelect: '',
      position: {},
      moneylist: {},
      selectList: [],
      selectIds: [],
      queryData: {},
      voucherData: {
        table: []
      },
      dialogVisible: false
    }
  },
  computed: {
    voucherCount() {
      var count = 0
      for (let index = 0; index < this.goodsInfo.length; index++) {
        count += parseInt(this.goodsInfo[index]['quantity'])
      }
      return count
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (this.dialogVisible) {
        this.positionSelect = ''
        this.moneylistSelect = ''
        this.selectIds = []
        this.selectList = []
        this.getPosition()
      }
    }
  },
  created() {
    // -
  },
  methods: {
    // 获取职务
    getPosition() {
      getPosition().then(res => {
        var template = []
        if (res.data.positions.length > 0) {
          for (let index = 0; index < res.data.positions.length; index++) {
            if (index === 0) {
              this.positionSelect = res.data.positions[index]['id']
              this.getMoneylistGet()
            }
            template.push({
              id: res.data.positions[index]['id'],
              name: res.data.positions[index]['name']
            })
          }
        }

        this.position = template
        // 获取员工
      })
    },
    // 获取员工
    getMoneylistGet() {
      MoneylistGet({ position_id: this.positionSelect }).then(res => {
        var template = []
        for (let index = 0; index < res.data.length; index++) {
          template.push({
            id: res.data[index]['id'],
            name: res.data[index]['name']
          })
        }
        this.moneylist = template
      })
    },
    // changePosition
    changePosition() {
      this.getMoneylistGet()
      this.moneylistSelect = ''
    },
    handleCreate() {
      // 判断是否已存在
      if (this.moneylistSelect > 0) {
        if (this.selectList.length > 0) {
          for (let index = 0; index < this.selectList.length; index++) {
            if (this.selectList[index]['id'] === this.moneylistSelect) {
              this.$message({
                message: '该用户已存在',
                type: 'warning'
              })
              return false
            }
          }
        }
        this.selectList.push({
          id: this.moneylistSelect,
          position_id: this.positionSelect,
          position: this.positionName(),
          staff_id: this.moneylistSelect,
          name: this.moneyName(),
          lottery: 0
        })
        this.handlerSelectNumber()
      } else {
        this.$message({
          message: '请先选择一名用户',
          type: 'warning'
        })
      }
    },
    handlerSelectNumber() {
      if (this.selectList.length > 0) {
        var sum = 0
        for (let index = 0; index < this.selectList.length; index++) {
          this.selectList[index]['lottery'] = this.fomatFloat((Math.floor((this.voucherCount / this.selectList.length) * 10) / 10), 1)
          sum += this.selectList[index]['lottery']
        }
        if (parseInt(sum) !== parseInt(this.voucherCount)) {
          // eslint-disable-next-line no-unmodified-loop-condition
          var c = this.fomatFloat(this.voucherCount - sum, 1)
          for (let index = (this.selectList.length - 1); c > 0; c = c - 0.1) {
            this.selectList[index]['lottery'] = this.fomatFloat(this.selectList[index]['lottery'] + 0.1, 1)
            index -= 1
          }
        }
      }
    },
    fomatFloat(src, pos) {
      return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos)
    },
    moneyName() {
      var id = this.moneylistSelect
      var list = this.moneylist
      for (var i = 0, len = list.length; i < len; i++) {
        // eslint-disable-next-line eqeqeq
        if (list[i]['id'] == id) { return list[i]['name'] }
      }
      return ''
    },
    positionName() {
      var id = this.positionSelect
      var list = this.position
      for (var i = 0, len = list.length; i < len; i++) {
        // eslint-disable-next-line eqeqeq
        if (list[i]['id'] == id) { return list[i]['name'] }
      }
      return ''
    },
    // 表格选中后获取id
    handleSelectionChange(val) {
      this.selectIds = val.map(item => {
        return item.id
      })
    },
    handleSubmission() {
      var data = {
        customer_id: this.customerId,
        staff_lottery_info: this.selectList
      }
      staffLotteryCreate(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.handleCancel()
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    handleDelete(index) {
      if (this.selectIds.length === 0) {
        this.$message({
          message: '请选择人员',
          type: 'warning'
        })
        return false
      }
      for (let i = 0; i < this.selectIds.length; i++) {
        for (let j = 0; j < this.selectList.length; j++) {
          if (parseInt(this.selectIds[i]) === parseInt(this.selectList[j].id)) {
            this.selectList.splice(j, 1)
          }
        }
      }
      this.handlerSelectNumber()
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
.voucher-dis-dialog {
  .filter-container {
    margin-top: -10px;
  }
  .filter-input {
    width: 130px;
  }
  .distribution-table {
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 20px;
  }
}
</style>
