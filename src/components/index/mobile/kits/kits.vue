<template>
  <!-- 菜单设置 -->
  <div class="kits" @click="intName = -1,intChildName = -1">
    <Loading v-if="loadingType"></Loading>
    <div class="kits_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：APP维护 >
        <span>
          <el-button type="text">生存锦囊</el-button>
        </span>
      </div>
    </div>
    <div class="box">
      <div class="box-left">
        <div class="left-title">
          <div>
            <i class="el-icon-goods"></i>生存锦囊
          </div>
          <div>
            <el-button type="text" @click="addType = 0,dialogDiv.add = true">添加</el-button>
            <!-- <el-button type="text">删除</el-button> -->
          </div>
        </div>
        <div class="left-content">
          <div>
            <el-collapse @change="iteminfo" v-model="activeName" accordion>
              <el-collapse-item
                v-for="(item, index) in ListLeftData.data"
                :key="index"
                style="margin-left:50px;width: calc(100% - 50px);"
                :name="index+1"
              >
                <template slot="title">
                  <div class="left-content-title">
                    <div>
                      {{index+1}}. {{item.title}} &nbsp;&nbsp;&nbsp;
                      <i
                        v-if="item.sync == 1"
                        class="el-icon-success col_in"
                      ></i>
                    </div>
                    <div>
                      <el-button
                        @click.stop.prevent="GetSync(item.id,1,-1)"
                        v-if="item.sync == 0"
                        type="text"
                        class="col_in"
                      >同步APP</el-button>
                      <el-button
                        @click.stop.prevent="GetSync(item.id,0,-1)"
                        v-else
                        type="text"
                        class="col_out"
                      >移出APP</el-button>
                      <el-button type="text" @click.stop.prevent="editInfo(item.id)">编辑</el-button>
                      <el-button type="text" @click.stop.prevent="GetSurvivalDel(item.id)">删除</el-button>
                    </div>
                  </div>
                </template>
                <div class="content">
                  <div v-html="Leftinfo.content"></div>
                  <div v-for="(infoItem, len) in Leftinfo.capsules" :key="len">
                    <p v-html="infoItem.title"></p>
                    <div v-html="infoItem.content"></div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
      <div class="box-right">
        <div class="right-title">
          <div>
            <i class="el-icon-phone"></i>紧急电话
          </div>
          <div>
            <el-button type="text" @click="addType1=1,dialogDiv.add1=true">添加</el-button>
            <!-- <el-button type="text">删除</el-button> -->
          </div>
        </div>
        <div class="right-content">
          <div v-for="(item,index) in PhoneListData.data" :key="index">
            <div class="title">
              <div>{{item.title}}</div>
              <div>
                <el-button
                  @click="GetSync(item.id,'1',0)"
                  v-if="item.sync == 0"
                  type="text"
                  class="col_in"
                >同步APP</el-button>
                <el-button @click="GetSync(item.id,'0',0)" v-else type="text" class="col_out">移出APP</el-button>
                <el-button type="text" @click="addType1=21,dialogDiv.add1=true,phoneAdd(item,1)">添加</el-button>
                <el-button type="text" @click="addType1=12,dialogDiv.add1=true,phoneAdd(item,1)">编辑</el-button>
                <el-button type="text" @click="GetUrgentlDel(item.id)">删除</el-button>
              </div>
            </div>
            <div class="item" v-for="(child, len) in PhoneListData.data[index].details" :key="len">
              <div>{{child.title}} {{child.phone}}</div>
              <div>
                <el-button
                  @click="GetSync(child.id,'1')"
                  v-if="child.sync == 0"
                  type="text"
                  class="col_in"
                >同步APP</el-button>
                <el-button @click="GetSync(child.id,'0')" v-else type="text" class="col_out">移出APP</el-button>
                <el-button
                  type="text"
                  @click="addType1=22,dialogDiv.add1=true,phoneAdd(item,2,len)"
                >编辑</el-button>
                <el-button type="text" @click="GetUphonelDel(child.id)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class>
      <el-dialog class="dialogDIv" width="600px" title :visible.sync="dialogDiv.add">
        <div class="dialoBox">
          <div class="dialoTitle">
            <div v-if="addType == 0">添加——生存锦囊</div>
            <div v-if="addType == 1">编辑——{{Leftinfo.title}}</div>
            <div @click="dialogDiv.add = false" class="cur">X</div>
          </div>
          <div class="dialoContent">
            <div>
              <span>标题：</span>
              <div>
                <el-input v-model="reInfo.title"></el-input>
              </div>
            </div>
            <div>
              <span>更新类容：</span>
              <div>
                <el-input type="textarea" :rows="10" v-model="reInfo.content"></el-input>
              </div>
            </div>
            <div>
              <el-button size="mini" type="primary" v-if="addType == 0" @click="Getissue(1)">同步到app</el-button>
              <el-button size="mini" v-else @click="dialogDiv.add = false">取消</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="Getissue"
                :class="{'submit-active':addType == 0}"
              >完成</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog class="dialogDIv add2" width="600px" title :visible.sync="dialogDiv.add1">
        <div class="dialoBox">
          <div class="dialoTitle">
            <div v-if="addType1 == 1">添加——紧急电话</div>
            <div v-if="addType1 == 12">编辑——{{rePhoneInfo.tit}}</div>
            <div v-if="addType1 == 21">添加——{{rePhoneInfo.tit}}</div>
            <div v-if="addType1 == 22">编辑——{{rePhoneInfo.tit}}</div>
            <div @click="dialogDiv.add1 = false" class="cur">X</div>
          </div>
          <div class="dialoContent">
            <div v-if="addType1 == 1 || addType1 == 12">
              <span>国家：</span>
              <div>
                <el-input v-model="rePhoneInfo.urgent"></el-input>
              </div>
            </div>
            <div v-if="addType1 == 21 || addType1 == 22">
              <span>类别：</span>
              <div>
                <el-input v-model="rePhoneInfo.title"></el-input>
              </div>
            </div>
            <div v-if="addType1 == 21 || addType1 == 22">
              <span>电话：</span>
              <div>
                <el-input v-model="rePhoneInfo.phone"></el-input>
              </div>
            </div>
            <div>
              <el-button
                size="mini"
                type="primary"
                v-if="addType1 == 1 || addType1 == 21"
                @click="submit(1)"
              >同步到app</el-button>
              <el-button v-else size="mini" @click="dialogDiv.add1 = false">取消</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="submit"
                class="cur"
                :class="{'submit-active':addType1 == 1 || addType1 == 21}"
              >完成</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Loading from "../../../loading/loading";
