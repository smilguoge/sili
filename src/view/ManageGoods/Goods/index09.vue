<template>
  <div class="app-container">
    <div class="filter-container flex">
      <div class="spsty1">
        单据号：
        <el-input v-model="listQuery.document_no" type="text" size="small" clearable placeholder="选择单据" style="width:90px;margin-right:15px;" />
      </div>
      <div class="spsty1">
        日期：
        <el-date-picker v-model="start_time" type="date" placeholder="选择日期" size="small" value-format="timestamp" style="width:90px;" />
        <b>-</b>
        <el-date-picker v-model="end_time" type="date" placeholder="选择日期" value-format="timestamp" style="width:90px;" />
      </div>
      <div class="spsty2">
        入库类型：
        <el-select
          v-model="listQuery.stock_type"
          placeholder="入库类型"
          clearable
          class="filter-item"
          style="width: 90px"
        >
          <el-option v-for="item in stock_list" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </div>
      <div class="spsty1">
        产品：
        <el-input v-model="listQuery.product_name" type="text" size="small" clearable placeholder="请输入产品" style="width:90px;margin-right:15px;" />
      </div>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <div class="spsty6"><el-button>导出</el-button></div>
      <div class="spsty6"><el-button>打印</el-button></div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;"
      :default-sort="{prop: 'updated_at', order: 'descending'}"
    >
      <el-table-column label="单据号" align="center" width="150" prop="document_no">
        <template slot-scope="scope">
          {{ scope.row.document_no }}
        </template>
      </el-table-column>
      <el-table-column label="入库类型" align="center" width="150" prop="stock_type">
        <template slot-scope="scope">
          {{ scope.row.stock_type }}
        </template>
      </el-table-column>
      <el-table-column label="对方单位" align="center" width="150" prop="out_stock_shop">
        <template slot-scope="scope">
          {{ scope.row.out_stock_shop }}
        </template>
      </el-table-column>
      <el-table-column label="产品编码" align="center" width="165" prop="product_code">
        <template slot-scope="scope">
          {{ scope.row.product_code }}
        </template>
      </el-table-column>
      <el-table-column label="产品类型" align="center" width="150" prop="product_classo">
        <template slot-scope="scope">
          {{ scope.row.product_class }}
        </template>
      </el-table-column>
      <el-table-column label="产品全称 " align="center" width="165" prop="product_name">
        <template slot-scope="scope">
          <span>{{ scope.row.product_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品简称" align="center" width="180" prop="product_short_name">
        <template slot-scope="scope">
          <span>{{ scope.row.product_short_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" align="center" width="120" prop="product_specs">
        <template slot-scope="scope">
          <span>{{ scope.row.product_specs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请货数量" align="center" width="160" prop="require_quantity	">
        <template slot-scope="scope">
          <span>{{ scope.row.require_quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库数量" align="center" prop="quantity">
        <template slot-scope="scope">
          <span>{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" prop="product_dic_unit">
        <template slot-scope="scope">
          <span>{{ scope.row.product_dic_unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库" align="center" prop="product_dic_unit">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouse }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="operator">
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" width="150" prop="updated_at">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" width="200" prop="remark">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { stockListMore } from '@/api/ManageGoods/PutInStorage'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PanThumb from '@/components/PanThumb'
export default {
  name: 'InStock',
  components: { PanThumb, Pagination },
  directives: { waves },
  data() {
    return {
      bfirst: false,
      list: [],
      total: 0,
      listLoading: true,
      stock_list: null,
      start_time: '',
      end_time: '',
      listQuery: {
        page: 1,
        start_time: '',
        end_time: '',
        stock_type: '',
        page_size: 20,
        product_name: '',
        bfirst: 1,
        document_no: ''
      }
    }
  },
  created() {
    this.getList()
    this.bfirst = true
  },

  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.listQuery.start_time = this.start_time / 1000
      if (this.end_time / 1000) {
        this.listQuery.end_time = (this.end_time / 1000) + 86400
      } else {
        this.listQuery.end_time = (this.end_time / 1000)
      }

      if (this.bfirst) {
        const blistQuery = {
          page: this.listQuery.page,
          start_time: this.listQuery.start_time,
          end_time: this.listQuery.end_time,
          stock_type: this.listQuery.stock_type,
          page_size: this.listQuery.page_size,
          document_no: this.listQuery.document_no
        }
        stockListMore(blistQuery).then(response => {
          this.list = response.data.arrLog
          this.total = parseInt(response.data.totalnum)
          this.stock_list = response.data.arrType
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      } else {
        stockListMore(this.listQuery).then(response => {
          this.list = response.data.arrLog
          this.total = parseInt(response.data.totalnum)
          this.stock_list = response.data.arrType
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      }
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container{font-size: 14px}
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
.spsty6{margin-left:15px;margin-top: -10px;}
</style>
