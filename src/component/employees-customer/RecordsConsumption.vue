<template>
  <div class="app-container">
    <div id="RecordsConsumption">
      <nav>
        <el-radio-group v-model="radio" @change="change">
          <el-radio-button :label="1">销售</el-radio-button>
          <el-radio-button :label="2">消耗</el-radio-button>
        </el-radio-group>
      </nav>
      <div>
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
      </div>
    </div>
    <div id="RecordsConsumption_table">
      <div id="sales" v-if="type==1">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column align='center' label="销售时间">
            <template slot-scope="scope">{{ scope.row.created_at |formtime }}</template>
          </el-table-column>
          <!-- <el-table-column prop="name" label="销售类型"></el-table-column> -->
          <el-table-column align='center' prop="order_no" label="订单号"></el-table-column>
          <el-table-column align='center' prop="name" label="品项名称"></el-table-column>
          <el-table-column align='center' prop="package_name" label="所属套餐"></el-table-column>
          <el-table-column align='center' prop="price" label="单价"></el-table-column>
          <!-- <el-table-column prop="name" label="折扣"></el-table-column> -->
          <el-table-column align='center' prop="quantity" label="数量"></el-table-column>
          <el-table-column align='center' prop="subtotal" label="销售金额"></el-table-column>
          <el-table-column align='center' prop="actual_subtotal" label="实收金额"></el-table-column>
          <el-table-column align='center' prop="shop_name" label="销售美容院"></el-table-column>
        </el-table>
      </div>
      <div id="consumption" v-else>

        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="消耗时间">
            <template slot-scope="scope">{{ scope.row.created_at |formtime }}</template>
          </el-table-column>
          <!-- <el-table-column prop="name" label="消耗类型"></el-table-column> -->
          <el-table-column prop="order_no" label="订单号"></el-table-column>
          <el-table-column prop="package_name" label="所属套餐"></el-table-column>
          <el-table-column prop="name" label="品项名称"></el-table-column>
          <el-table-column prop="unit_price" label="单价"></el-table-column>
          <el-table-column prop="quantity" label="消耗次数"></el-table-column>
          <el-table-column prop="subtotal" label="财耗金额"></el-table-column>
          <el-table-column prop="staff_name" label="服务技师"></el-table-column>
          <el-table-column prop="shop_name" label="护理美容院"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id='recordsConsumption_page'>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import API from "@/api/ManageCustomer/customerManagementApi"
export default {
  name: "EmployeeFiles",
  components: {},
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
  data() {
    return {
      radio: 1,
      formInline: {
        star: "",
        end: ""
      },
      tableData: [],
      multipleSelection: [],
      type: "1",
      currentPage:1,
      total:0
    };
  },
  created() {
    if(this.$store.state.isCustomer){
      let params = {
        // customer_id:this.$store.state.isCustomerId,
        customer_id:4,
        action:'sale'
      };
      API.get_statement(params).then(res=>{
        console.log(res,'lllli');
        this.tableData = res.list;
        this.total = parseInt(res.total_count);
      })
    }else if(this.$store.state.isEdit){
           let params = {
            // customer_id:this.$store.state.isCustomerId,
            staff_id:1005,
            action:'sale'
          };
          API.get_statement(params).then(res=>{
            console.log(res,'lllli');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })
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
      if(this.type ==1){
        
        if(this.$store.state.isCustomer){
          let params = {
            // customer_id:this.$store.state.isCustomerId,
            customer_id:4,
            action:'sale'
          };
          API.get_statement(params).then(res=>{
            console.log(res,'lllli');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })
        }else if(this.$store.state.isEdit){
           let params = {
            // customer_id:this.$store.state.isCustomerId,
            staff_id:1005,
            action:'sale'
          };
          API.get_statement(params).then(res=>{
            console.log(res,'lllli');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })
        }
      }else if(this.type ==2){
         if(this.$store.state.isCustomer){
          let params = {
            // customer_id:this.$store.state.isCustomerId,
            customer_id:4,
            action:'consume'
          };
          API.get_statement(params).then(res=>{
            console.log(res,'consume');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })
        }else if(this.$store.state.isEdit){
           let params = {
            // customer_id:this.$store.state.isCustomerId,
            staff_id:1005,
            action:'consume'
          };
          API.get_statement(params).then(res=>{
            console.log(res,'lllli');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })
        }
      }
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      if(this.type ==1){
        if(this.$store.state.isCustomer){
          let params = {
            // customer_id:this.$store.state.isCustomerId,
            customer_id:4,
            action:'sale',
            page_size:val
          };
          API.get_statement(params).then(res=>{
            console.log(res,'lllli');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })

        }else if(this.$store.state.isEdit){
           let params = {
            // customer_id:this.$store.state.isCustomerId,
            staff_id:1005,
            action:'sale',
            page_size:val
          };
          API.get_statement(params).then(res=>{
            console.log(res,'lllli');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })
        }
      }else if(this.type ==2){
         if(this.$store.state.isCustomer){
          let params = {
            // customer_id:this.$store.state.isCustomerId,
            customer_id:4,
            action:'consume',
            page_size:val
          };
          API.get_statement(params).then(res=>{
            console.log(res,'consume');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })
        }else if(this.$store.state.isEdit){
           let params = {
            // customer_id:this.$store.state.isCustomerId,
            staff_id:1005,
            action:'consume',
            page_size:val
          };
          API.get_statement(params).then(res=>{
            console.log(res,'lllli');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })
        }
      }
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      if(this.type ==1){
        // 顾客
        if(this.$store.state.isCustomer){
          let params = {
            // customer_id:this.$store.state.isCustomerId,
            customer_id:4,
            action:'sale',
            page:val
          };
          API.get_statement(params).then(res=>{
            console.log(res,'lllli');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })
        }else if(this.$store.state.isEdit){
           let params = {
            // customer_id:this.$store.state.isCustomerId,
            staff_id:1005,
            action:'sale',
            page_size:val
          };
          API.get_statement(params).then(res=>{
            console.log(res,'lllli');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })
        }
      }else if(this.type ==2){
         if(this.$store.state.isCustomer){
          let params = {
            // customer_id:this.$store.state.isCustomerId,
            customer_id:4,
            action:'consume',
            page:val
          };
          API.get_statement(params).then(res=>{
            console.log(res,'consume');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })
        }else if(this.$store.state.isEdit){
           let params = {
            // customer_id:this.$store.state.isCustomerId,
            staff_id:1005,
            action:'consume',
            page:val
          };
          API.get_statement(params).then(res=>{
            console.log(res,'lllli');
            this.tableData = res.list;
            this.total = parseInt(res.total_count);
          })
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
#RecordsConsumption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  nav {
    margin-bottom: 22px;
  }
}
#recordsConsumption_page{
  margin-top:20px;
}
</style>

