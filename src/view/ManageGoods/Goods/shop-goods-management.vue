<template>
  <div class="app-container">
    <div class="psty1">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <div class="filter-container flex">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="单据号：">
          <el-input v-model="formInline.document_no" placeholder="请填写单据号" />
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="formInline.start_time"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
          />
          <span>-</span>
          <el-date-picker
            v-model="formInline.end_time"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="formInline.status" @change="changeStatus">
            <el-radio-button label="1">未完成</el-radio-button>
            <el-radio-button label="2">已完成</el-radio-button>
            <el-radio-button label="3">全部</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div id="good-management-table">
      <el-table :data="tableData" border style="width: 100%" @row-click="see_detail">
        <el-table-column align="center" prop="document_no" label="单据号" />
        <el-table-column align="center" prop="shop_name" label="出库门店" />
        <el-table-column align="center" prop="out_stock_shop" label="对方单位" />
        <el-table-column align="center" prop="date" label="出库类型">
          <template slot-scope="{row}">
            铺货出库
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operator" label="操作人" />
        <el-table-column align="center" prop="created_at" label="操作时间">
          <template slot-scope="{row}">
            {{ row.created_at | parseTime('{y}.{m}.{d} {h}: {i}') }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态" />
        <el-table-column align="center" prop="remark" label="备注" />
        <el-table-column align="center" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
            >修改</el-button>
            <el-button type="danger" size="small" @click.stop="delt(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="page">
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div class="tanc">
      <specificDetails v-if="is_show==1" @hide="close" />
      <shopGoodsAdd ref="shopGoodsAddView" v-else-if="is_show==2" @hide="close" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import specificDetails from './component/specific_details'
import shopGoodsAdd from './component/shop_goods_add'
import { whSupplyList, whSupplyGcreate } from '@/api/ManageGoods/shop.js'
export default {
  name: 'InStock',
  components: { Pagination, specificDetails, shopGoodsAdd },
  data() {
    return {
      formInline: {
        document_no: '',
        region: '',
        start_time: '',
        end_time: '',
        page_size: 10,
        page: 1,
        status: 1
      },
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      total: 400,
      labelPosition: 1,
      currentPage: 1,
      is_show: null
    }
  },
  created() {
    this.getlist()
  },

  methods: {
    changeStatus() {
      this.getlist()
    },
    onSubmit() {
      this.getlist()
    },
    getlist() {
      var getData = {
        backorder_start: this.formInline.document_no,
        backorder_end: this.formInline.backorder_end,
        status: this.formInline.status,
        page: this.formInline.page,
        page_size: this.formInline.page_size,
        document_no: this.formInline.document_no
      }
      if (getData.start_time > 0) {
        getData.start_time = getData.start_time / 1000
      }
      if (getData.end_time > 0) {
        getData.end_time = getData.end_time / 1000
      }
      whSupplyList(getData).then(response => {
        this.tableData = response.data.detail
        this.total = parseInt(response.data.totalnum)
      })
    },
    handleEdit() {},
    // 分页
    handleSizeChange() {},
    handleCurrentChange() {},
    // 查看详情
    see_detail(e) {
      console.log(e)
      this.is_show = 1
    },
    // 隐藏弹窗组件
    close() {
      this.is_show = false
    },
    // 新建
    add() {
      whSupplyGcreate().then(response => {
        this.$refs.shopGoodsAddView.formInline.shopname = response.data.shopname
        this.$refs.shopGoodsAddView.arrShop = response.data.arrShop
        this.$refs.shopGoodsAddView.arrProduct = response.data.arrProduct
        this.$refs.shopGoodsAddView.arrWarehouse = response.data.arrWarehouse
      })
      this.is_show = 2
    },
    // 删除
    delt() {}
  }
}
</script>

<style  lang="scss" scoped>
#page {
  margin-top: 20px;
}
.el-tagbox.el-tag {
  margin-left: 10px;
}
.flex {
  display: flex;
  align-items: center;
}
.spsty1 >>> .el-date-editor.el-input {
  width: 150px;
}
.spsty2 {
  margin-left: 25px;
  margin-right: 25px;
}
.spsty3 {
  margin-left: 25px;
  margin-top: -10px;
}
.psty1 {
  margin-bottom: 12px;
  margin-top: 20px;
}
.filter-container {
  margin-bottom: 5px;
}
.spsty2 .filter-container .filter-item {
  margin-bottom: 0;
}
.spsty1 {
  align-self: baseline;
}
.spsty2 span {
  vertical-align: 4px;
}
.spsty4 {
  color: #895dfe;
}
</style>
