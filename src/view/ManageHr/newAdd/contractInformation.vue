<template>
  <div class="app-container">
    <el-button type="primary">新增</el-button>
    <div class="box">
      <ul class="head">
        <li>合同编码*</li>
        <li>签订合同主体*</li>
        <li>合同开始日期*</li>
        <li>合同截至日期*</li>
        <li>合同状态</li>
      </ul>
      <ul class="input">
        <li>
          <el-input v-model="form.htbm" placeholder="请输入内容" />
        </li>
        <li>
          <el-input v-model="form.qdht" placeholder="请输入内容" />
        </li>
        <li>
          <el-date-picker v-model="form.ksrq" type="date" placeholder="选择日期" />
        </li>
        <li>
          <el-date-picker v-model="form.jzrq" type="date" placeholder="选择日期" />
        </li>
        <li>
          <el-select v-model="form.htzt" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </li>
      </ul>
    </div>
    <div id='page'>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: 'EmployeeFiles',
  components: {},
  data() {
    return {
      currentPage:1,
      form: {
        htzt: '',
        jzrq: '',
        ksrq: '',
        qdht: '',
        htbm: ''
      },
      options: [
        {
          label: '有效',
          value: '有效'
        },
        {
          label: '过期',
          value: '过期'
        },
        {
          label: '解除',
          value: '解除'
        }
      ]
    }
  },
  created() {
    // newAdd();
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(keyPath)
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    }
  }
}
</script>

<style scoped lang="scss">
#page{
  margin-top: 20px;
}
.box {
  height: 440px;
  border: 1px solid #999;
  margin-top: 20px;
  ul {
    display: flex;
    justify-content: space-around;
    &.input {
      border-top: 1px solid #999;
      padding: 20px 0;
      border-bottom: 1px solid #999;
    }
    li {
      list-style: none;
      flex: 1;
      text-align: center;
    }
  }
}
</style>

