<template>
  <div class="app-container">
    <div class="box">
      <el-form :model="form" label-width="100px">
        <el-form-item label="调出部门">
          <el-input v-model="department" autocomplete="off" />
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="sure">确 认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import EmployeeApi from "@/api/ManageHr/EmployeeFiles";
import { getDepartTree } from "@/api/BaseModule/SetManage";
export default {
  name: "Index",
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
      department: null,
      form: {
        department_id: "",
        dept_shop: "",
        id: this.$store.state.editId,
        type: "1"
      },
      restaurants: [],
      state: ""
    };
  },
  created() {
    // 获取门店
    EmployeeApi.get_department_tree2().then(res=>{
      // console.log(res);

      this.cities=[{data:res}];
    });
    //  console.log(this.$store.state.editId,'id');
    EmployeeApi.get_department(this.$store.state.editId).then(res => {
      //  console.log(res,222);
       if(res.department){
        this.department = res.department.depart_name;
       }
      this.form.department_id = res.department_id;
    });
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
      EmployeeApi.add_m_info(this.form).then(res => {
        // console.log(res);
        if (res.code == "200") {
          // this.$store.state.isComponent=false
          this.$emit("isTanc");
        }
      });
    },
    cancle() {
      this.$emit("isTanc");
    },
    // 部门列表
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      // console.log(item);
      this.state = item.name;
      this.form.new_department_id = item.id;
    },
    handleIconClick(ev) {
      // console.log(ev);
    }
  }
};
</script>

<style scoped lang="scss">
.box {
  .el-autocomplete {
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

