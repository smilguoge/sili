<template>
  <div class="money-center">
    <div class="money-body">
      <div class="money-body-top">
        <div class="money-body-app-1">
          <span>门店</span>
          <el-autocomplete
            v-model="makeData.make_store"
            popper-class="my-autocomplete"
            :fetch-suggestions="querySearch"
            placeholder="请输入门店"
            size="mini"
            @select="handleSelect"
          >
            <i slot="suffix" class="el-icon-edit el-input__icon" @click="handleIconClick" />
            <template slot-scope="{ item }">
              <div class="name">{{ item.name }}</div>
            </template>
          </el-autocomplete>
          <span>时间</span>
          <el-date-picker
            v-model="date"
            size="mini"
            type="daterange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button type="primary" size="mini" @click="moneygetdata()">查询</el-button>
        </div>
      </div>
      <!-- table -->
      <div class="money-body-centre">
        <div class="money-center-table">
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column prop="shop.name" label="门店" width="180" />
            <el-table-column prop="transfer_date" label="交款日期" width="180" />
            <el-table-column prop="amount" label="交款现金金额" />
            <el-table-column prop="remark" label="备注" />
            <el-table-column prop="from_staff.name" label="交款人" />
            <el-table-column prop="to_staff.name" label="接款人" />
            <el-table-column prop="updated_at" label="操作日期" />
          </el-table>
        </div>
        <div class="money-pag">
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :page-size="pagesize"
            background
            @current-change="current_change"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Moneytableget } from '@/api/home.js'
import { ShiftsStoreGet } from '@/api/ManageHr/Schedu.js'
export default {
  data() {
    return {
      makeData: {
        make_store: ''
      },
      moneydata: {
        shop_id: '',
        page: 1,
        page_size: '',
        start_ts: '',
        end_ts: ''
      },
      tableData: [],
      date: [],
      restaurants: [],
      total: 1,
      pagesize: 10, // 每页的数据条数
      currentPage: 1 // 默认开始页面
    }
  },
  created() {
    this.dataget()
  },
  methods: {
    dataget() {
      ShiftsStoreGet().then(res => {
        this.restaurants = res.data
      })
      Moneytableget().then(res => {
        this.tableData = res.data.list
        this.tableData.forEach((item, index) => {
          item.updated_at = this.dateInit(item.updated_at)
          item.transfer_date = this.dateInit(item.transfer_date)
        })
        this.total = Number(res.data.total_count)
      })
    },
    // 时间格式
    dateInit(data) {
      const date = new Date(parseInt(data) * 1000)
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let minute = date.getMinutes()
      let second = date.getSeconds()
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second
      const listdate = y + '-' + m + '-' + d
      return listdate
    },
    // el-事件
    // 门店 input
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    // input suo
    handleSelect(item) {
      this.makeData.make_store = item.name
      this.moneydata.shop_id = item.id
    },
    // 取消
    handleIconClick(ev) {
      this.makeData.make_store = ''
      this.moneydata.shop_id = ''
    },
    // 自定义事件
    // 查询
    moneygetdata() {
      const data = {
        shop_id: this.moneydata.shop_id,
        page: this.moneydata.page,
        page_size: this.moneydata.page_size,
        start_ts: Math.round(this.date[0] / 1000),
        end_ts: Math.round(this.date[1] / 1000)
      }
      // console.log(data);
      Moneytableget(data).then(res => {
        this.tableData = res.data.list
        this.tableData.forEach((item, index) => {
          item.updated_at = this.dateInit(item.updated_at)
          item.transfer_date = this.dateInit(item.transfer_date)
        })
        this.total = Number(res.data.total_count)
      })
    },
    // 分页
    current_change(currentPage) {
      this.moneydata.page = currentPage
      this.moneygetdata()
      // console.log(currentPage);
    }
  }
}
</script>
<style scoped>
.money-center {
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  background: #f5f5f5;
}
.money-body {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 3px;
}
.money-body-top {
  width: 100%;
  height: 60px;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #dcdfe6;
}
.money-body-app-1 {
  display: flex;
  align-items: center;
}
.money-body-app-1 > span {
  font-size: 14px;
  padding: 0 15px;
}
.money-body-app-1 > button {
  margin-left: 20px;
}
.money-body-centre {
  width: 100%;
  height: calc(100% - 60px);
  border-top: 10px #f5f5f5 solid;
  position: relative;
  /* min-height: 400px; */
  overflow: hidden;
}
.money-center-table {
  width: calc(100% + 16px);
  height: 100%;
  padding-bottom: 40px;
  overflow-y: scroll;
}
.money-pag {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0;
  background: #fff;
  z-index: 100;
}
</style>
