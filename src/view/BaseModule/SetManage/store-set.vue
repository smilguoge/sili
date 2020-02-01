<template>
  <div class="app-container store-set-ly">
    <div class="filter-container clearfix">
      <el-form :inline="true" :model="listQuery" class="search-form h46">
        <el-form-item>
          <el-input
            v-model="listQuery.name"
            class="input-160 filter-item"
            placeholder="请输入店名"
            prefix-icon="el-icon-search"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="listQuery.code"
            class="input-160 filter-item"
            placeholder="请输入院代码"
            prefix-icon="el-icon-search"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.status" class="input-160 filter-item" placeholder="请选择门店状态">
            <el-option
              v-for="item in optionState"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="timearr"
            type="daterange"
            class="dateCompontent filter-item"
            unlink-panels
            range-separator="—"
            start-placeholder="请选择开店日期"
            end-placeholder="请选择截止日期"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="submitSearch"
          >查 询</el-button>
        </el-form-item>
      </el-form>
      <el-button
        :disabled="true"
        class="filter-item"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="openDialog('merge')"
      >门店合并</el-button>
      <el-button
        type="primary"
        class="filter-item"
        icon="el-icon-plus"
        @click="openDialog('create')"
      >新增</el-button>
    </div>

    <!-- 门店列表 -->
    <div class="table-wrap-ly">
      <el-table
        v-loading="listLoading"
        :show-overflow-tooltip="true"
        class="table-body-ly"
        style="width:100%"
        :data="listData"
        height="100%"
        border
        stripe
        fit
      >
        <el-table-column label="门店名称" align="center" min-width="160px" fixed="left">
          <template slot-scope="{row}">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="电话" width="120px" align="center">
          <template slot-scope="{row}">{{ row.telephone }}</template>
        </el-table-column>
        <el-table-column label="院长" align="center">
          <template slot-scope="{row}">{{ row.staff_name }}</template>
        </el-table-column>
        <el-table-column label="地区" show-overflow-tooltip min-width="180px" align="center">
          <template slot-scope="{row}">{{ row.address }}</template>
        </el-table-column>
        <el-table-column label="地址" show-overflow-tooltip min-width="180px" align="center">
          <template slot-scope="{row}">{{ row.address_detail }}</template>
        </el-table-column>
        <el-table-column label="面积 (㎡)" align="center">
          <template slot-scope="{row}">{{ row.shop_size }}</template>
        </el-table-column>
        <el-table-column label="关联pos" align="center">
          <template slot-scope="{row}">{{ row.pos }}</template>
        </el-table-column>
        <el-table-column label="开店日期" width="120px" align="center">
          <template slot-scope="{row}">{{ row.start_time | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
        <!-- <el-table-column prop="credential" label="证件到期日期" min-width="120px" align="center"> -->
        <el-table-column label="证件到期日期" min-width="120px" align="center">
          <template slot-scope="{row}">{{ row.start_time | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
        <!-- <el-table-column prop="healthcard" label="卫生许可证到期日期" min-width="150px" align="center"> -->
        <el-table-column label="卫生许可证到期日期" min-width="150px" align="center">
          <template slot-scope="{row}">{{ row.start_time | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
        <!-- <el-table-column prop="taxcard" label="税务登记证到期日期" min-width="150px" align="center"> -->
        <el-table-column label="税务登记证到期日期" min-width="150px" align="center">
          <template slot-scope="{row}">{{ row.start_time | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
        <el-table-column label="门店状态" align="center">
          <template slot-scope="{row}">
            <el-tag
              :type="row.status ==1?'success':row.status==2?'warning':'danger'"
              close-transition
            >{{ row.status==1?'正常':row.status==2?'已合并':'关店' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" show-overflow-tooltip label="操作人" align="center">
          <template slot-scope="{row}">{{ row.operator_name }}</template>
        </el-table-column>
        <el-table-column label="操作时间" min-width="140px" align="center">
          <template slot-scope="{row}">{{ row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="openDialog('edit',row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteSubmit(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="m-footer main-page">
        <el-pagination
          v-show="total>0"
          :current-page="listQuery.page"
          :page-sizes="[10,20,30]"
          :page-size="listQuery.page_size"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- Dialog -->
    <el-dialog
      :title="dialogType=='create'?'门店信息创建':'门店信息修改'"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :width="dialogWidth"
      class="store-dialog-ly"
      top="30px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="first">
          <!-- 基础信息 -->
          <el-form
            ref="changeData"
            :rules="rules"
            size="mini"
            :model="changeData"
            :label-width="formLabelWidth"
            class="dialog-form"
            fit
          >
            <el-row :gutter="46" type="flex" justify="space-around">
              <el-col :span="7">
                <el-form-item label="门店名称" prop="name">
                  <el-input
                    v-model="changeData.name"
                    style="width:190px"
                    placeholder="请输入门店名称"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="电话" prop="telephone">
                  <el-input
                    v-model="changeData.telephone"
                    style="width:190px"
                    placeholder="请输入电话号码"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="所属部门" prop="department_id">
                  <!-- <el-select
                    v-model="changeData.department_id"
                    style="width:190px"
                    placeholder="请选择所属部门"
                    clearable
                  >
                    <el-option
                      v-for="(item,index) in optionDepart"
                      :key="index"
                      :label="item.label"
                      :value=" item.value + '' "
                    />
                  </el-select> -->
                  <el-select
                    v-model="changeData.department_name"
                    style="width:190px"
                    placeholder="请选择所属部门"
                  >
                    <el-option
                      value=""
                      style="height:auto;padding:0"
                    >
                      <el-tree
                        ref="selectTree"
                        :indent="6"
                        :data="treeData"
                        :props="treeProps"
                        :expand-on-click-node="false"
                        default-expand-all
                        @node-click="handleNodeClick"
                      />
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="46" type="flex" justify="space-around">
              <el-col :span="7">
                <el-form-item label="院长" prop="staff_id">
                  <el-input
                    v-model="changeData.staff_id"
                    style="width:190px"
                    :disabled="true"
                    placeholder="请输入院长"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="院代码" prop="code">
                  <el-input
                    v-model="changeData.code"
                    style="width:190px"
                    placeholder="请输入院代码"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="开店日期" prop="start_time">
                  <el-date-picker
                    v-model="changeData.start_time"
                    style="width:190px"
                    type="date"
                    placeholder="请选择开店日期"
                    value-format="timestamp"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="46" type="flex" justify="space-around">
              <el-col :span="7">
                <el-form-item label="地区" prop="address">
                  <el-cascader
                    v-model="changeData.address"
                    style="width:190px"
                    :options="optionsAddress"
                    :props="addressProps"
                    expand-trigger="click"
                    clearable
                    @active-item-change="handleCascaderChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="详细地址" prop="address_detail">
                  <el-input
                    v-model="changeData.address_detail"
                    style="width:190px"
                    placeholder="请输入详细地址"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="面积 (㎡)" prop="shop_size">
                  <el-input
                    v-model="changeData.shop_size"
                    style="width:190px"
                    placeholder="请输入面积 (㎡)"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="46" type="flex" justify="space-around">
              <el-col :span="7">
                <el-form-item label="房间数" prop="rooms">
                  <el-input
                    v-model="changeData.rooms"
                    style="width:190px"
                    placeholder="请输入房间数"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="床位数" prop="beds">
                  <el-input
                    v-model="changeData.beds"
                    style="width:190px"
                    placeholder="请输入床位数"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="楼层" prop="dic_floor">
                  <el-select
                    v-model="changeData.dic_floor"
                    style="width:190px"
                    placeholder="请选择楼层"
                    clearable
                  >
                    <el-option
                      v-for="(item,index) in optionFloor"
                      :key="index"
                      :label="item.label"
                      :value="item.value+''"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="46" type="flex" justify="space-around">
              <el-col :span="7">
                <el-form-item label="经营类别" prop="dic_business_cate">
                  <el-select
                    v-model="changeData.dic_business_cate"
                    style="width:190px"
                    placeholder="请选择经营类别"
                    clearable
                  >
                    <el-option
                      v-for="(item,index) in optionOperation"
                      :key="index"
                      :label="item.label"
                      :value="item.value+''"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="管理类别" prop="dic_shop_manage_cate">
                  <el-select
                    v-model="changeData.dic_shop_manage_cate"
                    style="width:190px"
                    placeholder="请选择管理类别"
                    clearable
                  >
                    <el-option
                      v-for="(item,index) in optionManage"
                      :key="index"
                      :label="item.label"
                      :value="item.value+''"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="城市分类" prop="city_cate_id">
                  <el-select
                    v-model="changeData.city_cate_id"
                    style="width:190px"
                    placeholder="请选城市分类"
                    clearable
                  >
                    <el-option
                      v-for="(item,index) in cityClassList"
                      :key="index"
                      :label="item.label"
                      :value="item.value+''"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="46" type="flex" justify="space-around">
              <el-col :span="7">
                <el-form-item label="票据号开头" prop="start_bill_num">
                  <el-input
                    v-model="changeData.start_bill_num"
                    style="width:190px"
                    placeholder="请输入票据号开头"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="单店类型" prop="dic_shop_cate">
                  <el-select
                    v-model="changeData.dic_shop_cate"
                    style="width:190px"
                    placeholder="请选择单店类型"
                    clearable
                  >
                    <el-option
                      v-for="(item,index) in optionShopType"
                      :key="index"
                      :label="item.label"
                      :value="item.value+''"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9" />
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="门店介绍" prop="introduce">
                  <editor
                    v-model="changeData.introduce"
                    class="editor-wrap"
                    :is-clear="editorIsClear"
                    @change="editorBlur"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="门店状态" prop="status">
                  <el-radio-group v-model="changeData.status">
                    <el-radio label="1">正常</el-radio>
                    <el-radio label="0">关店</el-radio>
                    <el-radio label="2">已合并</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- ChangeDisplay 门店状态判断显示/隐藏 -->
            <div v-show="changeData.status!=1?true:false" class="changeDisplay">
              <el-row>
                <el-col :span="23">
                  <el-form-item label="合并原因" prop="reason">
                    <el-input
                      v-model="changeData.reason"
                      :disabled="true"
                      type="textarea"
                      placeholder="请输入合并原因"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="23">
                  <el-form-item label="相关附件">
                    <div class="w100">
                      <el-upload
                        class="upload-demo"
                        action
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        multiple
                        :limit="3"
                        :on-exceed="handleExceed"
                        :relate_file-list="fileList"
                      >
                        <el-button shop_size="small" type="primary">点击上传</el-button>
                        <div
                          slot="tip"
                          class="el-upload__tip"
                          style="color:#F10215"
                        >上传相关附件文件，大小不超过5M</div>
                      </el-upload>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="23">
                  <el-form-item label="合并明细">
                    <el-table
                      :data="changeData.merge"
                      class="option-table-ly w100"
                      height="230"
                      highlight-current-row
                      stripe
                      border
                    >
                      <el-table-column prop="id" label="序号" width="80" />
                      <el-table-column prop="target" label="目标门店" />
                      <el-table-column prop="default" label="默认所有" />
                      <el-table-column prop="customer" label="选择顾客" />
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <div style="text-align: right;">
            <el-button @click="handleClose()">取 消</el-button>
            <el-button type="primary" @click="submitForm('changeData')">确 定</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="证照信息" name="license" :disabled="true">证照信息</el-tab-pane>
        <el-tab-pane label="装修管理" name="decoration" :disabled="true">装修管理</el-tab-pane>
        <!-- <el-tab-pane label="资金账户" name="funds" :disabled="true">资金账户</el-tab-pane> -->
        <el-tab-pane label="资金账户" name="funds">
          <!-- 基础信息 -->
          <div class="sstab1">
            <div class="sstab1title">银行账户</div>
            <div class="sstab1btn">
              <el-button type="primary" size="mini" @click="createbank">新建</el-button>
            </div>
            <el-table border :data="banklist">
              <el-table-column prop="bank" label="存款银行" width="160" align="center" class="sstps1">
                <template slot-scope="scope" class="sstps2">
                  <el-input v-model="scope.row.bank" placeholder="请输入银行" :disabled="true" />
                </template>
              </el-table-column>
              <el-table-column prop="account_name" label="账户名字" width="100" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.account_name" placeholder="请输入名字" />
                </template>
              </el-table-column>
              <el-table-column prop="credit_card_num" label="银行卡号" width="auto" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.credit_card_num" placeholder="请输入银行卡号" @change="change_yhk1($event,scope.row)" />
                </template>
              </el-table-column>
              <el-table-column prop="dic_account_type" label="账号类型" width="160" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.dic_account_type" placeholder="请选择">
                    <el-option
                      v-for="item in banktype"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="账户状态" width="120" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.status" placeholder="请选择">
                    <el-option
                      v-for="item in bankstatue"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="{row}">
                  <el-button type="danger" size="mini" @click="deletebankinf(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="ssetbtn">
              <el-button type="primary" size="mini" @click="updatebank">确定</el-button>
            </div>
          </div>
          <div class="sstab2">
            <div class="sstab1title">POS机设置</div>
            <div class="sstab1btn">
              <el-button type="primary" size="mini" @click="createpos">新建</el-button>
            </div>
            <el-table border :data="poslist">
              <el-table-column prop="id" label="编号" width="160" align="center" />
              <el-table-column prop="account_name" label="pos类型" width="100" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.dic_pos_type" placeholder="请选择">
                    <el-option
                      v-for="item in posdata"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="pos_term_no" label="pos终端号" width="auto" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.pos_term_no" placeholder="请输入pos终端号" />
                </template>
              </el-table-column>
              <el-table-column prop="status" label="账户状态" width="120" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.status" placeholder="请选择">
                    <el-option
                      v-for="item in bankstatue"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="{row}">
                  <el-button type="danger" size="mini" @click="deleteposinf(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="ssetbtn">
              <el-button type="primary" size="mini" @click="updatepos">确定</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="租赁合同" name="contract" :disabled="true">租赁合同</el-tab-pane>
        <el-tab-pane label="门店照片" name="photo" :disabled="true">门店照片</el-tab-pane>
        <el-tab-pane label="门店坐标" name="coordinate" :disabled="true">门店坐标</el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import {
  getShop,
  editShop,
  createShop,
  updateShop,
  deleteShop,
  getDepart,
  gcreate,
  gupdate,
  getBankList,
  getPosList,
  updateBank,
  updatePos,
  deletePos,
  deleteBank
} from '@/api/BaseModule/SetManage'
import Editor from '@/component/wangEditor/index'
import { numberToIdentifer } from 'webpack/lib/Template'
import BIN from 'bankcardinfo'

export default {
  /**
   *
   * 模块进度：
   *
   *  FIXME: 合并门店操作未完成
   *
   */
  name: 'StoreSetting',
  components: { Editor },
  data() {
    return {
      ruleForm: {
        wage_card_number: '',
        brank_name: '建行'
      },
      listData: [],
      changeData: {},
      searchForm: {},
      defaultData: {
        staff_id: 0, // 院长ID
        address: [], // 区域
        shop_size: '', // 面积
        dic_floor: '', // 楼层
        city_cate_id: '', // 城市分类
        start_bill_num: '', // 票据号开头
        introduce: '', // 门店介绍
        status: '1' // 门店状态
        // relate_file: [] // 相关附件
      },
      shopid: 0,
      banklist: [],
      poslist: [],
      bankdata: [],
      posdata: [],
      bankstatue: [],
      banktype: [],
      postype: [],
      dialogType: '',
      dialogVisible: false,

      // - 选项 [0:合并;1正常]
      optionState: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: '正常'
        },
        {
          value: 2,
          label: '已合并'
        },
        {
          value: 0,
          label: '关店'
        }
      ],
      cityClassList: [], // 城市分类
      optionFloor: [], // 楼层
      optionOperation: [], // 经营类别
      optionManage: [], // 管理类别
      optionShopType: [], // 店类型
      optionsAddress: [],
      optionDepart: [
        {
          value: 1,
          label: '所属部门1'
        },
        {
          value: 2,
          label: '所属部门2'
        }
      ], // 所属部门
      treeData: [], // 部门树

      // - 文件列表
      fileList: [],

      total: null,
      listQuery: {
        page: 1,
        page_size: 10,
        name: '',
        code: '',
        status: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入门店名称',
            trigger: 'blur'
          },
          {
            max: 15,
            message: '最多输入 15 个字符',
            trigger: 'blur'
          }
        ],
        telephone: [
          {
            required: true,
            message: '请输入电话号码',
            trigger: 'blur'
          },
          {
            max: 15,
            message: '最多输入 15 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '电话号码只能是数字',
            trigger: 'blur'
          }
        ],
        department_id: [
          {
            required: true,
            message: '请选择所属部门',
            trigger: 'change'
          }
        ],
        dic_shop_cate: [
          {
            required: true,
            message: '请选择单店类型',
            trigger: 'change'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入院代码',
            trigger: 'blur'
          },
          {
            max: 15,
            message: '最多输入 15 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: '院代码由数字或字母组成',
            trigger: 'blur'
          }
        ],
        start_time: [
          {
            required: true,
            message: '请选择开店日期',
            trigger: 'change'
          }
        ],
        address_detail: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          },
          {
            max: 30,
            message: '最多输入 30 个字符',
            trigger: 'blur'
          }
        ],
        rooms: [
          {
            required: true,
            message: '请输入房间数',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '房间数只能是数字',
            trigger: 'blur'
          }
        ],
        shop_size: [
          {
            required: true,
            message: '请输入门店面积',
            trigger: 'blur'
          },
          {
            max: 8,
            message: '最多输入 8 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d\.]+$/,
            message: '面积由数字与小数点组成',
            trigger: 'blur'
          }
        ],
        beds: [
          {
            required: true,
            message: '请输入床位数',
            trigger: 'blur'
          },
          {
            max: 5,
            message: '最多输入 5 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[\d]+$/,
            message: '床位数只能是数字',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '请选择地区',
            trigger: 'change'
          }
        ],
        start_bill_num: [
          {
            required: true,
            message: '请输入票据号开头',
            trigger: 'blur'
          },
          {
            max: 10,
            message: '最多输入 10 个字符',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: '票据号开头由数字或字母组成',
            trigger: 'blur'
          }
        ],
        city_cate_id: [
          {
            required: true,
            message: '请选择城市类别',
            trigger: 'change'
          }
        ],
        dic_floor: [
          {
            required: true,
            message: '请选择楼层',
            trigger: 'change'
          }
        ],
        dic_business_cate: [
          {
            required: true,
            message: '请选择经营类别',
            trigger: 'change'
          }
        ],
        dic_shop_manage_cate: [
          {
            required: true,
            message: '请选择管理类别',
            trigger: 'change'
          }
        ],
        status: [
          {
            required: true,
            message: '请选择门店状态',
            trigger: 'change'
          }
        ]
      },

      // - 清空文本域
      editorIsClear: false,

      // - 参数配置
      treeProps: {
        children: 'child',
        label: 'depart_name'
      },
      addressProps: {
        value: 'id',
        label: 'name',
        children: 'child'
      },
      timearr: [],
      flagTime: 0,
      activeName: 'first',
      listLoading: false,
      smallSize: 'small',
      dialogWidth: '950px',
      formLabelWidth: '100px'
    }
  },
  created() {
    this.getList(this.listQuery)
  },
  methods: {
    // 自动检测卡名
    change_yhk1(ev, ev2) {
      const index = this.banklist.indexOf(ev2)

      if (ev2.credit_card_num != '') {
        BIN.getBankBin(ev2.credit_card_num).then(res => {
          (this.banklist[index]).bank = res.bankName
          console.log(this.banklist)
        })
      }
    },
    //     setbank(index,name){
    // // this.$set(this.banklist[index],'bank',name)
    // (this.banklist[index]).bank = name
    //     },
    // - 检索
    submitSearch() {
      if (this.timearr && this.timearr.length > 0) {
        this.listQuery.start_time_start = Math.floor(this.timearr[0] / 1000)
        this.listQuery.start_time_end = Math.floor(this.timearr[1] / 1000)
      } else {
        this.listQuery.start_time_start = ''
        this.listQuery.start_time_end = ''
      }
      this.getList(this.listQuery)
    },

    // - 弹框集中调用
    openDialog(type, id) {
      this.shopid = id
      this.listLoading = true
      if (type === 'create') {
        // - request
        this.getDepartList() // 请求部门树
        // - 请求option
        gcreate().then(res => {
          const items = res.data.dic
          this.cityClassList = items.dic_city_cate
          this.optionFloor = items.dic_floor
          this.optionShopType = items.dic_shop_cate
          this.optionManage = items.dic_shop_manage_cate
          this.optionOperation = items.dic_business_cate
          this.optionsAddress = items.region
          this.changeData = JSON.parse(JSON.stringify(this.defaultData))
          this.dialogType = type
          this.dialogVisible = true
          this.listLoading = false
          this.banklist = []
          this.poslist = []
        })
        this.getBankList(0)
        // this.getPosList(0)
      } else if (type === 'edit') {
        // - request
        this.getDepartList() // 请求部门树
        editShop(id)
          .then(res => {
            const item = res.data
            const startTime = item.start_time
            this.changeData = JSON.parse(JSON.stringify(item))
            if ((startTime + '').length < 11) {
              this.changeData.start_time = startTime * 1000 // 恢复时间戳长度
            }
            // - 请求option
            gupdate().then(res => {
              const items = res.data.dic
              this.optionOperation = items.dic_business_cate
              this.cityClassList = items.dic_city_cate
              this.optionManage = items.dic_shop_manage_cate
              this.optionFloor = items.dic_floor
              this.optionShopType = items.dic_shop_cate
              this.optionsAddress = items.region
              this.dialogType = type
              this.dialogVisible = true
              this.listLoading = false
              console.log(typeof items.region[0].id)
            })
            this.getBankList(id)
            this.getPosList(id)
          })
          .catch(res => {
            this.$message.warning(res.message)
            this.listLoading = false
            return
          })
      } else {
        // FIXME: 合并操作未完成
        console.log('merge Dialog')
      }
    },

    // 获取部门树
    getDepartList() {
      getDepart().then(res => {
        this.treeData = res.data
      })
    },

    // 获取银行卡
    getBankList(id) {
      const data = { shop_id: id }
      const datalist = []
      getBankList(data).then(res => {
        // this.bankdata = res.data.dic.dic_bank
        // this.posdata=res.data.dic.
        this.bankstatue = res.data.dic.status
        this.banktype = res.data.dic.dic_account_type
        if (res.data.list.length > 0) {
          res.data.list.forEach(function(item, index) {
            const b1 = item.bank
            const b2 = Number(item.dic_account_type)
            const b3 = Number(item.status)
            const data = {
              shop_id: item.shop_id,
              bank: b1,
              dic_account_type: b2,
              account_name: item.account_name,
              credit_card_num: item.credit_card_num,
              status: b3,
              id: item.id
            }
            datalist.push(data)
          })
        }
        this.banklist = datalist
      })
    },
    // 获取pos
    getPosList(id) {
      const data = { shop_id: id }
      const datalist = []
      getPosList(data).then(res => {
        this.posdata = res.data.dic.dic_pos_type
        this.bankstatue = res.data.dic.status
        this.postype = res.data.dic.dic_account_type
        if (res.data.list.length > 0) {
          res.data.list.forEach(function(item, index) {
            const b1 = Number(item.dic_pos_type)
            const b2 = Number(item.status)
            const data = {
              shop_id: item.shop_id,
              pos_term_no: item.pos_term_no,
              dic_pos_type: b1,
              status: b2,
              id: item.id
            }
            datalist.push(data)
          })
        }
      })
      this.poslist = datalist
    },
    updatebank() {
      const bankst = this.banklist.some(item => {
        return item.id == ''
      })
      const bankture = this.banklist.some(item => {
        return item.bank == ''
      })
      const typeture = this.banklist.some(item => {
        return item.dic_account_type == ''
      })
      const nameture = this.banklist.some(item => {
        return item.account_name == ''
      })
      const cardture = this.banklist.some(item => {
        return item.credit_card_num == ''
      })
      const statueture = this.banklist.some(item => {
        return item.status === ''
      })
      if (bankture) {
        this.$message({
          message: '存款银行没有选择',
          type: 'error'
        })
      } else if (typeture) {
        this.$message({
          message: '账号类型没有选择',
          type: 'error'
        })
      } else if (nameture) {
        this.$message({
          message: '账号名字没有选择',
          type: 'error'
        })
      } else if (cardture) {
        this.$message({
          message: '卡没有输入',
          type: 'error'
        })
      } else if (statueture) {
        this.$message({
          message: '账户状态没有选择',
          type: 'error'
        })
      } else if (bankst) {
        this.$message({
          message: '请先保存门店设置',
          type: 'error'
        })
      } else {
        console.log('xxi')
        console.log(this.banklist)
        updateBank(this.banklist).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getBankList(this.shopid)
        })
      }
    },
    updatepos() {
      const posst = this.poslist.some(item => {
        return item.id == ''
      })
      const posteture = this.poslist.some(item => {
        return item.dic_pos_type == ''
      })
      const typeture = this.poslist.some(item => {
        return item.pos_term_no == ''
      })
      const statusture = this.poslist.some(item => {
        return item.status === ''
      })
      if (posteture) {
        this.$message({
          message: 'POS类型没有选择',
          type: 'error'
        })
      } else if (typeture) {
        this.$message({
          message: 'POS终端没有选择',
          type: 'error'
        })
      } else if (statusture) {
        this.$message({
          message: '状态没有选择',
          type: 'error'
        })
      } else if (posst) {
        this.$message({
          message: '请先保存门店设置',
          type: 'error'
        })
      } else {
        updatePos(this.poslist).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getPosList(this.shopid)
        })
      }
    },
    createbank() {
      const data = {
        shop_id: this.shopid,
        bank: '',
        dic_account_type: '',
        account_name: '',
        credit_card_num: '',
        status: 1,
        id: ''
      }
      this.banklist.push(data)
    },
    deleteposinf(row) {
      const data = { id: row.id }
      if (row.id === '') {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.poslist.indexOf(row)
            this.poslist.splice(index, 1)
          })
          .catch(() => {})
      } else {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deletePos(data).then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              const index = this.poslist.indexOf(row)
              this.poslist.splice(index, 1)
            })
          })
          .catch(() => {})
      }
    },
    deletebankinf(row) {
      const data = { id: row.id }
      console.log(data)
      if (row.id === '') {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.banklist.indexOf(row)
            this.banklist.splice(index, 1)
          })
          .catch(() => {})
      } else {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteBank(data).then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              const index = this.banklist.indexOf(row)
              this.banklist.splice(index, 1)
            })
          })
          .catch(() => {})
      }
    },
    createpos() {
      const data = {
        shop_id: this.shopid,
        pos_term_no: '',
        dic_pos_type: '',
        status: 1,
        id: ''
      }
      this.poslist.push(data)
    },
    // - 验证
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const curr = new Date()
          if (curr - this.flagTime > 1000) {
            this.handleDone(this.dialogType)
            this.flagTime = curr
          }
        } else {
          this.$message.warning('请正确填写必填项！')
          return false
        }
      })
    },

    // - 清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.changeData = JSON.parse(JSON.stringify(this.defaultData))
      this.editorClear()
    },

    // - 创建/修改
    handleDone(type) {
      // 时间戳处理
      if ((this.changeData.start_time + '').length > 10) {
        this.changeData.start_time = Math.floor(
          this.changeData.start_time / 1000
        )
      }
      if (type === 'create') {
        createShop(this.changeData)
          .then(res => {
            this.getList(this.listQuery)
            this.dialogVisible = false
            this.resetForm('changeData')
          })
          .catch(res => {
            this.$message.warning(res.message)
            this.dialogVisible = false
            return
          })
      } else {
        updateShop(this.changeData, this.changeData.id)
          .then(res => {
            this.getList(this.listQuery)
            this.dialogVisible = false
            this.resetForm('changeData')
          })
          .catch(res => {
            // this.$message.warning(res.message)
            this.dialogVisible = false
            return
          })
      }
    },

    // - 删除
    deleteSubmit(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // - request
          deleteShop(id)
            .then(res => {
              this.getList(this.listQuery)
            })
            .catch(res => {
              this.$message.warning(res.message)
              return
            })
        })
        .catch(() => {})
    },

    // - 关闭Dialog
    handleClose() {
      this.$confirm('确认关闭？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.dialogVisible = false
          this.resetForm('changeData')
          this.dialogType = ''
        })
        .catch(() => {})
    },

    // - Tab切换
    handleClick(tab, event) {
      // console.log(tab, event);
    },

    // - 级联选择器
    handleCascaderChange(val) {
      console.log('active item:', val)
    },

    // - editor clear
    editorClear() {
      this.isClear = true
      setTimeout(() => {
        this.isClear = false
      }, 100)
    },
    editorBlur(val) {
      // console.log(val)
      this.changeData.introduce = val
    },

    // - 上传文件
    handleRemove(relate_file, fileList) {
      // - 点击已上传的文件链接时的钩子
      console.log(relate_file, fileList)
    },
    handlePreview(relate_file) {
      // - 文件列表移除文件时的钩子
      console.log(relate_file)
    },
    handleExceed(files, fileList) {
      // - 文件超出个数限制时的钩子
      this.$message.warning(
        `最多上传 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(relate_file, fileList) {
      // - 文件列表移除文件前的钩子
      return this.$confirm(`确定移除 ${relate_file.name}？`)
    },

    // - 请求数据
    getList(params) {
      this.listLoading = true
      getShop(params)
        .then(res => {
          const data = res.data
          if (data.lenght != 0) {
            this.listData = data.list
            this.total = parseInt(data.count)
            this.listLoading = false
          } else {
            this.listData = []
            this.$message.warning('没有更多数据')
            this.listLoading = false
          }
        })
        .catch(res => {
          this.$message.warning('数据请求失败')
        })
    },

    // - 部门下拉树
    handleNodeClick(node) {
      // - handle-Select-Tree
      this.$set(this.changeData, 'department_name', node.depart_name)
      this.changeData.department_id = node.id
    },

    // - 分页
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList(this.listQuery)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList(this.listQuery)
    }
  }
}
</script>

<style lang='scss' scoped>
.sstab1 >>> .has-gutter th:last-child{
  margin-right: 30px
}
.sstab1 >>> .el-table th.is-leaf .cell::before,.sstab2 >>> .el-table th.is-leaf .cell::before{
     content: "*";
    position: absolute;
    color: #f56c6c;
    line-height: 10px;
    margin-top: 6px;
    margin-left: -8px;
}
.sstab1 >>> .el-table th.is-leaf:nth-child(6) .cell::before,
.sstab2 >>> .el-table th.is-leaf:nth-child(5) .cell::before,
.sstab2 >>> .el-table th.is-leaf:nth-child(1) .cell::before{
content: " ";
color: #fff;
}
.ssetbtn {
  text-align: right;
  margin-top: 15px;
}

.sstab1title {
  padding-top: 8px;
  font-size: 14px;
  display: inline-block;
  margin-right: 15px;
}
.sstab1btn {
  margin-bottom: 15px;
  display: inline-block;
}

.store-set-ly {
  .input-160 {
    width: 158px !important;
  }
  .dateCompontent {
    width: 300px;
  }
  .option-table-ly {
    border-color: #dcdfe6;
    border-radius: 4px;
  }
  .h46 {
    height: 46px;
  }
  .table-wrap-ly {
    width: 100%;
    height: calc(100vh - 260px);
    flex: 1;
    transition: 0.2s;
    -webkit-transition: 0.2s;
  }
  .table-body-ly {
    max-height: calc(100% - 20px);
  }
}
  .account-header{
    height: 44px;
    line-height: 28px;
    padding: 8px 0;
    display: flex;
    justify-content: space-between
  }
</style>

<style lang="scss">
.store-set {
  .store-dialog-ly {
    .el-form-item__error {
      width: 210px;
    }
  }
}
</style>
