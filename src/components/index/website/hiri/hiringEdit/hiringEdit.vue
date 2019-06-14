<template>
  <div class="hiringEdit">
    <Loading v-if="loading"></Loading>
    <div class="hiringEdit_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：官网管理 >
        <span>
          <el-button style="color:#999" type="text" @click="hiringBtn">招贤纳士</el-button>
        </span> >
        <span>
          <el-button type="text">编辑</el-button>
        </span>
      </div>
    </div>

    <div class="hiringEdit_box">
      <div class="hiringEdit_box_top">
        <div @click="hirView(),dialogTableVisible=true">预览</div>
      </div>

      <div class="hiringEdit_box_content">
        <div>
          <div>职业类别：</div>
          <el-select style="display:flex;flex:1" v-model="hirItem.business_name" placeholder="请选择">
            <el-option
              v-for="item in hirTypeList"
              :key="item.index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>

        <div>
          <div>职位名称：</div>
          <el-input v-model="hirItem.name" placeholder="请输入职位名称"></el-input>
        </div>

        <div>
          <div>工作地点：</div>
          <el-input v-model="hirItem.addr" placeholder="如：上海-徐汇区"></el-input>
        </div>

        <div>
          <div>工作经验：</div>
          <div style="flex:1">
            <div class="exper-inp">
              <el-input v-model="hirItem.exper_star" placeholder></el-input>
              <div>-</div>
              <el-input v-model="hirItem.exper_end" placeholder></el-input>
              <div>年</div>
            </div>
          </div>
        </div>

        <div>
          <div>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;历：</div>
          <el-input v-model="hirItem.edu" placeholder="如：大专、本科、研究生"></el-input>
        </div>
        <div>
          <div>详&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;情：</div>
          <div id="hiringEditor"></div>
        </div>

        <div class="hiringEdit_box_btn">
          <el-button @click="hriRelease" type="primary">立即发送</el-button>
          <el-button @click="hiringBtn">取消</el-button>
        </div>
      </div>

      <!-- 预览窗口 -->
      <div class="hirEditDiv">
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
                  src="https://ag-home.oss-cn-beijing.aliyuncs.com/imgs/banner06.png"
                  alt
                >
              </div>
              <div>
                <div></div>
              </div>
            </div>
            <div class="hir_cont_box">
              <div>
                <div>{{hirItem.name}}</div>
                <div>工作地点：{{hirItem.addr}}</div>
                <div>
                  工作经验：
                  <span v-if="hirItem.exper_star == '0' && hirItem.exper_end == '0' ">无</span>
                  <span v-else-if="hirItem.exper_star == ''">{{hirItem.exper_end}}年</span>
                  <span v-else-if="hirItem.exper_end == ''">{{hirItem.exper_star}}年</span>
                  <span v-else-if="hirItem.exper_star == hirItem.exper_end">{{hirItem.exper_end}}年</span>
                  <span v-else>{{hirItem.exper_star}}-{{hirItem.exper_end}}年</span>
                </div>
                <div>学历：{{hirItem.edu}}</div>
                <div>立即申请</div>
              </div>
              <div class="hir_cont_item">
                <div v-for="(item,index) in hirItem.details" :key="index">
                  <!-- <div class="mt20" v-show="item.title !=''">{{item.title}}</div> -->
                  <div v-show="item.content !=''" v-html="item.content"></div>
                </div>
              </div>
            </div>
            <div style="height:20px"></div>
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
      dialogTableVisible: false,
      dragging: null,
      hirTypeList: [],
      access_token: "",
      hirItem: {},
      detailsData: [
        {
          title: "",
          content: [""]
        }
      ],
      editor: "",
      loading: false
    };
  },
  components: {
    Loading
  },
  mounted() {
    const _that = this;
    this.hirItem = localStorage.getItem("locaHriData");
    this.access_token = localStorage.getItem("accessToken");
    if (this.access_token != null) {
      this.hirItem = JSON.parse(this.hirItem);
      this.access_token = JSON.parse(this.access_token);
      if (this.hirItem.exper === "无") {
        this.hirItem.exper_star = 0;
        this.hirItem.exper_end = 0;
      } else if (this.hirItem.exper.indexOf("-") == -1) {
        this.hirItem.exper_star = this.hirItem.exper.substring(
          this.hirItem.exper.lastIndexOf("-") + 1,
          this.hirItem.exper.length - 1
        );
        this.hirItem.exper_end = this.hirItem.exper.substring(
          this.hirItem.exper.lastIndexOf("-") + 1,
          this.hirItem.exper.length - 1
        );
      } else {
        this.hirItem.exper_star = this.hirItem.exper.substring(
          0,
          this.hirItem.exper.lastIndexOf("-")
        );
        this.hirItem.exper_end = this.hirItem.exper.substring(
          this.hirItem.exper.lastIndexOf("-") + 1,
          this.hirItem.exper.length - 1
        );
      }
      this.typeList();
      this.editor = new wangEditor("#hiringEditor");
      this.editor.create();
      var editorStr = "";
      for (let i = 0; i < this.hirItem.details.length; i++) {
        editorStr += this.hirItem.details[i].content;
      }
      this.editor.txt.html(editorStr);
      // console.log(this.hirItem)
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
  },
  methods: {
    hirView() {
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
        this.hirItem.details = editorStr;
    },
      //随机命名
    createRandomId() {
      return Math.random()
        .toString(36)
        .substr(2);
    },
    //返回列表页面
    hiringBtn() {
      this.$router.push({ path: "/hiring" });
    },
    // 类别列表
    typeList() {
      let _that = this;
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
            this.hirTypeList = res.data.obj;
          } else {
            _that.$base.err(res, _that);
          }
        });
    },
    //立即发布
    hriRelease() {
      const _that = this;
      if (_that.hirItem.business_name === "") {
        _that.$message({
          message: "职业类别不可为空！",
          type: "error",
          content: "true"
        });
      } else if (_that.hirItem.name === "") {
        _that.$message({
          message: "职称不可为空！",
          type: "error",
          content: "true"
        });
      } else if (_that.hirItem.addr === "") {
        _that.$message({
          message: "工作地点不可为空！",
          type: "error",
          content: "true"
        });
      } else if (
        _that.hirItem.exper_star === "" ||
        _that.hirItem.exper_end === ""
      ) {
        _that.$message({
          message: "工作经验不可为空！",
          type: "error",
          content: "true"
        });
      } else if (
        _that.hirItem.exper_star < 0 ||
        _that.hirItem.exper_end < 0 ||
        Number(_that.hirItem.exper_star) > Number(_that.hirItem.exper_end)
      ) {
        _that.$message({
          message: "请输入正确的工作经验！",
          type: "error",
          content: "true"
        });
      } else if (_that.hirItem.edu === "") {
        _that.$message({
          message: "学历不可为空！",
          type: "error",
          content: "true"
        });
      } else {
        for (let i in _that.hirTypeList) {
          if (_that.hirTypeList[i].name == _that.hirItem.business_name) {
            _that.hirItem.business = _that.hirTypeList[i].id;
          }
        }
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
        this.hirItem.details = editorStr;
        _that.loading = true;
        _that
          .$http({
            url: _that.urlHost + "/man/recruit/addedit",
            method: "post",
            params: {
              access_token: _that.access_token,
              id: _that.hirItem.id,
              business_name: _that.hirItem.business_name,
              business: _that.hirItem.business,
              name: _that.hirItem.name,
              addr: _that.hirItem.addr,
              exper: Number(_that.hirItem.exper_star),
              exper_end: Number(_that.hirItem.exper_end),
              edu: _that.hirItem.edu,
              details: JSON.stringify(_that.hirItem.details)
            }
          })
          .then(res => {
            // console.log(res)
            if (res.data.success === "00000000") {
              _that.loading = false;
              _that.$message.success("操作成功！");
              _that.$router.push({ path: "/hiring" });
            } else {
              _that.$base.err(res, _that);
            }
          })
          .catch(err => {
            _that.$message.error("网络异常！");
            _that.loading = false;
            console.log(err);
          });
      }
    }
  }
};
</script>

