<template>
  <div class="appversion" :style="{'width':rightW}">
    <Loading v-if="loadingType"></Loading>
    <div class="appversion_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：APP维护 >
        <span>
          <el-button type="text">APP版本</el-button>
        </span>
      </div>
    </div>

    <div class="appversion_box">
      <!-- 查询条件 -->
      <div class="appversion_search">
        <div>
          <div>
            <span>版本号：</span>
            <el-input v-model="reApp.version"></el-input>
          </div>
          <div>
            <span>创建日期：</span>
            <el-date-picker
              v-model="reApp.date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div>
            <span>应用平台：</span>
            <el-select v-model="reApp.plat" placeholder="请选择">
              <el-option
                v-for="item in reApp.platformFlg"
                :key="item.index"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>是否强制更新：</span>
            <el-select v-model="reApp.constraint_flg" placeholder="请选择">
              <el-option
                v-for="item in reApp.typefFlg"
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
          <el-button @click="addList" size="mini">
            <i class="el-icon-plus"></i> 新建版本
          </el-button>
        </div>
      </div>

      <!-- 列表 -->
      <div class="appversion_table">
        <el-table
          :data="ListData.data"
          :height="tableHeight"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="49" align="center" label="编号"></el-table-column>
          <el-table-column prop="new_version" align="center" label="版本号"></el-table-column>
          <el-table-column
            prop="create_date"
            width="140"
            align="center"
            :formatter="formatDate"
            label="创建日期"
          ></el-table-column>
          <el-table-column prop="target_size" align="center" label="apk大小"></el-table-column>
          <el-table-column prop="update_log" align="center" label="更新类容"></el-table-column>
          <el-table-column prop="flat_form" align="center" :formatter="formatFlat" label="应用平台"></el-table-column>
          <el-table-column align="center" label="下载地址">
            <template slot-scope="scope">
              <a :href="scope.row.apk_file_url" target="_blank">{{scope.row.apk_file_url}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="constraint_flg"
            align="center"
            :formatter="formatFlg"
            label="是否强制更新"
          ></el-table-column>

          <el-table-column fixed="right" align="center" width="170" label="操作">
            <template slot-scope="scope">
              <el-button @click="delItem(ListData.data,scope.$index)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
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
                  <el-input v-model="add.version"></el-input>
                </div>
              </div>
              <div>
                <span>更新类容：</span>
                <div>
                  <el-input type="textarea" :rows="5" v-model="add.update_log"></el-input>
                </div>
              </div>
              <div>
                <span>应用平台：</span>
                <div class="bm">
                  <div
                    @click="add.flat_form = 0"
                    :class="{'active':add.flat_form == 0,'cur':add.flat_form != 0}"
                  >android</div>
                  <div
                    @click="add.flat_form = 1"
                    :class="{'active':add.flat_form == 1,'cur':add.flat_form != 1}"
                  >ios</div>
                </div>
              </div>
              <div>
                <span>上传APP：</span>
                <div class="upInut">
                  <el-input v-if="add.flat_form == 0" v-model="add.name"></el-input>
                  <el-input v-if="add.flat_form == 1" v-model="add.iosName"></el-input>
                  <input type="file" v-show="0" ref="file" @change="upFlie">
                  <div class="up" v-if="add.flat_form == 0">
                    <el-button type="text" @click="openFlie">
                      <i class="el-icon-document"></i>
                    </el-button>
                  </div>
                </div>
              </div>
              <div v-if="add.name!= '' && add.flat_form == 0">
                <span>apk地址：</span>
                <div style="margin-top: 7px;">
                  <p
                    v-if="add.name!= '' && add.flat_form == 0"
                    style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 460px;"
                    :title="infrom.android_urlDownload+add.name"
                  >{{infrom.android_urlDownload}}{{add.name}}</p>
                </div>
              </div>
              <div>
                <span>apk大小：</span>
                <div>
                  <el-input v-model="add.size" :disabled="add.flat_form == 0" placeholder="文件大小"></el-input>
                </div>
              </div>
              <div>
                <span>是否强制更新：</span>
                <div style="margin-top: 10px;">
                  <el-radio v-model="add.constraint_flg" :label="1">是</el-radio>
                  <el-radio v-model="add.constraint_flg" :label="0">否</el-radio>
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
      <div class="appversion_pages">
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
      plats: "",
      reApp: {
        version: "", //版本号
        date: "", //创建日期
        plat: -1, //应用品台
        constraint_flg: -1, //是否强制更新
        platformFlg: [
          { name: "全部", key: -1 },
          { name: "android", key: 0 },
          { name: "ios", key: 1 }
        ],
        typefFlg: [
          { name: "全部", key: -1 },
          { name: "是", key: 1 },
          { name: "否", key: 0 }
        ]
      },
      add: {
        version: "", //版本号
        name: "",
        url: "",
        iosName: "",
        androidName: "",
        update_log: "", //更新类容
        flat_form: 0, //应用平台
        constraint_flg: 0,
        size: ""
      },
      ListData: {},
      dialogDiv: {
        add: false
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
      this.GetPlats();
      this.GetList();
      //获取个人信息
      that.infrom = JSON.parse(localStorage.getItem("informData"));
      let url = that.infrom.android_url;
      let str = url.substr(url.indexOf('.com')+5,url.length)
      that.infrom.android_urlDownload = 'http://app.aetosgo.com/' + str;
      console.log(that.infrom.android_urlDownload)
      that.add.iosName = that.infrom.ios_url;
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
          window.innerHeight - $(".appversion_search").height() - hig;
      }, 0);
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
    beforeRouteLeave(to, from, next){
        window.removeEventListener('keydown',this.EventEnter);
        next();
    },
    methods: {
        EventEnter(e) {
            const that = this;
            let ev = document.all ? window.event : e;
            if(ev.keyCode === 13) {
                that.GetSearchList();
            }
        },
        GetSearchList() {
            this.currentPage = 1;
            this.GetList();
        },
    Clear() {
      this.reApp.version = "";
      this.reApp.date = "";
      this.reApp.plat = -1;
      this.reApp.constraint_flg = -1;
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
    formatFlat(row, colum) {
      return row.flat_form == 0 ? "android" : "ios";
    },
    formatFlg(row, colum) {
      return row.constraint_flg == 0 ? "否" : "是";
    },
    formatDate(row, colum) {
      return this.$base.tampToTime(row.create_date);
    },
    // 设备类型
    GetPlats() {
      const that = this;
      that
        .$http({
          url: that.urlHost + "/man/version/plats",
          method: "post",
          params: {
            access_token: that.access_token
          },
          timeout: 10000
        })
        .then(res => {
          if (res.data.success === "00000000") {
            that.plats = res.data.obj;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    // 版本列表
    GetList() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/version/list",
          method: "post",
          params: {
            access_token: that.access_token,
            version: that.reApp.version,
            plat: that.reApp.plat,
            constraint_flg: that.reApp.constraint_flg,
            date: that.reApp.date,
            page: that.currentPage,
            rows: that.pagesize
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.ListData = res.data.obj;
            that.loadingType = false;
            this.tableHeight =
              window.innerHeight - $(".appversion_search").height() - 198;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    // 新增版本
    GetIssue() {
      const that = this;
      if (that.add.flat_form == 0) {
        that.add.url = that.infrom.android_urlDownload + that.add.name;
      } else {
        that.add.url = that.add.iosName;
      }
      if (that.add.flat_form == 0) {
        if (that.add.version == "") {
          that.$message.error("请填写版本号");
        } else if (that.add.update_log == "") {
          that.$message.error("请填写更新内容");
        } else if (that.$refs.file.files[0] == undefined) {
          that.$message.error("请上传APP");
        } else {
          that.loadingType = true;
          let itemUrl = that.$refs.file.files[0];
          let item = {
            name: itemUrl.name,
            size: itemUrl.size,
            file: itemUrl
          };
          that.html5Reader(itemUrl, item);
          that.$http
            .post(that.urlHosts + "/anygo/common/ali_sts")
            .then(res => {
              if (res.status === 200) {
                let OSSData = res.data;
                var ossUrl;
                const client = new OSS.Wrapper({
                  region: "oss-cn-beijing",
                  accessKeyId: OSSData.AccessKeyId,
                  accessKeySecret: OSSData.AccessKeySecret,
                  stsToken: OSSData.SecurityToken,
                  bucket: "aetos-go"
                });
                let obj = that.infrom.android_url.match(/com\/(\S*)\//)[1];
                let f = item;
                const Name = f.name;
                const suffix = Name.substr(Name.indexOf("."));
                const storeAs = obj + "/" + that.add.name;
                client
                  .multipartUpload(storeAs, f.file)
                  .then(function(result) {
                    that.Getadduse();
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            })
            .catch(err => {
              that.loadingType = false;
              that.$message.error("网络异常！");
            });
        }
      } else {
        that.Getadduse();
      }
    },
    // 将图片文件转成BASE64格式
    html5Reader(file, item) {
      const reader = new FileReader();
      reader.onload = e => {
        this.$set(item, "src", e.target.result);
      };
      reader.readAsDataURL(file);
    },
    Getadduse(id) {
      const that = this;
      that.loadingType = true;
      if (id == undefined) {
        var data = {
          access_token: that.access_token,
          version: that.add.version,
          url: that.add.url,
          update_log: that.add.update_log,
          size: that.add.size,
          constraint_flg: that.add.constraint_flg,
          flat_form: that.add.flat_form
        };
      } else {
        var data = {
          access_token: that.access_token,
          id: that.add.id,
          version: that.add.version,
          url: that.add.url,
          update_log: that.add.update_log,
          size: that.add.size,
          constraint_flg: that.add.constraint_flg,
          flat_form: that.add.flat_form
        };
      }
      that
        .$http({
          url: that.urlHost + "/man/version/issue",
          method: "post",
          params: data,
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.$message.success(res.data.msg);
            that.dialogDiv.add = false;
            that.GetList();
            that.add = {
              version: "", //版本号
              name: "",
              url: "",
              iosName: "",
              androidName: "",
              update_log: "", //更新类容
              flat_form: 0, //应用平台
              constraint_flg: 1,
              size: ""
            };
          } else {
            that.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    //添加
    addList() {
      this.dialogDiv.add = true;
    },

    //删除
    delItem(data, index) {
      let that = this;
      that
        .$confirm("是否删除？", "提示")
        .then(() => {
          that
            .$http({
              url: that.urlHost + "/man/version/del",
              method: "post",
              params: {
                access_token: that.access_token,
                id: data[index].id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                that.$message.success("已删除！");
                that.GetList();
              } else {
                that.$base.err(res, that);
              }
            })
            .catch(err => {});
        })
        .catch(() => {
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
.appversion {
  position: relative;
  height: 100%;
  overflow: auto;
  .appversion_top {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    color: #999;
    border-bottom: 1px solid #aaa;
    span {
      font-size: 15px;
    }
  }
  .appversion_box {
    position: relative;
    padding-left: 20px;
    height: calc(100% - 45px);
    display: flex;
    flex-direction: column;
    // background:#ccc;
    .appversion_search {
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
    .appversion_table {
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
    .appversion_pages {
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
