<template>
  <div>
    <el-dialog
      :title="dialogType == 'add' ? '新建页面' : '修改页面'"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="beforeClose"
      :append-to-body="true"
      modal-append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="formData" :model="formData" :rules="rules" inline>
        <div class="form-box">
          <el-form-item label="升星条件" prop="dic_star">
            <el-select
              v-model="formData.dic_star"
              placeholder="请选择星级"
              clearable
              style="width:190px"
            >
              <el-option
                v-for="item in dic_upstar"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="名称"
            prop="name"
            :rules="validateField('name')"
            class="m-left"
          >
            <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          
          <el-form-item
            label="金额/余额"
            prop="money"
            :rules="validateField('money')"
            :style="{marginLeft: [2,3,4,5,6].indexOf(formData.dic_star)!==-1?'0':'10px'}"
          >
            <el-input
              v-model="formData.money"
              placeholder="长度: 10位数"
              maxlength="10"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="是否" class="m-left">
            <el-switch v-model="formData.value"></el-switch>
          </el-form-item>

          <el-form-item label="时间段" style="margin-left:10px">
            <el-date-picker
              v-model="formData.date"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              @change="daterangeChange($event)"
            />
          </el-form-item>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose('formData')">取消</el-button>
        <el-button type="primary" @click="submit('formData')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "StarDialog",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    dialogType: {
      type: String,
      required: true
    },
    dic_upstar: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      dialogVisible: this.value,
      formData: {
        dic_star: "",
        money: "",
        name: "",
        value: false,
        date: [],
        time_start: "",
        time_end: ""
      },
      defaultData: {
        dic_star: "",
        money: "",
        name: "",
        value: false,
        date: [],
        time_start: "",
        time_end: ""
      },
      rules: {
        dic_star: [
          { required: true, message: "请选择星级", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        if (this.dialogType == "redact") {
        } else {
          this.formData = JSON.parse(JSON.stringify(this.defaultData));
        }
      }
    }
  },
  methods: {
    // 自定义验证
    validateField(val) {
      const isNum = (rule, value, callback) => {
        const age = /^[0-9]*$/;
        if (!age.test(value)) {
          callback(new Error("请输入数字类型"));
        } else if (value <= 0) {
          callback(new Error("必须大于0"));
        } else {
          callback();
        }
      };
      if ([2,3,4,5,6].indexOf(this.formData.dic_star) !== -1 && val === "money") {
        return [
          { required: true, message: "请输入金额", trigger: "blur" },
          { validator: isNum, trigger: "blur" }
        ];
      }
      if (this.formData.dic_star === 1 && val === "name") {
        return [
          { required: true, message: "请输入名称", trigger: "blur" }
        ];
      }
    },

    // 提交
    saveForm(type) {
      this.resetData();
      let data = {};
      data = JSON.parse(JSON.stringify(this.formData));
      if (type == "add") {
        this.$message.success("新增成功!");
      } else {
        this.$message.success("修改成功!");
      }
      this.$emit("on-close");
      this.resetForm("formData");
    },

    resetData() { 
      this.formData.time_start = Math.floor(
        this.formData.time_start / 1000
      );
      this.formData.time_end = Math.floor(
        this.formData.time_end / 1000
      );
      delete this.formData.date;
    },

    // 验证
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveForm(this.dialogType);
          // alert('ok');
        } else {
          return false;
        }
      });
    },

    // 关闭
    beforeClose() {
      this.resetForm("formData");
      this.$emit("on-close");
    },

    // 关闭
    handleClose(formName) {
      this.resetForm(formName);
      this.$emit("on-close");
    },

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formData = JSON.parse(JSON.stringify(this.defaultData));
    },

    // 日期
    daterangeChange(daterange) {
      if (daterange[0]) {
        this.formData.effective_start_at = daterange[0];
        this.formData.effective_end_at = daterange[1];
      } else {
        this.formData.effective_start_at = "";
        this.formData.effective_end_at = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-box {
  //   margin-left:5px;
}
.m-left {
  margin-left: 10px;
}
</style>