export default {
  data() {
    return {
      access_token: "",
      activeName: "",
      loadingType: false,
      page: 1,
      phonePage: 1,
      rows: 1000,
      phoneRows: 1000,
      ListLeftData: {}, //锦囊列表
      Leftinfo: {}, //锦囊详情
      infoid: '',
      PhoneListData: {}, //紧急列表
      dialogDiv: {
        add: false,
        add1: false
      },
      addType: "",
      addType1: "",
      reInfo: {
        title: "",
        content: ""
      },
      rePhoneInfo: {
        urgent: "",
        title: "",
        phone: ""
      }
    };
  },
  watch: {
    addType() {
      if (this.addType == 0) {
        this.reInfo.title = "";
        this.reInfo.content = "";
      }
    },
    addType1() {
      if (this.addType1 == 1 || this.addType1 == 21) {
        this.rePhoneInfo.urgent = "";
        this.rePhoneInfo.title = "";
        this.rePhoneInfo.phone = "";
      }
    }
  },
  created() {
    let that = this;
    that.access_token = localStorage.getItem("accessToken");
    if (that.access_token != null) {
      that.access_token = JSON.parse(that.access_token);
      that.GetSurvivalList();
      that.GetPhoneList();
      //获取个人信息
      that.infrom = JSON.parse(localStorage.getItem("informData"));
    } else {
      that.$message({
        message: "登录已失效，请重新登录！",
        type: "error",
        content: true
      });
      setTimeout(() => {
        localStorage.clear();
        that.$router.replace({
          path: "/"
        });
      }, 300);
    }
  },
  components: {
    Loading
  },
  methods: {
    // 锦囊列表
    GetSurvivalList() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/survival/list",
          method: "post",
          params: {
            access_token: that.access_token,
            rows: that.rows,
            page: that.page
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.ListLeftData = res.data.obj;
            that.loadingType = false;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.$message.error("网络异常！");
          that.loadingType = false;
        });
    },
    // 紧急电话列表
    GetPhoneList() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/urgent/list",
          method: "post",
          params: {
            access_token: that.access_token,
            rows: that.phoneRows,
            page: that.phonePage
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.PhoneListData = res.data.obj;
            that.loadingType = false;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.$message.error("网络异常！");
        });
    },
    //锦囊详情
    GetSurvivalinfo(id) {
      const that = this;
      if(that.infoid !== id) {
        that.loadingType = true;
      }
      that.infoid = id;
      that
        .$http({
          url: that.urlHost + "/man/survival/info",
          method: "post",
          params: {
            access_token: that.access_token,
            id: id
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.Leftinfo = res.data.obj;
            if (that.Leftinfo.content != null) {
              that.Leftinfo.content = that.Leftinfo.content.replace(
                /\n/g,
                "<br>"
              );
            }
            that.loadingType = false;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.$message.error("网络异常！");
        });
    },
    iteminfo(val) {
      if (typeof val == "number") {
        this.GetSurvivalinfo(this.ListLeftData.data[val - 1].id);
      }
    },
    //添加、编辑 完成
    Getissue(flg) {
      const that = this;
      that.loadingType = true;
      var data;
      if (flg == 1) {
        var opt = 1;
      } else {
        var opt = 0;
      }
      if (that.addType == 0) {
        data = {
          access_token: that.access_token,
          title: that.reInfo.title,
          content: that.reInfo.content,
          sync: opt
        };
      } else if (that.addType == 1) {
        data = {
          access_token: that.access_token,
          id: that.Leftinfo.id,
          title: that.reInfo.title,
          content: that.reInfo.content
        };
      }
      $.ajax({
        url: that.urlHost + "/man/survival/issue",
        type: "post",
        dataType: "json",
        data: data,
        timeout: 10000,
        success: function(res) {
          that.loadingType = false;
          if (res.success === "00000000") {
            that.$message.success(res.msg);
            that.loadingType = false;
            that.dialogDiv.add = false;
            that.GetSurvivalList();
            that.activeName = "";
            that.reInfo.title = "";
            that.reInfo.content = "";
          } else if (res.success === "00100003") {
            that.$message({
              message: "登录已失效，请重新登录！",
              type: "error",
              content: true
            });
            setTimeout(() => {
              localStorage.clear();
              that.$router.replace({
                path: "/"
              });
            }, 300);
          } else {
            that.$message({
              message: res.msg,
              type: "error",
              content: true
            });
          }
        },
        error: err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        }
      });
    },
    GetSurvivalDel(id) {
      let that = this;
      that
        .$confirm("是否删除？", "提示")
        .then(() => {
          that
            .$http({
              url: that.urlHost + "/man/survival/del",
              method: "post",
              params: {
                access_token: that.access_token,
                id: id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                that.$message.success(res.data.msg);
                that.GetSurvivalList();
                that.activeName = "";
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
    //编辑
    editInfo(id) {
      const that = this
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/survival/info",
          method: "post",
          params: {
            access_token: that.access_token,
            id: id
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.Leftinfo = res.data.obj;
            if (that.Leftinfo.content != null) {
              that.Leftinfo.content = that.Leftinfo.content.replace(
                /\n/g,
                "<br>"
              );
            }
            this.addType = 1;
            this.dialogDiv.add = true;
            this.reInfo.content = "";
            this.reInfo.title = this.Leftinfo.title;
            if (this.Leftinfo.content != null) {
              this.reInfo.content = this.Leftinfo.content;
            }
            for (let i = 0; i < this.Leftinfo.capsules.length; i++) {
              if (this.Leftinfo.capsules[i].title != null) {
                this.reInfo.content += this.Leftinfo.capsules[i].title + "\n";
              }
              if (this.Leftinfo.capsules[i].content != null) {
                this.reInfo.content += this.Leftinfo.capsules[i].content + "\n";
              }
            }
            this.reInfo.content = this.reInfo.content.replace(/<br>/g, "\n");

          } else {
            that.loadingType = false;
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },

    submit(flg) {
      const that = this;
      if (this.addType1 == 1 || this.addType1 == 12) {
        that.GetUrgentissue(flg);
      } else if (this.addType1 == 21 || this.addType1 == 22) {
        that.GetPhoneissue(flg);
      }
    },
    phoneAdd(data, type, index) {
      if (type == 1) {
        this.rePhoneInfo.uid = data.id;
        this.rePhoneInfo.urgent = data.title;
        this.rePhoneInfo.tit = data.title;
      } else {
        this.rePhoneInfo.uid = data.id;
        this.rePhoneInfo.id = data.details[index].id;
        this.rePhoneInfo.title = data.details[index].title;
        this.rePhoneInfo.phone = data.details[index].phone;
        this.rePhoneInfo.tit =
          data.details[index].title + "" + data.details[index].phone;
      }
    },
    //国家 新建/更新
    GetUrgentissue(flg) {
      const that = this;
      that.loadingType = true;
      var data;
      if (flg == 1) {
        var opt = 1;
      } else {
        var opt = 0;
      }
      if (that.addType1 == 1) {
        data = {
          access_token: that.access_token,
          name: that.rePhoneInfo.urgent,
          sync: opt
        };
      } else {
        data = {
          access_token: that.access_token,
          id: that.rePhoneInfo.uid,
          name: that.rePhoneInfo.urgent
        };
      }
      that
        .$http({
          url: that.urlHost + "/man/urgent/issue",
          method: "post",
          params: data,
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.$message.success(res.data.msg);
            that.dialogDiv.add1 = false;
            that.GetPhoneList();
            that.rePhoneInfo = {
              urgent: "",
              title: "",
              phone: ""
            };
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    //国家 删除
    GetUrgentlDel(id) {
      let that = this;
      that
        .$confirm("是否删除？", "提示")
        .then(() => {
          that
            .$http({
              url: that.urlHost + "/man/urgent/del",
              method: "post",
              params: {
                access_token: that.access_token,
                id: id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                that.$message.success(res.data.msg);
                that.GetPhoneList();
                that.activeName = "";
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
    //紧急电话 新建/更新
    GetPhoneissue(flg) {
      const that = this;
      that.loadingType = true;
      var data;
      if (flg == 1) {
        var opt = 1;
      } else {
        var opt = 0;
      }
      if (that.addType1 == 21) {
        data = {
          access_token: that.access_token,
          urgent: that.rePhoneInfo.uid,
          title: that.rePhoneInfo.title,
          phone: that.rePhoneInfo.phone,
          sync: opt
        };
      } else {
        data = {
          access_token: that.access_token,
          id: that.rePhoneInfo.id,
          urgent: that.rePhoneInfo.uid,
          title: that.rePhoneInfo.title,
          phone: that.rePhoneInfo.phone
        };
      }
      that
        .$http({
          url: that.urlHost + "/man/urgent/uphone/issue",
          method: "post",
          params: data,
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.$message.success(res.data.msg);
            that.dialogDiv.add1 = false;
            that.GetPhoneList();
            that.rePhoneInfo = {
              urgent: "",
              title: "",
              phone: ""
            };
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    //紧急电话 删除
    GetUphonelDel(id) {
      let that = this;
      that
        .$confirm("是否删除？", "提示")
        .then(() => {
          that
            .$http({
              url: that.urlHost + "/man/urgent/uphone/del",
              method: "post",
              params: {
                access_token: that.access_token,
                id: id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                that.$message.success(res.data.msg);
                that.GetPhoneList();
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
    //紧急 同步
    GetSync(id, sync, flg) {
      const that = this;
      if (flg == 0) {
        var url = that.urlHost + "/man/urgent/sync";
      } else if (flg == -1) {
        var url = that.urlHost + "/man/survival/sync";
      } else {
        var url = that.urlHost + "/man/urgent/uphone/sync";
      }
      that
        .$http({
          url: url,
          method: "post",
          params: {
            access_token: that.access_token,
            id: id,
            opt: sync
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            if (flg == -1) {
              for (let i = 0; i < that.ListLeftData.data.length; i++) {
                if (id == that.ListLeftData.data[i].id) {
                  that.ListLeftData.data[i].sync = sync;
                  that.$message.success(res.data.msg);
                  // that.$forceUpdate()
                }
              }
              // that.GetSurvivalList()
            } else {
              // that.GetPhoneList()
              for (let i = 0; i < that.PhoneListData.data.length; i++) {
                if (id == that.PhoneListData.data[i].id) {
                  that.PhoneListData.data[i].sync = sync;
                  that.$message.success(res.data.msg);
                  return;
                } else {
                  // console.log(that.PhoneListData.data[i].details);
                  for (
                    let j = 0;
                    j < that.PhoneListData.data[i].details.length;
                    j++
                  ) {
                    if (id == that.PhoneListData.data[i].details[j].id) {
                      that.PhoneListData.data[i].details[j].sync = sync;
                      that.$message.success(res.data.msg);
                    }
                  }
                }
              }
            }
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>


<style lang="less">
.kits {
  position: relative;
  height: 100%;
  overflow: auto;
  .kits_top {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    color: #999;
    border-bottom: 1px solid #aaa;
  }
  .box {
    // user-select: none;
    margin: 20px;
    height: calc(100% - 81px);
    overflow: auto;
    // box-shadow: 2px -2px 10px 1px #ccc;
    display: flex;
    .box-left {
      background: #fff;
      width: 60%;
      border-radius: 2px;
    }
    .box-right {
      background: #fff;
      margin-left: 20px;
      border-radius: 2px;
      flex: 1;
    }
    .left-title,
    .right-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      height: 48px;
      border-bottom: 2px solid #ddd;
      i {
        width: 25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        border-radius: 50px;
        color: #fff;
        background: #3a9cf7;
        margin-right: 10px;
      }
    }
    .left-content {
      overflow: auto;
      height: calc(100% - 50px);
      .left-content-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div:nth-child(2) {
          margin-right: 20px;
        }
      }
      .content {
        color: #999;
        margin: 10px 0;
        padding-right: 20px;
      }
      .el-collapse-item__header {
        border-bottom: 1px solid #ddd;
      }
    }
    .right-content {
      font-size: 14px;
      overflow: auto;
      height: calc(100% - 50px);
      .title,
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .title {
        background: #f9f9f9;
        padding: 0 15px 0 50px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        color: #999;
      }
      .item {
        padding-right: 15px;
        margin-left: 50px;
        border-bottom: 1px solid #ddd;
      }
      .item:last-child {
        border-bottom: 0;
      }
    }
    .left-content::-webkit-scrollbar,
    .right-content::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
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
          width: 70px;
          margin-top: 7px;
        }
        > div {
          flex: 1;
          display: flex;
          align-items: center;
        }
        .el-input__inner {
          height: 35px;
          line-height: 35px;
          padding: 0 5px;
        }
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
      .submit-active {
        background: #fff;
        color: #3a9cf7;
      }
    }
  }
  .col_in {
    color: #0cbd14 !important;
  }
  .col_out {
    color: #f8b33b !important;
  }
  .add2 {
    padding-top: 20vh;
  }
}
</style>
