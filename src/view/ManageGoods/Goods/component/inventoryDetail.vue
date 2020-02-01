<template>
<el-dialog
    :visible.sync="dialogVisible"
    title="产品盘点查询"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    top="30px"
    :fullscreen="false"
    class="money-detail-dialog"
    width="1200px"
  >
    <div class="search-box">
      <el-form :inline="true" :model="listQuery" class="search-form">
        <div class="line">
          <el-form-item>
            <el-input v-model="warehouse"  placeholder="仓库" disabled />
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery.type" placeholder="请选择类型" clearable>
              <el-option label="全部" :value="0"/>
              <el-option label="有盈亏" :value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
          </el-form-item>
        </div>
        <div class="line">
          <el-form-item>
            <el-button type="primary">导出</el-button>
            <el-button type="primary">高级查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table">
      <el-table
        v-loading="listLoading"
        class="table-body-ly"
        highlight-current-row
        :data="tableData"
        border
        fit
        max-height="450"
      >
        <el-table-column label="单据号" prop="document_number" min-width="150"  align="center" />
        <el-table-column label="产品类别" prop="product_class" min-width="120" align="center" />
        <el-table-column label="产品全称" prop="product_name" min-width="120" align="center" />
        <el-table-column label="产品简称" prop="product_short_name" min-width="120" align="center" />
        <el-table-column label="产品编码" prop="product_code" min-width="180" align="center" />
        <el-table-column label="规格" prop="product_specs" min-width="120" align="center" />
        <el-table-column label="库存数量" prop="stock_quantity" min-width="120" align="center" />
        <el-table-column label="盘点实际数量" prop="check_quantity" min-width="120" align="center" />
        <el-table-column label="盈亏数量" prop="change_quantity" min-width="120" align="center" />
        <el-table-column label="单位" prop="product_dic_unit" min-width="120" align="center" />
        <el-table-column label="盘点人" prop="operator" min-width="120" align="center" />
        <el-table-column label="盘点日期" min-width="150" align="center" >
            <template slot-scope="{row}">
            <span>{{ row.checked_at | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="120" align="center" />
      </el-table>
      <!-- <div class="m-footer main-page">
        <el-pagination
          v-show="total>0"
          :current-page="listQuery.page"
          :page-sizes="[10,20,30]"
          :page-size="listQuery.page_size"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div> -->
    </div>
    <div slot="footer" class="dialog-footer">
      <el-col :span="23">
        <!-- <el-button @click="handleClose">取 消</el-button> -->
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </el-col>
      <div style="clear:both" />
    </div>
  </el-dialog>
</template>
<script>
import inventoryApi from '@/api/ManageGoods/inventory_clearing'
export default {
    props: {
        visible: {
            type: Boolean,
            default() {
                return false
            }
        },
        id: {
            type: Number,
            default: ''
        }
    },
    data() {
        return {
            dialogVisible: false,
            depositId: '',
            warehouse: "",
            listLoading: false,
            total: 1,
            listQuery: {
                type: 0,
            },
            tableData: []
        }
    },
    watch: {
        visible(val) {
            this.dialogVisible = val
        },
        id(val) {
            this.depositId = val
            this.getList()
        }
    },
    methods: {
        getList() {
            const params = Object.assign({},this.listQuery);
            params.id = this.depositId;
            inventoryApi.getInventoryDetail(params).then(data => {
                this.warehouse = data.warehouse;
                this.tableData = data.list;
            }).catch(res => {

            })
        },
        handleClose() {
            this.$emit('handleClose',false)
        },
        handleSizeChange(val) {
            this.listQuery.page_size = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.listQuery.page = val
            this.getList()
        },
    }

}
</script>
<style lang="scss" scoped>
.money-detail-dialog {
  .dialog-footer {
    text-align: right;
  }
}
</style>