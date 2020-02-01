<template>
  <div class="app-container">
    <div id="employeeBox">
      <el-dialog 
      :close-on-click-modal='false'
        title='员工档案'
      :visible.sync="dialogTableVisible" width="92%" @close="gb">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本信息" name="1">
            <div class="newEmployee">
              <EmployeeFiles @close="gb" @change_is_click="change_is_click" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="合同信息" :disabled="is_click" name="2">
            <div class="newEmployee">
              <contractInformation />
            </div>
          </el-tab-pane>
          <el-tab-pane label="奖惩信息" :disabled="is_click" name="3">
            <div class="newEmployee">
              <RewardsANDpunishments />
            </div>
          </el-tab-pane>
          <el-tab-pane label="异动信息" :disabled="is_click" name="4">
            <div class="newEmployee">
              <MoveInformation />
            </div>
          </el-tab-pane>
          <el-tab-pane label="培训信息" :disabled="is_click" name="5">
            <div class="newEmployee">
              <RewardsANDpunishments />
            </div>
          </el-tab-pane>
          <el-tab-pane label="账户余额" :disabled="is_click" name="6">
            <div class="newEmployee">
              <accountBalance />
            </div>
          </el-tab-pane>
          <el-tab-pane label="消费记录" :disabled="is_click" name="7">
            <div class="newEmployee">
              <RecordsConsumption />
            </div>
          </el-tab-pane>
          <el-tab-pane label="代金券" :disabled="is_click" name="8">
            <div class="newEmployee">
              <vouchers is_type='employee'/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/component/Pagination/index'
import Structure from '@/component/Structure/index'
import EmployeeApi from '@/api/ManageHr/EmployeeFiles'
import EmployeeFiles from '@/view/ManageHr/newAdd/EmployeeFiles'
import RewardsANDpunishments from '@/view/ManageHr/newAdd/RewardsANDpunishments'
import contractInformation from '@/view/ManageHr/newAdd/contractInformation'
import MoveInformation from '@/view/ManageHr/newAdd/MoveInformation'
import RecordsConsumption from "@/component/employees-customer/RecordsConsumption";
import accountBalance from "@/component/employees-customer/accountBalance";
import vouchers from "@/component/employees-customer/vouchers";
import depositDetails from '@/view/ManageHr/newAdd/depositDetails'
export default {
  name: 'EmployeeData',
  components: {
    Pagination,
    Structure,
    EmployeeFiles,
    contractInformation,
    RewardsANDpunishments,
    MoveInformation,
    accountBalance,
    RecordsConsumption,
    vouchers,
    depositDetails
  },
  props: ['flag'],
  data() {
    return {
      dialogTableVisible: this.$store.state.isTanc,
      activeName: '1',
      is_click: this.flag
    }
  },
  created() {},
  methods: {
    // 关闭弹窗
    gb() {
      this.$emit('hid')
      console.log(11111111);
      
      
    },
    change_is_click() {
      this.is_click = false
    }
  }
}
</script>

<style scoped lang="scss">
#employeeBox {
  .newEmployee {
    height: 500px;
    overflow: auto;
  }
}
</style>
<style>
#employeeBox .el-dialog {
  height: calc(100% - 25vh) !important;
  overflow: auto;
}
#employeeBox .el-dialog__wrapper{
      /* z-index: 2008 !important; */
}
</style>

