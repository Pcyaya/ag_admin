<template>
  <div class="news" :style="{'width':rightW}">
    <Loading v-if="loading"></Loading>
    <div class="news_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：官网管理 >
        <span>
          <el-button type="text">新闻中心</el-button>
        </span>
      </div>
    </div>
    <div class="news_box">
      <!-- 查询条件 -->
      <div class="news_search">
        <div>
          <div>
            <span>新闻类别：</span>
            <el-select v-model="reNesData.bussiness" placeholder>
              <el-option
                v-for="item in newsData.bussiness"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>是否同步APP轮播图：</span>
            <el-select v-model="reNesData.flg" placeholder=" ">
              <el-option
                v-for="item in newsData.flg"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
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
            <span>来源：</span>
            <el-select v-model="reNesData.source" placeholder=" ">
              <el-option
                v-for="item in newsData.source"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>审核：</span>
            <el-select v-model="reNesData.audit" placeholder=" ">
              <el-option
                v-for="item in newsData.audit"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <el-button size="mini" @click="GetSearchList" type="primary">
              <i class="el-icon-search"></i> 查询
            </el-button>
          </div>
          <div>
            <el-button size="mini" @click="empty">
              <i class="el-icon-refresh"></i> 清空
            </el-button>
          </div>
        </div>
      </div>
      <div class="searchBtn">
        <el-button size="mini" @click="addEdit">
          <i class="el-icon-edit"></i> 新增
        </el-button>
      </div>
      <!-- 新闻列表 -->
      <div class="news_table">
        <el-table
          :data="tableData2.data"
          :height="tableHeight"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" :index="indexMethod" align="center" width="50" label="编号"></el-table-column>
          <el-table-column prop="business_name" align="center" label="新闻类别" width="110"></el-table-column>
          <el-table-column align="center" width="90" label="展示图片">
            <template slot-scope="scope">
              <div v-if="scope.row.img == ''"></div>
              <img
                v-else
                @click="viewBtn([scope.row.img], 0, '')"
                class="cur"
                v-show="scope.row.img.substr(scope.row.img.length-1,1) != '/'"
                style="max-height:35px;max-width:100%"
                v-lazy="scope.row.img+'?x-oss-process=image/resize,p_10'"
              >
            </template>
          </el-table-column>
          <el-table-column prop="title" align="center" label="新闻标题"></el-table-column>
          <el-table-column prop="content" align="center" label="展示内容"></el-table-column>
          <el-table-column prop="app_flg" align="center" width="135" label="是否同步APP轮播图"></el-table-column>
          <!-- <el-table-column
                    prop="index_flg"
                    align="center"
                    width="100"
                    label="官网同步">
          </el-table-column>-->
          <el-table-column
            prop="date"
            align="center"
            label="发布时间"
            width="120"
          ></el-table-column>
          <el-table-column prop="source_name" align="center" label="来源" width="120"></el-table-column>
          <el-table-column align="center" fixed="right" width="350" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.audit === '已审核'"
                @click="auditBtn(tableData2.data,scope.$index)"
                type="success"
                size="mini"
              >{{scope.row.audit}}</el-button>
              <el-button
                v-else
                @click="auditBtn(tableData2.data,scope.$index)"
                type="info"
                size="mini"
              >{{scope.row.audit}}</el-button>
              <el-button @click="previewBtn(tableData2.data,scope.$index)" type size="mini">预览</el-button>
              <el-button @click="newsEditBtn(sourceCopy,scope.$index)" type="primary" size="mini">编辑</el-button>
              <el-button @click="delItem(tableData2.data,scope.$index)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新闻分页 -->
      <div class="news_pages">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="20"
          :page-sizes="[10,20,30,50,100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData2.total"
        ></el-pagination>
      </div>
      <!-- 预览窗口 -->
      <el-dialog title :visible.sync="dialogTableVisible">
        <div class="loadDiv">
          <div class="zzDiv">
            <div class="zzDiv-top">
              <div class="logo-img">
                <img src="https://ag-home.oss-cn-beijing.aliyuncs.com/imgs/logo.png" alt>
              </div>
              <div>
                <span>首页</span>
                <span>产品介绍</span>
                <span>APP下载</span>
                <span>关于我们</span>
              </div>
              <div>
                <span>EN</span>
                <span>商城</span>
              </div>
            </div>
            <div>
              <img
                style="width:100%"
                src="https://ag-home.oss-cn-beijing.aliyuncs.com/imgs/banner05.png"
                alt
              >
            </div>
            <div>
              <div></div>
            </div>
          </div>
          <div class="news_cont_tit">
            <div>{{newsDataInfrom.title}}</div>
            <div>
              发布时间：{{newsDataInfrom.date}} &nbsp;&nbsp;&nbsp;
              <span
                v-show="newsDataInfrom.source_name != ''"
              >
                来源：
                <span v-if="newsDataInfrom.source_name == '艾侗游'">
                  <span>{{newsDataInfrom.source_name}}</span>
                </span>
                <span v-else @click="fromNews(newsDataInfrom.origin)" class="fromNews">
                  <span>{{newsDataInfrom.source_name}}</span>
                </span>
              </span>
            </div>
          </div>
          <div class="news_cont_box">
            <div class="news_cont_item" v-for="(item,index) in newsDataInfrom.details" :key="index">
              <div v-show="item.url !=''" style="text-align:center;">
                <img style="max-width:1150px" :src="item.url" alt>
              </div>
              <div v-show="item.title !=''">{{item.title}}</div>
              <div
                v-show="item.content !=''"
                :class="{'aL':item.align === 'l','aC':item.align === 'c','aR':item.align === 'r',}"
              >{{item.content}}</div>
            </div>
          </div>
        </div>
      </el-dialog>

      <viewimg v-if="imgType" :imgurl="imgurldata" @typeBy="typeBy"></viewimg>
    </div>
  </div>
