<template>
  <!-- 耗材调整 -->
  <el-dialog
    title="耗材调整"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="making-dialog"
    width="640px"
  >
    <el-row style="padding:0 26px 14px">
      <span class="tit-font">项目名称：</span>
      <span class="main-color">暂无数据</span>
    </el-row>
    <el-row>
      <el-col :span="22" :offset="1">
        <el-table
          :data="markingTable"
          height="260px"
          class="item-table"
          fit
        >
          <el-table-column align="center" type="selection" width="55" />
          <el-table-column align="center" label="品名">
            <template slot-scope="{row}">
              <span>{{ row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="规格">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="辅助单位">
            <template slot-scope="{row}">
              <span>{{ row.position_name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="数量">
            <template slot-scope="{row}">
              <span>{{ row.position_name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="当前库存">
            <template slot-scope="{row}">
              <span>{{ row.position_name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="openDialog">编 辑</el-button>
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

    <!-- 嵌套弹框 -->
    <el-dialog
      title="编辑"
      :visible.sync="childrenDialogVisible"
      :before-close="handleChildrenCancel"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="300px"
    >
      <!--  -->
      <el-form :model="markingForm">
        <el-col :span="22" :offset="1">
          <el-form-item label="数量 :" label-width="60px" :rules="[{ required: true, message: '请输入数量', trigger: 'blur' },{ pattern: /^[\d]+$/, message: '数量只能是数字', trigger: 'blur' }]">
            <el-input v-model="markingForm.num" size="small" placeholder="请输入数量" />
          </el-form-item>
        </el-col>
      </el-form>
      <div style="clear:both" />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-col :span="23">
          <el-button @click="handleChildrenCancel">取 消</el-button>
          <el-button type="primary" @click="handleChildrenCancel">确 定</el-button>
        </el-col>
        <div style="clear:both" />
      </div>
    </el-dialog>
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
      markingTable: [],
      markingForm: {
        num: ''
      },
      dialogVisible: false,
      childrenDialogVisible: false,
      flagTime: 0
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    listData(arr) {
      this.markingTable = arr
    }
  },
  created() {
    // -
  },
  methods: {
    openDialog() {
      this.childrenDialogVisible = true
    },
    handleSubmit() {
      const curr = new Date()
      if (curr - this.flagTime > 1000) {
        this.$emit('submit', 'give data') // 提交员工信息
        this.flagTime = curr
      }
    },
    handleCancel() {
      this.$parent.markingVisible = false
    },
    handleChildrenCancel() {
      this.childrenDialogVisible = false
    }
  }
}
</script>
<style lang="scss" scope>
.making-dialog {
  .item-table {
    border: 1px solid #DCDFE6;
    border-bottom: 0;
  }
}
</style>
