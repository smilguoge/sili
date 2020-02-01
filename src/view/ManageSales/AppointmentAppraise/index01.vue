<template>
  <div class="make-appointment">
    <transition name="bounce">
      <div v-show="drawerVisible" class="make-app-left">
        <Structure ref="Structure" :structure-data="departTree" @handleTree="handleTree" />
      </div>
    </transition>
    <div class="openbtn" @click="openDrawer(drawerVisible)">
      <i :class="drawerVisible==true?'el-icon-caret-left icon':'el-icon-caret-right icon'" />
    </div>
    <!-- 1 -->
    <div class="make-app-body">
      <div class="app-body-top">
        <div class="app-body-app-1">
          <span>门店</span>
          <el-input
            v-model="makeData.make_store"
            readonly
            placeholder="请选择门店"
            size="mini"
            style="width:180px; margin:0 10px;"
            @focus="handleSelectStore"
          />
          <!-- <i slot="suffix" class="el-icon-edit el-input__icon" @click="handleIconClick" />
            <template slot-scope="{ item }">
              <div class="name">{{ item.name }}</div>
          </template>-->
          <!-- </el-autocomplete> -->
          <span>时间</span>
          <el-date-picker
            v-model="bookingForm.sdate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp"
            size="mini"
            style="width:180px; margin:0 10px;"
          />
          <el-button type="primary" size="mini" @click="datainitGet">查询</el-button>
        </div>
        <div class="app-body-app-2">
          <svg-icon icon-class="xuexi" class-name="custom-class" />学习日:
          <span>{{ makeData.make_study }}</span>
        </div>
        <div class="app-body-app-3">
          <span>床位状态:</span>
          <div>
            <svg-icon icon-class="chuang" class-name="custom-class" />
            <span>空闲(13)</span>
          </div>
          <div>
            <svg-icon icon-class="chuang" class-name="custom-class" />
            <span>占用(13)</span>
          </div>
        </div>
      </div>
      <div class="app-body-center">
        <div class="app-body-left">
          <div class="app-body-left-1">当班人员</div>
          <div class="app-body-left-2">
            <p>姓名</p>
            <p>状态</p>
          </div>

          <div class="app-body-left-3">
            <ul v-if="staffList.length>0">
              <li v-for="(item,index) in staffList" :key="index">
                <el-col :span="12">{{ item.staff_name }}</el-col>
                <el-col :span="12" :class="staffColor(item.status_name)">{{ item.status_name }}</el-col>
              </li>
            </ul>
            <div v-else class="no-data">暂无数据</div>
          </div>
        </div>
        <div class="app-body-centre">
          <div class="app-body-centre-1">预约明细</div>
          <div class="app-body-centre-3">
            <div class="status-color1">已约</div>
            <div class="status-color2">护理中</div>
            <div class="status-color3">已结束</div>
            <div class="status-color4">外出会议</div>
          </div>
          <div class="app-body-centre-2">
            <!-- 表格 -->
            <div class="app-body-centre-table">
              <table
                v-if="makeTabledate.length>0"
                onselectstart="return false;"
                class="index-center"
              >
                <thead class="index-thead" @click.stop>
                  <tr>
                    <th>
                      <span>时间</span>
                      <span>员工</span>
                    </th>
                    <th
                      v-for="(item,index) in makeTabledate"
                      :key="item.index"
                      @click="handleTransverse(index)"
                    >{{ item.time }}</th>
                  </tr>
                </thead>
                <tbody id="tb" v-menus class="tb index-tbody" @click.stop>
                  <tr v-for="item in makeTabledata" :key="item.index">
                    <td style="pointer-events:none;">
                      <p>{{ item.staff_name }}</p>
                      <p>{{ item.position_name }}</p>
                    </td>
                    <td
                      v-for="(itemChild,indexChild) in item.list"
                      :key="indexChild"
                      :data-item="JSON.stringify(makeTabledate[indexChild])"
                      :data-id="item.staff_id"
                      :data-staff-name="item.staff_name"
                      :data-status="itemChild.status"
                      :data-booking="itemChild.status==2||itemChild.status==4?JSON.stringify(itemChild.booking):''"
                      :class="setColor(itemChild.status,itemChild.status==2?itemChild.booking:'')"
                    >
                      <!-- <span
                        v-if="Object.keys(item.list[1]).length == 4"
                      >{{ item.list[1].booking[1].customer_name }}</span>-->
                      <template v-if="itemChild.status==2">
                        <p
                          v-for="itemBooking in itemChild.booking"
                          :key="itemBooking.id"
                        >{{ itemBooking.customer_name }}-{{ itemBooking.nursing_status_name }}</p>
                      </template>
                      <template v-else>
                        <p
                          v-if="itemChild.status==4||itemChild.status==5"
                        >{{ itemChild.status_name }}</p>
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="no-data">暂无数据</div>
            </div>
          </div>
        </div>
        <div
          v-show="menuShow"
          class="xuanze"
          :style="{'left': menuLeft, 'top': menuTop}"
          onselectstart="return false;"
          @click.stop
        >
          <div
            v-for="(item,index) in menulist"
            :key="index"
            :class="{noselect:!item.state}"
            @click="handleMuen(index)"
          >{{ item.name }}</div>
        </div>
        <div class="app-body-right">
          <div class="app-body-right-1">待处理预约（{{ bookingCustomerList.length }}）</div>
          <el-table :data="bookingCustomerList" height="calc(100% - 55px)">
            <el-table-column label="日期">{{ makeData.date }}</el-table-column>
            <el-table-column prop="customer_name" label="姓名" />
            <el-table-column prop="address" label="预约时间">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.booking_start_at }}</span>~
                <span style="margin-left: 10px">{{ scope.row.booking_end_at }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="pendingappo(scope.row.id)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div @click.stop>
      <el-dialog :title="textMap[dialogTitle1]" width="70%" :visible.sync="outerVisible" center>
        <el-dialog center width="30%" title="服务技师选择" :visible.sync="innerVisible" append-to-body>
          <div>预约时间段：{{ booking_date | parseTime('{y}-{m}-{d}') }} {{ startime }}-{{ endtime }}</div>
          <div class="yypsty6">
            <div class="yypsty4">
              <span>选择技师</span>
              <el-button type="primary" plain @click="addstafinf">增加</el-button>
              <el-button type="primary" plain @click="delestafinf">删除</el-button>
            </div>
            <el-table
              ref="multipleTable"
              :data="stadatainf.staffData"
              tooltip-effect="dark"
              border
              style="width: 100%"
              @selection-change="handleSelec1"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="服务技师" width="120">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.staff_id"
                    placeholder="请技师"
                    style="width: 90px"
                    @change="getname($event,scope.row)"
                  >
                    <el-option
                      v-for="item in technitian"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="预约时间" width="auto">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.start_at" placeholder="请开始时间" style="width: 90px">
                    <el-option
                      v-for="item in timeSlot"
                      :key="item.timeStamp"
                      :label="item.time"
                      :value="item.timeStamp"
                    />
                  </el-select>
                  <span>-</span>
                  <el-select v-model="scope.row.end_at" placeholder="请结束时间" style="width: 90px">
                    <el-option
                      v-for="item in timeSlot"
                      :key="item.timeStamp"
                      :label="item.time"
                      :value="item.timeStamp"
                    />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="yypsty5">
            <el-button @click="canclestafinf">取消</el-button>
            <el-button type="primary" @click="definestafinf">确定</el-button>
          </div>
        </el-dialog>
        <el-dialog center width="60%" title="项目增加" :visible.sync="innerVisible3" append-to-body>
          <div class="yypsty7">
            <el-input v-model="checkprof" placeholder="请输入内容" clearable style="150px;" />
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="getproinflist"
            >查询</el-button>
          </div>
          <el-scrollbar class="scroll-ly2 psconte2" style="height: 45vh">
            <el-table
              ref="multipleTable2"
              :data="tempproinf"
              border
              @selection-change="handleSelect2"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="项目名字" width="auto" prop="project_name" align="center" />
              <el-table-column prop="project_num" label="项目次数" width="120" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.project_num" placeholder="次数" />
                </template>
              </el-table-column>
              <el-table-column prop="remain_quantity" label="剩余次数" width="80" align="center" />
              <el-table-column prop="consume_money" label="单财" width="90" align="center" />
              <el-table-column prop="saleState" label="是否购买" width="80" align="center" />
            </el-table>
          </el-scrollbar>
          <div slot="footer" class="dialog-footer">
            <el-button @click="canclemoreinf">取消</el-button>
            <el-button type="primary" @click="checkmoreinf">确定</el-button>
          </div>
        </el-dialog>
        <div class="yycont1">
          <div class="yycont2">
            <div class="yypsty2">基本信息</div>
            <el-form ref="form" label-width="80px" :data="stadatainf">
              <el-form-item label="顾客名字" class="yypsty8">
                <el-select
                  v-model="stadatainf.customer_id"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="getcomterlist"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in listcustomr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="预约方式" class="yypsty8">
                <el-select
                  v-model="stadatainf.dic_booking_mode"
                  clearable
                  class="filter-item"
                  style="width: 120px"
                  placeholder="预约方式"
                >
                  <el-option
                    v-for="item in dic_booking_mode"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="预约时间" class="yypsty8">
                <el-col :span="24">
                  <el-date-picker
                    v-model="bookingDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 140px"
                    value-format="timestamp"
                  />
                  <el-select
                    v-model="stadatainf.booking_start_at"
                    placeholder="请开始时间"
                    style="width: 90px"
                    class="yypsty1"
                    @change="gethmchange1"
                  >
                    <el-option
                      v-for="item in timeSlot"
                      :key="item.timeStamp"
                      :label="item.time"
                      :value="item.timeStamp"
                    />
                  </el-select>
                  <span>-</span>
                  <el-select
                    v-model="stadatainf.booking_end_at"
                    placeholder="请结束时间"
                    style="width: 90px"
                    class="yypsty1"
                    @change="gethmchange2"
                  >
                    <el-option
                      v-for="item in timeSlot"
                      :key="item.timeStamp"
                      :label="item.time"
                      :value="item.timeStamp"
                    />
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="预约技师" prop="jishi" class="yypsty8">
                <el-button class="yybtn1" type="primary" plain @click="editStaff">编辑</el-button>
                <el-table :data="stadatainf.staffData" border>
                  <el-table-column prop="staff_name" label="技师" align="center" width="150" />
                  <el-table-column label="时间" align="center" width="auto">
                    <template
                      slot-scope="scope"
                    >{{ gethm(scope.row.start_at) }}-{{ gethm(scope.row.end_at) }}</template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item>
                备注：
                <el-input v-model="stadatainf.remark" placeholder="请输入备注" />
              </el-form-item>
            </el-form>
          </div>
          <div class="yycont3">
            <div class="yypsty3">
              <span class="yypsty8">预约明细</span>
              <el-button type="primary" plain @click="addproinf">增加</el-button>
              <el-button type="primary" plain @click="deleproinf">删除</el-button>
            </div>
            <el-table
              ref="multipleTable"
              :data="stadatainf.projectData"
              tooltip-effect="dark"
              border
              style="width: 100%"
              @selection-change="handleSelect3"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="项目名称" width="auto">
                <template slot-scope="scope">{{ scope.row.project_name }}</template>
              </el-table-column>
              <el-table-column prop="staff_id" label="技师" width="120">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.staff_id"
                    placeholder="请选择技师"
                    style="width: 90px"
                    @change="changestaff(scope.row.staff_id)"
                  >
                    <el-option
                      v-for="item in technitian"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="resetappo">重置</el-button>
          <el-button v-show="dialogTitle1==='create'" type="primary" @click="createsub()">确定</el-button>
          <el-button v-show="dialogTitle1==='update'" type="primary" @click="updatesub()">确定</el-button>
          <el-button v-show="dialogTitle1==='pending'" type="primary" @click="pendingsub()">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-if="selectCustomerVisible"
        v-menus
        title="选择顾客"
        :visible.sync="selectCustomerVisible"
        center
      >
        <el-radio
          v-for="item in JSON.parse(data_arr[0].booking)"
          :key="item.id"
          v-model="selectCustomerRadio"
          :label="item.id"
        >{{ item.customer_name }}</el-radio>
        <div slot="footer" class="dialog-footer">
          <el-button @click="selectCustomerVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSelectCustomer">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Structure from "@/component/Structure/index";
import {
  makeAppGet,
  getBookingNursing,
  deleteBookingDelete,
  postBookingMeeting,
  postBookingCancel,
  getCreateinf,
  getUpdateinf,
  getStaffs,
  getProduct,
  getCustomer,
  createBook,
  updateBook
} from "@/api/ManageSales/AppointmentAppraise";
// import { makeAppTableIn } from "./makeApp.js";
import { getDepartList } from "@/api/BaseModule/SetManage";
export default {
  name: "MakeAppointment",
  components: {
    Structure
  },
  directives: {
    menus: {
      inserted: function(el, binding, vnode) {
        // 获取vue实例对象
        const vm = vnode.context;
        let showFlag = true;
        vnode = vnode.elm;
        // 阻止默认浏览器的右键菜单
        el.oncontextmenu = event => {
          event.preventDefault();
        };
        el.onmouseup = event => {
          if (event.button == 2) {
            vm.muenRule();
            showFlag = false;
            const realTop = document.body.clientHeight;
            let top = event.pageY;
            if (realTop - top < 300) {
              top = top - 300;
            }
            const left = event.pageX + 5 + "px";
            vm.menuLeft = left;
            vm.menuTop = top + "px";
          }
          // 判断
          if (showFlag) {
            vm.menuShow = false;
          }
          showFlag = true;
        };
        document.onmouseup = () => {};
        document.getElementById("tb").addEventListener("wheel", myFunction);
        function myFunction() {
          vm.menuShow = false;
          showFlag = true;
        }
      }
    }
  },
  data() {
    return {
      listindex: [],
      dialogTitlestate: true,
      addproinffirst: true,
      id: "12",
      shop_id: "16",
      bookingDate: "",
      loading: false,
      listcustomq: {
        keyword: "",
        page: 1,
        page_size: 60
      },
      listcustomr: [],
      term_type: "",
      checkstralist: [],
      tempcheckprof: [],
      checkprof: "",
      proinflist: [],
      tempproinf: [],
      restaurants: [],
      state: "",
      productlist: [],
      dialogTitle1: "",
      textMap: {
        update: "编辑预约",
        create: "新增预约",
        pending: "待处理预约"
      },
      tempstaffData: [],
      checkstaff: [],
      startime: "",
      endtime: "",
      booking_date: "",
      dic_booking_mode: [],
      timeSlot: [],
      technitian: [],
      stadatainf: {
        shop_id: 12,
        customer_id: "",
        dic_booking_mode: "",
        booking_date: "",
        booking_start_at: "",
        booking_end_at: "",
        remark: "",
        staffData: [],
        projectData: []
      },
      outerVisible: false,
      innerVisible: false,
      innerVisible1: false,
      innerVisible2: false,
      innerVisible3: false,
      makeData: {
        make_store: "",
        make_study: "",
        date: ""
      },
      bookingForm: {
        shop_id: "",
        sdate: ""
      },
      makeTabledata: [],
      makeTabledate: [],
      staffList: [], // 当班人员
      bookingCustomerList: [], // 待处理预约
      // 选中数据
      data_arr: [],
      // 自定义属性
      menuShow: false,
      menuLeft: 0,
      menuTop: 0,
      // 组织结构
      departTree: [],
      drawerVisible: false,
      // 右键菜单选项
      menulist: [
        { name: "新增预约", state: false },
        { name: "开始护理", state: false },
        { name: "修改预约", state: false },
        { name: "取消预约", state: false },
        { name: "结账开单", state: false },
        { name: "外出会议", state: false },
        { name: "取消外出会议", state: false }
      ],
      formData: [],
      checkinput: "",
      tempproinf: "",
      selectCustomerVisible: false,
      selectCustomerRadio: "" // 一个时间端多个顾客时 所选的其中一个
    };
  },
  watch: {
    outerVisible(val) {
      if (val == false) {
        this.formData = [];
      }
      console.log(val, this.formData);
    }
  },
  created() {
    this.bookingForm.sdate = new Date().setHours(0, 0, 0, 0);
    this.getTree();
    this.getcomterlist();
    let _this = this;
    // setInterval(function(){
    //   _this.datainitGet()
    // },60000)
  },
  methods: {
    getTree() {
      getDepartList().then(res => {
        this.departTree = res.data;
        // this.departTree[0].child[0].child[0].child[0].child[0].child.splice(0,1)
        // this.departTree[0].child.splice(0,1)
        this.setStore(this.departTree);
      });
    },
    // 第一个门店
    setStore(list) {
      for (let i in list) {
        if (JSON.stringify(list[i]).indexOf('"type":2') >= 0) {
          if (list[i].child == undefined && list[i].type == 2) {
            this.bookingForm.shop_id = 16; //list[i].id
            this.makeData.make_store = list[i].name;
            this.datainitGet();
            return;
          } else {
            this.setStore(list[i].child);
          }
          return;
        }
      }
    },
    openDrawer(val) {
      this.drawerVisible = !val;
    },
    handleTree(id, name, item) {
      if (item.type == 1) {
        return;
      }
      this.bookingForm.shop_id = id;
      this.makeData.make_store = name;
    },
    getcomter(value) {
      console.log(value);
    },
    // 状态
    setColor(status, booking) {
      let color;
      if (status == 1) {
        color = "booking-color" + 6;
      } else if (status == 2) {
        if (JSON.stringify(booking).indexOf('"nursing_status":"1"') >= 0) {
          return (color = "booking-color" + 1);
        } else if (
          JSON.stringify(booking).indexOf('"nursing_status":"2"') >= 0
        ) {
          return (color = "booking-color" + 2);
        } else if (
          JSON.stringify(booking).indexOf('"nursing_status":"3"') >= 0
        ) {
          return (color = "booking-color" + 3);
        }
      } else if (status == 4) {
        color = "booking-color" + status;
      } else if (status == 5) {
        color = "booking-color" + status;
      }
      return color;
    },
    staffColor(type) {
      let color;
      if (type == "空闲中") {
        color = "staff-color2";
      } else {
        color = "staff-color1";
      }
      return color;
    },
    // 选择表格
    makeTableinit() {
      var _vm = this;
      var mouse_begin = { x: 0, y: 0 };
      var mouse_end = { x: 0, y: 0 };
      $(function() {
        init();
        $("body").click(function() {
          $(".tb td").removeClass("td_bg"); // 点击表格之外的部分，清空所有选中
          _vm.menuShow = false;
          _vm.data_arr = [];
        });
      });

      function init() {
        mouseDown();
      }

      function mouseDown() {
        $(".tb td").mousedown(function(e) {
          if (e.which == 1) {
            mouseUp();
            e.stopPropagation(); // 阻止继承父元素document的mousedown事件
            mouse_begin = {
              x: $(this)
                .parent()
                .parent()
                .find("tr")
                .index($(this).parent()[0]),
              y: $(this)
                .parent()
                .find("td")
                .index($(this)[0])
            };
            $(".tb td").removeClass("td_bg"); // 清空所有选中
            $(this).addClass("td_bg");
            const data = $(this);
            _vm.data_arr = [];
            _vm.data_arr.push({
              id: data.attr("data-id"),
              staff: data.attr("data-staff-name"),
              time: data.attr("data-item"),
              status: data.attr("data-status"),
              booking: data.attr("data-booking"),
              date: _vm.bookingForm.sdate
            });
            console.log(1, _vm.data_arr);
            mouseMove();
          } else {
            return false;
          }
        });
      }

      function mouseMove() {
        $(".tb td").mouseover(function() {
          $(".tb td").removeClass("td_bg"); // 清空所有选中
          mouse_end = {
            x: $(this)
              .parent()
              .parent()
              .find("tr")
              .index($(this).parent()[0]),
            y: $(this)
              .parent()
              .find("td")
              .index($(this)[0])
          };
          var maxX = mouse_begin.x < mouse_end.x ? mouse_end.x : mouse_begin.x;
          var minX = mouse_begin.x < mouse_end.x ? mouse_begin.x : mouse_end.x;
          var maxY = mouse_begin.y < mouse_end.y ? mouse_end.y : mouse_begin.y;
          var minY = mouse_begin.y < mouse_end.y ? mouse_begin.y : mouse_end.y;
          _vm.data_arr = [];
          for (var i = minX; i <= maxX; i++) {
            for (var j = minY; j <= maxY; j++) {
              $(".tb tr:eq(" + i + ") td:eq(" + j + ")").addClass("td_bg");
              const data = $(".tb tr:eq(" + i + ") td:eq(" + j + ")");
              _vm.data_arr.push({
                id: data.attr("data-id"),
                staff: data.attr("data-staff-name"),
                time: data.attr("data-item"),
                status: data.attr("data-status"),
                booking: data.attr("data-booking"),
                date: _vm.bookingForm.sdate
              });
              console.log(2, _vm.data_arr);
            }
          }
          // $(this).addClass('td_bg');
        });
      }
      //  清除已有的样式
      function mouseUp() {
        $("body").mouseup(function() {
          $(".tb td").unbind("mouseover");
        });
      }
    },
    // 横向选中
    handleTransverse(index) {
      this.menuShow = false;
      this.data_arr = [];
      $(".tb tr td").removeClass("td_bg");
      var _this = this;
      $(".tb tr").each(function() {
        $(this)
          .find("td")
          .eq(index + 1)
          .addClass("td_bg");
        const data = $(this)
          .find("td")
          .eq(index + 1);
        _this.data_arr.push({
          id: data.attr("data-id"),
          staff: data.attr("data-staff-name"),
          time: data.attr("data-item"),
          status: data.attr("data-status"),
          booking: data.attr("data-booking"),
          date: _this.bookingForm.sdate
        });
      });
      console.log(_this.data_arr);
    },
    // 右击表格 菜单可点击规则
    muenRule() {
      if (this.data_arr.length == 0) {
        this.$message.warning("请选择时间段");
        return false;
      }

      for (const i in this.menulist) {
        this.menulist[i].state = false;
      }
      for (const i in this.data_arr) {
        // 未排版
        if (this.data_arr[0].status == 1) {
          for (const i in this.menulist) {
            this.menulist[i].state = false;
          }
          return false;
        }
        // 不同状态不能多选 除空闲
        if (
          !this.data_arr.every(item => item.status === this.data_arr[i].status)
        ) {
          for (const i in this.menulist) {
            this.menulist[i].state = false;
          }
          return false;
        }
        // 不为空闲或外出时 横向选择 不能多选
        if (
          this.data_arr[0].status == 1 ||
          this.data_arr[0].status == 2 ||
          this.data_arr[0].status == 5
        ) {
          if (!this.data_arr.every(item => item.id === this.data_arr[i].id)) {
            for (const i in this.menulist) {
              this.menulist[i].state = false;
            }
            return false;
          }
        }
        // 预约状态时 不能多选
        if (this.data_arr[0].status == 2) {
          if (
            !this.data_arr.every(item => item.time === this.data_arr[i].time)
          ) {
            for (const i in this.menulist) {
              this.menulist[i].state = false;
            }
            return false;
          }
        }
        if (this.data_arr[0].booking != "") {
          const currentObj = JSON.parse(this.data_arr[0].booking);
          const num = [];
          for (const i in currentObj) {
            num.push(currentObj[i].id);
          }
          if (num.length > 1) {
            this.selectCustomerVisible = true;
            this.selectCustomerRadio = "";
          } else {
            this.menuShow = true;
          }
        } else {
          this.menuShow = true;
        }

        if (this.data_arr[i].status == 1 || this.data_arr[i].status == 3) {
          this.menulist[0].state = true;
          this.menulist[5].state = true;
        } else if (this.data_arr[i].status == 2) {
          const currentObj = JSON.parse(this.data_arr[i].booking);
          for (const i in currentObj) {
            if (currentObj[i].nursing_status == 1) {
              this.menulist[1].state = true;
              this.menulist[2].state = true;
              this.menulist[3].state = true;
            } else if (currentObj[i].nursing_status == 2) {
              this.menulist[4].state = true;
            }
          }
        } else if (this.data_arr[i].status == 4) {
          this.menulist[6].state = true;
        }
      }
    },
    // 顾客选择后
    confirmSelectCustomer() {
      if (this.selectCustomerRadio == "") {
        return;
      }
      for (const i in JSON.parse(this.data_arr[0].booking)) {
        if (
          JSON.parse(this.data_arr[0].booking)[i].id == this.selectCustomerRadio
        ) {
          this.selectCustomerVisible = false;
          this.data_arr[0].booking =
            '{"' +
            i +
            '":' +
            JSON.stringify(JSON.parse(this.data_arr[0].booking)[i]) +
            "}";
          this.muenRule();
          return;
        }
      }
    },
    // 查看查询时间和技师
    getStaffTime() {
      console.log(this.formData);
      const length = this.formData.length;
      this.bookingDate = this.formData[0].date;
      this.booking_date = this.formData[0].date;
      const str1 = this.formData[0].time;
      const str2 = this.formData[length - 1].time;
      const start = str1.indexOf(":");
      const end = str2.indexOf(",");
      const startTime = (str1.slice(start + 1, end) - 1800).toString();
      const endTime = str2.slice(start + 1, end);
      this.stadatainf.booking_start_at = startTime;
      this.stadatainf.booking_end_at = endTime;
      const data = {
        staff_id: this.formData[0].id,
        start_at: startTime,
        end_at: endTime,
        staff_name: this.formData[0].staff
      };
      this.startime = this.gethm(startTime);
      this.endtime = this.gethm(endTime);
      this.stadatainf.staffData = [];
      this.stadatainf.staffData.push(data);
      console.log(data);
    },
    // 点击菜单操作
    handleMuen(type) {
      this.formData = this.data_arr;
      console.log(111, this.formData);
      this.menuShow = false;
      // 0新增预约,1开始护理,2修改预约,3取消预约,4结账开单,5外出会议,6取消外出会议,
      if (type == 0) {
        this.createappo();
      } else if (type == 2) {
        this.updateappo();
      } else if (type == 1 || type == 3 || type == 4) {
        this.handleMuenClick(type);
      } else if (type == 5 || type == 6) {
        this.handleMeeting(type);
      }
    },
    handleMuenClick(type) {
      const currentObj = JSON.parse(this.formData[0].booking);
      console.log(33333333, currentObj);
      let currentId, currentName, tipsName, apiUrl;
      for (const i in currentObj) {
        currentId = currentObj[i].id;
        currentName = currentObj[i].customer_name;
      }
      const data = {
        id: currentId
      };
      if (type == 1) {
        apiUrl = getBookingNursing;
        tipsName = currentName + " 开始护理";
      } else if (type == 3) {
        apiUrl = deleteBookingDelete;
        tipsName = currentName + " 取消预约";
      } else if (type == 4) {
        tipsName = currentName + " 结账开单";
        this.$confirm("确认为 " + tipsName + "吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true
        })
          .then(() => {
            this.$router.push({
              name: "consumption-order",
              params: {
                type: "booking",
                id: currentId
              }
            });
          })
          .catch(() => {});
        return;
      }
      this.$confirm("确认为 " + tipsName + "吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          apiUrl(data).then(res => {
            if (res.code == 200) {
              this.datainitGet();
              this.$message({
                type: "success",
                message: tipsName + "成功"
              });
            }
          });
        })
        .catch(() => {});
    },
    handleMeeting(type) {
      const meetingId = [];
      const cancelId = [];
      let currentName = "";
      let currentNames = [];
      let tipsName;
      let apiUrl;

      const startTime = JSON.parse(this.formData[0].time).timeStamp - 1800;
      const endTime = JSON.parse(this.formData[this.formData.length - 1].time)
        .timeStamp;
      for (const i in this.formData) {
        meetingId.push(this.formData[i].id);
        currentNames.push(this.formData[i].staff);
      }
      currentNames = Array.from(new Set(currentNames));
      for (const i in currentNames) {
        currentName = currentName + currentNames[i] + " ";
      }
      const data = {
        shop_id: this.bookingForm.shop_id,
        staff_id: Array.from(new Set(meetingId)),
        booking_date: this.bookingForm.sdate / 1000,
        booking_start_at: startTime,
        booking_end_at: endTime
      };
      if (type == 5) {
        apiUrl = postBookingMeeting;
        tipsName = "外出开会";
      } else if (type == 6) {
        apiUrl = postBookingCancel;
        const currentObj = JSON.parse(this.formData[0].booking);

        for (const i in this.formData) {
          for (const j in JSON.parse(this.formData[i].booking)) {
            cancelId.push(JSON.parse(this.formData[i].booking)[j].id);
          }
        }

        data["idArr"] = Array.from(new Set(cancelId));
        tipsName = "取消外出开会";
      }
      console.log(data);
      this.$confirm("确认让 " + currentName + tipsName + " 吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          apiUrl(data).then(res => {
            if (res.code == 200) {
              this.datainitGet();
              this.$message({
                type: "success",
                message: "外出开会成功"
              });
            }
          });
        })
        .catch(() => {});
    },

    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;
    },
    changestaff(id) {
      const straffid = this.stadatainf.staffData.some(item => {
        return item.staff_id == id;
      });
      if (!straffid) {
        this.$confirm("是否要添加这位技师?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let name;
            this.technitian.forEach(item => {
              if (item.id == id) {
                name = item.name;
              }
            });
            const tempsta = {
              staff_id: id,
              start_at: this.stadatainf.booking_start_at,
              end_at: this.stadatainf.booking_end_at,
              staff_name: name
            };
            this.stadatainf.staffData.push(tempsta);
            this.$message({
              title: "添加成功",
              message: "需要设置这位技师的时间",
              type: "success",
              duration: 2000
            });
          })
          .catch(() => {});
      } else {
      }
    },
    //新增提交
    createsub() {
      this.stadatainf.booking_date = this.bookingDate / 1000;
      const straffture = this.stadatainf.projectData.some(item => {
        return item.staff_id == "";
      });
      this.stadatainf.shop_id = this.bookingForm.shop_id;
      const straffid = [];
      const proid = [];
      this.stadatainf.staffData.forEach(item => {
        straffid.push(item.staff_id);
      });
      this.stadatainf.projectData.forEach(item => {
        proid.push(item.staff_id);
      });
      let straffrep = false;
      const nary = straffid.sort();
      for (var i = 0; i < nary.length - 1; i++) {
        if (nary[i] == nary[i + 1]) {
          straffrep = true;
        }
      }

      const contain = this.isContained(straffid, proid);
      const limitime1 =
        parseInt(this.stadatainf.booking_end_at) -
        parseInt(this.stadatainf.booking_start_at);
      let limitime2 = 0;
      let limitime3 = false;
      this.stadatainf.staffData.forEach(item => {
        const st1 = parseInt(item.start_at);
        const st2 = parseInt(item.end_at);
        const st3 = st2 - st1;
        limitime2 += st3;
      });
      if (limitime2 != limitime1) {
        limitime3 = true;
      }
      if (straffrep) {
        this.$message({
          title: "失败",
          message: "预约技师不能重复",
          type: "error",
          duration: 2000
        });
      } else if (straffture) {
        this.$message({
          title: "失败",
          message: "明细技师没写选择",
          type: "error",
          duration: 2000
        });
      } else if (contain) {
        this.$message({
          title: "错误",
          message: "技师选择有误",
          type: "error",
          duration: 2000
        });
      } else if (limitime3) {
        this.$message({
          title: "错误",
          message: "时间段没有选择饱满",
          type: "error",
          duration: 2000
        });
      } else {
        createBook(this.stadatainf).then(res => {
          console.log(this.stadatainf);
          console.log("创建的数据");
          this.$message({
            title: "创建",
            message: "创建预约成功",
            type: "success",
            duration: 2000
          });
          this.outerVisible = false;
          this.proinflist = [];
          this.getTree();
        });
      }
    },
    updatesub() {
      this.stadatainf.booking_date = this.bookingDate / 1000;
      const data = this.stadatainf;
      const id = this.stadatainf.customer_id;
      const straffture = this.stadatainf.projectData.some(item => {
        return item.staff_id == "";
      });
      const straffid = [];
      const proid = [];
      this.stadatainf.staffData.forEach(item => {
        straffid.push(item.staff_id);
      });
      this.stadatainf.projectData.forEach(item => {
        proid.push(item.staff_id);
      });
      const contain = this.isContained(straffid, proid);
      const limitime1 =
        parseInt(this.stadatainf.booking_end_at) -
        parseInt(this.stadatainf.booking_start_at);
      let limitime2 = 0;
      let limitime3 = false;
      this.stadatainf.staffData.forEach(item => {
        const st1 = parseInt(item.start_at);
        const st2 = parseInt(item.end_at);
        const st3 = st2 - st1;
        limitime2 += st3;
      });
      let straffrep = false;
      const nary = straffid.sort();
      for (var i = 0; i < nary.length - 1; i++) {
        if (nary[i] == nary[i + 1]) {
          straffrep = true;
        }
      }

      if (limitime2 != limitime1) {
        limitime3 = true;
      }
      if (straffrep) {
        this.$message({
          title: "失败",
          message: "预约技师不能重复",
          type: "error",
          duration: 2000
        });
      } else if (straffture) {
        this.$message({
          title: "失败",
          message: "明细技师没写选择",
          type: "success",
          duration: 2000
        });
      } else if (contain) {
        this.$message({
          title: "错误",
          message: "技师选择有误",
          type: "success",
          duration: 2000
        });
      } else if (limitime3) {
        this.$message({
          title: "错误",
          message: "时间段没有选择饱满",
          type: "success",
          duration: 2000
        });
      } else {
        updateBook(data, id).then(
          res => {
            this.$message({
              title: "修改",
              message: "修改预约成功",
              type: "success",
              duration: 2000
            });
            this.outerVisible = false;
            this.proinflist = [];
            this.getTree();
          },
          rej => {
            console.log(rej);
          }
        );
      }
    },
    pendingsub() {
      console.log(this.id);
      this.stadatainf.booking_date = this.bookingDate / 1000;
      const data = this.stadatainf;
      // this.$set(data, 'id', this.id)
      const id = this.id;
      const straffture = this.stadatainf.projectData.some(item => {
        return item.staff_id == "";
      });
      const straffid = [];
      const proid = [];
      this.stadatainf.staffData.forEach(item => {
        straffid.push(item.staff_id);
      });
      this.stadatainf.projectData.forEach(item => {
        proid.push(item.staff_id);
      });

      const contain = this.isContained(straffid, proid);
      const limitime1 =
        parseInt(this.stadatainf.booking_end_at) -
        parseInt(this.stadatainf.booking_start_at);
      let limitime2 = 0;
      let limitime3 = false;
      this.stadatainf.staffData.forEach(item => {
        const st1 = parseInt(item.start_at);
        const st2 = parseInt(item.end_at);
        const st3 = st2 - st1;
        limitime2 += st3;
      });
      let straffrep = false;
      const nary = straffid.sort();
      for (var i = 0; i < nary.length - 1; i++) {
        if (nary[i] == nary[i + 1]) {
          straffrep = true;
        }
      }
      if (limitime2 != limitime1) {
        limitime3 = true;
      }
      if (straffrep) {
        this.$message({
          title: "失败",
          message: "预约技师不能重复",
          type: "error",
          duration: 2000
        });
      } else if (straffture) {
        this.$message({
          title: "失败",
          message: "明细技师没写选择",
          type: "error",
          duration: 2000
        });
      } else if (contain) {
        this.$message({
          title: "错误",
          message: "技师选择有误",
          type: "error",
          duration: 2000
        });
      } else if (limitime3) {
        this.$message({
          title: "错误",
          message: "时间段没有选择饱满",
          type: "error",
          duration: 2000
        });
      } else {
        updateBook(data, id).then(
          res => {
            this.$message({
              title: "修改",
              message: "修改预约成功",
              type: "success",
              duration: 2000
            });
            this.outerVisible = false;
            this.proinflist = [];
            this.getTree();
          },
          rej => {
            console.log(rej);
          }
        );
      }
    },
    isContained(a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false;
      var aStr = a.toString();
      var bStr = b.toString();
      for (var i = 0, len = b.length; i < len; i++) {
        if (aStr.indexOf(b[i]) == -1) return true;
      }
      for (var i = 0, len = a.length; i < len; i++) {
        if (bStr.indexOf(a[i]) == -1) return true;
      }
      return false;
    },
    getcomterlist(query) {
      const data = {
        keyword: query,
        page_size: 40
      };
      getCustomer(data).then(res => {
        this.listcustomr = res.data.list;
      });
    },
    deleproinf() {
      this.checkstralist.forEach(item => {
        const id = item.project_id;
        this.stadatainf.projectData.forEach((item, index) => {
          if (id == item.project_id) {
            this.stadatainf.projectData.splice(index, 1);
          }
        });
      });
    },
    handleSelect3(val) {
      this.checkstralist = val;
    },
    //新增项目选择
    handleSelect2(val) {
      this.tempcheckprof = val;
      this.getlistindex(this.tempcheckprof);
    },
    getlistindex(tempcheckprof) {
      const changea = [];
      tempcheckprof.forEach(function(item) {
        changea.push(item.project_id);
      });
      this.listindex = [];
      changea.forEach(item => {
        this.proinflist.forEach((item2, index) => {
          if (item.project_id == item2.project_id) {
            this.listindex.push(index);
          }
        });
      });
      console.log("选择后的数量");
    },
    //项目新增查询
    getproinflist() {
      const str1 = this.checkprof;
      const templist = [];
      this.proinflist.forEach(function(item) {
        if (item.project_name.indexOf(str1) != -1) {
          templist.push(item);
        }
      });
      this.tempproinf = templist;
    },
    getcomter(value) {
      console.log(value);
    },
    resetappo() {
      this.stadatainf.staffData = [];
      this.stadatainf.projectData = [];
      this.stadatainf.customer_id = "";
      this.stadatainf.dic_booking_mode = "";
      this.bookingDate = "";
      this.stadatainf.booking_start_at = "";
      this.stadatainf.booking_end_at = "";
      this.stadatainf.remark = "";
    },
    getname(value, row) {
      const index = this.stadatainf.staffData.indexOf(row);
      this.technitian.forEach(item => {
        if (parseInt(item.id) == parseInt(value)) {
          this.stadatainf.staffData[index].staff_name = item.name;
        }
      });
    },
    canclemoreinf() {
      this.innerVisible3 = false;
      this.tempcheckprof = [];
    },
    changeupdateinf() {
      this.tempcheckprof.forEach(item => {
        const data = {
          card_package_id: item.card_package_id,
          card_package_name: item.card_package_name,
          project_id: item.project_id,
          project_num: item.project_num,
          staff_id: "",
          project_id: item.project_id,
          project_name: item.project_name
        };
        this.stadatainf.projectData.push(data);
      });
      this.innerVisible3 = false;
    },
    //确定添加项目
    checkmoreinf() {
      const datalist = [];
      const state1 = this.proinflist.filter((item, index) => {
        return item.card_package_type == this.term_type;
      });
      const state2 = state1.some(item => {
        return item.remain_quantity > 0;
      });
      let checkchange = this.tempcheckprof.some(item => {
        return item.project_num == 0;
      });
      console.log(checkchange);
      console.log(this.checkstralist);
      console.log("确定是否有为0的次数");
      if (state2) {
        this.$confirm("该顾客有期限卡，是否优先划销期限卡?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.changeupdateinf();
            this.innerVisible3 = false;
          })
          .catch(() => {});
      } else if (checkchange) {
        this.$message({
          message: "项目次数不能为0",
          type: "error"
        });
      } else {
        this.changeupdateinf();
        this.innerVisible3 = false;
      }
    },
    canclestafinf() {
      this.innerVisible = false;
    },
    definestafinf() {
      const statue = this.stadatainf.staffData.some(item => {
        return (
          parseInt(item.start_at) >= parseInt(item.end_at) ||
          item.start_at == "" ||
          item.end_at == ""
        );
      });
      if (statue) {
        this.$message({
          message: "时间选择不对或者没选择",
          type: "error"
        });
      } else {
        this.stadatainf.staffData.forEach((item, index) => {
          if (item.name == "") {
            const id = index;
            const staffid = item.staff_id;
            this.technitian.forEach((item, index) => {
              if (item.id == staffid) {
                this.stadatainf.staffData[id].staff_name = item.name;
              }
            });
          }
        });
        this.innerVisible = false;
      }
    },
    delestafinf() {
      this.checkstaff.forEach(item => {
        const id = item.staff_id;
        this.stadatainf.staffData.forEach((item, index) => {
          if (id == item.staff_id) {
            this.stadatainf.staffData.splice(index, 1);
          }
        });
      });
    },
    handleSelec1(val) {
      this.checkstaff = val;
    },
    addstafinf() {
      this.stadatainf.staffData.push({
        staff_id: "",
        start_at: "",
        end_at: "",
        staff_name: ""
      });
    },
    gethmchange1(value) {
      this.startime = this.gethm(value);
    },
    gethmchange2(value) {
      this.endtime = this.gethm(value);
    },
    gethm(value) {
      const h1 = parseInt(value / 60 / 60);
      const h = h1 < 10 ? "0" + h1 : h1;
      let m = parseInt((value - h1 * 60 * 60) / 60);
      m = m < 10 ? "0" + m : m;
      return h + ":" + m;
    },
    flatten(data) {
      return data.reduce(
        (arr, { id, name, type, children = [] }) =>
          arr.concat([{ id, title, pid }], flatten(children)),
        []
      );
    },
    //添加明细
    addproinf() {
      if (this.stadatainf.customer_id == "") {
        this.$message({
          title: "错误",
          message: "还没选择客户",
          type: "error"
        });
      } else if (this.proinflist.length > 0) {
        this.innerVisible3 = true;
      } else {
        const index1 = this.formData[0].booking.indexOf("id");
        const index2 = this.formData[0].booking.indexOf(",");
        const id = this.formData[0].booking.slice(index1 + 5, index2 - 1)
          ? this.formData[0].booking.slice(index1 + 5, index2 - 1)
          : "0";

        const data = {
          booking_id: id,
          customer_id: this.stadatainf.customer_id
        };
        getProduct(data).then(
          res => {
            this.term_type = res.data.term_type;
            this.proinflist = res.data.list;
            this.tempproinf = res.data.list;
            setTimeout(() => {
              this.listLoading = false;
            }, 0.5 * 1000);
            let arr1 = [];
            this.listindex.forEach(item => {
              const str1 = res.data.list[item];
              arr1.push(str1);
              setTimeout(() => {
                this.toggleSelection(arr1);
              }, 500);
            });
          },
          rej => {}
        );
        this.innerVisible3 = true;
      }
    },
    toggleSelection(rows) {
      rows.forEach(row => {
        this.$refs.multipleTable2.toggleRowSelection(row);
      });
    },
    editStaff() {
      if (
        this.stadatainf.booking_end_at == "" ||
        this.stadatainf.booking_start_at == "" ||
        this.bookingDate == ""
      ) {
        this.$message({
          message: "时间还没选择",
          type: "error"
        });
      } else if (
        parseInt(this.stadatainf.booking_start_at) >=
        parseInt(this.stadatainf.booking_end_at)
      ) {
        this.$message({
          message: "开始时间段不能大于结束时间段",
          type: "error"
        });
      } else {
        this.innerVisible = true;
      }
    },
    //待处理预约
    pendingappo(id) {
      this.id = id;
      console.log(id);
      this.dialogTitle1 = "pending";
      this.dialogTitlestate = false;
      this.outerVisible = true;
      const data = {
        shop_id: this.bookingForm.shop_id,
        id: id
      };
      getUpdateinf(data).then(
        response => {
          this.dic_booking_mode = response.data.dic.dic_booking_mode;
          this.timeSlot = response.data.dic.timeSlot;
          this.technitian = response.data.dic.technitian;
          this.stadatainf.staffData = response.data.detail.staffData;
          this.stadatainf.projectData = response.data.detail.projectData;
          this.stadatainf.customer_id = response.data.detail.customer_id;
          this.stadatainf.dic_booking_mode =
            response.data.detail.dic_booking_mode;
          this.bookingDate = response.data.detail.booking_date * 1000;
          this.stadatainf.booking_start_at =
            response.data.detail.booking_start_at;
          this.stadatainf.booking_end_at = response.data.detail.booking_end_at;
          this.stadatainf.remark = response.data.detail.remark;
          this.getcomterlist();
          setTimeout(() => {
            this.listLoading = false;
          }, 0.5 * 1000);
        },
        reject => {}
      );
    },
    //修改预约
    updateappo() {
      this.dialogTitle1 = "update";
      this.outerVisible = true;
      const index1 = this.formData[0].booking.indexOf("id");
      const index2 = this.formData[0].booking.indexOf(",");
      const id = this.formData[0].booking.slice(index1 + 5, index2 - 1);
      const data = {
        shop_id: this.bookingForm.shop_id,
        id: id
      };
      this.getcomterlist();
      getUpdateinf(data).then(
        response => {
          console.log("编辑下来的数据");
          console.log(response.data);
          this.dic_booking_mode = response.data.dic.dic_booking_mode;
          this.timeSlot = response.data.dic.timeSlot;
          this.technitian = response.data.dic.technitian;
          this.stadatainf.staffData = response.data.detail.staffData;
          this.stadatainf.projectData = response.data.detail.projectData;
          this.stadatainf.customer_id = response.data.detail.customer_id;
          this.stadatainf.dic_booking_mode =
            response.data.detail.dic_booking_mode;
          this.bookingDate = response.data.detail.booking_date * 1000;
          this.stadatainf.booking_start_at =
            response.data.detail.booking_start_at;
          this.stadatainf.booking_end_at = response.data.detail.booking_end_at;
          this.stadatainf.remark = response.data.detail.remark;
          setTimeout(() => {
            this.listLoading = false;
          }, 0.5 * 1000);
        },
        reject => {}
      );
    },
    //新建预约
    createappo() {
      this.dialogTitle1 = "create";
      this.outerVisible = true;
      this.stadatainf.staffData = [];
      this.stadatainf.projectData = [];
      this.stadatainf.customer_id = "";
      this.stadatainf.dic_booking_mode = "";
      // this.bookingDate = ''
      // this.stadatainf.booking_start_at = ''
      // this.stadatainf.booking_end_at = ''
      this.stadatainf.remark = "";
      const data = { shop_id: this.shop_id };
      this.getStaffTime();
      getCreateinf(data).then(
        response => {
          this.dic_booking_mode = response.data.dic_booking_mode;
          this.timeSlot = response.data.timeSlot;
          this.technitian = response.data.technitian;
          setTimeout(() => {
            this.listLoading = false;
          }, 0.5 * 1000);
        },
        reject => {}
      );
    },
    datainitGet() {
      const date = new Date(this.bookingForm.sdate);
      this.makeData.date =
        date.getFullYear() +
        "-" +
        (Number(date.getMonth()) + 1) +
        "-" +
        date.getDate();
      const data = {
        shop_id: this.bookingForm.shop_id,
        sdate: this.bookingForm.sdate / 1000
      };
      // 事件
      makeAppGet(data).then(res => {
        if (res.code == 200) {
          this.makeTabledata = res.data.list;
          this.makeTabledate = res.data.time;
          this.staffList = res.data.staff;
          this.bookingCustomerList = res.data.bookingCustomer;
          this.makeData.make_study = res.data.study;
          this.makeTableinit();
        }
      });
    },
    // el-事件
    // 门店 input
    // querySearch(queryString, cb) {
    //   var restaurants = this.restaurants
    //   var results = queryString
    //     ? restaurants.filter(this.createFilter(queryString))
    //     : restaurants
    //   // 调用 callback 返回建议列表的数据
    //   cb(results)
    // },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    // input suo
    handleSelectStore() {
      this.drawerVisible = true;
    },
    // 取消
    handleIconClick(ev) {},

    handleMake(id) {
      console.log(id);
    },
    // 自定义事件
    // getproinflist() { },
    handle() {},
    handleSelectionChange() {}
  }
};
</script>

