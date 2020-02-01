<template>
  <div class="return_money">
    <el-dialog :close-on-click-modal="false" title="还货" width="30%" :visible.sync="dialogTableVisible" @close="close">
      <div id="return_money_form">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="欠货产品：">
            <el-input v-model="form.product_name" disabled />
          </el-form-item>
          <el-form-item label="库存数量：">
            <el-input v-model="form.quantity" disabled />
          </el-form-item>
          <el-form-item label="*还货数量：">
            <el-input v-model="form.num" />
          </el-form-item>
          <el-form-item label="仓库：">
            <div id="select">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="form.desc" type="textarea" />
          </el-form-item>
          <div id="btn">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="onSubmit">确认</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>

// import OweGoodsDetail from './owe_goods_detail'
import { whReturnCreate } from '@/api/ManageGoods/owe.js'
export default {
  name: 'ReturnMoney',
  components: {},
  data() {
    return {
      wh_backorder_id: 0,
      dialogTableVisible: true,
      form: {
        name: ''
      },
      options: [],
      value: ''
    }
  },
  created() {

  },
  methods: {
    // 关闭弹窗
    close() {
      this.$parent.is_tanc = null
      this.$parent.is_show = null
      // this.$emit('hide')
    },
    onSubmit() {
      if (!this.form.num) {
        this.$message({
          message: '请输入还货数量',
          type: 'warning'
        })
        return false
      }
      if (!this.value) {
        this.$message({
          message: '请先选择仓库',
          type: 'warning'
        })
        return false
      }
      var putData = {
        wh_backorder_id: this.wh_backorder_id,
        type: 1,
        quantity: this.form.num,
        remark: this.form.desc,
        warehouse_id: this.value
      }
      whReturnCreate(putData).then(response => {
        if (response.code === 200) {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.$parent.getlist()
          this.close()
        } else {
          this.$message({
            message: response.message,
            type: 'warning'
          })
        }
      })
    }
  }

}
</script>

<style  lang="scss" scoped>
#return_money_form{
  // border: 1px solid #e6e6e6;
  padding:20px;
  width:100%;
  #select,.el-select{
    width:100%;
  }
  #btn{
    display: flex;
    // align-items: center;
    justify-content: center;
  }
}
</style>
