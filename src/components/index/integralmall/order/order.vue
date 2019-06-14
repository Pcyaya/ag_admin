<template>
  <div class="order" :style="{'width':rightW}">
    <Loading v-if="loadingType"></Loading>
    <div class="order_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：积分商城管理 >
        <span>
          <el-button type="text">订单管理</el-button>
        </span>
      </div>
    </div>

    <div class="order_box">
      <!-- 查询条件 -->
      <div class="order_search">
        <div>
          <div>
            <span>用户账号：</span>
            <el-input></el-input>
          </div>
          <!-- <div>
                        <span>设备编码：</span>
                        <el-input v-model="reApp.num"></el-input>
          </div>-->
          <div>
            <span>订单编号：</span>
            <el-input v-model="reApp.num"></el-input>
          </div>
          <div>
            <span>交易名称：</span>
            <el-input></el-input>
          </div>
          <div>
            <span>交易方式：</span>
            <el-input></el-input>
          </div>
          <div>
            <span>交易时间：</span>
            <el-date-picker
              v-model="reApp.transaction_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div>
            <span>订单状态：</span>
            <el-select v-model="reApp.status">
              <el-option
                v-for="item in tags.status"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <el-button @click="handleCurrentChange(1)" type="primary" size="mini">
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
          <!-- <el-button @click="addList" type="success"><i class="el-icon-plus"></i> 新建版本</el-button> -->
        </div>
      </div>

      <!-- 列表 -->
      <div class="order_table">
        <el-table
          :data="dataList.data"
          style="width: 100%"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="49" align="center" label="编号"></el-table-column>
          <el-table-column prop="name" align="center" label="用户账号"></el-table-column>
          <!-- <el-table-column
                    prop="commodity_num"
                    align="center"
                    label="设备编码">
          </el-table-column>-->
          <el-table-column prop="ro_num" align="center" label="订单号编码"></el-table-column>
          <!-- <el-table-column
                    prop="name"
                    align="center"
                    label="交易名称">
          </el-table-column>-->
          <el-table-column prop="ro_amount" align="center" label="交易数量"></el-table-column>
          <el-table-column prop="ro_price" align="center" label="交易金额"></el-table-column>
          <!-- <el-table-column
                    prop="pay_name"
                    align="center"
                    label="交易方式">
          </el-table-column>-->
          <el-table-column align="center" label="交易时间">
            <template slot-scope="scope">
              <div>{{$base.tampToTime(scope.row.create_date)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单状态">
            <template slot-scope="scope">
              <div
                :class="{'col_green':scope.row.ro_status == 0,'col_red':scope.row.ro_status == -99}"
              >{{roStatus(scope.row.ro_status)}}</div>
            </template>
          </el-table-column>

          <!-- <el-table-column
                    fixed="right"
                    align="center"
                    width="170"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="view(dataList.data,scope.$index)" type="primary" size="small">编辑</el-button>
                        <el-button @click="delItem(dataList.data,scope.$index)" type="danger" size="mini">删除</el-button>
                    </template>
          </el-table-column>-->
        </el-table>

        <!-- 添加人员     -->
        <el-dialog class="dialogDIv" width="600px" title :visible.sync="dialogDiv.add">
          <div class="dialoBox">
            <div class="dialoTitle">
              <div>APP版本添加</div>
              <div @click="dialogDiv.add = false" class="cur">X</div>
            </div>
            <div class="dialoContent">
              <div>
                <span>版本号：</span>
                <div>
                  <el-input v-model="add.num"></el-input>
                </div>
              </div>
              <div>
                <span>更新类容：</span>
                <div>
                  <el-input type="textarea" :rows="5" v-model="add.content"></el-input>
                </div>
              </div>
              <div>
                <span>应用平台：</span>
                <div class="bm">
                  <div
                    @click="add.platform = 0"
                    :class="{'active':add.platform == 0,'cur':add.platform != 0}"
                  >android</div>
                  <div
                    @click="add.platform = 1"
                    :class="{'active':add.platform == 1,'cur':add.platform != 1}"
                  >ios</div>
                </div>
              </div>
              <div>
                <span>上传APP：</span>
                <div class="upInut">
                  <el-input v-model="add.name"></el-input>
                  <input type="file" v-show="0" ref="file" @change="upFlie">
                  <div class="up">
                    <el-button type="text" @click="openFlie">
                      <i class="el-icon-document"></i>
                    </el-button>
                  </div>
                </div>
              </div>
              <div>
                <span>apk大小：</span>
                <div style="margin-top: 7px;">
                  <div>{{add.size}}</div>
                </div>
              </div>
              <div>
                <span>是否强制更新：</span>
                <div style="margin-top: 10px;">
                  <el-radio v-model="add.flg" :label="1">是</el-radio>
                  <el-radio v-model="add.flg" :label="0">否</el-radio>
                </div>
              </div>
              <div>
                <el-button size="mini" type="primary" @click="GetIssue">完成</el-button>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 分页 -->
      <div class="order_pages">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="20"
          :page-sizes="[5,10,20,30,50,100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="dataList.total"
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
      reApp: {
        num: "",
        visitor: "",
        commodity_num: "",
        business: -1,
        status: -1,
        transaction_type: -1,
        transaction_date: ""
      },
      add: {},
      tags: {
        status: [
          { id: -1, name: "全部" },
          { id: 0, name: "待支付" },
          { id: 1, name: "支付成功" },
          { id: 2, name: "已退款" },
          { id: 99, name: "完成" },
          { id: -99, name: "取消订单" },
          { id: -98, name: "支付已过期" }
        ]
      },
      dataList: {},
      dialogDiv: {
        add: false
      },
      currentPage: 1,
      pagesize: 20,
      loadingType: false,
      rightW: ""
    };
  },
  created() {
    const that = this;
    that.access_token = localStorage.getItem("accessToken");
    if (that.access_token != null) {
      that.access_token = JSON.parse(this.access_token);
      this.GetList();
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
        var hig = 175;
      } else if (window.innerWidth > 1920) {
        this.rightW = 1920 - wid + "px";
        var hig = 155;
      } else {
        this.rightW = window.innerWidth - wid + "px";
        var hig = 155;
      }
      setTimeout(() => {
        this.tableHeight =
          window.innerHeight - $(".order_search").height() - hig;
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
        that.handleCurrentChange(1);
      }
    },
    Clear() {
      this.reApp = {
        num: "",
        visitor: "",
        commodity_num: "",
        business: -1,
        status: -1,
        transaction_type: -1,
        transaction_date: ""
      };
    },
    //订单状态
    roStatus(num) {
      if (num == 0) {
        return "待支付";
      } else if (num == 1) {
        return "支付成功";
      } else if (num == 2) {
        return "已退款";
      } else if (num == 99) {
        return "完成";
      } else if (num == -99) {
        return "取消订单";
      } else if (num == -98) {
        return "支付已过期";
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      }
      return "";
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.GetList();
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this.GetList();
    },
    openFlie() {
      this.$refs.file.click();
    },
    upFlie() {
      // console.log(this.$refs.file.files[0]);
      if (this.$refs.file.files[0] != undefined) {
        var size = (this.$refs.file.files[0].size / 1024).toFixed(0);
        if (size >= 0 && size < 1000) {
          size = size + " KB";
        } else {
          size = (size / 1000).toFixed(2) + " MB";
        }
        this.add.size = size;
        this.add.name = this.$refs.file.files[0].name;
        // this.add.size = (this.$refs.file.files[0].size/1024).toFixed(0)+ ' KB'
      }
    },
    // 人员列表
    GetList() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/apporder/list",
          method: "post",
          params: {
            access_token: that.access_token,
            business: that.reApp.business, //交易类型 0.商品，1.优惠券 2.流量 3.提现
            num: that.reApp.num, //订单编码
            visitor: that.reApp.visitor, //商品编码
            transaction_type: that.reApp.transaction_type, //交易方式
            status: that.reApp.status, //交易方式
            transaction_date: that.reApp.transaction_date, //交易时间
            page: that.currentPage,
            rows: that.pagesize
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.dataList = res.data.obj;
            that.tableHeight =
              window.innerHeight - $(".order_search").height() - 155;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    // 新增人员
    GetIssue() {
      const that = this;

      // that.$http({
      //     url: that.urlHost+'/man/user/issue',
      //     method: 'post',
      //     params: data,
      //     timeout: 10000
      // })
      // .then((res)=>{
      //     that.loadingType = false
      //     if(res.data.success === "00000000"){
      //         that.$message.success(res.data.msg)
      that.dialogDiv.add = false;
      //         that.add = {
      //             num: '',//版本号
      //             content: '',   //更新类容
      //             platform: 0,//应用平台
      //             flg: ''

      //         }
      //     }else{
      //         that.$base.err(res,that)
      //     }
      // })
      // .catch((err)=> {
      //     that.loadingType = false
      //     that.$message.error("网络异常！")
      // })
    },
    //添加
    addList() {
      this.dialogDiv.add = true;
      // this.add = {
      //     num: '',//版本号
      //     content: '',   //更新类容
      //     platform: 0,//应用平台
      //     flg: ''

      // }
    },

    //删除
    delItem(data, index) {
      let _that = this;
      let id = data[index].au_id;
      _that
        .$confirm("是否删除？", "提示")
        .then(() => {
          // _that.$http({
          //     url: _that.urlHost + '/man/user/del',
          //     method: 'post',
          //     params: {
          //         access_token: _that.access_token,
          //         id: id
          //     }
          // })
          // .then((res)=>{
          //     if(res.data.success === '00000000'){
          //         _that.$message({
          //             message: '已删除！',
          //             type: 'success',
          //             center: true
          //         })
          data.splice(index, 1);
          //         _that.GetList()
          //     }else{
          //         _that.$base.err(res,_that)
          //     }
          // })
          // .catch((err)=>{
          //     console.log(err)
          // })
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
.order {
  position: relative;
  height: 100%;
  overflow: auto;
  .order_top {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    color: #999;
    border-bottom: 1px solid #aaa;
    span {
      font-size: 15px;
    }
  }
  .order_box {
    position: relative;
    padding-left: 20px;
    height: calc(100% - 45px);
    display: flex;
    flex-direction: column;
    .order_search {
      padding-top: 15px;
      > div {
        display: flex;
        flex-wrap: wrap;
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
    .order_table {
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
        // .el-table__body-wrapper{
        //     border-top: 1px solid #3A9CF7 !important;
        // }
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
    .order_pages {
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
        font-size: 14px;
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
        flex: 1;
        > div {
          display: flex;
          // align-items: center;
          padding-bottom: 15px;
          > span {
            text-align: right;
            width: 100px;
            margin-top: 7px;
          }
          > div {
            flex: 1;
            display: flex;
            align-items: center;
          }
          .re {
            color: red;
            margin-left: 15px;
          }
          .el-input__inner {
            height: 35px;
            line-height: 35px;
            padding: 0 5px;
          }
        }
        .up {
          position: relative;
          width: 0;
          height: 0;
          .el-button {
            position: absolute;
            left: -25px;
            top: -22px;
            i {
              font-size: 18px;
            }
          }
        }
        .upInut {
          input {
            padding-right: 30px;
          }
        }
        .bm {
          display: flex;
          margin-top: 2px;
          > div {
            padding: 5px 0;
            width: 70px;
            text-align: center;
            border-radius: 2px;
            border: 1px solid #ccc;
            margin-right: 10px;
          }
        }
        .active {
          background: #3a9cf7;
          color: #fff;
          border-color: #3a9cf7 !important;
        }
        .none {
          background: #fff;
          color: #333;
          border-color: #ccc !important;
        }
        textarea {
          resize: none;
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
    .dialogDIv1 {
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0 !important;
      }
      .el-dialog {
        margin-top: 40vh !important;
        margin-left: 100vh;
      }
      .dialoBox {
        font-size: 14px;
        background: #fff;
        width: 250px;
        padding: 20px;
        #addTreeDemo {
          li {
            margin-top: 5px;
            font-size: 18px;
          }
          .noline_close,
          .noline_open {
            margin-right: 5px;
          }
        }
        .ztree li a.curSelectedNode {
          background: rgba(0, 0, 0, 0);
          border: 0;
          color: #3a9cf7;
        }
        .ztree li a {
          text-decoration: none !important;
          font-size: 16px;
        }
        .ztree li span {
          font-size: 100%;
        }

        .btn {
          display: flex;
          justify-content: flex-end;
          .el-button {
            padding: 5px 10px;
          }
        }
      }
    }
  }
}
</style>
