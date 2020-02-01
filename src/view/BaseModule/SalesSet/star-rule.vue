<template>
  <el-container class="m-container">
    <div class="m-header">
      <el-form ref="listQuery" :inline="true" :model="listQuery">
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            @change="daterangeChange($event)"
          />
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="listQuery.dic_star"
            style="width: 130px"
            placeholder="请选择星级"
            clearable
          >
            <el-option
              v-for="item in dic_rule_star"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="listQuery.type" style="width: 130px" placeholder="请选择类型" clearable>
            <el-option
              v-for="item in ruleType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="listQuery.status" style="width: 130px" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in ruleStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="openDialog('search')"
          >查询</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="openDialog('create')">新建</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="openDialog('detele')">删除</el-button>
          <el-button type="primary" icon="el-icon-tickets" @click="openDialog('export')">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-main>
      <el-table
        ref="tableList"
        :data="tableList"
        highlight-current-row
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="50" type="selection" />
        <el-table-column align="center" prop="dic_star" label="星级" />
        <el-table-column align="center" prop="type" label="类型" />
        <el-table-column align="center" prop="group_name" label="组合" />
        <el-table-column align="center" prop="package_id" label="套餐名称" />
        <el-table-column align="center" label="年消费额">
          <template slot-scope="{row}">{{ fieldBack(row.in_consumption) }}</template>
        </el-table-column>
        <el-table-column align="center" label="单次消费">
          <template slot-scope="{row}">{{ fieldBack(row.single_consumption) }}</template>
        </el-table-column>
        <el-table-column align="center" prop="the_cumulative" label="累计消耗" />
        <el-table-column align="center" prop="card_balance" label="存卡余额" />
        <el-table-column align="center" prop="integral_balance" label="积分余额" />
        <el-table-column align="center" label="星级生效开始日期" min-width="150px">
          <template slot-scope="{row}">{{ row.effective_start_at | formatDate }}</template>
        </el-table-column>
        <el-table-column align="center" prop="receive" label="星级生效结束日期" min-width="150px">
          <template slot-scope="{row}">{{ row.effective_end_at | formatDate }}</template>
        </el-table-column>
        <el-table-column width="120" align="center" prop="month_aging" label="星级权益时效" />
        <el-table-column width="150" align="center" prop="month_transition" label="星级过渡期" />
        <el-table-column
          width="120"
          align="center"
          prop="integral_rate"
          label="操作人"
          min-width="150px"
        />
        <el-table-column width="150" align="center" label="操作时间">
          <template slot-scope="{row}">{{ row.updated_at | formatDate }}</template>
        </el-table-column>
        <el-table-column width="120" align="center" prop="status" label="状态" />
        <el-table-column width="150" align="center" fixed="right" label="操作">
          <el-button type="primary" size="small" @click="openDialog('redact')">编辑</el-button>
        </el-table-column>
      </el-table>
    </el-main>

    <el-footer class="m-footer">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,16]"
        :page-size="listQuery.page_size"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>

    <starDrawer
      v-model="drawerVisible"
      :drawerType="drawerType"
      :dic_rule_star="dic_rule_star"
      :ruleType="ruleType"
      :dic_upstar="dic_upstar"
      @on-colse="drawerVisible = false"
    />
  </el-container>
</template>

<script>
import dateFormat from "@/component/DateFilter/date";
import { starRule } from "@/api/BaseModule/SalesSet";
import starDrawer from "./star-rule/starDrawer";
const RuleApi = new starRule();

export default {
  name: "StarRule",
  components: {
    starDrawer
  },
  filters: {
    formatDate(time) {
      const date = new Date(time);
      return dateFormat.formatDate(date, "yyyy-MM-dd");
    }
  },
  data() {
    return {
      total: 1,
      date: [],
      tableList: [],
      dialogVisible: false,
      drawerVisible: false,
      drawerType: "",
      dialogType: "",
      multipleSelection: [],
      listQuery: {
        page: 0,
        page_size: 10,
        status: "",
        effective_start_at: "",
        effective_end_at: "",
        dic_star: "",
        type: ""
      },
      dic_rule_star: [], // 星级
      ruleType: [], // 类型
      ruleStatus: [], // 状态
      dic_upstar: [] // 升星条件
    };
  },
  watch: {
    tableList(val) {
      if (val && val.length > 0) {
        val.forEach(item => {
          item.effective_end_at =
            item.effective_end_at.length <= 10
              ? item.effective_end_at * 1000
              : item.effective_end_at;
          item.effective_start_at =
            item.effective_start_at.length <= 10
              ? item.effective_start_at * 1000
              : item.effective_start_at;
          item.updated_at =
            item.updated_at.length <= 10
              ? item.updated_at * 1000
              : item.updated_at;
        });
      }
    }
  },
  created() {
    this.loadList();
    this.loadSet();
  },
  methods: {
    // 回显
    fieldBack(val) {
      const value = val.map(item => item.money).join(",");
      return value;
    },

    // 初始化
    loadList() {
      RuleApi.list(this.listQuery)
        .then(res => {
          console.log(res);
          const arr = JSON.parse(JSON.stringify(res));
          this.total = parseInt(arr.data.count);
          this.tableList = res.data.list;
        })
        .catch(err => {
          console.log(err);
        });
    },

    loadSet() {
      RuleApi.gcreate()
        .then(res => {
          console.log(res);
          this.dic_rule_star = res.data.dic.dic_star;
          this.ruleStatus = res.data.status;
          this.ruleType = res.data.type;
          this.dic_upstar = res.data.dic_upstar.dic_upstar;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 弹窗
    openDialog(type, id) {
      switch (type) {
        case "search":
          this.loadList();
          break;
        case "create":
          this.drawerVisible = true;
          this.drawerType = "create";
          break;
        default:
          break;
      }
    },

    // 弹窗关闭
    dialogClose() {
      this.dialogVisible = false;
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },

    // 页数
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.loadList();
    },

    // 当前页
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.loadList();
    },

    // 日期
    daterangeChange(daterange) {
      if (daterange[0]) {
        this.listQuery.effective_start_at = Math.floor(daterange[0] / 1000);
        this.listQuery.effective_end_at = Math.floor(daterange[1] / 1000);
      } else {
        this.listQuery.effective_start_at = "";
        this.listQuery.effective_end_at = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-header {
  padding: 12px 20px 0;
  border-bottom: 1px solid #ebeef5;
}
.m-footer {
  display: flex;
}
</style>
