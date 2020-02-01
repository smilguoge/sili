<template>
  <div class="app-container transfer-manage-body" id="inventoryList">
    <div
      class="sbar-ly"
      :style="{width:drawerVisible==false?'calc(100% - 40px)':'calc(100% - 310px)'}"
    >
      <nav id="nav_form">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <div id='line'>
            <el-form-item label="姓名：">
              <el-input v-model="formInline.name"></el-input>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="formInline.status" placeholder="全部">
                <el-option label="正常" value="1" />
                <el-option label="停用" value="0" />
                <el-option label="全部" value />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="newAdd">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-delete" @click="delte">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="stop">停用账号</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="open">启用账号</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="expor">导出</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="impor">导入</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reset">重置密码</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="VIP_query">高级查询</el-button>
          </el-form-item>
        </el-form>
      </nav>
      <div id="s_table">
        <el-table
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55" fixed="left" />
          <el-table-column
            align="center"
            prop="account"
            fixed="left"
            label="登陆账号"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            prop="name"
            fixed="left"
            label="姓名"
            show-overflow-tooltip
          />
          <el-table-column align="center" prop="sex_name" label="性别" show-overflow-tooltip />
          <el-table-column align="center" width="160" label="出生日期" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.birthday*1000 | formtime }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            width="200"
            prop="identity_num"
            label="身份证"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            width="180"
            prop="phone"
            label="手机号码"
            show-overflow-tooltip
          />
          <el-table-column align="center" prop="age" label="年龄" show-overflow-tooltip />
          <el-table-column
            align="center"
            prop="recruitment_channel_name"
            label="招聘渠道"
            show-overflow-tooltip
          />
          <el-table-column align="center" width="160" label="建档日期" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.created_at*1000 | formtime }}</template>
          </el-table-column>
          <el-table-column align="center" width="160" label="入职日期" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.entry_at*1000 | formtime }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            width="160"
            prop="turn_positive_at"
            label="转正日期"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{ scope.row.turn_positive_at*1000 | formtime }}</template>
          </el-table-column>
          <el-table-column align="center" prop="workAge" label="工龄" show-overflow-tooltip />
          <el-table-column align="center" prop="position_name" label="职务" show-overflow-tooltip />
          <el-table-column align="center" prop="postAge" label="岗龄" show-overflow-tooltip />
          <el-table-column align="center" prop="subordinate" label="所属部门" show-overflow-tooltip />
          <el-table-column
            align="center"
            prop="staff_status_name"
            label="员工状态"
            show-overflow-tooltip
          />
          <el-table-column align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="edit(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <div
      :class="btn?'openbtn':'openbtn on'"
      :style="{'left':(drawerVisible?'270px':'0')}"
      @click="openDrawer(drawerVisible)"
    >
      <i :class="drawerVisible==true?'el-icon-caret-left icon':'el-icon-caret-right icon'" />
    </div>
    <div class="inventoryList_tree" :class="is_tree?'inventoryList_tree':'inventoryList_tree on'">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <div id="control">
        <el-button round size="mini" @click="check_all">全选</el-button>
        <el-button round size="mini" @click="resetChecked">反选</el-button>
      </div>
      <!-- :props="defaultProps" -->
      <el-tree
        class="filter-tree"
        :data="data"
        default-expand-all
        node-key="id"
        ref="tree"
        :props="defaultProps"
        show-checkbox
        :filter-node-method="filterNode"
        @check="check_tree"
      ></el-tree>
    </div>
    <!-- <tree-drawer v-model="drawerVisible" :tree-data="departTree" /> -->
    <transfer-dialog v-model="dialogVisible" :form-data="changeData" @cancel="cancelDialog" />
    <tancTab v-if="$store.state.isComponent" :flag="flag" @hid="close" />
  </div>
</template>

<script>
import treeDrawer from "./component/treeDrawer";
import transferDialog from "./component/transferDialog";
import { log } from "util";

import tancTab from "@/view/ManageHr/newAdd/tanc_tab";
import EmployeeApi from "@/api/ManageHr/EmployeeFiles";

var mendian = "",
  bumen = "";
