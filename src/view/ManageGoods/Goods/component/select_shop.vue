<template>
  <div id="select_shop">
    <el-dialog :close-on-click-modal='false' @close="close" width="25%" center title="选择门店" :visible.sync="dialogTableVisible">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <div class="btn">
        <el-button type="primary" plain>全选</el-button>
        <el-button type="primary" plain>反选</el-button>
      </div>
      <div id="select_shop_table">
        <el-tree
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree"
          show-checkbox
        ></el-tree>
      </div>
      <div class="control">
        <el-button class="cancel" @click="close">取消</el-button>
        <el-button type="primary" >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "add_detail",
  data() {
    return {
      dialogTableVisible: true,
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      filterText: ""
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$emit("hide");
    },
    //树节点事件
    change(el, er) {
      console.log(el, er);
    },
    // 搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  }
};
</script>
<style lang="scss" scoped>
#select_shop {
  #select_shop_table {
    border: 1px solid #e6e6e6;
  }
  .btn {
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;
  }
  .control{
    display: flex;
    margin-top: 20px;
    justify-content: center;
    .cancel{
      margin-right: 40px;
    }
  }
}
</style>
<style>
#add_detail .el-dialog__header {
  border-bottom: 1px solid #e6e6e6 !important;
}
</style>