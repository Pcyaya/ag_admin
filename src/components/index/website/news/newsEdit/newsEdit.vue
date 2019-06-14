<template>
  <div class="newsEdit" id="newsEdit">
    <Loading v-if="loading"></Loading>
    <div class="newsEdit_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：官网管理 >
        <span>
          <el-button style="color:#999" type="text" @click="newsBtn">新闻中心</el-button>
        </span> >
        <span>
          <el-button type="text">编辑</el-button>
        </span>
      </div>
    </div>

    <div class="newsEdit_box">
      <div class="newsEdit_box_top">
        <div>新闻列表编辑</div>
        <div @click="viewD(),dialogTableVisible=true">预览</div>
      </div>

      <div class="newsEdit_box_content">
        <div>
          <div class="mt7">公司类别：</div>
          <div class="newsEdit_box_content_type">
            <div
              @click="newsItemData.business = 'anb_000000'"
              :class="{'item_active': newsItemData.business === 'anb_000000'}"
            >公司动态</div>
            <div
              @click="newsItemData.business = 'anb_000001'"
              :class="{'item_active': newsItemData.business === 'anb_000001'}"
            >行业新闻</div>
            <div
              @click="newsItemData.business = 'anb_000002'"
              :class="{'item_active': newsItemData.business === 'anb_000002'}"
            >产品资讯</div>
          </div>
        </div>

        <div>
          <div class="mt7">图片展示：</div>
          <div class="newsEdit_box_content_imgs">
            <div v-if="!changeImgF" @click="changeImg">
              <img :src="newsItemData.img" width="100%" height="100%" alt>点击上传图片
            </div>
            <div v-else @click="changeImg">
              <img :src="newsItemData.img" width="100%" height="100%" alt>
            </div>
            <input
              v-show="0"
              type="file"
              @change="fileChanged"
              ref="file"
              multiple="multiple"
              accept="image/jpg, image/jpeg, image/png, image/bmp"
            >
          </div>
        </div>

        <div class="mt7">
          <div>新闻标题：</div>
          <div class="newsEdit_box_content_title">
            <el-input v-model="newsItemData.title" placeholder="新闻标题"></el-input>
          </div>
        </div>

        <div class="mt7">
          <div>展示内容：</div>
          <div class="newsEdit_box_content_content">
            <el-input v-model="newsItemData.content" placeholder="展示内容" type="textarea"></el-input>
          </div>
        </div>

        <div style="align-items: center;">
          <div>来&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;源：</div>
          <div class="newsEdit_box_content_title">
            <el-input v-model="newsItemData.source_name" disabled placeholder="来源"></el-input>
          </div>
        </div>

        <!-- <div style="align-items: center;">
                    <div>审核： </div>
                    <div>
                        <el-radio v-model="newsItemData.audit" label="0">否</el-radio>
                        <el-radio v-model="newsItemData.audit" label="1">是</el-radio>
                    </div>
        </div>-->
        <!-- <div style="align-items: center;">
                    <div>是否显示到官网首页： </div>
                    <div>
                        <el-radio v-model="newsItemData.index_flg" label="0">否</el-radio>
                        <el-radio v-model="newsItemData.index_flg" label="1">是</el-radio>
                    </div>
        </div>-->
        <div style="align-items: center;">
          <div>是否同步APP轮播图：</div>
          <div>
            <el-radio v-model="newsItemData.app_flg" :label="0">否</el-radio>
            <el-radio v-model="newsItemData.app_flg" :label="1">是</el-radio>
            <!-- <el-switch
                            v-model="newsItemData.app_flg"
                            active-color="#3A9CF7"
                            inactive-color="#ccc">
            </el-switch>-->
          </div>
        </div>
      </div>

      <div class="newsEdit_box_top mt100">
        <div>新闻详情编辑</div>
      </div>

      <div id="newsEditor">

      </div>

      <div class="newsEdit_box_btn">
        <el-button @click="release" type="primary">立即发送</el-button>
        <el-button @click="newsBtn">取消</el-button>
      </div>
      <!-- 预览窗口 -->
      <div class="newsEditDiv">
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
              <div>{{newsItemData.title}}</div>
              <div>
                <span v-if="newsItemData.date != ''">发布时间：{{newsItemData.date}} &nbsp;&nbsp;&nbsp;</span>
                <span v-show="newsContentObj.source_name != ''">
                  来源：
                  <span v-if="newsItemData.source_name == '艾侗游'">
                    <span>{{newsItemData.source_name}}</span>
                  </span>
                  <span v-else @click="fromNews(newsItemData.origin)" class="fromNews">
                    <span>{{newsItemData.source_name}}</span>
                  </span>
                </span>
              </div>
            </div>
            <div class="news_cont_box">
              <div class="news_cont_item" v-for="(item,index) in newsContentObj" :key="index">
                <!-- <div v-show="item.url !=''" style="text-align:center;">
                  <img style="max-width:1150px" :src="item.url" alt>
                </div>
                <div v-show="item.title !=''">{{item.title}}</div>
                <div
                  v-show="item.content !=''"
                  :class="{'aL':item.align === 'l','aC':item.align === 'c','aR':item.align === 'r',}"
                >{{item.content}}</div> -->
                <div v-html="item.content"></div>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./../../../../loading/loading";
