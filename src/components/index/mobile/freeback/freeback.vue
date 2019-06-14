<template>
  <!-- 问题反馈 -->
  <div class="freeback" :style="{'width':rightW}">
    <Loading v-if="loading"></Loading>
    <div class="freeback_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：APP维护 >
        <span>
          <el-button type="text">问题反馈</el-button>
        </span>
      </div>
    </div>

    <div class="freeback_box">
      <!-- 查询条件 -->
      <div class="freeback_search">
        <div>
          <div>
            <span>用户昵称：</span>
            <el-input v-model="reportData.name" placeholder="举报人昵称"></el-input>
          </div>
          <div>
            <span>用户账号：</span>
            <el-input v-model="reportData.phone" placeholder="举报人账号"></el-input>
          </div>
          <div>
            <span>审核人：</span>
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
            <span>审核进程：</span>
            <el-select v-model="reportData.schedule" placeholder="全部">
              <el-option
                v-for="item in tags.scheduleTags"
                :key="item.index"
                :label="item.name"
                :value="item.val"
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
      <div class="freeback_table">
        <el-table
          :data="reportList.data"
          :height="tableHeight"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="49" align="center" label="编号"></el-table-column>
          <el-table-column prop="name" align="center" width="91" label="用户昵称"></el-table-column>
          <el-table-column prop="phone" width="115" align="center" label="用户账号"></el-table-column>
          <!-- <el-table-column
                    prop="from"
                    width="77"
                    align="center"
                    label="用户来源">
          </el-table-column>-->
          <el-table-column prop="rf_type" align="center" width="77" label="问题类型"></el-table-column>
          <el-table-column prop="rf_speaker_num" align="center" label="绑定设备编码"></el-table-column>
          <el-table-column prop="rf_content" align="center" label="反馈内容"></el-table-column>
          <!-- <el-table-column
                    width="100"
                    align="center"
                    label="上传图片">
                        <template slot-scope="props">
                            <img src="" alt="">
                        </template>
          </el-table-column>-->
          <el-table-column prop="rf_time" align="center" label="反馈时间"></el-table-column>
          <el-table-column prop="handle_name" align="center" label="处理人员"></el-table-column>
          <el-table-column align="center" label="处理进度">
            <template slot-scope="props">
              <div
                v-if="props.row.handle_schedule === -1"
                style="color:red"
              >{{props.row.schedule_name}}</div>
              <div
                v-else-if="props.row.handle_schedule === 0"
                style="color:green"
              >{{props.row.schedule_name}}</div>
              <div v-else>{{props.row.schedule_name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="handle_results" align="center" label="处理结果"></el-table-column>
          <el-table-column prop="date_handle" align="center" width="140" label="处理时间"></el-table-column>
          <el-table-column align="center" fixed="right" width="170" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.handle_schedule <=0 "
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
              <div>用户问题反馈</div>
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
                <div>反馈详情：</div>
                <div class="congtentInfo">
                  <div class="congtentInfo-one">
                    <div>
                      <div>反馈类型</div>
                      <div
                        v-if="reportInfo.rf_speaker_num != null && reportInfo.rf_speaker_num != ''"
                      >绑定设备编码</div>
                      <div :style="{'height':heightContent+'px'}">反馈内容</div>
                      <div>反馈时间</div>
                      <div v-if="reportInfo.details != null">上传图片</div>
                    </div>
                    <div>
                      <div :title="reportInfo.typeVal">{{reportInfo.typeVal}}</div>
                      <div
                        v-if="reportInfo.rf_speaker_num != null && reportInfo.rf_speaker_num != ''"
                        :title="reportInfo.rf_speaker_num"
                      >{{reportInfo.rf_speaker_num}}</div>
                      <div
                        ref="content"
                        class="wrap"
                        :title="reportInfo.rf_content"
                      >{{reportInfo.rf_content}}</div>
                      <div :title="reportInfo.create_date">{{reportInfo.create_date}}</div>
                      <div class="info_img">
                        <img
                          class="cur"
                          @click="viewBtn(reportInfo.details, index, OSSFreeback)"
                          v-for="(item, index) in reportInfo.details"
                          :key="index"
                          :src="OSSFreeback+item.rfd_url"
                          alt
                        >
                      </div>
                    </div>
                  </div>
                  <div class="congtentInfo-one-flag">
                    <div>审核进程</div>
                    <div>
                      <div class="flag-one">
                        <el-radio
                          v-model="rr_type"
                          :disabled="reportInfo.handle_schedule === 1"
                          :label="0"
                        >未处理</el-radio>
                        <el-radio v-model="rr_type" :label="1">已处理</el-radio>
                      </div>
                      <div v-if="rr_type === 1" class="flag1-one-box">
                        <div class="sel"></div>
                        <div>
                          <el-input
                            :disabled="reportInfo.handle_schedule == 1"
                            v-model="reportInfo.handle_results"
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
                  v-if="reportInfo.handle_schedule < 1 && rr_type === 1"
                  type="primary"
                >完成</el-button>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 分页 -->
      <div class="freeback_pages">
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
    <viewimg v-if="imgType" :imgurl="imgurldata" @typeBy="typeBy"></viewimg>
  </div>
</template>

<script>
import Loading from "./../../../loading/loading";
import viewimg from "./../../../viewimg/viewimg";
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
        schedule: -2 //处理进程
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
        scheduleTags: [],
        report_result: [{ name: "---", id: "", val: -2 }]
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
      imgurldata: {
        list: [],
        index: 0,
        url: ""
      },
      imgType: false,
      loading: true,
      rightW: "",
      tableHeight: "auto",
      heightContent: ""
    };
  },
  created() {
    let _that = this;
    this.access_token = localStorage.getItem("accessToken");
    if (this.access_token != null) {
      this.access_token = JSON.parse(this.access_token);
      this.getTags();
      this.getSchedules();
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
          window.innerHeight - $(".freeback_search").height() - hig;
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
    Loading,
    viewimg
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
    typeBy(t) {
      this.imgType = t;
    },
    viewBtn(data, index, url) {
      let list = [];
      for (let i = 0; i < data.length; i++) {
        list.push(data[i].rfd_url);
      }
      this.imgurldata = {
        list,
        index,
        url
      };
      this.imgType = true;
      // console.log(this.imgurldata);
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
        schedule: -2
      };
    },
    getTags() {
      const that = this;
      that
        .$http({
          url: that.urlHost + "/man/appfreeback/tags",
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
    getSchedules() {
      const that = this;
      that
        .$http({
          url: that.urlHost + "/man/appfreeback/schedules",
          method: "post",
          params: {
            access_token: that.access_token
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            // console.log(res.data)
            that.tags.scheduleTags = res.data.obj;
            that.tags.scheduleTags.unshift({
              id: "",
              name: "全部",
              val: -2
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
      that
        .$http({
          url: this.urlHost + "/man/appfreeback/list",
          method: "post",
          params: {
            access_token: that.access_token,
            name: that.reportData.name,
            phone: that.reportData.phone,
            sex: that.reportData.sex,
            deal: that.reportData.admin,
            type: that.reportData.type,
            // reasons: that.reportData.why,
            handle_schedule: that.reportData.schedule,
            page: that.currentPage,
            rows: that.pagesize
          }
        })
        .then(res => {
          that.loading = false;
          if (res.data.success === "00000000") {
            that.reportList = res.data.obj;
            // console.log(res.data.obj)
            for (let i in that.reportList.data) {
              that.reportList.data[i].sex =
                that.reportList.data[i].sex == 1 ? "女" : "男";
              that.reportList.data[i].create_date = that.$base.tampToTime(
                that.reportList.data[i].create_date
              );
              that.reportList.data[i].date_handle = that.$base.tampToTime(
                that.reportList.data[i].date_handle
              );
              that.reportList.data[i].rf_time = that.$base.tampToTime(
                that.reportList.data[i].rf_time
              );
              that.reportList.data[i].rf_type =
                that.reportList.data[i].rf_type === 0
                  ? "其他"
                  : that.reportList.data[i].rf_type === 1
                  ? "音响设备"
                  : "软件功能";
            }
            this.tableHeight =
              window.innerHeight - $(".freeback_search").height() - 155;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loading = false;
          that.$message({
            message: err.message,
            type: "error",
            align: true
          });
        });
    },
    //删除
    delItem(data, index) {
      let _that = this;
      let id = data[index].rf_id;
      _that
        .$confirm("是否删除？", "提示")
        .then(() => {
          _that.loading = true;
          _that
            .$http({
              url: _that.urlHost + "/man/appfreeback/del",
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
      let id = data[index].rf_id;
      _that.loading = true;
      _that.handle_name =
        data[index].handle_name == null || data[index].handle_name == ""
          ? _that.infrom.access_name
          : data[index].handle_name;
      _that
        .$http({
          url: _that.urlHost + "/man/appfreeback/info",
          method: "post",
          params: {
            access_token: _that.access_token,
            id: id
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            _that.dialogDiv = true;
            _that.loading = false;
            _that.reportInfo = {};
            _that.reportInfo = res.data.obj;
            _that.reportInfo.sexVal = _that.reportInfo.sex === 1 ? "女" : "男";
            _that.reportInfo.typeVal =
              _that.reportInfo.rf_type === 0
                ? "其他"
                : _that.reportInfo.rf_type === 1
                ? "音响设备"
                : "软件功能";
            _that.reportInfo.create_date = _that.$base.tampToTime(
              _that.reportInfo.create_date
            );
            const rr = res.data.obj;
            _that.rr_type = rr.handle_schedule;
            _that.getReportList();

            setTimeout(() => {
              _that.heightContent = _that.$refs.content.scrollHeight;
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
          url: _that.urlHost + "/man/appfreeback/handle",
          method: "post",
          params: {
            access_token: _that.access_token,
            id: _that.reportInfo.rf_id,
            status: 1,
            // val:  _that.reportInfo.handle_results,
            content: _that.reportInfo.handle_results
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
.freeback {
  position: relative;
  height: 100%;
  overflow: auto;
  /* overflow: hidden; */
}
.freeback_top {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  color: #999;
  border-bottom: 1px solid #aaa;
}
.freeback_top span {
  font-size: 15px;
}
.freeback_box {
  position: relative;
  padding-left: 20px;
  height: calc(100% - 45px);
  overflow-y: hidden;
  display: flex !important;
  flex-direction: column;
}
.freeback_box .freeback_search {
  padding-top: 15px;
  display: flex;
}
.freeback_box .freeback_search > div {
  /* flex: 1; */
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
}
.freeback_box .freeback_search > div > div {
  margin-right: 20px;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
}
.freeback_box .freeback_search > div > div > span {
  white-space: nowrap;
}
.freeback_box .freeback_search > div > div .el-input__suffix-inner i,
.freeback_box .freeback_search > div > div .el-input__prefix i {
  height: 30px;
  line-height: 30px;
}
.freeback_box .freeback_search > div:nth-child(1) input {
  height: 30px;
  max-width: 150px;
}
.freeback_box .freeback_search > div:nth-child(1) .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  max-width: 150px;
  height: 30px;
  line-height: 30px;
}
.freeback_box .freeback_box .searchBtn {
  padding-bottom: 15px;
}
.freeback_box .freeback_table {
  position: relative;
  /* width: calc(100% - 5px); */
  width: 100%;
  overflow: auto;
  flex: 1;
}
.freeback_table .el-table--mini td,
.freeback_table .el-table--mini th {
  padding: 5px 0;
}
.freeback_table .el-table {
  border: 1px solid #ccc;
}
.freeback_box .freeback_table .el-table th {
  background: #e2eff8 !important;
  color: #000 !important;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc !important;
}
.freeback_box .freeback_table .el-table th:first-child {
  border-left: 0;
}

.freeback_box .freeback_table .el-table td:first-child {
  border-left: 0 !important;
}
.freeback_box .freeback_table .el-table td {
  border: 1px solid #ccc !important;
  border-right: 0 !important;
  border-top: 0 !important;
}
.freeback_box .freeback_table .el-table .warning-row {
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
.freeback_pages {
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
.freeback_table .el-dialog {
  background: rgba(0, 0, 0, 0) !important;
}
.freeback_table .el-dialog__body {
  padding: 0 !important;
}
.freeback_table .el-dialog__header {
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
.congtentInfo-one-flag > div:nth-child(1) {
  padding: 10px 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  display: block !important;
  width: 350px;
  word-wrap: break-word;
  /* white-space: nowrap; */
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
}
.info_img {
  display: flex;
  flex-wrap: wrap;
  width: 350px;
}
.info_img img {
  /* width: 90px; */
  width: 110px;
  height: 90px;
  margin: 0 3px 3px 0;
  object-fit: cover;
}
</style>
