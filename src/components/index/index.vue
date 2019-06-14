<template>
  <div class="index">
    <div class="type" v-if="serviceType != 1">测试版</div>
    <div class="index_top">
      <div :class="{'leftWidthT':leftWidth,'leftWidthF':!leftWidth}">
        <img
          :class="{'logoactive':leftWidth,'logoanone':!leftWidth}"
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/logo2.png"
          alt
        >
      </div>
      <div class="index_top_right">
        <div :class="{'leftIcon1':!leftWidth}">
          <img
            width="70%"
            @click="topleftBtn"
            src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/icon_hide.png"
            alt
          >
        </div>
        <div class="index_top_setting">
          <div>
            <!-- <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <img
                  src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/icon_message.png"
                  alt
                >
              </span>
              <el-dropdown-menu slot="dropdown">
                <div class="down-msg">
                  <div class="down-msg-top">
                    <div>消息</div>
                    <div v-if="msgData.length" @click="msgData=''">清空</div>
                  </div>
                  <div class="down-msg-content" v-for="item in msgData" :key="item.id">
                    <div>
                      <div class="redY"></div>收到一份简历
                    </div>
                  </div>
                  <div class="nullmsg" v-if="msgData == ''">暂无消息</div>
                  <div class="down-msg-foot">查看所有消息>></div>
                </div>
              </el-dropdown-menu>
            </el-dropdown> -->
          </div>
          <div>
            <el-dropdown trigger="click">
              <span v-if="infroms!=null" class="el-dropdown-link">
                {{infroms.access_name}}
                <img
                  src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/head_portrait.png"
                  alt
                >
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="dialogTableVisible=true" class="clearfix">
                  <span>修改密码</span>
                  <el-badge class="mark"/>
                </el-dropdown-item>
                <!-- <el-dropdown-item class="clearfix">
                  <span>个人信息</span>
                  <el-badge class="mark"/>
                </el-dropdown-item>
                <el-dropdown-item @click.native="locaClear" class="clearfix" style="margin-bottom:10px">
                  <span>清除缓存</span>
                  <el-badge class="mark"/>
                </el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div style="background:#333;width:1px;height:30px;box-shadow:-1px 0px 1px #fff"></div>
          <div @click="signOut">
            <img src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/sign_out.png" alt>退出
          </div>
        </div>
      </div>
    </div>
    <div class="index_box">
      <div class="index_left" :class="{'leftWidthT':leftWidth,'leftWidthF':!leftWidth}">
        <div v-for="(item, index) in menuShows" :key="index">
          <!-- 主菜单 -->
          <div
            v-if="(item.leaf_flg === 0 && item.url != null) || (item.leaf_flg === 0 && item.url != '')"
            :class="{'router-link-active':item.tags == tag}"
            class="SOST"
            @click="taggleClick(index)"
          >
            <div>
              <img v-if="item.tags == tag" width="20px" :src="OSSImg+'sel_'+item.icon" alt>
              <img v-else width="20px" :src="OSSImg+item.icon" alt>
              <span v-if="leftWidth" class="f-pg">
                <span>{{item.name}}</span>
                <i
                  :class="{'leftIcon':inter === index,'leftIconN':inter === -1}"
                  class="el-icon-arrow-down"
                ></i>
              </span>
            </div>
          </div>
          <!-- 二级菜单 -->
          <!-- v-if="item.leaf_flg === 0 && childItem.url != null && childItem.url != ''"  -->
          <div
            v-for="(childItem,len) in menuShows[index].children"
            :key="len"
            @click="tagClick(childItem.tags)"
            :class="{'SOS-show': inter === index,'SOS-none': inter != index,'sosChild':true}"
          >
            <router-link :to="childItem.url">
              <div :title="childItem.name">
                <span class="fontW" :class="{'pf30':leftWidth}" v-if="leftWidth">—&nbsp;</span>
                <span class="sos-show-txt">{{childItem.name}}</span>
                <span v-if="leftWidth"></span>
              </div>
            </router-link>
          </div>

          <!-- 主菜单 -->
          <div v-if="item.leaf_flg === 1 && item.url != null">
            <router-link @click.native="tagClick(item.tags)" :to="item.url">
              <div>
                <img width="20px" :src="OSSImg+item.icon" alt>
                <span v-if="leftWidth">{{item.name}}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="index_content">
        <router-view :rightT="leftWidth"/>
      </div>
    </div>
    <!-- 修改密码 -->
    <div>
      <el-dialog width="50%" :visible.sync="dialogTableVisible">
        <div class="infrom-pwd">
          <div>
            <div>原密码：</div>
            <div class="newsEdit_box_content_title">
              <el-input v-model="infrom.old_pwd" placeholder="请输入原密码"></el-input>
            </div>
          </div>
          <div>
            <div>新密码：</div>
            <div class="newsEdit_box_content_title">
              <el-input v-model="infrom.new_pwd" placeholder="请输入新密码"></el-input>
            </div>
          </div>
          <div>
            <div>确认密码：</div>
            <div class="newsEdit_box_content_title">
              <el-input v-model="infrom.repeat_pwd" placeholder="请再次输入新密码"></el-input>
            </div>
          </div>
          <div class="infromBtn">
            <el-button @click="pwdEdit" type="primary">确认</el-button>
            <el-button @click="dialogTableVisible=false">取消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      access_token: "",
      infroms: {},
      msgData: [1, 2, 3],
      routeImg: {
        sos: this.OSSImg + "equipment_unselect.png",
        add: this.OSSImg + "%2B_unselect.png",
        news: this.OSSImg + "news-unselect.png",
        hiring: this.OSSImg + "search_people-unselect.png"
      },
      leftWidth: true,
      dialogTableVisible: false,
      infrom: {
        old_pwd: "",
        new_pwd: "",
        repeat_pwd: ""
      },
      menuShows: [],
      inter: 0,
      tag: ""
    };
  },
  created() {
    this.access_token = JSON.parse(localStorage.getItem("accessToken"));
    //获取个人信息
    this.infroms = JSON.parse(localStorage.getItem("informData"));
    // this.inter = JSON.parse(localStorage.getItem('inter'))
    this.shows();
    localStorage.setItem("leftW", "true");
  },
  watch: {
    $route(to, from) {}
  },
  provide() {
    return {
      refresh: this.shows
    };
  },
  methods: {
    //退出
    signOut() {
      this.$confirm("确认退出？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          localStorage.clear();
          location.href = "/manweb";
        })
        .catch(() => {});
    },
    //清除缓存
    locaClear() {
      this.$confirm("清除缓存将会从新登陆，是否确认此操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
      .then(() => {
        localStorage.clear();
        this.$router.replace({
          path: "/"
        });
      })
      .catch(() => {});
    },
    //菜单列表
    shows() {
      const _that = this;
      _that
        .$http({
          url: _that.urlHost + "/man/menu/shows",
          method: "post",
          params: { access_token: _that.access_token }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            _that.menuShows = res.data.obj;
            for (let i = 0; i < _that.menuShows.length; i++) {
              if (_that.menuShows[i].children != null) {
                _that.menuShows[i].tags = "tag" + i;
                for (let j = 0; j < _that.menuShows[i].children.length; j++) {
                  _that.menuShows[i].children[j].tags = "tag" + i;
                  _that.tag = "tag" + i;
                }
              }
            }

            for (let i = 0; i < _that.menuShows.length; i++) {
              for (let j = 0; j < _that.menuShows[i].children.length; j++) {
                if (_that.$route.path === _that.menuShows[i].children[j].url) {
                  _that.tag = _that.menuShows[i].children[j].tags;
                  if (localStorage.getItem("inter") != -1) {
                    _that.inter = Number(
                      _that.tag.substring(
                        _that.tag.length - 1,
                        _that.tag.length
                      )
                    );
                  }
                }
              }
            }
            if (_that.$route.path === "/index") {
              _that.$router.push({ path: _that.menuShows[0].children[0].url });
              _that.tag = "tag0";
            }else {
              _that.tag = "";
              if(JSON.stringify(_that.$route.params) != '{}'){
                _that.inter = -1;
              }
            }
          } else {
            _that.$base.err(res, _that);
          }
        })
        .catch(err => {});
    },
    //修改密码
    pwdEdit() {
      let _that = this;
      _that
        .$http({
          url: _that.urlHost + "/man/user/pwd",
          method: "post",
          params: {
            access_token: _that.access_token,
            old_pwd: _that.infrom.old_pwd,
            new_pwd: _that.infrom.new_pwd,
            repeat_pwd: _that.infrom.repeat_pwd
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            _that.$message({
              message: "密码修改成功！",
              type: "success",
              content: true
            });
            _that.dialogTableVisible = false;
            _that.infrom = {};
          } else {
            _that.$base.err(res, _that);
          }
        })
        .catch(err => {});
    },
    topleftBtn() {
      if (this.leftWidth) {
        this.leftWidth = false;
      } else {
        this.leftWidth = true;
      }
      // console.log(this.leftWidth)
      localStorage.setItem("leftW", this.leftWidth);
    },
    taggleClick(index) {
      if (this.inter === index) {
        this.inter = -1;
      } else {
        this.inter = index;
      }
      localStorage.setItem("inter", JSON.stringify(this.inter));
    },
    tagClick(tag) {
      this.tag = tag;
      // localStorage.setItem('tag',tag)
    }
  }
};
</script>