import wangEditor from "wangeditor";
export default {
  data() {
    return {
      dragging: null,
      dialogTableVisible: false,
      access_token: "",
      //标题及内容数据
      newsItemData: {},
      //详情数据
      newsContentObj: [],
      changeImgF: false,
      scrollT: false,
      textAlign: "",
      newItemsZ: [],
      loading: false
    };
  },
  created() {},
  components: {
    Loading
  },
  mounted() {
    let _that = this;
    let newsItem = localStorage.getItem("newsItem");
    this.access_token = JSON.parse(localStorage.getItem("accessToken"));
    this.newsItemData = JSON.parse(newsItem);
    this.newsItemData.audit = this.isFlag(this.newsItemData.audit);
    this.newsItemData.date = this.$base.tampToTime(this.newsItemData.date, 2);
    this.tableList(this.newsItemData.id);
    let scrollDiv = document.getElementById("newsEdit");
    scrollDiv.addEventListener("scroll", function() {
      if (scrollDiv.scrollTop > 960) {
        _that.scrollT = true;
      } else {
        _that.scrollT = false;
      }
    });

    this.editor = new wangEditor("#newsEditor");
    this.editor.customConfig.customUploadImg = function(files, insert) {
        _that.$http
        .post(_that.urlHosts + "/anygo/common/ali_sts")
        .then(res => {
          if (res.status === 200) {
            let OSSData = res.data;
            const client = new OSS.Wrapper({
              region: "oss-cn-beijing",
              accessKeyId: OSSData.AccessKeyId,
              accessKeySecret: OSSData.AccessKeySecret,
              stsToken: OSSData.SecurityToken,
              bucket: "ag-home"
            });
            let file = files[0];
            const point = file.name.lastIndexOf(".");
            let suffix = file.name.substr(point);
            let fileNames = _that.createRandomId() + suffix;
            let encodeFileName = encodeURI(new Date().getTime());
            client
            .multipartUpload("newsImg/" + fileNames, file)
            .then(data => {
                if (data.res.statusCode === 200) {
                // 上传代码返回结果之后，将图片插入到编辑器中
                insert('http://ag-home.oss-cn-beijing.aliyuncs.com/newsImg/'+fileNames);
                }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      };
    this.editor.create();
  },
  methods: {
    viewD() {
      let dom = $(this.editor.txt.html());
      var editorStr = [];
      for (let i = 0; i < dom.length; i++) {
        editorStr.push({
          title: null,
          content: dom[i].outerHTML,
          url: null,
          type: 0
        });
      }
      this.newsContentObj = editorStr;
    },
    newsBtn() {
      this.$router.push({ path: "/news" });
    },
    isType(obj) {
      if (obj == "公司动态") {
        return 0;
      } else if (obj == "行业新闻") {
        return 1;
      } else if (obj == "产品资讯") {
        return 2;
      }
    },
    isFlag(t) {
      if (t == "是") {
        return "1";
      } else {
        return "0";
      }
    },
    //更改列表图片展示
    changeImg() {
      this.$refs.file.click();
    },
    fileChanged() {
      try {
        const itemUrl = this.$refs.file.files[0];
        const item = {
          name: itemUrl.name,
          size: itemUrl.size,
          file: itemUrl
        };
        this.html5Reader(itemUrl, item);
        this.changeImgF = true;
        let _that = this;
        _that.$http
          .post(_that.urlHosts + "/anygo/common/ali_sts")
          .then(res => {
            if (res.status === 200) {
              let OSSData = res.data;
              const client = new OSS.Wrapper({
                region: "oss-cn-beijing",
                accessKeyId: OSSData.AccessKeyId,
                accessKeySecret: OSSData.AccessKeySecret,
                stsToken: OSSData.SecurityToken,
                bucket: "ag-home"
              });
              let f = item;
              const Name = f.name;
              const suffix = Name.substr(Name.indexOf("."));
              const obj = _that.timestamp();
              const storeAs =
                "newsImg/" + obj + _that.createRandomId() + suffix; //  路径+时间戳+随机命名+后缀名
              client
                .multipartUpload(storeAs, f.file)
                .then(function(result) {
                  _that.newsItemData.img =
                    "http://ag-home.oss-cn-beijing.aliyuncs.com/" + result.name;
                })
                .catch(err => {
                  console.log(err);
                });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } catch (err) {
        //console.log(err)
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
    //立即发布
    release() {
      let _that = this;
      if (_that.newsItemData.img == "") {
        _that.$message({
          message: "请添加图片展示！",
          type: "error",
          center: true
        });
      } else if (_that.newsItemData.title == "") {
        _that.$message({
          message: "标题不可为空！",
          type: "error",
          center: true
        });
      } else if (_that.newsItemData.content == "") {
        _that.$message({
          message: "展示类容不可为空！",
          type: "error",
          center: true
        });
      } else {
        let dom = $(_that.editor.txt.html());
        var editorStr = [];
        for (let i = 0; i < dom.length; i++) {
          editorStr.push({
            title: null,
            content: dom[i].outerHTML,
            url: null,
            type: 0
          });
        }
        this.newsContentObj = editorStr;
        // 新增/编辑新闻
        _that.loading = true;
        $.ajax({
          url: _that.urlHost + "/man/news/addedit",
          type: "post",
          data: {
            access_token: _that.access_token,
            id: _that.newsItemData.id,
            business: _that.newsItemData.business,
            title: _that.newsItemData.title,
            content: _that.newsItemData.content,
            img: _that.newsItemData.img,
            audit: Number(_that.newsItemData.audit),
            app_flg: Number(_that.newsItemData.app_flg),
            index_flg: Number(_that.newsItemData.index_flg),
            details: JSON.stringify(_that.newsContentObj)
          },
          dataType: "json",
          success: function(data) {
            if (data.success === "00000000") {
              _that.$message.success("操作成功！");
              _that.loading = false;
              _that.newsBtn();
            } else {
              _that.$base.err(res, _that);
            }
          },
          error: function(err) {
            _that.loading = false;
            _that.$message.error("网络异常！");
          }
        });
      }
    },
    //  时间戳
    timestamp: function() {
      const time = new Date();
      const y = time.getFullYear();
      const m = time.getMonth() + 1;
      const d = time.getDate();
      const h = time.getHours();
      const mm = time.getMinutes();
      const s = time.getSeconds();
      const ms = time.getMilliseconds();
      return (
        "" +
        y +
        this.Add0(m) +
        this.Add0(d) +
        this.Add0(h) +
        this.Add0(mm) +
        this.Add0(s) +
        this.Add0(ms)
      );
    },
    Add0: function(m) {
      return m < 10 ? "0" + m : m;
    },
    //随机命名
    createRandomId() {
      return Math.random()
        .toString(36)
        .substr(2);
    },
    //新闻详情数据获取
    tableList(id) {
      let _that = this;
      if (id != undefined) {
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
            if (res.data.success === "00000000") {
              _that.newsContentObj = res.data.obj.details;
              var editorStr = "";
              for (let i = 0; i < _that.newsContentObj.length; i++) {
                if(_that.newsContentObj[i].type == 1) {
                  editorStr += '<div style="text-align:center;"><img src="' + _that.newsContentObj[i].url + '" ></div>';
                }else {
                  editorStr += '<div>' + _that.newsContentObj[i].content + '</div>';
                }
              }
              this.editor.txt.html(editorStr);
            } else {
              _that.$base.err(res, _that);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //来源跳转
    fromNews(url) {
      window.open(url);
    }
  }
};
</script>

<style>
.newsEdit {
  position: relative;
  height: 100%;
  overflow: auto;
}
.newsEdit_top {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  color: #999;
  border-bottom: 1px solid #aaa;
}
.newsEdit_top span {
  font-size: 15px;
}
.newsEdit_top span:nth-child(1):hover {
  color: #3a9cf7;
}
.newsEdit_box {
  margin: 15px 20px;
  background: #fff;
  padding: 40px 0;
}
.newsEdit_box_top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.newsEdit_box_top > div:nth-child(1) {
  color: #000;
  font-weight: bold;
  font-size: 16px;
  background: #f3f3f3;
  padding: 10px 20px;
  border-radius: 0 50px 50px 0;
}
.newsEdit_box_top > div:nth-child(2) {
  padding: 10px 35px;
  background: #3a9cf7;
  color: #fff;
  cursor: pointer;
}
.newsEdit_box_top > div:nth-child(2):hover {
  background: rgba(58, 156, 247, 0.9);
}
#newsEditor {
  margin-top: 30px;
  flex: 1;
  display: block;
  z-index: 0;
}
#newsEditor img {
  max-width: 1000px;
  /* height: 800px !important; */
}
#newsEditor .w-e-text-container {
  height: 500px !important;
}
.newsEdit_box_content,
.newsEdit_box_content1 {
  margin: 30px 25px;
}
.newsEdit_box_content > div {
  display: flex;
  /* align-items: center; */
  margin-bottom: 30px;
}
.mt7 {
  margin-top: 7px;
}
.newsEdit_box_content > div > div:nth-child(2) {
  display: flex;
  margin-left: 20px;
}
.newsEdit_box_content_type > div {
  text-align: center;
  width: 208px;
  height: 40px;
  line-height: 40px;
  margin-right: 20px;
  border: 1px solid #ccc;
  color: #333;
  cursor: pointer;
}
.newsEdit_box_content_imgs > div {
  width: 260px;
  height: 160px;
  line-height: 160px;
  background-color: #f3f3f3;
  border: 1px solid #ccc;
  cursor: pointer;
  text-align: center;
  color: #999;
}
.newsEdit_box_content_title,
.newsEdit_box_content_content {
  flex: 1;
}
.newsEdit_box_content_contentAdd {
  display: flex;
}
.newsEdit_box_content_content textarea {
  height: 100px;
  resize: none;
}
.newsEdit_box_content_contentAdd textarea {
  /* max-width: 95%; */
  resize: none;
  height: 100px;
}
.newsEdit_box_content_contentAdd .el-button {
  width: 51px;
  height: 40px;
}
.mt100 {
  margin-top: 100px;
}
.newsEdit_box_font {
  display: flex;
}
.prel {
  position: relative;
  height: 40px;
}
.newsEdit_box_font > div {
  margin-right: 20px;
  padding: 7px 30px;
  /* border: 1px solid #ccc; */
  /* cursor: pointer; */
}
.newsEdit_box_font .el-button {
  margin-right: 20px;
}
.newsEdit_box_font > div:last-child {
  padding: 0;
  margin-left: 10px;
  display: flex;
  border: 1px solid #ccc;
}
.newsEdit_box_font > div:last-child > div {
  border-right: 1px solid #ccc;
  padding: 7px 20px;
  cursor: pointer;
}
.newsEdit_box_font > div:last-child > div:last-child {
  border-right: 0;
}
.newsEdit_box_inform {
  margin-top: 30px;
  border: 1px solid #ccc;
  /* height: 600px; */
  padding: 30px 80px 30px 30px;
  /* overflow: auto; */
}
.newsEdit_box_inform > div {
  margin-bottom: 20px;
  text-align: center;
}
.newsEdit_box_btn {
  margin-top: 60px;
  text-align: center;
}
.item_active {
  border-color: #3a9cf7 !important;
  color: #3a9cf7 !important;
}
.item_none {
  border-color: #ccc !important;
  color: #333;
}
.add-img > div {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border: 1px solid #eee;
}
.add-img > div:nth-child(2) {
  max-width: 90%;
}
.add-img img {
  /* flex: 1; */
  max-width: 90%;
  border: 1px solid #aaa;
  cursor: pointer;
}
.active-img {
  border-color: #3a9cf7 !important;
}
.none-img {
  border-color: #aaa;
}
.tx-l textarea,
.tx-l input {
  text-align: left;
}
.tx-c textarea,
.tx-c input {
  text-align: center;
}
.tx-r textarea,
.tx-r input {
  text-align: right;
}
.container {
  width: 80px;
  height: 300px;
  position: absolute;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 0;
}
.items > div {
  transition: all linear 0.3s;
  position: relative;
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
.scrollDiv {
  position: fixed;
  top: 50px;
  z-index: 2000;
  /* width: 100%; */
  background: #fff;
  padding: 20px;
}
.textAlign-act {
  background: #3a9cf7;
  color: #fff;
}

.newsEditDiv .el-dialog {
  width: 95%;
}
.newsEditDiv .el-dialog__body {
  padding: 0 !important;
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
</style>

