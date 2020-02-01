<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="订金管理"
      :before-close="handleCancel"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      top="30px"
      :fullscreen="false"
      class="payment-dialog"
      width="1100px"
    >
      <div class="money-body">
        <div class="money-top">
          <el-divider content-position="left">
            <span style="color:#895DFE; font-size:18px;">基本信息</span>
          </el-divider>
          <div class="money-top-1">
            <el-row>
              <el-col :span="8">
                <p>
                  <span>会员编号：</span>
                  <span>{{ customerInfo.customer_no }}</span>
                </p>
              </el-col>
              <el-col :span="8">
                <p>
                  <span>姓名：</span>
                  <span>{{ customerInfo.name }}</span>
                </p>
              </el-col>
              <el-col :span="8">
                <p>
                  <span>磁卡编号：</span>
                  <span>{{ customerInfo.card_id }}</span>
                </p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <p>
                  <span>顾客属性：</span>
                  <span>{{ customerInfo.customer_attr_name }}</span>
                </p>
              </el-col>
              <el-col :span="8">
                <p>
                  <span>手机号码：</span>
                  <span>{{ customerInfo.phone }}</span>
                </p>
              </el-col>
              <el-col :span="8">
                <p>
                  <span>所属美容院：</span>
                  <span>{{ customerInfo.shop.name }}</span>
                </p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <p>
                  <span>订金余额：</span>
                  <span>{{ balanceInfo.deposit }}</span>
                </p>
              </el-col>
              <el-col :span="8">
                <p>
                  <span>子产业订金余额：</span>
                  <span>{{ balanceInfo.deposit_ind }}</span>
                </p>
              </el-col>
              <el-col :span="8">
                <p>
                  <span>活动订金余额：</span>
                  <span>{{ balanceInfo.deposit_act }}</span>
                </p>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="money-center">
          <div>
            <el-divider content-position="left">
              <span style="color:#895DFE; font-size:18px;">订金类型</span>
            </el-divider>
          </div>
          <div class="money-center-1">
            <el-radio-group v-model="moneyradio">
              <el-radio-button label="1">订金</el-radio-button>
              <el-radio-button label="2">子产业订金</el-radio-button>
              <el-radio-button label="3">活动订金</el-radio-button>
            </el-radio-group>
            <p>
              <span>充值总额：</span>
              <span class="main-color num">{{ payTotal }}</span>
            </p>
          </div>
          <div v-show="this.moneyradio == '1'" class="money-center-body-1">
            <el-form
              ref="depositForm"
              :model="payData.deposit"
              style="margin-top: 20px;"
            >
              <el-row class="row-background h68" style="margin-top:-20px">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-weixinzhifu" style="color:#6BCC03" />
                </el-col>
                <el-col :span="12">
                  <el-form-item label="微信:" label-width="90px" prop="wx.money">
                    <el-input
                      v-model="payData.deposit.wx.money"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                    <el-popover placement="right" width="326" trigger="click">
                      <el-image
                        style="width:300px; height:300px"
                        :src="imgUrl"
                        fit="fill"
                      />
                      <el-button
                        slot="reference"
                        type="primary"
                        size="small"
                        plain
                      >扫码支付</el-button>
                    </el-popover>
                    <span
                      v-if="payData.deposit.wx.payed"
                      class="suc-color ispay-font"
                    >{{ "已支付" }}</span>
                    <span v-else class="err-color ispay-font">{{
                      "未支付"
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="微信支付金额:">
                    <span class="info-color">{{
                      payData.deposit.wx.payed ? payData.deposit.wx.money : "0"
                    }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-zhifubao" style="color:#06B4FD" />
                </el-col>
                <el-col :span="12">
                  <el-form-item label="支付宝:" label-width="90px" prop="alipay.money">
                    <el-input
                      v-model="payData.deposit.alipay.money"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                    <el-popover placement="right" width="326" trigger="click">
                      <el-image
                        style="width:300px; height:300px"
                        :src="imgUrl"
                        fit="fill"
                      />
                      <el-button
                        slot="reference"
                        type="primary"
                        size="small"
                        plain
                      >扫码支付</el-button>
                    </el-popover>
                    <span
                      v-if="payData.deposit.alipay.payed"
                      class="suc-color ispay-font"
                    >{{ "已支付" }}</span>
                    <span v-else class="err-color ispay-font">{{
                      "未支付"
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="支付宝支付金额:">
                    <span class="info-color">{{
                      payData.deposit.alipay.payed
                        ? payData.deposit.alipay.money
                        : "0"
                    }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-qianbao1" style="color:#F4EA2A" />
                </el-col>
                <el-col :span="22">
                  <el-form-item label="现金:" label-width="90px" prop="cash.money">
                    <el-input
                      v-model="payData.deposit.cash.money"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-guanlian" style="color:#6666FE" />
                </el-col>
                <el-col :span="23">
                  <el-form-item label="选择子产业:" label-width="90px" prop="sonIndustry.id">
                    <el-select
                      v-model="payData.deposit.sonIndustry.id"
                      class="pay-input"
                      placeholder="请选择子产业"
                      @change="handleIndustry"
                    >
                      <el-option
                        v-for="item in sonIndustry"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type"
                      />
                    </el-select>
                    <el-input
                      v-model="payData.deposit.sonIndustry.money"
                      style="width:320px"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                    <!-- <span class="tit-font">剩余子产业订金：</span>
                    <span class="err-color">{{ remainSonDeposit }}</span> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-cardb" style="color:#06B4FD" />
                </el-col>
                <el-col :span="22">
                  <el-form-item label="POS单:" label-width="90px">
                    <div class="pos-table">
                      <div class="pos-table-head">
                        <el-button
                          type="primary"
                          class="pos-tool-btn"
                          plain
                          size="small"
                          @click="openPosDialog"
                        >新 增</el-button>
                      </div>
                      <el-table :data="posTable.deposit" height="200px" fit>
                        <el-table-column
                          label="POS机类型"
                          align="center"
                          width="150"
                        >
                          <template slot-scope="{ row }">
                            <span>{{ row.type_name }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="POS单据" align="center">
                          <template slot-scope="{ row }">
                            <span>{{ row.detail }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="实际金额"
                          align="center"
                          width="150"
                        >
                          <template slot-scope="{ row }">
                            <span>{{ row.amount }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          align="center"
                          width="120"
                        >
                          <template slot-scope="row">
                            <el-button type="danger" size="mini" @click="handlePosDelete(row.$index)">删 除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="24">
                  <el-form-item label="充值合计:">
                    <span class="main-color num">{{ payTotal_deposit }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div v-show="this.moneyradio == '2'" class="money-center-body-1">
            <el-form
              ref="industryForm"
              :model="payData.industry"
              style="margin-top: 20px;"
            >
              <el-row
                class="row-background h68"
                style="margin-top:-20px; background: none;"
              >
                <el-col :span="24">
                  <el-form-item label="子产业名称:" label-width="90px" prop="info.id">
                    <el-select
                      v-model="payData.industry.info.id"
                      class="pay-input"
                      placeholder="请选择子产业"
                    >
                      <el-option
                        v-for="item in sonIndustry"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-qian2" style="color:#F4EA2A" />
                </el-col>
                <el-col :span="11">
                  <el-form-item label="订金:" label-width="90px" prop="depositMoney.money">
                    <el-input
                      v-model="payData.industry.depositMoney.money"
                      class="pay-input"
                      placeholder="请输入订金金额"
                      v-limit-num
                    />
                    <span class="tit-font">剩余订金：</span>
                    <span class="err-color">{{ remain_deposit }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="活动订金:" label-width="90px" prop="activityMoney.money">
                    <el-input
                      v-model="payData.industry.activityMoney.money"
                      class="pay-input"
                      placeholder="请输入活动订金金额"
                      v-limit-num
                    />
                    <span class="tit-font">剩余活动订金：</span>
                    <span class="err-color">{{ remain_activity }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-weixinzhifu" style="color:#6BCC03" />
                </el-col>
                <el-col :span="12">
                  <el-form-item label="微信:" label-width="90px" prop="wx.money">
                    <el-input
                      v-model="payData.industry.wx.money"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                    <el-popover placement="right" width="326" trigger="click">
                      <el-image
                        style="width:300px; height:300px"
                        :src="imgUrl"
                        fit="fill"
                      />
                      <el-button
                        slot="reference"
                        type="primary"
                        size="small"
                        plain
                      >扫码支付</el-button>
                    </el-popover>
                    <span
                      v-if="payData.industry.wx.payed"
                      class="suc-color ispay-font"
                    >{{ "已支付" }}</span>
                    <span v-else class="err-color ispay-font">{{
                      "未支付"
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="微信支付金额:">
                    <span class="info-color">{{
                      payData.industry.wx.payed
                        ? payData.industry.wx.money
                        : "0"
                    }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-zhifubao" style="color:#06B4FD" />
                </el-col>
                <el-col :span="12">
                  <el-form-item label="支付宝:" label-width="90px" prop="alipay.money">
                    <el-input
                      v-model="payData.industry.alipay.money"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                    <el-popover placement="right" width="326" trigger="click">
                      <el-image
                        style="width:300px; height:300px"
                        :src="imgUrl"
                        fit="fill"
                      />
                      <el-button
                        slot="reference"
                        type="primary"
                        size="small"
                        plain
                      >扫码支付</el-button>
                    </el-popover>
                    <span
                      v-if="payData.industry.alipay.payed"
                      class="suc-color ispay-font"
                    >{{ "已支付" }}</span>
                    <span v-else class="err-color ispay-font">{{
                      "未支付"
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="支付宝支付金额:">
                    <span class="info-color">{{
                      payData.industry.alipay.payed
                        ? payData.industry.alipay.money
                        : "0"
                    }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-qianbao1" style="color:#F4EA2A" />
                </el-col>
                <el-col :span="22">
                  <el-form-item label="现金:" label-width="90px" prop="cash.money">
                    <el-input
                      v-model="payData.industry.cash.money"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-guanlian" style="color:#6666FE" />
                </el-col>
                <el-col :span="23">
                  <el-form-item label="选择子产业:" label-width="90px" prop="sonIndustry.id">
                    <el-select
                      v-model="payData.industry.sonIndustry.id"
                      class="pay-input"
                      placeholder="请选择子产业"
                    >
                      <el-option
                        v-for="item in sonIndustry"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type"
                      />
                    </el-select>
                    <el-input
                      v-model="payData.industry.sonIndustry.money"
                      style="width:320px"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                    <!-- <span class="tit-font">剩余子产业订金：</span>
                    <span class="err-color">{{ num }}</span> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-cardb" style="color:#06B4FD" />
                </el-col>
                <el-col :span="22">
                  <el-form-item label="POS单:" label-width="90px">
                    <div class="pos-table">
                      <div class="pos-table-head">
                        <el-button
                          type="primary"
                          class="pos-tool-btn"
                          plain
                          size="small"
                          @click="openPosDialog"
                        >新 增</el-button>
                      </div>
                      <el-table :data="posTable.industry" height="200px" fit>
                        <el-table-column
                          label="POS机类型"
                          align="center"
                          width="150"
                        >
                          <template slot-scope="{ row }">
                            <span>{{ row.type_name }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="POS单据" align="center">
                          <template slot-scope="{ row }">
                            <span>{{ row.detail }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="实际金额"
                          align="center"
                          width="150"
                        >
                          <template slot-scope="{ row }">
                            <span>{{ row.amount }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          align="center"
                          width="120"
                        >
                          <template slot-scope="row">
                            <el-button type="danger" size="mini" @click="handlePosDelete(row.$index)">删 除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="24">
                  <el-form-item label="充值合计:">
                    <span class="main-color num">{{ payTotal_industry }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div v-show="this.moneyradio == '3'" class="money-center-body-1">
            <el-form :model="payData.activity" ref="activityForm" style="margin-top: 20px;">
              <el-row
                class="row-background h68"
                style="margin-top:-20px; background: none;"
              >
                <el-col :span="8">
                  <el-form-item label="储值活动:" prop="stored.id">
                    <el-select
                      v-model="payData.activity.stored.id"
                      class="pay-input"
                      placeholder="请选择"
                      @change="handleStoredActivityChange"
                    >
                      <el-option
                        v-for="item in storedActivity"
                        :key="item.card_package_id"
                        :label="item.name"
                        :value="item.card_package_id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="宣传渠道:" prop="channel.value">
                    <el-select
                      v-model="payData.activity.channel.value"
                      class="pay-input"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in promotionChannel"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-qian2" style="color:#F4EA2A" />
                </el-col>
                <el-col :span="23">
                  <el-form-item label="订金:" label-width="90px" prop="depositMoney.money">
                    <el-input
                      v-model="payData.activity.depositMoney.money"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                    <span class="tit-font">剩余订金：</span>
                    <span class="err-color">{{ remain_deposit }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-weixinzhifu" style="color:#6BCC03" />
                </el-col>
                <el-col :span="12">
                  <el-form-item label="微信:" label-width="90px" prop="wx.money">
                    <el-input
                      v-model="payData.activity.wx.money"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                    <el-popover placement="right" width="326" trigger="click">
                      <el-image
                        style="width:300px; height:300px"
                        :src="imgUrl"
                        fit="fill"
                      />
                      <el-button
                        slot="reference"
                        type="primary"
                        size="small"
                        plain
                      >扫码支付</el-button>
                    </el-popover>
                    <span
                      v-if="payData.activity.wx.payed"
                      class="suc-color ispay-font"
                    >{{ "已支付" }}</span>
                    <span v-else class="err-color ispay-font">{{
                      "未支付"
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="微信支付金额:">
                    <span class="info-color">{{
                      payData.activity.wx.payed
                        ? payData.activity.wx.money
                        : "0"
                    }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-zhifubao" style="color:#06B4FD" />
                </el-col>
                <el-col :span="12">
                  <el-form-item label="支付宝:" label-width="90px" prop="alipay.money">
                    <el-input
                      v-model="payData.activity.alipay.money"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                    <el-popover placement="right" width="326" trigger="click">
                      <el-image
                        style="width:300px; height:300px"
                        :src="imgUrl"
                        fit="fill"
                      />
                      <el-button
                        slot="reference"
                        type="primary"
                        size="small"
                        plain
                      >扫码支付</el-button>
                    </el-popover>
                    <span
                      v-if="payData.activity.alipay.payed"
                      class="suc-color ispay-font"
                    >{{ "已支付" }}</span>
                    <span v-else class="err-color ispay-font">{{
                      "未支付"
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="支付宝支付金额:">
                    <span class="info-color">{{
                      payData.activity.alipay.payed
                        ? payData.activity.alipay.money
                        : "0"
                    }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-qianbao1" style="color:#F4EA2A" />
                </el-col>
                <el-col :span="22">
                  <el-form-item label="现金:" label-width="90px" prop="cash.money">
                    <el-input
                      v-model="payData.activity.cash.money"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-guanlian" style="color:#6666FE" />
                </el-col>
                <el-col :span="23">
                  <el-form-item label="选择子产业:" label-width="90px" prop="sonIndustry.id">
                    <el-select
                      v-model="payData.activity.sonIndustry.id"
                      class="pay-input"
                      placeholder="请选择子产业"
                    >
                      <el-option
                        v-for="item in sonIndustry"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type"
                      />
                    </el-select>
                    <el-input
                      v-model="payData.activity.sonIndustry.money"
                      style="width:320px"
                      class="pay-input"
                      placeholder="请输入金额"
                      v-limit-num
                    />
                    <!-- <span class="tit-font">剩余子产业订金：</span>
                    <span class="err-color">{{ num }}</span> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background">
                <el-col :span="1" class="iconfont-bar">
                  <i class="iconfont icon-cardb" style="color:#06B4FD" />
                </el-col>
                <el-col :span="22">
                  <el-form-item label="POS单:" label-width="90px">
                    <div class="pos-table">
                      <div class="pos-table-head">
                        <el-button
                          type="primary"
                          class="pos-tool-btn"
                          plain
                          size="small"
                          @click="openPosDialog"
                        >新 增</el-button>
                      </div>
                      <el-table :data="posTable.activity" height="200px" fit>
                        <el-table-column
                          label="POS机类型"
                          align="center"
                          width="150"
                        >
                          <template slot-scope="{ row }">
                            <span>{{ row.type_name }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="POS单据" align="center">
                          <template slot-scope="{ row }">
                            <span>{{ row.detail }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="实际金额"
                          align="center"
                          width="150"
                        >
                          <template slot-scope="{ row }">
                            <span>{{ row.amount }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          align="center"
                          width="120"
                        >
                          <template slot-scope="row">
                            <el-button type="danger" size="mini" @click="handlePosDelete(row.$index)">删 除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-background h68">
                <el-col :span="4">
                  <el-form-item label="充值合计:">
                    <span class="main-color num">{{ payTotal_activity }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="赠送金额:">
                    <span class="info-color num">{{ payData.activity.stored.sendMoney }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="已经充值:">
                    <span class="info-color num">{{ payRecharge_activity }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="money-center">
          <div style="margin-top: 40px;">
            <el-divider content-position="left">
              <span style="color:#895DFE; font-size:18px;">业绩分摊</span>
            </el-divider>

            <div class="pos-table">
              <div class="pos-table-head">
                <el-button
                  type="primary"
                  class="pos-tool-btn"
                  plain
                  size="small"
                  @click="openAchievementDialog"
                >新 增</el-button>
                <el-button
                  type="primary"
                  class="pos-tool-btn"
                  plain
                  size="small"
                  @click="handleCalc"
                >计 算</el-button>
              </div>
              <el-table :data="achieveTable" border fit>
                <el-table-column label="分摊职务" align="center">
                  <template slot-scope="{ row }">
                    <span>{{ row.duties_name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="姓名" align="center">
                  <template slot-scope="{ row }">
                    <span>{{ row.staff_name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="职务" align="center">
                  <template slot-scope="{ row }">
                    <span>{{ row.position_name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="分摊金额" align="center">
                  <template slot-scope="{ row }">
                    <span>{{ row.amount }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="row">
                    <el-button type="danger" size="mini" @click="handleAchieveDelete(row.$index)">删 除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="money-center">
          <div style="margin-top: 40px;">
            <el-divider content-position="left">
              <span style="color:#895DFE; font-size:18px;">备注事项</span>
            </el-divider>
            <el-form style="margin-top: 20px;">
              <el-form-item label="备注:" label-width="50px">
                <el-input
                  v-model="remark"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">保 存</el-button>
      </span>
      <!-- 添加单据信息 -->
      <el-dialog
        title="添加单据信息"
        :visible.sync="dialogPosVisible"
        :before-close="handlePosDialogCancel"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="true"
        width="500px"
      >
        <el-form
          ref="posForm"
          :model="posData"
          :rules="posDataRules"
          label-width="100px"
        >
          <el-form-item label="POS机类型" prop="type">
            <el-select
              v-model="posData.type"
              class="w100"
              placeholder="请选择POS机"
              @change="handlePosDataChange"
            >
              <el-option
                v-for="item in posList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="POS单详情" prop="detail_id">
            <el-select
              v-model="posData.detail_id"
              class="w100"
              placeholder="请选择详情"
              @change="handlePosInfoChange"
            >
              <el-option
                v-for="item in posInfo"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="实际交易额" prop="amount">
            <el-input
              v-model="posData.amount"
              class="w100"
              placeholder="请输入金额"
              v-limit-num
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-col :span="23">
            <el-button @click="handlePosDialogCancel">取 消</el-button>
            <el-button
              type="primary"
              @click="handlePosConfirm"
            >确 定</el-button>
          </el-col>
          <div style="clear:both" />
        </div>
      </el-dialog>

      <!-- 添加业绩分摊信息 -->
      <el-dialog
        title="业绩分摊信息"
        :visible.sync="dialogAchievementVisible"
        :before-close="handleAchievementCancel"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :append-to-body="true"
        width="400px"
      >
        <el-form
          ref="achievementForm"
          :model="achievementData"
          :rules="achieveRules"
          label-width="90px"
        >
          <el-form-item label="分摊职务" prop="duties_id">
            <el-select
              v-model="achievementData.duties_id"
              clearable 
              class="w100"
              placeholder="请选择职务"
              @change="handleDutiesChange"
            >
              <el-option
                v-for="item in dutiesList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="staff_id">
            <el-autocomplete
              v-model="achievementData.staff_name"
              :fetch-suggestions="getStaff"
              placeholder="请输入姓名"
              class="w100"
              @select="handleStaffChange"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="职务" prop="position_name">
            <el-input v-model="achievementData.position_name" placeholder="职务" disabled />
          </el-form-item>
          <el-form-item label="分摊金额" prop="amount">
            <el-input v-model="achievementData.amount" v-limit-num placeholder="请输入金额" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-col :span="23">
            <el-button @click="handleAchievementCancel">取 消</el-button>
            <el-button
              type="primary"
              @click="handleAchievementConfirm"
            >确 定</el-button>
          </el-col>
          <div style="clear:both" />
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
// import elDragDialog from "@/directive/el-drag-dialog";
import {
  gcreate,
  findPOSData,
  findStaff,
  depositCalc,
  confirmStaff,
  create
} from '@/api/ManageSales/FrontMoney/FrontMoneyManage'
export default {
  // directives: { elDragDialog },
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    customerData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      moneyradio: '1',
      moneyType: 'deposit',
      //
      dialogVisible: false,
      customer_id: "",

      sonIndustry: [],
      dutiesList: [], // 分摊职务列表
      staffList: [], // 员工列表
      customerInfo: {
        customer_no: '',
        name: '',
        card_id: '',
        customer_attr_name: '',
        phone: '',
        shop: {
          name: ''
        }
      },
      balanceInfo: {
        deposit: 0,
        deposit_act: 0,
        deposit_ind: 0
      },
      storedActivity: [], // 储值活动list
      promotionChannel: [], // 宣传渠道list
      posList: [],
      posInfo: [],
      posType: {},
      posData: {
        type: '',
        type_name: '',
        detail: '',
        detail_id: '',
        amount: ''
      },
      posLimit: 0,
      posDataRules: {
        type: [{ required: true, message: '请选择POS机', trigger: 'change' }],
        detail_id: [
          { required: true, message: '请选择详情', trigger: 'change' }
        ],
        amount: [{ required: true, message: '请输入金额', trigger: 'blur' }]
      },
      balance: {
        deposit: 0,
        activity: 0
      },
      posTable: {
        deposit: [],
        industry: [],
        activity: []
      },
      payData: {
        deposit: {
          wx: {
            payed: false,
            money: ''
          },
          alipay: {
            payed: false,
            money: ''
          },
          cash: {
            money: ''
          },
          sonIndustry: {
            id: '',
            money: ''
          }
        },
        industry: {
          info: {
            id: '',
            name: ''
          },
          depositMoney: {
            money: '',
            balance: ''
          },
          activityMoney: {
            money: '',
            balance: ''
          },
          wx: {
            payed: false,
            money: ''
          },
          alipay: {
            payed: false,
            money: ''
          },
          cash: {
            money: ''
          },
          sonIndustry: {
            id: '',
            money: ''
          }
        },
        activity: {
          stored: {
            id: '',
            name: '',
            rechargeMoney: 0,
            sendMoney: 0
          },
          channel: {
            value: ''
          },
          depositMoney: {
            money: '',
            balance: ''
          },
          wx: {
            payed: false,
            money: ''
          },
          alipay: {
            payed: false,
            money: ''
          },
          cash: {
            money: ''
          },
          sonIndustry: {
            id: '',
            money: ''
          }
        }
      },

      achieveTable: [],
      achievementData: {
        duties_id: '',
        duties_name: '',
        staff_name: '',
        staff_id: '',
        amount: '',
        position_id: '',
        position_name: ''
      },
      achieveRules: {
        duties_id: [
          { required: true, message: "请选择职务", trigger: "change" }
        ],
        staff_id: [
          { required: true, message: "请选择员工", trigger: "change" }
        ],
        amount: [
          { required: true, message: "请输入分摊金额", trigger: "blur" }
        ]
      },
      achieveDataTable: {
        deposit: [],
        industry: [],
        activity: []
      },

      remark: '',
      remarkData: {
        deposit: "",
        industry: "",
        activity: ""
      },
      staffLoading: false,
      dialogPosVisible: false,
      dialogAchievementVisible: false,
      imgUrl:
        'http://img4.imgtn.bdimg.com/it/u=302619714,1453174966&fm=26&gp=0.jpg'
    }
  },
  computed: {
    // 剩余订金
    remain_deposit() {
      const balance = parseFloat(this.balance.deposit) || 0
      const ind_deposit = parseFloat(this.payData.industry.depositMoney.money) || 0
      const act_deposit = parseFloat(this.payData.activity.depositMoney.money) || 0
      const value = balance - ind_deposit - act_deposit
      return value
    },
    // 剩余活动订金
    remain_activity() {
      const balance = parseFloat(this.balance.activity) || 0
      const value = balance - (parseFloat(this.payData.industry.activityMoney.money) || 0)
      return value
    },
    // 订金 充值合计
    payTotal_deposit() {
      const data = this.payData.deposit
      let total = parseFloat(data.cash.money) || 0
      if (data.wx.payed) {
        total += parseFloat(data.wx.money) || 0
      }
      if (data.alipay.payed) {
        total += parseFloat(data.alipay.money) || 0
      }
      if (data.sonIndustry.id != '') {
        total += parseFloat(data.sonIndustry.money) || 0
      }
      this.posTable.deposit.forEach(item => {
        total += parseFloat(item.amount)
      })
      return total
    },
    // 子产业订金 充值合计
    payTotal_industry() {
      const data = this.payData.industry
      let total = parseFloat(data.cash.money) || 0
      total += parseFloat(data.depositMoney.money) || 0
      total += parseFloat(data.activityMoney.money) || 0
      if (data.wx.payed) {
        total += parseFloat(data.wx.money) || 0
      }
      if (data.alipay.payed) {
        total += parseFloat(data.alipay.money) || 0
      }
      if (data.sonIndustry.id != '') {
        total += parseFloat(data.sonIndustry.money) || 0
      }
      this.posTable.industry.forEach(item => {
        total += parseFloat(item.amount)
      })
      return total
    },
    // 活动订金 已经充值
    payRecharge_activity() {
      const data = this.payData.activity
      let total = parseFloat(data.cash.money) || 0
      total += parseFloat(data.depositMoney.money) || 0
      if (data.wx.payed) {
        total += parseFloat(data.wx.money) || 0
      }
      if (data.alipay.payed) {
        total += parseFloat(data.alipay.money) || 0
      }
      if (data.sonIndustry.id != '') {
        total += parseFloat(data.sonIndustry.money) || 0
      }
      this.posTable.activity.forEach(item => {
        total += parseFloat(item.amount)
      })
      return total
    },
    // 活动订金 充值合计
    payTotal_activity() {
      let total = parseFloat(this.payData.activity.stored.sendMoney) || 0
      total += this.payRecharge_activity

      return total
    },
    payTotal() {
      return (
        this.payTotal_deposit + this.payTotal_industry + this.payTotal_activity
      )
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    customerData(val) {
      if(val) {
        this.customer_id = val.id
        this.getInfo();
      }
    },
    moneyradio(val) {
      if (val == '1') {
        this.moneyType = 'deposit'
        this.achieveTable = this.achieveDataTable.deposit
        this.remark = this.remarkData.deposit
      } else if (val == '2') {
        this.moneyType = 'industry'
        this.achieveTable = this.achieveDataTable.industry
        this.remark = this.remarkData.industry
      } else {
        this.moneyType = 'activity'
        this.achieveTable = this.achieveDataTable.activity
        this.remark = this.remarkData.activity
      }
    },
    remark(val) {
      this.remarkData[this.moneyType] = val
    },
    achieveTable(val) {
      this.achieveDataTable[this.moneyType] = val
    },
    'payData.industry.depositMoney.money'(val, oldVal) {
      if (this.remain_deposit < 0) {
        this.$message.error('剩余订金不足')
        setTimeout(() => {
          this.payData.industry.depositMoney.money = oldVal
        }, 100)
      }
    },
    'payData.activity.depositMoney.money'(val, oldVal) {
      if (this.remain_deposit < 0) {
        this.$message.error('剩余订金不足')
        setTimeout(() => {
          this.payData.activity.depositMoney.money = oldVal
        }, 100)
      }
    },
    'payData.industry.activityMoney.money'(val, oldVal) {
      if (this.remain_activity < 0) {
        this.$message.error('剩余活动订金不足')
        setTimeout(() => {
          this.payData.industry.activityMoney.money = oldVal
        }, 100)
      }
    },
  },
  created() {
    // console.log("4455");
    // console.log(this.value)
    // this.getInfo();
    // this.getStaff();
  },
  methods: {
    handleIndustry(val) {
      const obj = this.sonIndustry.filter(item => item.type == val)
      this.remainSonDeposit = obj[0].amount
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.handleCancel()
        })
        .catch(_ => {})
    },
    handleCancel() {
      this.moneyradio = "1";
      this.$refs.depositForm.resetFields();
      this.$refs.industryForm.resetFields();
      this.$refs.activityForm.resetFields();
      this.payData.deposit.sonIndustry.money = "";
      this.payData.industry.sonIndustry.money = "";
      this.payData.activity.sonIndustry.money = "";
      this.posTable.deposit = [];
      this.posTable.industry = [];
      this.posTable.activity = [];
      this.posType = {};
      this.achieveTable = [];
      this.achieveDataTable.deposit = [];
      this.achieveDataTable.industry = [];
      this.achieveDataTable.activity = [];
      this.payData.activity.stored.sendMoney = "";
      this.remark = "";
      this.remarkData.deposit = "";
      this.remarkData.industry = "";
      this.remarkData.activity = "";
      this.$parent.moneyVisible = false
    },
    handleConfirm() {
      if(this.payTotal == 0) {
        this.$message.error("金额不能为空！")
        return
      }
      if(this.payTotal_industry>0 && this.payData.industry.info.id == "") {
        this.$message.error("子产业订金中，子产业名称不能为空！")
        return
      }
      let achieveErrorTxt = ''
      for(var key in this.achieveDataTable) {
        const data = this.achieveDataTable[key];
        let txt = "订金";
        let total = this["payTotal_"+key];
        if(key == "industry") {
          txt = "子产业订金"
        } else if(key == "activity"){
          txt = "活动订金"
          total = this.payRecharge_activity;
        }
        if(parseFloat(total) >0 && data.length == 0) {
          achieveErrorTxt += '<p style="padding: 4px 0;">'+txt+'中，至少添加一条业绩分摊记录;</p>'
        }
      }
      if(achieveErrorTxt.length > 0) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: achieveErrorTxt,
          type: 'error'
        });
        return
      }
      
      const errorTxt = this.checkedAcieveMoney();
      if(errorTxt.length > 0) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: errorTxt,
          type: 'error'
        });
        return
      }
      
      const params = this.getParams();
      // console.log(JSON.stringify(params));
      create(params).then(res => {
        // console.log(res);
        if(res.code == 200) {
          this.$message.success(res.message);
          setTimeout(() => {
            this.$router.push('/ManageSales/Order/front-money');
          },1000)
        } else {

        }
      }).catch(res => {

      })
    },
    // 校验 业绩分摊金额是否等于充值合计
    checkedAcieveMoney() {
      let errorTxt = "";
      const tableDatas = this.achieveDataTable;
      let checkData = {};
      let checked = {};
      for(var key in tableDatas) {
        checkData[key] = {};
        const datas = tableDatas[key];
        datas.forEach(item => {
          if(checkData[key][item.duties_id]) {
            checkData[key][item.duties_id].amount += (parseFloat(item.amount) || 0)
          } else {
            checkData[key][item.duties_id] = {
              id: item.duties_id,
              name: item.duties_name,
              amount: (parseFloat(item.amount) || 0)
            }
          }
        })
      }
      
      for(var key in checkData) {
        let total = this["payTotal_"+key];
        if(key == "activity") {
          total = this.payRecharge_activity;
        }
        const data = checkData[key];
        checked[key] = false;
        for(var key2 in data) {
          if(data[key2].amount != (parseFloat(total) || 0)) {
            checked[key] = true
          }
        }
      }
      
      for(var key in checked) {
        let txt = "订金"
        if(key == "industry") {
          txt = "子产业订金"
        } else if(key == "activity"){
          txt = "活动订金"
        }
        if(checked[key] == true) {
          errorTxt += '<p style="padding: 4px 0;">'+txt+'中，同一分摊职务的分摊金额合计不等于充值金额，请核对！</p>'
        }
      }
      return errorTxt
    },
    // 获取 提交参数
    getParams() {
      let data = {
        deposit: {},
        industry: {},
        activity: {}
      }

      for(var key in data){
        data[key].total_amount = this["payTotal_"+key];
        data[key].remark = this.remarkData[key];
        data[key].cash = {
          amount: this.payData[key].cash.money,
          list: []
        };
        data[key].wx = {
          amount: (this.payData[key].wx.payed ? this.payData[key].wx.money : 0),
          list: []
        };
        data[key].ali = {
          amount: (this.payData[key].alipay.payed ? this.payData[key].alipay.money : 0),
          list: []
        };
        data[key].deposit_ind = {
          amount: (this.payData[key].sonIndustry.id == "" ? 0 :this.payData[key].sonIndustry.money),
          industry_id: this.payData[key].sonIndustry.id
        }
        data[key].pos = {amount: 0, list: []};
        this.posTable[key].forEach(item => {
          const amount = item.amount;
          const obj = {id: item.detail_id, amount: amount};
          data[key].pos.amount += parseFloat(amount);
          data[key].pos.list.push(obj);
        });
        data[key].performance = [];
        this.achieveDataTable[key].forEach(item => {
          const obj = {
            position_id: item.position_id, 
            staff_id: item.staff_id,
            amount: item.amount,
            per_position_type: item.duties_id
          };
        })
        if(key == "industry") {
          data[key].son_industry = this.payData[key].info.id;
          data[key].deposit = {
            amount: this.payData[key].depositMoney.money,
            list: []
          };
          data[key].deposit_act = {
            amount: this.payData[key].activityMoney.money,
            list: []
          };
        } else if(key == "activity") {
          data[key].deposit = {
            amount: this.payData[key].depositMoney.money,
            list: []
          };
          data[key].dic_stored_activity = this.payData[key].stored.id
          data[key].dic_promotion_channel = this.payData[key].channel.value
        }
      }

      let params = Object.assign({},data);
      params.customer_id = this.customer_id;

      return params
    },

    // 关闭 业绩分摊 dialog
    handleAchievementCancel() {
      this.$refs.achievementForm.clearValidate()
      this.$refs.achievementForm.resetFields()
      this.dialogAchievementVisible = false
      this.staffList = []
    },
    // 业绩分摊 confirm
    handleAchievementConfirm() {
      this.$refs.achievementForm.validate(valid => {
        if(valid) {
          const data = Object.assign({}, this.achievementData)
          this.achieveTable.push(data)
          // this.achieveTable = this.achieveDataTable[this.moneyType]
          this.handleAchievementCancel()
        }
      })
      
    },
    // 打开 业绩分摊 dialog
    openAchievementDialog() {
      this.dialogAchievementVisible = !this.dialogAchievementVisible
    },
    // 分摊职务 change
    handleDutiesChange(val) {
      const obj = (this.dutiesList.filter(item => item.value == val))[0];
      this.achievementData.duties_name = obj.label
      this.achievementData.staff_id = ''
    },
    // 员工姓名change
    handleStaffChange(obj) {
      this.achievementData.staff_id = obj.id;
      const performance_position = parseInt(this.achievementData.duties_id);

      const params = {performance_position: performance_position, staff_id: parseInt(obj.id) }
      confirmStaff(params).then(res => {
        console.log(res);
        if(res.code == 200) {
          const data = res.data;
          if(data.confirm) {
            this.achievementData.staff_name = obj.name;
            this.achievementData.position_id = obj.position.id;
            this.achievementData.position_name = obj.position.name;
          } else {
            this.$message.error("当前员工不符合分摊职务条件，请重新选择！");
            this.achievementData.staff_id = "";
            this.achievementData.staff_name = "";
            this.achievementData.position_id = "";
            this.achievementData.position_name = "";
          }
        }
      }).catch(res => {

      })

      
    },
    // 业绩分摊 删除
    handleAchieveDelete(index) {
      this.$confirm('确认删除该分摊数据？').then(res => {
        this.achieveTable.splice(index, 1)
        // this.achieveTable = this.achieveDataTable[this.moneyType]
        this.$message.success('删除成功！')
      })
      .catch(res => {

      })
    },
    // 业绩分摊 计算
    handleCalc() {
      const amount = this["payTotal_"+this.moneyType];
      // const tableData = this.achieveDataTable[this.moneyType];
      const tableData = this.achieveTable;
      let list = [];
      tableData.forEach(item => {
        const data = {};
        data.staff_id = item.staff_id;
        data.position_id = item.position_id;
        data.per_position_type = item.duties_id
        list.push(data)
      })
      const params = { total_amount: amount, list: list}
      depositCalc(params).then(res => {
        console.log(res)
        if(res.code == 200) {
          const data = res.data;
          tableData.forEach(item => {
            const obj = data.filter(item2 => item.duties_id == item2.per_position_type && item.staff_id == item2.staff_id)[0];
            console.log(obj)
            item.amount = obj.amount
          })
          // this.achieveTable = this.achieveDataTable[this.moneyType]
        } else {
          // this.$message.error(res.message);
        }
      }).catch(res => {
        // this.$message.error(res.message);
      })
      
    },

    // 储值活动change
    handleStoredActivityChange(val) {
      const obj = this.storedActivity.filter(
        item => item.card_package_id == val
      )[0]
      this.payData.activity.stored.name = obj.name
      // this.payData.activity.stored.rechargeMoney = obj.recharge_money
      this.payData.activity.stored.sendMoney = obj.send_money
    },
    // 关闭 pos dialog
    handlePosDialogCancel() {
      this.$refs.posForm.clearValidate()
      this.$refs.posForm.resetFields()
      this.dialogPosVisible = false
    },
    // 打开 pos dialog
    openPosDialog() {
      this.dialogPosVisible = !this.dialogPosVisible
    },
    // pos机类型切换
    handlePosDataChange(val) {
      const name = this.posList.filter(item => item.id == val)[0].name
      this.posData.type_name = name

      this.posData.detail_id = ''
      findPOSData(val)
        .then(res => {
          if (res.code == 200) {
            this.posInfo = []
            const data = res.data
            data.forEach(item => {
              const obj = {}
              obj.id = item.id
              let balance = this.posType[item.id] ? (parseFloat(item.balance)- parseFloat(this.posType[item.id])) : parseFloat(item.balance);
              balance = balance <= 0 ? 0 : balance;
              obj.balance = balance;
              obj.label = balance + '元,编码：' + item.pos_order_id
              this.posInfo.push(obj)
            })
          }
        })
        .catch(res => {})
    },
    // pos单详情切换
    handlePosInfoChange(val) {
      const obj = this.posInfo.filter(item => item.id == val)[0]

      this.posData.detail = obj.label
      this.posLimit = obj.balance
    },
    // pos dialog 确定
    handlePosConfirm() {
      this.$refs.posForm.validate(valid => {
        if (valid) {
          if (parseFloat(this.posData.amount) > parseFloat(this.posLimit)) {
            this.$message.error('输入的金额不能大于' + this.posLimit)
            return
          }
          const data = Object.assign({}, this.posData)
          this.posTable[this.moneyType].push(data)
          this.posType[this.posData.detail_id] = (parseFloat(this.posType[this.posData.detail_id]) || 0) + (parseFloat(this.posData.amount) || 0)
          this.handlePosDialogCancel()
        }
      })
    },
    // 删除pos单
    handlePosDelete(index) {
      this.$confirm('确认删除该条pos数据？').then(res => {
        this.posTable[this.moneyType].splice(index, 1)
        this.$message.success('删除成功！')
      })
        .catch(res => {

        })
    },
    // 获取订金相关信息
    getInfo() {
      const customerId = this.customer_id;
      gcreate(customerId).then(res => {
        if (res.code == 200) {
          const data = res.data
          this.customerInfo = data.customer
          this.balanceInfo = data.balance
          this.sonIndustry = data.dic_son_industry
          this.posList = data.pos
          this.storedActivity = data.stored_activity
          this.promotionChannel = data.dic_promotion_channel
          this.dutiesList = data.performance_position

          this.balance.deposit = data.balance.deposit
          this.balance.activity = data.balance.deposit_act
        }
      }).catch(res => {

      })
    },
    // 获取员工
    getStaff(queryString, cb) {
      const params = {val: queryString, shop_id: 0}
      findStaff(params).then(res => {
        if (res.code == 200) {
          this.staffList = []
          res.data.forEach(item => {
            const obj = Object.assign({}, item);
            obj.value = obj.name;
            this.staffList.push(obj)
          })
          cb(this.staffList)
        } else {
          
        }

      }).catch(res => {
        
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.payment-dialog {
  .pay-input {
    width: 180px;
    margin-right: 10px;
  }
  .ispay-font {
    margin-left: 10px;
  }
  .h68 {
    height: 68px;
  }
  .row-background {
    padding: 16px 0 0 8px;
    margin: 10px 20px;
    border-radius: 4px;
    background-color: #f5f7fa;
    overflow: hidden;
  }
  .iconfont-bar {
    text-align: right;
    line-height: 38px;
    .iconfont {
      font-size: 30px;
    }
  }
  .pos-table {
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    background-color: #fff;
    overflow: hidden;
    .pos-table-head {
      width: 100%;
      border-bottom: 1px solid #dcdfe6;
      .pos-tool-btn {
        width: 80px;
        margin: 10px 16px;
      }
    }
  }
  .pay-total-bar {
    height: 70px;
    margin: 10px 20px;
    border-left: 4px solid #6666fe;
    border-radius: 4px;
    background-color: #f5f7fa;
    text-align: center;
    line-height: 70px;
    font-weight: 700;
    font-size: 16px;
    .right-line {
      border-right: 4px solid #fff;
    }
  }
  .num {
    font-weight: 400;
    font-size: 18px;
  }
  // name xu
  .money-body {
    width: 100%;
    .money-top {
      width: 100%;
      margin-bottom: 40px;
      padding: 0 20px;
      .money-top-1 {
        width: 100%;
        // margin-top: 10px;
        padding: 0 20px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        p {
          font-size: 16px;
          color: #333;
          span:nth-of-type(2) {
            color: #999999;
          }
        }
      }
    }
    //
    .money-center {
      width: 100%;
      padding: 0 20px;
      .money-center-1 {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .money-center-1 > p {
        margin-left: 20px;
        height: 36px;
        line-height: 36px;
        margin: 0;
        width: calc(100% - 308px);
        background: #f5f7fa;
        box-sizing: border-box;
        border-left: 5px #895dfe solid;
        padding: 0 20px;
      }
      .money-center-body-1 {
        margin-top: 20px;
        padding-top: 20px;
        padding-bottom: 10px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        .el-button {
          font-size: 14px;
        }
      }
      .pos-tool-btn {
        font-size: 14px;
      }
    }
  }
}
</style>
