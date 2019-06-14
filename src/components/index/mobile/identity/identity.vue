<template>
  <!-- 导游认证 -->
  <div class="identity" :style="{'width':rightW}">
    <Loading v-if="loading"></Loading>
    <div class="identity_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：APP维护 >
        <span>
          <el-button type="text">身份认证</el-button>
        </span>
      </div>
    </div>

    <div class="identity_box">
      <!-- 查询条件 -->
      <div class="identity_search">
        <div>
          <div>
            <span>用户昵称：</span>
            <el-input placeholder="昵称" v-model="identityData.name"></el-input>
          </div>

          <div>
            <span>用户账号：</span>
            <el-input placeholder="账号" v-model="identityData.phone"></el-input>
          </div>

          <div>
            <span>性别：</span>
            <el-select v-model="identityData.sex" placeholder="请选择">
              <el-option
                v-for="item in tags.sex"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>

          <div>
            <span>审核人：</span>
            <el-select v-model="identityData.admin" placeholder="全部">
              <el-option
                v-for="item in tags.admin"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>审核进程：</span>
            <el-select v-model="identityData.schedule" placeholder="全部">
              <el-option
                v-for="item in tags.schedule"
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
              <i class="el-icon-refresh"></i> 清空
            </el-button>
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <div class="identity_table">
        <el-table
          :data="identityList.data"
          :height="tableHeihgt"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" align="center" label="编号"></el-table-column>
          <el-table-column prop="name" width="120" align="center" label="用户昵称"></el-table-column>
          <el-table-column prop="phone" width="115" align="center" label="用户账号"></el-table-column>
          <el-table-column prop="sex" width="49" align="center" label="性别"></el-table-column>
          <el-table-column prop="age" align="center" label="出生日期"></el-table-column>
          <el-table-column prop="rgv_name" align="center" width="120" label="真实姓名"></el-table-column>
          <el-table-column prop="rgv_card" align="center" width="120" label="导游证号"></el-table-column>
          <el-table-column prop="rgv_phone" align="center" width="120" label="预留手机号"></el-table-column>
          <el-table-column width="220" align="center" label="导游证反面照片">
            <template slot-scope="props">
              <img
                @click="viewBtn([props.row.rgv_plus,props.row.rgv_minus,props.row.rgv_img], 0, OSSGuide)"
                class="cur imgWH"
                v-lazy="OSSGuide+props.row.rgv_plus+'?x-oss-process=image/resize,p_10'"
                alt
              >
              <img
                @click="viewBtn([props.row.rgv_plus,props.row.rgv_minus,props.row.rgv_img], 1, OSSGuide)"
                class="cur imgWH"
                v-lazy="OSSGuide+props.row.rgv_minus+'?x-oss-process=image/resize,p_10'"
                alt
              >
            </template>
          </el-table-column>
          <el-table-column prop="rss_phone" align="center" width="200" label="证件有效期">
            <template slot-scope="props">
              <div>{{props.row.rgv_issued_date}} 一 {{props.row.rgv_expired_date}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="120" label="手持导游证照片">
            <template slot-scope="props">
              <img
                @click="viewBtn([props.row.rgv_plus,props.row.rgv_minus,props.row.rgv_img], 2, OSSGuide)"
                class="cur imgWH"
                v-lazy="OSSGuide+props.row.rgv_img+'?x-oss-process=image/resize,p_10'"
                alt
              >
            </template>
          </el-table-column>
          <el-table-column prop="create_date" align="center" width="150" label="提交时间"></el-table-column>
          <el-table-column prop="handle_name" align="center" label="审核人"></el-table-column>
          <el-table-column align="center" label="审核进程">
            <template slot-scope="props">
              <div
                :class="{'err': props.row.handle_schedule === 3,'green': props.row.handle_schedule === 1}"
              >{{props.row.schedule_name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="handle_result" align="center" label="审核结果"></el-table-column>
          <el-table-column prop="handle_date" align="center" width="150" label="审核时间"></el-table-column>
          <el-table-column align="center" fixed="right" width="170" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.handle_schedule <= 0"
                @click="view(identityList.data,scope.$index)"
                type="primary"
                size="mini"
              >处理</el-button>
              <el-button
                v-else
                @click="view(identityList.data,scope.$index)"
                type="primary"
                size="mini"
                plain
              >查看</el-button>

              <el-button
                @click="delItem(identityList.data,scope.$index)"
                type="danger"
                size="mini"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 查看处理列表     -->
        <el-dialog class="dialogDIv" width="40%" title :visible.sync="dialogDiv">
          <div class="dialoBox">
            <div class="dialoTitle">
              <div>身份认证审核</div>
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
                  <div class="congtentInfo-onezz">
                    <div>
                      <div>用户昵称</div>
                      <div>用户账号</div>
                      <div>性别</div>
                      <div>出生日期</div>
                    </div>
                    <div>
                      <div>{{identityInfo.name}}</div>
                      <div>{{identityInfo.phone}}</div>
                      <div>{{identityInfo.sex}}</div>
                      <div>{{identityInfo.age}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div>验证信息：</div>
                <div class="congtentInfo">
                  <div class="congtentInfo-onezz">
                    <div>
                      <div>真实姓名</div>
                      <div>导游证号</div>
                      <div>预留手机号</div>
                      <div class="pb50">导游证正反面照片</div>
                      <div>证件有效期</div>
                      <div>手持导游证照片</div>
                    </div>
                    <div>
                      <div>{{identityInfo.rgv_name}}</div>
                      <div>{{identityInfo.rgv_card}}</div>
                      <div>{{identityInfo.rgv_phone}}</div>
                      <div>
                        <img
                          class="cur imgWH"
                          @click="viewBtn([identityInfo.rgv_plus,identityInfo.rgv_minus,identityInfo.rgv_img], 0, OSSGuide)"
                          v-lazy="OSSGuide+identityInfo.rgv_plus+'?x-oss-process=image/resize,p_10'"
                          alt
                        >&nbsp;&nbsp;
                        <img
                          class="cur imgWH"
                          @click="viewBtn([identityInfo.rgv_plus,identityInfo.rgv_minus,identityInfo.rgv_img], 1, OSSGuide)"
                          v-lazy="OSSGuide+identityInfo.rgv_minus+'?x-oss-process=image/resize,p_10'"
                          alt
                        >
                      </div>
                      <div>{{identityInfo.rgv_issued_date}} 一 {{identityInfo.rgv_expired_date}}</div>
                      <div>
                        <img
                          class="cur imgWH"
                          @click="viewBtn([identityInfo.rgv_plus,identityInfo.rgv_minus,identityInfo.rgv_img], 2, OSSGuide)"
                          v-lazy="OSSGuide+identityInfo.rgv_img+'?x-oss-process=image/resize,p_10'"
                          alt
                        >
                      </div>
                    </div>
                  </div>
                  <div class="congtentInfo-one-flagzz">
                    <div>审核进程</div>
                    <div>
                      <div class="flag-one">
                        <el-radio
                          v-model="rr_type"
                          :disabled="identityInfo.handle_schedule >= 1"
                          :label="0"
                        >未处理</el-radio>
                        <el-radio v-model="rr_type" :label="1">已处理</el-radio>
                      </div>
                      <div v-if="rr_type === 1" class="flag2-one-box">
                        <div class="successFlag" v-if="identityInfo.handle_schedule >= 1">
                          <div
                            :class="{'bg-status': identityInfo.handle_schedule == 1 || identityInfo.handle_schedule == 3}"
                          >审核成功</div>
                          <div :class="{'bg-status': identityInfo.handle_schedule == 2}">审核失败</div>
                        </div>
                        <div class="successFlag" v-else>
                          <div
                            @click="audit.status = 1"
                            class="cur"
                            :class="{'bg-status': audit.status == 1}"
                          >审核成功</div>
                          <div
                            @click="audit.status = 2"
                            class="cur"
                            :class="{'bg-status': audit.status == 2}"
                          >审核失败</div>
                        </div>
                        <div v-if="identityInfo.handle_schedule == 2">
                          <el-input
                            v-model="audit.content"
                            :disabled="identityInfo.handle_schedule >= 1"
                            placeholder="详情情况备注..."
                            type="textarea"
                          ></el-input>
                        </div>
                        <div v-else>
                          <el-input
                            v-model="audit.content"
                            :disabled="identityInfo.handle_schedule >= 1"
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
                  v-if="identityInfo.handle_schedule < 1 && rr_type == 1"
                  type="primary"
                >完成</el-button>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 分页 -->
      <div class="identity_pages">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="20"
          :page-sizes="[5,10,20,30,50,100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="identityList.total"
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
      infrom: "",
      identityData: {
        name: "", //昵称
        phone: "",
        sex: -1, //性别
        admin: "",
        schedule: -2 //处理进度
      },
      identity: "",
      identityList: {},
      tags: {
        sex: [
          { name: "全部", id: -1 },
          { name: "男", id: 0 },
          { name: "女", id: 1 }
        ],
        admin: [],
        schedule: []
      },
      currentPage: 1,
      pagesize: 20,
      dialogDiv: false,
      identityInfo: {},
      nextT: 0,
      handle_name: "", //处理人
      rightW: "",
      rr_type: 0,
      audit: {
        status: 1,
        content: ""
      },
      imgurldata: {
        list: [],
        index: 0,
        url: ""
      },
      imgType: false,
      loading: false,
      tableHeihgt: "auto",
      widthC: document.documentElement.clientWidth
    };
  },
  created() {
    let _that = this;
    this.access_token = localStorage.getItem("accessToken");
    if (this.access_token != null) {
      this.access_token = JSON.parse(this.access_token);
      this.getAdmin();
      this.getSchedules();
      this.getList();
      //获取个人信息
      this.infrom = JSON.parse(localStorage.getItem("informData"));
      // console.log(this.infrom);
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
            window.innerHeight - $(".identity_search").height() - 175;
        }, 0);
      } else if (window.innerWidth > 1920) {
        this.rightW = 1920 - wid + "px";
        setTimeout(() => {
          this.tableHeihgt =
            window.innerHeight - $(".identity_search").height() - 155;
        }, 0);
      } else {
        this.rightW = window.innerWidth - wid + "px";
        setTimeout(() => {
          this.tableHeihgt =
            window.innerHeight - $(".identity_search").height() - 155;
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
    typeBy(t) {
      this.imgType = t;
    },
    viewBtn(data, index, url) {
      let list = [];
      // console.log(data);
      for (let i = 0; i < data.length; i++) {
        list.push(data[i]);
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
      this.getList();
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this.getList();
    },
    //清空条件
    searchClear() {
      this.identityData = {
        name: "", //昵称
        phone: "",
        sex: -1, //性别
        admin: "",
        schedule: -2 //处理进度
      };
    },
    //条件查询列表
    GetSearchList() {
      this.currentPage = 1;
      this.getList();
    },
    //操作人
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
            that.tags.admin = res.data.obj.data;
            that.tags.admin.unshift({
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
    //处理进度
    getSchedules() {
      const that = this;
      that
        .$http({
          url: that.urlHost + "/man/valid/schedules",
          method: "post",
          params: {
            access_token: that.access_token
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            // console.log(res.data)
            that.tags.schedule = res.data.obj;
            that.tags.schedule.unshift({
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
    // 列表
    getList() {
      const that = this;
      that.loading = true;
      that
        .$http({
          url: that.urlHost + "/man/valid/list",
          method: "post",
          params: {
            access_token: that.access_token,
            name: this.identityData.name,
            phone: this.identityData.phone,
            sex: this.identityData.sex,
            handle: this.identityData.admin,
            handle_schedule: this.identityData.schedule,
            page: this.currentPage,
            rows: this.pagesize
          }
        })
        .then(res => {
          that.loading = false;
          if (res.data.success === "00000000") {
            // console.log(res.data);
            that.identityList = res.data.obj;
            for (let i = 0; i < that.identityList.data.length; i++) {
              that.identityList.data[i].sex =
                that.identityList.data[i].sex == 1 ? "女" : "男";
              that.identityList.data[i].age = that.$base.tampToTime(
                that.identityList.data[i].age,
                0
              );
              that.identityList.data[i].create_date = that.$base.tampToTime(
                that.identityList.data[i].create_date
              );
              that.identityList.data[i].handle_date = that.$base.tampToTime(
                that.identityList.data[i].handle_date
              );
              that.identityList.data[i].rgv_issued_date = that.$base.tampToTime(
                that.identityList.data[i].rgv_issued_date,
                2
              );
              that.identityList.data[
                i
              ].rgv_expired_date = that.$base.tampToTime(
                that.identityList.data[i].rgv_expired_date,
                2
              );
            }
            this.tableHeihgt =
              window.innerHeight - $(".identity_search").height() - 155;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loading = false;
          console.log(err);
        });
    },
    //删除
    delItem(data, index) {
      let _that = this;
      let id = data[index].rgv_id;
      _that
        .$confirm("是否删除？", "提示")
        .then(() => {
          _that.loading = true;
          _that
            .$http({
              url: _that.urlHost + "/man/valid/del",
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
      let id = data[index].rgv_id;
      _that.loading = true;
      this.handle_name =
        data[index].handle_name == null || data[index].handle_name == ""
          ? this.infrom.access_name
          : data[index].handle_name;
      _that
        .$http({
          url: _that.urlHost + "/man/valid/info",
          method: "post",
          params: {
            access_token: _that.access_token,
            id: id
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            _that.loading = false;
            _that.dialogDiv = true;
            _that.identityInfo = res.data.obj;
            _that.identityInfo.sex = _that.identityInfo.sex == 1 ? "女" : "男";
            _that.identityInfo.age = _that.$base.tampToTime(
              _that.identityInfo.age,
              0
            );
            _that.identityInfo.rgv_issued_date = _that.$base.tampToTime(
              _that.identityInfo.rgv_issued_date,
              2
            );
            _that.identityInfo.rgv_expired_date = _that.$base.tampToTime(
              _that.identityInfo.rgv_expired_date,
              2
            );
            _that.audit.content = _that.identityInfo.handle_result;
            const rr = res.data.obj;
            if (rr.handle_schedule >= 1) {
              _that.rr_type = 1;
            } else {
              _that.rr_type = 0;
            }
            _that.getList();
            // _that.rr_type = rr.handle_schedule
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
      if (_that.audit.status === 2 && $.trim(_that.audit.content) == "") {
        _that.$message.error("请备注失败原因！");
      } else {
        _that
          .$http({
            url: _that.urlHost + "/man/valid/audit",
            method: "post",
            params: {
              access_token: _that.access_token,
              id: _that.identityInfo.rgv_id,
              status: _that.audit.status,
              content: _that.audit.content
            }
          })
          .then(res => {
            if (res.data.success === "00000000") {
              _that.getList();
              _that.audit.content = "";
              this.dialogDiv = false;
            } else {
              _that.$base.err(res, _that);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    nextBtn() {
      // this.nextT = 1
    }
  }
};
</script>

<style>
.identity {
  position: relative;
  height: 100%;
  overflow: auto;
  /* overflow: hidden; */
}
.identity_top {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  color: #999;
  border-bottom: 1px solid #aaa;
}
.identity_top span {
  font-size: 15px;
}
.identity_box {
  position: relative;
  padding-left: 20px;
  height: calc(100% - 45px);
  overflow-y: hidden;
  display: flex !important;
  flex-direction: column;
}
.identity_box .identity_search {
  padding-top: 15px;
  display: flex;
}
.identity_box .identity_search > div {
  /* flex: 1; */
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
}
.identity_box .identity_search > div > div {
  margin-right: 20px;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
}
.identity_box .identity_search > div > div > span {
  white-space: nowrap;
}
.identity_box .identity_search > div > div .el-input__suffix-inner i,
.identity_box .identity_search > div > div .el-input__prefix i {
  height: 30px;
  line-height: 30px;
}
.identity_box .identity_search > div:nth-child(1) input {
  height: 30px;
  max-width: 150px;
}
.identity_box .identity_search > div:nth-child(1) .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  max-width: 150px;
  height: 30px;
  line-height: 30px;
}
.identity_box .identity_box .searchBtn {
  padding-bottom: 15px;
}
.identity_box .identity_table {
  position: relative;
  /* width: calc(100% - 5px); */
  width: 100%;
  overflow: auto;
  flex: 1;
}
.identity_table .el-table--mini td,
.identity_table .el-table--mini th {
  padding: 5px 0;
}
.identity_table .el-table {
  border: 1px solid #ccc;
}
.identity_box .identity_table .el-table th {
  background: #e2eff8 !important;
  color: #000 !important;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc !important;
}
.identity_box .identity_table .el-table th:first-child {
  border-left: 0;
}

.identity_box .identity_table .el-table td:first-child {
  border-left: 0 !important;
}
/* .identity_box .identity_table .el-table__body-wrapper{
        border-top: 1px solid #3A9CF7;
        overflow-x: hidden;
    } */
.identity_box .identity_table .el-table td {
  border: 1px solid #ccc !important;
  border-right: 0 !important;
  border-top: 0 !important;
}
.identity_box .identity_table .el-table .warning-row {
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
.identity_pages {
  z-index: 1;
  position: relative;
  padding: 5px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  margin: -1px 0 0 0.5px;
}
.identity_bottom {
  text-align: right;
  padding: 20px 30px;
}
.el-table__row .cell {
  white-space: pre !important;
}
.el-table__expand-icon {
  color: #3a9cf7 !important;
  font-size: 15px;
}
.apply-num {
  color: #3a9cf7;
  cursor: pointer;
}
.dialog-search {
  display: flex;
  margin: 20px;
}
.dialog-search > div {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.dialog-search span {
  width: 60px;
}
.dialog-search > div:last-child > span {
  width: 120px;
}
.dialogBtn {
  margin: 20px;
}

/* .identity_table{
        height: calc(100% - 213px);
        width: calc(100% - 18px);
        overflow: auto;
    } */
.identity_table .el-dialog {
  background: rgba(0, 0, 0, 0) !important;
  margin-top: 5vh !important;
}
.identity_table .el-dialog__body {
  padding: 0 !important;
}
.identity_table .el-dialog__header {
  display: none;
}
.dialoBox {
  font-size: 16px;
  background: #fff;
  width: 900px;
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
.congtentInfo-onezz {
  display: flex;
  border: 1px solid #ccc;
}
.congtentInfo-one-flagzz {
  background: #f9f9f9;
  display: flex;
  border: 1px solid #ccc;
}
.congtentInfo-onezz > div {
  padding: 30px 50px;
}
.congtentInfo-onezz > div:nth-child(2) > div {
  display: flex;
  align-items: center;
}
.congtentInfo-one-flagzz > div:nth-child(1) {
  padding: 10px 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.congtentInfo-onezz > div:nth-child(1),
.congtentInfo-one-flagzz > div:nth-child(1) {
  border-right: 1px solid #ccc;
  text-align: right;
  width: 130px;
}
.congtentInfo-one-flagzz > div:nth-child(2) {
  flex: 1;
}
.congtentInfo-onezz > div > div {
  margin-top: 15px;
}
.flag-one {
  margin: 10px 50px;
}
.flag2-one-box {
  border-top: 1px solid #ccc;
}
.flag2-one-box > div:nth-child(1) {
  padding: 5px 15px;
}
.flag2-one-box .el-select {
  width: 100%;
}
.flag2-one-box textarea {
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
.bg-status {
  background: #fff !important;
  color: #3a9cf7 !important;
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
.pb50 {
  padding-bottom: 35px;
}
.cur:hover {
  cursor: pointer;
  opacity: 0.8;
}
.imgWH {
  width: 90px;
  max-height: 55px;
  object-fit: cover;
}
.successFlag {
  padding: 0 !important;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #ccc;
}
.successFlag > div {
  width: 50%;
  text-align: center;
  padding: 10px 0;
}

.successFlag > div:nth-child(2) {
  border-left: 1px solid #ccc;
}
.err {
  color: red;
}
.green {
  color: green;
}
</style>
