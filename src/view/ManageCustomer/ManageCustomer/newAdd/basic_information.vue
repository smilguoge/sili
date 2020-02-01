<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div class='blue'><el-divider content-position="left">基本信息</el-divider></div>
      <div class="table">
        <div class="input">
          <el-form-item label="会员编号">
            <el-input v-model="ruleForm.customer_no" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item label="顾客姓名" prop="name">
            <el-input v-model="ruleForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="出生日期">
            <div class="flex">
              <div class="select">
                <el-select v-model="ruleForm.dic_birthday_type" placeholder="请选择">
                  <el-option
                    v-for="item in options.dic_birthday_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="box">
                <el-date-picker
                  v-model="birthday"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  @change="formtime($event,'birthday')"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="ruleForm.age" disabled />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <div class="flex">
              <div class="tel">
                <el-input v-model="ruleForm.phone" />
              </div>
              <div class="tel">
                <span>{{ ruleForm.is_verify==1?'已验证':'未验证' }}</span>
                <el-button type="danger" size="mini">验证</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="证件号码" prop="identity_card_num">
            <div class="flex">
              <div class="select">
                <el-select v-model="zjtype" placeholder="请选择" @change="cahgetype">
                  <el-option
                    v-for="item in options.cert"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="box">
                <el-input v-model="ruleForm.identity_card_num" autocomplete="off"  />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <div class="radio">
              <el-radio v-model="ruleForm.sex" label="1">男</el-radio>
              <el-radio v-model="ruleForm.sex" label="2">女</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="婚否" prop="pass">
            <div class="radio">
              <el-radio v-model="ruleForm.is_marriage" label="1">已婚</el-radio>
              <el-radio v-model="ruleForm.is_marriage" label="2">未婚</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="联系地址">
            <el-input v-model="ruleForm.address" autocomplete="off" />
          </el-form-item>
        </div>
        <div class="load">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="ruleForm.header_imgurl" :src="ruleForm.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </div>
      </div>
      <div class='blue'> <el-divider content-position="left">详细信息</el-divider> </div>
      <div class="form">
        <el-form-item label="入会日期"  prop="admission_at">
          <el-date-picker
            v-model="admission_at"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
            @change="formtime($event,'admission_at')"
          />
        </el-form-item>
        <el-form-item label="客龄">
          <el-input v-model="ruleForm.admission_age" disabled />
        </el-form-item>
        <el-form-item label="所属美容院">
          <el-input v-model="ruleForm.shop" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="主服务技师" prop="main_service_id">
          <!-- <el-input  v-model="ruleForm.main_service_id" autocomplete="off"></el-input> -->
          <div class="main_box">
            <el-autocomplete
              v-model="main_service_name"
              popper-class="my-autocomplete"
              :fetch-suggestions="main_service_id_querySearch"
              placeholder="请输入内容"
              @select="main_service_id_handleSelect"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon"
                @click="main_service_id_handleIconClick"
              />
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
            </el-autocomplete>
          </div>
        </el-form-item>
        <el-form-item label="副服务技师">
          <!-- <el-input v-model="ruleForm.viceService" autocomplete="off"></el-input> -->
          <div class="main_box">
            <el-autocomplete
              v-model="vice_service_name"
              popper-class="my-autocomplete"
              :fetch-suggestions="vice_service_id_querySearch"
              placeholder="请输入内容"
              @select="vice_service_id_handleSelect"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon"
                @click="vice_service_id_handleIconClick"
              />
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
            </el-autocomplete>
          </div>
        </el-form-item>
        <el-form-item label="进店渠道" prop="dic_comeshop_channel">
          <el-select v-model="ruleForm.dic_comeshop_channel" placeholder="请选择">
            <el-option
              v-for="item in options.dic_comeshop_channel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="体验卡类别" prop="exp_card_cate">
          <el-select v-model="ruleForm.exp_card_cate" placeholder="请选择">
            <el-option
              v-for="item in options.dic_exp_card"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="宣传卡号" prop="promotional_card_number">
          <el-input v-model="ruleForm.promotional_card_number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="宣传员">
          <!-- <el-input v-model="ruleForm.promoter_id" autocomplete="off"></el-input> -->
          <div class="main_box">
            <el-autocomplete
              v-model="promoter_name"
              popper-class="my-autocomplete"
              :fetch-suggestions="promoter_id_querySearch"
              placeholder="请输入内容"
              @select="promoter_id_handleSelect"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon"
                @click="promoter_id_handleIconClick"
              />
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
            </el-autocomplete>
          </div>
        </el-form-item>
        <el-form-item label="宣传员登陆账号">
          <el-input v-model="ruleForm.promoter_account" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="宣传员职务">
          <el-input v-model="promotional_position_name" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="介绍会员">
          <!-- <el-input v-model="ruleForm.introducer" autocomplete="off"></el-input> -->
          <div class="main_box">
            <el-autocomplete
              v-model="introducer_name"
              popper-class="my-autocomplete"
              :fetch-suggestions="introducer_querySearch"
              placeholder="请输入内容"
              @select="introducer_handleSelect"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon"
                @click="introducer_handleIconClick"
              />
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
            </el-autocomplete>
          </div>
        </el-form-item>
        <el-form-item label="介绍会员编号">
          <el-input v-model="introducer_num" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="顾客属性" prop="dic_customer_attr">
          <el-select v-model="ruleForm.dic_customer_attr" placeholder="请选择">
            <el-option
              v-for="item in options.dic_customer_attr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="管理类别" prop="dic_manage_cate">
          <el-select disabled  v-model="ruleForm.dic_manage_cate" placeholder="请选择">
            <el-option
              v-for="item in options.dic_manage_cate"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="微信绑定" prop="pass">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="星级等级">
          <div class="box">
            <div class="big">
              <el-select v-model="ruleForm.dic_customer_star" placeholder="请选择">
                <el-option
                  v-for="item in options.dic_customer_star"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="small">
              <el-select v-model="ruleForm.dic_star_status" placeholder="请选择">
                <el-option
                  v-for="item in options.dic_star_status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="星级开始日期">
          <el-date-picker
            disabled
            v-model="star_start_at"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
            @change="formtime($event,'star_start_at')"
          />
        </el-form-item>
        <el-form-item label="星级结束日期">
          <el-date-picker
            disabled
            v-model="star_end_at"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
            @change="formtime($event,'star_end_at')"
          />
        </el-form-item>
        <el-form-item label="顾客等级">
          <el-select v-model="ruleForm.dic_grade" disabled placeholder="请选择">
            <el-option
              v-for="item in options.dic_customer_grade"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="等级开始日期">
          <el-date-picker
            v-model="value3"
            disabled
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
            @change="formtime($event,'star_end_at')"
          />
        </el-form-item>
        <el-form-item label="等级结束日期">
          <el-date-picker
            v-model="value3"
            disabled
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
            @change="formtime($event,'star_end_at')"
          />
        </el-form-item>
        <el-form-item label="磁卡编号">
          <el-input v-model="ruleForm.card_id" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="顾客状态">
          <el-select v-model="ruleForm.status" disabled placeholder="请选择">
            <el-option
              v-for="item in options.status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="支付密码">
          <div class="box">
            <div :class=" $store.state.isCustomer?'half':'all'">
              <el-input v-model="ruleForm.pay_pwd" autocomplete="off" type="password" disabled />
            </div>
            <div v-if="$store.state.isCustomer" class="half">
              <el-button type="primary" @click="resetPasw">重置</el-button>
              <el-button type="primary">找回</el-button>
            </div>
          </div>
        </el-form-item>
      </div>
      <div class='blue'><el-divider content-position="left">行为信息</el-divider></div>
      <div class="form">
        <el-form-item label="购卡时间">
          <el-date-picker
            v-model="purchase_card_at"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
            @change="formtime($event,'purchase_card_at')"
          />
        </el-form-item>
        <el-form-item label="到店护理时间">
          <el-date-picker
            v-model="attendance_at"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
            @change="formtime($event,'attendance_at')"
          />
        </el-form-item>
      </div>
      <div class='blue'><el-divider content-position="left">其他信息</el-divider></div>
      <el-form-item label="备注">
        <el-input v-model="ruleForm.remark" type="textarea" maxlength="200" />
      </el-form-item>
      <div class="btn" v-if="$store.state.isCustomer">
        <el-button type="primary" @click="save('ruleForm')">销售开单</el-button>
        <el-button type="primary" @click="save('ruleForm')">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </div>
      <div class="btn" v-else>
        <el-button type="primary" @click="open_order('ruleForm')">销售开单</el-button>
        <el-button type="primary" @click="open_order('ruleForm')">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form>
    <!-- 重置支付密码 -->
    <div>
      <el-dialog
      :close-on-click-modal='false'
        class="tanc"
        title="重置支付密码"
        width="30%"
        append-to-body
        :visible.sync="resetPassword"
      >
        <ResetPassword v-if="flag" @hid="hide" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import API from "@/api/ManageCustomer/customerManagementApi";