</template>

<script>
import Loading from "./../../../../loading/loading";
import viewimg from "./../../../../viewimg/viewimg";
export default {
  data() {
    return {
      access_token: "",
      newsData: {
        bussiness: [], //新闻类别
        flg: [
          { name: "全部", id: -1 },
          { name: "是", id: 1 },
          { name: "否", id: 0 }
        ], //是否在资讯显示
        flgnum: "",
        audit: [
          { name: "全部", id: -1 },
          { name: "是", id: 1 },
          { name: "否", id: 0 }
        ],
        start: "", //发布日期
        source: [], //来源
        page: 1, //页码
        rows: 10 //条数
      },
      reNesData: {
        bussiness: "",
        flg: -1,
        audit: -1,
        start: "",
        source: "",
        page: 1,
        rows: 10
      },
      sourceCopy: {},
      tableData2: [],
      currentPage: 1,
      pagesize: 20,
      dialogTableVisible: false,
      newsDataInfrom: {},
      newsContentObj: [],
      imgurldata: {
        list: [],
        index: 0,
        url: ""
      },
      imgType: false,
      loading: false,
      tableHeight: "auto",
      rightW: ""
    };
  },
  created() {
    let _that = this;
    _that.access_token = localStorage.getItem("accessToken");
    if (_that.access_token != null) {
      _that.access_token = JSON.parse(this.access_token);
      _that.business(); //新闻类别
      _that.source(); //来源
      _that.newsList(); //新闻列表
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
          window.innerHeight - $(".news_search").height() - hig;
      }, 0);
    };
    window.addEventListener("keydown", this.EventEnter);
  },
  components: {
    Loading,
    viewimg
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
      this.tableData2 = [];
      this.newsList();
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this.tableData2 = [];
      this.newsList();
    },
    //编辑新闻
    newsEditBtn(data, index) {
      let newsItemObj = JSON.stringify(data[index]);
      localStorage.setItem("newsItem", newsItemObj);
      this.$router.push({ path: "/newsEdit" });
    },
    //新增新闻
    addEdit() {
      let newsItemObj = {
        business: "anb_000000",
        img: "",
        date: "",
        title: "",
        content: "",
        app_flg: 0,
        index_flg: 0,
        source: "ans_000003",
        source_name: "艾侗游"
      };
      localStorage.setItem("newsItem", JSON.stringify(newsItemObj));
      this.$router.push({ path: "/newsEdit" });
    },
    //删除
    delItem(data, index) {
      let _that = this;
      let id = data[index].id;
      _that
        .$confirm("是否删除？", "提示")
        .then(() => {
          _that
            .$http({
              url: _that.urlHost + "/man/news/del",
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
    //预览
    previewBtn(data, index) {
      let _that = this;
      _that.tableList(data[index].id);
    },
    isType(obj) {
      if (obj === "anb_000000") {
        return "公司动态";
      } else if (obj === "anb_000001") {
        return "行业新闻";
      } else if (obj === "anb_000002") {
        return "产品资讯";
      }
    },
    isFlag(t) {
      if (t == 1) {
        return "是";
      } else if (t == 0) {
        return "否";
      }
    },
    isStr(t) {
      if (t === "是") {
        return 1;
      } else if (t === "否") {
        return 0;
      } else {
        return -1;
      }
    },
    isType(s) {
      if (s === "产品资讯") {
        return "anb_000002";
      } else if (s === "行业新闻") {
        return "anb_000001";
      } else if (s === "公司动态") {
        return "anb_000000";
      } else {
        return "";
      }
    },
    isSource(s) {
      if (s === "新华网") {
        return "ans_000001";
      } else if (s === "新华旅游") {
        return "ans_000002";
      } else if (s === "艾侗游") {
        return "ans_000003";
      } else {
        return "";
      }
    },
    indexMethod(index) {
      return index + 1;
      // return index < 9 ? '0' + (index+1) : (index+1);
    },

    //条件查询
    GetSearchList() {
      // this.tableData2 = []
      this.currentPage = 1;
      this.newsList();
    },
    // 清空条件
    empty() {
      this.reNesData = {
        bussiness: "",
        start: "",
        source: "",
        flg: -1,
        audit: -1
      };
    },
    //新闻类别
    business() {
      let _that = this;
      _that
        .$http({
          url: _that.urlHost + "/man/news/business/list",
          method: "post",
          params: {
            access_token: _that.access_token
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            _that.newsData.bussiness = res.data.obj;
            // console.log(_that.newsData)
            _that.newsData.bussiness.unshift({ id: "", name: "全部" });
          } else {
            _that.$base.err(res, _that);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //来源
    source() {
      let _that = this;
      _that
        .$http({
          url: _that.urlHost + "/man/news/source/list",
          method: "post",
          params: {
            access_token: _that.access_token
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            _that.newsData.source = res.data.obj;
            // console.log(_that.newsData.source)
            _that.newsData.source.unshift({ id: "", name: "全部" });
          } else {
            _that.$base.err(res, _that);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //新闻列表
    newsList() {
      let _that = this;
      let paramsData = _that.reNesData;
      _that.loading = true;
      _that.$forceUpdate();
      // console.log(paramsData)
      _that
        .$http({
          url: _that.urlHost + "/man/news/list",
          method: "post",
          params: {
            access_token: _that.access_token,
            business: paramsData.bussiness,
            flg: paramsData.flg,
            source: paramsData.source,
            start: paramsData.start,
            page: _that.currentPage,
            rows: _that.pagesize,
            audit: paramsData.audit
          }
        })
        .then(res => {
          _that.loading = false;
          if (res.data.success === "00000000") {
            _that.tableData2 = res.data.obj;
            _that.sourceCopy = _that.$base.objDeepCopy(_that.tableData2.data);
            for (let i in this.tableData2.data) {
              this.tableData2.data[i].app_flg = this.isFlag(
                this.tableData2.data[i].app_flg
              );
              this.tableData2.data[i].index_flg = this.isFlag(
                this.tableData2.data[i].index_flg
              );
              this.tableData2.data[i].date = this.$base.tampToTime(
                this.tableData2.data[i].date,
                2
              );
              this.tableData2.data[i].audit =
                this.tableData2.data[i].audit === 1 ? "已审核" : "未审核";
            }
            this.tableHeight =
              window.innerHeight - $(".news_search").height() - 198;
            // console.log(_that.tableData2.data)
            // console.log(_that.sourceCopy)
          } else {
            _that.$base.err(res, _that);
          }
        })
        .catch(err => {
          _that.loading = false;
          _that.$message.error("网络异常！");
        });
    },
    // 新闻详情
    tableList(id) {
      let _that = this;
      _that.loading = true;
      _that
        .$http({
          url: _that.urlHost + "/man/news/content",
          method: "post",
          params: {
            access_token: _that.access_token,
            id: id
          }
        })
        .then(res => {
          _that.loading = false;
          if (res.data.success === "00000000") {
            _that.newsDataInfrom = res.data.obj;
            _that.newsContentObj = res.data.obj.details;
            _that.newsDataInfrom.date = this.$base.tampToTime(
              _that.newsDataInfrom.date,
              2
            );
            // console.log(res.data.obj.details);
            for (let i in _that.newsContentObj) {
              if (_that.newsContentObj[i].url != "") {
                delete _that.newsContentObj[i].content;
              }
            }
            _that.dialogTableVisible = true;
          } else {
            _that.$base.err(res, _that);
          }
        })
        .catch(err => {
          _that.loading = false;
          _that.$message.error("网络异常！");
          console.log(err);
        });
    },
    //来源跳转
    fromNews(url) {
      window.open(url);
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
              url: _that.urlHost + "/man/news/audit",
              method: "post",
              params: {
                access_token: _that.access_token,
                id: id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                _that.$message({
                  message: "修改成功！",
                  type: "success",
                  center: true
                });
                _that.newsList();
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
  }
};
</script>

<style>
.news {
  position: relative;
  height: 100%;
  overflow: auto;
  /* overflow: hidden; */
}
.news_top {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  color: #999;
  border-bottom: 1px solid #aaa;
}
.news_top span {
  font-size: 15px;
}
.news_box {
  position: relative;
  padding-left: 20px;
  height: calc(100% - 45px);
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
.news_search {
  padding-top: 15px;
  display: flex;
}
.news_search > div {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
}
.news_search > div > div {
  margin-right: 20px;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
}
.news_search > div > div > span {
  white-space: nowrap;
}
.news_search > div > div .el-input__suffix-inner i,
.news_search > div > div .el-input__prefix i {
  height: 30px;
  line-height: 30px;
}
.news_search > div:nth-child(1) input {
  height: 30px;
  max-width: 150px;
}
.news_search > div:nth-child(1) .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  max-width: 150px;
  height: 30px;
  line-height: 30px;
}
.news_box .searchBtn {
  padding-bottom: 15px;
}
.news_table {
  position: relative;
  max-height: calc(100% - 125px);
  width: 100%;
  overflow: auto;
  flex: 1;
}
.news_table .el-table--mini td,
.news_table .el-table--mini th {
  padding: 5px 0;
}
.news_table .el-table {
  border: 1px solid #ccc;
}
.news_table .el-table th {
  background: #e2eff8 !important;
  color: #000 !important;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc !important;
}
.news_table .el-table th:first-child {
  border-left: 0;
}

.news_table .el-table td:first-child {
  border-left: 0 !important;
}
.news_table .el-table td {
  border: 1px solid #ccc !important;
  border-right: 0 !important;
  border-top: 0 !important;
}
.news_table .el-table .warning-row {
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
.news_pages {
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
.news_cont_tit {
  text-align: center;
  font-size: 14px;
  color: #666;
  padding: 0 0 30px 0;
  margin-top: 40px;
  border-bottom: 1px solid #ccc;
}
.news_cont_tit > div:nth-child(1) {
  font-size: 24px;
  color: #333;
  padding-bottom: 20px;
}
.news_cont_box {
  padding: 40px 30px;
}
.news_cont_item div {
  margin-top: 30px;
}
.news_cont_item div:nth-child(2) {
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}
.fromNews:hover {
  color: #3a9cf5;
}
.fromNews {
  cursor: pointer;
}
.news_box .el-dialog {
  /* min-width: 1200px; */
  width: 95%;
  /* top: -80px; */
}
.aL {
  text-align: left;
}
.aC {
  text-align: center;
}
.aR {
  text-align: right;
}
.news_box .el-dialog__body {
  padding: 0 !important;
}
.news_box .el-dialog__header {
  /* display: none; */
  margin: 20px;
}
.zzDiv-top {
  display: flex;
  justify-content: space-around;
  font-size: 16px;
  height: 60px;
  line-height: 60px;
}
.zzDiv-top > div:nth-child(2) span {
  padding: 20px 30px;
}
.zzDiv-top > div:nth-child(2) span:last-child {
  background: #3a9cf5;
  color: #fff;
}
.zzDiv-top > div:nth-child(3) span:nth-child(1) {
  border-radius: 50px;
  background: #ccc;
  color: #fff;
  padding: 7px;
  margin-right: 20px;
}
.zzDiv-top > div:nth-child(3) span:nth-child(2) {
  border: 1px solid #3a9cf5;
  background: #3a9cf5;
  padding: 5px 20px;
  border-radius: 50px;
  color: #fff;
}
.logo-img img {
  margin-top: 10px;
}
</style>

