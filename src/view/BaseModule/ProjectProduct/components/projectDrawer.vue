<template>
  <el-drawer
    class="dialog-wrap-ly"
    direction="rtl"
    size="95%"
    close-on-press-escape
    :show-close="false"
    :wrapper-closable="false"
    :append-to-body="false"
    :modal="false"
    :visible.sync="drawerVisible"
    :before-close="handleCancel"
  >

    <el-scrollbar class="scroll-ly" style="height:calc(100% - 70px)">
      <div class="dw-wrap">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="dataSet">
            <el-form
              ref="changeData"
              label-position="right"
              class="store-dialog-ly"
              :rules="rules"
              :model="changeData"
              label-width="80px"
            >
              <el-row :gutter="30">
                <el-col :span="12">
                  <el-form-item label="项目名称" prop="name">
                    <el-input
                      v-model="changeData.name"
                      class="input-190"
                      placeholder="请输入项目名称"
                      @input="nameTransition"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目类别" prop="project_class_id">
                    <el-select
                      v-model="changeData.project_class_name"
                      class="w100"
                      placeholder="请选择项目类别"
                    >
                      <el-option value="" style="height:auto;padding:0">
                        <el-tree
                          ref="selectTree"
                          :data="treeData"
                          :props="props"
                          default-expand-all
                          @node-click="handleNodeClick"
                        />
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目简称" prop="short_name">
                    <el-input v-model="changeData.short_name" placeholder="请输入项目简称" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="ERP编码" prop="erp_code">
                    <el-input v-model="changeData.erp_code" placeholder="请输入ERP编码" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="有效天数" prop="valid_day">
                    <el-input v-model="changeData.valid_day" placeholder="请输入有效期（天）" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目用时" prop="spen_time">
                    <el-input v-model="changeData.spen_time" placeholder="请输入项目用时（分钟）" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目工耗" prop="hand_price">
                    <el-input v-model="changeData.hand_price" placeholder="请输入项目工耗" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="销售价格" prop="sell_price">
                    <el-input v-model="changeData.sell_price" placeholder="请输入项目销售价（元）" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="关联资产" prop="property">
                    <el-select
                      v-model="changeData.property"
                      class="w100"
                      filterable
                      clearable
                      placeholder="请选择关联资产"
                    >
                      <el-option
                        v-for="(item,index) in optionProperty"
                        :key="index"
                        :label="item.label"
                        :value=" item.value + '' "
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="生效时间" prop="effect_time">
                    <el-date-picker
                      v-model="changeData.effect_time"
                      type="date"
                      value-format="timestamp"
                      style="width:100%"
                      clearable
                      placeholder="请选择生效时间"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="关联画像" prop="portrait">
                    <el-select
                      v-model="changeData.portrait"
                      class="w100"
                      filterable
                      clearable
                      placeholder="请选择关联画像"
                    >
                      <el-option
                        v-for="(item,index) in optionPortrait"
                        :key="index"
                        :label="item.label"
                        :value=" item.value + '' "
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目状态" prop="status">
                    <el-switch
                      v-model="changeData.status"
                      active-value="1"
                      inactive-value="0"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注" prop="mark">
                    <el-input v-model="changeData.mark" type="textarea" placeholder="请输入备注" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商城设置" name="shopSet" disabled>
            <span>商城设置</span>
          </el-tab-pane>
          <el-tab-pane label="物料清单设置" name="listSet" disabled>
            <span>物料清单设置</span>
          </el-tab-pane>
        </el-tabs>
      </div>

    </el-scrollbar>
    <div class="drawer-footer">
      <el-button type="danger" @click="handleCancel">取 消</el-button>
      <el-button v-show="!isView" type="primary" @click="submitForm('changeData')">保 存</el-button>
    </div>

  </el-drawer>
</template>

<script>
import vPinyin from '@/component/toPinYin/vue-py.js'
import { projectData } from '@/api/BaseModule/ProjectProduct'
const dataApi = new projectData()

