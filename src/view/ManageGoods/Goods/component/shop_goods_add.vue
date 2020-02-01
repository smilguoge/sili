<template>
  <div id="specific_details">
    <el-drawer
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="table"
      direction="rtl"
      :modal="false"
      size="100%"
      @close="close"
    >
      <div slot="title" class="header-title">
        <el-button class="filter-item" type="primary">打印</el-button>
        <el-button class="filter-item" type="primary">导出</el-button>
      </div>
      <div id="specific_details_table">
        <div id="close" @click="close">
          <span />
        </div>
        <div id="box">
          <div class="box">
            <el-form :model="formInline" class="demo-form-inline" label-width="90px">
              <el-form-item label="铺货门店：">
                <el-input v-model="formInline.shopname" disabled placeholder="" />
                </el-select>
              </el-form-item>
              <el-form-item label="操作人：">
                <el-input v-model="formInline.user" disabled placeholder="" />
              </el-form-item>
              <el-form-item label="操作时间：">
                <el-input v-model="formInline.user" disabled placeholder="" />
              </el-form-item>
              <el-form-item label="打印状态：">
                <el-input v-model="formInline.user" disabled placeholder="" />
              </el-form-item>
              <div class="remak">
                <el-form-item label="备注：">
                  <el-input v-model="formInline.user" placeholder="" />
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="control">
            铺货明细
            <div>
              <!-- <el-button class="filter-item" type="primary">导入</el-button> -->
              <el-button class="filter-item" icon="el-icon-plus" type="primary" @click="add">新增明细</el-button>
              <el-button class="filter-item" icon="el-icon-delete" type="primary">删除明细</el-button>
            </div>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            show-summary
            :summary-method="getSummaries"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" label="产品编号">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="产品全称" />
            <el-table-column align="center" prop="name" label="产品简称" />
            <el-table-column align="center" prop="name" label="产品类型" />
            <el-table-column align="center" prop="name" label="规格" />
            <el-table-column align="center" label="数量">
              <template slot-scope="scope">
                <el-input :value="scope.row.num" size="mini" placeholder="请输入内容" />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="单位" />
            <el-table-column align="center" prop="name" label="对方单位" />
            <el-table-column align="center" prop="name" label="仓库" />
            <el-table-column align="center" prop="name" label="备注" />
          </el-table>
          <div class="btn">
            <el-button
              class="filter-item"
              @click="close"
            >&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            <el-button class="filter-item" type="primary">确认铺货</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
    <div class="tanc">
      <AddDetail v-if="is_show" :arrShop="arrShop" :arrProduct="arrProduct" ref="AddDetailView" @hide="hide" />
    </div>
  </div>
</template>
<script>
import AddDetail from './add_detail'
export default {
  name: 'SpecificDetails',
  components: { AddDetail },
  data() {
    return {
      table: true,
      dialog: true,
      formInline: {
        user: '',
        region: '',
        shopname: ''
      },
      arrProduct: [],
      arrShop: [],
      arrWarehouse: [],
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',
      value3: '',
      tableData: [{}

      ],
      multipleSelection: [],
      is_show: false
    }
  },
  methods: {
    // 关闭弹窗
    close() {
      this.$emit('hide')
    },
    hide() {
      this.is_show = false
    },
    onSubmit() {
      console.log('submit!')
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 新增明细
    add() {
      this.is_show = true
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        } else if (index === 6) {
          const values = data.map(item => {
            Number(item[column.property])
            console.log(item)
          })

          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ' '
          }
        } else {
          sums[index] = ''
          return
        }
      })

      return sums
    }
  }
}
</script>
<style lang="scss" scoped>
#specific_details {
  .el-dialog__wrapper {
    right: 0;
    left: 35%;
    width: 65%;
    .header-title {
      display: flex;
      justify-content: flex-end;
    }
    #specific_details_table {
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
      #box {
        margin: 20px 20px 0;
        width: calc(100% - 63px);
        .demo-form-inline {
          display: flex;
          flex-wrap: wrap;
          .remak {
            width: 100%;
          }
        }
        .control {
          display: flex;
          border: 1px solid #e5e5e5;
          border-bottom: none;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .btn {
          margin-top: 30px;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
