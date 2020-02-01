<template>
  <!-- 几选几开单 -->
  <el-dialog
    title="快捷开单"
    :visible.sync="dialogVisible"
    :before-close="onCancelSelectOrderDialog"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="select-dialog"
    width="1200px"
    @open="onOpenSelectOrderDialog()"
  >
    <div class="select-total-bar">
      <el-col :span="5" :offset="1">
        <span>开单类型:</span>
        <span class="num">{{ saleCardPackageData.type_name }}</span>
      </el-col>
      <el-col :span="5">
        <span>套餐名称:</span>
        <span class="main-color num">{{ saleCardPackageData.name }}</span>
      </el-col>
      <el-col :span="4">
        <span>达标总金额:</span>
        <span class="num">{{ saleCardPackageData.total_amount }}</span>
      </el-col>
      <el-col :span="4">
        <span>项目总次数:</span>
        <span class="num">{{ saleCardPackageData.total_num }}</span>
      </el-col>
      <el-col :span="4">
        <span>赠送项目:</span>
        <span class="num">{{ saleCardPackageData.limit_num }}</span>
      </el-col>
    </div>
    <div class="filter-container clearfix">
      <el-col :span="12">
        <span class="filter-item tit-font">品项查询：</span>
        <el-autocomplete
          v-model="inputGoodsForm.puTong.name"
          class="filter-item"
          style="width:190px"
          placeholder="请输入品项名称"
          :fetch-suggestions="onSearchGoods"
          @dblclick.native="openCombinationDialog"
          @focus="onFocusInputGoods('puTong')"
          @select="onSelectInputGoods"
          @input="onChangeInputGoods"
        />
        <el-input
          v-model="inputGoodsForm.puTong.num"
          class="filter-item"
          style="width:110px"
          placeholder="请输入次数"
          type="number"
        />
        <el-button
          class="filter-item"
          type="primary"
          @click="onFocusInputGoods('puTong');onAddSearchGoods('puTong')"
        >添 加</el-button>
      </el-col>
      <el-col :span="11" :offset="1">
        <span class="filter-item tit-font">赠送品项查询：</span>
        <el-autocomplete
          v-model="inputGoodsForm.zengSong.name"
          class="filter-item"
          style="width:190px"
          placeholder="请输入品项名称"
          :fetch-suggestions="onSearchGoods"
          @dblclick.native="openCombinationDialog"
          @focus="onFocusInputGoods('zengSong')"
          @select="onSelectInputGoods"
          @input="onChangeInputGoods"
        />
        <el-input
          v-model="inputGoodsForm.zengSong.num"
          class="filter-item"
          style="width:110px"
          placeholder="请输入次数"
          type="number"
        />
        <el-button
          class="filter-item"
          type="primary"
          @click="onFocusInputGoods('zengSong');onAddSearchGoods('zengSong')"
        >添 加</el-button>
      </el-col>

    </div>
    <div class="select-table">
      <div class="select-table-head">
        <el-col :span="2">
          <span class="tit-font">已选项目</span>
        </el-col>
        <el-col :span="8">
          <span class="tut-font err-color">剩余可选次数：</span>
          <span class="err-color">{{ totalRemainCount }}</span>
        </el-col>
      </div>
      <el-table
        :data="orderList"
        height="240px"
        class="item-table"
        fit
      >
        <!--<el-table-column
          align="center"
          label="编号"
        >
          <template slot-scope="{row}">
            {{ row.bianhao }}
          </template>
        </el-table-column>-->
        <el-table-column
          align="center"
          label="类别"
        >
          <template slot-scope="{row}">
            {{ row.gtype_name }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="名称"
        >
          <template slot-scope="{row}">
            {{ row.goods_name }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="购买次数"
        >
          <template slot-scope="{row}">
            {{ row.buyNum }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="类型"
        >
          <template slot-scope="{row}">
            {{ row.source }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-col :span="23">
        <el-button @click="onCancelSelectOrderDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="onSubmitSelectOrderDialog"
        >确 定</el-button>
      </el-col>
      <div style="clear:both" />
    </div>
    <order-item-dialog
      v-model="combinationDialogVisible"
      :dialog-type="focusInputGoodsType"
      :sale-card-package-list-par="{id:saleCardPackagePar.id,pcom_type:focusInputGoodsType=='puTong'?1:2}"
      @onAddGoods="onAddGoods"
      @submit="onCombinationDialogSubmit"
      @cancel="onCombinationDialogCancel"
    />
  </el-dialog>
</template>
<script>
import orderItemDialog from './orderItemDialog'
import { saleCardPackage, saleCardPackageSearch } from '@/api/ManageSales/Order'

export default {
  name: '',
  components: { orderItemDialog },
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    saleCardPackagePar: {
      type: Object,
      default() {
        return {}
      }
    },
    saleCardPackageSearchPar: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // -
      firstOpenSelectOrderDialog: true,
      saleCardPackageData: {},
      goodsList: {
        puTong: [],
        zengSong: []
      },
      focusInputGoodsType: '',
      inputGoodsForm: {
        puTong: { name: '', num: '', goods: null },
        zengSong: { name: '', num: '', goods: null }
      },
      orderList: [
      ],
      dialogVisible: false,
      combinationDialogVisible: false // 组合弹窗显示隐藏
    }
  },
  computed: {
    totalRemainCount() {
      return this.computeTotalPuTongRemainCount()
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
    onOpenSelectOrderDialog() {
      // 显示套餐数据
      var saleCardPackagePar = this.saleCardPackagePar
      saleCardPackage({ id: saleCardPackagePar.id, gtype: saleCardPackagePar.gtype, ctype: saleCardPackagePar.ctype }).then(res => {
        this.saleCardPackageData = res.data
      })

      // 普通列表
      var saleCardPackageSearchPar = this.saleCardPackageSearchPar
      saleCardPackageSearch({ id: saleCardPackageSearchPar.id, pcom_type: 1 }).then(res => {
        this.goodsList['puTong'] = res.data.list

        if (this.saleCardPackageData.card_package_type == 3) {
          this.focusInputGoodsType = 'puTong'
          var goodsList = this.goodsList[this.focusInputGoodsType]
          for (var i = 0, len = goodsList.length; i < len; i++) {
            this.inputGoodsForm['puTong']['goods'] = goodsList[i]
            this.inputGoodsForm['puTong']['num'] = 1
            this.onAddSearchGoods(this.focusInputGoodsType)
          }
        }
      })
      // 赠送列表
      saleCardPackageSearch({ id: saleCardPackageSearchPar.id, pcom_type: 2 }).then(res => {
        this.goodsList['zengSong'] = res.data.list
      })
    },
    onSubmitSelectOrderDialog() {
      this.$emit('onSubmit', this.orderList)
      this.onCancelSelectOrderDialog()
    },
    onCancelSelectOrderDialog() {
      this.$parent.selectOrderVisible = false
      this.goodsList.puTong = []
      this.goodsList.zengSong = []
      this.focusInputGoodsType = ''
      this.inputGoodsForm.puTong = { name: '', num: '', goods: null }
      this.inputGoodsForm.zengSong = { name: '', num: '', goods: null }
      this.orderList = []
    },
    openCombinationDialog() {
      console.log(this.focusInputGoodsType)
      this.combinationDialogVisible = true
    },
    onCombinationDialogSubmit(dialogType) {
      console.log(dialogType)
    },
    onCombinationDialogCancel(dialogType) {
      console.log(dialogType)
      this.combinationDialogVisible = false
    },
    onSearchGoods(queryString, cb) {
      var goodsList = this.goodsList[this.focusInputGoodsType]
      var results
      if (queryString) {
        queryString = queryString.toLowerCase()
        results = goodsList.filter(function(item) {
          return item.goods_name.toLowerCase().indexOf(queryString) != -1
        })
      } else { results = goodsList }

      cb(function(list) {
        var items = []
        for (var attr in list) { items.push({ value: list[attr]['goods_name'] }) }
        return items
      }(results))
    },
    onFocusInputGoods(type) {
      this.focusInputGoodsType = type
    },
    onSelectInputGoods(select) {
      var goodsList = this.goodsList[this.focusInputGoodsType]
      var selectItem
      var selectValue = select.value
      goodsList.filter(function(item) {
        if (item.goods_name == selectValue) { selectItem = item }
      })

      this.inputGoodsForm[this.focusInputGoodsType]['goods'] = selectItem
    },
    onChangeInputGoods(val) {
      if (!val) { this.inputGoodsForm[this.focusInputGoodsType]['goods'] = null }
    },
    onAddGoods(goods, callback) {
      if (goods['source'] == '正常购买') {
        var remain = this.computeTotalPuTongRemainCount()
        if (remain - goods['buyNum'] < 0) {
          callback(1, '购买次数超过最大可购买次数')
          return
        }
      }

      var list = this.orderList
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i]['id'] == goods['id']) {
          list[i]['buyNum'] = list[i]['buyNum'] * 1 + goods['buyNum'] * 1
          return
        }
      }

      this.orderList.push(function(goods) {
        var goods_ = {}
        for (var attr in goods) { goods_[attr] = goods[attr] }
        return goods_
      }(goods))
    },
    onAddSearchGoods(type) {
      var form = this.inputGoodsForm[type]
      if (!form['goods']) {
        this.$message({
          message: '请选择品项',
          type: 'warning'
        })
        return
      }
      if (!form['num']) {
        this.$message({
          message: '请输入次数',
          type: 'warning'
        })
        return
      }

      form['goods']['buyNum'] = form['num']
      var this_ = this
      this.onAddGoods(form['goods'], function(error, msg) {
        if (error) {
          this_.$message({
            message: msg,
            type: 'warning'
          })
        }
      })
    },
    computeTotalPuTongRemainCount() {
      var orderList = this.orderList
      var total = 0
      for (var i = 0, len = orderList.length; i < len; i++) {
        if (orderList[i]['source'] == '正常购买') { total += orderList[i]['buyNum'] * 1 }
      }

      var total_num = this.saleCardPackageData.total_num
      total_num = total_num || 0
      return total_num - total
    }
  }
}
</script>
<style lang="scss" scoped>
.select-dialog{
  .select-total-bar {
    height: 50px;
    margin: -10px 20px 0;
    border-left: 4px solid #6666FE;
    border-radius: 4px;
    background-color: #F5F7FA;
    line-height: 50px;
    font-weight: 700;
    font-size: 14px;
    .num {
      font-weight: 400;
      font-size: 16px;
      margin-left: 6px;
    }
  }

  .filter-container {
    margin: 0 20px 0;
    margin-top: 16px;
    padding: 16px 24px 8px;
    border: 1px solid #DCDFE6;
    border-bottom: 0;
    border-radius: 4px 4px 0 0;
  }

  .select-table {
    margin: 0 20px;
    border: 1px solid #DCDFE6;
    border-radius: 0 0 4px 4px;
    overflow: hidden;
    .select-table-head {
    height: 40px;
    line-height: 40px;
    text-align: center;
    padding: 0 10px;
    border-bottom: 1px solid #dcdfe6;
  }
  }
}

</style>
