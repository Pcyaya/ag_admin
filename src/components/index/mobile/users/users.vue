<template>
  <div class="users" :style="{'width':rightW}">
    <Loading v-if="loadingType"></Loading>
    <div class="users_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：APP管理 >
        <span>
          <el-button type="text">用户管理</el-button>
        </span>
      </div>
    </div>

    <div class="users_box">
      <!-- 查询条件 -->
      <div class="users_search">
        <div>
          <div>
            <span>用户昵称：</span>
            <el-input v-model="reApp.name" placeholder="输入昵称"></el-input>
          </div>
          <div>
            <span>用户账号：</span>
            <el-input v-model="reApp.phone" placeholder="输入账号"></el-input>
          </div>
          <div>
            <span>性别：</span>
            <el-select v-model="reApp.sex" placeholder="请选择">
              <el-option
                v-for="item in Flgs.sex"
                :key="item.index"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>用户来源：</span>
            <el-select v-model="reApp.source" placeholder="请选择">
              <el-option
                v-for="item in Flgs.source"
                :key="item.index"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>注册时间：</span>
            <el-date-picker
              v-model="reApp.reg_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div>
            <span>是否绑定设备：</span>
            <el-select v-model="reApp.bind_flg" placeholder="请选择">
              <el-option
                v-for="item in Flgs.bind_flg"
                :key="item.index"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>导游认证：</span>
            <el-select v-model="reApp.valid_schedule" placeholder="请选择">
              <el-option
                v-for="item in Flgs.valid_schedule"
                :key="item.index"
                :label="item.name"
                :value="item.val"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>是否冻结：</span>
            <el-select v-model="reApp.freeze" placeholder="请选择">
              <el-option
                v-for="item in Flgs.freeze"
                :key="item.index"
                :label="item.name"
                :value="item.key"
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
          <!-- <el-button @click="addList" type="success"><i class="el-icon-plus"></i> 新建版本</el-button> -->
        </div>
      </div>

      <!-- 列表 -->
      <div class="users_table">
        <el-table
          :data="UserList.data"
          border
          :height="tableHeihgt"
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="49" align="center" label="编号"></el-table-column>
          <el-table-column align="center" width="150" label="用户昵称">
            <template slot-scope="scope">
              <div>{{scope.row.rv_name || scope.row.rv_num}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="rv_phone" width="100" align="center" label="用户账号"></el-table-column>
          <el-table-column align="center" width="50" label="性别">
            <template slot-scope="scope">
              <div>{{scope.row.rv_sex == 0?'男':'女'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="rv_age" width="70" align="center" label="出生日期">
            <template slot-scope="scope">
              <div v-if="scope.row.rv_age != null">{{$base.tampToTime(scope.row.rv_age,0)}}</div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column prop="source_name" align="center" label="用户来源"></el-table-column>
          <el-table-column prop="create_date" align="center" width="130" label="注册时间">
            <template slot-scope="scope">
              <div>{{$base.tampToTime(scope.row.create_date)}}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column
                    prop="trading_type"
                    align="center"
                    label="角色">
          </el-table-column>-->
          <el-table-column align="center" width="60" label="是否绑定设备">
            <template slot-scope="scope">
              <div>{{scope.row.bind_flg== 1 ? '是':'否'}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="绑定设备编码">
            <template slot-scope="scope">
              <div>{{scope.row.rv_spk_num}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="status_name" align="center" label="导游身份认证"></el-table-column>
          <el-table-column prop="coin_amount" align="center" width="60" label="游币数"></el-table-column>
          <el-table-column prop="convert_amount" align="center" width="60" label="游币兑换数"></el-table-column>
          <el-table-column align="center" width="130" label="最后一次登录时间">
            <template slot-scope="scope">
              <div>{{$base.tampToTime(scope.row.update_date)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="rv_freeze" align="center" label="账号状态">
            <template slot-scope="scope">
              <div
                :class="{'col_red':scope.row.rv_freeze == 1}"
              >{{scope.row.rv_freeze==0?'正常':'已冻结'}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" width="170" label="操作">
            <template slot-scope="scope">
              <!-- <el-button @click="view(AppData.data,scope.$index)" type="primary" size="small">编辑</el-button> -->
              <el-button
                v-if="UserList.data[scope.$index].rv_freeze == 0"
                @click="OptItem(UserList.data[scope.$index].rv_id,UserList.data[scope.$index].rv_freeze)"
                type="danger"
                size="mini"
              >冻结</el-button>
              <el-button
                v-else
                @click="OptItem(UserList.data[scope.$index].rv_id,UserList.data[scope.$index].rv_freeze)"
                type="primary"
                size="mini"
              >解冻</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="users_pages">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="20"
          :page-sizes="[5,10,20,30,50,100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="UserList.total"
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
        name: "",
        phone: "",
        sex: -1,
        source: -1,
        reg_date: "",
        bind_flg: -1,
        valid_schedule: -3,
        freeze: -1
      },
      Flgs: {
        sex: [
          { key: -1, name: "全部" },
          { key: 1, name: "女" },
          { key: 0, name: "男" }
        ],
        source: [
          { key: -1, name: "全部" },
          { key: 1, name: "ios" },
          { key: 0, name: "android" }
        ],
        bind_flg: [
          { key: -1, name: "全部" },
          { key: 1, name: "是" },
          { key: 0, name: "否" }
        ],
        valid_schedule: [
          { key: -3, name: "全部" },
          { key: -2, name: "未认证" },
          { key: -1, name: "待验证" },
          { key: 0, name: "验证中" },
          { key: 1, name: "验证通过" },
          { key: 2, name: "验证失败" },
          { key: 3, name: "验证失效" }
        ],
        freeze: [
          { key: -1, name: "全部" },
          { key: 1, name: "是" },
          { key: 0, name: "否" }
        ]
      },
      add: {
        num: "", //版本号
        name: "",
        content: "", //更新类容
        platform: 0, //应用平台
        flg: 1,
        size: 0
      },
      UserList: {},
      dialogDiv: {
        add: false
      },
      currentPage: 1,
      pagesize: 20,
      loadingType: false,
      rightW: "",
      tableHeihgt: "auto"
    };
  },
  created() {
    const that = this;
    that.access_token = localStorage.getItem("accessToken");
    if (that.access_token != null) {
      that.access_token = JSON.parse(this.access_token);
      this.GetUserList();
      this.GetValidstatus();
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
        setTimeout(() => {
          this.tableHeihgt =
            window.innerHeight - $(".users_search").height() - 175;
        }, 0);
      } else if (window.innerWidth > 1920) {
        this.rightW = 1920 - wid + "px";
        setTimeout(() => {
          this.tableHeihgt =
            window.innerHeight - $(".users_search").height() - 155;
        }, 0);
      } else {
        this.rightW = window.innerWidth - wid + "px";
        setTimeout(() => {
          this.tableHeihgt =
            window.innerHeight - $(".users_search").height() - 155;
        }, 0);
      }
    };
    window.addEventListener('keydown',this.EventEnter);
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
        that.GetSearchList();
      }
    },
    Clear() {
      this.reApp = {
        name: "",
        phone: "",
        sex: -1,
        source: -1,
        reg_date: "",
        bind_flg: -1,
        valid_schedule: -3,
        freeze: -1
      };
    },
    GetSearchList() {
      this.currentPage = 1;
      this.GetUserList();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      }
      return "";
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.GetUserList();
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this.GetUserList();
    },
    openFlie() {
      this.$refs.file.click();
    },
    upFlie() {
      // console.log(this.$refs.file.files[0] )
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
    GetUserList() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/visitor/list",
          method: "post",
          params: {
            access_token: that.access_token,
            name: that.reApp.name,
            phone: that.reApp.phone,
            source: that.reApp.source,
            sex: that.reApp.sex,
            reg_date: that.reApp.reg_date,
            bind_flg: that.reApp.bind_flg,
            bind_num: "",
            valid_schedule: that.reApp.valid_schedule,
            freeze: that.reApp.freeze,
            page: that.currentPage,
            rows: that.pagesize
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.UserList = res.data.obj;
            that.tableHeihgt =
              window.innerHeight - $(".users_search").height() - 155;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    //游客导游认证状态列表
    GetValidstatus() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/visitor/validstatus",
          method: "post",
          params: {
            access_token: that.access_token
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.Flgs.valid_schedule = [];
            res.data.obj.push({ name: "全部", val: -3 });
            for (let i = 0; i < res.data.obj.length; i++) {
              that.Flgs.valid_schedule.unshift(res.data.obj[i]);
            }
            // that.Flgs.valid_schedule = res.data.obj;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    //删除
    OptItem(id, opt) {
      let _that = this;
      // console.log(opt)
      if (opt == 0) {
        opt = 1;
      } else {
        opt = 0;
      }
      _that
        .$confirm("是否更改此操作？", "提示")
        .then(() => {
          _that
            .$http({
              url: _that.urlHost + "/man/visitor/freeze",
              method: "post",
              params: {
                access_token: _that.access_token,
                id: id,
                opt: opt
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                _that.$message({
                  message: res.data.msg,
                  type: "success",
                  center: true
                });
                _that.GetUserList();
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
.users {
  position: relative;
  height: 100%;
  overflow: auto;
  .users_top {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    color: #999;
    border-bottom: 1px solid #aaa;
    span {
      font-size: 15px;
    }
  }
  .users_box {
    position: relative;
    padding-left: 20px;
    height: calc(100% - 45px);
    display: flex;
    flex-direction: column;
    .users_search {
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
    .users_table {
      position: relative;
      flex: 1;
      // width: calc(100% - 5px);
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
    .users_pages {
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
  }
}
</style>
