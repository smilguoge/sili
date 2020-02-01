<template>
  <div id="depositDetails">
    <el-dialog
      title="积分明细"
      append-to-body
      width="60%"
      @close="close"
      :visible.sync="dialogFormVisible"
    >
      <div id="depositDetails_table">
        <!-- <el-table
          ref="multipleTable"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="积分总额">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column prop="name" label="积分使用"></el-table-column>
          <el-table-column prop="name" label="剩余积分"></el-table-column>
          <el-table-column prop="name" label="操作时间（隐藏项）"></el-table-column>
        </el-table>-->
        <el-table :data="tableData" border style="width: 100%">
           <el-table-column align="center" label="积分总额">
            <template slot-scope="scope">{{scope.row.total_amount}}</template>
          </el-table-column>
          <el-table-column align="center" prop="real_integral" label="积分使用"></el-table-column>
          <el-table-column align="center" prop="surplus" label="剩余积分"></el-table-column>
          <!-- <el-table-column prop="name" label="操作时间（隐藏项）"></el-table-column> -->
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from "@/api/ManageCustomer/customerManagementApi";
export default {
  name: "depositDetails",
  components: {},
  data() {
    return {
      dialogFormVisible: true,
      tableData: [],
      multipleSelection: []
    };
  },
  filters: {
    tonumber (val){
      return parseint(val)
    }
  },
  created() {
    let params = {
      // customer_id:this.$store.state.isCustomerId,
      customer_id:4,
      page_size:10,
      page:1
    };
   Api.get_integral_subsidiary(params).then(res=>{
     console.log(res)
     this.tableData=res.list;
   })
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 关闭弹窗
    close() {
      this.$emit("hide");
    }
  }
};
</script>

<style scoped lang="scss">
</style>

