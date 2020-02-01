<template>
  <div class="app-container">
    <el-button type="primary" @click="add">新增</el-button>
    <el-button type="primary">导入</el-button>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="a" label="奖惩类型*"></el-table-column>
        <el-table-column prop="b" label="奖惩名称*"></el-table-column>
        <el-table-column prop="c" label="奖惩日期*"></el-table-column>
        <el-table-column prop="d" label="奖惩原因*"></el-table-column>
      </el-table>
    </div>
    <div id='page'>
      <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
      </el-pagination>
    </div>
    <div class="tanc">
      <Popup v-if="isShow" @close='hid'/>
    </div>
  </div>
</template>

<script>
import Popup from "./popup";
export default {
  name: "RewardsANDpunishments",
  components: {
    Popup
  },
  data() {
    return {
      currentPage:'1',
      tableData: [],
      isShow: false,
      currentPage:1
    };
  },
  created() {},
  methods: {
    add() {
      this.isShow = true;
    },
    hid(){
      this.isShow = false;
    },
      // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style scoped lang="scss">
#page{
  margin-top:20px;
}
.table {
  margin-top: 20px;
}
.tanc {
  z-index:2240 ;
  .app-container {
    z-index: 2242;
    .el-dialog__wrapper {
      z-index: 2210;
      .el-dialog__body {
        z-index: 2230;
      }
    }
  }
}
</style>

