<template>
  <div class="app-container">
    <div id="vouchers">
      <nav>
        <el-radio-group v-model="radio" @change="change">
          <el-radio-button :label="1">已领</el-radio-button>
          <el-radio-button :label="2">已用</el-radio-button>
          <el-radio-button :label="3">过期</el-radio-button>
        </el-radio-group>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="统计日期">
            <!-- <el-input v-model="formInline.user" placeholder="审批人"></el-input> -->
            <el-date-picker
              v-model="formInline.star"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="timestamp"
            ></el-date-picker>
            <span>-</span>
            <el-date-picker
              v-model="formInline.end"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </nav>
    </div>
    <div id="vouchers_table">
      <el-table :data="tableData" border height="350px" style="width: 100%">
        <el-table-column align="center" prop="name" label="券标题"></el-table-column>
        <el-table-column align="center" prop="type" label="券来源"></el-table-column>
        <el-table-column align="center" prop="code" label="券编号"></el-table-column>
        <el-table-column align="center" prop="amount" label="券面额"></el-table-column>
        <el-table-column align="center" prop="money" label="有效金额"></el-table-column>
        <el-table-column align="center" prop="effective" label="有效期"></el-table-column>
        <el-table-column align="center" prop="coupon_status" label="状态"></el-table-column>
        <el-table-column align="center" prop="created_at" label="发放时间"></el-table-column>
        <el-table-column align="center" prop="updated_at" label="使用时间"></el-table-column>
        <el-table-column align="center" prop="staff_name" label="发放人"></el-table-column>
        <el-table-column align="center" prop="shop_name" label="发放美容院"></el-table-column>
        <el-table-column align="center" prop="name" label="赠送订单号"></el-table-column>
        <el-table-column align="center" prop="name" label="使用订单号"></el-table-column>
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
  </div>
</template>

<script>
// import Pagination from "@/component/Pagination/index";
import API from "@/api/ManageHr/EmployeeFiles";


export default {
  name: "EmployeeFiles",
  components: {},
  props:['is_type'],
  data() {
    return {
      radio: 1,
      formInline: {
        star: "",
        end: ""
      },
      tableData: [],
      currentPage:1
    };
  },
  created() {
   if(this.$store.state.isEdit||this.$store.state.isCustomer){
      if(this.is_type=='customer'){
        console.log('顾客')
        let parmas = {
          customer_id:this.$store.state.isCustomerId,
          ctype:0
        };
        API.get_vouchers(parmas).then(res=>{
          // console.log(res)
          this.tableData = res.list;
        })
        // console.log("customer22",this.is_type,this.$store.state.isCustomerId,33333333333);
      }else{
        console.log('员工')
        let parmas = {
          staff_id:this.$store.state.editId,
          ctype:1
        };
        API.get_vouchers(parmas).then(res=>{
          // console.log(res)
          this.tableData = res.list;
        })
      }
   }
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    // 单选
    change(e) {
      console.log(e);
      this.type = e;
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
#vouchers {
  display: flex;
  align-items: center;
  justify-content: space-between;
  nav {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    .el-radio-group {
      margin-bottom: 22px;
      margin-right: 50px;
    }
  }
  #btn {
    margin-bottom: 22px;
  }
}
</style>

