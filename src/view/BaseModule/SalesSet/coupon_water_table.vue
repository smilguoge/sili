<template>
  <div class="app-container transfer-manage-body" id="inventoryList">
    <div
      class="sbar-ly"
      :style="{width:drawerVisible==false?'calc(100% - 40px)':'calc(100% - 310px)'}"
    >
      <nav>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="券名称">
            <el-input v-model="formInline.input" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="券种类">
            <el-select v-model="formInline.check_status">
              <el-option label="产品券" value="all"></el-option>
              <el-option label="项目券" value="wc"></el-option>
              <el-option label="通用券" value="mwc"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="赠送日期">
            <div>
              <el-date-picker
                v-model="formInline.inventory_start"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
                @change="fomtime($event,'star')"
              ></el-date-picker>
              <span>-</span>
              <el-date-picker
                v-model="formInline.inventory_end"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
                @change="fomtime($event,'end')"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="add">
          <el-button type="primary">导出</el-button>
        </div>
      </nav>
      <div id="water_table">
        <el-table :data="tableData"  border style="width: 100%">
          <el-table-column prop="id" label="NO."></el-table-column>
          <el-table-column  label="赠送日期">
             <template slot-scope="scope">
              {{ scope.row.created_at |formtime }}
            </template>
          </el-table-column>
          <el-table-column prop="coupon.code" label="券编码"></el-table-column>
          <el-table-column prop="coupon.name" label="券名称"></el-table-column>
          <el-table-column prop="coupon.coupon_class_name" label="券种类"></el-table-column>
          <!-- <el-table-column prop="" label="赠送数量"></el-table-column> -->
          <el-table-column prop="shop_name" label="赠送门店"></el-table-column>
          <el-table-column prop="operator_name" label="赠送人"></el-table-column>
          <el-table-column prop="customer_name" label="赠送会员"></el-table-column>
        </el-table>
      </div>

      <div class="paging">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          background
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.totalCount"
        ></el-pagination>
      </div>
    </div>
    <div
      class="openbtn"
      :style="{'left':(drawerVisible?'270px':'0'), 'z-index':(dialogVisible?'2000':'2007')}"
      @click="openDrawer(drawerVisible)"
    >
      <i :class="drawerVisible==true?'el-icon-caret-left icon':'el-icon-caret-right icon'" />
    </div>
    <tree-drawer v-model="drawerVisible" :tree-data="departTree" />
    <transfer-dialog v-model="dialogVisible" :form-data="changeData" @cancel="cancelDialog" />
  </div>
</template>

<script>
import treeDrawer from "./component/treeDrawer";
import transferDialog from "./component/transferDialog";
import { customerTransfer } from "@/api/ManageCustomer/CustomerManage";
import { get_water_table } from "@/api/BaseModule/SalesSet";
import inventory_clearing_api from "@/api/ManageGoods/inventory_clearing";
import { log } from "util";
const transferApi = new customerTransfer();

export default {
  name: "index03",
  components: { treeDrawer, transferDialog },
  data() {
    return {
      // 树结构
      departTree: [],
      changeData: {},
      // 配置参数
      dialogVisible: false,
      drawerVisible: false,
      listLoading: false,
      timearr: [], // 检索时间组
      formInline: {
        inventory_start: "",
        inventory_end: "",
        check_status: "",
        input: ""
      },
      tableData: [],

      // 分页
      currentPage: 1,
      totalCount: 0,
      // 弹窗
      is_show: false,
      green: false,
      red: false
    };
  },
  created() {
    this.getList(this.listQuery);
    // 盘点列表
    get_water_table().then(res=>{
      console.log(res);
      this.tableData=res.coupon_details;
      this.totalCount = parseInt(res.total_count);
    })
  },
  filters: {
    formtime: function(value) {
      const time = new Date(parseInt(value)*1000);
      // console.log(time,'122');
      const year = time.getFullYear();
      const month = time.getMonth() + 1>9?time.getMonth() + 1:'0'+(time.getMonth() + 1);
      const day = time.getDate()>9?time.getDate():'0'+time.getDate();
      console.log(year + '-' + month + '-' + day)
      return year + '-' + month + '-' + day;
    }
  },
  methods: {
    getList(params) {
      this.listLoading = true;
      transferApi.shopView().then(res => {
        this.departTree = res.data;
      });
    },
    onSubmit() {
      console.log(this.formInline);
    },
    submitSearch() {
      if (this.timearr && this.timearr.length > 0) {
        this.listQuery.start_at = Math.floor(this.timearr[0] / 1000);
        this.listQuery.end_at = Math.floor(this.timearr[1] / 1000);
      } else {
        this.listQuery.start_at = "";
        this.listQuery.end_at = "";
      }
      this.getList(this.listQuery);
    },
    revokeSubmit(id) {
      this.$confirm("此操作将驳回这条审批，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // FIXME: 待删除
          this.$message.warning("功能尚在开发中");
          console.log("撤销");
        })
        .catch(() => {});
    },
    cancelDialog() {
      this.dialogVisible = false;
    },
    openDrawer(val) {
      this.drawerVisible = !val;
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val}222 条`);
      let parms ={
        page_size:val
      };
      get_water_table(parms).then(res=>{
        console.log(res);
        this.tableData=res.coupon_details;
        this.totalCount = parseInt(res.total_count);
      })
     
    },
    handleCurrentChange(val) {
    
      let parms ={
        page:val
      };
      get_water_table(parms).then(res=>{
        console.log(res);
        this.tableData=res.coupon_details;
        this.totalCount = parseInt(res.total_count);
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.tanc {
  z-index: 2222;
}
.table {
  margin-left: 30px;
  margin-top: 20px;
}
.paging {
  margin-top: 20px;
}
.transfer-manage-body {
  .input-160 {
    width: 158px !important;
  }
  .dateCompontent {
    width: 300px;
  }
#water_table{
  margin-top: 20px;
}
  .table-wrap-ly {
    height: calc(100vh - 260px);
    flex: 1;
    transition: 0.2s;
    -webkit-transition: 0.2s;
  }
  .table-body-ly {
    max-height: calc(100% - 20px);
    transition: 0.21s ease all;
  }

  .sbar-ly {
    position: absolute;
    top: 20px;
    right: 20px;
    bottom: 20px;
    transition: 0.2s ease all;
  }
  .openbtn {
    position: absolute;
    top: 50%;
    left: 0;
    width: 0;
    height: 80px;
    padding: 20px;
    transform: translateY(-50%);
    z-index: 3000;
    border-left: 18px solid rgb(100, 100, 100);
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    opacity: 0.4;
    transition: 0.2s ease all;
    .icon {
      position: absolute;
      left: -21px;
      top: 50%;
      transform: translateY(-50%);
      color: #fff;
      font-size: 24px;
    }
  }
}
</style>
<style>
#inventoryList .table .el-table__row td .cell .inventoryOrder {
  color: #5ccbff;
}
#inventoryList .table .el-table__row td .cell .inventoryResult.green {
  color: #22e51c;
}
#inventoryList .table .el-table__row td .cell .inventoryResult.red {
  color: #e51c23;
}
#water_table tr td div,#water_table tr th div {
  text-align: center !important;
}
</style>
