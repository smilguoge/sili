<template>
  <div class="app-container" id='employeeFiles'>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="140px"
      class="demo-ruleForm"
    >
    <div class='blue'><el-divider content-position="left">基本信息</el-divider></div>
    <div class="box">
      <div class="form">
        <el-form-item label="登陆账号">
          <el-input v-model="ruleForm.account" placeholder="只读" disabled />
        </el-form-item>
        <el-form-item label="姓名" required prop="name">
          <el-input v-model="ruleForm.name" maxlength="15" />
        </el-form-item>
        <el-form-item label="性别" required prop="sex">
          <el-select v-model="ruleForm.sex" placeholder="请选择">
            <el-option
              v-for="item in Options.gender"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门/门店"  prop="dept" ref="tree">
          <el-select v-model="dept" popper-class='dept' placeholder="请选择">
            <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value">
               <div id='serch'>
                <el-tree
                  :data="cities[0].data"
                  node-key="id"
                  :default-expanded-keys="[2, 3]"
                  :default-checked-keys="[5]"
                  :props="defaultProps"
                  @node-click	='checkmd'
                  >
                </el-tree>
               </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务" prop="position_id">
          <div class="autocomplete">
            <el-autocomplete
              v-model="position_id"
              popper-class="my-autocomplete"
              :fetch-suggestions="querySearch_position_id"
              placeholder="请输入内容"
              @select="handleSelect_position_id"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon"
                @click="handleIconClick_position_id"
              />
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
            </el-autocomplete>
          </div>
        </el-form-item>
        <el-form-item label="职称">
          <el-select v-model="ruleForm.dic_job_title">
            <el-option
              v-for="item in Options.dic_job_title"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="建档日期" required prop="created_at">
          <el-date-picker
            v-model="created_at"
            type="date"
            format="yyyy-MM-dd"
            value-format="timestamp"
            placeholder="选择日期"
            @change="Format($event,'created_at')"
          />
        </el-form-item>
        <el-form-item label="入职日期" required prop="entry_at">
          <el-date-picker
            v-model="entry_at"
            type="date"
            format="yyyy-MM-dd"
            value-format="timestamp"
            placeholder="选择日期"
            @change="Format($event,'entry_at')"
          />
        </el-form-item>
        <el-form-item label="转正日期">
          <el-date-picker
            v-model="turn_positive_at"
            format="yyyy-MM-dd"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
            @change="Format($event,'turn_positive_at')"
          />
        </el-form-item>
        <el-form-item label="岗龄">
          <el-input v-model="ruleForm.postAge" placeholder="只读" disabled />
        </el-form-item>
        <el-form-item label="工龄：">
          <el-input v-model="ruleForm.workAge" placeholder="只读" disabled />
        </el-form-item>
        <el-form-item label="员工状态">
          <el-select v-model="ruleForm.dic_staff_status" disabled>
            <el-option
              v-for="item in Options.dic_staff_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="招聘渠道" prop="dic_recruitment_channel">
          <el-select v-model="ruleForm.dic_recruitment_channel">
            <el-option
              v-for="item in Options.dic_recruitment_channel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="介绍人">
          <!-- <el-select v-model="ruleForm.introducer_id" @change="selct">
            <el-option
              v-for="item in Options.jsr"
              :key="item.id"
              :label="item.name"
              :value="item.id"

            />
          </el-select>-->
          <div class="autocomplete">
            <el-autocomplete
              v-model="jsr_id"
              popper-class="my-autocomplete"
              :fetch-suggestions="querySearch_jsr"
              placeholder="请输入内容"
              @select="handleSelect_jsr"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon"
                @click="handleIconClick_jsr"
              />
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
            </el-autocomplete>
          </div>
        </el-form-item>
        <el-form-item label="介绍人身份证">
          <el-input v-model="ruleForm.JSRid" placeholder="只读" disabled />
        </el-form-item>
        <el-form-item label="工资卡号">
          <el-input v-model="ruleForm.wage_card_number" placeholder @blur='change_yhk' />
        </el-form-item>
        <el-form-item label="银行名称">
          <el-input v-model="ruleForm.brank_name" placeholder="只读" disabled />
        </el-form-item>
        <el-form-item label="健康证有效期" prop="health_expiration_date">
          <el-date-picker
            v-model="health_expiration_date"
            format="yyyy-MM-dd"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
            @change="Format($event,'health_expiration_date')"
          />
        </el-form-item>
        <el-form-item label="户籍" prop="household_register">
          <el-cascader
            v-model="ruleForm.household_register"
            :options="Options.region"
            :props="props"
            @change="change"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="户口" required prop="registered_residence">
          <el-select v-model="ruleForm.registered_residence">
            <el-option
              v-for="item in Options.registeredResidence"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <div class="type">
            <el-date-picker
              v-model="birthday"
              type="date"
              format="yyyy-MM-dd"
              value-format="timestamp"
              placeholder="选择日期"
              @change="Format($event,'birthday')"
            />
            <el-select v-model="ruleForm.dic_birthday_type">
              <el-option
                v-for="item in Options.dic_birthday_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="ruleForm.age" placeholder="只读" disabled />
        </el-form-item>
        <el-form-item label="证件号码" prop="identity_num">
          <div class="pasw">
            <el-select v-model="ruleForm.document_type" @change='cahgetype'>
              <el-option
                v-for="item in Options.documentType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                />
            </el-select>
            <el-input v-model="ruleForm.identity_num" />
          </div>
        </el-form-item>
        <el-form-item label="手机号码" required prop="phone">
          <el-input v-model="ruleForm.phone	" placeholder maxlength="11" />
        </el-form-item>
        <el-form-item label="联系地址" required prop="address">
          <el-input v-model="ruleForm.address" maxlength="20" />
        </el-form-item>
        <el-form-item label="紧急联系人" required prop="emergency_contact">
          <el-input v-model="ruleForm.emergency_contact" maxlength="10" />
        </el-form-item>
        <el-form-item label="紧急联系人电话" required prop="emergency_phone">
          <el-input v-model="ruleForm.emergency_phone" maxlength="11" />
        </el-form-item>
        <el-form-item label="学历">
          <el-select v-model="ruleForm.dic_education">
            <el-option
              v-for="item in Options.dic_education"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否外派人员">
          <el-radio v-model="ruleForm.is_expatriate" label="1">是</el-radio>
          <el-radio v-model="ruleForm.is_expatriate" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否实习期">
          <el-radio v-model="ruleForm.is_internship" label="1">是</el-radio>
          <el-radio v-model="ruleForm.is_internship" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="操作资格证：">
          <el-radio v-model="ruleForm.is_operate" label="1">有</el-radio>
          <el-radio v-model="ruleForm.is_operate" label="0">无</el-radio>
        </el-form-item>
        <el-form-item label="操作资格到期日期">
          <el-date-picker
            v-model="operate_expire_at"
            format="yyyy-MM-dd"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
            @change="Format($event,'operate_expire_at')"
          />
        </el-form-item>
        <el-form-item label="初始密码">
          <el-input v-model="ruleForm.initpasw" placeholder disabled />
        </el-form-item>
        <!-- <el-form-item label="星级">
          <el-select v-model="ruleForm.dic_star">
            <el-option
              v-for="item in Options.dic_star"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>-->
        <div class="check">
          <el-checkbox
            v-model="Check.pcdl"
            @change="Check.pcdl==true? ruleForm.is_login_pc = 1:ruleForm.is_login_pc = 0"
          >是否PC登录</el-checkbox>
          <el-checkbox
            v-model="Check.appdl"
            @change="Check.appdl==true? ruleForm.is_login_app = 1:ruleForm.is_login_app = 0"
          >是否App登录</el-checkbox>
          <el-checkbox
            v-model="Check.zhty"
            @change="Check.zhty==true? ruleForm.status = 1:ruleForm.status = 0"
          >账户停用</el-checkbox>
          <el-checkbox
            v-model="Check.gly"
            @change="Check.gly==true? ruleForm.is_admin =1:ruleForm.is_admin = 0"
          >系统管理员</el-checkbox>
        </div>
        <div class="change">
          <el-checkbox v-model="Check.jsqh" @change="rolecChange">手机端允许切换角色</el-checkbox>
          <div v-if="Check.isrole">
            <el-checkbox v-model="ruleForm.yg">员工端</el-checkbox>
            <el-checkbox v-model="ruleForm.yz">院长端</el-checkbox>
            <el-checkbox v-model="ruleForm.jl">经理端</el-checkbox>
            <el-checkbox v-model="ruleForm.zg">资管端</el-checkbox>
            <el-checkbox v-model="ruleForm.zj">总监端</el-checkbox>
            <el-checkbox v-model="ruleForm.xcy">宣传员端</el-checkbox>
            <el-checkbox v-model="ruleForm.tkjs">特岗技师端</el-checkbox>
          </div>
        </div>
        <div class="fj">
          上传附件：
          <div>
            <input :v-model="ruleForm.attachment" type="file" multiple>
          </div>
        </div>
        <div class="remark">
          备注：
          <el-input v-model="ruleForm.remark" type="textarea" resize="none" maxlength="2000" />
        </div>
      </div>
      <div id="load">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </div>
    </div>
    </el-form>
    <div class="btn">
      <div v-if="this.$store.state.isEdit">
        <el-button @click='cancel'>取消</el-button>
        <el-button type="primary" @click="sureEdit('ruleForm')">确认</el-button>
      </div>
      <div v-else>
        <el-button @click='cancel'>取消</el-button>
        <el-button type="primary" @click="open_order('ruleForm')" :disabled='is_click'>确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import EmployeeApi from '@/api/ManageHr/EmployeeFiles'
