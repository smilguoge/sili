<template>
  <div id="add_detail">
    <el-dialog :close-on-click-modal="false" width="30%" center title="产品选择表" :visible.sync="dialogTableVisible" @close="close">
      <div id="add_detail_form">
        <div id="box">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="选择产品：">
              <el-input v-model="form.name" @focus="select_project" />
            </el-form-item>
            <el-form-item label="选择门店：">
              <el-input v-model="form.name" @focus="select_shop" />
            </el-form-item>
          </el-form>
          <div class="btn">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" class="sure">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="tanc">
      <SelectProject ref="SelectProjectView" v-if="is_show==1" @hide="hide" />
      <SelectShop v-else-if="is_show==2" @hide="hide" />
    </div>
  </div>
</template>
<script>
import SelectProject from './select_project'
import SelectShop from './select_shop'
export default {
  name: 'AddDetail',
  components: {
    SelectProject,
    SelectShop
  },
  props: {
    arrShop: {
      type: Array,
      default() {
        return []
      }
    },
    arrProduct: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogTableVisible: true,
      form: {
        name: ''
      },
      is_show: null
    }
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$emit('hide')
    },
    // 隐藏组件
    hide(data) {
      this.is_show = null
    },
    // 选择产品
    select_project() {
      // console.log(this.$refs.SelectProjectView.tableData)
      // this.$refs.SelectProjectView.tableData = this.arrProduct
      this.is_show = 1
    },
    // 选择门店
    select_shop() {
      this.is_show = 2
    }
  }
}
</script>
<style lang="scss" scoped>
#add_detail {
  #add_detail_form {
    #box {
      width: 90%;
      margin: 0 auto;
      .el-form-item {
        margin-bottom: 50px;
        margin-top: 20px;
      }
      .btn {
        display: flex;
        justify-content: center;
        .sure {
          margin-left: 40px;
        }
      }
    }
  }
}
</style>
<style>
#add_detail .el-dialog__header {
  border-bottom: 1px solid #e6e6e6 !important;
}
</style>
