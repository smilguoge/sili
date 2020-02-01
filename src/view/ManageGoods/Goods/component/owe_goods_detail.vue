<template>
  <div id="owe-goods_detail">
    <el-drawer
      :show-close="false"
      :visible.sync="table"
      direction="rtl"
      :modal="false"
      size="50%"
      @close="close"
    >
      <div slot="title" class="header-title">
        欠货明细
      </div>
      <div id="owe-goods_detail_box">
        <div id="close" @click="close">
          <span />
        </div>
        <div class="conter">
          <div class="info">
            <p class="title">基础信息</p>
            <ul>
              <li>
                <span>销售订单号 : </span> {{ info.order_no }}
              </li>
              <li>
                <span>顾客姓名 : </span> {{ info.user_name }}
              </li>
              <li>
                <span>所属套餐 : </span> {{ info.card_package_name }}
              </li>
              <li>
                <span>产品名称 : </span> {{ info.product_name }}
              </li>
              <li>
                <span>欠货数量 : </span> {{ info.quantity }}
              </li>
              <li>
                <span>剩余欠货 : </span> {{ info.surplus_quantity }}
              </li>
            </ul>
            <div class="btn">
              <el-button type="primary" @click="return_money">还货</el-button>
              <el-button type="primary" @click="exchange">兑换</el-button>
            </div>
          </div>
          <div id="table">
            <div class="title">
              还货明细
            </div>
            <el-table
              border
              :data="tableData"
              style="width: 100%"
            >
              <el-table-column
                align="center"
                prop="type"
                label="类型"
              />
              <el-table-column
                align="center"
                prop="quantity"
                label="还货数量"
              />
              <el-table-column
                align="center"
                label="还货时间"
              >
                <template slot-scope="{row}">
                  {{ row.created_at | parseTime('{y}.{m}.{d} {h}: {i}') }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="operator"
                label="操作人"
              />
              <el-table-column
                align="center"
                prop="remark"
                label="备注"
              />
            </el-table>
          </div>
        </div>
      </div>
    </el-drawer>
    <div id="tanc">
      <ReturnMoney ref="toReturnMoney" v-if="is_tanc==1" @hide="hide" />
      <Exchange ref="ExchangeView" v-else-if="is_tanc==2" @hide="hide" />
    </div>
  </div>
</template>
<script>

import ReturnMoney from './return_money'
import Exchange from './exchange'
import { whReturnIndex, whReplaceCreate } from '@/api/ManageGoods/owe.js'
export default {
  name: 'OweGoodsDetail',
  components: { ReturnMoney, Exchange },
  data() {
    return {
      table: true,
      is_tanc: null,
      info: [],
      tableData: []
    }
  },
  created() {

  },

  methods: {
    getlist() {
      this.$parent.getlist()
      this.$parent.handleDetail(0, { id: this.info.wh_backorder_id })
    },
    // 关闭弹窗
    close() {
      this.$emit('hide')
    },
    //  兑换
    exchange() {
      // 获取兑换渲染
      whReplaceCreate({ ids: this.info.wh_backorder_id }).then(response => {
        this.$refs.ExchangeView.tableData = response.data.arrLog
        this.$refs.ExchangeView.restaurants2 = response.data.arrProduct.map(v => {
          this.$set(v, 'value', v.name)
          return v
        })
      })
      this.is_tanc = 2
    },
    // 显示还货弹窗
    return_money(index, row) {
      this.is_tanc = 1
      // 还贷渲染
      whReturnIndex({ wh_backorder_id: this.info.wh_backorder_id }).then(response => {
        this.$refs.toReturnMoney.form = {
          product_name: response.data.product_name,
          quantity: response.data.quantity,
          num: this.info.surplus_quantity
        }
        this.$refs.toReturnMoney.options = response.data.arrWarehouse['warehouse']
        this.$refs.toReturnMoney.value = response.data.arrWarehouse['detail']
        this.$refs.toReturnMoney.wh_backorder_id = this.info.wh_backorder_id
      })
      this.is_show = 2
    },
    // 隐藏弹窗组件
    hide() {
      this.$emit('hide')
    }
  }
}
</script>

<style lang="scss" scoped>
#owe-goods_detail {
  .el-dialog__wrapper {
    right: 0;
    .header-title {
      text-align: center;
    }
    #owe-goods_detail_box {
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
      .conter{
        width:calc(100% - 23px);
        .info{
          border: 1px solid #e6e6e6;
          margin: 20px;
          .title{
            padding: 20px;
            margin:0;
            border-bottom: 1px solid #e6e6e6;
          }
          ul{
            margin:20px 0 ;
            // padding: 0;
            list-style: none;
            li{
              margin-top:20px;
              span{
                width:100px;
                display: inline-block;
              }
            }
          }
          .btn{
            margin: 20px 40px;
          }

        }
        #table{
          margin: 20px;
          .title{
            padding: 20px;
            border: 1px solid #e6e6e6;
            border-bottom: none;
          }
        }
      }
    }
  }
}
</style>
