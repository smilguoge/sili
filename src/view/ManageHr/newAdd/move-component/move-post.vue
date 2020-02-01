<template>
  <div class="app-container">
    <div class="box">
      <el-form :model="form" label-width="100px">
        <el-form-item label="原职务">
          <el-input v-model="position" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="现职务" required>
          <!-- <el-input v-model="form.new_position_id" autocomplete="off" />
          -->
          <div class="box">
            <el-autocomplete
              v-model="position_name"
              popper-class="my-autocomplete"
              :fetch-suggestions="promoter_id_querySearch"
              placeholder="请输入内容"
              @select="promoter_id_handleSelect"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon"
                @click="promoter_id_handleIconClick"
              />
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
            </el-autocomplete>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="sure">确 认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import { newAdd } from '@/api/ManageHr/newAdd'
import EmployeeApi from '@/api/ManageHr/EmployeeFiles'
import { positionList } from '@/api/BaseModule/SetManage'
export default {
  name: 'Index',
  components: {},
  data() {
    return {
      // 表单
      position: null,
      position_name: '',
      restaurants: [],
      form: {
        position_id: '',
        new_position_id: '',
        id: this.$store.state.editId,
        type: '2'
      }
    }
  },
  created() {
    EmployeeApi.get_department(this.$store.state.editId).then(res => {
      // console.log(res, 333);
      this.position = res.position.name
      this.form.position_id = res.position_id
    })
    positionList().then(res => {
      this.restaurants = res.data
    })
  },

  methods: {
    sure() {
      EmployeeApi.add_m_info(this.form).then(res => {
        // console.log(res)
        if (res.code == '200') {
          // this.$store.state.isComponent = false;
          this.$emit('isTanc')
        }
      })
    },
    cancle() {
      this.$emit('isTanc')
    },
    // 职务列表
    promoter_id_querySearch(queryString, cb) {
      if (queryString) {
        positionList(queryString).then(res => {
          // console.log(res, 'ffff')
          const restaurants = res.data
          cb(restaurants)
        })
      } else {
        cb(this.restaurants)
      }
    },
    promoter_id_createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    promoter_id_handleSelect(item) {
      // console.log(item);
      this.position_name = item.name
      this.form.new_position_id = item.id
    },
    promoter_id_handleIconClick(ev) {
      // console.log(ev)
    }
  }
}
</script>

<style scoped lang="scss">
.box{
  .el-autocomplete{
    width: 100%;
  }
}
.dialog-footer{
  display: flex;
  justify-content: center;
}
</style>

