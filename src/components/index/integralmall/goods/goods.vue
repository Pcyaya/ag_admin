<template>
  <div class="goods" :style="{'width':rightW}">
    <Loading v-if="loadingType"></Loading>
    <div class="goods_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：积分商城管理 >
        <span>
          <el-button type="text">商品管理</el-button>
        </span>
      </div>
    </div>
    <input
      v-show="0"
      type="file"
      class="icons"
      @change="IconChange"
      ref="icon"
      accept="image/jpg, image/jpeg, image/png, image/bmp"
    >
    <div class="goods_box">
      <!-- 查询条件 -->
      <div class="goods_search">
        <div>
          <div>
            <span>商品类别：</span>
            <el-select v-model="reApp.goodsType">
              <el-option
                v-for="item in tags.goodsTypes"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>商品名称：</span>
            <el-input v-model="reApp.name"></el-input>
          </div>
          <div>
            <span>是否上架：</span>
            <el-select v-model="reApp.online">
              <el-option
                v-for="item in tags.onlineFlg"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>上架时间：</span>
            <el-date-picker
              v-model="reApp.up_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div>
            <span>下架时间：</span>
            <el-date-picker
              v-model="reApp.down_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div>
            <el-button @click="handleCurrentChange(1)" type="primary" size="mini">
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
          <el-button @click="addList(0)" size="mini">
            <i class="el-icon-plus"></i> 新增商品
          </el-button>
        </div>
      </div>

      <!-- 列表 -->
      <div class="goods_table">
        <el-table
          :data="ListData.data"
          :height="tableHeight"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="49" align="center" label="编号"></el-table-column>
          <el-table-column prop="rct_business" align="center" label="商品类别">
            <template slot-scope="prop">
              <div>{{prop.row.rct_business == 0 ? '商品' : '优惠券'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="rct_name" align="center" label="商品名称"></el-table-column>
          <el-table-column width="90" align="center" label="优惠券类型">
            <template slot-scope="prop">
              <div v-if="prop.row.rct_business == 0">——</div>
              <div v-else>{{prop.row.coupon_type == 0 ? '流量券' : '金额券'}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="100" label="商品图片">
            <template slot-scope="prop">
              <div v-if="prop.row.rct_business == 1">——</div>
              <div v-else>
                <img
                  class="cur"
                  @click="viewBtn([prop.row.rct_icon], 0, '')"
                  style="max-height:45px;max-width:80px"
                  v-lazy="prop.row.rct_icon"
                  alt
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品编码">
            <template slot-scope="prop">
              <div v-if="prop.row.rct_num == null">——</div>
              <div v-else>{{prop.row.rct_num}}</div>
            </template>
          </el-table-column>
          <el-table-column width="90" align="center" label="原价（元）">
            <template slot-scope="prop">
              <div>{{numToFixed(prop.row.rct_vprice)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="140" label="现价（游币）">
            <template slot-scope="prop">
              <div>{{numToFixed(prop.row.rct_rprice)}}元 + {{prop.row.rct_coin}}游币</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="优惠面值">
            <template slot-scope="prop">
              <div v-if="prop.row.rct_business == 0">——</div>
              <div v-else>{{prop.row.coupon_den}}{{prop.row.coupon_unit}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="时效">
            <template slot-scope="prop">
              <div v-if="prop.row.rct_business == 0">——</div>
              <div v-else>
                <div v-if="prop.row.coupon_interval == -1">永久</div>
                <div v-else-if="prop.row.coupon_interval == -2">——</div>
                <div v-else>{{prop.row.coupon_interval}}天</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="coupon_start" align="center" width="180" label="有效期">
            <template slot-scope="prop">
              <div v-if="prop.row.rct_business == 0">——</div>
              <div
                v-else
              >{{$base.tampToTime(prop.row.coupon_start,2)}} — {{$base.tampToTime(prop.row.coupon_end,2)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="预售数量">
            <template slot-scope="prop">
              <div>{{prop.row.rct_limit == -1 ? '不限' : prop.row.rct_limit}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="130" label="上架时间">
            <template slot-scope="prop">
              <div v-if="prop.row.rct_ondate == null">——</div>
              <div v-else>{{$base.tampToTime(prop.row.rct_ondate)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="rct_sell" width="120" align="center" label="实际售出数量"></el-table-column>
          <el-table-column align="center" width="130" label="下架时间">
            <template slot-scope="prop">
              <div v-if="prop.row.rct_underdate == null">——</div>
              <div v-else>{{$base.tampToTime(prop.row.rct_underdate)}}</div>
            </template>
          </el-table-column>

          <el-table-column fixed="right" align="center" width="270" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="ListData.data[scope.$index].rct_online == 0"
                @click="rack(ListData.data[scope.$index].rct_id, 1)"
                type="success"
                size="mini"
              >上架</el-button>
              <el-button
                v-else-if="ListData.data[scope.$index].rct_online == 1"
                @click="rack(ListData.data[scope.$index].rct_id, 0)"
                type="warning"
                size="mini"
              >下架</el-button>
              <span v-else style="color:#999;padding:0 20px 0 10px">已下架</span>
              <el-button
                @click="addList(1, ListData.data[scope.$index])"
                type="primary"
                size="mini"
              >编辑</el-button>
              <el-button @click="delItem(ListData.data,scope.$index)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加     -->
      <el-dialog class="dialogDIv" width="700px" title :visible.sync="dialogDiv.add">
        <div class="dialoBox">
          <div class="dialoTitle">
            <div>新增商品</div>
            <div @click="dialogDiv.add = false" class="cur">X</div>
          </div>
          <div class="dialoContent">
            <div>
              <span>商品类别：</span>
              <div>
                <el-select v-model="add.goodsType">
                  <el-option
                    v-for="item in tags.goodsType"
                    :key="item.index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div>
              <span>* 商品名称：</span>
              <div>
                <el-input v-model="add.name"></el-input>
              </div>
              <div>
                <!-- <el-input v-model="add.num"></el-input> -->
              </div>
            </div>
            <div>
              <span></span>
              <div class>
                <el-button
                  v-if="add.goodsType == 0 && !tableFlg"
                  @click="$refs.icon.click()"
                  size="mini"
                >上传图片</el-button>
                <el-button
                  v-if="add.goodsType == 1 && !tableFlg"
                  @click="GetCouponList(),dialogDiv.list = true"
                  size="mini"
                >选择优惠券模板</el-button>

                <div class="y-table" v-if="add.goodsType == 0 && tableFlg">
                  <img class="cur" @click="viewBtn([add.iconUrl], 0, '')" :src="add.iconUrl" alt>
                  <div class="y-close cur" @click="tableFlg = false,iconFile=''">
                    <i class="el-icon-error"></i>
                  </div>
                </div>
                <div class="y-table" v-if="add.goodsType == 1 && tableFlg">
                  <el-table :data="couponInfo" style="max-width:650px" border size="mini">
                    <el-table-column prop="rct_type_val" width="120" align="center" label="优惠券类型"></el-table-column>
                    <el-table-column width="110" align="center" label="优惠面值">
                      <template slot-scope="props">
                        <div>{{props.row.rct_den}} {{props.row.rct_unit}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="时效">
                      <template slot-scope="props">
                        <div v-if="props.row.rct_inteval > -2">{{props.row.rct_vaildTime}}</div>
                        <div v-else>——</div>
                      </template>
                    </el-table-column>
                    <el-table-column width="180" align="center" label="有效期">
                      <template slot-scope="props">
                        <div
                          v-if="props.row.rct_inteval == -2"
                        >{{$base.tampToTime(props.row.rct_start,2)}}&nbsp;—&nbsp;{{$base.tampToTime(props.row.rct_end,2)}}</div>
                        <div v-else>——</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="create_date" width="150" align="center" label="创建时间"></el-table-column>
                  </el-table>
                  <div class="y-close cur" @click="tableFlg = false,add.rel=''">
                    <i class="el-icon-error"></i>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span>* 原价：</span>
              <div class>
                <el-input :maxlength="10" v-model="add.vprice">
                  <template slot="append">元</template>
                </el-input>
              </div>
              <div>商品市面价值</div>
            </div>
            <div>
              <span>* 现价：</span>
              <div>
                <el-input :maxlength="10" v-model="add.rprice">
                  <template slot="append">元</template>
                </el-input>
              </div>
              <i class="el-icon-plus"></i>
              <div>
                <el-input :maxlength="10" v-model="add.coin">
                  <template slot="append">游币</template>
                </el-input>
              </div>
            </div>
            <div>
              <span>* 预售数量：</span>
              <div>
                <el-input maxlength="10" v-model="add.amount"></el-input>
              </div>
              <div></div>
            </div>
            <div>
              <span>*推荐：</span>
              <div>
                <el-radio v-model="add.recommend" :label="0">否</el-radio>
                <el-radio v-model="add.recommend" :label="1">是</el-radio>
              </div>
              <div></div>
            </div>
            <div>
              <span>* 火爆标志：</span>
              <div>
                <el-radio v-model="add.hot" :label="0">否</el-radio>
                <el-radio v-model="add.hot" :label="1">是</el-radio>
              </div>
              <div></div>
            </div>
            <div>
              <el-button size="mini" type="primary" @click="submitBtn(1)">上架</el-button>
              <el-button size="mini" @click="submitBtn(0)">保存</el-button>
            </div>
          </div>
        </div>
      </el-dialog>

      <el-dialog class="dialogDIv1" width="500px" title :visible.sync="dialogDiv.list">
        <div class="dialoBox">
          <div class="dialoTitle">
            <div>优惠券面板</div>
            <div @click="dialogDiv.list = false" class="cur">X</div>
          </div>
          <div>
            <el-table
              :data="couponList.data"
              style="max-height:500px;overflow:auto;cursor:pointer"
              border
              @row-click="curList"
              size="mini"
            >
              <el-table-column prop="rct_type_val" align="center" label="优惠券类型"></el-table-column>
              <el-table-column width="110" align="center" label="优惠面值">
                <template slot-scope="props">
                  <div>{{props.row.rct_den}} {{props.row.rct_unit}}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="时效">
                <template slot-scope="props">
                  <div v-if="props.row.rct_inteval > -2">{{props.row.rct_vaildTime}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="date" width="180" align="center" label="有效期">
                <template slot-scope="props">
                  <div
                    v-if="props.row.rct_inteval == -2"
                  >{{$base.tampToTime(props.row.rct_start,2)}}&nbsp;—&nbsp;{{$base.tampToTime(props.row.rct_end,2)}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="create_date" width="150" align="center" label="创建时间"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>

      <!-- 分页 -->
      <div class="goods_pages">
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

    <viewimg v-if="imgType" :imgurl="imgurldata" @typeBy="typeBy"></viewimg>
  </div>
</template>

<script>
import Loading from "./../../../loading/loading";
import viewimg from "./../../../viewimg/viewimg";
export default {
  data() {
    return {
      access_token: "",
      reApp: {
        goodsType: -1,
        name: "",
        online: -2,
        up_date: "",
        down_date: ""
      },
      tags: {
        goodsTypes: [
          { id: -1, name: "全部" },
          { id: 0, name: "商品" },
          { id: 1, name: "优惠券" }
        ],
        goodsType: [{ id: 0, name: "商品" }, { id: 1, name: "优惠券" }],
        onlineFlg: [
          { id: -2, name: "全部" },
          { id: -1, name: "未上架" },
          { id: 0, name: "下架" },
          { id: 1, name: "上架" }
        ]
      },
      add: {
        goodsType: 0, //商品类别 0-商品 1-优惠券
        id: "",
        rel: "", //优惠券模板ID
        iconUrl: "",
        url: "", //图片地址
        name: "", //商品名称
        rprice: "", //真实价格
        vprice: "", //虚拟价格
        coin: "", //游币
        amount: "", //预售数量
        recommend: 0, //推荐
        hot: 0 //火爆标志
      },
      addType: 0,
      iconFile: "",
      ListData: {},
      couponList: {},
      couponInfo: [],
      dialogDiv: {
        add: false,
        list: false
      },
      currentPage: 1,
      pagesize: 20,
      loadingType: false,
      tableFlg: false,
      rightW: "",
      tableHeight: "auto",
      imgType: false
    };
  },
  created() {
    const that = this;
    that.access_token = localStorage.getItem("accessToken");
    if (that.access_token != null) {
      that.access_token = JSON.parse(that.access_token);
      that.GetList();
      that.GetCouponList();
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
          window.innerHeight - $(".goods_search").height() - hig;
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
    },
    "add.goodsType"() {
      this.tableFlg = false;
    },
    addType() {
      if (this.addType == 0) {
        this.tableFlg = false;
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
        that.handleCurrentChange(1);
      }
    },
    typeBy(t) {
      this.imgType = t;
    },
    viewBtn(data, index, url) {
      let list = [];
      for (let i = 0; i < data.length; i++) {
        list.push(data[i]);
      }
      this.imgurldata = {
        list,
        index,
        url
      };
      this.imgType = true;
    },
    Clear() {
      this.reApp = {
        goodsType: -1,
        name: "",
        online: -2,
        up_date: "",
        down_date: ""
      };
    },
    numToFixed(num) {
      if (num % 100 == 0) {
        return num / 100;
      } else if (num % 10 == 0) {
        return (num / 100).toFixed(1);
      } else {
        return (num / 100).toFixed(2);
      }
    },
    curList(row, rowIndex) {
      this.couponInfo = [];
      this.couponInfo.push(row);
      this.add.rel = row.rct_id;
      this.dialogDiv.list = false;
      this.tableFlg = true;
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
    // 列表
    GetList() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/commodity/tmp/list",
          method: "post",
          params: {
            access_token: that.access_token,
            business: that.reApp.goodsType,
            name: that.reApp.name,
            online: that.reApp.online,
            on_date: that.reApp.up_date,
            under_date: that.reApp.down_date,
            page: that.currentPage,
            rows: that.pagesize
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.ListData = res.data.obj;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    // 优惠券列表
    GetCouponList() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/coupon/tmp/list",
          method: "post",
          params: {
            access_token: that.access_token,
            rct_type: -1,
            page: 1,
            rows: 1000
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.couponList = res.data.obj;
            if (that.couponList.data != null) {
              for (let i = 0; i < that.couponList.data.length; i++) {
                that.couponList.data[i].rct_type_val =
                  that.couponList.data[i].rct_type === 0 ? "流量券" : "现金券";
                that.couponList.data[i].rct_vaildTime =
                  that.couponList.data[i].rct_inteval === -1
                    ? "永久"
                    : that.couponList.data[i].rct_inteval + " 天";
                that.couponList.data[i].create_date = that.$base.tampToTime(
                  that.couponList.data[i].create_date
                );
              }
              this.tableHeight =
                window.innerHeight - $(".goods_search").height() - 198;
            }
            // that.dialogDiv.list = true
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    submitBtn(flg) {
      const that = this;
      const zNumber = /^\+?[1-9][0-9]*$/; //正整数
      const zToFixed = /^(-?\d+)(\.\d{1,2})?$/; //最多输入两位小数
      if (that.add.name === "" && that.add.goodsType === 0) {
        that.$message.error("商品名称不可为空！");
      } else if (
        that.add.goodsType === 0 &&
        that.addType == 0 &&
        that.iconFile === ""
      ) {
        that.$message.error("请上传商品图片！");
      } else if (that.add.goodsType === 1 && that.add.rel === "") {
        that.$message.error("请选择正确的优惠券！");
      } else if (
        that.add.rprice < 0 ||
        that.add.rprice === "" ||
        !zToFixed.test(that.add.rprice)
      ) {
        that.$message.error("请输入正确的原价！");
      } else if (
        that.add.vprice < 0 ||
        that.add.vprice === "" ||
        !zToFixed.test(that.add.vprice)
      ) {
        that.$message.error("请输入正确的现价！");
      } else if (
        that.add.coin < 0 ||
        that.add.coin === "" ||
        !zNumber.test(that.add.coin)
      ) {
        that.$message.error("请输入正确的游币！");
      }
      //   else if (
      //     that.add.amount < 0 ||
      //     that.add.amount === "" ||
      //     !zNumber.test(that.add.amount)
      //   ) {
      //     that.$message.error("请输入正确的数量！");
      //   }
      else {
        if (that.iconFile === "") {
          that.GetIssue(flg);
        } else {
          that.GetOSSUp(flg);
        }
      }
    },
    html5Reader(file, item) {
      const reader = new FileReader();
      reader.onload = e => {
        this.$set(item, "url", e.target.result);
      };
      reader.readAsDataURL(file);
    },
    //上传图片到oss
    GetOSSUp(flg) {
      const that = this;
      that.loadingType = true;
      let itemUrl = that.iconFile;
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
            const client = new OSS.Wrapper({
              region: "oss-cn-beijing",
              accessKeyId: OSSData.AccessKeyId,
              accessKeySecret: OSSData.AccessKeySecret,
              stsToken: OSSData.SecurityToken,
              bucket: "anygo-imag"
            });
            let f = item;
            const Name = f.name;
            const suffix = Name.substr(Name.indexOf("."));
            const obj = that.timestamp();
            const storeAs =
              "goods-imgs/" + obj + that.createRandomId() + suffix; //  路径+时间戳+随机命名+后缀名
            client
              .multipartUpload(storeAs, f.file)
              .then(function(result) {
                // console.log(result);
                that.add.url =
                  "http://anygo-imag.oss-cn-beijing.aliyuncs.com/" +
                  result.name;
                that.GetIssue(flg);
                that.iconFile = "";
              })
              .catch(err => {
                console.log(err);
                that.loadingType = true;
              });
          }
        })
        .catch(err => {
          console.log(err);
          that.loadingType = true;
        });
    },
    //随机命名
    createRandomId() {
      return Math.random()
        .toString(36)
        .substr(2);
    },
    //  时间戳
    timestamp() {
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
    Add0(m) {
      return m < 10 ? "0" + m : m;
    },
    // 新增
    GetIssue(flg) {
      const that = this;
      that.loadingType = true;
      var data = {
        access_token: that.access_token,
        name: that.add.name,
        icon: that.add.url,
        business: that.add.goodsType,
        rel: that.add.rel,
        vprice: (that.add.vprice * 100).toFixed(0),
        rprice: (that.add.rprice * 100).toFixed(0),
        coin: that.add.coin,
        online: flg,
        limit_amount: that.add.amount,
        recommend: that.add.recommend,
        hot: that.add.hot
      };
      if (that.addType == 1) {
        data.id = that.add.id;
      }
      // console.log(data);
      that
        .$http({
          url: that.urlHost + "/man/commodity/tmp/issue",
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
              goodsType: 0, //商品类别 0-商品 1-优惠券
              id: "",
              rel: "", //优惠券模板ID
              iconUrl: "",
              url: "", //图片地址
              name: "", //商品名称
              rprice: "", //真实价格
              vprice: "", //虚拟价格
              coin: "", //游币
              amount: "", //预售数量
              recommend: 0, //推荐
              hot: 0 //火爆标志
            };
            that.couponInfo = [];
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    //添加
    addList(flg, info) {
      const that = this;
      if (flg == 0) {
        that.add = {
          goodsType: 0, //商品类别 0-商品 1-优惠券
          id: "",
          rel: "", //优惠券模板ID
          iconUrl: "",
          url: "", //图片地址
          name: "", //商品名称
          rprice: "", //真实价格
          vprice: "", //虚拟价格
          coin: "", //游币
          amount: "", //预售数量
          recommend: 0,
          hot: 0
        };
      } else {
        // console.log(info);
        that.add = {
          goodsType: info.rct_business, //商品类别 0-商品 1-优惠券
          id: info.rct_id,
          rel: info.rct_rel, //优惠券模板ID
          iconUrl: info.rct_icon,
          url: info.rct_icon, //图片地址
          name: info.rct_name, //商品名称
          rprice: info.rct_rprice / 100, //真实价格
          vprice: info.rct_vprice / 100, //虚拟价格
          coin: info.rct_coin, //游币
          amount: info.rct_limit, //预售数量
          recommend: info.rct_recommend,
          hot: info.rct_hot
        };
        setTimeout(() => {
          that.tableFlg = true;
        }, 0);
        that.couponInfo = [
          {
            rct_type_val: info.rct_type === 0 ? "流量券" : "现金券",
            rct_den: info.coupon_den,
            rct_unit: info.coupon_unit,
            rct_inteval: info.coupon_interval,
            rct_vaildTime:
              info.coupon_interval === -1
                ? "永久"
                : info.coupon_interval + " 天",
            rct_start: info.coupon_start,
            rct_end: info.coupon_end,
            create_date:
              info.rct_underdate == null
                ? "——"
                : that.$base.tampToTime(info.rct_underdate)
          }
        ];
      }
      that.addType = flg;
      that.dialogDiv.add = true;
    },

    //删除
    delItem(data, index) {
      let that = this;
      let id = data[index].rct_id;
      that
        .$confirm("是否删除？", "提示")
        .then(() => {
          that
            .$http({
              url: that.urlHost + "/man/commodity/tmp/del",
              method: "post",
              params: {
                access_token: that.access_token,
                id: id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                that.$message.success(res.data.msg);
                data.splice(index, 1);
                // that.GetUserList()
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
    //上架、下架
    rack(id, flg) {
      let that = this;
      that
        .$confirm("确认是否修改？", "提示")
        .then(() => {
          that.loadingType = true;
          that
            .$http({
              url: that.urlHost + "/man/commodity/tmp/rack",
              method: "post",
              params: {
                access_token: that.access_token,
                id: id,
                opt: flg
              }
            })
            .then(res => {
              that.loadingType = false;
              if (res.data.success === "00000000") {
                that.$message.success(res.data.msg);
                that.GetList();
              } else {
                that.$base.err(res, that);
              }
            })
            .catch(err => {
              that.loadingType = false;
              that.$message.error(res.data.msg);
              console.log(err);
            });
        })
        .catch(() => {});
    },
    IconChange() {
      const that = this;
      let itemUrl = that.$refs.icon.files[0];
      that.iconFile = itemUrl;
      if (itemUrl.type.match(/image.*/)) {
        var reader = new FileReader();
        reader.onload = () => {
          var img = new Image();
          img.src = reader.result;
          that.add.iconUrl = img.src;
        };
        reader.readAsDataURL(itemUrl);
        that.tableFlg = true;
        $(".icons").val("");
      } else {
        that.$message.error("请上传正确的图片！");
      }
    }
  },
  components: {
    Loading,
    viewimg
  }
};
</script>

<style lang="less">
.goods {
  position: relative;
  height: 100%;
  overflow: auto;
  .goods_top {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    color: #999;
    border-bottom: 1px solid #aaa;
    span {
      font-size: 15px;
    }
  }
  .goods_box {
    position: relative;
    padding-left: 20px;
    height: calc(100% - 45px);
    display: flex;
    flex-direction: column;
    .goods_search {
      padding-top: 15px;
      > div {
        display: flex;
        flex-wrap: wrap;
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
    .goods_table {
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
        //     overflow-x: hidden;
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
    .goods_pages {
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
        width: 700px;
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
          align-items: center;
          padding-bottom: 15px;
          > span {
            text-align: right;
            width: 100px;
            margin-top: 7px;
          }
          > div:nth-child(2) {
            flex: 1;
            display: flex;
            align-items: center;
          }
          > div:nth-child(3) {
            width: 170px;
            padding-left: 20px;
            display: flex;
            align-items: center;
            color: #999;
          }
          i {
            margin: 0 5px;
          }
          > div:nth-child(4) {
            width: 165px;
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
        .y-table {
          position: relative;
          .y-close {
            position: absolute;
            top: 5px;
            right: 5px;
          }
          img {
            max-width: 200px;
            max-height: 250px;
            border: 1px solid #dcdfe6;
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
      .dialoBox {
        font-size: 14px;
        background: #fff;
        width: 700px;
      }
      .dialoTitle {
        display: flex;
        justify-content: space-between;
        background: #3a9cf7;
        color: #fff;
        padding: 10px 20px;
      }
    }
  }
}
</style>
