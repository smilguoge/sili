<template>
  <div class="app-container">
    <div class="filter-container flex">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="门店：">
          <el-input v-model="$store.getters.member.shop_name" disabled placeholder="" />
        </el-form-item>
        <el-form-item label="时间：">
          <el-date-picker
            v-model="formInline.backorder_start"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
          />
          <span>-</span>
          <el-date-picker
            v-model="formInline.backorder_end"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon='el-icon-search' @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-radio-group v-model="formInline.status" @change="changeStatus">
          <el-radio-button label="1">有欠货</el-radio-button>
          <el-radio-button label="2">已完成</el-radio-button>
          <!-- <el-radio-button label="0">全部</el-radio-button> -->
        </el-radio-group>
        <el-form-item>
          <div id="left">
            <el-button v-if='formInline.status==1' type="primary" @click="exchange">兑换</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id='owe-goods-management-table'>
      <OweGoods
        ref="goodPagination"
        v-if="formInline.status==1"
      />
      <HasCompleted ref="goodCompleted" v-else />
    </div>
    <div id="page">
      <el-pagination
        :current-page="formInline.page"
        :page-sizes="sizes"
        :page-size="100"
        background
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div id="tanc">
      <Exchange ref="ExchangeView" v-if="is_tanc" @hide="hide" />
    </div>
  </div>
</template>
<script>
import OweGoods from './component/owe_goods'
import HasCompleted from './component/has_completed'
import Exchange from './component/exchange'
import { whBackorderList, whReplaceCreate } from '@/api/ManageGoods/owe.js'
export default {
  name: 'owe-goods-management',
  components: { OweGoods, HasCompleted, Exchange },
  data() {
    return {
      formInline: {
        backorder_start: '',
        backorder_end: '',
        status: '1',
        page: 1,
        page_size: ''
      },
      total: 400,
      tableData: [],
      sizes: [10, 20, 30, 40],
      is_tanc: false
    }
  },
  created() {
    this.getlist()
  },

  methods: {
    // 搜索
    getlist() {
      var getData = {
        backorder_start: this.formInline.backorder_start,
        backorder_end: this.formInline.backorder_end,
        status: this.formInline.status,
        page: this.formInline.page,
        page_size: this.formInline.page_size
      }
      if (getData.backorder_start > 0) {
        getData.backorder_start = getData.backorder_start / 1000
      }
      if (getData.backorder_end > 0) {
        getData.backorder_end = getData.backorder_end / 1000
      }
      whBackorderList(getData).then(response => {
        // 如果有购买券的话,弹出付款页面
        this.tableData = response.data.backorder
        this.total = parseInt(response.data.totalCount)
        if (this.formInline.status == 1) {
          this.$refs.goodPagination.tableData = this.tableData
        } else {
          this.$refs.goodCompleted.tableData = this.tableData
        }
      })
    },
    changeStatus() {
      this.getlist()
    },
    onSubmit() {
      this.getlist()
    },
    // 兑换
    exchange() {
      if (!this.$refs.goodPagination.selectIds.length) {
        this.$message({
          message: '请先选择欠货记录再进行兑换',
          type: 'warning'
        })
        return false
      }
      var ids = this.$refs.goodPagination.selectIds.join(',')
      // 获取兑换渲染
      whReplaceCreate({ ids: ids }).then(response => {
        this.$refs.ExchangeView.tableData = response.data.arrLog
        this.$refs.ExchangeView.restaurants2 = response.data.arrProduct.map(v => {
          this.$set(v, 'value', v.name)
          return v
        })
      })
      this.is_tanc = true
    },
    // 隐藏弹窗组件
    hide() {
      this.is_tanc = false
    },
    // 分页
    handleSizeChange(val) {
      this.formInline.page_size = val
      this.getlist()
    },
    handleCurrentChange(val) {
      this.formInline.page = val
      this.getlist()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#left{
  margin-left: 10px;
}
#page{
   margin-top: 20px;
}
.el-tagbox.el-tag {
  margin-left: 10px;
}
.flex{
  display: flex;
  align-items:center;
}
.spsty1 >>> .el-date-editor.el-input{
  width: 150px;
}
.spsty2{
  margin-left: 25px;
  margin-right: 25px;
}
.spsty3{
  margin-left: 25px;
  margin-top: -10px;
}
.psty1{
    margin-bottom: 12px;
    margin-top: 20px;
}
.filter-container{
  margin-bottom: 5px;
}
.spsty2 .filter-container .filter-item{
  margin-bottom: 0;
}
.spsty1{
  align-self: baseline;
}
.spsty2 span{vertical-align: 4px;}
.spsty4{
  color: #895DFE;
}
</style>