<style>
.hiringEdit {
  position: relative;
  height: 100%;
  overflow: auto;
}
.hiringEdit_top {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  color: #999;
  border-bottom: 1px solid #aaa;
}
.hiringEdit_top span {
  font-size: 15px;
}
.hiringEdit_top span:nth-child(1):hover {
  color: #3a9cf7;
}
.hiringEdit_box {
  margin: 20px;
  background: #fff;
  padding-bottom: 20px;
}
.hiringEdit_box_top {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.hiringEdit_box_top > div {
  padding: 5px 5px 25px 20px;
  border-radius: 0 0 0 50px;
  background: #3a9cf7;
  color: #fff;
  cursor: pointer;
}
.hiringEdit_box_top > div:hover {
  /* background: rgba(58, 156, 247, .9); */
  opacity: 0.8;
}
.hiringEdit_box_content {
  margin: 0px 25px;
}
.hiringEdit_box_content > div {
  display: flex;
  /* align-items: center; */
  margin-bottom: 15px;
}
.hiringEdit_box_content > div > div:nth-child(1) {
  width: 100px;
  margin-top: 7px;
  flex: none;
}
.hiringEdit_box_content > div > div:nth-child(2) {
  display: flex;
  flex-wrap: wrap;
}
.hiringEdit_box_content_type > div {
  text-align: center;
  width: 208px;
  height: 40px;
  line-height: 40px;
  margin-right: 20px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  cursor: pointer;
}
.hiringEdit_box_content_imgs > div {
  width: 260px;
  height: 160px;
  background-color: #aaa;
  border: 1px solid #ccc;
}
.hiringEdit_box_content_content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.hiringEdit_box_content #hiringEditor {
  flex: 1;
  display: block;
  z-index: 1;
}
#hiringEditor .w-e-text-container {
  height: 500px !important;
}
.details {
  border: 1px solid #ccc;
  /* height: 500px; */
  padding: 0 20px 20px 20px;
  overflow: auto;
}

