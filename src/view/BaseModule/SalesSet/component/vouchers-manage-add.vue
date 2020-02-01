<template>
  <div>
    <el-dialog :visible.sync="snycTest" width="65%" :close-on-click-modal="false" :before-close="handleClose" top="3vh">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <div class="Vma-body-1">
            <el-form
              ref="vmaddData"
              :rules="rules"
              :size="mini"
              :model="vmaddData"
              :label-width="formLabelWidth"
            >
              <h4>基础信息</h4>
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="11">
                  <el-form-item label="券编码">
                    <el-input v-model="vmaddData.code" placeholder="系统生成不可编辑" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="券名称" prop="name">
                    <el-input v-model="vmaddData.name" placeholder="请输入券名称" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 1 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="11">
                  <el-form-item label="活动文件号" prop="activity_file_num">
                    <el-input v-model="vmaddData.activity_file_num" placeholder="请输入活动文件号" />
                  </el-form-item>
                </el-col>

                <el-col :span="11">
                  <el-form-item label="券种类" prop="coupon_class">
                    <el-select
                      v-model="vmaddData.coupon_class"
                      placeholder="请选择"
                      style="width:100%;"
                    >
                      <el-option
                        v-for="item in (this.vmaddData.type ==1?optionCouponClass:optionCouponClass_gift)"
                        :key="item.index"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 2 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="11">
                  <el-form-item label="抵扣方式" prop="deduction_method">
                    <el-radio-group v-model="vmaddData.deduction_method">
                      <el-radio
                        v-for="item in deductionMethod"
                        :key="item.index"
                        :label="item.value"
                      >{{ item.label }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="11" />
              </el-row>
              <!-- 3 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="11">
                  <el-form-item label="券来源" prop="type">
                    <el-radio-group v-model="vmaddData.type" @change="controltype()">
                      <el-radio
                        v-for="item in type"
                        :key="item.index"
                        :label="item.value"
                      >{{ item.label }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col v-if="vmaddData.type==2" :span="11">
                  <el-form-item label="最高赠送张数" prop="max_send_num">
                    <el-input v-model="vmaddData.max_send_num" placeholder="请输入最高赠送张数" />
                  </el-form-item>
                </el-col>
                <el-col v-if="vmaddData.type==1" :span="11">
                  <el-form-item label="顾客可购买张数" prop="customer_buy_num">
                    <el-input v-model="vmaddData.customer_buy_num" placeholder="请输入顾客可购买张数" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 4 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="11">
                  <el-form-item label="总张数" prop="total_num">
                    <el-input v-model="vmaddData.total_num" placeholder="请输入总张数" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="启用赠送日期" prop="is_send_at">
                    <el-switch
                      v-model="vmaddData.is_send_at"
                      active-value="1"
                      inactive-value="0"
                      @change="controldate()"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <!-- <el-form-item label="剩余张数">
                    <el-input :disabled="true" v-model="vmgSurplus" />
                  </el-form-item>-->
                </el-col>
              </el-row>
              <!-- 5 -->
              <el-row
                v-if="this.vmaddData.is_send_at == 1"
                :gutter="30"
                type="flex"
                justify="center"
              >
                <el-col :span="11">
                  <el-form-item label="赠送开始日期" prop="start_send_at">
                    <el-date-picker
                      v-model="vmaddData.start_send_at"
                      type="date"
                      placeholder="选择日期"
                      style="width:100%;"
                      format="yyyy - MM - dd "
                      value-format="timestamp"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="赠送截止日期" prop="end_send_at">
                    <el-date-picker
                      v-model="vmaddData.end_send_at"
                      type="date"
                      placeholder="选择日期"
                      style="width:100%;"
                      format="yyyy - MM - dd "
                      value-format="timestamp"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 6 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="11">
                  <el-form-item label="时效方式" prop="failure_mode">
                    <el-radio-group v-model="vmaddData.failure_mode" @change="controldates()">
                      <el-radio
                        v-for="item in failureMode"
                        :key="item.index"
                        :label="item.value"
                      >{{ item.label }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="11" />
              </el-row>
              <el-row :gutter="30" type="flex" justify="center">
                <!-- FIXME: 标记 -->
                <el-col v-if="vmaddData.failure_mode == 0" :span="11">
                  <el-form-item label="有效天数" prop="effective_day">
                    <el-input v-model="vmaddData.effective_day" placeholder="请输入有效天数" />
                  </el-form-item>
                </el-col>
                <el-col :span="11" />
              </el-row>
              <!-- 7 -->
              <el-row v-if="vmaddData.failure_mode == 1" :gutter="30" type="flex" justify="center">
                <el-col :span="11">
                  <el-form-item label="使用开始日期" prop="start_use_at">
                    <el-date-picker
                      v-model="vmaddData.start_use_at"
                      type="date"
                      placeholder="选择日期"
                      style="width:100%;"
                      format="yyyy - MM - dd "
                      value-format="timestamp"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="使用截止日期" prop="end_use_at">
                    <el-date-picker
                      v-model="vmaddData.end_use_at"
                      type="date"
                      placeholder="选择日期"
                      style="width:100%;"
                      format="yyyy - MM - dd "
                      value-format="timestamp"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 8 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="11">
                  <el-form-item label="使用场景" prop="dic_usage_scenarios">
                    <el-select
                      v-model="vmaddData.dic_usage_scenarios"
                      placeholder="请选择"
                      style="width:100%;"
                    >
                      <el-option
                        v-for="item in option1"
                        :key="item.index"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="适用于" prop="dic_send_object">
                    <el-checkbox-group v-model="vmaddData.dic_send_object" @change="dicArr()">
                      <el-checkbox
                        v-for="item in dic_send_object"
                        :key="item.value"
                        :label="item.value"
                      >{{ item.label }}</el-checkbox>
                      <!-- <el-checkbox :label="1">员工</el-checkbox> -->
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 9 -->
              <el-row v-if="attrinit" :gutter="30" type="flex" justify="center">
                <el-col :span="11">
                  <el-form-item label="适用顾客属性" prop="dic_customer_attr">
                    <el-checkbox-group v-model="vmaddData.dic_customer_attr">
                      <el-checkbox
                        v-for="item in dic_customer_attr"
                        :key="item.idnex"
                        :label="item.value"
                      >{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="适用顾客管理类别" prop="dic_manage_cate">
                    <el-checkbox-group v-model="vmaddData.dic_manage_cate">
                      <el-checkbox
                        v-for="item in dic_manage_cate"
                        :key="item.index"
                        :label="item.value"
                      >{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 10 -->
              <el-row v-if="attrinit" :gutter="30" type="flex" justify="center">
                <el-col :span="11">
                  <el-form-item label="适用顾客等级" prop="dic_customer_grade">
                    <el-checkbox-group v-model="vmaddData.dic_customer_grade">
                      <el-checkbox
                        v-for="item in dic_customer_grade"
                        :key="item.index"
                        :label="item.value"
                      >{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="适用评价情况" prop="dic_customer_evaluation">
                    <el-checkbox-group v-model="vmaddData.dic_customer_evaluation">
                      <el-checkbox
                        v-for="item in dic_customer_evaluation"
                        :key="item.index"
                        :label="item.value"
                      >{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 11 -->
              <el-row v-if="attrinit" :gutter="30" type="flex" justify="center">
                <el-col :span="22">
                  <el-form-item label="适用星级" prop="dic_customer_star">
                    <el-checkbox-group v-model="vmaddData.dic_customer_star">
                      <el-checkbox
                        v-for="item in dic_customer_star"
                        :key="item.index"
                        :label="item.value"
                      >{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 12 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="11">
                  <el-form-item label="是否叠加使用" prop="is_superposition_use">
                    <el-radio-group v-model="vmaddData.is_superposition_use" @change="controlUse()">
                      <el-radio :label="0">是</el-radio>
                      <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="11" />
              </el-row>
              <el-row
                v-if="vmaddData.is_superposition_use == 0"
                :gutter="30"
                type="flex"
                justify="center"
              >
                <el-col :span="11">
                  <el-form-item prop="is_own" label="选择叠加方式">
                    <el-select
                      v-model="vmaddData.is_own"
                      style="width:100%;"
                      @change="controlIs_own()"
                    >
                      <el-option
                        v-for="item in option2"
                        :key="item.index"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    v-if="vmaddData.is_own ==1"
                    label="选择可叠加的券"
                    prop="superposition_use_coupon"
                  >
                    <el-autocomplete
                      v-model="vmgState"
                      popper-class="my-autocomplete"
                      :fetch-suggestions="querySearch"
                      placeholder="请选择可叠加的券"
                      @select="handleSelect"
                    >
                      <i
                        slot="suffix"
                        class="el-icon-edit el-input__icon"
                        @click="handleIconClick"
                      />
                      <template slot-scope="{ item }">
                        <div class="name">{{ item.name }}</div>
                      </template>
                    </el-autocomplete>
                    <!-- <el-input v-model="vmaddData.superposition_use_coupon" placeholder="长度:15 数字" /> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 13 -->
              <!-- 接口无数据 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="4">
                  <el-form-item label="是否积分兑换" prop="is_integral">
                    <el-switch
                      v-model="vmaddData.is_integral"
                      active-value="0"
                      inactive-value="1"
                      @change="controlInte()"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item v-if="vmaddData.is_integral == 0" label prop="integral">
                    <el-input v-model="vmaddData.integral" placeholder="请输入积分数值" />
                  </el-form-item>
                </el-col>
                <el-col :span="8" />
              </el-row>
              <!-- 14-->
              <h4>券价值</h4>
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="7">
                  <!-- 系统 -->
                  <el-form-item label="面额">
                    <el-input v-model="vmgmianzhi" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="原值金额" prop="original_price">
                    <el-input v-model="vmaddData.original_price" placeholder="请输入原值金额" />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="赠送金额" prop="send_price">
                    <el-input v-model="vmaddData.send_price" placeholder="请输入赠送金额" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 15 -->
              <!-- <h4>嘉宾券返券方式</h4>
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="15">
                  <el-form-item prop="coupon_rebate">
                    <el-radio-group v-model="vmaddData.coupon_rebate">
                      <el-radio
                        v-for="item in couponRebate"
                        :key="item.index"
                        :label="item.value"
                      >{{ item.label }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="7" />
              </el-row>-->
              <!-- 16 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="22">
                  <el-form-item label="使用条件">
                    <el-switch
                      v-model="list.shiyong"
                      active-value="0"
                      inactive-value="1"
                      @change="controlShi()"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 17 -->
              <el-row v-if="list.shiyong == 0" :gutter="30" type="flex" justify="center">
                <el-col :span="8">
                  <el-form-item prop="is_mode">
                    <el-radio-group v-model="vmaddData.is_mode">
                      <el-radio :label="1">张数</el-radio>
                      <el-radio :label="2">金额</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="达到张数/金额" prop="amount_reached">
                    <el-input v-model="vmaddData.amount_reached" placeholder="请输入达到张数/金额" />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="可使用数(张)" prop="availability_num">
                    <el-input v-model="vmaddData.availability_num" placeholder="请输入可使用数(张)" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 18 -->
              <h4>适用范围</h4>
              <!-- 19 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="8">
                  <el-form-item label="适用区域/门店">
                    <el-radio-group v-model="vmaddData.apply_shop" @change="storeOpen()">
                      <el-radio :label="0">全部</el-radio>
                      <el-radio id="store" :label="1">指定</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="14" style="display:flex;">
                  <el-form-item
                    v-if="vmaddData.apply_shop==1"
                    label-width="0px"
                    prop="apply_shop_name"
                    :rules="[
                      {required: true,message: '请选择区域范围', trigger: 'change'}]"
                  >
                    <div style="display:flex;">
                      <el-button style="margin-right:20px;" @click="store_net()">编辑</el-button>
                      <el-input
                        v-model="vmaddData.apply_shop_name"
                        :disabled="true"
                        style="width:200px;"
                      />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 20 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="8">
                  <el-form-item label="适用项目范围">
                    <el-radio-group v-model="vmaddData.apply_project" @change="projectOpen()">
                      <el-radio :label="0">全部</el-radio>
                      <el-radio :label="1">指定</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item
                    v-if="vmaddData.apply_project==1"
                    label-width="0px"
                    prop="apply_project_name"
                    :rules="[
                      {required: true,message: '请选择项目范围', trigger: 'change'}]"
                  >
                    <div style="display:flex;">
                      <el-button style="margin-right:20px;" @click="project_net()">编辑</el-button>
                      <el-input
                        v-model="vmaddData.apply_project_name"
                        :disabled="true"
                        style="width:200px;"
                      />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 21 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="8">
                  <el-form-item label="适用套餐范围">
                    <el-radio-group v-model="vmaddData.apply_package" @change="setOpen()">
                      <el-radio :label="0">全部</el-radio>
                      <el-radio :label="1">指定</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item
                    v-if="vmaddData.apply_package==1"
                    label-width="0px"
                    prop="apply_package_name"
                  >
                    <div style="display:flex;">
                      <el-button style="margin-right:20px;" @click="set_net()">编辑</el-button>
                      <el-input
                        v-model="vmaddData.apply_package_name"
                        :disabled="true"
                        style="width:200px;"
                      />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 22 -->
              <el-row :gutter="30" type="flex" justify="center">
                <el-col :span="8">
                  <el-form-item label="适用产品范围">
                    <el-radio-group v-model="vmaddData.apply_product" @change="productOpen()">
                      <el-radio :label="0">全部</el-radio>
                      <el-radio :label="1">指定</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item
                    v-if="vmaddData.apply_product==1"
                    label-width="0px"
                    prop="apply_product_name"
                  >
                    <div style="display:flex;">
                      <el-button style="margin-right:20px;" @click="product_net()">编辑</el-button>
                      <el-input
                        v-model="vmaddData.apply_product_name"
                        :disabled="true"
                        style="width:200px;"
                      />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 23 -->
              <el-row :gutter="0" type="flex" justify="end" style="display:none">
                <el-form-item>
                  <el-button ref="upload" @click="resetForm('vmaddData')">取消</el-button>
                  <el-button ref="upload2" type="primary" @click="submitForm('vmaddData')">提交</el-button>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="券介绍" name="second">
          <editor v-model="vmaddData.description" :is-clear="editorIsClear" @change="editorBlur" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Addcancel()">取消</el-button>
        <el-button type="primary" @click=" Addcancelgood()">确定</el-button>
      </span>
      <!-- 子组件 -->
      <div>
        <vmaddstore
          ref="Store"
          :snyc-store.sync="innerStore"
          :snyc-apply-shop.sync="vmaddData.applyShop"
          :snyc-apply-shop-name.sync="vmaddData.apply_shop_name"
        />
        <vmaddproject
          ref="Project"
          :snyc-project.sync="innerProject"
          :snyc-apply-project.sync="vmaddData.applyProject"
          :snyc-apply-oject-name.sync="vmaddData.apply_project_name"
        />
        <vmaddproductStructure
          ref="pro"
          :snyc-vmadd-product.sync="innerProduct"
          :snyc-apply-product.sync="vmaddData.applyProduct"
          :snyc-apply-product-name.sync="vmaddData.apply_product_name"
        />
        <vmaddsetStructure
          ref="set"
          :snyc-vmadd-set.sync="innerSet"
          :snyc-apply-set-meal.sync="vmaddData.applySetMeal"
          :snyc-apply-package-name.sync="vmaddData.apply_package_name"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Vmaddstore from '@/view/BaseModule/SalesSet/component/vmadd-store.vue'
import vmaddproject from '@/view/BaseModule/SalesSet/component/vmadd-project.vue'
import vmaddproductStructure from '@/view/BaseModule/SalesSet/component/vmadd-product-structure.vue'
import vmaddsetStructure from '@/view/BaseModule/SalesSet/component/vmadd-set-structure.vue'
import Editor from '@/component/wangEditor/index'
import {
  structureGet,
  projectStructureGet,
  vmgretrievalGet
} from '@/api/BaseModule/SalesSet'
// 数据
import {
  vmgGcreate,
  vmAlterdata,
  vmgAdd,
  vmAlter
} from '@/api/BaseModule/SalesSet'
export default {
  name: 'Vmadd',
  components: {
    Vmaddstore,
    vmaddproject,
    vmaddproductStructure,
    vmaddsetStructure,
    Editor
  },
  props: {
    snycTest: false
  },
  data() {
    return {
      // 子组件参数
      innerStore: false,
      innerProject: false,
      innerProduct: false,
      innerSet: false,
      // 富文本
      editorIsClear: false,
      // 参数
      activeName: 'first',
      mini: 'mini',
      formLabelWidth: '120px',
      // 检索
      vmgState: '',
      vmgrestaurants: [],
      //
      vmgSurplus: '',
      attrinit: false,
      vmgmianzhi: '',
      //
      vmaddData: {
        code: '',
        name: '',
        type: 1,
        coupon_class: '',
        deduction_method: 0,
        activity_file_num: '',
        total_num: '',
        customer_buy_num: '',
        max_send_num: 0,
        is_send_at: 1,
        start_send_at: '',
        end_send_at: '',
        failure_mode: 0,
        effective_day: '',
        start_use_at: '',
        end_use_at: '',
        dic_usage_scenarios: '',
        dic_send_object: [1],
        dic_customer_attr: [1],
        dic_manage_cate: [1],
        dic_customer_grade: [1],
        dic_customer_evaluation: [1],
        dic_customer_star: [1],
        is_superposition_use: 0,
        superposition_use_coupon: '',
        original_price: '',
        send_price: '',
        // coupon_rebate: 0,
        is_mode: '',
        amount_reached: '',
        availability_num: '',
        status: 1,
        apply_product: 0,
        apply_project: 0,
        apply_shop: 0,
        apply_package: 0,
        applyShop: [],
        applyProject: [],
        applySetMeal: {},
        applyProduct: {},
        is_integral: 0,
        integral: 0,
        apply_product_name: '',
        apply_project_name: '',
        apply_shop_name: '',
        apply_package_name: ''

        // apply_shop
      },
      rules: {
        name: [
          { required: true, message: '请输入名券名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择券来源', trigger: 'change' }],
        coupon_class: [
          { required: true, message: '请选择券种类', trigger: 'change' }
        ],
        deduction_method: [
          { required: true, message: '请选择抵扣方式', trigger: 'change' }
        ],
        activity_file_num: [
          { required: true, message: '请输入活动文件号', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        total_num: [
          {
            required: true,
            message: '请输入总张数',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '总张数只能是数字',
            trigger: 'blur'
          }
        ],
        customer_buy_num: [
          {
            required: true,
            message: '请输入顾客可购买张数',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '可购买张数只能是数字',
            trigger: 'blur'
          }
        ],
        max_send_num: [
          {
            required: true,
            message: '请输入最高赠送张数',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '最高赠送张数只能是数字',
            trigger: 'blur'
          }
        ],
        is_send_at: [
          {
            required: true,
            message: '请选择启动赠送日期',
            trigger: 'change'
          }
        ],
        start_send_at: [
          {
            required: true,
            message: '请选择赠送开始日期',
            trigger: 'change'
          }
        ],
        end_send_at: [
          {
            required: true,
            message: '请选择赠送截止日期',
            trigger: 'change'
          }
        ],
        failure_mode: [
          {
            required: true,
            message: '请选择时效方式',
            trigger: 'change'
          }
        ],
        effective_day: [
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
        start_use_at: [
          {
            required: true,
            message: '请选择使用开始日期',
            trigger: 'change'
          }
        ],
        end_use_at: [
          {
            required: true,
            message: '请选择使用截止日期',
            trigger: 'change'
          }
        ],
        dic_usage_scenarios: [
          {
            required: true,
            message: '请选择使用场景',
            trigger: 'change'
          }
        ],
        dic_send_object: [
          {
            required: true,
            message: '请选择适用于',
            trigger: 'change'
          }
        ],
        dic_customer_attr: [
          {
            required: true,
            message: '请选择适用顾客属性',
            trigger: 'change'
          }
        ],
        dic_manage_cate: [
          {
            required: true,
            message: '请选择适用顾客管理类别',
            trigger: 'change'
          }
        ],
        dic_customer_grade: [
          {
            required: true,
            message: '请选择适用顾客等级',
            trigger: 'change'
          }
        ],
        dic_customer_evaluation: [
          {
            required: true,
            message: '请选择适用评价情况',
            trigger: 'change'
          }
        ],
        dic_customer_star: [
          {
            required: true,
            message: '请选择适用星级',
            trigger: 'change'
          }
        ],
        is_superposition_use: [
          {
            required: true,
            message: '请选择是否叠加使用',
            trigger: 'change'
          }
        ],
        is_own: [
          {
            required: true,
            message: '请选择叠加使用',
            trigger: 'change'
          }
        ],
        superposition_use_coupon: [
          {
            required: true,
            message: '请填写可以叠加的券',
            trigger: 'change'
          }
        ],
        original_price: [
          {
            required: true,
            message: '请输入原值金额',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '原值金额只能是数字',
            trigger: 'blur'
          }
        ],
        send_price: [
          {
            required: true,
            message: '请输入券金额',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '券金额只能是数字',
            trigger: 'blur'
          }
        ],
        coupon_rebate: [
          {
            required: true,
            message: '请选择嘉宾券返券方式',
            trigger: 'change'
          }
        ],
        is_mode: [
          {
            required: true,
            message: '请选择张数',
            trigger: 'change'
          }
        ],
        amount_reached: [
          {
            required: true,
            message: '请输入达到张数/金额',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '达到张数/金额只能是数字',
            trigger: 'blur'
          }
        ],
        availability_num: [
          {
            required: true,
            message: '请选择张数',
            trigger: 'change'
          }
        ],
        amount_reached: [
          {
            required: true,
            message: '请输入可使用数',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '可使用数只能是数字',
            trigger: 'blur'
          }
        ],
        is_integral: [
          {
            required: true,
            message: '请选择是否使用积分',
            trigger: 'change'
          }
        ],
        integral: [
          {
            required: false,
            message: '请输入使用积分数',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '积分数只能是数字',
            trigger: 'blur'
          }
        ],
        // applyShop: {
        //   shop_name: [
        //     {
        //       required: true,
        //       message: "请选择区域范围",
        //       trigger: "change"
        //     }
        //   ]
        // },

        // applyProject: {
        //   goods_name: [
        //     {
        //       required: true,
        //       message: "请选择项目范围",
        //       trigger: "change"
        //     }
        //   ]
        // },
        apply_package_name: [
          {
            required: true,
            message: '请选择套餐范围',
            trigger: 'change'
          }
        ],
        apply_product_name: [
          {
            required: true,
            message: '请选择产品范围',
            trigger: 'change'
          }
        ]
      },
      list: {
        shiyong: '0'
      },
      // 选择
      // 券种类
      optionCouponClass: [],
      optionCouponClass_gift: [],
      // 使用场景
      option1: [],
      // 是否叠加
      option2: [],
      // 顾客对象
      dic_send_object: [],
      // 顾客属性
      dic_customer_attr: [],
      // 顾客等级
      dic_customer_grade: [],
      // 顾客星级
      dic_customer_star: [],
      // 评价
      dic_customer_evaluation: [],
      // 顾客管理
      dic_manage_cate: [],
      // 券来源
      type: [],
      // 抵扣方式
      deductionMethod: [],
      // 失效
      failureMode: [],
      // 嘉宾返回
      couponRebate: [],
      // 成功
      codegood: '',
      // xu-xiugai
      alterId: {
        id: ''
      },
      // 数据初始化
      dataindex: [],
      vmdataInit: [],
      Stlist1: [],
      Stlist2: []
    }
  },
  // 监听
  computed: {
    newtotal() {
      return this.vmaddData.total_num
    },
    newmax_send_num() {
      return this.vmaddData.max_send_num
    },
    neworiginal() {
      return this.vmaddData.original_price
    },
    newsend() {
      return this.vmaddData.send_price
    }
  },
  watch: {
    newtotal(val) {
      this.vmgSurplus = val - this.vmaddData.max_send_num
    },
    newmax_send_num(val) {
      this.vmgSurplus = this.vmaddData.total_num - val
    },
    neworiginal(val) {
      this.vmgmianzhi = String(Number(val) + Number(this.vmaddData.send_price))
    },
    newsend(val) {
      this.vmgmianzhi = String(
        Number(this.vmaddData.original_price) + Number(val)
      )
    }
  },

  created() {
    this.vmdataInit = JSON.parse(JSON.stringify(this.vmaddData))
    this.getData()
  },
  mounted() {
    this.addGet()
  },
  methods: {
    // 修改
    getData() {
      // 获取数据
      projectStructureGet().then(res => {
        this.Stlist1 = res.data
      })
      structureGet().then(res => {
        this.Stlist2 = res.data
      })
      vmgretrievalGet().then(res => {
        this.vmgrestaurants = res.data.list
      })
    },
    // 新增渲染
    addGet() {
      vmgGcreate().then(res => {
        const data = res.data.dic
        this.optionCouponClass = data.coupon_class
        this.optionCouponClass_gift = data.coupon_class_gift
        this.option1 = data.dic_usage_scenarios
        this.option2 = data.isOwn
        this.dic_send_object = data.dic_send_object
        this.dic_customer_attr = data.dic_customer_attr
        this.dic_customer_grade = data.dic_customer_grade
        this.dic_customer_star = data.dic_customer_star
        this.dic_customer_evaluation = data.dic_customer_evaluation
        this.dic_manage_cate = data.dic_manage_cate
        this.type = data.type
        // console.log(this.source)
        // console.log(data.type)
        this.deductionMethod = data.deductionMethod
        this.failureMode = data.failureMode
        this.couponRebate = data.couponRebate
        // console.log(this.option2);
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.Addcancel()
        })
        .catch(_ => {})
    },
    Addcancel() {
      this.$refs.upload.$el.click()
    },
    // 检索
    querySearch(queryString, cb) {
      var restaurants = this.vmgrestaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) !==
          -1
        )
      }
    },
    handleSelect(item) {
      // console.log(item);
      this.vmaddData.superposition_use_coupon = item.id
      this.vmgState = item.name
    },
    handleIconClick(ev) {
      //  修改
      // console.log("44");
      this.vmaddData.superposition_use_coupon = ''
      this.vmgState = ''
    },
    // 富文本
    editorBlur(val) {
      this.vmaddData.description = val
    },
    // form 数据 false true
    dicArr() {
      this.attrinit = false
      this.vmaddData.dic_send_object.forEach(item => {
        if (item == 2) {
          this.attrinit = true
          return false
        } else {
          this.attrinit = false
          this.vmaddData.dic_customer_attr = []
          this.vmaddData.dic_manage_cate = []
          this.vmaddData.dic_customer_grade = []
          this.vmaddData.dic_customer_evaluation = []
          this.vmaddData.dic_customer_star = []
        }
      })
    },
    controldate() {
      if (this.vmaddData.is_send_at == 0) {
        this.vmaddData.start_send_at = 0
        this.vmaddData.end_send_at = 0
      } else {
        this.vmaddData.start_send_at = ''
        this.vmaddData.end_send_at = ''
      }
    },
    controldates() {
      if (this.vmaddData.failure_mode == 1) {
        this.vmaddData.effective_day = 0
      } else {
        this.vmaddData.effective_day = ''
      }
      if (this.vmaddData.failure_mode == 0) {
        this.vmaddData.start_use_at = 0
        this.vmaddData.end_use_at = 0
      } else {
        this.vmaddData.start_use_at = ''
        this.vmaddData.end_use_at = ''
      }
    },
    controlUse() {
      if (this.vmaddData.is_superposition_use == 1) {
        this.vmaddData.is_own = ''
        this.vmaddData.superposition_use_coupon = ''
      }
    },
    controlInte() {
      if (this.vmaddData.is_integral == 1) {
        this.vmaddData.integral = 0
      } else {
        this.vmaddData.integral = ''
      }
    },
    controlShi() {
      if (this.list.shiyong == 1) {
        this.vmaddData.is_mode = 0
        this.vmaddData.amount_reached = 0
        this.vmaddData.availability_num = 0
      } else {
        this.vmaddData.is_mode = ''
        this.vmaddData.amount_reached = ''
        this.vmaddData.availability_num = ''
      }
    },
    controltype() {
      if (this.vmaddData.type == 1) {
        this.vmaddData.customer_buy_num = ''
        this.vmaddData.max_send_num = 0
        this.vmaddData.coupon_class = ''
      } else {
        this.vmaddData.customer_buy_num = 0
        this.vmaddData.max_send_num = ''
        this.vmaddData.coupon_class = ''
      }
    },
    controlIs_own() {
      if (this.vmaddData.is_own == 0) {
        this.vmaddData.superposition_use_coupon = 0
      } else {
        this.vmaddData.superposition_use_coupon = ''
        this.vmgState = ''
      }
    },
    // 子组件false true
    storeOpen() {
      // console.log('55')
      if (this.vmaddData.apply_shop === 1) {
      }
      if (this.vmaddData.apply_shop === 0) {
        this.vmaddData.applyShop = []
        const index = []
        this.$refs.Store.tableInit(index)
      }
    },
    store_net() {
      this.innerStore = true
      if (this.alterId.id == null) {
        const index = [
          {
            shop_id: [],
            is_using: 0,
            number: '',
            status: 1,
            shop_name: ''
          }
        ]
        this.$refs.Store.tableInit(index)
      }
    },
    projectOpen() {
      if (this.vmaddData.apply_project === 1) {
      }
      if (this.vmaddData.apply_project === 0) {
        this.vmaddData.applyProject = []
        const index = []
        this.$refs.Project.tableInit(index)
      }
    },
    project_net() {
      this.innerProject = true
      if (this.alterId.id == null) {
        const index = [
          {
            goods_id: [],
            is_using: 0,
            quantity: '',
            amount: '',
            amount: '',
            goods_type: 1,
            using_type: 0
          }
        ]
        this.$refs.Project.tableInit(index)
      }
    },
    //
    productOpen() {
      if (this.vmaddData.apply_product === 1) {
        // this.innerProduct = true;
        // this.$refs.pro.triggerto()
      }
      if (this.vmaddData.apply_product === 0) {
        this.vmaddData.applyProduct = {}
      }
    },
    product_net() {
      this.innerProduct = true
      const data = this.vmaddData.applyProduct.goods_id
      this.$refs.pro.setdatainit(data)
    },
    setOpen() {
      if (this.vmaddData.apply_package === 1) {
        // this.innerSet = true;
        // this.$refs.set.triggerto()
      }
      if (this.vmaddData.apply_package === 0) {
        this.vmaddData.applySetMeal = {}
      }
    },
    set_net() {
      this.innerSet = true
      const data = this.vmaddData.applySetMeal.goods_id
      this.$refs.set.setdatainit(data)
    },
    // 数据转换
    Vmchange() {
      this.vmaddData.start_send_at = Math.round(
        this.vmaddData.start_send_at / 1000
      )
      this.vmaddData.end_send_at = Math.round(
        this.vmaddData.end_send_at / 1000
      )
      this.vmaddData.start_use_at = Math.round(
        this.vmaddData.start_use_at / 1000
      )
      this.vmaddData.end_use_at = Math.round(this.vmaddData.end_use_at / 1000)
      this.integral = Number(this.integral)
    },
    Vmdataindex() {
      const data = JSON.parse(JSON.stringify(this.dataindex))
      // console.log(this.dataindex);
      if (data.is_mode == 0) {
        this.list.shiyong = '1'
      } else {
        this.list.shiyong = '0'
      }
      data.is_send_at = String(data.is_send_at)
      data.is_integral = String(data.is_integral)
      data.start_send_at = Math.round(data.start_send_at * 1000)
      data.end_send_at = Math.round(data.end_send_at * 1000)
      data.start_use_at = Math.round(data.start_use_at * 1000)
      data.end_use_at = Math.round(data.end_use_at * 1000)
      data.dic_send_object = data.dic_send_object.split(',').map(Number)
      data.dic_customer_attr = data.dic_customer_attr.split(',').map(Number)
      data.dic_manage_cate = data.dic_manage_cate
        .split(',')
        .map(Number)
      data.dic_customer_grade = data.dic_customer_grade.split(',').map(Number)
      data.dic_customer_evaluation = data.dic_customer_evaluation
        .split(',')
        .map(Number)
      data.dic_customer_star = data.dic_customer_star.split(',').map(Number)
      data.availability_num = String(data.availability_num)
      data.customer_buy_num = String(data.customer_buy_num)
      data.integral = String(data.integral)
      data.max_send_num = String(data.max_send_num)
      data.amount_reached = String(data.amount_reached)
      data.original_price = String(data.original_price)
      data.send_price = String(data.send_price)
      data.total_num = String(data.total_num)
      data.effective_day = String(data.effective_day)
      if (data.applyShop.length > 0) {
        for (let i = 0; i < data.applyShop.length; i++) {
          data.applyShop[i].shop_id = data.applyShop[i].shop_id.split(',')
        }
      }
      if (data.applyProject.length > 0) {
        for (let i = 0; i < data.applyProject.length; i++) {
          data.applyProject[i].goods_id = data.applyProject[i].goods_id.split(
            ','
          )
        }
      }
      if (data.applySetMeal.goods_id) {
        data.applySetMeal.goods_id = data.applySetMeal.goods_id.split(',')
      }
      if (data.applyProduct.goods_id) {
        data.applyProduct.goods_id = data.applyProduct.goods_id.split(',')
      }

      this.vmaddData = data
    },
    // 提交
    submitForm(formName) {
      this.codegood = formName
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.alterId.id) {
            this.$confirm('是否确定修改？')
              .then(_ => {
                this.alterpost()
              })
              .catch(_ => {})
          } else {
            this.$confirm('是否确定新增？')
              .then(_ => {
                this.Addcancelpost()
              })
              .catch(_ => {})
          }
        } else {
          this.$message({
            message: '请填写完整',
            type: 'warning'
          })
          return false
        }
        // this.$refs[formName].resetFields()
      })
      if (this.codegood == 200) {
        this.$refs[formName].resetFields()
        this.codegood = 0
        this.vmaddData = JSON.parse(JSON.stringify(this.vmdataInit))
      }
    },
    // 修改
    datainits(indexs, rows) {
      this.alterId.id = rows.id
      vmAlterdata(this.alterId).then(res => {
        // console.log(res.data.detail);
        this.dataindex = res.data.detail
        this.Vmdataindex()
        this.$refs.Store.Storeindex(this.Stlist2)
        this.$refs.Project.Projectindex(this.Stlist1)
        this.$refs.Store.storeData(this.dataindex.applyShop)
        this.$refs.Project.projectData(this.dataindex.applyProject)
      })
    },

    //
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('update:snycTest', false)
      this.vmaddData = JSON.parse(JSON.stringify(this.vmdataInit))
      this.alterId.id = null
    },
    alterpost() {
      this.Vmchange()
      // console.log(this.vmaddData);
      vmAlter(this.vmaddData).then(res => {
        if (res.code == 200) {
          this.codegood = res.code
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.Addcancel()
          this.$parent.vmGet()
          this.alterId.id = null
        }
      })
    },
    Addcancelpost() {
      this.Vmchange()
      console.log(this.vmaddData)
      vmgAdd(this.vmaddData).then(res => {
        if (res.code == 200) {
          this.codegood = res.code
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.Addcancel()
          this.$parent.vmGet()
        }
      })
    },
    Addcancelgood() {
      if (this.vmaddData.is_send_at == 1 && this.vmaddData.end_send_at < this.vmaddData.start_send_at) {
        this.$message.warning('“赠送截止日期” 不允许早于 “赠送开始日期”，请检查后重新设置！')
        return
      }
      if (this.vmaddData.failure_mode == 1 && this.vmaddData.end_use_at < this.vmaddData.start_use_at) {
        this.$message.warning('“使用截止日期” 不允许早于 “使用开始日期”，请检查后重新设置！')
        return
      }
      this.$refs.upload2.$el.click()
    }
  }
}
</script>
<style scoped>
.Vma-body-1 {
  height: 65vh;
  overflow: hidden;
  overflow-y: scroll;
}
</style>
