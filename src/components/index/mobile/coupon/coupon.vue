<template>
  <div class="coupon" :style="{'width':rightW}">
    <Loading v-if="loadingType"></Loading>
    <div class="coupon_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：APP管理 >
        <span>
          <el-button type="text">优惠券</el-button>
        </span>
      </div>
    </div>

    <div class="coupon_box">
      <!-- 查询条件 -->
      <div class="coupon_search">
        <div>
          <div>
            <span>创建时间：</span>
            <el-date-picker
              v-model="reCoupon.date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>

          <div>
            <span>优惠券类型：</span>
            <el-select v-model="reCoupon.type" placeholder="请选择">
              <el-option
                v-for="item in reCoupon.typeFlg"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <el-button @click="GetSearchList" type="primary" size="mini">
              <i class="el-icon-search"></i> 查询
            </el-button>
          </div>
          <div>
            <el-button @click="Clear" size="mini">
              <i class="el-icon-refresh"></i> 清空
            </el-button>
          </div>
        </div>
      </div>
      <div class="searchBtn">
        <div>
          <el-button @click="type = 0,dialogDiv.add = true" size="mini">
            <i class="el-icon-plus"></i> 创建
          </el-button>
        </div>
      </div>

      <!-- 列表 -->
      <div class="coupon_table">
        <el-table
          :data="couponList.data"
          border
          :height="tableHeight"
          size="mini"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="49" align="center" label="编号"></el-table-column>
          <el-table-column prop="rct_type_val" align="center" label="优惠券类型"></el-table-column>
          <el-table-column align="center" label="优惠面值">
            <template slot-scope="props">
              <div>{{props.row.rct_den}} {{props.row.rct_unit}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="时效">
            <template slot-scope="props">
              <div v-if="props.row.rct_inteval > -2">{{props.row.rct_vaildTime}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="180" label="有效期">
            <template slot-scope="props">
              <div
                v-if="props.row.rct_inteval == -2"
              >{{$base.tampToTime(props.row.rct_start,2)}}&nbsp;—&nbsp;{{$base.tampToTime(props.row.rct_end,2)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="create_date" align="center" width="150" label="创建时间"></el-table-column>
          <el-table-column align="center" fixed="right" width="170" label="操作">
            <template slot-scope="scope">
              <el-button @click="view(couponList.data[scope.$index])" type="primary" size="small">编辑</el-button>
              <el-button @click="delItem(couponList.data,scope.$index)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 新增     -->
        <el-dialog class="dialogDIv" width="30%" title :visible.sync="dialogDiv.add">
          <div class="dialoBox">
            <div class="dialoTitle">
              <div v-if="type == 1">编辑模板</div>
              <div v-else>创建模板</div>
              <div @click="dialogDiv.add = false" class="cur">X</div>
            </div>
            <div class="dialoContent">
              <div>
                <span>优惠券类型：</span>
                <div>
                  <el-select v-model="add.type" placeholder="请选择">
                    <el-option
                      v-for="item in add.typeFlg"
                      :key="item.index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-input v-model="add.num" placeholder="请输入额度" maxlength="9"></el-input>
                  {{add.type == 0 ? add.unit = 'G' : add.unit = '元'}}
                </div>
              </div>
              <div>
                <span>优惠券期限：</span>
                <div>
                  <el-radio v-model="add.dateType" :label="0">时效</el-radio>
                  <el-radio v-model="add.dateType" :label="1">有效期</el-radio>
                </div>
              </div>
              <div>
                <span></span>
                <div v-if="add.dateType == 0">
                  <el-input
                    v-model="add.date"
                    type="number"
                    :disabled="add.checked"
                    placeholder="有效天数"
                    maxlength="9"
                  >
                    <template slot="append">天</template>
                  </el-input>
                  <div class="checked">
                    <el-checkbox v-model="add.checked">永久</el-checkbox>
                  </div>
                </div>
                <div v-else>
                  <el-date-picker
                    v-model="add.startDate"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择日期"
                  ></el-date-picker>
                  <span style="color:#dcdfe6">——&nbsp;&nbsp;</span>
                  <el-date-picker
                    v-model="add.endDate"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择日期"
                  ></el-date-picker>
                </div>
              </div>
              <div>
                <el-button v-if="type == 1" size="mini" type="primary" @click="GetIssue(add.id)">保存</el-button>
                <el-button v-else size="mini" type="primary" @click="GetIssue">保存</el-button>
                <el-button size="mini" @click="dialogDiv.add = false">取消</el-button>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 分页 -->
      <div class="coupon_pages">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="20"
          :page-sizes="[5,10,20,30,50,100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="couponList.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./../../../loading/loading";
export default {
  data() {
    return {
      access_token: "",
      reCoupon: {
        date: "",
        type: -1,
        typeFlg: [
          { id: -1, name: "全部" },
          { id: 0, name: "流量券" },
          { id: 1, name: "现金券" }
        ]
      },
      add: {
        type: 0,
        unit: "G",
        checked: false,
        dateType: 0,
        startDate: "",
        endDate: "",
        num: "",
        date: "",
        typeFlg: [{ id: 0, name: "流量券" }, { id: 1, name: "现金券" }]
      },
      couponList: {},
      dialogDiv: {
        add: false
      },
      currentPage: 1,
      loadingType: true,
      pagesize: 20,
      handle_name: "", //处理人
      rightW: "",
      tableHeight: "auto",
      type: 0
    };
  },
  created() {
    const that = this;
    that.access_token = localStorage.getItem("accessToken");
    if (that.access_token != null) {
      that.access_token = JSON.parse(this.access_token);
      this.GetCouponList();
      //获取个人信息
      that.infrom = JSON.parse(localStorage.getItem("informData"));
    } else {
      that.$message.error("登录已失效，请重新登录！");
      localStorage.clear();
      that.$router.replace({
        path: "/"
      });
    }
    let flg = localStorage.getItem("leftW");
    if (flg == "true") {
      var wid = 180;
    } else {
      var wid = 60;
    }
    if (window.innerWidth <= 1200) {
      this.rightW = 1200 - wid + "px";
    } else if (window.innerWidth > 1920) {
      this.rightW = 1920 - wid + "px";
    } else {
      this.rightW = window.innerWidth - wid + "px";
    }
    window.onresize = () => {
      let flg = localStorage.getItem("leftW");
      if (flg == "true") {
        var wid = 180;
      } else {
        var wid = 60;
      }
      if (window.innerWidth <= 1200) {
        this.rightW = 1200 - wid + "px";
        var hig = 218;
      } else if (window.innerWidth > 1920) {
        this.rightW = 1920 - wid + "px";
        var hig = 198;
      } else {
        this.rightW = window.innerWidth - wid + "px";
        var hig = 198;
      }
      setTimeout(() => {
        this.tableHeight =
          window.innerHeight - $(".coupon_search").height() - hig;
      }, 0);
    };
    window.addEventListener("keydown", this.EventEnter);
  },
  props: ["rightT"],
  watch: {
    rightT() {
      let ww;
      if (window.innerWidth <= 1200) {
        ww = 1200;
      } else if (window.innerWidth > 1920) {
        ww = 1920;
      } else {
        ww = window.innerWidth;
      }
      if (this.rightT) {
        this.rightW = ww - 180 + "px";
      } else {
        this.rightW = ww - 60 + "px";
      }
    },
    type() {
      if (this.type == 0) {
        this.add = {
          type: 0,
          unit: "G",
          checked: false,
          dateType: 0,
          startDate: "",
          endDate: "",
          num: "",
          date: "",
          typeFlg: [{ id: 0, name: "流量券" }, { id: 1, name: "现金券" }]
        };
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("keydown", this.EventEnter);
    next();
  },
  methods: {
    EventEnter(e) {
      const that = this;
      let ev = document.all ? window.event : e;
      if (ev.keyCode === 13) {
        that.GetSearchList();
      }
    },
    GetSearchList() {
      this.currentPage = 1;
      this.GetCouponList();
    },
    Clear() {
      (this.reCoupon.date = ""), (this.reCoupon.type = -1);
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      }
      return "";
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.GetCouponList();
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this.GetCouponList();
    },
    // 优惠券列表
    GetCouponList() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/coupon/tmp/list",
          method: "post",
          params: {
            access_token: that.access_token,
            date: that.reCoupon.date,
            rct_type: that.reCoupon.type,
            page: that.currentPage,
            rows: that.pagesize
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.couponList = res.data.obj;
            if (that.couponList.data != null) {
              for (let i = 0; i < that.couponList.data.length; i++) {
                that.couponList.data[i].rct_type_val =
                  that.couponList.data[i].rct_type === 0 ? "流量券" : "现金券";
                that.couponList.data[i].rct_vaildTime =
                  that.couponList.data[i].rct_inteval === -1
                    ? "永久"
                    : that.couponList.data[i].rct_inteval + " 天";
                that.couponList.data[i].create_date = that.$base.tampToTime(
                  that.couponList.data[i].create_date
                );
              }
            }
            that.tableHeight =
              window.innerHeight - $(".coupon_search").height() - 198;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    // 新增优惠券
    GetIssue(id) {
      const that = this;
      var data;
      // console.log(that.add);
      if (that.add.num == "" || that.add.num <= 0) {
        that.$message.error("请输入正确的额度！");
      } else if (
        (that.add.dateType == 0 && (!that.add.checked && that.add.date <= 0)) ||
        (that.add.dateType == 1 &&
          (that.add.startDate == "" || that.add.endDate == ""))
      ) {
        that.$message.error("请输入正确的期限！");
      } else {
        that.loadingType = true;
        if (that.add.dateType == 0) {
          if (that.add.checked) {
            data = {
              access_token: that.access_token,
              den: that.add.num,
              unit: that.add.unit,
              type: that.add.type,
              interval: -1
            };
          } else {
            data = {
              access_token: that.access_token,
              den: that.add.num,
              unit: that.add.unit,
              type: that.add.type,
              interval: that.add.date
            };
          }
        } else {
          data = {
            access_token: that.access_token,
            den: that.add.num,
            unit: that.add.unit,
            type: that.add.type,
            interval: -2,
            start: that.add.startDate,
            end: that.add.endDate
          };
        }
        if (that.type == 1) {
          data.id = that.add.id;
        }
        that
          .$http({
            url: that.urlHost + "/man/coupon/tmp/issue",
            method: "post",
            params: data,
            timeout: 10000
          })
          .then(res => {
            that.loadingType = false;
            if (res.data.success === "00000000") {
              that.$message.success(res.data.msg);
              that.dialogDiv.add = false;
              that.GetCouponList();
              setTimeout(() => {
                that.add = {
                  type: 0,
                  unit: "G",
                  checked: false,
                  dateType: 0,
                  startDate: "",
                  endDate: "",
                  num: "",
                  date: "",
                  typeFlg: [
                    { id: 0, name: "流量券" },
                    { id: 1, name: "现金券" }
                  ]
                };
              }, 300);
            } else {
              that.$base.err(res, that);
            }
          })
          .catch(err => {
            that.loadingType = false;
            that.$message.error("网络异常！");
          });
      }
    },
    //查看
    view(data) {
      // console.log(data);
      this.add = {
        type: 0,
        unit: data.rct_unit,
        checked: "",
        dateType: 0,
        startDate: "",
        endDate: "",
        num: data.rct_den,
        date: "",
        typeFlg: [{ id: 0, name: "流量券" }, { id: 1, name: "现金券" }]
      };
      if (data.rct_unit == "G") {
        this.add.type = 0;
      } else {
        this.add.type = 1;
      }
      if (data.rct_inteval == -1) {
        this.add.checked = true;
        this.add.dateType = 0;
      } else if (data.rct_inteval == -2) {
        this.add.checked = false;
        this.add.startDate = data.rct_start;
        this.add.endDate = data.rct_end;
        this.add.dateType = 1;
      } else {
        this.add.checked = false;
        this.add.date = data.rct_inteval;
        this.add.dateType = 0;
      }
      this.type = 1;
      this.dialogDiv.add = true;
      this.add.id = data.rct_id;
      // this.GetIssue(data.rct_id)
    },
    //删除
    delItem(data, index) {
      let _that = this;
      let id = data[index].rct_id;
      _that
        .$confirm("是否删除？", "提示")
        .then(() => {
          _that
            .$http({
              url: _that.urlHost + "/man/coupon/tmp/del",
              method: "post",
              params: {
                access_token: _that.access_token,
                id: id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                _that.$message({
                  message: "已删除！",
                  type: "success",
                  center: true
                });
                data.splice(index, 1);
              } else {
                _that.$base.err(res, _that);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    }
  },
  components: {
    Loading
  }
};
</script>

<style lang="less">
.coupon {
  position: relative;
  height: 100%;
  overflow: auto;
  .coupon_top {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    color: #999;
    border-bottom: 1px solid #aaa;
    span {
      font-size: 15px;
    }
  }
  .coupon_box {
    position: relative;
    padding-left: 20px;
    height: calc(100% - 45px);
    display: flex;
    flex-direction: column;
    // background:#ccc;
    .coupon_search {
      padding-top: 15px;
      > div {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        font-size: 14px;
        > div {
          display: flex;
          align-items: center;
          margin-right: 30px;
          padding-bottom: 15px;
        }
        span {
          word-break: keep-all;
          text-align: right;
        }
        input {
          height: 30px;
          max-width: 150px;
        }
        .el-input__suffix-inner i,
        .el-input__prefix i {
          max-width: 150px;
          height: 30px;
          line-height: 30px;
        }
        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          max-width: 150px;
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .searchBtn {
      padding-bottom: 15px;
    }
    .coupon_table {
      position: relative;
      flex: 1;
      width: 100%;
      overflow: auto;
      .el-table {
        border: 1px solid #ccc;
        th {
          background: #e2eff8 !important;
          color: #000 !important;
          border-left: 1px solid #ccc;
          border-bottom: 1px solid #ccc !important;
        }
        th:first-child {
          border-left: 0 !important;
        }
        td {
          border: 1px solid #ccc !important;
          border-right: 0 !important;
          border-top: 0 !important;
        }
        td:first-child {
          border-left: 0 !important;
        }
        .warning-row {
          background: #f4f9fc;
        }
        .el-table__row .cell {
          white-space: pre !important;
        }
        .lengs {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .col_red {
          color: red;
        }
        .col_green {
          color: green;
        }
      }
    }
    .el-pagination__total {
      display: none !important;
    }
    .el-pagination {
      padding: 0;
      margin: 0;
    }
    .coupon_pages {
      z-index: 1;
      position: relative;
      padding: 5px;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      background-color: #fff;
      margin: -1px 0 0 0.5px;
    }
    .dialogDIv {
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0 !important;
      }
      .dialoBox {
        font-size: 16px;
        background: #fff;
        width: 600px;
      }
      .dialoTitle {
        display: flex;
        justify-content: space-between;
        background: #3a9cf7;
        color: #fff;
        padding: 10px 20px;
      }
      .dialoContent {
        padding: 20px;
        > div {
          display: flex;
          align-items: center;
          padding-bottom: 20px;
          > span {
            width: 120px;
            text-align: right;
          }
          > div {
            flex: 1;
            display: flex;
            align-items: center;
          }
        }
        > div:nth-child(1) {
          .el-input {
            margin-right: 10px;
          }
          .el-input {
            width: 170px;
          }
        }
        > div:nth-child(3) {
          .el-input {
            margin-right: 10px;
          }
          .el-input {
            width: 170px;
          }
          .el-input__inner {
            padding-right: 0;
          }
          .checked {
            margin-left: 30px;
            .el-checkbox__inner {
              width: 16px;
              height: 16px;
            }
            .el-checkbox__label {
              font-size: 16px;
            }
          }
        }
        > div:last-child {
          display: flex;
          width: 50%;
          margin: 20px auto 0;
          justify-content: space-around;
          .el-button {
            padding: 10px 30px;
            margin-right: 30px;
          }
        }
      }
    }
  }
}
</style>