.details-item > div {
  display: flex;
}
.details-item > div:last-child {
  justify-content: center;
}
.addDiv {
  display: flex;
  justify-content: center;
  margin: 20px;
}
.contentAdd {
  color: #666;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  margin-right: 20px;
}
.details-item-content {
  width: 95%;
  margin-top: 5px;
}
.mt10 {
  margin-top: 10px;
}
.details-item-content input {
  padding-left: 25px;
}

.hiringEdit_box_btn {
  margin-top: 60px;
  justify-content: center;
}
.hiringEdit_box_btn input {
  width: 300px !important;
  height: 60px;
}
.mt10 {
  margin-top: 20px !important;
}
.exper-inp {
  display: flex;
  align-items: center;
}
.exper-inp input {
  width: 100px !important;
}
.exper-inp > div {
  margin-right: 15px;
}
.erper-sp {
  margin-left: 10px;
  color: #999;
  white-space: nowrap;
}
.hirEditDiv .el-dialog {
  width: 95%;
}
.hirEditDiv .el-dialog__body {
  padding: 0 !important;
}
.hir_cont_box {
  margin: 30px 50px;
  border: 1px solid #ccc;
}
.hir_cont_box > div:nth-child(1) {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid #ccc;
  padding: 20px 0;
}
.hir_cont_box > div:nth-child(1) > div:last-child {
  border: 1px solid #3a9cf5;
  padding: 10px 30px;
}
.mt20 {
  font-weight: bold;
}
.hir_cont_item {
  padding: 30px 50px;
}
.hir_cont_item > div {
  padding-top: 10px;
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

