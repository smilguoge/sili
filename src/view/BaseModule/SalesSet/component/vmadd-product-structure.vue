<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="this.snycVmaddProduct"
      width="35%"
      append-to-body
      :before-close="handleClosep"
      :close-on-click-modal="false"
    >
      <div class="structure-wrap">
        <div class="structure-body structure-main">
          <el-input v-model="filterText" placeholder="组织机构名称" prefix-icon="el-icon-search" />
          <div class="structure-button">
            <el-button size="mini" round @click="checkAll">全选</el-button>
            <el-button size="mini" round @click="inverse">反选</el-button>
          </div>
          <el-tree
            ref="tree"
            v-loading="listLoading"
            class="filter-tree"
            node-key="id"
            :data="structureData"
            :props="structureProps"
            :highlight-current="true"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :default-checked-keys="selectedData"
            :show-checkbox="activeShow"
            default-expand-all
            @node-click="nodeClick"
            @check-change="checkClick"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddStore()">取 消</el-button>
        <el-button type="primary" @click="AddStorepost()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { productStructureGet } from '@/api/BaseModule/SalesSet'
/**
 * FIXME: 该组件数据渲染不固定，会精确到门店或员工，用来适用于不同的组件。
 *
 * FIXME: 若有要添加新的需求请写好注释，以免误删！
 */
export default {
  name: 'Structure2',
  props: {
    checkData: {
      type: Array
    },
    snycApplyProduct: {},
    snycVmaddProduct: false,
    snycApplyProductName: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      // 提交数据
      datapost: this.snycpost,
      filterText: '',
      currentArr: [],
      currenName: [],
      structureData: [],
      activeShow: true,
      selectedData: [],
      structureProps: {
        children: 'child',
        label: 'name'
      },
      listLoading: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    checkData(val) {
      this.selectedData = val
      // console.log(this.selectedData);
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      // 获取数据
      productStructureGet().then(res => {
        this.structureData = res.data
        // console.log(res.data)
      })
    },
    triggerto(data) {
      // this.$refs.tree.setCheckedKeys([]);
    },
    filterNode(value, data) {
      // - 筛选
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    nodeClick(data) {},
    checkClick(data, checked, indeterminate) {},

    addCheck(type = 'auth') {
      const checkArr = this.$refs.tree.getCheckedNodes()
      const resArr = []
      const resArrName = []
      this.currentArr = []
      checkArr.forEach(item => {
        if (item.child.length == 0) {
          resArr.push(item.id)
          resArrName.push(item.name)
          // console.log(resArr);
        }
        return resArr, resArrName
      })
      this.currentArr = resArr
      this.currenName = resArrName
    },
    // 选择中
    setdatainit(data) {
      console.log(data)
      if (data.length > 0) {
        this.$refs.tree.setCheckedKeys(data)
      }
    },
    // 处理全选
    checkAll() {
      this.flag = true
      this.$refs.tree.setCheckedNodes(this.structureData)
    },
    // 全选处理方法
    batchSelect(nodes, refs, flag, seleteds) {
      if (typeof nodes !== 'undefined') {
        nodes.forEach(element => {
          refs.setChecked(element, flag, true)
        })
      }
      if (typeof seleteds !== 'undefined') {
        seleteds.forEach(node => {
          refs.setChecked(node, !flag, true)
        })
      }
    },
    // 反选
    inverse() {
      const res = this.$refs.tree
      const nodes = res.getCheckedNodes(true, true)
      this.batchSelect(this.structureData, res, true, nodes)
    },
    // 关闭
    AddStore() {
      //   const data = this.snycVmaddStruc;
      //   data.snycStore = false;
      this.$emit('update:snycVmaddProduct', false)
      this.$refs.tree.setCheckedKeys([])
    },
    // 提交
    AddStorepost() {
      // 已选数据
      this.addCheck()
      if (this.currentArr.length <= 0) {
        this.$message({
          message: '请选择',
          type: 'warning'
        })
        return false
      }
      const data_name = String(this.currenName)
      const set_data = {
        goods_type: 3,
        is_using: 0,
        goods_id: this.currentArr
      }
      //  console.log(set_data)
      this.$emit('update:snycApplyProduct', set_data)
      this.$emit('update:snycApplyProductName', data_name)
      this.AddStore()
    },
    handleClosep(done) {
      this.AddStore()
    }
  }
}
</script>

<style lang="scss" scoped>
.structure-body {
  // width: 300px;
  width: 100%;
  min-height: 400px;
  height: 100%;
  padding: 8px 8px 0;
  box-sizing: border-box;

  .el-tree {
    margin-top: 10px;
  }
  .structure-button {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin-top: 10px;
  }
  .structure-button > button {
    margin-right: 10px;
  }
}
</style>