export default {
  name: "employee_data",
  components: { treeDrawer, transferDialog, tancTab },
  data() {
    return {
      is_tree: true,
      btn: true,
      data: [],
      defaultProps2: {
        children: "children",
        label: "label"
      },
      // 树结构
      departTree: [],
      changeData: {},
      // 配置参数
      dialogVisible: false,
      drawerVisible: false,
      listLoading: false,
      timearr: [], // 检索时间组

      // 头部查询
      formInline: {
        name: "",
        phone: "",
        status: "",
        merchant_id: '',
        shop_ids: this.$store.getters.member.shop_id
      },
      // 表单列表
      tableData: this.$store.state.tableData || [],
      currentPage: 1,
      total: 0,
      filterText: "",
      defaultProps: {
        children: "child",
        label: "name"
      },
      flag: true,
      // 分页
      pager: {
        page: 1,
        limit: 10
      },
      tree_key: [],
      // 多选
      multipleSelection: [],
      deltId: ""
    };
  },
  created() {
    let parms = {
      shop_id : this.$store.getters.member.shop_id
    }
    EmployeeApi.getList(parms).then(res => {
      this.tableData = res.data.list;
      this.total = parseInt(res.data.total_count);
    });
    EmployeeApi.get_department_tree2().then(res => {
      console.log(res);
      this.data = res;
    });
    // console.log(this.$store.getters.member.shop_id,'2222222')
  },
  filters: {
    formtime: function(value) {
      const time = new Date(value);
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
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    treecommon() {
      let key = this.$refs.tree.getCheckedKeys();
      let val = key.join(",");
      let department = "",
        stores = "";
      for (let item of key) {
        if (item.indexOf("d") > -1) {
          department += item.slice(1) + ",";
        } else if (item.indexOf("s") > -1) {
          stores += item.slice(1) + ",";
        }
      }
      mendian = stores.substr(0, stores.length - 1);
      bumen = department.substr(0, department.length - 1);
      let parms = {
        shop_ids: stores.substr(0, stores.length - 1),
        dept_ids: department.substr(0, department.length - 1)
      };
      EmployeeApi.getList(parms).then(res => {
        this.tableData = res.data.list;
        this.total = parseInt(res.data.total_count);
      });
    },
    // 全选
    check_all() {
      this.$refs.tree.setCheckedKeys(["d1"]);
      this.treecommon();
    },
    // 反选
    resetChecked() {
      this.$refs.tree.setCheckedNodes([]);
      this.treecommon();
      console.log(this.tree_key, "当前key");
    },
    check_tree() {
      this.treecommon();
      // console.log('3333',parms);
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
    cancelDialog() {
      this.dialogVisible = false;
    },
    openDrawer(val) {
      this.drawerVisible = !val;
      this.is_tree = !this.is_tree;
      console.log(this.is_tree);
    },

    // 搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 单选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.deltId = this.multipleSelection;
    },
    // 分页配置
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`,'22w');
      let params = {
        page_size: val,
        dept_ids: bumen,
        shop_ids: mendian
      };
      // 列表请求
      EmployeeApi.getList(params).then(res => {
        this.tableData = res.data.list;
        this.total = parseInt(res.data.total_count);
      });
    },
    handleCurrentChange(val) {
      let params = {
        page: val,
        dept_ids: bumen,
        shop_ids: mendian
      };
      // console.log(`当前页: ${val}`);
      EmployeeApi.getList(params).then(res => {
        this.tableData = res.data.list;
        this.total = parseInt(res.data.total_count);
      });
    },

    // 关闭弹窗儿子隐藏
    close() {
      this.$store.state.isComponent = false;
      this.btn = true;
      this.flag = true;
      EmployeeApi.getList().then(res => {
        this.tableData = res.data.list;
        // console.log("关闭", this.tableData);
      });
    },

    // 新增
    newAdd() {
      // 儿子显示
      this.$store.state.isComponent = true;
      // 弹窗显示
      this.$store.state.isTanc = true;
      // 是否是修改
      this.$store.state.isEdit = false;
      this.btn = false;
    },

    // 修改
    edit(row) {
      // 儿子显示
      this.$store.state.isComponent = true;
      // 弹窗显示
      this.$store.state.isTanc = true;
      // 是否是修改
      this.$store.state.isEdit = true;
      // 修改id
      this.$store.state.editId = row.id;
      this.flag = false;
      this.btn = false;
    },

    // 删除
    delte() {
      console.log(this.deltId);
      if (this.deltId.length > 0) {
        let id = "";
        for (let i = 0; i < this.deltId.length; i++) {
          id += this.deltId[i].id + ",";
        }
        id = id.substr(0, id.length - 1);
        console.log(id);
        EmployeeApi.delt(id).then(res => {
          if (res.code == "200") {
            EmployeeApi.getList().then(res => {
              this.tableData = res.data.list;
              this.$message("删除成功");
            });
          } else {
            this.$message("删除失败");
          }
        });
      } else {
        this.$message("请选择要删除的内容");
      }
    },

    // 查询
    query() {
      EmployeeApi.query(this.formInline).then(res => {
        console.log(res);
        this.tableData = res.data.list;
      });
    },

    // 停用账号
    stop() {
      this.$message("功能待开发");
    },

    // 启用账号
    open() {
      this.$message("功能待开发");
    },

    // 导出
    expor() {
      this.$message("功能待开发");
    },

    // 导入
    impor() {
      this.$message("功能待开发");
    },

    // 密码重置
    reset() {
      this.$message("功能待开发");
    },

    // 高级查询
    VIP_query() {
      this.$message("功能待开发");
    }
  }
};
</script>

<style lang="scss" scoped>
.inventoryList_tree {
  width: 15%;
  display: none;
  border: 1px solid #e6e6e6;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding: 10px;
}
#control {
  margin: 10px;
  display: flex;
  justify-content: flex-end;
}
.inventoryList_tree.on {
  display: block;
}
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
#inventoryList .openbtn.on {
  display: none;
}
#inventoryList .table .el-table__row td .cell .inventoryOrder {
  color: #5ccbff;
}
#inventoryList .table .el-table__row td .cell .inventoryResult.green {
  color: #22e51c;
}
#inventoryList .table .el-table__row td .cell .inventoryResult.red {
  color: #e51c23;
}
</style>
