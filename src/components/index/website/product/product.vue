<template>
  <div class="product" :style="{'width':rightW}">
    <Loading v-if="loadingType"></Loading>
    <div class="product_top">
      <div>
        <img
          src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png"
          alt
        > 当前位置：官网管理 >
        <span>
          <el-button type="text">产品订购</el-button>
        </span>
      </div>
    </div>

    <div class="product_box">
      <!-- 查询条件 -->
      <div class="product_search">
        <div>
          <div>
            <span>申请时间：</span>
            <el-date-picker
              v-model="reApp.date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div>
            <span>手机号：</span>
            <el-input v-model="reApp.phone" placeholder="手机号" maxlength="11"></el-input>
          </div>
          <div>
            <span>处理人：</span>
            <el-select v-model="reApp.admin" placeholder="全部">
              <el-option
                v-for="item in tags.adminTags"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>处理进程：</span>
            <el-select v-model="reApp.schedule" placeholder>
              <el-option
                v-for="item in tags.scheduleTags"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>颜色：</span>
            <el-select v-model="reApp.color" placeholder>
              <el-option
                v-for="item in tags.colorTags"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>付款类型：</span>
            <el-select v-model="reApp.payment" placeholder>
              <el-option
                v-for="item in tags.paymentTags"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>付款方式：</span>
            <el-select v-model="reApp.payFlag" placeholder>
              <el-option
                v-for="item in tags.payFlagTags"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
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
      <!-- 列表 -->
      <div class="product_table">
        <el-table
          :data="ListData.data"
          :height="tableHeight"
          border
          size="mini"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="49" align="center" label="编号"></el-table-column>
          <el-table-column align="center" width="140" label="申请时间">
            <template slot-scope="scope">
              <div>{{$base.tampToTime(scope.row.create_date,3)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="ao_name" align="center" label="姓名"></el-table-column>
          <el-table-column prop="ao_phone" width="100" align="center" label="手机号"></el-table-column>
          <el-table-column width="120" align="center" label="收货地址">
            <template slot-scope="scope">
              <div class="lengH" :title="scope.row.ao_addr">{{scope.row.ao_addr}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="150" label="详细信息描述">
            <template slot-scope="scope">
              <div class="lengH" :title="scope.row.ao_content">{{scope.row.ao_content}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="处理人">
            <template slot-scope="scope">
              <div>{{userChange(scope.row.handle_user)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="处理进程">
            <template slot-scope="scope">
              <div
                :class="{'col_red':scope.row.handle_schedule == -1,'col_green':scope.row.handle_schedule == 0}"
              >{{scope.row.handle_schedule == -1 ? "待处理" : scope.row.handle_schedule == 0 ? "处理中" : "已处理"}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="确认订单">
            <el-table-column prop="order_name" align="center" label="产品名称" width="90"></el-table-column>
            <el-table-column prop="order_color" width="90" align="center" label="颜色"></el-table-column>
            <el-table-column align="center" label="单价(元)">
              <template slot-scope="scope">
                <div>{{numToFixed(numChange(scope.row.order_price))}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量">
              <template slot-scope="scope">
                <div>{{numChange(scope.row.order_amount)}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="总价(元)">
              <template slot-scope="scope">
                <div>{{numToFixed(numChange(scope.row.order_total))}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="付款方式">
              <template slot-scope="scope">
                <div>{{paymentType(scope.row.order_paytype)}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="支付方式">
              <template slot-scope="scope">
                <div>{{paymentTerms(scope.row.order_payflat)}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="order_trans" align="center" label="选择快递"></el-table-column>
            <el-table-column prop="order_transno" align="center" label="快递单号"></el-table-column>
          </el-table-column>

          <el-table-column align="center" fixed="right" width="170" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.handle_schedule == 1"
                @click="view(ListData.data,scope.$index)"
                size="mini"
              >查看</el-button>
              <el-button
                v-else
                @click="view(ListData.data,scope.$index)"
                type="primary"
                size="mini"
              >处理</el-button>
              <el-button @click="delItem(ListData.data,scope.$index)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加     -->
        <el-dialog class="dialogDIv" width="600px" title :visible.sync="dialogDiv.view">
          <div class="dialoBox">
            <div class="dialoTitle">
              <div>产品订购处理</div>
              <div @click="dialogDiv.view = false" class="cur">X</div>
            </div>
            <div class="dialoContent">
              <div>
                <span>处理人：</span>
                <div>
                  <el-input disabled v-model="handle_name"></el-input>
                </div>
              </div>
              <div>
                <span>申请信息：</span>
                <div class="info">
                  <div class="info-box">
                    <div>
                      <div>申请时间</div>
                      <div>姓名</div>
                      <div>电话</div>
                      <div>收货地址</div>
                      <div>需求描述</div>
                    </div>
                    <div>
                      <div>{{$base.tampToTime(DataInfo.create_date,3)}}</div>
                      <div>
                        <div v-if="!edit.name">
                          <span
                            class="lengH"
                            style="max-width:270px;display:block;"
                            :title="DataInfo.ao_name"
                          >{{DataInfo.ao_name}}</span>
                          <el-button type="text" @click="edit.name = true">修改</el-button>
                        </div>
                        <el-input
                          ref="bName"
                          v-else
                          @blur="edit.name = false"
                          v-model="DataInfo.ao_name"
                        ></el-input>
                      </div>
                      <div>
                        <div v-if="!edit.phone">
                          <span :title="DataInfo.ao_phone">{{DataInfo.ao_phone}}</span>
                          <!-- <el-button type="text" @click="edit.phone = true">修改</el-button> -->
                        </div>
                        <el-input
                          ref="bPhone"
                          v-else
                          @blur="edit.phone = false"
                          v-model="DataInfo.ao_phone"
                          maxlength="11"
                        ></el-input>
                      </div>
                      <div>
                        <div v-if="!edit.addr">
                          <span
                            class="lengH"
                            style="max-width:270px;display:block;"
                            :title="DataInfo.ao_addr"
                          >{{DataInfo.ao_addr}}</span>
                          <el-button type="text" @click="edit.addr = true">修改</el-button>
                        </div>
                        <el-input
                          ref="bAddr"
                          v-else
                          @blur="edit.addr = false"
                          v-model="DataInfo.ao_addr"
                        ></el-input>
                      </div>
                      <div>
                        <div v-if="!edit.content">
                          <span
                            style="word-break:break-all;white-space:pre-wrap;"
                            :title="DataInfo.ao_content"
                          >{{DataInfo.ao_content}}</span>
                          <el-button type="text" @click="edit.content = true">修改</el-button>
                        </div>
                        <el-input
                          type="textarea"
                          ref="bContent"
                          v-else
                          @blur="edit.content = false"
                          v-model="DataInfo.ao_content"
                        ></el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <span>确定订单：</span>
                <div class="info1">
                  <div class="info-box1">
                    <div>
                      <span>产品名称</span>
                      <div>
                        <el-select v-model="reOrderInfo.name" placeholder="全部">
                          <el-option
                            v-for="item in tags.name"
                            :key="item.index"
                            :label="item.name"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                        <el-select class="nth2" v-model="reOrderInfo.color" placeholder="全部">
                          <el-option
                            v-for="item in tags.color"
                            :key="item.index"
                            :label="item"
                            :value="item"
                          ></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div>
                      <span>单价</span>
                      <div>
                        <el-input v-model="reOrderInfo.price"></el-input>&nbsp;&nbsp;元
                      </div>
                    </div>
                    <div>
                      <span>数量</span>
                      <div>
                        <el-input v-model="reOrderInfo.amount"></el-input>&nbsp;&nbsp;件
                      </div>
                    </div>
                    <div>
                      <span>总价</span>
                      <div>
                        <el-input v-model="reOrderInfo.total"></el-input>&nbsp;&nbsp;元
                      </div>
                    </div>
                    <div>
                      <span>付款方式</span>
                      <div>
                        <el-radio v-model="reOrderInfo.paytype" :label="1">全款</el-radio>
                        <el-radio v-model="reOrderInfo.paytype" :label="2">货到付款</el-radio>
                      </div>
                    </div>
                    <div>
                      <span>支付方式</span>
                      <div>
                        <el-radio v-model="reOrderInfo.payflat" :label="1">微信</el-radio>
                        <el-radio v-model="reOrderInfo.payflat" :label="2">支付宝</el-radio>
                      </div>
                    </div>
                    <div>
                      <span>选择快递</span>
                      <div>
                        <el-select v-model="reOrderInfo.trans">
                          <el-option
                            v-for="item in tags.trans"
                            :key="item.index"
                            :label="item"
                            :value="item"
                          ></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div>
                      <span>快递单号</span>
                      <div>
                        <el-input v-model="reOrderInfo.transno"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <el-button size="mini" type="primary" @click="GetConfirm">完成</el-button>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>

      <!-- 分页 -->
      <div class="product_pages">
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
      reApp: {
        date: "",
        phone: "",
        admin: "",
        color: "",
        schedule: -1,
        payment: -1,
        payFlag: -1
      },
      tags: {
        adminTags: {},
        scheduleTags: [
          { id: -1, name: "全部" },
          { id: 0, name: "待处理" },
          { id: 1, name: "处理中" },
          { id: 2, name: "已处理" }
        ],
        colorTags: [
          { id: "", name: "全部" },
          { id: "全新珍珠白", name: "全新珍珠白" },
          { id: "粉嫩玫瑰金", name: "粉嫩玫瑰金" },
          { id: "阔气土豪金", name: "阔气土豪金" }
        ],
        paymentTags: [
          { id: -1, name: "全部" },
          { id: 1, name: "全款" },
          { id: 2, name: "货到付款" }
        ],
        payFlagTags: [
          { id: -1, name: "全部" },
          { id: 1, name: "微信" },
          { id: 2, name: "支付宝" }
        ],
        name: [{ id: "艾侗游", name: "艾侗游" }],
        color: ["全新珍珠白", "粉嫩玫瑰金", "阔气土豪金"],
        trans: [
          "顺丰",
          "圆通",
          "申通",
          "韵达",
          "中通",
          "天天",
          "EMS",
          "全峰",
          "优速",
          "急宅送",
          "邮政包裹",
          "速尔"
        ]
      },
      ListData: {},
      DataInfo: {},
      handle_name: "",
      rr_type: 0,
      dialogDiv: {
        view: false
      },
      currentPage: 1,
      pagesize: 20,
      loadingType: false,
      rightW: "",
      tableHeight: "auto",
      reOrderInfo: {
        name: "艾侗游", //商品名称
        color: "全新珍珠白", //颜色
        price: "", //单价
        amount: "", //数量
        total: "", //总价
        paytype: 1, //付款类型 0-全款   1-货到付款
        payflat: 1, //支付方式 0-微信   1-支付宝
        trans: "顺丰",
        transno: ""
      },
      edit: {
        name: false,
        phone: false,
        addr: false,
        content: false
      }
    };
  },
  created() {
    const that = this;
    that.access_token = localStorage.getItem("accessToken");
    if (that.access_token != null) {
      that.access_token = JSON.parse(this.access_token);
      that.getAdmin();
      this.GetList();
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
        var hig = 175;
      } else if (window.innerWidth > 1920) {
        this.rightW = 1920 - wid + "px";
        var hig = 155;
      } else {
        this.rightW = window.innerWidth - wid + "px";
        var hig = 155;
      }
      setTimeout(() => {
        this.tableHeight =
          window.innerHeight - $(".product_search").height() - hig;
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
    "reOrderInfo.price"() {
      if (this.reOrderInfo.price > 0 && this.reOrderInfo.amount > 0) {
        this.reOrderInfo.total =
          this.reOrderInfo.price * this.reOrderInfo.amount;
      } else {
        this.reOrderInfo.total = "";
      }
    },
    "reOrderInfo.amount"() {
      if (this.reOrderInfo.price > 0 && this.reOrderInfo.amount > 0) {
        this.reOrderInfo.total =
          this.reOrderInfo.price * this.reOrderInfo.amount;
      } else {
        this.reOrderInfo.total = "";
      }
    },
    "edit.name"() {
      if (this.edit.name) {
        setTimeout(() => {
          this.$refs.bName.focus();
        }, 0);
      }
    },
    "edit.phone"() {
      if (this.edit.phone) {
        setTimeout(() => {
          this.$refs.bPhone.focus();
        }, 0);
      }
    },
    "edit.addr"() {
      if (this.edit.addr) {
        setTimeout(() => {
          this.$refs.bAddr.focus();
        }, 0);
      }
    },
    "edit.content"() {
      if (this.edit.content) {
        setTimeout(() => {
          this.$refs.bContent.focus();
        }, 0);
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
    userChange(row) {
      if (row != null && row != "") {
        for (let i = 0; i < this.tags.adminTags.length; i++) {
          if (row === this.tags.adminTags[i].id) {
            return this.tags.adminTags[i].name;
          }
        }
      }
    },
    numToFixed(num) {
      if (num == "" || num == 0) {
        return "";
      } else if (num % 100 == 0) {
        return num / 100;
      } else if (num % 10 == 0) {
        return (num / 100).toFixed(1);
      } else {
        return (num / 100).toFixed(2);
      }
    },
    numChange(row) {
      if (row == 0) {
        return "";
      } else {
        return row;
      }
    },
    paymentType(num) {
      if (num == 1) {
        return "全款";
      } else if (num == 2) {
        return "货到付款";
      } else {
        return "";
      }
    },
    paymentTerms(num) {
      if (num == 1) {
        return "微信";
      } else if (num == 2) {
        return "支付宝";
      } else {
        return "";
      }
    },
    Clear() {
      this.reApp = {
        date: "",
        phone: "",
        admin: "",
        color: "",
        schedule: -1,
        payment: -1,
        payFlag: -1
      };
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
    formContent(val) {
      // console.log(val);
    },
    getAdmin() {
      const that = this;
      that
        .$http({
          url: that.urlHost + "/man/user/auto",
          method: "post",
          params: {
            access_token: that.access_token
          }
        })
        .then(res => {
          if (res.data.success === "00000000") {
            that.tags.adminTags = res.data.obj.data;
            that.tags.adminTags.unshift({
              id: "",
              name: "全部"
            });
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 订购列表
    GetList() {
      const that = this;
      that.loadingType = true;
      that
        .$http({
          url: that.urlHost + "/man/order/list",
          method: "post",
          params: {
            access_token: that.access_token,
            date: that.reApp.date,
            deal: that.reApp.admin,
            handle_schedule: that.reApp.schedule,
            phone: that.reApp.phone,
            color: that.reApp.color,
            paytype: that.reApp.payment,
            payflat: that.reApp.payFlag,
            page: that.currentPage,
            rows: that.pagesize
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.ListData = res.data.obj;
            this.tableHeight =
              window.innerHeight - $(".product_search").height() - 155;
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },
    // 处理
    GetConfirm() {
      const that = this;
      if (that.reOrderInfo.price == "" || that.reOrderInfo.price < 0) {
        that.$message.warning("请填写正确的价格！");
      } else if (that.reOrderInfo.amount == "" || that.reOrderInfo.amount < 0) {
        that.$message.warning("请填写正确的数量！");
      } else {
        that.loadingType = true;
        that
          .$http({
            url: that.urlHost + "/man/order/handle",
            method: "post",
            params: {
              access_token: that.access_token,
              id: that.DataInfo.ao_id,
              ao_name: that.DataInfo.ao_name,
              // ao_phone: that.DataInfo.ao_phone,
              ao_addr: that.DataInfo.ao_addr,
              ao_content: that.DataInfo.ao_content,
              status: 1,
              aoh_name: that.reOrderInfo.name,
              aoh_color: that.reOrderInfo.color,
              aoh_price: (that.reOrderInfo.price * 100).toFixed(0),
              aoh_amount: that.reOrderInfo.amount,
              aoh_total: (that.reOrderInfo.total * 100).toFixed(0),
              aoh_paytype: that.reOrderInfo.paytype,
              aoh_payflat: that.reOrderInfo.payflat,
              aoh_trans: that.reOrderInfo.trans,
              aoh_transno: that.reOrderInfo.transno
            },
            timeout: 10000
          })
          .then(res => {
            that.loadingType = false;
            if (res.data.success === "00000000") {
              that.$message.success(res.data.msg);
              that.GetList();
              that.dialogDiv.view = false;
            } else {
              that.$base.err(res, that);
            }
          })
          .catch(err => {
            that.loadingType = false;
            that.$message.error("网络异常！");
          });
      }
    },
    //处理
    view(data, index) {
      const that = this;
      that.loadingType = true;
      that.handle_name =
        data[index].handle_name == null || data[index].handle_name == ""
          ? this.infrom.access_name
          : data[index].handle_name;
      if (data[index].handle_schedule == 1) {
        that.reOrderInfo = {
          name: data[index].order_name, //商品名称
          color: data[index].order_color, //颜色
          price: data[index].order_price / 100, //单价
          amount: data[index].order_amount, //数量
          total: data[index].order_total / 100, //总价
          paytype: data[index].order_paytype, //付款类型 0-全款   1-货到付款
          payflat: data[index].order_payflat, //支付方式 0-微信   1-支付宝
          trans: data[index].order_trans,
          transno: data[index].order_transno
        };
      } else {
        that.reOrderInfo = {
          name: "艾侗游", //商品名称
          color: "全新珍珠白", //颜色
          price: "", //单价
          amount: "", //数量
          total: "", //总价
          paytype: 1, //付款类型 0-全款   1-货到付款
          payflat: 1, //支付方式 0-微信   1-支付宝
          trans: "顺丰",
          transno: ""
        };
      }
      that
        .$http({
          url: that.urlHost + "/man/order/info",
          method: "post",
          params: {
            access_token: that.access_token,
            id: data[index].ao_id
          },
          timeout: 10000
        })
        .then(res => {
          that.loadingType = false;
          if (res.data.success === "00000000") {
            that.dialogDiv.view = true;
            that.DataInfo = res.data.obj;
            that.GetList();
          } else {
            that.$base.err(res, that);
          }
        })
        .catch(err => {
          that.loadingType = false;
          that.$message.error("网络异常！");
        });
    },

    //删除
    delItem(data, index) {
      let _that = this;
      let id = data[index].au_id;
      _that
        .$confirm("是否删除？", "提示")
        .then(() => {
          _that
            .$http({
              url: _that.urlHost + "/man/order/del",
              method: "post",
              params: {
                access_token: _that.access_token,
                id: data[index].ao_id
              }
            })
            .then(res => {
              if (res.data.success === "00000000") {
                _that.$message({
                  message: "已删除！",
                  type: "success",
                  center: true
                });
                // data.splice(index,1)
                _that.GetList();
              } else {
                _that.$base.err(res, _that);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    }
  },
  components: {
    Loading
  }
};
</script>

<style lang="less">
.product {
  position: relative;
  height: 100%;
  overflow: auto;
  .product_top {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    color: #999;
    border-bottom: 1px solid #aaa;
    span {
      font-size: 15px;
    }
  }
  .product_box {
    position: relative;
    padding-left: 20px;
    height: calc(100% - 45px);
    display: flex;
    flex-direction: column;
    // background:#ccc;
    .product_search {
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
    .product_table {
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
          border-bottom: 1px solid #ccc;
          padding: 2px 0;
        }
        tr:first-child {
          th:first-child {
            border-left: 0 !important;
          }
        }
        td {
          border-left: 1px solid #ccc !important;
          border-right: 0 !important;
          border-bottom: 1px solid #ccc !important;
        }
        td:first-child {
          border-left: 0 !important;
        }
        .warning-row {
          background: #f4f9fc;
        }
        // .el-table__body-wrapper{
        //     border-top: 1px solid #3A9CF7 !important;
        // }
        .el-table__row .cell {
          white-space: pre !important;
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
    .product_pages {
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
            width: 80px;
            margin-top: 7px;
          }
          > div {
            flex: 1;
            display: flex;
            align-items: center;
          }
          .info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .info-box {
              display: flex;
              width: 100%;
              border: 1px solid #dcdfe6;
              > div:nth-child(1) {
                padding: 20px;
                width: 80px;
                text-align: right;
                border-right: 1px solid #dcdfe6;
                > div {
                  margin-bottom: 10px;
                  min-height: 25px;
                }
              }
              > div:nth-child(2) {
                padding: 20px;
                flex: 1;
                > div {
                  margin-bottom: 10px;
                  min-height: 25px;
                  width: 320px;
                  word-wrap: break-word;
                  > div {
                    display: flex;
                    align-items: flex-start;
                  }
                }
              }
              .el-button {
                padding: 0 10px;
              }
              input {
                height: 25px;
                line-height: 25px;
              }
            }
          }
          .info1 {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .info-box1 {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              border: 1px solid #dcdfe6;
              background: #efefef;
              padding-bottom: 20px;
              padding-right: 20px;
              > div {
                display: flex;
                align-items: center;
                margin-top: 20px;
                > span {
                  display: flex;
                  width: 80px;
                  justify-content: flex-end;
                  text-align: right;
                  margin-right: 20px;
                }
                > div {
                  display: flex;
                  align-items: center;
                }
                .el-input__inner {
                  height: 30px;
                  line-height: 30px;
                  width: 220px;
                }
                .nth2 {
                  .el-input__inner {
                    margin-left: 20px;
                    width: 120px;
                  }
                }
                i {
                  line-height: 30px;
                }
              }
            }
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
      }
    }
  }
  .lengs {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
