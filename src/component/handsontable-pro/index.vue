<template>
  <HotTable :root="root" :data="datas" ref="testHot" :settings="hotSettings">
  </HotTable>
</template>

<script>
import { HotTable } from "@handsontable-pro/vue";
import { SchedulingSettingCreate } from "@/api/ManageHr/Schedu.js";
export default {
  data: function() {
    const that = this;
    return {
      root: "test-hot",
      datas: [],
      setDatas: [],
      // 某月多少天
      sum: 0,
      // 年/月
      years: 0,
      months: 0,
      hotSettings: {
        rowHeaders: true, // 行表头，可以使布尔值（行序号），可以使字符串（左侧行表头相同显示内容，可以解析html），也可以是数组（左侧行表头单独显示内容）。
        readOnly: true,
        colHeaders: [], // 自定义列表头or 布尔值
        fillHandle: false, // 设置不能右下角拖动复制
        colWidths: [],
        rowHeights: 40,
        rowHeaderWidth: 50,
        contextMenu: {
          items: {
            早班: {
              name: "早班",
              callback(key, selection, clickEvent) {
                const srow = selection[0].start.row;
                let scol = selection[0].start.col;
                const erow = selection[0].end.row;
                let ecol = selection[0].end.col;
                const ar = [];
                let data = {
                  detail: []
                };
                if (scol === 0) {
                  scol += 1;
                } else if (ecol === 0) {
                  ecol += 1;
                }
                for (var r = srow; r <= erow; r++) {
                  for (var c = scol; c <= ecol; c++) {
                    console.log(r * c);
                    ar.push({
                      r: this.getRowHeader(r),
                      c: this.getColHeader(c)
                    });
                    this.setCellMeta(
                      r,
                      c,
                      "className",
                      "morning-shift htMiddle"
                    ); // 改变选中格的背景颜色(bkred为class名称)
                    this.setDataAtCell(r, c, key); // 改变选中表格中的文字
                    let time =
                      new Date(
                        that.years + "-" + that.months + "-" + c
                      ).getTime() / 1000;
                    data.shop_id = that.shopids;
                    if (typeof that.setDatas[r].schedule !== "undefined") {
                      that.setDatas[r].schedule.forEach(function(item, index) {
                        if (new Date(item.sdate * 1000).getDate() == c) {
                          data.detail.push({
                            id: item.id,
                            staff_id: that.setDatas[r].id,
                            sdate: time,
                            dic_classes: 1,
                            is_confirm: 1
                          });
                        } else {
                          data.detail.push({
                            staff_id: that.setDatas[r].id,
                            sdate: time,
                            dic_classes: 1,
                            is_confirm: 1
                          });
                        }
                      });
                    } else {
                      data.detail.push({
                        staff_id: that.setDatas[r].id,
                        sdate: time,
                        dic_classes: 1,
                        is_confirm: 1
                      });
                    }
                  }
                }
                SchedulingSettingCreate(data).then(res => {
                  if (res.code === 200) {
                    that.$message({
                      message: "操作成功",
                      type: "success"
                    });
                  }
                });
              }
            },
            晚班: {
              name: "晚班",
              callback(key, selection, clickEvent) {
                const srow = selection[0].start.row;
                let scol = selection[0].start.col;
                const erow = selection[0].end.row;
                let ecol = selection[0].end.col;
                const ar = [];
                let data = {
                  detail: []
                };
                if (scol === 0) {
                  scol += 1;
                } else if (ecol === 0) {
                  ecol += 1;
                }
                for (let r = srow; r <= erow; r++) {
                  for (let c = scol; c <= ecol; c++) {
                    ar.push({
                      r: this.getRowHeader(r),
                      c: this.getColHeader(c)
                    });
                    this.setCellMeta(
                      r,
                      c,
                      "className",
                      "evening-shift htMiddle"
                    ); // 改变选中格的背景颜色(bkred为class名称)
                    this.setDataAtCell(r, c, key); // 改变选中表格中的文字
                    let time =
                      new Date(
                        that.years + "-" + that.months + "-" + c
                      ).getTime() / 1000;
                    data.shop_id = that.shopids;
                    if (typeof that.setDatas[r].schedule !== "undefined") {
                      that.setDatas[r].schedule.forEach(function(item, index) {
                        if (new Date(item.sdate * 1000).getDate() == c) {
                          data.detail.push({
                            id: item.id,
                            staff_id: that.setDatas[r].id,
                            sdate: time,
                            dic_classes: 2,
                            is_confirm: 1
                          });
                        } else {
                          data.detail.push({
                            staff_id: that.setDatas[r].id,
                            sdate: time,
                            dic_classes: 2,
                            is_confirm: 1
                          });
                        }
                      });
                    } else {
                      data.detail.push({
                        staff_id: that.setDatas[r].id,
                        sdate: time,
                        dic_classes: 2,
                        is_confirm: 1
                      });
                    }
                  }
                }
                SchedulingSettingCreate(data).then(res => {
                  if (res.code === 200) {
                    that.$message({
                      message: "操作成功",
                      type: "success"
                    });
                  }
                });
              }
            },
            通班: {
              name: "通班",
              callback(key, selection, clickEvent) {
                const srow = selection[0].start.row;
                let scol = selection[0].start.col;
                const erow = selection[0].end.row;
                let ecol = selection[0].end.col;
                const ar = [];
                let data = {
                  detail: []
                };
                if (scol === 0) {
                  scol += 1;
                } else if (ecol === 0) {
                  ecol += 1;
                }
                for (let r = srow; r <= erow; r++) {
                  for (let c = scol; c <= ecol; c++) {
                    ar.push({
                      r: this.getRowHeader(r),
                      c: this.getColHeader(c)
                    });
                    this.setCellMeta(r, c, "className", "general-ban htMiddle"); // 改变选中格的背景颜色(bkred为class名称)
                    this.setDataAtCell(r, c, key); // 改变选中表格中的文字
                    let time =
                      new Date(
                        that.years + "-" + that.months + "-" + c
                      ).getTime() / 1000;
                    data.shop_id = that.shopids;
                    if (typeof that.setDatas[r].schedule !== "undefined") {
                      that.setDatas[r].schedule.forEach(function(item, index) {
                        if (new Date(item.sdate * 1000).getDate() == c) {
                          data.detail.push({
                            id: item.id,
                            staff_id: that.setDatas[r].id,
                            sdate: time,
                            dic_classes: 3,
                            is_confirm: 1
                          });
                        } else {
                          data.detail.push({
                            staff_id: that.setDatas[r].id,
                            sdate: time,
                            dic_classes: 3,
                            is_confirm: 1
                          });
                        }
                      });
                    } else {
                      data.detail.push({
                        staff_id: that.setDatas[r].id,
                        sdate: time,
                        dic_classes: 3,
                        is_confirm: 1
                      });
                    }
                  }
                }
                SchedulingSettingCreate(data).then(res => {
                  if (res.code === 200) {
                    that.$message({
                      message: "操作成功",
                      type: "success"
                    });
                  }
                });
              }
            },
            上休: {
              name: "上休",
              callback(key, selection, clickEvent) {
                const srow = selection[0].start.row;
                let scol = selection[0].start.col;
                const erow = selection[0].end.row;
                let ecol = selection[0].end.col;
                const ar = [];
                let data = {
                  detail: []
                };
                if (scol === 0) {
                  scol += 1;
                } else if (ecol === 0) {
                  ecol += 1;
                }
                for (let r = srow; r <= erow; r++) {
                  for (let c = scol; c <= ecol; c++) {
                    ar.push({
                      r: this.getRowHeader(r),
                      c: this.getColHeader(c)
                    });
                    this.setCellMeta(r, c, "className", "upper-rest htMiddle"); // 改变选中格的背景颜色(bkred为class名称)
                    this.setDataAtCell(r, c, key); // 改变选中表格中的文字
                    let time =
                      new Date(
                        that.years + "-" + that.months + "-" + c
                      ).getTime() / 1000;
                    data.shop_id = that.shopids;
                    if (typeof that.setDatas[r].schedule !== "undefined") {
                      that.setDatas[r].schedule.forEach(function(item, index) {
                        if (new Date(item.sdate * 1000).getDate() == c) {
                          data.detail.push({
                            id: item.id,
                            staff_id: that.setDatas[r].id,
                            sdate: time,
                            dic_classes: 4,
                            is_confirm: 1
                          });
                        } else {
                          data.detail.push({
                            staff_id: that.setDatas[r].id,
                            sdate: time,
                            dic_classes: 4,
                            is_confirm: 1
                          });
                        }
                      });
                    } else {
                      data.detail.push({
                        staff_id: that.setDatas[r].id,
                        sdate: time,
                        dic_classes: 4,
                        is_confirm: 1
                      });
                    }
                  }
                }
                SchedulingSettingCreate(data).then(res => {
                  if (res.code === 200) {
                    that.$message({
                      message: "操作成功",
                      type: "success"
                    });
                  }
                });
              }
            },
            下休: {
              name: "下休",
              callback(key, selection, clickEvent) {
                const srow = selection[0].start.row;
                let scol = selection[0].start.col;
                const erow = selection[0].end.row;
                let ecol = selection[0].end.col;
                const ar = [];
                let data = {
                  detail: []
                };
                if (scol === 0) {
                  scol += 1;
                } else if (ecol === 0) {
                  ecol += 1;
                }
                for (let r = srow; r <= erow; r++) {
                  for (let c = scol; c <= ecol; c++) {
                    ar.push({
                      r: this.getRowHeader(r),
                      c: this.getColHeader(c)
                    });
                    this.setCellMeta(r, c, "className", "next-rest htMiddle"); // 改变选中格的背景颜色(bkred为class名称)
                    this.setDataAtCell(r, c, key); // 改变选中表格中的文字
                    let time =
                      new Date(
                        that.years + "-" + that.months + "-" + c
                      ).getTime() / 1000;
                    data.shop_id = that.shopids;
                    if (typeof that.setDatas[r].schedule !== "undefined") {
                      that.setDatas[r].schedule.forEach(function(item, index) {
                        if (new Date(item.sdate * 1000).getDate() == c) {
                          data.detail.push({
                            id: item.id,
                            staff_id: that.setDatas[r].id,
                            sdate: time,
                            dic_classes: 5,
                            is_confirm: 1
                          });
                        } else {
                          data.detail.push({
                            staff_id: that.setDatas[r].id,
                            sdate: time,
                            dic_classes: 5,
                            is_confirm: 1
                          });
                        }
                      });
                    } else {
                      data.detail.push({
                        staff_id: that.setDatas[r].id,
                        sdate: time,
                        dic_classes: 5,
                        is_confirm: 1
                      });
                    }
                  }
                }
                SchedulingSettingCreate(data).then(res => {
                  if (res.code === 200) {
                    that.$message({
                      message: "操作成功",
                      type: "success"
                    });
                  }
                });
              }
            },
            休息: {
              name: "休息",
              callback(key, selection, clickEvent) {
                const srow = selection[0].start.row;
                let scol = selection[0].start.col;
                const erow = selection[0].end.row;
                let ecol = selection[0].end.col;
                const ar = [];
                let data = {
                  detail: []
                };
                if (scol === 0) {
                  scol += 1;
                } else if (ecol === 0) {
                  ecol += 1;
                }
                for (let r = srow; r <= erow; r++) {
                  for (let c = scol; c <= ecol; c++) {
                    ar.push({
                      r: this.getRowHeader(r),
                      c: this.getColHeader(c)
                    });
                    this.setCellMeta(r, c, "className", "rest htMiddle"); // 改变选中格的背景颜色(bkred为class名称)
                    this.setDataAtCell(r, c, key); // 改变选中表格中的文字
                    let time =
                      new Date(
                        that.years + "-" + that.months + "-" + c
                      ).getTime() / 1000;
                    data.shop_id = that.shopids;
                    if (typeof that.setDatas[r].schedule !== "undefined") {
                      that.setDatas[r].schedule.forEach(function(item, index) {
                        if (new Date(item.sdate * 1000).getDate() == c) {
                          data.detail.push({
                            id: item.id,
                            staff_id: that.setDatas[r].id,
                            sdate: time,
                            dic_classes: 6,
                            is_confirm: 1
                          });
                        } else {
                          data.detail.push({
                            staff_id: that.setDatas[r].id,
                            sdate: time,
                            dic_classes: 6,
                            is_confirm: 1
                          });
                        }
                      });
                    } else {
                      data.detail.push({
                        staff_id: that.setDatas[r].id,
                        sdate: time,
                        dic_classes: 6,
                        is_confirm: 1
                      });
                    }
                  }
                }
                SchedulingSettingCreate(data).then(res => {
                  if (res.code === 200) {
                    that.$message({
                      message: "操作成功",
                      type: "success"
                    });
                  }
                });
              }
            }
          }
        },
        afterRender() {
          // this.setCellMeta(1, 5, 'className', 'morning-shift')
          const arr = {
            早班: "morning-shift",
            晚班: "evening-shift",
            通班: "general-ban",
            上休: "upper-rest",
            下休: "next-rest",
            休息: "rest"
          };
          const datas = that.datas;
          for (let i = 0; i < datas.length; i++) {
            for (let j = 0; j < datas[i].length; j++) {
              this.setCellMeta(
                i,
                j,
                "className",
                arr[datas[i][j]] + " htMiddle"
              );
            }
          }
        }
      }
    };
  },
  props: {
    date: {
      type: String
    },
    setting: {
      type: Array,
      default() {
        return [];
      }
    },
    shopids: {
      type: String
    }
  },
  watch: {
    date(val) {
      this.getDates(val);
    },
    setting(data) {
      this.setDatas = data;
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < this.sum; j++) {
          if (j === 0) {
            this.$set(this.datas, i, [data[i].name]);
            continue;
          }
          this.datas[i][j] = "";
          if (data[i].schedule) {
            let schedule = data[i].schedule;
            for (let z = 0; z < schedule.length; z++) {
              let time = schedule[z].sdate * 1000;
              time = new Date(time);
              let x = time.getDate();
              this.$set(this.datas[i], x, schedule[z].dic_classes);
            }
          }
        }
      }
    }
  },
  components: {
    HotTable
  },
  mounted() {
    this.getDates();
  },
  methods: {
    getDates(val) {
      const days = [];
      const colHeaders = [];
      const colWidths = [];
      let myDate = null;
      let curDate = null;
      if (val) {
        myDate = new Date(val);
        curDate = new Date(val);
      } else {
        myDate = new Date();
        curDate = new Date();
      }
      this.years = myDate.getFullYear();
      this.months = myDate.getMonth() + 1;
      const weekDay = [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      curDate.setMonth(this.months);
      curDate.setDate(0);
      this.sum = curDate.getDate() + 1;
      console.log(this.sum);
      for (let i = 0; i <= this.sum; i++) {
        const dt = new Date(this.years + "/" + this.months + "/" + i);
        if (i === 0) {
          days.push("");
          colHeaders.push("店内<br>" + "职位");
          continue;
        }
        days.push(i + "\n" + weekDay[dt.getDay()]);
        colHeaders.push(i + "<br>" + weekDay[dt.getDay()]);
        colWidths.push(100);
      }
      this.hotSettings.colHeaders = colHeaders;
      this.hotSettings.colWidths = colWidths;
      this.hotSettings.colWidths[0] = 150;
    }
  }
};
</script>