<style>
.type {
  position: fixed;
  z-index: 11111;
  top: 1px;
  left: calc(50% - 50px);
  width: 100px;
  text-align: center;
  color: #fff;
  text-shadow: -1px 0 red, 0 1px red, 1px 0 red, 0 -1px red;
  font-size: 16pt;
}
.index {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.index_top {
  position: relative;
  z-index: 1111;
  margin: 0 auto;
  max-width: 1920px;
  min-width: 1200px;
  width: 100%;
  height: 50px;
  overflow: auto;
  display: flex;
  justify-content: space-around;
  background: #3a9cf7;
}
.index_top > div:nth-child(1) {
  /* height: 100%; */
  text-align: center;
  border-right: 1px solid #f3f6ff;
  flex: none;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}
.index_top > div:nth-child(1) img {
  margin-left: 7px;
}
.leftWidthT {
  width: 180px;
  transition: all linear 0.2s;
}
.leftWidthF {
  width: 60px;
  transition: all linear 0.2s;
}
.index_top_right {
  flex: 1;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.index_top_right > div:nth-child(1) {
  cursor: pointer;
}
.index_top_setting {
  display: flex;
  color: #fff;
}
.index_top_setting > div {
  cursor: pointer;
}
.index_top_setting > div:nth-child(2) .el-dropdown-link {
  display: flex;
  align-items: center;
  color: #eee;
}
.index_top_setting > div:nth-child(2) .el-dropdown-link img {
  margin-left: 10px;
}
.index_top_setting > div:nth-child(3) {
  cursor: default;
}
.index_top_setting div {
  margin: 0 0 0 30px;
  display: flex;
  align-items: center;
}
.index_top_setting > div:nth-child(4) img {
  margin-right: 15px;
}

.index_box {
  position: relative;
  height: calc(100% - 50px);
  width: 100%;
  display: flex;
  margin: 0 auto;
  max-width: 1920px;
  min-width: 1200px;
}
.index_left {
  flex: none;
  user-select: none;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #ccc;
  /* min-height: 550px; */
  overflow-y: auto;
  overflow-x: hidden;
}
.index_left::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
.index_left > div .SOST i {
  font-weight: bold;
  /* margin-left:10px; */
  margin-top: 3px;
}
.index_left > div .SOST {
  height: 42px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  /* padding-left: 20%; */
  overflow: hidden;
  cursor: pointer;
  border-left: 4px solid #fff;
}
.index_left > div .SOST > div {
  /* margin-left: 18px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.index_left > div .SOST img {
  margin-right: 10px;
  display: flex;
  align-items: center;
}
.index_left > div > div > a {
  text-decoration: none;
  display: flex;
  /* justify-content: center; */
  padding-left: 10%;
  overflow: hidden;
  color: #000;
  border-left: 4px solid #fff;
}
.index_left > div > div > a > div {
  height: 37px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.index_left > div > div > a img {
  margin-right: 10px;
}
.index_left > div .sosChild {
  overflow: hidden;
}
.index_left > div .sosChild a > div {
  overflow: hidden;
  /* padding-left: 30px; */
}
.pf30 {
  padding-left: 30px;
}
/* .index_left>a:nth-child(1){
        background: #E2EFF8;
        color: #3A9CF7;
    } */
.router-link-active {
  background-color: #e2eff8;
  color: #3a9cf7 !important;
  border-left: 4px solid #3a9cf7 !important;
}
.index_content {
  position: relative;
  background: #f3f3f3;
  /* border-left: 1px solid #fff; */
  flex: 1;
}
.el-dropdown-menu__item {
  padding: 0 30px;
}
.el-dropdown-menu__item:hover {
  color: #000 !important;
  background: #f3f3f3 !important;
}
.down-msg {
  width: 240px;
  /* text-align: center; */
  font-size: 14px;
}
.down-msg-top {
  display: flex;
  justify-content: space-between;
  padding: 0 10% 10px 10%;
  border-bottom: 1px solid #ccc;
}
.down-msg-top > div:nth-child(2) {
  color: #999;
  cursor: pointer;
}
.down-msg-content > div {
  padding: 10px 0 10px 10%;
  border-bottom: 1px dashed #ccc;
  display: flex;
  align-items: center;
}
.down-msg-foot {
  margin-top: 20px;
  text-align: center;
  padding: 10px 0 5px 0;
  color: #666;
  background: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.redY {
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
  margin-right: 5px;
}
.nullmsg {
  text-align: center;
  height: 120px;
  line-height: 120px;
  color: #999;
}
.el-dropdown-menu {
  padding: 10px 0 0 0 !important;
}
.leftIcon1 {
  transform: rotate(90deg);
  transition: all linear 0.1s;
}
.leftIcon {
  transform: rotate(180deg);
  transition: all linear 0.1s;
}
.leftIconN {
  transform: rotate(0);
  transition: all linear 0.1s;
}
.infrom-pwd {
  padding: 20px;
}
.infrom-pwd > div {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.infrom-pwd > div > div:nth-child(1) {
  width: 100px;
  text-align: right;
  margin-right: 20px;
}
.infrom-pwd > div > div:nth-child(2) {
  flex: 1;
}
.infromBtn {
  margin-top: 50px !important;
  display: flex;
  justify-content: center;
}
.sb-rel {
  position: relative;
  width: 0;
  height: 0;
}
.sb-rel img {
  position: absolute;
  left: 40px;
  top: -5px;
}
.SOS-show {
  height: 37px;  
  line-height: 15px;
  transition: all linear 0.2s;
}
.SOS-show .sos-show-txt{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.SOS-show:hover{
  background: #eee;
  transition: all linear 0.1s;
}
.SOS-none {
  height: 0;
  transition: all linear 0.2s;
}
.fontW {
  font-weight: bolder;
}
.f-pg {
  display: flex;
  justify-content: space-between;
}
.f-pg > span {
  width: 100px;
}
.logoactive {
  width: 149px;
  transition: all linear 0.3s;
}
.logoanone {
  width: 0;
  transition: all linear 0.1s;
}
</style>


