<template>
  <div class="consume-top-container">
    <!-- 顾客信息 -->
    <div class="consume-member">
      <div class="filter-container">
        <div>
          <span class="filter-item tit-font">会员编号&nbsp;</span>
          <el-input
            v-model="memberData.customer_no"
            class="filter-item"
            style="width: 190px;"
            disabled
          />
        </div>
        <div>
          <span class="filter-item tit-font">密码&nbsp;</span>
          <el-input
            v-model="memberData.pay_pwd"
            class="filter-item"
            type="password"
            clearable
            show-password
            style="width: 190px;"
          />
        </div>
        <el-button
          type="primary"
          plain
          class="filter-item order-btn"
          @click="toSales(memberData.id)"
        >转到销售开单</el-button>
      </div>
      <div class="m-form-ly">
        <el-form
          :model="memberData"
          label-width="100px"
          label-position="right"
        >
          <el-col :span="8" class="h50">
            <el-form-item label="会员姓名 :">
              <span class="info-color">{{ memberData.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="h50">
            <el-form-item label="顾客属性 :">
              <span class="info-color">{{ memberData.dic_customer_attr }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="h50">
            <el-form-item label="顾客等级 :">
              <span class="info-color">{{ memberData.dic_customer_grade }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="h50">
            <el-form-item label="手机号码 :">
              <span class="info-color">{{ memberData.phone }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="h50">
            <el-form-item label="出生日期 :">
              <span class="info-color">{{ memberData.birthday | parseTime('{y}-{m}-{d}') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="h50">
            <el-form-item label="积分累计 :">
              <span class="info-color">{{ memberData.integral }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="h50">
            <el-form-item label="订金 :">
              <span class="info-color">{{ memberData.deposit }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="h50">
            <el-form-item label="顾客星级 :">
              <span class="info-color">{{ memberData.dic_customer_star }}</span>
            </el-form-item>
          </el-col>
        </el-form>
        <div style="clear:both" />
      </div>
    </div>

    <!-- 结算明细 -->
    <div class="consume-settlement">
      <div class="detail-wrap">
        <div class="detail-num">
          <i class="iconfont icon-qian2 main-color" />
          <span class="tit-font">财耗金额：</span>
          <span class="err-color">{{ memberData.total }}</span>
        </div>
        <div class="detail-num">
          <i class="iconfont icon-weibiaoti2fuzhi01 main-color" />
          <span class="tit-font">护理积分：</span>
          <span class="suc-color">{{ memberData.integral }}</span>
        </div>
      </div>
      <div class="btn-wrap filter-container">
        <el-button class="filter-item" type="primary" plain>暂 存</el-button>
        <el-button class="filter-item" type="primary" @click="handleSettlement('giveDetail')">结 算</el-button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'InlineEditTable',
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      listQuery: {
        name: ''
      },
      memberData: {}
    }
  },
  watch: {
    value(obj) {
      this.memberData = obj
    }
  },
  created() {},
  methods: {
    toSales(cid) {
      // 转至销售开单
      this.$router.push({
        name: 'sales-order',
        params: {
          type: 'consumptionOrder',
          id: cid
        }
      })
    },
    handleSettlement(type) {
      /**
       * 结算
       * 'settlement' 在父组件中作为结算标识
       * 有变更需要时，要进行同步变更
       */
      this.$emit('submit', 'settlement')
    }
  }
}
</script>

<style lang="scss" scoped>
.consume-top-container {
  display: flex;

  .consume-member{
    width: 700px;
    height: 100%;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

      .filter-container{
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          line-height: 38px;
          box-sizing: border-box;
      }

      .m-form-ly{
          height: 162px;
        border: 1px solid #DCDFE6;
          border-radius: 5px;
          padding-top: 10px;
      }

      .tit-font{
          font-size: 14px;
      }

      .order-btn{
          // margin-left: 10px;
          float: right;
      }

      .h50{
          height: 50px;
      }
  }
  .consume-settlement{
      width: 530px;
      height: 162px;
      align-self: flex-end;
      padding: 20px;
      padding-bottom: 0;
      border: 1px solid #DCDFE6;
      border-radius: 5px;

      .detail-wrap{
          height: 80px;
          background-color: #F8F7FA;
          border-radius: 5px;
          display: flex;
          flex: 1;

          .detail-num{
              height: 100%;
              width: 50%;
              margin-left: -40px;
              line-height: 80px;
              text-align: center;
              font-size: 16px;

              .iconfont{
                  font-size: 18px;
              }
          }
      }

      .btn-wrap{
          margin-top: 10px;
          display: flex;
          justify-content: flex-end;
      }
  }
}
</style>