import ResetPassword from "./resetPassword";
import API_validation from "@/utils/form-validation";
export default {
  name: "BasicInformation",
  components: { ResetPassword },
  data() {
    var check_phone = (rule, value, callback) => {
      const res = API_validation.check_phone(value);
      if (res == "true") {
        callback(new Error("手机号码有误，请重填"));
      } else {
        callback();
      }
    };
    var check_validateId = (rule, value, callback) => {
      let type = this.ruleForm.identity_card_type;
      if (type == 1) {
        const res = API_validation.check_validateId(value);
        console.log(res);
        if (res == "true") {
          callback(new Error("身份证号码错误！"));
        } else {
          this.chage_bsd();
          callback();
        }
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 主服务技术
      main_service_id_restaurants: [],
      main_service_name: "",
      // 副服务技师
      vice_service_id_restaurants: [],
      vice_service_name: "",
      // 介绍会员
      introducer_restaurants: [],
      introducer_name: "",
      // 宣传员
      promoter_id_restaurants: [],
      promoter_name: "",
      options: [],
      promotional_position_name: "",
      value3: "",
      zjtype: null,
      birthday: "",
      admission_at: "",
      attendance_at: "",
      purchase_card_at: "",
      star_end_at: "",
      star_start_at: "",
      introducer_num:'',
      ruleForm: {
        dic_customer_star: 1,
        identity_card_type: 1,
        name: "",
        birthday: "",
        dic_birthday_type: 1,
        phone: "",
        is_verify: "",
        verify_code: "",
        age: "",
        admission_age: "",
        identity_card_num: "",
        address: "",
        admission_at: "",
        is_marriage: "1",
        dic_comeshop_channel: "",
        promoter_id: "",
        introducer_id: "",
        dic_customer_attr: "",
        dic_grade: "",
        card_id: "",
        main_service_id: "",
        vice_service_id: "",
        exp_card_cate: "",
        promoter_account: "",
        dic_manage_cate: 2,
        star_start_at: "",
        star_end_at: "",
        status: 1,
        promotional_card_number: "",
        promotional_position_id: "",
        purchase_card_at: "",
        attendance_at: "",
        header_imgurl: "",
        remark: "",
        sex: "2",
        id: "",
        shop: null,
        dic_star_status: 1,
        mainService: "",
        pay_pwd: "",
        mainService: ""
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: check_phone, trigger: "blur" }
        ],
        sex: [{ required: true, message: "请输选择性别", trigger: "blur" }],
        admission_at: [
          { required: true, message: "请输选择时间", trigger: "change" }
        ],
        main_service_id: [
          { required: true, message: "请输输入技师", trigger: "change" }
        ],
        dic_comeshop_channel: [
          { required: true, message: "请输选择渠道", trigger: "change" }
        ],
        exp_card_cate: [
          { required: true, message: "请输选择类别", trigger: "change" }
        ],
        promotional_card_number: [
          { required: true, message: "请输入卡号", trigger: "blur" }
        ],
        dic_customer_attr: [
          { required: true, message: "请输选择属性", trigger: "change" }
        ],
        dic_manage_cate: [
          { required: true, message: "请输选择类别", trigger: "change" }
        ],
        identity_card_num: [{ validator: check_validateId, trigger: "blur" }]
      },
      resetPassword: false,
      flag: false
    };
  },
  created() {
    // 获取介绍会员
    API.get_customer().then(res => {
      // console.log(res);
      this.introducer_restaurants = res.list;
    });
    // 获取宣传员
    API.get_staff().then(res => {
      this.promoter_id_restaurants = res;
      console.log(res, "ee");
    });
    if (this.$store.state.isCustomer) {
      const id = this.$store.state.isCustomerId;
      API.editInit(id).then(res => {
        this.options = res.dic;
        this.main_service_id_restaurants = res.service_staff;
        this.vice_service_id_restaurants = res.service_staff;
        console.log("修改", res);
        this.ruleForm = res.detail;
        this.ruleForm.dic_birthday_type = parseInt(
          res.detail.dic_birthday_type
        );
        this.ruleForm.dic_comeshop_channel = parseInt(
          res.detail.dic_comeshop_channel
        );
        this.ruleForm.exp_card_cate = parseInt(res.detail.exp_card_cate);
        this.ruleForm.promotional_position_id =
          res.detail.promoter == null ? "" : res.detail.promoter.position_name;
        this.introducer_name =
          res.detail.introducer == null ? "" : res.detail.introducer.name;
        this.ruleForm.shop =
          res.detail.shop == null ? "" : res.detail.shop.name;
        this.vice_service_name =
          res.detail.viceService == null ? "" : res.detail.viceService.name;
        this.ruleForm.dic_customer_attr = parseInt(
          res.detail.dic_customer_attr
        );
        this.ruleForm.dic_manage_cate = parseInt(res.detail.dic_manage_cate);
        this.ruleForm.dic_customer_star = parseInt(
          res.detail.dic_customer_star
        );
        this.zjtype =parseInt(res.detail.identity_card_type);
        // this.zjtype = 
        console.log(this.ruleForm.identity_card_type,this.zjtype )
        this.ruleForm.dic_star_status = parseInt(res.detail.dic_star_status);
        this.birthday = parseInt(res.detail.birthday * 1000);
        this.admission_at = parseInt(res.detail.admission_at * 1000);
        // 客龄
        let is_yaer = new Date().getFullYear() - new Date(this.admission_at).getFullYear();
        console.log(is_yaer,'pp')
        if ( is_yaer == 1 ) {
              let val = new Date().getMonth()+(12 - new Date(this.admission_at).getMonth());
          this.ruleForm.admission_age = val;
          console.log(this.ruleForm.admission_age,'pp')
        } else if(is_yaer > 1) {
           let val = new Date().getMonth()+(12 - new Date(this.admission_at).getMonth())+(12*(is_yaer-1));
          this.ruleForm.admission_age = val;
        }else{
          this.ruleForm.admission_age = new Date().getMonth();
        }
      
        if (res.detail.star_start_at != 0) {
          this.star_start_at = parseInt(res.detail.star_start_at * 1000);
        }
        if (res.detail.star_end_at != 0) {
          this.star_end_at = parseInt(res.detail.star_end_at * 1000);
        }
        if (res.detail.purchase_card_at != 0) {
          this.purchase_card_at = parseInt(res.detail.purchase_card_at * 1000);
        }
        if (res.detail.attendance_at != 0) {
          this.attendance_at = parseInt(res.detail.attendance_at * 1000);
        }
        this.main_service_name = res.detail.mainService.name;

        if (res.detail.birthday) {
          const time = parseInt(res.detail.birthday * 1000);
          const age = new Date().getFullYear() - new Date(time).getFullYear();
          console.log(new Date().getFullYear() - new Date(time).getFullYear());
          this.ruleForm.age = age;
        }

        // this.zjtype = parseInt(res.detail.dic_birthday_type);
        this.ruleForm.status = parseInt(res.detail.status);
        this.promoter_name =
          res.detail.promoter == null ? "" : res.detail.promoter.name;
      });
    } else {
      API.basicInfoInit().then(res => {
        this.options = res.dic;
        console.log("新增", res);
        this.zjtype = 1;
        this.ruleForm.shop = res.shop.name;
        this.main_service_id_restaurants = res.service_staff;
        this.vice_service_id_restaurants = res.service_staff;
        // 当前时间
        let time = new Date().getTime();
            console.log(time)
        this.admission_at= time;
        this.ruleForm.admission_at =parseInt(time/1000);
      });
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 开单
    open_order(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(222);
          API.basicInfo(this.ruleForm).then(res => {
            if (res.code == 200) {
              this.$emit("hid");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 保存
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm.dic_comeshop_channel)
          if(this.ruleForm.dic_comeshop_channel==1){
            console.log(this.introducer_num)
            if(this.introducer_name ==''){
              this.$message({
                message: '介绍会员不能为空!',
                type: 'warning'
              });
              return
            }
          }
          API.edit(this.$store.state.isCustomerId, this.ruleForm).then(res => {
            // console.log(res);
            if (res.code == 200) {
              this.$emit("hid");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 取消
    cancel() {
      this.$emit("hid");
    },

    // 重置密码
    resetPasw() {
      this.resetPassword = true;
      this.flag = true;
    },
    // 关闭重置密码弹窗
    hide() {
      this.resetPassword = false;
      this.flag = false;
    },
    // 时间戳格式化
    formtime(e, el) {
      console.log(e / 1000);
      this.ruleForm[el] = parseInt(e / 1000);

      // 自动显示年龄
      if (el == "birthday") {
        let age = new Date().getFullYear() - new Date(e).getFullYear();
        console.log(new Date().getFullYear() - new Date(e).getFullYear());
        this.ruleForm.age = age;
      }

      // 自动显示客龄
      if (el == "admission_at") {
        let is_yaer = new Date().getFullYear() - new Date(e).getFullYear();
        if ( is_yaer == 1 ) {
              let val = new Date().getMonth()+(12 - new Date(e).getMonth());
          this.ruleForm.admission_age = val;
        } else if(is_yaer > 1) {
           let val = new Date().getMonth()+(12 - new Date(e).getMonth())+(12*(is_yaer-1));
          this.ruleForm.admission_age = val;
        }else{
          this.ruleForm.admission_age = new Date().getMonth();
        }
      }
    },
    //自动生成生日
    chage_bsd(e){
      let type = this.ruleForm.dic_birthday_type;
     if(type==1){
        let year = this.ruleForm.identity_card_num.slice(6,10),
          month = this.ruleForm.identity_card_num.slice(10,12),
          day= this.ruleForm.identity_card_num.slice(12,14),  
          bsd = new Date(year+'/'+month+'/'+day).getTime()
          this.birthday = bsd;
        this.ruleForm.birthday = bsd/1000;
        let age = new Date().getFullYear() - year;
        // console.log(new Date().getFullYear() - new Date(e).getFullYear());
        this.ruleForm.age = age;
     }  
    
    },
    // 主服务技师列表vice_service_id_querySearch
    main_service_id_querySearch(queryString, cb) {
      var restaurants = this.main_service_id_restaurants;
      var results = queryString
        ? restaurants.filter(this.main_service_id_createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    main_service_id_createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    main_service_id_handleSelect(item) {
      console.log(item);
      this.main_service_name = item.name;
      this.ruleForm.main_service_id = item.id;
    },
    main_service_id_handleIconClick(ev) {
      console.log(ev);
    },

    // 副服务技师列表
    vice_service_id_querySearch(queryString, cb) {
      var restaurants = this.vice_service_id_restaurants;
      var results = queryString
        ? restaurants.filter(this.vice_service_id_createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    vice_service_id_createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    vice_service_id_handleSelect(item) {
      console.log(item);
      this.vice_service_name = item.name;
      this.ruleForm.vice_service_id = item.id;
    },
    vice_service_id_handleIconClick(ev) {
      console.log(ev);
    },

    // 介绍会员列表
    introducer_querySearch(queryString, cb) {
      if (queryString) {
        API.get_customer(queryString).then(res => {
          console.log(res);
          const restaurants = res.list;
          cb(restaurants);
        });
      } else {
        cb(this.introducer_restaurants);
      }
    },
    introducer_createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    introducer_handleSelect(item) {
      console.log(item);
      this.introducer_name = item.name;
      this.ruleForm.introducer = item.id;
      this.ruleForm.introducer_id = item.id;
      this.introducer_num = item.customer_no;
    },
    introducer_handleIconClick(ev) {
      console.log(ev);
    },

    // 宣传员列表
    promoter_id_querySearch(queryString, cb) {
      if (queryString) {
        API.get_staff(queryString).then(res => {
          console.log(res, "ffff");
          const restaurants = res;
          cb(restaurants);
        });
      } else {
        cb(this.promoter_id_restaurants);
      }
    },
    promoter_id_createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    promoter_id_handleSelect(item) {
      console.log(item);
      this.promoter_name = item.name;
      this.ruleForm.promoter_id = item.id;
      this.ruleForm.promoter_account = item.code;
      this.ruleForm.promotional_position_id = item.position_id;
      if (item.position != null) {
        this.promotional_position_name = item.position.name;
      }
    },
    promoter_id_handleIconClick(ev) {
      console.log(ev);
    },
    // 证件类型
    cahgetype(e) {
      this.ruleForm.identity_card_num ='';
      this.ruleForm.identity_card_type = e;
    }
  }
};
</script>

<style scoped lang="scss">
.blue {
  .el-divider{
    .el-divider__text.is-left{
    color: #895dfe !important;
    }
  }
}
.table {
display: flex;
    .input {
    width: calc(100% - 240px);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .el-form-item {
    width: 45%;
    &:last-child {
    width: 95%;
    }
    }
    .flex {
    display: flex;
    .select {
    width: 35%;
    }
      .box {
      width: 65%;
        .el-input--medium {
        width: 100% !important;
        }
      }
      .tel {
      width: 55%;
          &:last-child {
          width: 45%;
          margin-left: 10%;
          }
      }
    }
    }
  .load {
  width: 220px;
  margin-left: 20px;
    img {
    width: 100%;
    height: 100%;
    }
  }
}
  .form {
    display: flex;
    flex-wrap: wrap;
    .el-date-editor,
    .el-select {
      width: 100%;
    }
    .el-form-item {
      width: 33%;
      .box {
        display: flex;
        .big {
          width: 60%;
        }
        .small {
          width: 40%;
        }
        .all {
          width: 100%;
        }
        .half {
          width: 45%;
          &:last-child {
            width: 50%;
            display: flex;
            padding-left: 5%;
            // justify-content: space-around;
          }
        }
      }
    }
  }
.btn {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
<style>
.input .el-form-item__label {
  text-align: left !important;
}
.load .el-upload {
  width: 100%;
  display: flex;
  height: 260px;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border: 1px solid #eee;
}
.tanc .el-dialog__body {
  padding: 0 !important;
}
.tanc .el-dialog__body .app-container {
  padding: 0 !important;
}
.main_box .el-autocomplete {
  width: 100%;
}
</style>

