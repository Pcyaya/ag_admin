<template>
  <div class="hiring" :style="{'width':rightW}">
    <Loading v-if="loading"></Loading>
    <div class="hiring_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：官网管理 >
        <span>
          <el-button type="text">招贤纳士</el-button>
        </span>
      </div>
    </div>
    <div class="hiring_box">
      <!-- 查询条件 -->
      <div class="hiring_search">
        <div>
          <div>
            <span>职位类别：</span>
            <el-select v-model="reNesData.business" placeholder>
              <el-option
                v-for="item in reHiringType"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>职位名称：</span>
            <el-input v-model="reNesData.name" placeholder="职称"></el-input>
          </div>
          <div>
            <span>工作经验：</span>
            <el-input
              v-model="reNesData.exper"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              placeholder="工作经验"
            ></el-input>
          </div>
          <div>
            <span>学历：</span>
            <el-input v-model="reNesData.edu" placeholder="学历"></el-input>
          </div>
          <div>
            <span>发布时间：</span>
            <el-date-picker
              v-model="reNesData.start"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div>
            <span>审核：</span>
            <el-select v-model="reNesData.audit">
              <el-option
                v-for="item in flags"
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
            <el-button @click="hirClear" size="mini">
              <i class="el-icon-refresh"></i> 清空
            </el-button>
          </div>
        </div>
      </div>
      <div class="searchBtn">
        <div>
          <el-button @click="hirAddEdit" size="mini">
            <i class="el-icon-edit"></i> 新增
          </el-button>
        </div>
      </div>
      <!-- 列表 -->
      <div class="hiring_table">
        <el-table
          :data="hiringDatares.data"
          :height="tableHeight"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" :index="indexMethod" align="center" width="49" label="编号"></el-table-column>
          <el-table-column prop="business_name" align="center" label="职位类别"></el-table-column>
          <el-table-column prop="name" align="center" width="150" label="职位名称"></el-table-column>
          <el-table-column prop="addr" align="center" label="工作地点"></el-table-column>
          <el-table-column prop="exper" align="center" label="工作经验"></el-table-column>
          <el-table-column prop="edu" align="center" label="学历"></el-table-column>
          <el-table-column align="center" type="expand" width="120" label="详情">
            <template slot-scope="props">
              <el-form label-position="top" inline class="demo-table-expand">
                <div v-for="(item,index) in props.row.details" :key="index">
                  <!-- <div>{{item.title}}</div> -->
                  <div v-html="item.content"></div>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="date" align="center" width="100" label="发布时间"></el-table-column>
          <el-table-column prop="apply_num" align="center" label="申请人">
            <template slot-scope="props">
              <div class="apply-num" @click="applyBtn(hiringDatares.data,props.$index)">
                <span>{{props.row.apply_num}}</span>
                <i class="el-icon-caret-bottom"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" width="280" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.audit === '已审核'"
                @click="auditBtn(hiringDatares.data,scope.$index)"
                type="success"
                size="mini"
              >{{scope.row.audit}}</el-button>
              <el-button
                v-else
                @click="auditBtn(hiringDatares.data,scope.$index)"
                type="info"
                size="mini"
              >{{scope.row.audit}}</el-button>
              <el-button
                @click="hiringEditBtn(hiringDatares.data,scope.$index)"
                type="primary"
                size="mini"
              >编辑</el-button>
              <el-button
                @click="hiriDel(hiringDatares.data,scope.$index)"
                type="danger"
                size="mini"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="hiring_pages">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="20"
          :page-sizes="[5,10,20,30,50,100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="hiringDatares.total"
        ></el-pagination>
      </div>
      <!-- 预览窗口 -->
      <el-dialog class="dialogDIv" title :visible.sync="dialogDiv">
        <div class="bg-fff">
          <div class="dialog-search">
            <div>
              <span>姓名:</span>
              <el-input v-model="dialogData.name" placeholder="name"></el-input>
            </div>
            <div>
              <span>手机号:</span>
              <el-input v-model="dialogData.phone" placeholder="phone"></el-input>
            </div>
            <div>
              <span>邮箱:</span>
              <el-input v-model="dialogData.email" placeholder="email"></el-input>
            </div>
            <div>
              <span>性别:</span>
              <el-select v-model="dialogData.sex" placeholder="请选择">
                <el-option
                  v-for="item in sexFlags"
                  :key="item.index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div>
              <span>是否有简历:</span>
              <el-select v-model="dialogData.resume" placeholder="请选择">
                <el-option
                  v-for="item in flags"
                  :key="item.index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div>
              <el-button @click="dialogSearch" type="primary" size="mini">
                <i class="el-icon-search"></i> 查询
              </el-button>
            </div>
            <div>
              <el-button @click="dialogClear" size="mini">
                <i class="el-icon-delete"></i> 清空
              </el-button>
            </div>
          </div>
          <div class="dialogTab">
            <el-table
              :data="resDialogData.data"
              border
              size="mini"
              :default-sort="{prop: 'date', order: 'descending'}"
              :row-class-name="tableRowClassName"
            >
              <el-table-column prop="name" label="姓名" width="100" align="center" sortable></el-table-column>
              <el-table-column prop="sex" label="性别" width="80" align="center" sortable></el-table-column>
              <el-table-column prop="phone" label="手机号" width="120" align="center" sortable></el-table-column>
              <el-table-column prop="email" label="电子邮箱" width="120" align="center" sortable></el-table-column>
              <el-table-column prop="content" label="留言内容" align="center"></el-table-column>
              <el-table-column prop="create_date" label="投递时间" width="120" align="center" sortable></el-table-column>
              <el-table-column fixed="right" label="简历文档" width="200" align="center">
                <template slot-scope="props">
                  <div>
                    <el-button
                      size="mini"
                      @click="details(resDialogData.data,props.$index)"
                      v-if="props.row.resume_flg === 1"
                    >{{props.row.name}}个人简历</el-button>
                    <div v-else>---</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog2">
          <el-dialog
            class="dialog2"
            width="75%"
            align="center"
            :visible.sync="dialogDiv1"
            append-to-body
          >
            <!-- <canvas id="the-canvas"></canvas> -->
            <!-- <div style="min-height:500px" id="handout_wrap_inner"></div> -->
            <iframe
              style="min-height:600px"
              :src="docPdf"
              width="100%"
              height="100%"
              frameborder="1"
            ></iframe>
          </el-dialog>
        </div>
      </el-dialog>

      <!-- <div class="hiring_bottom">
                © 3.7.1 jeecg
      </div>-->
    </div>
  </div>
