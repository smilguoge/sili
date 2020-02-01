<template>
  <div id='guoDrawer'>
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
        <el-button class="filter-item" type="primary">导出</el-button>
        <el-button class="filter-item" type="primary">打印</el-button>
      </div>
      <div id="guoDrawer_table">
        <div id="close" @click="close">
          <span></span>
        </div>
       <div id='box'>
          <div id='form'>
            <el-form :inline="true" :model="formInline" label-width='100px'	 class="demo-form-inline">
              <el-form-item label="单据号：" >
                <el-input v-model="formInline.user" placeholder="" disabled></el-input>
              </el-form-item>
              <el-form-item label="门店：">
                <el-input v-model="formInline.user" disabled placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="操作人：">
                <el-input v-model="formInline.user" disabled placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="操作时间：">
                <el-input v-model="formInline.user" disabled placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="入库方式：">
                <el-input v-model="formInline.user" disabled placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="对方单位：">
                <el-input v-model="formInline.user" disabled placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="收货人：">
                <el-input v-model="formInline.user" disabled placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="收货时间：">
                <el-input v-model="formInline.user" disabled placeholder=""></el-input>
              </el-form-item>
              <div id='remak'>
                <el-form-item label="备注：">
                  <el-input v-model="formInline.user" disabled placeholder=""></el-input>
                </el-form-item>
                </div>
              <el-form-item label="打印状态：">
                <el-input v-model="formInline.user" disabled placeholder=""></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div id='tile'>
            明细表
          </div>
          <div id='table'>
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              border
              @selection-change="handleSelectionChange">
              <el-table-column align='center'
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column align='center'
                label="序号"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
               <el-table-column align='center'
                label="产品编码"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
               <el-table-column align='center'
                label="产品简称"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
               <el-table-column align='center'
                label="产品全称"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
               <el-table-column align='center'
                label="产品类别"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
               <el-table-column align='center'
                label="规格"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
               <el-table-column align='center'
                label="数量"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column align='center'
                label="单位"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column align='center'
                label="仓库"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column align='center'
                label="备注"
                width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              
            </el-table>
            <div id='total'>总计：10</div>
            <div id='btn'>
              <el-button type="primary">到货确认</el-button>
            </div>
          </div>
       </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
// import productDrawer from './component/storageDialog'

export default {
  name: 'guoDrawer',
  components: {  },
  data() {
    return{
      table:true,
       formInline: {
        user: "",
        region: "",
        star: "",
        end: ""
      },
       tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        multipleSelection: []
    }
  },
  created() {
   
  },
  methods:{
    // 关闭弹窗
    close(){
      this.$emit('hide')
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
  
}
</script>

<style  lang="scss" scoped>
#guoDrawer {
  .el-dialog__wrapper {
    right: 0;
    .header-title {
      display: flex;
      justify-content: flex-end;
    }
    #guoDrawer_table {
      border-top: 1px solid #e5e5e5;
      display: flex;
      height: 100%;
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
      #box{
        box-sizing: border-box;
        width:calc(100% - 43px);
        #form{
            .el-form--inline{
              margin: 20px;
              display: flex;
              flex-wrap: wrap;
              #remak{
                width: 71%;
                .el-form-item--medium {
                  width: 100% !important;
                  .el-input--medium {
                    width: 100% !important;
                  }
                }
              }
            }
        }
        #tile{
          margin:0 20px;
          padding: 20px;
          border: 1px solid #e6e6e6;
          border-bottom: none;
        }
        #table{
          margin:0 20px;
          #total{
            margin-top:20px;
          }
          #btn{
            margin-top:20px;
            display: flex;
            justify-content: flex-end;
          }
        }
      }
    }
  }
}
</style>
<style>
 #remak .el-form-item--medium .el-input--medium, #remak .el-form-item--medium .el-form-item__content {
  width: 88% !important;
}
</style>
