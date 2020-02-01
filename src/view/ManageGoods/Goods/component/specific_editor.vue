<template>
  <div id="specific_details">
    <el-drawer
      :close-on-click-modal='false'
      @close="close"
      :show-close="false"
      :visible.sync="table"
      direction="rtl"
      :modal="false"
      size="100%"
    >
      <div slot="title" class="header-title">
        <el-button class="filter-item" type="primary">打印</el-button>
        <el-button class="filter-item" type="primary">导出</el-button>
      </div>
      <div id="specific_details_table">
        <div id="close" @click="close">
          <span></span>
        </div>
        <div id="box">
          <div class="box">
            <el-form :model="formInline" class="demo-form-inline" label-width="90px">
              <el-form-item label="单据号：">
                <el-input disabled v-model="formInline.user" placeholder="审批人"></el-input>
              </el-form-item>
              <el-form-item label="门店：">
                <el-input disabled v-model="formInline.user" placeholder="审批人"></el-input>
              </el-form-item>
              <el-form-item label="操作人：">
                <el-input disabled v-model="formInline.user" placeholder="审批人"></el-input>
              </el-form-item>
              <el-form-item label="操作日期：">
                <el-input disabled v-model="formInline.user" placeholder="审批人"></el-input>
              </el-form-item>
              <el-form-item label="出库方式：">
                <el-input disabled v-model="formInline.user" placeholder="审批人"></el-input>
              </el-form-item>
              <el-form-item label="对方单位：">
                <el-input disabled v-model="formInline.user" placeholder="审批人"></el-input>
              </el-form-item>
              <el-form-item label="收货人：">
                <el-input disabled v-model="formInline.user" placeholder="审批人"></el-input>
              </el-form-item>
              <el-form-item label="收货日期：">
                <el-input disabled v-model="formInline.user" placeholder="审批人"></el-input>
              </el-form-item>
              <div class="remak">
                <el-form-item label="备注：">
                  <el-input v-model="formInline.user" placeholder="审批人"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="打印状态：">
                <el-input disabled v-model="formInline.user" placeholder="审批人"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div id='title'>
            铺货单明细
            <div>
              <el-button type="primary" icon="el-icon-plus" @click='selectShop'>新增明细</el-button>
              <el-button type="primary" icon="el-icon-delete">删除明细</el-button>
            </div>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            show-summary
            border
            :summary-method="getSummaries"
            @selection-change="handleSelectionChange"
          >
            <el-table-column align='center' type="selection" width="55"></el-table-column>
            <el-table-column align='center' label="序号" >
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column align='center' prop="name" label="产品编码" ></el-table-column>
            <el-table-column align='center' prop="name" label="产品名称" ></el-table-column>
            <el-table-column align='center' prop="name" label="产品简称" ></el-table-column>
            <el-table-column align='center' prop="name" label="产品类型" ></el-table-column>
            <el-table-column align='center' prop="name" label="规格" ></el-table-column>
            <el-table-column align='center' label="数量" >
               <template slot-scope="scope">
               <el-input v-model="scope.row.num" size='mini'  placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="name" label="单位" ></el-table-column>
            <el-table-column align='center' prop="name" label="仓库" ></el-table-column>
            <el-table-column align='center' prop="name" label="备注" ></el-table-column>
          </el-table>
          <div id='tanc'>
            <selectProject v-if="is_show==1" @hide="hide"/>
          </div>
          <div id='btn'>
            <el-button @click='close'>取消</el-button>
            <el-button type="primary">确认</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import selectProject from "./select_project";
export default {
  name: "specific_editor",
  data() {
    return {
      table: true,
      dialog: true,
      formInline: {
        user: "",
        region: ""
      },
      is_show:null,
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          num:'10'
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          num:'10'
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          num:'10'
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          num:'10'
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          num:'10'
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          num:'10'
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          num:'10'
        }
      ],
      multipleSelection: []
    };
  },
  components: {selectProject},
  methods: {
    // 新增
    selectShop(){
      this.is_show=1;
    },
    hide(){
      this.is_show=null;
    },
    // 关闭弹窗
    close() {
      this.$emit("hide");
    },
    onSubmit() {
      console.log("submit!");
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }else if(index === 7){
          let values = data.map(item =>Number(item['num']));
          let total = null;
          for(let item of values){
              total += item ;
          };
          sums[index]=total;
          return;
        }else{
          sums[index] = '';
          return;
        }
      });

      return sums;
    }
  }
};
</script>
<style lang="scss" scoped>
#title{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-bottom: none;
}
#specific_details {
  .el-dialog__wrapper {
    right: 0;
    left: 35%;
    width: 65%;
    .header-title {
      display: flex;
      justify-content: flex-end;
    }
    #specific_details_table {
      border-top: 1px solid #e5e5e5;
      display: flex;
      height: 100%;
      // width: 80%;
      #close {
        width: 23px;
        background: #f1f1f1;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          width: 0;
          display: inline-block;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 10px solid black;
        }
      }
      #box {
        margin: 20px 20px 0;
        width: calc(100% - 63px);
        .demo-form-inline {
          display: flex;
          flex-wrap: wrap;
          .remak {
            width: 70.5%;
          }
        }
      }
      #btn{
        display:flex;
        justify-content: flex-end;
        margin-top:40px;
      }
    }
  }
}
</style>