import Edit from '@/api/ManageHr/edit'
import formApi from '@/utils/form-validation'
import API_validation from '@/utils/form-validation'
import BIN from 'bankcardinfo'
const juese = [
  '员工端',
  '院长端',
  '经理端',
  '资管端',
  '总监端',
  '宣传员端',
  '特岗技师端'
]
const way = ['是否APP登录', '账号停用', '系统管理员']
var jsr = []
var posit = []
export default {
  name: 'EmployeeFiles',
  components: {},
  data() {
    var check_phone = (rule, value, callback) => {
      const res = API_validation.check_phone(value)
      if (res == 'true') {
        callback(new Error('手机号码有误，请重填'))
      } else {
        callback()
      }
    }
    var check_validateId = (rule, value, callback) => {
      const type = this.ruleForm.document_type
      if (type == 1) {
        const res = API_validation.check_validateId(value)
        // console.log(res);
        if (res == 'true') {
          callback(new Error('身份证号码错误！'))
        } else {
          this.chage_bsd();
          callback()
        }
      } else {
        callback()
      }
    }
    var checkNumber = (rule, value, callback) => {
      const num = /^\d+$/
      if (!num.test(value)) {
        callback(new Error('只能填写数字'))
      } else {
        callback()
      }
    }

    return {
      cities:[],
      defaultProps: {
        children: 'child',
        label: 'name'
      },



      // 职务
      position_id_restaurants: [],
      position_id: '',
      // 门店
      shop_id_restaurants: [],
      dept: '',
      // 介绍人
      jsr_id: '',
      jsr_restaurants: [],
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请输入性别', trigger: 'blur' }],
        dept: [
          { required: true, message: '请输入所属部门/门店', trigger: 'change' }
          // { validator: checkNumber, trigger: 'blur' }
        ],
        position_id: [
          { required: true, message: '请输入职务', trigger: 'change' }
          // { validator: checkNumber, trigger: "blur" }
        ],
        created_at: [
          { required: true, message: '请输入建档日期', trigger: 'blur' }
        ],
        entry_at: [
          { required: true, message: '请输入入职日期', trigger: 'blur' }
        ],
        dic_recruitment_channel: [
          { required: true, message: '请输入招聘渠道', trigger: 'change' }
        ],
        household_register: [
          { required: true, message: '请输入户籍', trigger: 'change' }
        ],
        registered_residence: [
          { required: true, message: '请输入户口', trigger: 'blur' }
        ],
        health_expiration_date: [
          { required: true, message: '请输入健康证有效期', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '请输入出生日期', trigger: 'blur' }
        ],
        identity_num: [{ validator: check_validateId, trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: check_phone, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入联系地址', trigger: 'blur' }
        ],
        emergency_contact: [
          { required: true, message: '请输入紧急联系人', trigger: 'blur' }
        ],
        emergency_phone: [
          { required: true, message: '请输入紧急联系人电话', trigger: 'blur' },
          { validator: check_phone, trigger: 'blur' }
        ]
      },
      ruleForm: {
        merchant_id: '',
        name: '',
        sex: '',
        dept: null,
        position_id: null,
        dic_job_title: '',
        created_at: '',
        entry_at: '',
        turn_positive_at: 0,
        is_login_app: 0,
        is_login_pc: 0,
        status: 0,
        is_admin: 0,
        dic_staff_status: null,
        dic_recruitment_channel: '',
        introducer_id: '',
        wage_card_number: '',
        brank_name: '',
        health_expiration_date: '',
        household_register: null,
        registered_residence: '',
        dic_birthday_type: '',
        birthday: '',
        phone: '',
        identity_num: '',
        address: '',
        attachment: '',
        remark: '',
        emergency_contact: '',
        emergency_phone: '',
        dic_education: 1,
        dic_star: 0,
        is_expatriate: '1',
        is_operate: '1',
        is_internship: '1',
        is_switch: 0,
        checked: '',
        imageUrl: '',
        workAge: null,
        postAge: null,
        JSRid: '',
        age: '',
        initpasw: '******',
        document_type: '',
        yg: false,
        yz: false,
        jl: false,
        zj: false,
        zg: false,
        xcy: false,
        tkjs: false
      },
      operate_expire_at: '',
      birthday: '',
      health_expiration_date: '',
      turn_positive_at: '',
      entry_at: '',
      created_at: '',
      // 下拉选项
      Options: {},

      // 复选框
      Check: {
        // 手机端角色
        isrole: false,
        // pc登录
        pcdl: false,
        // app登录
        appdl: false,
        // 是否管理员
        gly: false,
        // 状态停用
        zhty: false,
        // 手机切换角色
        jsqh: false
      },
      props: {
        value: 'id',
        label: 'name',
        children: 'child'
      },
      preId: null,
      is_click:false
    }
  },
  created() {
    // 获取职务
    EmployeeApi.get_position().then(res => {
      posit = res
      this.position_id_restaurants = res
    })
    // 获取门店
    EmployeeApi.get_shop().then(res => {
      posit = res
      this.shop_id_restaurants = res
    });
    EmployeeApi.get_department_tree2().then(res=>{
      // console.log(res);

      this.cities=[{data:res}];
    });
    // 初始化下拉列表
    EmployeeApi.get_references().then(res => {
      this.jsr_restaurants = res.data
    })
    const isEdit = this.$store.state.isEdit

    if (isEdit) {
      //  修改
      EmployeeApi.editInfo(this.$store.state.editId).then(res => {
        const arr = res.dic
        arr.jsr = jsr
        res.detail.age = null
        this.Options = res.dic
        this.ruleForm = res.detail
        console.log('修改', this.ruleForm)
        this.birthday = parseInt(res.detail.birthday * 1000)
        this.created_at = parseInt(res.detail.created_at * 1000)
        this.entry_at = parseInt(res.detail.entry_at * 1000)
        this.health_expiration_date = parseInt(
          res.detail.health_expiration_date * 1000
        );
        if(this.jsr_id==''){
          // console.log('空')
          this.ruleForm.introducer_id = ''
        }
        this.jsr_id = res.detail.introducer_name;
        this.turn_positive_at = parseInt(res.detail.turn_positive_at * 1000)
        this.created_at = parseInt(res.detail.created_at * 1000)
        this.position_id = res.detail.position_name
        this.shop_id = res.detail.shop_name
        this.created_at = parseInt(res.detail.created_at * 1000)
        this.ruleForm.sex = parseInt(res.detail.sex)
        this.ruleForm.dic_job_title = parseInt(res.detail.dic_job_title)
        this.ruleForm.dic_staff_status = parseInt(res.detail.dic_staff_status)
        this.ruleForm.dic_recruitment_channel = parseInt(
          res.detail.dic_recruitment_channel
        )
        this.ruleForm.registered_residence = parseInt(
          res.detail.registered_residence
        )
        this.ruleForm.dic_birthday_type = parseInt(
          res.detail.dic_birthday_type
        );
        this.ruleForm.JSRid=res.detail.introducer_identity_num;
        this.Check.pcdl = res.detail.is_login_pc == 1
        this.Check.appdl = res.detail.is_login_app == 1
        this.Check.gly = res.detail.is_admin == 1
        this.Check.zhty = res.detail.status != 1
        this.Check.jsqh = res.detail.is_switch == 1;
        // let obj = JSON.parse(res.detail.dept);
        // console.log(res.detail.dept,222);
        
        if(res.detail.dept.department_name!=''){
          this.dept = res.detail.dept.department_name;
          console.log('部门，2',this.dept,typeof res.detail.dept)
        }else if(res.detail.dept.shop_name!=''){
          this.dept = res.detail.dept.shop_name;
          console.log('门店,2')
        }
        this.ruleForm.dept = JSON.stringify(res.detail.dept);
        // console.log(this.edaitDept);
        this.ruleForm.dic_star = parseInt(res.detail.dic_star)
        this.ruleForm.document_type = parseInt(res.detail.document_type)
        this.ruleForm.household_register = res.detail.household_register
        this.ruleForm.dic_education = parseInt(res.detail.dic_education)
        this.operate_expire_at = res.detail.operate_expire_at * 1000
        this.ruleForm.introducer_id = res.detail.introducer_id;
        BIN.getBankBin(res.detail.wage_card_number)
          .then(res => {
            this.ruleForm.brank_name = res.bankName
            // console.log(res);
          })
          .catch(function(err) {
            // console.log(err)
          })
        // 工龄
        const e = res.detail.entry_at
        const yaer1 = new Date().getFullYear()
        const yaer2 = new Date(e * 1000).getFullYear()
        const month1 = new Date().getMonth()
        const month2 = new Date(e * 1000).getMonth()
        if (yaer1 - yaer2 == 0) {
          // 同年
          this.ruleForm.workAge = month1 - month2
        } else if (yaer1 - yaer2 == 1) {
          // 次年
          this.ruleForm.workAge = month1 + (12 - month2)
        } else {
          // 往年
          this.ruleForm.workAge =
            month1 + (12 - month2) + (yaer1 - yaer2 - 1) * 12
        }
        // 年龄
        const age = res.detail.birthday
        const yaer3 = new Date(age * 1000).getFullYear()
        this.ruleForm.age = yaer1 - yaer3
      })
    } else {
      // 新建
      console.log('新建')
      EmployeeApi.initInfo().then(res => {
        const arr = res.dic
        // console.log(res)
        arr.jsr = jsr
        this.Options = res.dic
        this.ruleForm.sex = 1
        this.ruleForm.dic_job_title = 1
        this.ruleForm.dic_recruitment_channel = 1
        this.ruleForm.registered_residence = 1
        this.ruleForm.dic_birthday_type = 1
        this.ruleForm.document_type = 1
        this.ruleForm.dic_staff_status = 1
      })
    }
  },
  methods: {
    // 选部门
    checkmd(e){
      // console.log(e)
      this.dept = e.name;
      if(e.id.indexOf('d')>-1){
        let val =  {
          "shop_id":0,
          "department_id":e.id
        };
        this.ruleForm.dept = JSON.stringify(val);
      }else{
        let val = {
          "shop_id":e.id,
          "department_id":0
        };
        this.ruleForm.dept = JSON.stringify(val);
      }
    },
    cahgetype(){
      this.ruleForm.identity_num ='';
    },
     //自动生成生日
    chage_bsd(e){
      let type = this.ruleForm.dic_birthday_type;
     if(type==1){
        let year = this.ruleForm.identity_num.slice(6,10),
          month = this.ruleForm.identity_num.slice(10,12),
          day= this.ruleForm.identity_num.slice(12,14),  
          bsd = new Date(year+'/'+month+'/'+day).getTime()
          this.birthday = bsd;
        this.ruleForm.birthday = bsd/1000;
        let age = new Date().getFullYear() - year;
        // console.log(new Date().getFullYear() - new Date(e).getFullYear());
        this.ruleForm.age = age;
     }  
    
    },
    // 图片上传
    handleAvatarSuccess(res, file) {
      this.ruleForm.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 修改确认
    sureEdit(formName) {
      // console.log('修改')
      this.$refs[formName].validate(valid => {
        if (valid) {
          EmployeeApi.edit(this.ruleForm, this.$store.state.editId).then(
            res => {
              // console.log(res);
              if (res.code == '200') {
                this.$store.state.isComponent = false
                this.$emit('close')
                // console.log('g11')
              }
            }
          )
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },

    // 添加确认
    open_order(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log('成功')
          EmployeeApi.newAdd(this.ruleForm).then(res => {
            // console.log(res, 111)
            if (res.code == '200') {
              // 列表请求
              // console.log('成功')
              this.$message({
                message: '恭喜你，新建成功',
                type: 'success'
              });
              // this.$store.state.isComponent = false;
              this.is_click = true;
              this.$emit('change_is_click')
            }
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    cancel(){
      this.$emit('close')
    },
    // 手机角色切换
    rolecChange() {
      this.Check.isrole = !this.Check.isrole
      this.Check.jsqh == true
        ? (this.ruleForm.is_switch = 1)
        : (this.ruleForm.is_switch = 0)
    },

    // 户籍数组转换字符串
    change(e) {
      this.ruleForm.household_register = e
      // console.log(this.ruleForm.household_register)
    },

    // 时间戳
    Format(e, el) {
      this.ruleForm[el] = parseFloat(e / 1000)
      // 工龄
      const yaer1 = new Date().getFullYear()
      const yaer2 = new Date(e).getFullYear()
      const month1 = new Date().getMonth()
      const month2 = new Date(e).getMonth()
      if (el == 'entry_at') {
        if (yaer1 - yaer2 == 0) {
          // 同年
          this.ruleForm.workAge = month1 - month2
        } else if (yaer1 - yaer2 == 1) {
          // 次年
          this.ruleForm.workAge = month1 + (12 - month2)
        } else {
          // 往年
          this.ruleForm.workAge =
            month1 + (12 - month2) + (yaer1 - yaer2 - 1) * 12
        }
      }
      // 年龄
      if (el == 'birthday') {
        const age = yaer1 - yaer2
        this.ruleForm.age = age
      }
    },

    selct(e) {
      // console.log(e, '2222')
    },

    // 门店搜索
    querySearch_shop_id(queryString, cb) {
      var restaurants = this.shop_id_restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter_shop_id(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter_shop_id(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleSelect_shop_id(item) {
      // console.log(item)
      this.shop_id = item.name
      this.ruleForm.shop_id = item.id
    },
    handleIconClick_shop_id(ev) {
      // console.log(ev)
    },

    // 职务搜索
    querySearch_position_id(queryString, cb) {
      var restaurants = this.position_id_restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter_position_id(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter_position_id(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleSelect_position_id(item) {
      // console.log(item)
      this.position_id = item.name
      this.ruleForm.position_id = item.id
    },
    handleIconClick_position_id(ev) {
      // console.log(ev)
    },
    // 介绍人搜索
    querySearch_jsr(queryString, cb) {
      var restaurants = this.jsr_restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter_jsr(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter_jsr(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleSelect_jsr(item) {
      // console.log(item)
      this.jsr_id = item.name;
      this.ruleForm.introducer_id = item.id;
      this.ruleForm.JSRid = item.identity_num;
    },
    handleIconClick_jsr(ev) {
      // console.log(ev)
    },
    // 自动检测卡名
    change_yhk(e){
      // console.log(e);
      if(this.ruleForm.wage_card_number!=''){
           BIN.getBankBin(this.ruleForm.wage_card_number).then(res=>{
             this.ruleForm.brank_name = res.bankName
           })
        }
    }
  }
}
</script>

<style scoped lang="scss">
.blue {
  .el-divider{
    .el-divider__text.is-left{
    color: #895dfe !important;
    }
  }
}
.box {
    display: flex;
    justify-content: space-between;
    .form {
      width: calc(100% - 250px);
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 33%;
        margin-bottom: 20px;
        .el-form-item__content {
          width: 100%;
          .el-date-editor,
          .el-select,
          .el-cascader {
            width: 100%;
          }
          .type {
            display: flex;
            position: relative;
            .el-select--medium {
              width: 90px !important;
              position: absolute;
              top: 0;
              right: 0;
            }
          }
          .pasw {
            display: flex;
            flex-wrap: nowrap;
            .el-select {
              width: 40% !important;
            }
            .el-input {
              width: 60% !important;
            }
          }
        }
      }
      .check {
        width: 50%;
        margin-left: 40px;
        display: flex;
        align-items: center;
        .el-checkbox {
          margin: 0 !important;
        }
      }
      .change {
        width: 50%;
        margin: 20px 0 0;
        margin-left: 40px;
        div {
          border: 1px solid #999;
          display: flex;
          align-items: center;
          padding: 10px;
          .el-checkbox {
            margin: 0 10px 0 0 !important;
          }
        }
      }
      .fj,
      .remark {
        width: 100%;
      }
    }
  }
.btn {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.fj,
.remark {
  margin-left: 40px;
  margin-top: 20px;
  justify-content: initial !important;
}
.remark {
  width: 100% !important;
  display: flex;
  align-items: center;
  .el-textarea {
    width: 80% !important;
  }
}
.autocomplete {
  .el-autocomplete {
    width: 100% !important;
  }
  .my-autocomplete {
    width: 100% !important;
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
}
</style>
<style scoped> 
.dept .el-select-dropdown__item{
  overflow: auto;
  height: 400px !important;
  background: #fff;
}
#load .el-upload {
  width: 216px !important;
  height: 215px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(187, 187, 187, 0.2);
  border-radius: 125px;
}
#load .el-upload .el-icon-plus {
  font-size: 40px;
}
.box .el-form-item .el-form-item__label {
  padding-right: 20px;
  box-sizing: border-box;
}
</style>

