<template>
  <div id="depositDetails">
    <el-dialog :close-on-click-modal='false' title="订金明细" append-to-body width="60%"
     @close='close' :visible.sync="dialogFormVisible">
      <div id="depositDetails_table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="订单号（隐藏项）">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column prop="name" label="充值类型"></el-table-column>
          <el-table-column prop="name" label="充值金额"></el-table-column>
          <el-table-column prop="name" label="剩余金额"></el-table-column>
          <el-table-column prop="name" label="最后一次返订日期"></el-table-column>
          <el-table-column prop="name" label="操作人"></el-table-column>
          <el-table-column prop="name" label="充值日期（隐藏项）"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Pagination from "@/component/Pagination/index";
// import Structure from "@/component/Structure/index";

export default {
  name: "depositDetails",
  components: {},
  data() {
    return {
      dialogFormVisible: true,
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      multipleSelection: []
    };
  },
  created() {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 关闭弹窗
    close(){
      this.$emit('hide');
    }
  }
};
</script>

<style scoped lang="scss">
</style>