</template>

<script>
import Loading from "./../../../../loading/loading";
export default {
  data() {
    return {
      access_token: "",
      reHiringType: [], //职位类型~获取
      reNesData: {
        //输入查询条件
        business: "", //类别
        name: "", //职位
        start: "", //发布时间
        exper: "", //工作经验
        edu: "", //学历
        audit: -1, //审核
        page: 1, //页数
        rows: 20 //每页个数
      },
      hiringDatares: {}, //列表数据~获取
      currentPage: 1, // 页码
      pagesizeL: 10,
      dialogDiv: false,
      dialogDiv1: false,
      flags: [
        {
          name: "全部",
          id: -1
        },
        {
          name: "是",
          id: 1
        },
        {
          name: "否",
          id: 0
        }
      ],
      sexFlags: [
        {
          name: "全部",
          id: -1
        },
        {
          name: "女",
          id: 1
        },
        {
          name: "男",
          id: 0
        }
      ],
      dialogData: {
        id: "",
        name: "",
        phone: "",
        email: "",
        sex: -1,
        resume: -1
      },
      resDialogData: {},
      docPdf: "",
      loading: false,
      tableHeight: "auto",
      rightW: ""
    };
  },
  components: {
    Loading
  },
  created() {
    let _that = this;
    this.access_token = localStorage.getItem("accessToken");
    if (this.access_token != null) {
      this.access_token = JSON.parse(this.access_token);
      this.hiringType(); //职位类型查询
      this.hiringList(); //招聘列表
      // console.log(this.access_token);
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
          window.innerHeight - $(".hiring_search").height() - hig;
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
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      }
      return "";
    },
    indexMethod(index) {
      return index < 10 ? "0" + (index + 1) : index + 1;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.hiringList();
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this.hiringList();
    },
    //编辑招聘信息
    hiringEditBtn(data, index) {
      localStorage.setItem("locaHriData", JSON.stringify(data[index]));
      localStorage.setItem("accessToken", JSON.stringify(this.access_token));
      this.$router.push({ path: "/hiringEdit" });
    },
    // 新增
    hirAddEdit() {
      localStorage.setItem(
        "locaHriData",
        JSON.stringify({
          id: "",
          business_name: "",
          name: "",
          addr: "",
          exper: "",
          details: []
        })
      );
      this.$router.push({ path: "/hiringEdit" });
    },
    //删除信息
    hiriDel(data, index) {
      const _that = this;
      _that
        .$confirm("是否删除？", "提示")
        .then(() => {
          _that
            .$http({
              url: _that.urlHost + "/man/recruit/del",
              method: "post",
              params: {
                access_token: _that.access_token,
                id: data[index].id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                data.splice(index, 1);
              } else {
                _that.$base.err(res, _that);
              }
            });
        })
        .catch(() => {});
    },
    //审核
    auditBtn(data, index) {
      let _that = this;
      let id = data[index].id;
      _that
        .$confirm("是否修改？", "提示")
        .then(() => {
          _that
            .$http({
              url: _that.urlHost + "/man/recruit/audit",
              method: "post",
              params: {
                access_token: _that.access_token,
                id: id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                _that.hiringList();
                _that.$message({
                  message: "修改成功！",
                  type: "success",
                  center: true
                });
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
    //招聘职位类别查询
    hiringType() {
      const _that = this;
      _that
        .$http({
          url: _that.urlHost + "/man/recruit/business/list",
          method: "post",
          params: {
            access_token: _that.access_token
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            _that.reHiringType = res.data.obj;
            _that.reHiringType.unshift({ id: "", name: "全部" });
            // console.log(res.data.obj);
          } else {
            _that.$base.err(res, _that);
          }
        });
    },
    //招聘列表
    hiringList() {
      const _that = this;
      _that.loading = true;
      _that
        .$http({
          url: _that.urlHost + "/man/recruit/list",
          method: "post",
          params: {
            access_token: _that.access_token,
            business: _that.reNesData.business,
            name: _that.reNesData.name,
            start: _that.reNesData.start,
            exper: _that.reNesData.exper === "" ? -1 : _that.reNesData.exper,
            edu: _that.reNesData.edu,
            page: _that.currentPage,
            rows: _that.pagesize,
            audit: _that.reNesData.audit
          }
        })
        .then(res => {
          _that.loading = false;
          if (res.data.success === "00000000") {
            // console.log(res.data.obj)
            _that.loading = false;
            _that.hiringDatares = res.data.obj;
            for (let i in _that.hiringDatares.data) {
              _that.hiringDatares.data[i].date = _that.$base.tampToTime(
                _that.hiringDatares.data[i].date,
                2
              );
              _that.hiringDatares.data[i].audit =
                this.hiringDatares.data[i].audit === 1 ? "已审核" : "未审核";
            }
            this.tableHeight =
              window.innerHeight - $(".hiring_search").height() - 198;
          } else {
            _that.$base.err(res, _that);
          }
        })
        .catch(e => {
          _that.loading = false;
          _that.$message({
            message: "网络异常！",
            type: "error",
            align: true
          });
        });
    },
    //条件搜索
    GetSearchList() {
      this.currentPage = 1;
      this.hiringList();
    },
    //清空条件
    hirClear() {
      this.reNesData = {
        business: "", //类别
        name: "", //职位
        start: "", //发布时间
        exper: "", //工作经验
        edu: "", //学历
        audit: -1, //审核
        page: 1, //页数
        rows: 20 //每页个数
      };
    },
    //  简历列表
    applyBtn(data, index) {
      this.dialogData = {
        id: "",
        name: "",
        phone: "",
        email: "",
        sex: -1,
        resume: -1
      };
      this.dialogData.id = data[index].id;
      this.dialogSearch();
    },
    //简历查询
    dialogSearch() {
      const _that = this;
      _that.loading = true;
      _that
        .$http({
          url: _that.urlHost + "/man/recruit/apply/list",
          method: "post",
          params: {
            access_token: _that.access_token,
            id: _that.dialogData.id,
            name: _that.dialogData.name,
            phone: _that.dialogData.phone,
            email: _that.dialogData.email,
            sex: _that.dialogData.sex,
            resume_flg: _that.dialogData.resume,
            page: 1,
            rows: 100
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            // console.log(res.data.obj);
            _that.dialogDiv = true;
            _that.loading = false;
            _that.resDialogData = res.data.obj;
            for (let i in _that.resDialogData.data) {
              _that.resDialogData.data[i].create_date = _that.$base.tampToTime(
                _that.resDialogData.data[i].create_date,
                2
              );
              _that.resDialogData.data[i].sex =
                _that.resDialogData.data[i].sex == 0 ? "男" : "女";
            }
          } else {
            _that.$base.err(res, _that);
          }
        });
    },
    // 查看个人简历
    details(data, index) {
      this.dialogDiv1 = true;
      let srcs = "https://view.officeapps.live.com/op/view.aspx?src=";
      let txtUrl =
        "https://ag-home.oss-cn-beijing.aliyuncs.com/resume/" +
        data[index].details[0].url;
      // this.docPdf = srcs+txtUrl
      if (
        data[index].details[0].url.substr(
          data[index].details[0].url.indexOf(".")
        ) === ".pdf" ||
        data[index].details[0].url.substr(
          data[index].details[0].url.indexOf(".")
        ) === ".PDF"
      ) {
        this.docPdf = txtUrl;
      } else {
        this.docPdf = srcs + txtUrl;
      }
    },
    //清空简历查询条件
    dialogClear() {
      this.dialogData.name = "";
      this.dialogData.phone = "";
      this.dialogData.email = "";
      this.dialogData.sex = -1;
      this.dialogData.resume = -1;
    }
  }
};
</script>

<style>
.hiring {
  position: relative;
  height: 100%;
  overflow: auto;
  /* overflow: hidden; */
}
.hiring_top {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  color: #999;
  border-bottom: 1px solid #aaa;
}
.hiring_top span {
  font-size: 15px;
}
.hiring_box {
  position: relative;
  padding-left: 20px;
  height: calc(100% - 45px);
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
.hiring_search {
  padding-top: 15px;
  display: flex;
}
.hiring_search > div {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
}
.hiring_search > div > div {
  margin-right: 20px;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
}
.hiring_search > div > div > span {
  white-space: nowrap;
}
.hiring_search > div > div .el-input__suffix-inner i,
.hiring_search > div > div .el-input__prefix i {
  height: 30px;
  line-height: 30px;
}
.hiring_search > div:nth-child(1) input {
  height: 30px;
  max-width: 150px;
}
.hiring_search > div:nth-child(1) .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  max-width: 150px;
  height: 30px;
  line-height: 30px;
}
.hiring_box .searchBtn {
  padding-bottom: 15px;
}
.hiring_table {
  position: relative;
  max-height: calc(100% - 125px);
  width: 100%;
  overflow: auto;
  flex: 1;
}
.hiring_table .demo-table-expand {
  padding: 10px 20px;
}
.hiring_table .el-table--mini td,
.hiring_table .el-table--mini th {
  padding: 5px 0;
}
.hiring_table .el-table {
  border: 1px solid #ccc;
}
.hiring_table .el-table th {
  background: #e2eff8 !important;
  color: #000 !important;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc !important;
}
.hiring_table .el-table th:first-child {
  border-left: 0;
}
.hiring_table .el-table td:first-child {
  border-left: 0 !important;
}
.hiring_table .el-table td {
  border: 1px solid #ccc;
  border-right: 0;
  border-top: 0;
}
.hiring_table .el-table .warning-row {
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
.hiring_pages {
  z-index: 1;
  position: relative;
  padding: 5px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  margin: -1px 0 0 0.5px;
}
.hiring_bottom {
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
.hiring_table .el-dialog {
  width: 80%;
}
.dialog-search {
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0;
}
.dialog-search > div {
  display: flex;
  align-items: center;
  margin: 10px;
}
.dialog-search > div > span {
  white-space: nowrap;
  margin-right: 10px;
}
.dialog-search input {
  height: 30px;
  max-width: 150px;
}
.dialog-search .el-input i {
  height: 30px;
  line-height: 30px;
}
.dialogTab td,
.dialogTab th {
  padding: 5px 0;
}
.dialogDIv .el-dialog__body {
  padding: 0 !important;
}
.dialogDIv .el-table th {
  background: #e3f0f9 !important;
  color: #000 !important;
  border: 1px solid #ccc;
  border-left: 0;
  /* border-top: 2px solid #ccc; */
}
/* .dialogDIv .el-table td{
        border: 1px solid #ccc !important;
        height: 60px;
    } */
.dialogDIv .dialogTab .el-button {
  height: 35px;
  line-height: 5px;
  color: #3a9cf7;
}
.dialogDIv .el-table__body-wrapper {
  border: 0 !important;
}
.dialog2 .el-dialog__body {
  padding: 20px 4px 0 0 !important;
}
.bg-fff {
  background: #fff;
}
</style>

