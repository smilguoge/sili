<template>
  <!-- 密码验证 -->
  <el-dialog
    title="密码验证"
    class="password-dialog"
    :visible.sync="dialogVisible"
    :before-close="handleCancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    width="340px"
  >
    <el-col :span="22" :offset="1">
      <el-input
        v-model="password"
        class="w100"
        type="password"
        placeholder="请输入密码"
        show-password
        clearable
      />
    </el-col>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-col :span="23">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit(password)"
        >确 定</el-button>
      </el-col>
      <div style="clear:both" />
    </div>
    <div style="clear:both" />
  </el-dialog>
</template>

<script>

export default {
  name: 'InlineEditTable',
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      password: '',
      dialogVisible: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handleCancel() {
      this.$parent.passwordVisible = false
      this.password = ''
    },
    handleSubmit(val) {
      // - request
      if (val.length < 6) {
        this.$message.warning('至少输入 6 位') // password is string
        return
      }
      this.$emit('submit', val)
    }
  }
}
</script>

