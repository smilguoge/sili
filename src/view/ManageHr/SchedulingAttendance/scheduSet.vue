<template>
  <div id="hot-preview" class="app-container">
    <div class="filter-container">
      <div class="filter-margin">
        <span style="margin-right: 10px">选择日期</span>
        <el-date-picker
          v-model="inputValue.date"
          type="month"
          @change="inputFuc"
          placeholder="年/月">
        </el-date-picker>
        <span style="margin-right: 10px;margin-left: 10px">门店</span>
        <el-autocomplete
          v-model="state"
          popper-class="my-autocomplete"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          size="mini"
          @select="handleSelect"
        >
          <i slot="suffix" class="el-icon-edit el-input__icon" @click="handleIconClick" />
          <template slot-scope="{ item }">
            <div class="name">{{ item.name }}</div>
          </template>
        </el-autocomplete>
        <el-button type="primary" style="margin-left: 10px" @click="querydata">查询</el-button>
        <el-button type="primary">导出</el-button>
      </div>
      <div class="filter-margin">
        <span class="desc morning-shift">早班</span>
        <span class="desc evening-shift">晚班</span>
        <span class="desc general-ban">通班</span>
        <span class="desc upper-rest">上休</span>
        <span class="desc next-rest">下休</span>
        <span class="desc rest">休息</span>
      </div>
      <el-button type="primary" class="filter-margin set" @click="Settingone()">班次设置</el-button>
    </div>
    <HotTable :date="date" :setting='settingData' :shopids="dataId.shop_ids + ''"/>

    <div class="Shifts-none">
      <ScheduleSetting ref="setting" :sy-setting.sync="SettingNone" />
    </div>
  </div>
</template>

<script>
import HotTable from '@/component/handsontable-pro'
import ScheduleSetting from '@/view/ManageHr/component/ScheduleSetting'
import { ShiftsStoreGet, SchedulingSettingGet } from '@/api/ManageHr/Schedu.js'

export default {
  data: function() {
    return {
      // 门店数据
      restaurants: [],
      // 表数据
      settingData: [],

      setting_class: [],
      setting_period: [],
      state: '',
      dataId: {
        shop_ids: ''
      },
      AddId: null,
      inputValue: {
        date: '',
        selectVal: ''
      },
      SettingNone: false, // 班次设置
      date: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    handleIconClick(ev) {
      this.state = ''
      this.dataId.shop_ids = ''
    },
    handleSelect(item) {
      this.state = item.name
      this.dataId.shop_ids = item.id
    },
    // 查询
    querydata() {
      SchedulingSettingGet(this.dataId).then(res => {
        if (res.code === 200) {
          let data = res.data.list
          for (let i = 0; i < data.length; i++) {
            for (let key in data[i]) {
              if (key === 'name') {
                data[i][key] = data[i]['position_id'] ? data[i][key] + '(' + data[i]['position_id'] + ')' : data[i][key]
              }
            }
          }
          this.settingData = data
        }
      })
    },
    // 数据渲染
    getData() {
      // 获取数据
      ShiftsStoreGet().then(res => {
        this.restaurants = res.data
      })
    },
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
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) !==
          -1
        )
      }
    },
    // 班次设置
    Settingone() {
      this.SettingNone = true
    },
    handleNodeClick(data) {
      if (!data.children) {
        this.inputValue.selectVal = data.label
        this.$refs.reference.blur()
      }
    },
    inputFuc(data) {
      const date = new Date(data)
      this.date = date.getFullYear() + '-' + (date.getMonth() + 1)
    }
  },
  components: {
    HotTable,
    ScheduleSetting
  }
}
</script>

<style lang="scss" scoped>
  #hot-preview {
    .filter-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      .filter-margin {
        margin-bottom: 10px;
      }
      .desc {
        padding: 10px 20px;
        color: #fff;
        border-radius: 2px;
        margin-left: 10px;
      }
    }
    @media (max-width: 1355px) {
      .filter-container {
        justify-content: normal;
        .set {
          margin-left: 100px;
        }
      }
    }
  }
</style>
