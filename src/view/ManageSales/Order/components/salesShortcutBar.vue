<template>
  <!-- 快捷选项 -->
  <div class="m-menu-body">
    <el-scrollbar class="btnbar-scroll">
      <el-button
        v-for="item in btnData"
        :key="item.value"
        class="menu-btn"
        type="primary"
        size="medium"
        plain
        @click="handleSelect(item)"
      >{{ item.name }}</el-button>
    </el-scrollbar>
  </div>
</template>
<script>
import { findData, apiPostSaleConfirm } from '@/api/ManageSales/Order.js'
export default {
  name: '',
  data() {
    return {
      // -
      btnData: [],
      composeList: [],
      customer_id: '',
      include_package_ids: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 从父组件获取用户 id
    setUserId(id, arr) {
      this.customer_id = id // 用户id
      this.composeList = arr // 已经选择的套餐列表
      if (this.composeList.length > 0) {
        this.include_package_ids = this.composeList.map(item => {
          if (item.goods_type === 2) {
            return item.id
          }
        })
      }
    },
    getList() {
      findData().then(response => {
        this.btnData = response.data
      })
    },
    handleSelect(ele) {
      if (this.customer_id) {
        apiPostSaleConfirm({ goods_id: ele.id, goods_type: 2, customer_id: this.customer_id, include_package_ids: this.include_package_ids }).then(response => { // 销售开单-品项添加审查
          if (response.data.auth === 'forbidden') {
            this.$message.error(response.data.reason[0])
          }
          if (response.data.auth === 'access') {
            this.$emit('getAct', ele.id)
          }
        })
      } else {
        this.$message({
          message: '请先选择用户',
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style lang="css" scoped>
.m-menu-body {
  width: 100%;
  padding-right: 24px;
  overflow: hidden;
}
.btnbar-scroll{
  white-space: nowrap;
}
.menu-btn {
  margin-left: 20px;
  /* height: 36px; */
}
</style>
