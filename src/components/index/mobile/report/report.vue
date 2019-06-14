<template>
  <!-- 举报处理 -->
  <div class="report" :style="{'width':rightW}">
    <Loading v-if="loading"></Loading>
    <div class="report_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：APP维护 >
        <span>
          <el-button type="text">用户举报</el-button>
        </span>
      </div>
    </div>

    <div class="report_box">
      <!-- 查询条件 -->
      <div class="report_search">
        <div>
          <div>
            <span>举报人昵称：</span>
            <el-input v-model="reportData.name" placeholder="举报人昵称"></el-input>
          </div>
          <div>
            <span>举报人账号：</span>
            <el-input v-model="reportData.phone" placeholder="举报人账号"></el-input>
          </div>
          <div>
            <span>性别：</span>
            <el-select v-model="reportData.sex" placeholder="请选择">
              <el-option
                v-for="item in tags.sexFlags"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>举报模块：</span>
            <el-select v-model="reportData.type" placeholder="全部">
              <el-option
                v-for="item in tags.typeTags"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>举报原因：</span>
            <el-select v-model="reportData.why" placeholder="全部">
              <el-option
                v-for="item in tags.whyTags"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>处理人：</span>
            <el-select v-model="reportData.admin" placeholder="全部">
              <el-option
                v-for="item in tags.adminTags"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>处理进程：</span>
            <el-select v-model="reportData.schedule" placeholder="全部">
              <el-option
                v-for="item in tags.scheduleTags"
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
            <el-button @click="searchClear" size="mini">
              <i class="el-icon-search"></i> 清空
            </el-button>
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <div class="report_table">
        <el-table
          :data="reportList.data"
          :height="tableHeight"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="49" align="center" label="编号"></el-table-column>
          <el-table-column prop="name" align="center" width="91" label="举报人昵称"></el-table-column>
          <el-table-column prop="phone" width="115" align="center" label="举报人账号"></el-table-column>
          <el-table-column prop="sex" width="49" align="center" label="性别"></el-table-column>
          <el-table-column prop="rr_type" align="center" width="77" label="举报模块"></el-table-column>
          <el-table-column prop="reported_info" align="center" label="被举报者信息"></el-table-column>
          <el-table-column prop="tags" align="center" label="举报原因"></el-table-column>
          <el-table-column prop="create_date" align="center" width="140" label="举报时间"></el-table-column>
          <el-table-column prop="handle_name" align="center" width="100" label="处理人"></el-table-column>
          <el-table-column width="100" align="center" label="处理进程">
            <template slot-scope="props">
              <div
                v-if="props.row.handle_schedule === 0"
                style="color:green"
              >{{props.row.schedule_name}}</div>
              <div v-else>{{props.row.schedule_name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="results_name" align="center" width="150" label="处理结果"></el-table-column>
          <el-table-column prop="date_handle" align="center" width="140" label="处理时间"></el-table-column>
          <el-table-column align="center" fixed="right" width="170" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.handle_schedule!=2"
                @click="view(reportList.data,scope.$index)"
                type="primary"
                size="mini"
              >处理</el-button>
              <el-button
                v-else
                @click="view(reportList.data,scope.$index)"
                type="primary"
                size="mini"
                plain
              >查看</el-button>

              <el-button @click="delItem(reportList.data,scope.$index)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 查看处理列表     -->
        <el-dialog class="dialogDIv" width="40%" title :visible.sync="dialogDiv">
          <div class="dialoBox">
            <div class="dialoTitle">
              <div>用户举报处理</div>
              <div @click="dialogDiv = false" class="cur">X</div>
            </div>
            <div class="dialoContent">
              <div>
                <div>处理人：</div>
                <div>
                  <el-input disabled v-model="handle_name"></el-input>
                </div>
              </div>
              <div>
                <div>用户信息：</div>
                <div class="congtentInfo">
                  <div class="congtentInfo-one">
                    <div>
                      <div>用户昵称</div>
                      <div>用户账号</div>
                      <div>性别</div>
                    </div>
                    <div>
                      <div :title="reportInfo.name">{{reportInfo.name}}</div>
                      <div :title="reportInfo.phone">{{reportInfo.phone}}</div>
                      <div :title="reportInfo.sexVal">{{reportInfo.sexVal}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div>举报内容：</div>
                <div class="congtentInfo">
                  <div class="congtentInfo-one">
                    <div>
                      <div>举报模块</div>
                      <div>被举报者信息</div>
                      <div :style="{'height':heightTitle+'px'}">举报原因</div>
                      <div>上传时间</div>
                    </div>
                    <div>
                      <div :title="reportInfo.typeVal">{{reportInfo.typeVal}}</div>
                      <div
                        :title="reportInfo.reported_info"
                      >{{reportInfo.reported_info === null ? "---": reportInfo.reported_info}}</div>
                      <div
                        ref="title"
                        class="wrap"
                        :title="reportInfo.tags"
                      >{{reportInfo.tags === null ? "---": reportInfo.tags}}</div>
                      <div :title="reportInfo.create_date">{{reportInfo.create_date}}</div>
                    </div>
                  </div>
                  <div class="congtentInfo-one-flag">
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;审核进程</div>
                    <div>
                      <div class="flag-one">
                        <el-radio
                          v-model="rr_type"
                          :disabled="reportInfo.status === 1"
                          :label="0"
                        >未处理</el-radio>
                        <el-radio v-model="rr_type" :label="1">已处理</el-radio>
                      </div>
                      <div v-if="rr_type === 1" class="flag1-one-box">
                        <div class="sel">
                          <el-select
                            v-model="reportInfo.handle_results"
                            :disabled="reportInfo.status === 1"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="item in tags.report_result"
                              :key="item.index"
                              :label="item.name"
                              :value="item.id"
                            ></el-option>
                          </el-select>
                        </div>
                        <div>
                          <el-input
                            :disabled="reportInfo.status === 1"
                            v-model="reportInfo.content"
                            placeholder="详情情况备注..."
                            type="textarea"
                          ></el-input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="info-btn">
                <el-button
                  @click="complete"
                  v-if="reportInfo.status != 1 && rr_type === 1"
                  type="primary"
                >完成</el-button>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 分页 -->
      <div class="report_pages">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="20"
          :page-sizes="[5,10,20,30,50,100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="reportList.total"
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
      radioinfo: 0,
      reportData: {
        name: "", //昵称
        phone: "", //账号
        sex: -1, //性别
        type: -1, //模块
        why: "", //原因
        admin: "", //处理人
        schedule: -1 //处理进程
      },
      reportList: {},
      tags: {
        sexFlags: [
          { name: "全部", id: -1 },
          { name: "男", id: 0 },
          { name: "女", id: 1 }
        ],
        typeTags: [
          { id: -1, name: "全部" },
          { id: 0, name: "侗友" },
          { id: 1, name: "团" },
          { id: 2, name: "游记" }
        ],
        whyTags: [],
        adminTags: [],
        scheduleTags: [
          { name: "全部", id: -1 },
          { name: "待处理", id: 0 },
          { name: "处理中", id: 1 },
          { name: "已处理", id: 2 }
        ],
        report_result: [
          { name: "---", id: 0 },
          { name: "举报虚假，谢谢您的举报", id: 1 },
          { name: "举报属实，被举报团已被解散", id: 2 },
          { name: "举报属实，被举报者账号已被冻结", id: 3 },
          { name: "举报属实，被游记已删除，谢谢你的举报", id: 4 }
        ]
      },
      currentPage: 1,
      pagesize: 20,
      dialogDiv: false,
      reportInfo: {},
      nextT: 0,
      handle_name: "", //处理人
      report_result: 1,
      rightW: "",
      rr_type: 0,
      loading: false,
      heightTitle: "",
      tableHeight: "auto",
      rightW: ""
    };
  },
  created() {
    let _that = this;
    this.access_token = localStorage.getItem("accessToken");
    if (this.access_token != null) {
      this.access_token = JSON.parse(this.access_token);
      this.getTags();
      this.getAdmin();
      this.getReportList();

      this.infrom = JSON.parse(localStorage.getItem("informData")); //获取个人信息
    } else {
      _that.$message({
        message: "登录已失效，请重新登录！",
        type: "error",
        content: true
      });
      setTimeout(() => {
        localStorage.clear();
        _that.$router.replace({
          path: "/"
        });
      }, 300);
    }
    if (window.innerWidth <= 1200) {
      this.rightW = "969px";
    } else {
      this.rightW = window.innerWidth - 180 + "px";
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
          window.innerHeight - $(".report_search").height() - hig;
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
  components: {
    Loading
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
      this.getReportList();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      }
      return "";
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getReportList();
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this.getReportList();
    },
    //清空条件
    searchClear() {
      this.reportData = {
        name: "",
        phone: "",
        sex: -1,
        type: -1,
        why: "",
        admin: "",
        schedule: -1
      };
    },
    getTags() {
      const that = this;
      that
        .$http({
          url: that.urlHost + "/man/report/tags",
          method: "post",
          params: {
            access_token: that.access_token
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            // console.log(res.data)
            that.tags.whyTags = res.data.obj;
            that.tags.whyTags.unshift({
              id: "",
              name: "全部"
            });
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAdmin() {
      const that = this;
      that
        .$http({
          url: that.urlHost + "/man/user/auto",
          method: "post",
          params: {
            access_token: that.access_token
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            // console.log(res.data)
            that.tags.adminTags = res.data.obj.data;
            that.tags.adminTags.unshift({
              id: "",
              name: "全部"
            });
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //report列表
    getReportList() {
      const that = this;
      that.loading = true;
      this.$http({
        url: this.urlHost + "/man/report/list",
        method: "post",
        params: {
          access_token: this.access_token,
          name: this.reportData.name,
          phone: this.reportData.phone,
          sex: this.reportData.sex,
          deal: this.reportData.admin,
          type: this.reportData.type,
          reasons: this.reportData.why,
          handle_schedule: this.reportData.schedule,
          page: this.currentPage,
          rows: this.pagesize
        }
      })
        .then(res => {
          that.loading = false;
          if (res.data.success === "00000000") {
            this.reportList = res.data.obj;
            // console.log(res.data.obj)
            for (let i in this.reportList.data) {
              this.reportList.data[i].sex =
                this.reportList.data[i].sex == 1 ? "女" : "男";
              if (this.reportList.data[i].rr_type === 0) {
                this.reportList.data[i].rr_type = "侗友";
              } else if (this.reportList.data[i].rr_type === 1) {
                this.reportList.data[i].rr_type = "团";
              } else if (this.reportList.data[i].rr_type === 2) {
                this.reportList.data[i].rr_type = "游记";
              }
              this.reportList.data[i].handle_results = this.nulltos(
                this.reportList.data[i].handle_results
              );
              this.reportList.data[i].handle_user = this.nulltos(
                this.reportList.data[i].handle_user
              );
              this.reportList.data[i].results_name = this.nulltos(
                this.reportList.data[i].results_name
              );
              this.reportList.data[i].create_date = this.$base.tampToTime(
                this.reportList.data[i].create_date
              );
              this.reportList.data[i].date_handle = this.$base.tampToTime(
                this.reportList.data[i].date_handle
              );
              this.reportList.data[i].date_handle = this.nulltos(
                this.reportList.data[i].date_handle
              );
            }
            this.tableHeight =
              window.innerHeight - $(".report_search").height() - 155;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.$message({
            message: err.message,
            type: "error",
            align: true
          });
          that.loading = false;
        });
    },
    //删除
    delItem(data, index) {
      let _that = this;
      let id = data[index].rr_id;
      _that
        .$confirm("是否删除？", "提示")
        .then(() => {
          _that.loading = true;
          _that
            .$http({
              url: _that.urlHost + "/man/report/del",
              method: "post",
              params: {
                access_token: _that.access_token,
                id: id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                _that.loading = false;
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
    },
    //查看、处理列表
    view(data, index) {
      const _that = this;
      let id = data[index].rr_id;
      if(data[index].rr_type == '侗友'){
        //侗友
        _that.tags.report_result = [
          { name: "---", id: 0 },
          { name: "举报虚假，谢谢您的举报", id: 1 },
          { name: "举报属实，被举报者账号已被冻结", id: 3 }
        ]
      }else if(data[index].rr_type == '团'){
        //团
        _that.tags.report_result = [
          { name: "---", id: 0 },
          { name: "举报虚假，谢谢您的举报", id: 1 },
          { name: "举报属实，被举报团已被解散", id: 2 }
        ]

      }else if(data[index].rr_type == '游记'){
        //游记
        _that.tags.report_result = [
          { name: "---", id: 0 },
          { name: "举报虚假，谢谢您的举报", id: 1 },
          { name: "举报属实，被游记已删除，谢谢你的举报", id: 4 }
        ]
      }
      _that.loading = true;
      _that.handle_name =
        data[index].handle_name == null || data[index].handle_name == ""
          ? _that.infrom.access_name
          : data[index].handle_name;
      _that
        .$http({
          url: _that.urlHost + "/man/report/info",
          method: "post",
          params: {
            access_token: _that.access_token,
            id: id
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            _that.reportInfo = res.data.obj;
            _that.loading = false;
            _that.dialogDiv = true;
            // console.log(_that.reportInfo)
            _that.reportInfo.sexVal = _that.reportInfo.sex === 1 ? "女" : "男";
            _that.reportInfo.create_date = _that.$base.tampToTime(
              _that.reportInfo.create_date
            );
            if (_that.reportInfo.rr_type === 0) {
              _that.reportInfo.typeVal = "侗友";
            } else if (_that.reportInfo.rr_type === 1) {
              _that.reportInfo.typeVal = "团";
            } else if (_that.reportInfo.rr_type === 2) {
              _that.reportInfo.typeVal = "游记";
            }
            const rr = res.data.obj;
            _that.rr_type = rr.status;
            _that.getReportList();
            setTimeout(() => {
              _that.heightTitle = _that.$refs.title.scrollHeight;
            }, 0);
          } else {
            _that.$base.err(res, _that);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //完成
    complete() {
      const _that = this;
      _that
        .$http({
          url: _that.urlHost + "/man/report/confirm",
          method: "post",
          params: {
            access_token: _that.access_token,
            id: _that.reportInfo.rr_id,
            status: 1,
            val: _that.reportInfo.handle_results,
            content: _that.reportInfo.content
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            _that.getReportList();
            _that.dialogDiv = false;
          } else {
            _that.$base.err(res, _that);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    nextBtn() {
      // this.nextT = 1
    },
    nulltos(content) {
      if (content === null || content === "") {
        return "---";
      } else {
        return content;
      }
    }
  }
};
</script>

<style>
.report {
  position: relative;
  height: 100%;
  overflow: auto;
  /* overflow: hidden; */
}
.report_top {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  color: #999;
  border-bottom: 1px solid #aaa;
}
.report_top span {
  font-size: 15px;
}
.report_box {
  position: relative;
  padding-left: 20px;
  height: calc(100% - 45px);
  overflow-y: hidden;
  display: flex !important;
  flex-direction: column;
}
.report_box .report_search {
  padding-top: 15px;
  display: flex;
}
.report_box .report_search > div {
  /* flex: 1; */
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
}
.report_box .report_search > div > div {
  margin-right: 20px;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
}
.report_box .report_search > div > div > span {
  white-space: nowrap;
}
.report_box .report_search > div > div .el-input__suffix-inner i,
.report_box .report_search > div > div .el-input__prefix i {
  height: 30px;
  line-height: 30px;
}
.report_box .report_search > div:nth-child(1) input {
  height: 30px;
  max-width: 150px;
}
.report_box .report_search > div:nth-child(1) .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  max-width: 150px;
  height: 30px;
  line-height: 30px;
}
.report_box .report_box .searchBtn {
  padding-bottom: 15px;
}
.report_box .report_table {
  position: relative;
  width: 100%;
  overflow: auto;
  flex: 1;
}
.report_table .el-table--mini td,
.report_table .el-table--mini th {
  padding: 5px 0;
}
.report_table .el-table {
  border: 1px solid #ccc;
}
.report_box .report_table .el-table th {
  background: #e2eff8 !important;
  color: #000 !important;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc !important;
}
.report_box .report_table .el-table th:first-child {
  border-left: 0;
}

.report_box .report_table .el-table td:first-child {
  border-left: 0 !important;
}
.report_box .report_table .el-table td {
  border: 1px solid #ccc !important;
  border-right: 0 !important;
  border-top: 0 !important;
}
.report_box .report_table .el-table .warning-row {
  background: #f4f9fc;
}
.el-pagination__total {
  display: none !important;
}
.el-pagination {
  padding: 0;
  margin: 0;
}
.el-pagination .el-select .el-input {
  margin: 0;
}
.report_pages {
  z-index: 1;
  position: relative;
  padding: 5px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  margin: -1px 0 0 0.5px;
}
.el-table__row .cell {
  white-space: pre !important;
}
.el-table__expand-icon {
  color: #3a9cf7 !important;
  font-size: 15px;
}
.report_table .el-dialog {
  background: rgba(0, 0, 0, 0) !important;
}
.report_table .el-dialog__body {
  padding: 0 !important;
}
.report_table .el-dialog__header {
  display: none;
}
.dialoBox {
  font-size: 16px;
  background: #fff;
  width: 800px;
}
.dialoTitle {
  display: flex;
  justify-content: space-between;
  background: #3a9cf7;
  color: #fff;
  padding: 10px 20px;
}
.dialoTitle > div:nth-child(2):hover {
  color: #ddd;
  cursor: pointer;
}
.dialoContent {
  color: #333;
  padding: 10px 20px;
}
.dialoContent > div {
  display: flex;
  margin-top: 20px;
}
.dialoContent > div > div:nth-child(1) {
  min-width: 100px;
  margin-top: 5px;
}
.dialoContent > div > div:nth-child(2) {
  flex: 1;
}
.congtentInfo-one {
  display: flex;
  border: 1px solid #ccc;
}
.congtentInfo-one-flag {
  background: #f9f9f9;
  display: flex;
  border: 1px solid #ccc;
}
.congtentInfo-one > div {
  padding: 30px 50px;
}
.congtentInfo-one > div:nth-child(2) > div {
  display: flex;
  align-items: center;
}
.congtentInfo-one-flag > div:nth-child(1) {
  padding: 10px 50px;
  display: flex;
  align-items: center;
}
.congtentInfo-one > div:nth-child(1),
.congtentInfo-one-flag > div:nth-child(1) {
  border-right: 1px solid #ccc;
  text-align: right;
  min-width: 100px;
}
.congtentInfo-one-flag > div:nth-child(2) {
  flex: 1;
}
.congtentInfo-one > div > div {
  margin-top: 10px;
  min-height: 21px;
}
.flag-one {
  margin: 10px 50px;
}
.flag1-one-box {
  border-top: 1px solid #ccc;
}
.flag1-one-box .sel {
  margin: 5px 15px;
}
.flag1-one-box .el-select {
  width: 100%;
}
.flag1-one-box textarea {
  border: 0;
  flex: 1;
  resize: none;
  height: 80px;
  background: #f9f9f9;
  padding-top: 10px;
}
.info-btn button {
  margin: 0 auto;
}
.next {
  outline: none;
  padding: 8px 50px;
  border: 1px solid #3a9cf7;
  color: #3a9cf7;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.next:hover {
  background: #f9f9f9;
}
.info-btn .el-button {
  padding: 8px 50px;
}
.bg-f {
  background: #fff;
}
.map {
  margin-left: 20px;
  cursor: pointer;
}
.path {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.path:hover {
  opacity: 0.8;
}
.col_active {
  color: #3a9cf7;
}
.wrap {
  width: 304px;
  word-wrap: break-word !important;
}
</style>
