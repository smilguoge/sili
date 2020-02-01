<template>
  <div id="inventoryList" class="app-container transfer-manage-body">
    <div
      class="sbar-ly"
      :style="{width:drawerVisible==false?'calc(100% - 40px)':'calc(100% - 310px)'}"
    >
      <nav>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="盘点日期：">
            <div>
              <el-date-picker
                v-model="formInline.inventory_start"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
                @change="fomtime($event,'star')"
              />
              <span>-</span>
              <el-date-picker
                v-model="formInline.inventory_end"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
                @change="fomtime($event,'end')"
              />
            </div>
          </el-form-item>
          <el-form-item label="盘点状态">
            <el-select v-model="formInline.check_status">
              <el-option value="">
                全部
              </el-option>
              <el-option
                v-for="(item, i) in checkStatus"
                :key="i"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="add">
          <el-button type="primary" @click="addInventory">新建盘点</el-button>
        </div>
      </nav>
      <div class="table">
        <el-table
          ref="multipleTable"
          border
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55" />
          <el-table-column align="center" label="单据号">
            <template slot-scope="{row}">
              <!-- <span class="inventoryOrder"></span> -->
              <el-link
                :underline="false"
                class="inventoryOrder"
                @click="handleDetail(row)"
              >{{ row.document_number }}</el-link>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="warehouse_name" label="盘点仓库" />
          <el-table-column align="center" prop="staff_name" label="盘点人" />
          <el-table-column align="center" prop="inventory_at" label="盘点日期" />
          <el-table-column align="center" label="盘点结果">
            <template slot-scope="scope">
              <span
                v-if="scope.row.check_results=='盘盈'"
                class="inventoryResult green"
              >{{ scope.row.check_results }}</span>
              <span
                v-else-if="scope.row.check_results=='盘亏'"
                class="inventoryResult red"
              >{{ scope.row.check_results }}</span>
              <span v-else class="inventoryResult">{{ scope.row.check_results }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="check_status" label="盘点状态" />
          <el-table-column align="center" prop="remark" label="备注" />
        </el-table>
      </div>
      <div class="paging">
        <el-pagination
          :current-page="formInline.page"
          :page-sizes="[10, 20, 30, 40]"
          background
          :page-size="formInline.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div
      class="openbtn"
      :style="{'left':(drawerVisible?'270px':'0'), 'z-index':(dialogVisible?'2000':'2006')}"
      @click="openDrawer(drawerVisible)"
    >
      <i :class="drawerVisible==true?'el-icon-caret-left icon':'el-icon-caret-right icon'" />
    </div>
    <tree-drawer v-model="drawerVisible" :tree-data="departTree" />
    <transfer-dialog v-model="dialogVisible" :form-data="changeData" @cancel="cancelDialog" />
    <!-- 新增盘点弹窗 -->
    <div class="tanc">
      <newInventory v-if="is_show" @hid="close" />
    </div>
    <!-- 盘点明细查询 -->
    <inventory-detail
      :visible="dialogDetailVisible"
      :id="inventoryId"
      @handleClose="handleDetailClose"
    />
  </div>
</template>

<script>
import treeDrawer from "./component/treeDrawer";
import transferDialog from "./component/transferDialog";
import { customerTransfer } from "@/api/ManageCustomer/CustomerManage";
import inventory_clearing_api from "@/api/ManageGoods/inventory_clearing";
import newInventory from "./component/new_inventory";
import InventoryDetail from "./component/inventoryDetail";
import { log } from "util";
const transferApi = new customerTransfer();

export default {
  name: "Inventory",
  components: { treeDrawer, transferDialog, newInventory, InventoryDetail },
  data() {
    return {
      // 树结构
      departTree: [],
      changeData: {},
      // 配置参数
      dialogVisible: false,
      dialogDetailVisible: false,
      drawerVisible: false,
      listLoading: false,
      timearr: [], // 检索时间组
      formInline: {
        inventory_start: "",
        inventory_end: "",
        check_status: "",
        page:1,
        page_size:10
      },
      totalCount:10,
      tableData: [],
      checkStatus: [],
      // 弹窗
      is_show: false,
      green: false,
      red: false,
      inventoryId: 0
    };
  },
  created() {
    this.getList(this.listQuery);
    // 盘点列表
    this.getData();
  },
  methods: {
    getList(params) {
      this.listLoading = true;
      transferApi.shopView().then(res => {
        this.departTree = res.data;
      });
      transferApi.index(params).then(res => {
        const items = res.data;
        if (items.list.lenght !== 0) {
          this.list = items.list;
          this.total = parseInt(items.count);
          this.listLoading = false;
        } else {
          this.list = [];
          this.$message.warning("没有更多数据");
          this.listLoading = false;
        }
      });
    },
    onSubmit() {
      console.log(this.formInline);
      if(this.formInline.inventory_end != ''){
        this.formInline.inventory_end = this.formInline.inventory_end /1000;
      }  
      if(this.formInline.inventory_start != ''){
        this.formInline.inventory_start = this.formInline.inventory_start /1000;
      }    
      this.getData() 
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
    //获取列表
    getData() {
      inventory_clearing_api.getInventoryList(this.formInline).then(res => {
        this.tableData = res.positions;
        console.log(res)
        this.checkStatus = res.checkStatus;
        this.totalCount = parseInt(res.totalCount);
      });
    },
    // 控制弹窗是否显示
    close() {
      this.is_show = false;
    },
    // 新增
    addInventory() {
      this.is_show = true;
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
    // 打开明细查询
    handleDetail(obj) {
      this.inventoryId = parseInt(obj.id);
      this.dialogDetailVisible = true;
    },
    // 关闭明细查询
    handleDetailClose() {
      this.dialogDetailVisible = false;
    },
    // 时间戳格式化
    fomtime(e, el) {
      this.formInline.el = parseInt(e / 1000);
      //  console.log(e,this.formInline.el)
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
    // 分页/
    handleSizeChange(val) {
      this.formInline.page_size = val
      this.getData()
      
    },
    handleCurrentChange(val) {
      this.formInline.page = val
      this.getData()
    },
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
  color: #895dfe;
}
#inventoryList .table .el-table__row td .cell .inventoryResult.green {
  color: #22e51c;
}
#inventoryList .table .el-table__row td .cell .inventoryResult.red {
  color: #e51c23;
}
</style>
