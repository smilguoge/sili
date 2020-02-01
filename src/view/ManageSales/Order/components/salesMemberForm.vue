<template>
  <!-- 会员信息 -->
  <div class="m-form-body">
    <div class="filter-container">
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
      />
      <!-- <el-input
        v-model="listQuery.name"
        style="width: 210px;"
        placeholder="请输入会员编号"
        prefix-icon="el-icon-search"
      /> -->
      <el-button
        type="primary"
        style="margin-left: 10px"
        icon="el-icon-search"
        @click="handleFilter"
      >查 询</el-button>
    </div>
    <div class="m-form-ly">
      <el-form
        :model="memberData"
        label-position="right"
      >
        <el-col :span="10" class="h50">
          <el-form-item
            label="会员姓名 :"
            label-width="100px"
          >
            <span class="info-color">{{ memberData.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7" class="h50">
          <el-form-item label="属性 :">
            <span class="info-color">{{ memberData.customer_attr_name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7" class="h50">
          <el-form-item label="积分 :">
            <span class="info-color">{{ memberData.surplus_integral }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10" class="h50">
          <el-form-item
            label="手机号码 :"
            label-width="100px"
          >
            <span class="info-color">{{ memberData.phone }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7" class="h50">
          <el-form-item label="订金 :">
            <span class="info-color">{{ memberData.deposit }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7" class="h50">
          <el-form-item label="欠货 :">
            <el-button type="text" @click="openDialog('oweGoods')">
              {{ memberData.short_goods_quantity }}
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="10" class="h50">
          <el-form-item
            label="出生日期 :"
            label-width="100px"
          >
            <span v-if="memberData.birthday" class="info-color">{{ memberData.birthday | parseTime('{y}-{m}-{d}') }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7" class="h50">
          <el-form-item label="等级 :">
            <span class="info-color">{{ memberData.customer_grade_name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7" class="h50">
          <el-form-item label="星级 :">
            <span class="info-color">{{ memberData.customer_star_name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="h50">
          <el-form-item
            label="有效业绩 :"
            label-width="100px"
          >
            <!-- <span class="info-color"> </span> -->
            <el-button
              style="margin-left:18px"
              size="mini"
              type="primary"
              plain
              @click="handleDistribution"
            >业绩分摊</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <div style="clear:both" />
    </div>
    <distributionDialog ref="distributionDialog" @setAchievement="setAchievement" />
  </div>
</template>

<script>
// import { fetchList } from '@/api/demo/article'
import { customerList, userInfo } from '@/api/ManageSales/Order.js'
import distributionDialog from './distributionDialog' // 业绩分摊
export default {
  name: 'InlineEditTable',
  components: {
    distributionDialog
  },
  data() {
    return {
      restaurants: [],
      state: '',
      timeout: null,
      listQuery: {
        name: ''
      },
      memberData: {
        name: '',
        customer_attr_name: '',
        surplus_integral: '',
        phone: '',
        deposit: '',
        short_goods_quantity: '',
        birthday: '',
        customer_grade_name: '',
        customer_star_name: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 显示业绩分摊
    handleDistribution() {
      this.$refs.distributionDialog.init()
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 1000 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 选择后获取用户信息
    handleSelect(item) {
      userInfo({ id: item.id, fields: 'deposit,surplus_integral,short_goods_quantity' }).then(response => {
        this.memberData = response.data
        this.$emit('handleSetMember', this.memberData)
      })
    },
    // 获取所有用户
    getList() {
      customerList({ keyword: '' }).then(response => {
        const items = response.data.list
        this.list = items.map(v => {
          this.$set(v, 'value', v.name)
          return v
        })
        this.restaurants = this.list
        console.log(this.list)
      })
      // this.listLoading = true
      // fetchList(this.listQuery).then(response => {
      //   const items = response.data.items
      //   this.list = items.map(v => {
      //     this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
      //     v.originalTitle = v.title //  will be used when user click the cancel botton
      //     return v
      //   })
      //   this.listLoading = false
      // })
    },
    // 从子组件获取分摊用户信息传到父组件
    setAchievement(data) {
      this.$emit('getAchievement', data)
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    },
    handleFilter() {
      // this.getList(this.listQuery);
    },
    // 打开业绩分摊
    openDialog(type, data) {
      this.$emit('open', type)
    }
  }
}
</script>

<style scoped>
.m-form-body{
  /* padding: 10px 0 0 10px */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.filter-container{
  padding-top: 16px;
  box-sizing: border-box;
}
.m-form-ly{
  height: 220px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding-top: 10px;
}
.h50{
  height: 50px;
}
</style>
