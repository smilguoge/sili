<template>
  <div class="e-container">
    <el-drawer
      :title="drawerType == 'create' ? '新建' : '编辑'"
      :visible.sync="drawerVisible"
      :direction="direction"
      :before-close="handleClose"
      size="700px"
      close-on-press-escape
    >
      <el-header class="e-header">升星规则设置</el-header>
      <el-main>
        <el-form :model="formInline" ref="formInline" :rules="rules" inline>
          <el-form-item label="星级" prop="dic_star">
            <el-select v-model="formInline.dic_star" placeholder="请选择星级" clearable>
              <el-option
                v-for="item in dic_rule_star"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="类型" prop="type">
            <el-select v-model="formInline.type" placeholder="请选择类型" clearable>
              <el-option
                v-for="item in ruleType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="星级生效日期" prop="date">
            <el-date-picker
              v-model="formInline.date"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              @change="daterangeChange($event)"
            />
          </el-form-item>

          <el-form-item label="星级权益时效" prop="month_aging">
            <el-input v-model="formInline.month_aging" placeholder="正整数" style="width:150px;">
              <template slot="append">个月</template>
            </el-input>
          </el-form-item>

          <el-form-item label="星级过渡期" v-if="formInline.type === 2">
            <el-input v-model="formInline.month_transition" placeholder="正整数" style="width:150px;">
              <template slot="append">个月</template>
            </el-input>
          </el-form-item>

          <el-form-item label="续享时间设置" v-if="formInline.type === 2">
            <el-radio-group v-model="formInline.continue_time">
              <el-radio :label="1">原星级到期后续享</el-radio>
              <el-radio :label="2">最近满足星级的时间进行续享</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-main>

      <el-main>
        <div class="main-table">
          <el-table :data="tableList" style="width: 100%" height="300px" max-height="350px">
            <!-- 明细表格 -->
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  :data="props.row.senddtl"
                  class="option-table"
                  height="200px"
                  highlight-current-row
                  stripe
                  border
                >
                  <el-table-column label="升星条件" align="center">
                  </el-table-column>
                  <el-table-column min-width="120" label="金额/余额" align="center">
                  </el-table-column>
                  <el-table-column label="名称" align="center">
                  </el-table-column>
                  <el-table-column min-width="150" label="时间段" align="center">
                  </el-table-column>
                  <el-table-column label="是否必选" align="center">
                  </el-table-column>
                  <el-table-column label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="openDialog('childrenEdit',scope.row, scope.$index, props.$index)"
                      >编辑</el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        @click="openDialog('childrenDelete',scope.row, scope.$index, props.$index)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column>
              <!-- 父级表头 -->
              <template slot="header">
                <span>升星组合</span>
                <el-button
                  style="float:right;"
                  size="mini"
                  type="primary"
                  @click="openDialog('create')"
                >新增组合</el-button>
              </template>
              <!-- 父级数据 -->
              <template slot-scope="scope">
                <div class="btn-wrap">
                  <el-tag>{{scope.row.group_name}}{{scope.row.select_num}}</el-tag>
                  <el-input style="width:50px" size="mini" v-model="formInline.a"></el-input>
                  <span style="font-size:12px">选</span>
                  <el-input style="width:50px" size="mini" v-model="formInline.a"></el-input>
                </div>
                <div style="display:inline-block;float:right">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="openDialog('add')"
                  >添加明细</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="openDialog('delete', scope.$index)"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>

      <el-footer>
        <div style="float:right;">
          <el-button @click="handleClose('formData')">取消</el-button>
          <el-button type="primary" @click="submit('formData')">保存</el-button>
        </div>
      </el-footer>

      <starDialog
        v-model="dialogVisible"
        :dialogType="dialogType"
        :dic_upstar="dic_upstar"
        @on-close="dialogVisible = false"
      />
    </el-drawer>
  </div>
</template>

<script>
import starDialog from "./starDialog";

export default {
  name: "starDrawer",
  components: {
    starDialog
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    drawerType: {
      type: String,
      required: true
    },
    dic_rule_star: {
      type: Array,
      default() {
        return [];
      }
    },
    ruleType: {
      type: Array,
      default() {
        return [];
      }
    },
    dic_upstar: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    value(val) {
      this.drawerVisible = val;
    }
  },
  data() {
    const validateNum = (rule, value, callback) => {
      const age = /^[0-9]*$/;
      if (!age.test(value)) {
        callback(new Error("请输入数字类型"));
      } else if (value <= 0) {
        callback(new Error("必须大于0"));
      } else {
        callback();
      }
    };
    return {
      drawerVisible: this.value,
      dialogVisible: false,
      dialogType: "",
      direction: "rtl",
      formInline: {
        dic_star: "",
        type: "",
        date: [],
        effective_start_at: "",
        effective_end_at: "",
        month_aging: 12,
        month_transition: "",
        continue_time: ""
      },
      tableList: [
        // {group_name: "组合",select_num: 0 }
      ],
      rules: {
        dic_star: [
          { required: true, message: "请选择星级", trigger: "change" }
        ],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        date: [{ required: true, message: "请选择日期", trigger: "change" }],
        month_aging: [
          { required: true, message: "请输入时效", trigger: "blur" },
          { validator: validateNum, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 弹窗
    openDialog(type, index) {
      switch (type) {
        case "add":
          this.dialogVisible = true;
          this.dialogType = "add";
          break;
        case "create":
          let arr = {
            group_name: "组合",
            select_num: 1
          }
          if (this.tableList.length > 0) {
            let atr = this.tableList[this.tableList.length-1];
            arr.select_num = atr.select_num + 1;
          }
          this.tableList.push(arr);
          break;
        case "delete":
          console.log(index);
          this.tableList.splice(index, 1);
          break;
        default:
          break;
      }
    },

    handleClose() {
      this.$emit("on-colse");
    }
  }
};
</script>

<style lang="scss" scoped>
.e-header {
  border-bottom: 1px solid #dcdfe6;
  line-height: 60px;
}
.border-customize {
}
.option-tool-bar {
  height: 50px;
  border: 1px solid #dcdfe6;
  border-bottom: 0px;
  padding: 11px 10px;
  display: flex;
  justify-content: space-between;
}
.btn-wrap {
  display: inline;
}
.option-table {
  width: 100%;
  box-sizing: border-box;
}
.main-table {
  border: 1px solid #dcdfe6;
  border-bottom: 0;
}
</style>
<style lang="scss">
.el-drawer__header {
  margin-bottom: 20px !important;
}
</style>