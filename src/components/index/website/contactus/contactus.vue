<template>
  <div class="contactus" :style="{'width':rightW}">
    <Loading v-if="loadingType"></Loading>
    <div class="contactus_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：官网管理 >
        <span>
          <el-button type="text">联系我们</el-button>
        </span>
      </div>
    </div>

    <div class="contactus_box">
      <!-- 查询条件 -->
      <div class="contactus_search">
        <div>
          <div>
            <span>留言时间：</span>
            <el-date-picker
              v-model="reContact.date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div>
            <span>留言类型：</span>
            <el-select v-model="reContact.type" placeholder>
              <el-option
                v-for="item in tags.type"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>处理人：</span>
            <el-select v-model="reContact.admin" placeholder>
              <el-option
                v-for="item in tags.adminTags"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>处理进程：</span>
            <el-select v-model="reContact.schedule" placeholder>
              <el-option
                v-for="item in tags.scheduleTags"
                :key="item.id"
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
      <!-- 列表 -->
      <div class="contactus_table">
        <el-table
          :data="listData.data"
          :height="tableHeight"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="49" align="center" label="编号"></el-table-column>
          <el-table-column prop="create_date" width="140" align="center" label="留言时间">
            <template slot-scope="scope">
              <div>{{$base.tampToTime(scope.row.create_date, 3)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="ac_name" align="center" label="姓名"></el-table-column>
          <el-table-column prop="ac_phone" width="100" align="center" label="联系方式"></el-table-column>
          <el-table-column prop="ac_business" align="center" label="留言类别"></el-table-column>
          <el-table-column align="center" label="留言内容">
            <template slot-scope="scope">
              <div class="lengH" :title="scope.row.ac_content">{{scope.row.ac_content}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="handle_name" align="center" label="处理人"></el-table-column>
          <el-table-column align="center" label="处理进程">
            <template slot-scope="scope">
              <div
                :class="{'col_red':scope.row.handle_schedule == -1,'col_green':scope.row.handle_schedule == 0}"
              >{{scope.row.handle_schedule == -1 ? "待处理" : scope.row.handle_schedule == 0 ? "处理中" : "已处理"}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="results_name" align="center" label="备注"></el-table-column>

          <el-table-column align="center" fixed="right" width="170" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.handle_schedule == 1"
                @click="view(listData.data,scope.$index)"
                size="mini"
              >查看</el-button>
              <el-button
                v-else
                @click="view(listData.data,scope.$index)"
                type="primary"
                size="mini"
              >处理</el-button>
              <el-button @click="delItem(listData.data,scope.$index)" type="danger" size="mini">删除</el-button>
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
                      <div>留言时间</div>
                      <div>姓名</div>
                      <div>性别</div>
                      <div>留言类型</div>
                      <div>内容</div>
                    </div>
                    <div>
                      <div>{{$base.tampToTime(DataInfo.create_date,3)}}</div>
                      <div>{{DataInfo.ac_name}}</div>
                      <div>{{DataInfo.ac_sex == 0 ? "男" : "女"}}</div>
                      <div>{{DataInfo.ac_business}}</div>
                      <pre style="max-width:312px;word-break:break-all;white-space:pre-wrap;">{{DataInfo.ac_content}}</pre>
                    </div>
                  </div>
                  <div class="info-confirm">
                    <div>处理进程</div>
                    <div>
                      <div>
                        <el-radio :disabled="DataInfo.status == 1" v-model="rr_type" :label="0">未处理</el-radio>
                        <el-radio v-model="rr_type" :label="1">已处理</el-radio>
                      </div>
                      <div class="content" v-if="rr_type == 1">
                        <el-input
                          :disabled="DataInfo.status == 1"
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
                  v-if="DataInfo.status == 0 && rr_type == 1"
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
      <div class="contactus_pages">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="20"
          :page-sizes="[5,10,20,30,50,100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="listData.total"
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
      reContact: {
        date: "",
        type: "",
        admin: "",
        schedule: -1
      },
      tags: {
        adminTags: [],
        type: [
          { id: "", name: "全部" },
          { id: "媒体报道", name: "媒体报道" },
          { id: "行业活动", name: "行业活动" },
          { id: "协会联盟", name: "协会联盟" },
          { id: "渠道代理", name: "渠道代理" }
        ],
        scheduleTags: [
          { id: -1, name: "全部" },
          { id: 0, name: "待处理" },
          { id: 1, name: "处理中" },
          { id: 2, name: "已处理" }
        ]
      },
      handle_name: "",
      DataInfo: {},
      listData: {},
      rr_type: 0,
      dialogDiv: {
        view: false
      },
      currentPage: 1,
      pagesize: 20,
      loadingType: false,
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
      that.GetList();
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
          window.innerHeight - $(".contactus_search").height() - hig;
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
        that.GetSearchList();
      }
    },
    GetSearchList() {
      this.currentPage = 1;
      this.GetList();
    },
    Clear() {
      this.reContact = {
        date: "",
        type: "",
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
    getSchedules() {
      // const that = this
      // that.$http({
      //     url: that.urlHost+'/man/contact/schedules',
      //     method: 'post',
      //     params: {
      //         access_token: that.access_token
      //     }
      // })
      // .then((res)=>{
      //     if(res.data.success === "00000000"){
      //         that.tags.scheduleTags = res.data.obj
      //         that.tags.scheduleTags.unshift({
      //             id: '',
      //             name: '全部',
      //             val: -2
      //         })
      //     }else{
      //         that.$base.err(res,that)
      //     }
      // })
      // .catch((err)=> {
      //     console.log(err)
      // })
    },
    //新闻类别
    Getbusiness() {
      // let that = this;
      // that.$http({
      //     url: that.urlHost + '/man/news/business/list',
      //     method: 'post',
      //     params: {
      //         access_token: that.access_token
      //     }
      // })
      // .then((res)=>{
      //     if(res.data.success === '00000000'){
      //         that.tags.type = res.data.obj
      //         that.tags.type.unshift({id:'',name:'全部'})
      //     }else{
      //         that.$base.err(res,that)
      //     }
      // })
      // .catch((err)=>{
      //     console.log(err);
      // })
    },
    // 联系列表
    GetList() {
      // console.log(this.reContact);
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/contact/list",
          method: "post",
          params: {
            access_token: that.access_token,
            date: that.reContact.date,
            deal: that.reContact.admin,
            type: that.reContact.type,
            handle_schedule: that.reContact.schedule,
            page: that.currentPage,
            rows: that.pagesize
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.listData = res.data.obj;
            that.tableHeight =
              window.innerHeight - $(".contactus_search").height() - 155;
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
          url: that.urlHost + "/man/contact/confirm",
          method: "post",
          params: {
            access_token: that.access_token,
            id: that.DataInfo.ah_id,
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
    //删除
    delItem(data, index) {
      let that = this;
      that
        .$confirm("是否删除？", "提示")
        .then(() => {
          that
            .$http({
              url: that.urlHost + "/man/contact/del",
              method: "post",
              params: {
                access_token: that.access_token,
                id: data[index].ah_id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                that.$message({
                  message: "已删除！",
                  type: "success",
                  center: true
                });
                // data.splice(index,1)
                that.GetList();
              } else {
                that.$base.err(res, that);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    view(data, index) {
      const that = this;
      that.loadingType = true;
      this.handle_name =
        data[index].handle_name == null || data[index].handle_name == ""
          ? this.infrom.access_name
          : data[index].handle_name;
      that
        .$http({
          url: that.urlHost + "/man/contact/info",
          method: "post",
          params: {
            access_token: that.access_token,
            id: data[index].ah_id
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.dialogDiv.view = true;
            that.DataInfo = res.data.obj;
            const rr = res.data.obj;
            if (rr.status == 1) {
              that.rr_type = 1;
            } else {
              that.rr_type = 0;
            }
            that.GetList();
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
  components: {
    Loading
  }
};
</script>

<style lang="less">
.contactus {
  position: relative;
  height: 100%;
  overflow: auto;
  .contactus_top {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    color: #999;
    border-bottom: 1px solid #aaa;
    span {
      font-size: 15px;
    }
  }
  .contactus_box {
    position: relative;
    padding-left: 20px;
    height: calc(100% - 45px);
    display: flex;
    flex-direction: column;
    // background:#ccc;
    .contactus_search {
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
    .contactus_table {
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
    .contactus_pages {
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
                  margin-bottom: 10px;
                  height: 21px;
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
