<template>
  <!-- 业绩分配-主界面 -->
  <el-dialog
    title="业绩分摊"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="distribution-dialog"
    width="700px"
  >

    <el-col :span="22" :offset="1">
      <div class="filter-container">
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
        <el-tag style="margin-left: 10px" class="filter-item">{{ '有效业绩：'+achievement }}</el-tag>
      </div>
    </el-col>
    <el-col :span="22" :offset="1">
      <div class="distribution-table">
        <el-table
          :data="achiData"
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
            label="分摊职务"
            align="center"
          >
            <template slot-scope="{row}">
              <span class="info-color">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="姓名"
            align="center"
          >
            <template slot-scope="{row}">
              <span class="info-color">{{ row.customer_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="职务"
            align="center"
          >
            <template slot-scope="{row}">
              <span class="info-color">{{ row.position_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="分摊业绩"
            align="center"
          >
            <template slot-scope="{row}">
              <span class="info-color">{{ row.achievement }}</span>
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
          @click="handleSubmit"
        >确 定</el-button>
      </el-col>
      <div style="clear:both" />
    </div>

    <el-dialog
      :visible.sync="dialogChildVisible"
      :before-close="handleChildCancel"
      title="业绩信息"
      style="margin-top:40px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="300px"
    >
      <el-form
        :model="formData"
        label-position="left"
        label-width="70px"
      >
        <el-form-item
          label="职务"
        >
          <el-select ref="sourceProvdiv" v-model="formData.id" placeholder="请选择职务" @change="selectChanged">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="姓名"
        >
          <el-autocomplete
            v-model="formData.customer_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          />
        </el-form-item>
        <el-form-item
          label="业绩分摊"
        >
          <el-input
            v-model="formData.achievement"
            placeholder="请输入业绩"
            type="number"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-col :span="23">
          <el-button @click="handleChildCancel">取 消</el-button>
          <el-button
            type="primary"
            @click="handleChildSubmit"
          >确 定</el-button>
        </el-col>
        <div style="clear:both" />
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { apiGetSaleGcreate, apiGetStaffSearch } from '@/api/ManageSales/Order.js'
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
      restaurants: [],
      state: '',
      timeout: null,
      options: [],
      achiData: [], // 主弹框
      formData: {
        name: '',
        id: '',
        customer_id: '',
        customer_name: '',
        achievement: '',
        position_id: '',
        position_name: ''
      }, // 第二层Dialog
      achievement: '10000.00', // 有效业绩
      dialogVisible: false,
      dialogChildVisible: false,
      selectIds: []
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    }
  },
  created() {
    // -
  },
  methods: {
    // 从父组件传值
    init() {
      // 获取职务
      apiGetSaleGcreate().then(response => {
        this.options = response.data.dic_performance
      })
      apiGetStaffSearch().then(response => {
        const items = response.data
        this.restaurants = items.map(v => {
          this.$set(v, 'value', v.name)
          return v
        })
      })
      this.dialogVisible = true
    },
    // 表格选中后获取id
    handleSelectionChange(val) {
      this.selectIds = val.map(item => {
        return item.customer_id
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
    // 下拉框事件
    selectChanged(val) {
      this.$nextTick(() => {
        this.formData.name = this.$refs.sourceProvdiv.$data.selectedLabel
      })
    },
    // 选择后获取用户
    handleSelect(item) {
      for (let i = 0; i < this.achiData.length; i++) {
        if (this.achiData[i].customer_id === item.id) {
          this.formData.customer_name = ''
          this.formData.customer_id = ''
          this.$message({
            message: '该用户已在列表',
            type: 'warning'
          })
          break
        }
      }
      this.formData.customer_id = item.id
      this.formData.position_id = item.position.id
      this.formData.position_name = item.position.name
    },
    // 信息全部填入完成后提交
    handleChildSubmit() {
      if (this.formData.name === '') {
        this.$message({
          message: '请选择职务',
          type: 'warning'
        })
        return false
      }
      if (this.formData.customer_id === '') {
        this.$message({
          message: '请选择用户',
          type: 'warning'
        })
        return false
      }
      if (this.formData.achievement === '') {
        this.$message({
          message: '请输入分摊金额',
          type: 'warning'
        })
        return false
      }
      this.achiData.push(this.formData)
      this.formData = {
        name: '',
        id: '',
        customer_id: '',
        customer_name: '',
        achievement: ''
      }
      this.dialogChildVisible = false
    },
    // 把信息传到父组件
    handleSubmit() {
      this.$emit('setAchievement', this.achiData)
      this.dialogVisible = false
    },
    // -
    handleCreate() {
      // -
      this.dialogChildVisible = true
    },
    handleDelete() {
      if (this.selectIds.length === 0) {
        this.$message({
          message: '请选择用户',
          type: 'warning'
        })
        return false
      }
      for (let i = 0; i < this.selectIds.length; i++) {
        for (let j = 0; j < this.achiData.length; j++) {
          if (this.selectIds[i] === this.achiData[j].customer_id) {
            this.achiData.splice(j, 1)
          }
        }
      }
    },
    handleCancel() {
      this.dialogVisible = false
    },
    handleChildCancel() {
      this.dialogChildVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.distribution-dialog {
  .filter-container {
    margin-top: -10px;
  }
  .distribution-table {
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 20px;
  }
}
</style>
