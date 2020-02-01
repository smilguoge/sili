<template>
  <div class="app-container">
    <div id="accountBalance">
      <div id="box">
        <el-link id="money" @click="is_show=1" type="primary" >订金余额：{{deposit}}</el-link>
        <el-link id="integral" v-if="is_integral" @click="is_show=2" type="primary">积分余额：{{integral}}</el-link>
      </div>
      <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="统计日期">
            <!-- <el-input v-model="formInline.user" placeholder="审批人"></el-input> -->
            <el-date-picker
              v-model="formInline.start_ts"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="timestamp"
              @change='change($event,"start_ts")'
            ></el-date-picker>
            <span>-</span>
            <el-date-picker
              v-model="formInline.end_ts"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="timestamp"
              @change='change($event,"end_ts")'
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="accountBalance-table">
      <el-table :data="tableData" border>
        <el-table-column prop="id" align='center' label="NO." width="50px"></el-table-column>
        <el-table-column prop="order_no" align='center' label="订单号"></el-table-column>
        <el-table-column prop="package_name" align='center' label="所属套餐"></el-table-column>
        <el-table-column prop="name" align='center' label="品项名称"></el-table-column>
        <el-table-column prop="card_no" align='center' label="项目卡号"></el-table-column>
        <el-table-column prop="actual_subtotal" align='center' label="总金额"></el-table-column>
        <el-table-column prop="expend_price" align='center' label="单财"></el-table-column>
        <el-table-column prop="adjust_price" align='center' label="调整金额"></el-table-column>
        <el-table-column prop="quantity" align='center' label="购买次数"></el-table-column>
        <el-table-column prop="remain_quantity" align='center' label="剩余次数"></el-table-column>
        <el-table-column prop="surplus_amount" align='center' label="剩余金额"></el-table-column>
        <el-table-column align='center' label="购买时间">
           <template slot-scope="scope">
            {{scope.row.created_at|formtime}}
          </template>
        </el-table-column>
        <el-table-column align='center' label="有效时间" width='240px'>
           <template slot-scope="scope">
             {{scope.row.effect_start_at|formtime}}&nbsp;&nbsp;-&nbsp;&nbsp;  {{scope.row.effect_end_at|formtime}}
          </template>
        </el-table-column>
        <el-table-column prop="last_consume_at" align='center' label="最后护理时间"></el-table-column>
        <el-table-column prop="shop_name" align='center' label="销售美容院"></el-table-column>
      </el-table>
    </div>
    <div id='page'>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_count">
      </el-pagination>
    </div>
    <div class="tanc">
      <depositDetails @hide="close" v-if="is_show==1" />
      <integralBalance @hide="close" v-else-if="is_show==2" />
    </div>
  </div>
</template>

<script>
import { newAdd } from "@/api/ManageHr/newAdd";
// import Pagination from "@/component/Pagination/index";
// import Structure from "@/component/Structure/index";
import depositDetails from "./deposit_details";
import integralBalance from "./integral_balance";
import Api from "@/api/ManageCustomer/customerManagementApi";

export default {
  name: "EmployeeFiles",
  components: { depositDetails, integralBalance },
  data() {
    return {
      currentPage:1,
      formInline: {
        start_ts: "",
        end_ts: ""
      },
      deposit:'',
      integral:'',
      start_ts:'',
      end_ts:'',
      tableData: [],
      is_show: false,
      total_count:0
    };
  },
  filters: {
    formtime: function(value) {
      const time = new Date(value*1000);
      // console.log(time,'122');
      const year = time.getFullYear();
      const month =
        time.getMonth() + 1 > 9
          ? time.getMonth() + 1
          : "0" + (time.getMonth() + 1);
      const day = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
      return year + "-" + month + "-" + day;
    }
  },
  created() {

    if(this.$store.state.isCustomer){
       console.log(this.$store.state.isCustomer,'顾客22');
      let params =  {
        page:1,
        customer_id:this.$store.state.isCustomerId
        // customer_id:4
      };
      Api.get_account_balance(params).then(res=>{
        this.tableData =res.list;
        this.total_count = parseInt(res.total_count);
        this.deposit = res.deposit;
        this.integral = res.integral;
      })
    } else if(this.$store.state.isEdit){
      console.log(this.$store.state.isEdit,'员工22');
      let params =  {
        page:1,
        staff_id:this.$store.state.editId
      };
      Api.get_account_balance(params).then(res=>{
        this.tableData =res.list;
        this.deposit = res.deposit;
      })
    }     
  },
  props: ["is_integral"],
  methods: {
    // 时间
    change(e,el){
      console.log(e);
      this[el] = e/1000;
      
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      if(this.is_integral){
       let params =  {
          page_size:val,
          // customer_id:this.$store.state.isCustomerId
          customer_id:4
        };
        Api.get_account_balance(params).then(res=>{
            console.log(res);
            this.tableData =res.list;
            this.total_count = parseInt(res.total_count);
        })
      }else{
        let params =  {
          page_size:val,
          staff_id:this.$store.state.editId
        };
        Api.get_account_balance(params).then(res=>{
            console.log(res);
            this.tableData =res.list;
        })
      }
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      if(this.is_integral){
       let params =  {
          page:val,
          customer_id:this.$store.state.isCustomerId
          // customer_id:4
        };
        Api.get_account_balance(params).then(res=>{
            console.log(res);
            this.tableData =res.list;
            this.total_count = parseInt(res.total_count);
        })
      }else{
        let params =  {
          page:val,
          staff_id:this.$store.state.editId
        };
        Api.get_account_balance(params).then(res=>{
            console.log(res);
            this.tableData =res.list;
        })
      }
    },
    handleSelect(key, keyPath) {
      console.log(keyPath);
    },
    query() {
      if(this.$store.state.isCustomer){
        let params={
          start_ts:this.start_ts,
          end_ts:this.end_ts,
          customer_id:this.$store.state.isCustomerId
        };
        Api.get_account_balance(params).then(res=>{
          console.log(res);
          this.tableData =res.list;
          this.total_count = parseInt(res.total_count);
        })
      }else if(this.$store.state.isEdit){
       let params={
          start_ts:this.start_ts,
          end_ts:this.end_ts,
          staff_id:this.$store.state.editId
        };
        Api.get_account_balance(params).then(res=>{
            console.log(res);
            this.tableData =res.list;
            this.total_count = parseInt(res.total_count);
        })
      }
     
    },
    // 订金明细
    close() {
      this.is_show = false;
      console.log(this.is_show);
    }
  }
};
</script>

<style scoped lang="scss">
#page{
  margin-top:20px;
}
#accountBalance {
  display: flex;
  align-items: center;
  justify-content: space-between;
  #box {
    margin-bottom: 22px;
    #money {
      margin-right: 40px;
    }
  }
}
</style>

