<template>
  <div class="advice" :style="{'width':rightW}">
    <Loading v-if="loadingType"></Loading>
    <div class="advice_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：官网管理 >
        <span>
          <el-button type="text">投诉建议</el-button>
        </span>
      </div>
    </div>

    <div class="advice_box">
      <!-- 查询条件 -->
      <div class="advice_search">
        <div>
          <div>
            <span>投诉时间：</span>
            <el-date-picker
              v-model="reApp.date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div>
            <span>处理人：</span>
            <el-select v-model="reApp.admin" placeholder="全部">
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
            <el-select v-model="reApp.schedule" placeholder>
              <el-option
                v-for="item in tags.scheduleTags"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <el-button @click="handleCurrentChange(1)" type="primary" size="mini">
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button @click="Clear" size="mini">
              <i class="el-icon-refresh"></i> 清空
            </el-button>
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <div class="advice_table">
        <el-table
          :data="ListData.data"
          :height="tableHeight"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="49" align="center" label="编号"></el-table-column>
          <el-table-column align="center" width="140" label="投诉时间">
            <template slot-scope="scope">
              <div>{{$base.tampToTime(scope.row.create_date,3)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="af_title" align="center" width="140" label="投诉标题"></el-table-column>
          <el-table-column prop="af_name" align="center" width="140" label="投诉人"></el-table-column>
          <el-table-column prop="af_email" width="140" align="center" label="投诉人邮箱"></el-table-column>
          <el-table-column prop="af_phone" align="center" width="110" label="投诉人电话"></el-table-column>
          <el-table-column align="center" width="240" label="投诉内容">
            <template slot-scope="scope">
              <div class="lengs" :title="scope.row.af_content">{{scope.row.af_content}}</div>
            </template>
          </el-table-column>
          <el-table-column prop align="center" label="上传图片"></el-table-column>
          <el-table-column prop="handle_name" align="center" label="处理人"></el-table-column>
          <el-table-column align="center" label="处理进程">
            <template slot-scope="scope">
              <div
                :class="{'col_red':scope.row.handle_schedule == -1,'col_green':scope.row.handle_schedule == 0}"
              >{{scope.row.handle_schedule == -1 ? "待处理" : scope.row.handle_schedule == 0 ? "处理中" : "已处理"}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="results_name" align="center" width="100" label="备注"></el-table-column>

          <el-table-column align="center" fixed="right" width="170" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.handle_schedule == 1"
                @click="view(ListData.data,scope.$index)"
                size="mini"
              >查看</el-button>
              <el-button
                v-else
                @click="view(ListData.data,scope.$index)"
                type="primary"
                size="mini"
              >处理</el-button>
              <el-button @click="delItem(ListData.data,scope.$index)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加人员     -->
        <el-dialog class="dialogDIv" width="600px" title :visible.sync="dialogDiv.view">
          <div class="dialoBox">
            <div class="dialoTitle">
              <div>投诉处理</div>
              <div @click="dialogDiv.view = false" class="cur">X</div>
            </div>
            <div class="dialoContent">
              <div>
                <span>处理人：</span>
                <div>
                  <el-input disabled v-model="handle_name"></el-input>
                </div>
              </div>
              <div>
                <span>投诉信息：</span>
                <div class="info">
                  <div class="info-box">
                    <div>
                      <div>投诉时间</div>
                      <div :style="{'height':heightTitle+'px'}">投诉标题</div>
                      <div>投诉人</div>
                      <div>投诉人邮箱</div>
                      <div>投诉人电话</div>
                      <div :style="{'height':heightContent+'px'}">投诉内容</div>
                      <div>上传照片</div>
                    </div>
                    <div>
                      <div>{{$base.tampToTime(DataInfo.create_date,3)}}</div>
                      <div ref="titleH">{{DataInfo.af_title}}</div>
                      <div>{{DataInfo.af_name}}</div>
                      <div>{{DataInfo.af_email}}</div>
                      <div>{{DataInfo.af_phone}}</div>
                      <div
                        ref="contentH"
                        style="word-break:break-all;white-space:pre-wrap;"
                      >{{DataInfo.af_content}}</div>
                      <div></div>
                    </div>
                  </div>
                  <div class="info-confirm">
                    <div>处理进程</div>
                    <div>
                      <div>
                        <el-radio
                          :disabled="DataInfo.handle_schedule == 1"
                          v-model="rr_type"
                          :label="0"
                        >未处理</el-radio>
                        <el-radio v-model="rr_type" :label="1">已处理</el-radio>
                      </div>
                      <div class="content" v-if="rr_type == 1">
                        <el-input
                          :disabled="DataInfo.handle_schedule == 1"
                          v-model="DataInfo.content"
                          :rows="3"
                          type="textarea"
                          placeholder="详情情况备注..."
                        ></el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <el-button
                  v-if="DataInfo.handle_schedule == 0 && rr_type == 1"
                  size="mini"
                  type="primary"
                  @click="GetConfirm"
                >完成</el-button>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>

      <!-- 分页 -->
      <div class="advice_pages">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="20"
          :page-sizes="[5,10,20,30,50,100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="ListData.total"
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
        date: "",
        admin: "",
        schedule: -1
      },
      tags: {
        adminTags: {},
        scheduleTags: [
          { id: -1, name: "全部" },
          { id: 0, name: "待处理" },
          { id: 1, name: "处理中" },
          { id: 2, name: "已处理" }
        ]
      },
      ListData: {},
      DataInfo: {},
      handle_name: "",
      rr_type: 0,
      dialogDiv: {
        view: false
      },
      currentPage: 1,
      pagesize: 20,
      loadingType: false,
      heightTitle: "",
      heightContent: "",
      tableHeight: "auto",
      rightW: ""
    };
  },
  created() {
    const that = this;
    that.access_token = localStorage.getItem("accessToken");
    if (that.access_token != null) {
      that.access_token = JSON.parse(this.access_token);
      that.getAdmin();
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
          window.innerHeight - $(".advice_search").height() - hig;
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
        date: "",
        admin: "",
        schedule: -1
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
      this.GetList();
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this.GetList();
    },
    openFlie() {
      this.$refs.file.click();
    },
    formContent(val) {
      // console.log(val);
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
    // 投诉列表
    GetList() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/freeback/manlist",
          method: "post",
          params: {
            access_token: that.access_token,
            date: that.reApp.date,
            deal: that.reApp.admin,
            handle_schedule: that.reApp.schedule,
            name: that.reApp.name,
            page: that.currentPage,
            rows: that.pagesize
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.ListData = res.data.obj;
            that.tableHeight =
              window.innerHeight - $(".advice_search").height() - 155;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    // 处理
    GetConfirm() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/freeback/manhandle",
          method: "post",
          params: {
            access_token: that.access_token,
            id: that.DataInfo.af_id,
            status: 1,
            content: that.DataInfo.content
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.$message.success(res.data.msg);
            that.GetList();
            that.dialogDiv.view = false;
            that.rr_type = 0;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    //处理
    view(data, index) {
      const that = this;
      that.loadingType = true;
      that.handle_name =
        data[index].handle_name == null || data[index].handle_name == ""
          ? this.infrom.access_name
          : data[index].handle_name;
      that
        .$http({
          url: that.urlHost + "/man/freeback/maninfo",
          method: "post",
          params: {
            access_token: that.access_token,
            id: data[index].af_id
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.dialogDiv.view = true;
            that.DataInfo = res.data.obj;
            that.rr_type = that.DataInfo.handle_schedule;
            that.DataInfo.content = that.DataInfo.handle_results;
            that.GetList();
            setTimeout(() => {
              that.heightTitle = that.$refs.titleH.scrollHeight;
              that.heightContent = that.$refs.contentH.scrollHeight;
            }, 0);
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
    delItem(data, index) {
      let _that = this;
      let id = data[index].au_id;
      _that
        .$confirm("是否删除？", "提示")
        .then(() => {
          _that
            .$http({
              url: _that.urlHost + "/man/freeback/mandel",
              method: "post",
              params: {
                access_token: _that.access_token,
                id: data[index].af_id
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
                _that.GetList();
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
.advice {
  position: relative;
  height: 100%;
  overflow: auto;
  .advice_top {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    color: #999;
    border-bottom: 1px solid #aaa;
    span {
      font-size: 15px;
    }
  }
  .advice_box {
    position: relative;
    padding-left: 20px;
    height: calc(100% - 45px);
    display: flex;
    flex-direction: column;
    .advice_search {
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
    .advice_table {
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
    .advice_pages {
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
            width: 80px;
            margin-top: 7px;
          }
          > div {
            flex: 1;
            display: flex;
            align-items: center;
          }
          .info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .info-box {
              display: flex;
              width: 100%;
              border: 1px solid #dcdfe6;
              > div:nth-child(1) {
                padding: 20px;
                width: 80px;
                text-align: right;
                border-right: 1px solid #dcdfe6;
              }
              > div:nth-child(2) {
                padding: 20px;
                flex: 1;
              }
              > div {
                > div {
                  margin-top: 10px;
                  min-height: 21px;
                }
              }
            }
            .info-confirm {
              display: flex;
              width: 100%;
              background: #f9f9f9;
              border: 1px solid #dcdfe6;
              > div:nth-child(1) {
                padding: 10px 20px;
                width: 80px;
                border-right: 1px solid #dcdfe6;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                > div {
                  margin-bottom: 15px;
                }
              }
              > div:nth-child(2) {
                flex: 1;
                > div {
                  padding: 10px 20px;
                }
                .content {
                  border-top: 1px solid #dcdfe6;
                  textarea {
                    border: 0;
                    resize: none;
                    padding: 0;
                    background: #f9f9f9;
                  }
                }
              }
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
