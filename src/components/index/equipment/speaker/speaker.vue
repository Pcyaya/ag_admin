<template>
  <!-- 设备 -->
  <div class="speaker" :style="{'width':rightW}">
    <Loading v-if="loadingType"></Loading>
    <div class="speaker_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：设备管理 >
        <span>
          <el-button type="text">设备</el-button>
        </span>
      </div>
    </div>

    <div class="speaker_box">
      <!-- 查询条件 -->
      <div class="speaker_search">
        <div>
          <div>
            <span>设备编码：</span>
            <el-input v-model="reSosData.num" placeholder="设备编码"></el-input>
          </div>
          <div>
            <span>sim序列号：</span>
            <el-input v-model="reSosData.card" placeholder="sim序列号"></el-input>
          </div>

          <div>
            <span>用户：</span>
            <el-autocomplete
              v-model="reSosData.name"
              :fetch-suggestions="querySearch"
              placeholder="请输入用户"
              @select="handleSelect"
            ></el-autocomplete>
          </div>

          <div>
            <span>管理者：</span>
            <el-autocomplete
              v-model="reSosData.manager"
              :fetch-suggestions="querySearch"
              placeholder="请输入用户"
              @select="handleSelecter"
            ></el-autocomplete>
          </div>

          <div>
            <span>是否绑定：</span>
            <el-select v-model="reSosData.bind_flg" placeholder="请选择">
              <el-option
                v-for="item in bindFlgs"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>是否被管理：</span>
            <el-select v-model="reSosData.manage" placeholder="请选择">
              <el-option
                v-for="item in manageFlgs"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>艾侗游网名称：</span>
            <el-input v-model="reSosData.wifi" placeholder="艾侗游网名称"></el-input>
          </div>
          <div>
            <el-button @click="searchBtn" type="primary" size="mini">
              <i class="el-icon-search"></i> 查询
            </el-button>
          </div>
          <div>
            <el-button @click="searchClear" size="mini">
              <i class="el-icon-refresh"></i> 清空
            </el-button>
          </div>
        </div>
      </div>

      <!-- 列表 -->
      <div class="speaker_table">
        <el-table
          :data="sosList.data"
          :height="tableHeihgt"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="49" align="center" label="编号"></el-table-column>
          <el-table-column prop="ris_num" align="center" width="180" label="设备编码">
            <template slot-scope="scope">
              <el-button
                @click="ercode(sosList.data[scope.$index].ris_num)"
                type="text"
              >{{sosList.data[scope.$index].ris_num}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="ris_card" align="center" width="130" label="sim序列号"></el-table-column>
          <el-table-column prop="name" align="center" label="绑定用户"></el-table-column>
          <el-table-column prop="phone" width="100" align="center" label="绑定用户ID"></el-table-column>
          <el-table-column prop="bind_flg" align="center" label="是否绑定"></el-table-column>
          <el-table-column prop="bind_db" align="center" label="绑定环境"></el-table-column>
          <el-table-column prop="bind_date" width="140" align="center" label="绑定时间"></el-table-column>
          <el-table-column prop="spk_manager_name" align="center" label="管理者"></el-table-column>
          <el-table-column prop="urgent_name" width="100" align="center" label="紧急联系人"></el-table-column>
          <el-table-column prop="urgent_toalias" width="100" align="center" label="关系（称呼）"></el-table-column>
          <el-table-column prop="urgent_phone" width="110" align="center" label="紧急联系人电话"></el-table-column>
          <el-table-column prop="ris_wifi_name" width="100" align="center" label="艾侗网名称"></el-table-column>
          <el-table-column prop="ris_wifi_pwd" width="100" align="center" label="艾侗网密码"></el-table-column>
          <el-table-column fixed="right" align="center" width="170" label="操作">
            <template slot-scope="scope">
              <el-button
                @click="GetWalking(sosList.data,scope.$index),diaWalking = true"
                type="primary"
                size="mini"
              >路径</el-button>
              <el-button
                v-if="sosList.data[scope.$index].bind_flg == '是'"
                @click="Getunbind(sosList.data,scope.$index)"
                type="danger"
                size="mini"
              >解绑</el-button>
              <span v-else class="unbin">未绑定</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 二维码生成     -->
      <el-dialog class="dialogDIv" width="300px" :visible.sync="dialog_ercode" append-to-body>
        <div class="ercodeBox">
          <div class="ercodeTitle">
            <div>设备编码：{{ercodeobj.num}}</div>
            <div @click="dialog_ercode = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="qr_icon">
            <div>
              <canvas id="canvas"></canvas>
            </div>
          </div>
        </div>
      </el-dialog>
      <!-- 路径 -->
      <el-dialog
        class="map-walking"
        width="40%"
        align="center"
        :visible.sync="diaWalking"
        append-to-body
      >
        <div class="dialoBox">
          <div class="dialoTitle">
            <div>设备位置</div>
            <div @click="diaWalking = false">X</div>
          </div>
          <div class="search-date">
            <div>
              <span>起始时间：</span>
              <el-date-picker
                v-model="reData.start"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
            <div>
              <span>结束时间：</span>
              <el-date-picker
                v-model="reData.end"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
            <div>
              <el-button
                @click="GetWalking(reData.num),GetWalking(reData.num)"
                type="primary"
                size="mini"
              >查询</el-button>
            </div>
          </div>
          <div v-show="walkingList == ''">暂无数据</div>
          <div v-show="walkingList != ''" class="dialoSosBox" id="allWalking">
            
          </div>
        </div>
      </el-dialog>

      <!-- 分页 -->
      <div class="speaker_pages">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="20"
          :page-sizes="[5,10,20,30,50,100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="sosList.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./../../../loading/loading";
import QRcode from "qrcode";
export default {
  data() {
    return {
      access_token: "",
      infrom: "",
      reSosData: {
        num: "", //编码
        user: "",
        name: "", //昵称
        bind_flg: -1, //是否绑定
        card: "", //序列号
        wifi: "",
        manage: -1, //是否被管理
        manager: '', //管理者名称
      },
      reData: {
        num: '',
        start:this.$base.timeToTamp(new Date(new Date(new Date().toLocaleDateString()).getTime())),
        end: this.$base.timeToTamp(new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)),
      },
      walkingList: '',
      dialog_ercode: false,
      diaWalking: false,
      ercodeobj: {
        num: ""
      },
      sosOccupation: {}, //职业类别
      sosList: {},
      sexFlags: [
        { name: "全部", id: -1 },
        { name: "男", id: 0 },
        { name: "女", id: 1 }
      ],
      bindFlgs: [
        { name: "全部", id: -1 },
        { name: "是", id: 1 },
        { name: "否", id: 0 }
      ],
      manageFlgs: [
        { name: "全部", id: -1 },
        { name: "是", id: 1 },
        { name: "否", id: 0 }
        ],
      schedule: {}, //进度类别
      currentPage: 1,
      pagesize: 20,
      sosInfo: {},
      nextT: 0,
      handle_name: "", //处理人
      restaurants: [],
      rightW: "",
      tableHeihgt: "auto",
      loadingType: true
    };
  },
  created() {
    let _that = this;
    // console.log(this.reData)
    this.access_token = localStorage.getItem("accessToken");
    if (this.access_token != null) {
      this.access_token = JSON.parse(this.access_token);
      // this.schedulesList()    //进度列表
      this.getSosList();
      //获取个人信息
      this.infrom = JSON.parse(localStorage.getItem("informData"));
      // console.log(this.infrom);
    } else {
      _that.$message({
        message: "登录已失效，请重新登录！",
        type: "error",
        content: true
      });
      localStorage.clear();
      _that.$router.replace({
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
        setTimeout(() => {
          this.tableHeihgt =
            window.innerHeight - $(".speaker_search").height() - 175;
        }, 0);
      } else if (window.innerWidth > 1920) {
        this.rightW = 1920 - wid + "px";
        setTimeout(() => {
          this.tableHeihgt =
            window.innerHeight - $(".speaker_search").height() - 155;
        }, 0);
      } else {
        this.rightW = window.innerWidth - wid + "px";
        setTimeout(() => {
          this.tableHeihgt =
            window.innerHeight - $(".speaker_search").height() - 155;
        }, 0);
      }
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
    },
    "reSosData.name"() {
      if ($.trim(this.reSosData.name) != "") {
        this.getAuto(this.reSosData.name);
      } else {
        this.restaurants = [];
        this.reSosData.user = "";
      }
    },
    "reSosData.manager" () {
      if ($.trim(this.reSosData.manager) != "") {
        this.getAuto(this.reSosData.manager);
      } else {
        this.restaurants = [];
        this.reSosData.user = "";
      }
    }
  },
  components: {
    Loading
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
        that.searchBtn();
      }
    },
    //生成二维码
    qrImg(data) {
      let canvas = document.getElementById("canvas");
      QRcode.toCanvas(canvas, data, error => {});
    },
    ercode(num) {
      this.dialog_ercode = true;
      this.ercodeobj.num = num;
      let qr = {
        tag: 3,
        num: num
      };
      let url = this.urlHosts + "/download?qr=" + JSON.stringify(qr);
      setTimeout(() => {
        this.qrImg(url);
      }, 0);
    },
    querySearch(queryString, cb) {
      cb(this.restaurants);
    },
    handleSelect(item) {
      this.reSosData.user = item.id;
    },
    handleSelecter(item) {
      this.reSosData.adminer = item.id;
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      }
      return "";
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getSosList();
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this.getSosList();
    },
    //清空条件
    searchClear() {
      this.reSosData = {
        num: "",
        name: "",
        bind_flg: -1,
        card: "",
        wifi: "",
        manage: -1, 
        manager: '', 
      };
    },
    //条件查询列表
    searchBtn() {
      this.currentPage = 1;
      this.getSosList();
    },
    //处理进度列表
    schedulesList() {
      const that = this;
      that
        .$http({
          url: that.urlHost + "/man/sos/schedules",
          method: "post",
          params: {
            access_token: that.access_token
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            // console.log(res.data)
            that.schedule = res.data.obj;
            that.schedule.unshift({
              id: "",
              name: "全部",
              val: ""
            });
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //查询用户
    getAuto(search) {
      const that = this;
      that
        .$http({
          url: that.urlHost + "/man/visitor/auto",
          method: "post",
          params: {
            access_token: that.access_token,
            search: search,
            rows: 20
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            if (res.data.obj.data == null) {
              this.restaurants = [];
            } else {
              this.restaurants = [];
              for (let i = 0; i < res.data.obj.data.length; i++) {
                this.restaurants.push({
                  value: res.data.obj.data[i].name,
                  id: res.data.obj.data[i].id
                });
              }
              // this.restaurants = res.data.obj.data
            }
            // console.log(this.restaurants);
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //设备列表
    getSosList() {
      const that = this;
      if (
        $.trim(that.reSosData.name) != "" &&
        $.trim(that.reSosData.user) == ""
      ) {
        that.$message.error("请选择正确的用户进行查询！");
      } else if($.trim(that.reSosData.manager) != "" &&
        $.trim(that.reSosData.adminer) == "") {
        that.$message.error("请选择正确的管理者进行查询！");
      } else {
        this.loadingType = true;
        this.$forceUpdate();
        this.$http({
          url: this.urlHost + "/man/speaker/list",
          method: "post",
          params: {
            access_token: this.access_token,
            test: 0,
            online: 0,
            active: 0,
            bind: this.reSosData.bind_flg,
            card: this.reSosData.card,
            wifi: this.reSosData.wifi,
            bind_env: 0,
            visitor: this.reSosData.user,
            speak_num: this.reSosData.num,
            manage: this.reSosData.manage, 
            manager: this.reSosData.adminer, 
            page: this.currentPage,
            rows: this.pagesize
          },
          timeout: 10000
        })
          .then(res => {
            this.loadingType = false;
            if (res.data.success === "00000000") {
              this.sosList = res.data.obj;
              for (let i in this.sosList.data) {
                this.sosList.data[i].sex =
                  this.sosList.data[i].sex === 1 ? "女" : "男";
                this.sosList.data[i].bind_flg =
                  this.sosList.data[i].bind_flg === 1 ? "是" : "否";
                this.sosList.data[i].guide_no =
                  this.sosList.data[i].guide_no === "" ||
                  this.sosList.data[i].guide_no === null
                    ? "---"
                    : this.sosList.data[i].guide_no;
                this.sosList.data[i].company =
                  this.sosList.data[i].company === "" ||
                  this.sosList.data[i].company === null
                    ? "---"
                    : this.sosList.data[i].company;
                this.sosList.data[i].rss_phone =
                  this.sosList.data[i].rss_phone === "" ||
                  this.sosList.data[i].rss_phone === null
                    ? "---"
                    : this.sosList.data[i].rss_phone;
                this.sosList.data[i].age = this.$base.tampToTime(
                  this.sosList.data[i].age,
                  2
                );
                this.sosList.data[i].bind_date = this.$base.tampToTime(
                  this.sosList.data[i].bind_date
                );
                this.tableHeihgt =
                  window.innerHeight - $(".speaker_search").height() - 155;
              }
              // console.log(this.sosList);
            } else {
              that.$base.err(res, that);
            }
          })
          .catch(err => {
            this.loadingType = false;
            this.$message.error("网络异常！");
          });
      }
    },
    //解绑
    Getunbind(data, index) {
      let that = this;
      let id = data[index].ris_id;
      that
        .$confirm("确认是否解绑？", "提示")
        .then(() => {
          that
            .$http({
              url: that.urlHost + "/man/speaker/unbind",
              method: "post",
              params: {
                access_token: that.access_token,
                id: id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                that.$message({
                  message: res.data.msg,
                  type: "success",
                  center: true
                });
                that.getSosList();
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
    GetWalking(data, index) {
      const that = this;
      if(typeof data != 'string') {
        that.reData.num = data[index].ris_num;
      }
      that
        .$http({
          url: that.urlHost + "/man/speaker/path",
          method: "post",
          params: {
            access_token: that.access_token,
            spk_num: that.reData.num,
            startDate: that.reData.start,
            endDate: that.reData.end
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            let obj = res.data.obj;
            if(obj.length>0) {
              that.walkingList = obj;
            }else {
              that.walkingList = '';
            }
            that.GetMap(obj);
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    GetMap(obj) {
      const that = this;
      var chartData = [];
      var map = new BMap.Map("allWalking");
      var gc = new BMap.Geocoder();
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      map.centerAndZoom(new BMap.Point(obj[0].rss_lon, obj[0].rss_lat),16);
      var startpoint = new BMap.Point(obj[0].rss_lon, obj[0].rss_lat);
      var endpoint = new BMap.Point(
        obj[obj.length - 1].rss_lon,
        obj[obj.length - 1].rss_lat
      );
      for (let i in obj) {
        chartData.push(new BMap.Point(obj[i].rss_lon, obj[i].rss_lat));
      }
      var polyline = new BMap.Polyline(chartData, {
        strokeColor: "green",
        strokeWeight: 5,
        strokeOpacity: 0.6
      });
      map.addOverlay(polyline);
      var firstPoint = new BMap.Point(obj[0].rss_lon, obj[0].rss_lat);
      var endPoint = new BMap.Point(obj[obj.length-1].rss_lon, obj[obj.length-1].rss_lat);
      //文字提示
      for(let j=0;j<chartData.length;j++) {
        var m = new BMap.Marker(chartData[j]);
        map.addOverlay(m);
        var lab = new BMap.Label(j+1, { position: chartData[j],offset: new BMap.Size(-6, -25) });
        lab.setStyle({
          color: "#fff",
          fontSize: "14px",
          backgroundColor: "0.05",
          border: "0",
          fontWeight: "bold"
        })
        map.addOverlay(lab);
        m.addEventListener("click", function ()
            {
              const that = this;
              let thatPoint = that.LA
              gc.getLocation(thatPoint, function(rs) {
                  var addComp = rs.addressComponents;
                  var mapAddress = addComp.province+addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                  var infoWindow = new BMap.InfoWindow((j+1)+"."+mapAddress, { enableMessage: false, width: 30, height: 20 });
                  that.openInfoWindow(infoWindow);
              })
            });
      }
    },
    getLocal() {
      var gc = new BMap.Geocoder();
      gc.getLocation(point, function(rs) {
          var addComp = rs.addressComponents;
          var mapAddress = addComp.province+addComp.city + addComp.district + addComp.street + addComp.streetNumber;
          var infoWindow = new BMap.InfoWindow(str);
          marker.addEventListener("click", function () {
              this.openInfoWindow(infoWindow);
          });
      })
    }
  }
};
</script>

<style lang="less">
.speaker {
  position: relative;
  height: 100%;
  overflow: auto;
  /* overflow: hidden; */
}
.speaker_top {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  color: #999;
  border-bottom: 1px solid #aaa;
}
.speaker_top span {
  font-size: 16px;
}
.speaker_box {
  position: relative;
  padding-left: 20px;
  height: calc(100% - 45px);
  overflow-y: hidden;
  display: flex !important;
  flex-direction: column;
}
.speaker_box .speaker_search {
  padding-top: 15px;
  display: flex;
}
.speaker_box .speaker_search > div {
  /* flex: 1; */
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
}
.speaker_box .speaker_search > div > div {
  margin-right: 20px;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
}
.speaker_box .speaker_search > div > div > span {
  white-space: nowrap;
}
.speaker_box .speaker_search > div > div .el-input__suffix-inner i,
.speaker_box .speaker_search > div > div .el-input__prefix i {
  height: 30px;
  line-height: 30px;
}
.speaker_box .speaker_search > div:nth-child(1) input {
  height: 30px;
  max-width: 150px;
}
.speaker_box .speaker_search > div:nth-child(1) .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  max-width: 150px;
  height: 30px;
  line-height: 30px;
}
.speaker_box .speaker_box .searchBtn {
  padding-bottom: 15px;
}
.speaker_box .speaker_table {
  position: relative;
  /* width: calc(100% - 5px); */
  width: 100%;
  overflow: auto;
  flex: 1;
}
.unbin {
  padding: 0 10px;
  margin-left: 10px;
}
.speaker_table .el-table--mini td,
.speaker_table .el-table--mini th {
  padding: 5px 0;
}
.speaker_table .el-table {
  border: 1px solid #ccc;
}
.speaker_box .speaker_table .el-table th {
  background: #e2eff8 !important;
  color: #000 !important;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc !important;
}
.speaker_box .speaker_table .el-table th:first-child {
  border-left: 0;
}

.speaker_box .speaker_table .el-table td:first-child {
  border-left: 0 !important;
}
/* .speaker_box .speaker_table .el-table__body-wrapper{
        border-top: 1px solid #3A9CF7;
        overflow-x: hidden;
    } */
.speaker_box .speaker_table .el-table td {
  border: 1px solid #ccc !important;
  border-right: 0 !important;
  border-top: 0 !important;
}
.speaker_box .speaker_table .el-table .warning-row {
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
.speaker_pages {
  z-index: 1;
  position: relative;
  padding: 5px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  margin: -1px 0 0 0.5px;
}
.speaker_bottom {
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
.speaker_table .el-dialog__body {
  padding: 0 !important;
}
.speaker_table .el-dialog__header {
  display: none;
}
.speaker_table .el-dialog {
  width: 0 !important;
}
.speaker_table .el-dialog,
.dialogDIv {
  display: flex;
  align-items: center;
}
.speaker_table .el-dialog,
.dialogDIv .el-dialog {
  background: rgba(0, 0, 0, 0) !important;
}
.speaker_table .el-dialog__body,
.dialogDIv .el-dialog__body {
  padding: 0 !important;
}
.speaker_table .el-dialog__header,
.dialogDIv .el-dialog__header {
  display: none;
}
.ercodeBox {
  background: #fff;
  width: 300px !important;
  height: 340px;
}
#canvas {
  width: 300px !important;
  height: 300px !important;
}
.ercodeTitle {
  display: flex;
  justify-content: space-between;
  background: #3a9cf7;
  color: #fff;
  padding: 10px 20px;
}
.ercodeTitle > div:nth-child(2):hover {
  color: #dedede;
  cursor: pointer;
}
.col_active {
  color: #3a9cf7;
}
.map-walking {
  .el-dialog__header {
    display: none;
  }
  .el-dialog {
    background: rgba(0, 0, 0, 0) !important;
    height: 100%;
  }
  .el-dialog__body {
    padding: 0 !important;
  }
  .dialoBox {
    font-size: 16px;
    background: #fff;
    width: 800px;
  }
  .dialoSosBox {
    height: 596px;
    width: 796px;
    background: #fff!important;
  }
  .dialoTitle {
    display: flex;
    justify-content: space-between;
    background: #3a9cf7;
    color: #fff;
    padding: 10px 20px;
    > div:nth-child(2) {
      &:hover {
        color: #ddd;
        cursor: pointer;
      }
    }
  }
  .search-date {
    display:flex;
    justify-content:center;
    align-items:center;
    padding: 20px;
    >div:nth-child(2) {
      margin: 0 15px;
    }
  }
}
</style>
