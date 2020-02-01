<template>
  <!-- 积分兑换 -->
  <el-dialog
    :title="dialogType==='puTong'?'正常项目':'赠送项目'"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="order-item-dialog"
    width="600px"
    @open="onOpenOrderItemDialog"
  >
    <el-col :span="22" :offset="1">
      <div class="filter-container">
        <el-radio-group v-model="groupId">
          <el-radio v-for="(item,index) in groupList" :key="index" :label="item.id" class="filter-item">{{ item.name }}</el-radio>
        </el-radio-group>
      </div>
    </el-col>
    <el-col :span="22" :offset="1">
      <div class="discount-table">
        <el-table :data="itemList" style="width:100%" height="300px" fit>
          <el-table-column label="类别" align="center">
            <template slot-scope="{row}">
              <span>{{ row.gtype_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" align="center">
            <template slot-scope="{row}">
              <span>{{ row.goods_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" align="center">
            <template slot-scope="{row}">
              <span>{{ row.specs }}</span>
            </template>
          </el-table-column>
          <el-table-column label="原价" align="center">
            <template slot-scope="{row}">
              <span>{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.buyNum" type="number" placeholder="数量" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="onAddGoods(row)">添 加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <!--<el-col :span="23">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button
          type="primary"
          @click="onSubmit"
        >确 定</el-button>
      </el-col>-->
      <div style="clear:both" />
    </div>
  </el-dialog>
</template>
<script>
import { saleCardPackageList } from '@/api/ManageSales/Order'

export default {
  name: '',
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    dialogType: {
      type: String,
      default() {
        return ''
      }
    },
    saleCardPackageListPar: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // -
      groupId: 0,
      groupList: [],
      dialogVisible: false
    }
  },
  computed: {
    itemList() {
      for (var i = 0, len = this.groupList.length; i < len; i++) {
        if (this.groupList[i]['id'] == this.groupId) {
          return this.groupList[i]['cardPcomDtl']
        }
      }
      return []
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    }
  },
  created() {
    // -
  },
  methods: {
    onOpenOrderItemDialog() {
      var saleCardPackageListPar = this.saleCardPackageListPar
      saleCardPackageList({
        id: saleCardPackageListPar.id,
        pcom_type: saleCardPackageListPar.pcom_type,
        combination_id: saleCardPackageListPar.combination_id
      }).then(res => {
        this.groupList = res.data.list
      })
    },
    handleCancel() {
      this.$emit('cancel', this.dialogType)
    },
    onSubmit() {
      this.$emit('submit', this.dialogType)
      this.handleCancel()
    },
    onAddGoods(goods) {
      if (!(goods.buyNum > 0)) {
        this.$message({
          message: '请输入数量',
          type: 'warning'
        })
        return
      }

      var this_ = this
      this.$emit('onAddGoods', goods, function(error, msg) {
        if (error) {
          this_.$message({
            message: msg,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.order-item-dialog {
  .discount-table {
    margin-bottom:20px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    overflow: hidden;
  }
}
</style>
