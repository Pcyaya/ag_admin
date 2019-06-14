<template>
  <div class="user" :style="{'width':rightW}">
    <Loading v-if="loadingType"></Loading>
    <div class="user_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：系统设置 >
        <span>
          <el-button type="text">管理人员管理</el-button>
        </span>
      </div>
    </div>

    <div class="user_box">
      <!-- 查询条件 -->
      <div class="user_search">
        <div>
          <div>
            <span>工号：</span>
            <el-input v-model="reUser.no"></el-input>
          </div>
          <div>
            <span>姓名：</span>
            <el-input v-model="reUser.name"></el-input>
          </div>
          <div>
            <span>部门：</span>
            <el-input v-model="reUser.departs"></el-input>
          </div>
          <div>
            <span>职位：</span>
            <el-input v-model="reUser.position"></el-input>
          </div>
          <div>
            <span>手机号：</span>
            <el-input v-model="reUser.phone"></el-input>
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
          <el-button @click="addList" size="mini">
            <i class="el-icon-plus"></i> 添加管理人员
          </el-button>
        </div>
      </div>

      <!-- 列表 -->
      <div class="user_table">
        <el-table
          :data="UserList.data"
          :height="tableHeight"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="49" align="center" label="编号"></el-table-column>
          <el-table-column prop="au_no" align="center" label="工号"></el-table-column>
          <el-table-column prop="au_name" align="center" label="姓名"></el-table-column>
          <el-table-column align="center" label="部门">
            <template slot-scope="scope">
              <div :title="scope.row.departs" style="max-height:50px;">{{scope.row.departs}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="au_position" align="center" label="职位"></el-table-column>
          <el-table-column prop="au_phone" align="center" label="手机号"></el-table-column>
          <!-- <el-table-column
                    prop="au_pwd"
                    align="center"
                    label="登录密码">
          </el-table-column>-->
          <el-table-column prop="au_email" align="center" label="邮箱"></el-table-column>

          <el-table-column align="center" fixed="right" width="170" label="操作">
            <template slot-scope="scope">
              <el-button @click="view(UserList.data,scope.$index)" type="primary" size="mini">编辑</el-button>
              <el-button @click="delItem(UserList.data,scope.$index)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加人员     -->
        <el-dialog class="dialogDIv" width="400px" title :visible.sync="dialogDiv.add">
          <div class="dialoBox">
            <div class="dialoTitle">
              <div v-if="addType==0">添加管理人员</div>
              <div v-if="addType==1">编辑</div>
              <div @click="dialogDiv.add = false" class="cur">X</div>
            </div>
            <div class="dialoContents">
              <div>
                <span>工&nbsp;&nbsp;&nbsp;号：</span>
                <div>
                  <el-input v-model="add.no"></el-input>
                </div>
                <p class="re">*</p>
              </div>
              <div>
                <span>姓&nbsp;&nbsp;&nbsp;名：</span>
                <div>
                  <el-input v-model="add.name" placeholder maxlength="9"></el-input>
                </div>
                <p class="re">*</p>
              </div>
              <div class="bm">
                <div>
                  <span>部&nbsp;&nbsp;&nbsp;门：</span>
                  <div v-if="addType==0">
                    <div class="bm-flg" v-for="(item, index) in rsPartsData" :key="index">
                      {{item.name}}
                      <i
                        @click="del_close(rsPartsData, index)"
                        class="el-icon-circle-close-outline cur"
                      ></i>
                    </div>
                  </div>
                  <div v-if="addType==1">
                    <div class="bm-flg" v-for="(item, index) in rsPartsData" :key="index">{{item}}</div>
                  </div>
                </div>
                <div v-if="addType==0">
                  <el-button type="primary" @click="selDepart">选择部门</el-button>
                </div>
              </div>
              <div>
                <span>职&nbsp;&nbsp;&nbsp;位：</span>
                <div>
                  <el-input v-model="add.position" placeholder maxlength="9"></el-input>
                </div>
                <p class="re">*</p>
              </div>
              <div>
                <span>手机号：</span>
                <div>
                  <el-input v-model="add.phone" placeholder maxlength="11"></el-input>
                </div>
                <p class="re">*</p>
              </div>
              <div v-if="addType == 0">
                <span>密&nbsp;&nbsp;&nbsp;码：</span>
                <div>
                  <el-input v-model="add.pwd" placeholder maxlength="11"></el-input>
                </div>
                <p class="re">*</p>
              </div>
              <div>
                <span>邮&nbsp;&nbsp;&nbsp;箱：</span>
                <div>
                  <el-input v-model="add.email" placeholder></el-input>
                </div>
                <p class="re">*</p>
              </div>
              <div>
                <el-button size="mini" type="primary" @click="GetIssue">完成</el-button>
              </div>
            </div>
          </div>
        </el-dialog>

        <!-- 选择部门 -->
        <el-dialog class="dialogDIv9" width="300px" title :visible.sync="dialogDiv.bm">
          <div class="dialoBox">
            <div id="addTreeDemo" class="ztree"></div>
            <div class="btn">
              <el-button @click="dialogDiv.bm = false" size="mini">取消</el-button>
              <el-button type="primary" @click="addbtn" size="mini">完成</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 分页 -->
      <div class="user_pages">
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
      reUser: {
        no: "", //工号
        name: "", //姓名
        departs: "", //部门
        position: "", //职位
        phone: "" //联系方式
      },
      add: {
        no: "", //工号
        name: "", //姓名
        position: "", //职位
        departs: "", //部门
        phone: "",
        pwd: "",
        email: ""
      },
      addType: "",
      UserList: {},
      dialogDiv: {
        add: false,
        bm: false
      },
      currentPage: 1,
      pagesize: 20,
      departsData: {}, //部门tree
      rightsList: [],
      rightsListN: [],
      rsPartsData: [],
      loadingType: true,
      addSetting: {
        check: {
          enable: true,
          nocheckInherit: true,
          chkboxType: { Y: "", N: "" }
        },
        view: {
          showLine: false,
          showIcon: false
          // dblClickExpand: false
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          beforeClick: this.addbeforeClick,
          onClick: this.addzTreeOnClick,
          onCheck: this.addzTreeOnCheck
        }
      },
      rightW: "",
      tableHeight: "auto"
    };
  },
  created() {
    const that = this;
    that.access_token = localStorage.getItem("accessToken");
    if (that.access_token != null) {
      that.access_token = JSON.parse(this.access_token);
      this.GetUserList();
      //获取个人信息
      that.infrom = JSON.parse(localStorage.getItem("informData"));
      this.key = that.infrom.access_name;
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
          window.innerHeight - $(".user_search").height() - hig;
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
      this.reUser = {
        no: "", //工号
        name: "", //姓名
        departs: "", //部门
        position: "", //职位
        phone: "" //联系方式
      };
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
    // 人员列表
    GetUserList() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/user/list",
          method: "post",
          params: {
            access_token: that.access_token,
            no: that.reUser.no,
            name: that.reUser.name,
            phone: that.reUser.phone,
            position: that.reUser.position,
            depart: that.reUser.departs,
            page: that.currentPage,
            rows: that.pagesize
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.UserList = res.data.obj;
            that.tableHeight =
              window.innerHeight - $(".user_search").height() - 198;
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
      that.loadingType = true;
      var data;
      if (that.addType === 0) {
        //新增
        data = {
          access_token: that.access_token,
          no: that.add.no, //工号
          name: that.add.name, //姓名
          position: that.add.position, //职位
          departs: JSON.stringify(that.rightsList), //部门
          phone: that.add.phone,
          pwd: that.add.pwd,
          email: that.add.email
        };
      } else {
        //编辑
        data = {
          access_token: that.access_token,
          id: that.add.id,
          no: that.add.no, //工号
          name: that.add.name, //姓名
          position: that.add.position, //职位
          // departs: JSON.stringify(that.rightsList),   //部门
          phone: that.add.phone,
          pwd: that.add.pwd,
          email: that.add.email
        };
      }
      that
        .$http({
          url: that.urlHost + "/man/user/issue",
          method: "post",
          params: data,
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.$message.success(res.data.msg);
            that.dialogDiv.add = false;
            that.GetUserList();
            that.add = {
              no: "", //工号
              name: "", //姓名
              position: "", //职位
              departs: "", //部门
              phone: "",
              email: ""
            };
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    //添加
    addList() {
      this.addType = 0;
      this.dialogDiv.add = true;
      this.add = {
        no: "", //工号
        name: "", //姓名
        position: "", //职位
        departs: "", //部门
        phone: "",
        pwd: "",
        email: ""
      };
      this.rsPartsData = [];
    },
    //编辑
    view(data, index) {
      this.addType = 1;
      this.dialogDiv.add = true;
      // console.log(data[index])
      var obj = data[index];
      if (obj.departs != "" && obj.departs != null) {
        var list = obj.departs.split(",");
      } else {
        var list = "";
      }
      this.add = {
        id: obj.au_id,
        no: obj.au_no,
        name: obj.au_name,
        position: obj.au_position,
        phone: obj.au_phone,
        pwd: obj.au_pwd,
        email: obj.au_email
      };
      this.rsPartsData = list;
    },
    //删除
    delItem(data, index) {
      let _that = this;
      let id = data[index].au_id;
      _that
        .$confirm("是否删除？", "提示")
        .then(() => {
          _that
            .$http({
              url: _that.urlHost + "/man/user/del",
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
                // data.splice(index,1)
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
    },
    //部门tree 列表
    Getdeparts() {
      const that = this;
      that.loading = true;
      that
        .$http({
          url: that.urlHost + "/man/depart/departs",
          method: "post",
          params: {
            access_token: that.access_token
          },
          timeout: 10000
        })
        .then(res => {
          that.loading = false;
          if (res.data.success === "00000000") {
            that.departsData = that.getJsonData(res.data.obj);
            $.fn.zTree.init(
              $("#addTreeDemo"),
              that.addSetting,
              that.departsData
            );
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loading = false;
          that.$message.error("网络异常！");
        });
    },
    //选择部门
    selDepart() {
      this.dialogDiv.bm = true;
      this.Getdeparts();
      // console.log(this.rightsListN)
    },
    addzTreeOnCheck(e, treeId, treeNode) {
      var treeObj = $.fn.zTree.getZTreeObj("addTreeDemo"),
        nodes = treeObj.getCheckedNodes(true),
        v = "",
        n = "";
      for (var i = 0; i < nodes.length; i++) {
        v += nodes[i].id + ",";
        n += nodes[i].name + ",";
      }
      var str = v.substr(0, v.length - 1);
      var strN = n.substr(0, n.length - 1);
      this.rightsList = str.split(",");
      this.rightsListN = strN.split(",");
      // console.log(this.rightsListN)
    },
    addbtn() {
      let list = this.rightsList;
      this.rsPartsData = [];
      for (let i = 0; i < list.length; i++) {
        this.rsPartsData.push({
          name: this.rightsListN[i],
          id: this.rightsList[i]
        });
      }
      this.dialogDiv.bm = false;
    },
    del_close(data, index) {
      data.splice(index, 1);
      this.rightsList.splice(index, 1);
      this.rightsListN.splice(index, 1);
    },
    //递归 checked
    getJsonData(data) {
      for (let i = 0; i < data.length; i++) {
        data[i].open = true;
        for (let j = 0; j < this.rsPartsData.length; j++) {
          if (this.rsPartsData[j].id === data[i].id) {
            data[i].checked = true;
          }
        }
        if (data[i].children.length === 0) {
          data[i].children = null;
        } else {
          this.getJsonData(data[i].children);
        }
      }
      return data;
    }
  },
  components: {
    Loading
  }
};
</script>

<style lang="less">
.user {
  position: relative;
  height: 100%;
  overflow: auto;
  .user_top {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    color: #999;
    border-bottom: 1px solid #aaa;
    span {
      font-size: 15px;
    }
  }
  .user_box {
    position: relative;
    padding-left: 20px;
    height: calc(100% - 45px);
    display: flex;
    flex-direction: column;
    .user_search {
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
    .searchBtn {
      padding-bottom: 15px;
    }
    .user_table {
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
    .user_pages {
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
        width: 400px;
      }
      .dialoTitle {
        display: flex;
        justify-content: space-between;
        background: #3a9cf7;
        color: #fff;
        padding: 10px 20px;
      }
      .dialoContents {
        padding: 20px;
        flex: 1;
        > div {
          display: flex;
          align-items: center;
          padding-bottom: 15px;
          > span {
            text-align: right;
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
        .bm {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          > div:nth-child(1) {
            display: flex;
            align-items: flex-start;
            > div {
              display: flex;
              flex-wrap: wrap;
              .bm-flg {
                border: 1px solid #999;
                background: #f9f9f9;
                color: #888;
                border-radius: 2px;
                padding: 2px 10px;
                margin: 0 5px 5px 0;
                i {
                  color: #333;
                }
              }
            }
          }
          > div {
            .el-button {
              padding: 5px 20px;
              margin: 10px 55px;
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
    .dialogDIv9 {
      .dialoBox {
        display: flex;
        width: 200px;
        flex-direction: column;
        align-items: center;
        > div:nth-child(2) {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