<style scoped>
.yypsty9 {
  min-width: 180px;
}
.yypsty1 {
  margin-left: 10px;
  margin-right: 10px;
}
.yycont1 {
  display: flex;
  justify-content: center;
  align-items: top;
}
.yycont2,
.yycont3 {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  margin-left: 20px;
  margin-right: 20px;
}
.yycont2 .yypsty8::before {
  content: "*";
  position: absolute;
  color: #f56c6c;
  padding-right: 15px;
  line-height: 10px;
  margin-top: 12px;
  margin-left: 5px;
}
span.yypsty8::before {
  content: "*";
  position: absolute;
  color: #f56c6c;
  padding-right: 15px;
  line-height: 10px;
  margin-top: 5px;
  margin-left: -7px;
}
.yypsty3 span {
  padding-left: 5px;
}
.yypsty8 >>> label {
  font-weight: normal !important;
}
.yycont2 {
  padding: 15px 15px 15px 10px;
  margin-right: 30px;
}
.yycont3 {
  padding: 15px;
}
.yycont3 button {
}
.yypsty2 {
  font-size: 16px;
  margin-left: 10px;
  margin-bottom: 15px;
}
.yybtn1 {
  margin-bottom: 20px;
}
.yypsty3 span {
  font-size: 16px;
  float: left;
  margin-top: 10px;
}
.yypsty3 {
  margin-bottom: 15px;
  text-align: right;
}
.yypsty4 {
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: right;
}
.yypsty4 span {
  float: left;
  margin-top: 10px;
  font-size: 16px;
}
.yypsty7 {
  text-align: center;
  margin-bottom: 20px;
}
.yypsty7 .el-input {
  width: 200px;
  margin-right: 10px;
}
.yypsty5 {
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: right;
}
.yypsty6 {
  padding: 5px 15px 15px;
  border: 1px solid #dcdfe6;
  margin-top: 20px;
  margin-bottom: 15px;
  border-radius: 5px;
}
.yypsty6 .el-table {
  /* margin-left: -10px;
  margin-right: -10px; */
}
.make-appointment {
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  background: #f5f5f5;
  display: flex;
}
.make-app-left {
  width: 25%;
  height: 100%;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  margin-right: 8px;
}
.make-app-body {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 3px;
}
.app-body-top {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #dcdfe6;
}
.app-body-app-1 {
  display: flex;
  align-items: center;
}
.app-body-app-1 > span {
  font-size: 14px;
}
.app-body-app-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 260px;
  border: #895dfe solid 1px;
  border-radius: 3px;
  background: rgba(137, 93, 254, 0.1);
  font-size: 14px;
  overflow: hidden;
}
.app-body-app-2 > svg {
  width: 20px;
  height: 16px;
  margin: 0 10px;
  filter: drop-shadow(#895dfe 80px 0);
  transform: translateX(-80px);

  /* background: rgb(137, 93, 254) !important; */
}
.app-body-app-2 > span {
  padding: 0 5px;
  font-size: 14px;
  color: #999;
}
.app-body-app-3 {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.app-body-app-3 > div:nth-of-type(1) {
  width: 120px;
  height: 28px;
  border: #6ee532 1px solid;
  border-radius: 3px;
  background: rgba(110, 229, 50, 0.1);
  margin-left: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.app-body-app-3 > div:nth-of-type(1) > svg {
  color: #6ee532;
  width: 20px;
  height: 16px;
  filter: drop-shadow(#6ee532 80px 0);
  transform: translateX(-80px);
}
.app-body-app-3 > div:nth-of-type(1) > span {
  color: #6ee532;
  font-size: 14px;
}
.app-body-app-3 > div:nth-of-type(2) {
  width: 120px;
  height: 28px;
  border: #ff4569 1px solid;
  border-radius: 3px;
  background: rgba(255, 69, 105, 0.1);
  margin-left: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.app-body-app-3 > div:nth-of-type(2) > svg {
  color: #ff4569;
  width: 20px;
  height: 16px;
  filter: drop-shadow(#ff4569 80px 0);
  transform: translateX(-80px);
}
.app-body-app-3 > div:nth-of-type(2) > span {
  color: #ff4569;
  font-size: 14px;
}
.app-body-center {
  width: 100%;
  height: calc(100% - 75px);
  margin-top: 15px;
  display: flex;
}
.app-body-left {
  width: 15%;
  height: calc(100% - 10px);
  margin-left: 10px;
}
.app-body-left-1 {
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
  background: #895dfe;
}
.app-body-left-2 {
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-top: 0;
  border-bottom: 0;
}
.app-body-left-2 > p {
  font-size: 14px;
}
.app-body-left-3 {
  width: 100%;
  height: calc(100% - 90px);
  border-radius: 0 0 3px 3px;
  border: 1px solid #dcdfe6;
}
.app-body-centre {
  width: calc(65% - 40px);
  height: calc(100% - 10px);
  margin: 0 10px;
}
.app-body-centre-1 {
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
  background: #895dfe;
}
.app-body-right {
  width: 20%;
  margin-right: 10px;
  height: calc(100% - 10px);
}
.app-body-right-1 {
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
  background: #895dfe;
}
.app-body-centre-2 {
  width: 100%;
  height: calc(100% - 45px);
  border-radius: 0 0 3px 3px;
  border: 1px solid #dcdfe6;
  overflow: hidden;
  /* overflow-y: scroll; */
}
/* 表格 */
.td_bg {
  background: #ffaa00 !important;
}
.app-body-centre-table {
  width: calc(100% + 15px);
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  position: relative;
}
.tb td {
  width: 120px;
  height: 50px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /* display: flex;
  justify-content: center;
  align-items: center; */
}
.index-thead > tr {
  display: flex;
  flex-direction: column;
}
.index-thead > tr > th {
  width: 120px;
  height: 50px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  border-bottom: 0;
  font-weight: 100;
  font-size: 14px;
  color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
}
.index-thead > tr > th:nth-last-of-type(1) {
  border-bottom: 1px solid #dcdfe6;
}
.index-center {
  display: flex;
}
.index-tbody {
  display: flex;
  font-size: 14px;
}
.index-tbody > tr {
  display: flex;
  flex-direction: column;
}
.index-tbody p {
  margin: auto;
}

.xuanze {
  width: 120px;
  /* height: 200px; */
  background: #895dfe;
  position: fixed;
  z-index: 1000;
}
.xuanze div {
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}
.noselect {
  background-color: #eee;
  pointer-events: none;
}
</style>

<style lang="scss" scoped>
#app .main-container,
.app-main {
  height: 100%;
}
#app .manage-center .structure-body {
  width: 100% !important;
}
.no-data {
  color: #909399;
  line-height: 100px;
  text-align: center;
}
.app-body-left-3 ul {
  list-style: none;
  padding: 0;
  text-align: center;
  font-size: 14px;
}
.openbtn {
  position: relative;
  top: 50%;
  left: 0;
  width: 0;
  height: 80px;
  // padding: 20px;
  transform: translateY(-50%);
  // z-index: 3000;
  border-left: 18px solid rgb(100, 100, 100);
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  margin: 0 -10px;
  opacity: 0.4;
  transition: all 0.5s ease;
  .icon {
    position: absolute;
    left: -21px;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    font-size: 24px;
  }
}
// 动画
.bounce-enter-active {
  animation: bounce-in 0.5s ease;
}
.bounce-leave-active {
  animation: bounce-in 0.5s ease reverse;
}

@keyframes bounce-in {
  0% {
    width: 0px;
  }

  100% {
    width: 25%;
  }
}
.app-body-centre-3 {
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border: 2px solid #dcdfe6;
  border-bottom: none;
  div {
    margin-right: 20px;
    display: flex;
    align-items: center;
    &::before {
      content: "";
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin-right: 5px;
      display: inline-block;
    }
  }
}
$color1: #ffaa00;
$color2: #6ee532;
$color3: #a9b1d1;
$color4: #ff4569;
$color5: #dcdfe6;

.status-color1::before {
  background-color: $color1;
}
.status-color2::before {
  background-color: $color2;
}
.status-color3::before {
  background-color: $color3;
}
.status-color4::before {
  background-color: $color4;
}

.booking-color1 {
  box-shadow: -3px 0 0 0 $color1;
  background-color: rgba($color1, 0.3);
}
.booking-color2 {
  box-shadow: -3px 0 0 0 $color2;
  background-color: rgba($color2, 0.3);
}
.booking-color3 {
  box-shadow: -3px 0 0 0 $color3;
  background-color: rgba($color3, 0.3);
}
.booking-color4 {
  box-shadow: -3px 0 0 0 $color4;
  background-color: rgba($color4, 0.3);
}
.booking-color5 {
  box-shadow: -3px 0 0 0 $color5;
  background-color: rgba($color5, 0.3);
}
.booking-color6 {
  background-color: rgba($color5, 0.5);
  pointer-events: none;
}
.staff-color1 {
  color: red;
}
.staff-color2 {
  color: $color2;
}
</style>
