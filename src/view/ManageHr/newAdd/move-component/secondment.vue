<template>
  <div class="app-container">
    <div class="box">
      <el-form :model="form" label-width="140px">
        <el-form-item label="调出部门">
          <el-input v-model="department" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="调入部门" >
          <el-select v-model="move_department" popper-class='move_department' placeholder="请选择">
            <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value">
               <div id='serch'>
                <el-tree
                  :data="cities[0].data"
                  node-key="id"
                  :default-expanded-keys="[2, 3]"
                  :default-checked-keys="[5]"
                  :props="defaultProps"
                  @node-click	='checkmd'
                  >
                </el-tree>
               </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否自动返部门">
          <!-- <el-input v-model="" autocomplete="off" /> -->
          <el-switch
            v-model="is_auto"
            active-color="#5677FC"
            inactive-color="#ccc"
            @change="change"
          />
        </el-form-item>
        <el-form-item v-if="is_auto" label="返部门时间">
          <!-- <el-date-picker
            v-model="form.return_at"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            @change="formt"
          ></el-date-picker>-->

          <div class="box">
            <el-date-picker
              v-model="return_at"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="timestamp"
              @change="formt"
            />
          </div>
        </el-form-item>
        <!-- <el-form-item label="结束借调">
          <el-button :type="type" @click="end">结束</el-button>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="sure">确 认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import { newAdd } from "@/api/ManageHr/newAdd";

import EmployeeApi from '@/api/ManageHr/EmployeeFiles'
// import { getDepartTree } from '@/api/BaseModule/SetManage'
export default {
  name: 'Index',
  components: {},
  data() {
    return {
      move_department:'',
      cities:[],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      // 表单
      department: '',
      form: {
        department_id: '',
        dept_shop: '',
        id: this.$store.state.editId,
        type: '4',
        is_auto: 0,
        return_at: '',
        status: '1'
      },
      return_at:'',
      is_auto: false,
      type: 'primary',
      restaurants: [],
      state: ''
    }
  },
  created() {
     // 获取门店
    EmployeeApi.get_department_tree2().then(res=>{
      // console.log(res);

      this.cities=[{data:res}];
    });
    EmployeeApi.get_department(this.$store.state.editId).then(res => {
      // console.log(res, 555);
      this.department = res.department.depart_name
      this.form.department_id = res.department_id
    })
   
  },

  methods: {
      // 选择门店
    checkmd(e){
      console.log(e)
      this.move_department = e.name;
      if(e.id.indexOf('d')>-1){
        let val =  {
          "shop_id":0,
          "department_id":e.id.slice(1)
        };
        // this.form.dept_shop = JSON.stringify(val);
        this.form.dept_shop = val;
      }else{
        let val = {
          "shop_id":e.id.slice(1),
          "department_id":0
        };
        // this.form.dept_shop = JSON.stringify(val);
        this.form.dept_shop = val;
      }
    },
    sure() {
      console.log(this.form)
      EmployeeApi.add_m_info(this.form).then(res => {
        console.log(res)
        if (res.code == '200') {
          // this.$store.state.isComponent = false;
          this.$emit('isTanc')
        }
      })
    },
    cancle() {
      this.$emit('isTanc')
    },
    change(e) {
      console.log(e)
      this.form.is_auto = e == true ? '1' : '0'
    },
    // end() {
    //   this.type = ''
    //   this.form.status = '0'
    // },
    formt(e) {
      this.form.return_at = parseInt(e / 1000);
      console.log(this.form.return_at)
    },
    // 部门列表
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
    handleSelect(item) {
      console.log(item)
      this.state = item.name
      this.form.new_department_id = item.id
    },
    handleIconClick(ev) {
      console.log(ev)
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  .el-autocomplete {
    width: 100%;
  }
  .el-date-editor{
    width: 100%;
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
.move_department{
  .el-select-dropdown__item{
    overflow:auto;
    height:400px;
    background: #fff;
  }
}
</style>

