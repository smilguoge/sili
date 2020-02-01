<template>
  <!-- 选择服务技师 -->
  <el-dialog
    title="选择服务技师"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="select-staff-dialog"
    width="540px"
  >
    <el-row>
      <el-col :span="22" :offset="1">
        <div class="filter-container">
          <el-input
            v-model="staffQuery.code"
            class="filter-item input-160"
            placeholder="请输入工号"
            size="small"
            clearable
          />
          <el-input
            v-model="staffQuery.code"
            class="filter-item input-160"
            placeholder="请输入姓名"
            size="small"
            clearable
          />
          <el-button
            class="filter-item"
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="handleFilter"
          >查 询</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="22" :offset="1">
        <el-table
          :data="staffTable"
          height="320px"
          class="item-table"
          highlight-current-row
          fit
          @row-click="handleCurrent"
        >
          <el-table-column align="center" label="工号">
            <template slot-scope="{row}">
              <span>{{ row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="职务">
            <template slot-scope="{row}">
              <span>{{ row.position_name }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
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
  </el-dialog>
</template>
<script>
export default {
  name: '',
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    listData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      staffQuery: {
        code: '',
        name: ''
      },
      staffTable: [],
      currentData: null,
      dialogVisible: false,
      flagTime: 0
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    listData(arr) {
      this.staffTable = arr
    }
  },
  created() {
    // -
  },
  methods: {
    handleCurrent(row) {
      // 收集选中数据
      this.currentData = {
        id: row.id,
        name: row.name
      }
      console.log(this.currentData)
    },
    handleFilter() {
      // 检索员工 FIXME: 本地检索
      this.$message.info('开发中...')
    },
    handleSubmit() {
      // 提交选中员工信息
      if (this.currentData === null) {
        this.$message.warning('请选择服务技师后再提交！')
        return
      }
      const curr = new Date()
      if (curr - this.flagTime > 1000) {
        this.$emit('submit', this.currentData)
        this.handleCancel()
        this.flagTime = curr
      }
    },
    handleCancel() {
      this.$parent.staffVisible = false
      this.currentData = null
    }
  }
}
</script>
<style lang="scss" scoped>
.select-staff-dialog {
  .input-160 {
    width:  170px;
    margin-right: 10px;
  }
  .filter-container {
    display: flex;
    // justify-content: space-between;
  }
  .item-table {
    border: 1px solid #DCDFE6;
    border-bottom: 0;
  }
}
</style>
