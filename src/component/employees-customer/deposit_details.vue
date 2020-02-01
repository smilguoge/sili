<template>
  <div id="depositDetails">
    <el-dialog
      title="订金明细"
      append-to-body
      width="60%"
      @close="close"
      :visible.sync="dialogFormVisible"
    >
      <div id="depositDetails_table">
        <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          style="width: 100%"
          border
          height='500px'
        >
          <!-- <el-table-column align="center" label="订单号（隐藏项）">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column> -->
          <el-table-column align="center" prop="deposit_name" label="充值类型"></el-table-column>
          <el-table-column align="center" prop="amount" label="充值金额"></el-table-column>
          <el-table-column align="center" prop="surplus_amount" label="剩余金额"></el-table-column>
          <el-table-column align="center" label="最后一次返订日期">
            <template slot-scope="scope">{{scope.row.consume_at|formtime}}</template>
          </el-table-column>
          <el-table-column align="center" prop="operator.name" label="操作人"></el-table-column>
          <!-- <el-table-column align="center" label="充值日期（隐藏项）">
            <template slot-scope="scope">{{scope.row.created_at|formtime}}</template>
          </el-table-column> -->
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Pagination from "@/component/Pagination/index";
// import Structure from "@/component/Structure/index";
import API from "@/api/ManageHr/EmployeeFiles";

export default {
  name: "depositDetails",
  components: {},
  data() {
    return {
      dialogFormVisible: true,
      tableData: [
      ]
    };
  },
  filters: {
    formtime(val) {
      let time = new Date(val * 1000);
      let year = time.getFullYear();
      let month =
        time.getMonth() + 1 > 9
          ? time.getMonth() + 1
          : "0" + (time.getMonth() + 1);
      let day = time.getDate();
      let curTime = year + "-" + month + "-" + day;
      return curTime;
    }
  },
  created() {
    if(this.$store.state.isCustomer){
      let data = {
        customer_id: this.$store.state.isCustomerId,
        
      };
      API.get_deposit_details(data).then(res => {
        console.log(res);
        this.tableData = res.list;
      });
    }else if(this.$store.state.isEdit){
      let data = {
        staff_id: this.$store.state.editId,
        
      };
      API.get_deposit_details(data).then(res => {
        console.log(res);
        this.tableData = res.list;
      });
    }
    
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$emit("hide");
    }
  }
};
</script>

<style scoped lang="scss">
</style>

