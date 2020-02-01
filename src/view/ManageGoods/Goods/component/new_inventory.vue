<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      title="盘点明细"
      width="80%"
      :visible.sync="dialogFormVisible"
      @close="hide"
    >
      <nav id="inventory">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="单据号:">
            <el-input v-model="formInline.document_number" disabled placeholder="审批人" />
          </el-form-item>
          <el-form-item label="盘点门店:">
            <el-input v-model="formInline.shop_name" disabled placeholder="审批人" />
          </el-form-item>
          <el-form-item label="盘点仓库:">
            <!-- <el-input v-model="formInline.inventory_name" disabled placeholder="审批人"></el-input> -->
            <el-select v-model="formInline.inventory_name" @change="gitGcreate" placeholder="请选择">
              <el-option
                v-for="item in inventory_name"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="盘点日期:">
            <el-date-picker
              v-model="formInline.inventory_date"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="timestamp"
              disabled
            />
          </el-form-item>
          <el-form-item label="产品名称:">
            <el-input v-model="formInline.project_name" placeholder="产品名称" />
          </el-form-item>
        </el-form>
      </nav>
      <div class="control_btn filter-container">
        <el-button type="primary" @click="addProduct()">添加</el-button>
        <el-button type="primary">导出</el-button>
      </div>
      <div class="table">
        <el-table
          ref="multipleTable"
          border
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :summary-method="getSummaries"
          show-summary
        >
          >
          <el-table-column align="center" prop="product_brand" label="品牌" />
          <el-table-column align="center" prop="product_name" label="产品名称" />
          <el-table-column align="center" prop="short_name" label="产品简称" />
          <el-table-column align="center" prop="code" label="产品编号" />
          <el-table-column align="center" prop="sell_price" label="销售价格" />
          <el-table-column align="center" prop="dic_unit" label="单位" />
          <el-table-column align="center" prop="specs" label="规格" />
          <el-table-column align="center" prop="quantity" label="库存数量" />
          <el-table-column align="center" prop="check_quantity" label="盘点实际数量">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.check_quantity"
                @blur="saveWhInventory(scope.row,scope.$index)"
                type="number"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="change_quantity" label="盈亏数量">
            <template slot-scope="scope">
              <span
                v-if="scope.row.change_quantity > 0"
                class="inventoryResult green"
              >{{ scope.row.change_quantity }}</span>
              <span
                v-else-if="scope.row.change_quantity < 0"
                class="inventoryResult red"
              >{{ scope.row.change_quantity }}</span>
              <span v-else class="inventoryResult">{{ scope.row.change_quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="155" label="盘点时间">
            <template slot-scope="scope">
              <span v-if="scope.row.checked_at != 0">{{ (scope.row.checked_at * 1000)|formtime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" @blur="saveWhInventory(scope.row,scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消盘点</el-button>
        <el-button type="primary" @click="endWhInventory()">结束盘点</el-button>
      </div>
      <!-- 选择项目 -->
      <el-dialog center width="60%" title="产品增加" :visible.sync="choicePro" append-to-body>
        <el-scrollbar class="scroll-ly2 psconte2">
          <el-table ref="multipleTable2" :data="proData" border @row-click="clickPro">
            <el-table-column align="center" prop="product_brand" label="品牌" />
            <el-table-column align="center" prop="product_name" label="产品名称" />
            <el-table-column align="center" prop="short_name" label="产品简称" />
            <el-table-column align="center" prop="code" label="产品编号" />
            <el-table-column align="center" prop="sell_price" label="销售价格" />
            <el-table-column align="center" prop="dic_unit" label="单位" />
            <el-table-column align="center" prop="specs" label="规格" />
          </el-table>
        </el-scrollbar>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import inventory_clearing_api from "@/api/ManageGoods/inventory_clearing";
export default {
  name: "NewInventory",
  filters: {},
  data() {
    return {
      dialogFormVisible: true,
      // 自动生成数据
      formInline: {
        inventory_date: Date.parse(new Date()),
        document_number: "",
        project_name: "",
        inventory_name: "",
        shop_name: ""
      },
      choicePro: false,
      inventory_name: [],
      tableData: [],
      wh_inventory_id: "",
      proData: []
    };
  },
  created() {
    this.gitGcreate();
  },
  methods: {
    //获取初始化数据
    gitGcreate() {
      inventory_clearing_api.addInventory(this.formInline).then(res => {
        console.log(res);
        this.formInline.document_number = res.document_number;
        this.formInline.shop_name = res.shop.name;
        this.formInline.inventory_name = res.arrWarehouse.detail;
        this.inventory_name = res.arrWarehouse.warehouse;
        this.wh_inventory_id = res.wh_inventory_id;
        res.detail.forEach((item, index, arr) => {
          if (item.wh_inventory_dtl_id != 0) {
            arr[index]["change_quantity"] =
              item["check_quantity"] - item["quantity"];
          } else {
            arr[index]["change_quantity"] = 0;
          }
        });
        this.tableData = res.detail;
      });
    },
    // 控制弹窗是否显示
    close() {
      this.choicePro = false;
    },
    // 新增产品
    addProduct() {
      this.choicePro = true;
      var inventory_name = {};
      inventory_name["warehouse_id"] = this.formInline.inventory_name;
      inventory_clearing_api.search(inventory_name).then(res => {
        if (res.code == 200) {
          this.proData = res.data;
        }
      });
    },
    clickPro(row, column, event) {
      row["change_quantity"] = 0;
      row["check_quantity"] = 0;
      row["checked_at"] = 0;
      row["quantity"] = 0;
      row["remark"] = "";
      row["wh_inventory_dtl_id"] = 0;
      this.saveWhInventory(row, this.tableData.length)
      // this.tableData.push(row);
      // console.log(this.tableData);
      this.choicePro = false;
    },
    // 关闭弹窗
    hide() {
      this.$emit("hid");
    },
    // 表单搜索结果显示高亮
    tableRowClassName({ row, rowIndex }) {
      if (row.product_name == this.formInline.project_name) {
        return "warning-row";
      }
      if (row.wh_inventory_dtl_id != 0) {
        return "inventory-row";
      }
      return "";
    },
    focusInput(e){
      console.log(111);
      this.$forceUpdate()
    },
    saveWhInventory(item, index) {
      var change_quantity = item["check_quantity"] - item["quantity"];
      var dataJson = {};
      dataJson["change_quantity"] = change_quantity;
      dataJson["check_quantity"] = item["check_quantity"];
      dataJson["remark"] = item["remark"];
      if (item.wh_inventory_dtl_id == 0) {
        //新增盘点记录明细
        dataJson["id"] = this.wh_inventory_id;
        dataJson["inventory_warehouse"] = this.formInline.inventory_name;
        dataJson["product_id"] = item["product_id"];
        dataJson["stock_quantity"] = item["quantity"];
        inventory_clearing_api.create(dataJson).then(res => {
          console.log(res);
          if (res.code == 200) {
            this.gitGcreate();
            // this.tableData[index]["change_quantity"] = change_quantity;
            // this.tableData[index]["checked_at"] = res.data.checked_at;
            // this.tableData[index]["wh_inventory_dtl_id"] =
            //   res.data.wh_inventory_dtl_id;
            if (this.wh_inventory_id == 0) {
              this.wh_inventory_id = res.data.wh_inventory_id;
            }

          }
          return;
        });
      } else {
        //修改盘点记录明细
        inventory_clearing_api
          .update(dataJson, item.wh_inventory_dtl_id)
          .then(res => {
            if (res.code == 200) {
              this.tableData[index]["change_quantity"] = change_quantity;
            }
            return;
          });
      }
    },
    //取消盘点
    cancel() {
      if (this.wh_inventory_id != 0) {
        this.$confirm("您确定取消盘点?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            inventory_clearing_api.delete(this.wh_inventory_id).then(res => {
              this.dialogFormVisible = false;
            });
          })
          .catch(res => {});
      } else {
        this.dialogFormVisible = false;
      }
    },
    //结束盘点
    endWhInventory() {
      var data = this.tableData;
      if (data.length == 0) {
        this.$message.warning("盘点条目不能为空");
        return false;
      } else {
        var surplus = 0; //盘盈数量
        var loss = 0; //盘亏数量
        var num = 0;
        data.forEach((item, index, arr) => {
          if (item.wh_inventory_dtl_id == 0) {
            num++;
          }
          if (item.change_quantity > 0) {
            surplus++;
          } else if (item.change_quantity < 0) {
            loss++;
          }
        });

        if (num > 0) {
          this.$message.warning("您有记录进行未盘点，请先盘点");
          return false;
        } else {
          var surplusLossType = 1; //盘点结果
          if (surplus > 0 && loss > 0) {
            surplusLossType = 4; //盘盈+盘亏
          } else if (loss > 0) {
            surplusLossType = 3; //盘亏
          } else if (surplus > 0) {
            surplusLossType = 2; //盘盈
          }

          var inventoryJson = {};
          inventoryJson["check_results"] = surplusLossType;
          inventoryJson["check_status"] = 1;

          if (surplusLossType != 1) {
            this.$confirm("本次复盘出现盘盈或盘亏,是否进行复盘?", "提示", {
              confirmButtonText: "否",
              cancelButtonText: "是",
              type: "warning"
            })
              .then(() => {
                var punishmentJson = {};
                punishmentJson["check_results"] = surplusLossType;
                punishmentJson["wh_inventory_id"] = this.wh_inventory_id;
                //新增盘点处罚
                inventory_clearing_api.punishment(punishmentJson).then(res => {
                  inventory_clearing_api
                    .updateState(inventoryJson, this.wh_inventory_id)
                    .then(res => {
                      this.dialogFormVisible = false;
                    });
                });
              })
              .catch(res => {});
          } else {
            //更新盘点状态
            inventory_clearing_api
              .updateState(inventoryJson, this.wh_inventory_id)
              .then(res => {
                this.dialogFormVisible = false;
              });
          }
        }
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (index == 7 || index == 8 || index == 9) {
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = "N/A";
          }
        }
      });

      return sums;
    }
  },
  filters: {
    formtime: function(value) {
      const time = new Date(parseInt(value));
      const year = time.getFullYear();
      const month =
        time.getMonth() + 1 > 9
          ? time.getMonth() + 1
          : "0" + (time.getMonth() + 1);
      const day = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
      const hour = time.getHours();
      const minute = time.getMinutes();
      return year + "-" + month + "-" + day + " " + hour + ":" + minute;
    }
  }
};
</script>

<style  lang='scss' scoped>
</style>
<style>
.warning-row {
  background-color: #ff000033 !important;
}
.inventory-row {
  background-color: #895dfe33 !important;
}
</style>