<style lang="scss">
@import "~handsontable/dist/handsontable.full.css";
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #fff;
}
.handsontable span.colHeader {
  line-height: 23px !important;
  margin-top: 5px;
}
.handsontable tr th,
.handsontable tr td {
  line-height: 39px !important;
}
#hot-preview {
  overflow: hidden;
  .handsontable {
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
    .ht_master .wtHolder {
      height: auto !important;
    }
    table.htCore {
      text-align: center;
    }
  }
  .htDimmed {
    color: #333;
  }
  .morning-shift {
    background: rgb(255, 152, 0);
    color: #fff;
  }
  .evening-shift {
    background-color: rgb(139, 195, 74);
    color: #fff;
  }
  .general-ban {
    background-color: rgb(0, 150, 136);
    color: #fff;
  }
  .upper-rest {
    background-color: rgb(229, 28, 35);
    color: #fff;
  }
  .next-rest {
    background-color: rgb(255, 64, 129);
    color: #fff;
  }
  .rest {
    background-color: rgb(63, 81, 181);
    color: #fff;
  }
}
.htContextMenu table tbody tr td:first-child {
  height: 30px !important;
  line-height: 30px;
  text-align: center;
  color: rgb(0, 118, 255);
  border-bottom: 1px solid rgb(202, 206, 216);
}
#hot-display-license-info {
  display: none;
}
</style>
