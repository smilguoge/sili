<template>
  <div class="app-container">
    <div class="add">
      <el-button icon='el-icon-plus' type="primary" @click="add">新建</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align='center' prop="type" label="异动类型" />
      <el-table-column align='center' label="原职务">
        <template slot-scope="scope">
          <span v-if="scope.row.oldPosition">{{ scope.row.oldPosition.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align='center' label="现职务">
        <template slot-scope="scope">
          <span v-if="scope.row.position">{{ scope.row.position.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align='center' label="调出部门">
        <template slot-scope="scope">
          <span v-if="scope.row.oldDepartment">{{ scope.row.oldDepartment.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align='center' label="调入部门">
        <template slot-scope="scope">
          <span v-if="scope.row.department">{{ scope.row.department.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align='center'  label="异动日期" >
        <template slot-scope="scope">
          {{scope.row.created_at | formTime}}
        </template>
      </el-table-column>
      <el-table-column align='center' label="返回部门时间" >
         <template slot-scope="scope">
           <span v-if="scope.row.return_at!=0">
              {{scope.row.return_at | formTime}}
           </span>
        </template>
      </el-table-column >
      <el-table-column align='center' label="操作" width="100">
        <template slot-scope="scope">
          <el-button type='primary' v-if='scope.row.type=="借调"' :disabled='scope.row.status==2'  size="small" @click="end(scope.row)">结束借调</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div id='page'>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog :close-on-click-modal='false' append-to-body :visible.sync="dialogFormVisible" width="630px">
      <div class="tanc">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="调部门" name="1">
            <moveDepartment v-if="is_show==1" @isTanc="show" />
          </el-tab-pane>
          <el-tab-pane label="调岗" name="2">
            <movePost v-if="is_show==2" @isTanc="show" />
          </el-tab-pane>
          <el-tab-pane label="调部门、调岗" name="3">
            <moveDepartmentPost v-if="is_show==3" @isTanc="show" />
          </el-tab-pane>
          <el-tab-pane label="借调" name="4">
            <Secondment v-if="is_show==4" @isTanc="show" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moveDepartment from './move-component/move-department'
import movePost from './move-component/move-post'
import moveDepartmentPost from './move-component/move-department-post'
import Secondment from './move-component/secondment'

import EmployeeApi from '@/api/ManageHr/EmployeeFiles'
// import Pagination from "@/component/Pagination/index";
// import Structure from "@/component/Structure/index";

export default {
  name: 'MoveInformation',
  components: { moveDepartment, movePost, moveDepartmentPost, Secondment },
  data() {
    return {
      activeName: '1',
      is_disabled:false,
      currentPage:1,
      // 表格
      tableData: [],
      type: '',
      // 弹窗
      dialogFormVisible: false,
      is_show: 1
      // 单选
    }
  },
  filters:{
    formTime(val){
      let time = new Date(val*1000),
          year = time.getFullYear(),
          month = time.getMonth()+1>9?time.getMonth():'0'+(time.getMonth()+1),
          day = time.getDate()>9?time.getDate():'0'+time.getDate(),
          curTime = year +'-'+ month+'-'+day;
      return curTime;
    }
  },
  created() {
    // let val ={
    //   id:parseInt(this.$store.state.editId)
    // };
    // console.log(this.$store.state.editId,'id')
    if(this.$store.state.isEdit){
      EmployeeApi.moveList(this.$store.state.editId).then(res => {
        // console.log(res)
        this.tableData = res
      })
    }
  },
  methods: {
    add() {
      this.dialogFormVisible = !this.dialogFormVisible
    },

    sure() {
      EmployeeApi.add_m_info(this.form).then(res => {
        console.log(res)
      })
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 关闭弹窗
    show() {
      this.dialogFormVisible = !this.dialogFormVisible;
      EmployeeApi.moveList(this.$store.state.editId).then(res => {
        // console.log(res)
        this.tableData = res
      })
    },
    end(data) {
      console.log(data)
      const msg = {
        status: '2'
      }
      EmployeeApi.end(data.id, msg).then(res => {
        console.log(res, 22)
        if(res.code ==200){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            // console.log('222222')
            this.is_disabled = true;
             EmployeeApi.moveList().then(res => {
              // console.log(res, 22)
              this.tableData = res
              
            })
          }
       
      })
    },
    handleClick(event) {
      console.log(this.activeName)
      this.is_show = this.activeName
    }
  }
}
</script>

<style scoped lang="scss">
.add{
  margin-bottom: 20px;
}
#page{
  margin-top:20px
}
</style>

