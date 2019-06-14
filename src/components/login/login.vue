<template>
  <div class="login">
    <div class="type" v-if="serviceType != 1">测试版</div>
    <Loading v-if="loadingType" :msg="msg"></Loading>
    <div class="login_bg">
      <div>
        <img src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/LOGO1.png" alt>
      </div>
      <div>艾侗游官方网站后台系统</div>
    </div>
    <div class="login_form">
      <div>
        <img src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/phone.png" alt>
      </div>
      <div>
        <img src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/lock.png" alt>
      </div>
      <el-input
        maxlength="11"
        placeholder="请输入手机号"
        v-model="loginFrom.phone"
        @keyup.enter.native="loading"
        clearable
      ></el-input>
      <el-input
        class="mt20"
        type="password"
        minlength="6"
        maxlength="16"
        placeholder="请输入密码"
        @keyup.enter.native="loading"
        v-model="loginFrom.pwd"
      ></el-input>
      <el-button @click="loading" class="mt30" type="primary" style="width:100%;height:50px">登录</el-button>
      <div class="login_from_warn mt20">
        <img src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/statement.png" alt> 请使用备案手机号进行登录，本系统只对内部人员开放
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./../loading/loading";
export default {
  data() {
    return {
      loginFrom: {
        phone: "",
        pwd: ""
      },
      loadingType: false,
      msg: "登陆中..."
    };
  },
  components: {
    Loading
  },
  mounted() {
      
  },
  methods: {
    loading() {
      let _that = this;
      let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (_that.loginFrom.phone == "") {
        this.$message({
          message: "请输入手机号！",
          type: "error",
          center: "true"
        });
      }
      // else if(!phoneReg.test(_that.loginFrom.phone)){
      //     _that.$message({
      //         message: '请输入正确的手机号！',
      //         type: 'error',
      //         center: 'true'
      //     })
      // }
      else if (_that.loginFrom.pwd == "") {
        _that.$message({
          message: "请输入密码！",
          type: "error",
          center: "true"
        });
      } else {
        _that.loadingType = true;
        _that
          .$http({
            url: this.urlHost + "/man/login",
            method: "post",
            params: {
              phone: _that.loginFrom.phone,
              pwd: _that.loginFrom.pwd,
              source: 3
            },
            timeout: 10000
          })
          .then(res => {
            _that.loadingType = false;
            if (res.data.success === "00000000") {
              let objData = res.data.obj;
              window.localStorage.clear();
              window.localStorage.setItem(
                "informData",
                JSON.stringify(objData)
              );
              window.localStorage.setItem(
                "accessToken",
                JSON.stringify(objData.access_token)
              );
              _that
                .$http({
                  url: _that.urlHost + "/man/menu/shows",
                  method: "post",
                  params: { access_token: objData.access_token }
                })
                .then(res => {
                  if (res.data.success === "00000000") {
                    // _that.menuShows = res.data.obj;
                    // window.location.href = _that.urlHosts+'/manweb'+res.data.obj[0].children[0].url;
                    _that.$router.push({
                      path: res.data.obj[0].children[0].url
                    });
                  } else {
                    _that.$base.err(res, _that);
                  }
                })
                .catch(err => {});
            } else {
              _that.$message({
                message: res.data.msg,
                type: "error",
                center: "true"
              });
            }
          })
          .catch(err => {
            _that.loadingType = false;
            _that.$message.error("网络异常！");
            console.log(err);
          });
      }
    }
  }
};
</script>

<style>
.type {
  z-index: 1111;
  position: fixed;
  top: 1px;
  left: calc(50% - 50px);
  width: 100px;
  text-align: center;
  color: #fff;
  text-shadow: -1px 0 red, 0 1px red, 1px 0 red, 0 -1px red;
  font-size: 16pt;
}
.login_bg {
  background: url(https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/bg.png)
    no-repeat;
  background-size: cover;
  margin: 0 auto;
  /* max-width: 1920px; */
  /* height: 540px; */
  text-align: center;
  font-size: 48px;
  color: #fff;
}
.login_bg > div:nth-child(1) {
  padding-top: 10vh;
}
.login_bg > div:nth-child(2) {
  padding: 5vh 0;
}
.login_form {
  max-width: 512px;
  margin: 0 auto;
  /* margin-top: 90px; */
}
.login_from_warn {
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 30px;
}
.login_from_warn img {
  margin-right: 10px;
}
.mt20 {
  margin-top: 20px;
}
.mt30 {
  margin-top: 30px !important;
}
.login_form input {
  padding: 0 0 0 50px;
  height: 50px;
  line-height: 50px;
  font-size: 17px;
  color: #000;
}
.login_form > div:nth-child(1) {
  z-index: 1;
  position: relative;
  display: flex;
  top: 65px;
  left: 20px;
  width: 26px;
  height: 26px;
}
.login_form > div:nth-child(2) {
  z-index: 1;
  position: relative;
  display: flex;
  top: 107px;
  left: 20px;
  width: 26px;
  height: 26px;
}
</style>