export default {
  name: 'InlineEditTable',
  props: {
    value: {
      type: Boolean,
      required: true,
      default() {
        return false
      }
    },
    getData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    income: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    isView: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      drawerVisible: false,
      changeData: {},
      activeName: 'dataSet',
      optionProperty: [],
      optionPortrait: [],
      treeData: [],
      props: {
        children: 'child',
        label: 'name'
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'blur'
          },
          {
            max: 15,
            message: '最多输入 15 个字符',
            trigger: 'blur'
          }
        ],
        short_name: [
          {
            required: true,
            message: '请输入项目简称',
            trigger: 'blur'
          },
          {
            max: 15,
            message: '最多输入 15 个字符',
            trigger: 'blur'
          }
        ],
        project_class_id: [
          {
            required: true,
            message: '请选择项目类别',
            trigger: 'change'
          }
        ],
        erp_code: [
          {
            required: true,
            message: '请输入ERP编码',
            trigger: 'blur'
          },
          {
            max: 15,
            message: '最多输入 15 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9\.]+$/,
            message: '编码由数字、小数点以及字母组成',
            trigger: 'blur'
          }
        ],
        valid_day: [
          {
            required: true,
            message: '请输入有效天数',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '有效天数只能是数字',
            trigger: 'blur'
          }
        ],
        hand_price: [
          {
            required: true,
            message: '请输入项目工耗',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '项目工耗只能是数字',
            trigger: 'blur'
          }
        ],
        sell_price: [
          {
            required: true,
            message: '请输入销售价格',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '销售价格只能是数字',
            trigger: 'blur'
          }
        ],
        spen_time: [
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '项目用时只能是数字',
            trigger: 'blur'
          }
        ],
        property: [
          {
            required: true,
            message: '请选择关联资产',
            trigger: 'change'
          }
        ],
        effect_time: [
          {
            required: true,
            message: '请选择生效时间',
            trigger: 'change'
          }
        ],
        portrait: [
          {
            required: true,
            message: '请选择关联画像',
            trigger: 'change'
          }
        ],
        status: [
          {
            required: true,
            message: '请选择项目状态',
            trigger: 'change'
          }
        ],
        mark: [
          {
            max: 50,
            message: '最多输入 50 个字符',
            trigger: 'blur'
          }
        ]
      },
      flagTime: 0
    }
  },
  watch: {
    value(val) {
      this.drawerVisible = val
    },
    getData(val) {
      this.changeData = val
    },
    income(data) {
      this.treeData = data
    }
  },
  created() {
    this.getOption()
  },
  methods: {
    handleCancel() {
      this.$emit('clear')
      this.resetForm('changeData')
    },
    // - 提交验证
    submitForm(formName) {
      const curr = new Date()
      if (curr - this.flagTime > 1000) {
        this.$refs[formName].validate(valid => {
          if (valid) {
          // - 提交请求
            if (!this.changeData.spen_time) {
              this.changeData.spen_time = 0
            }
            this.$emit('save', this.changeData)
          } else {
            this.$message.warning('请正确填写必填项！')
            return false
          }
        })
        this.flagTime = curr
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.changeData = {}
    },
    getOption() {
      // - get option
      dataApi.gcreate().then(res => {
        const items = res.data
        this.optionPortrait = items.dir_product_brand_id
        this.optionProperty = items.dir_product_brand_id
      })
    },

    handleNodeClick(node) {
      // - Select-Tree 选择
      if (!node.hasOwnProperty('child')) {
        this.$set(this.changeData, 'project_class_name', node.name)
        this.changeData.project_class_id = node.id
      }
    },

    nameTransition(name) {
      // 提取名称首字母
      const changeName = vPinyin.chineseToPinYin(name)
      let resName = ''
      for (var i = 0; i < changeName.length; i++) {
        var c = changeName.charAt(i)
        if (/^[A-Z\d]+$/.test(c)) {
          resName += c
        }
      }
      this.changeData.chinese_initial = resName
      // console.log('缩写获取', resName)
    }
  }
}
</script>

<style lang="scss" scope>
.dialog-wrap-ly {
  position: absolute;
  height: 100%;
  width: 50%;
  left: initial !important;

  .el-drawer__header {
    display: none;
  }
  .el-drawer__body{
    height: calc(100% - 70px);
  }
  .drawer-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    text-align: center;
    background-color: #fff;
    .el-button {
      width: 44%;
    }
  }
  .dw-wrap {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>
<style lang="scss">
.dialog-wrap-ly {
  .el-form-item__error {
    width: 210px;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
