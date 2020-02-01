<template>
  <div class="app-container">
    <div class="customer_box">
      <el-dialog
      :close-on-click-modal='false' 
      title='会员档案'
      :visible.sync="dialogTableVisible" @close="close" width="95%">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="1">
            <basicInfo @hid="close" />
          </el-tab-pane>
          <el-tab-pane label="消费记录" name="2" :disabled="is_click">
            <recordsConsumption/>
            </el-tab-pane>
          <el-tab-pane label="代金券" name="3" :disabled="is_click">
            <Vouchers is_type='customer'/>
          </el-tab-pane>
          <el-tab-pane label="账户余额" name="4" :disabled="is_click">
            <accountBalance is_integral="yes"/>
          </el-tab-pane>
          <el-tab-pane label="磁卡信息" name="7" :disabled="is_click">磁卡信息</el-tab-pane>
          <el-tab-pane label="转院记录" name="8" :disabled="is_click">转院记录</el-tab-pane>
          <el-tab-pane label="顾客画像" name="9" :disabled="is_click">顾客画像</el-tab-pane>
          <el-tab-pane label="顾客图片" name="10" :disabled="is_click">顾客图片</el-tab-pane>
          <el-tab-pane label="欠款明细" name="11" :disabled="is_click">欠款明细</el-tab-pane>
        </el-tabs>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import basicInfo from "@/view/ManageCustomer/ManageCustomer/newAdd/basic_information";
import recordsConsumption from "@/component/employees-customer/RecordsConsumption";
import accountBalance from "@/component/employees-customer/accountBalance";
import Vouchers from "@/component/employees-customer/vouchers";
export default {
  name: "tab",
  components: {
    basicInfo,
    recordsConsumption,
    accountBalance,
    Vouchers
  },
  data() {
    return {
      dialogTableVisible: true,
      activeName: "1",
      
    }
  },
  props:[
    'is_click',
    'this.is_customer'
  ],
  created() {
    console.log(this.is_click);
    
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$emit("hid");
      this.dialogTableVisible = false;
    },
    handleClick() {}
  }
};
</script>

<style>
.customer_box .el-dialog {
  height: calc(100% - 22vh) !important;
  overflow: auto;
}
.customer_box .el-dialog .el-tabs__content {
  height: 560px !important;
  overflow: auto;
}
</style>



