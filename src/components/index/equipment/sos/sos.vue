<template>
    <div class="sos" :style="{'width':rightW}">
        <Loading v-if="loadingType"></Loading>
        <div class="sos_top">
            <div><img src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png" alt=""> 当前位置：设备管理 > <span><el-button type="text">SOS键</el-button></span></div>
        </div>
        <div class="sos_box">
            <!-- 查询条件 -->
            <div class="sos_search">
                <div>
                    <div>
                        <span>用户账号：</span>
                        <el-input v-model="reSosData.name" placeholder="用户账号">
                        </el-input>
                    </div>
                   <div>
                        <span>性别：</span>
                        <el-select v-model="reSosData.sex" placeholder="请选择">
                            <el-option
                            v-for="item in sexFlags"
                            :key="item.index"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <span>职业：</span>
                        <el-input v-model="reSosData.occupation" placeholder="职业">
                        </el-input>
                    </div>
                    <div>
                        <span>设备编号：</span>
                        <el-input v-model="reSosData.speak_num" placeholder="设备编号">
                        </el-input>
                    </div>
                    
                    <div>
                        <span>求救时间：</span>
                        <el-date-picker
                        v-model="reSosData.date"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div>
                        <span>处理进程：</span>
                        <el-select v-model="reSosData.handle_schedule" >
                            <el-option
                            v-for="item in schedule"
                            :key="item.index"
                            :label="item.name"
                            :value="item.val">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <el-button  @click="GetSearchList" type="primary" size="mini"><i class="el-icon-search"></i> 查询</el-button>
                    </div>
                    <div>
                        <el-button @click="searchClear" size="mini"><i class="el-icon-refresh"></i> 清空</el-button>
                    </div>
                </div>
            </div>
            <!-- 列表 -->
            <div class="sos_table">
                <el-table
                    :data="sosList.data"
                    border
                    size="mini"
                    :height="tableHeihgt"
                    :row-class-name="tableRowClassName">
                    <el-table-column
                    type="index"
                    width="49"
                    align="center"
                    label="编号">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    align="center"
                    label="用户昵称">
                    </el-table-column>
                    <el-table-column
                    prop="phone"
                    title="phone"
                    align="center"
                    width="120"
                    label="用户账号">
                    </el-table-column>
                    <el-table-column
                    prop="sex"
                    width="50"
                    align="center"
                    label="性别">
                    </el-table-column>
                    <el-table-column
                    prop="age"
                    align="center"
                    label="出生日期">
                    </el-table-column>
                    <el-table-column
                    prop="occupation"
                    align="center"
                    label="职业">
                    </el-table-column>
                    <el-table-column
                    prop="guide_no"
                    align="center"
                    label="导游证号">
                    </el-table-column>
                    <el-table-column
                    prop="company"
                    align="center"
                    label="隶属公司">
                    </el-table-column>
                    <el-table-column
                    prop="rss_speak_num"
                    align="center"
                    label="绑定设备编号">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    width="100"
                    label="当前位置">
                        <template slot-scope="props">
                            <div @click="addr(props.row.rss_lon, props.row.rss_lat)" class="path" v-if="props.row.handle_schedule == 111 || props.row.handle_schedule == 121">
                                <img src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/position_ever.png" alt=""><span>具体位置</span>
                            </div>
                            <div @click="addr(props.row.rss_lon, props.row.rss_lat)" class="path col_active" v-else>
                                <img src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/position_new.png" alt=""><span>具体位置</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="rss_phone"
                    align="center"
                    label="紧急联系人电话">
                    </el-table-column>
                    <el-table-column
                    prop="create_date"
                    align="center"
                    width="140"
                    label="求救时间">
                    </el-table-column>
                    <el-table-column
                    prop="handle_name"
                    align="center"
                    label="处理人">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    width="120"
                    label="处理进程">
                        <template slot-scope="scope">
                            <div :class="{'col_red':scope.row.schedule_name=='未处理','col_green':scope.row.schedule_name=='未确认'}">{{scope.row.schedule_name}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    fixed="right"
                    width="170"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.schedule_name.indexOf('已通知') == -1" @click="view(sosList.data,scope.$index)" type="primary" size="mini">处理</el-button>
                        <el-button v-else-if="scope.row.schedule_name == '未处理'" @click="view(sosList.data,scope.$index)" type="primary" size="mini">未处理</el-button>
                        <el-button v-else @click="view(sosList.data,scope.$index)" type="primary" size="mini" plain>查看</el-button>

                        <el-button @click="delItem(sosList.data,scope.$index)" type="danger" size="mini">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="sos_pages">
                <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="currentPage"
                :page-size= 20
                :page-sizes=[5,10,20,30,50,100]
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="sosList.total">
                </el-pagination>
            </div>
        </div>

            <!-- 查看处理列表     -->
            <el-dialog class="dialogDIv" width="40%" title="" :visible.sync="dialogDiv">
                <div class="dialoBox" v-if="haveInformed">
                    <div class="dialoTitle">
                        <div>SOS键求救处理</div>
                        <div @click="dialogDiv = false">X</div>
                    </div>
                    <div class="dialoContent">
                        <div>
                            <div>处理人：</div>
                            <div><el-input disabled v-model="handle_name"></el-input></div>
                        </div>
                        <div>
                            <div>用户信息：</div>
                            <div class="congtentInfo">
                                <div class="congtentInfo-one">
                                    <div>
                                        <div>用户姓名</div>
                                        <div>用户账号</div>
                                        <div>性别</div>
                                        <div>出生日期</div>
                                        <div>职业</div>
                                        <div>导游证号</div>
                                        <div>隶属公司</div>
                                        <div>绑定设备编号</div>
                                        <div>当前位置</div>
                                        <div>求救时间</div>
                                    </div>
                                    <div>
                                        <div>{{sosInfo.name}}</div>
                                        <div>{{sosInfo.phone}}</div>
                                        <div>{{sosInfo.sex == 1 ? '女' : '男'}}</div>
                                        <div>{{$base.tampToTime(sosInfo.age,2)}}</div>
                                        <div>{{sosInfo.occupation}}</div>
                                        <div>{{sosInfo.guide_no == '' || sosInfo.guide_no ==  null ? '---': sosInfo.guide_no}}</div>
                                        <div>{{sosInfo.company == '' || sosInfo.company == null ? '---': sosInfo.company}}</div>
                                        <div>{{sosInfo.rss_speak_num}}</div>
                                        <div>具体位置信息<img class="map"  @click="addr(sosInfo.rss_lon, sosInfo.rss_lat)" src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/consult_map.png" alt=""></div>
                                        <div>{{$base.tampToTime(sosInfo.create_date)}}</div>
                                    </div>
                                </div>
                                <div class="congtentInfo-one-flag">
                                    <div>电话确认进程</div>
                                    <div>
                                        <div class="flag-one">
                                            <el-radio v-model="sosInfo.confirm" disabled :label="0">未确认</el-radio>
                                            <el-radio v-model="sosInfo.confirm" disabled :label="1">已确认</el-radio>
                                        </div>
                                        <div v-if="sosInfo.confirm != 0" class="flag-one-box">
                                            <div>
                                                <div :class="{'bg-f':sosInfo.operate == 0}">误操作</div>
                                                <div :class="{'bg-f':sosInfo.operate == 1}">危险事故</div>
                                                <div :class="{'bg-f':sosInfo.operate == 2}">电话无法接通</div>
                                            </div>
                                            <div>
                                                <el-input v-model="sosInfo.schedule_name" disabled placeholder="详情情况备注..." type="textarea"></el-input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div>紧急联系人：</div>
                            <div class="congtentInfo">
                                <div class="congtentInfo-one">
                                    <div>
                                        <div>姓名</div>
                                        <div>称呼</div>
                                        <div>联系方式</div>
                                    </div>
                                    <div>
                                        <div>{{sosInfo.rss_name == '' || sosInfo.rss_name ==  null ? '---': sosInfo.rss_name}}</div>
                                        <div>{{sosInfo.rss_alias == '' || sosInfo.rss_alias ==  null ? '---': sosInfo.rss_alias}}</div>
                                        <div>{{sosInfo.rss_phone == '' || sosInfo.rss_phone ==  null ? '---': sosInfo.rss_phone}}</div>
                                    </div>
                                </div>
                                <div class="congtentInfo-one-flag">
                                    <div>&nbsp;&nbsp;&nbsp;&nbsp;通知结果</div>
                                    <div>
                                        <div class="flag-one">
                                            <el-radio v-model="sosInfo.inform" disabled :label="0">未通知</el-radio>
                                            <el-radio v-model="sosInfo.inform" disabled :label="1">已通知</el-radio>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <div class="dialoBox" v-else>
                    <div class="dialoTitle">
                        <div>SOS键求救处理</div>
                        <div @click="dialogDiv = false">X</div>
                    </div>
                    <div class="dialoContent">
                        <div>
                            <div>处理人：</div>
                            <div><el-input disabled v-model="handle_name"></el-input></div>
                        </div>
                        <div>
                            <div>用户信息：</div>
                            <div class="congtentInfo">
                                <div class="congtentInfo-one">
                                    <div>
                                        <div>用户姓名</div>
                                        <div>用户账号</div>
                                        <div>性别</div>
                                        <div>出生日期</div>
                                        <div>职业</div>
                                        <div>导游证号</div>
                                        <div>隶属公司</div>
                                        <div>绑定设备编号</div>
                                        <div>当前位置</div>
                                        <div>求救时间</div>
                                    </div>
                                    <div>
                                        <div>{{sosInfo.name}}</div>
                                        <div>{{sosInfo.phone}}</div>
                                        <div>{{sosInfo.sex == 1 ? '女' : '男'}}</div>
                                        <div>{{$base.tampToTime(sosInfo.age,2)}}</div>
                                        <div>{{sosInfo.occupation}}</div>
                                        <div>{{sosInfo.guide_no == '' || sosInfo.guide_no ==  null ? '---': sosInfo.guide_no}}</div>
                                        <div>{{sosInfo.company == '' || sosInfo.company == null ? '---': sosInfo.company}}</div>
                                        <div>{{sosInfo.rss_speak_num}}</div>
                                        <div>具体位置信息<img class="map"  @click="addr(sosInfo.rss_lon, sosInfo.rss_lat)" src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/consult_map.png" alt=""></div>
                                        <div>{{$base.tampToTime(sosInfo.create_date)}}</div>
                                    </div>
                                </div>
                                <div class="congtentInfo-one-flag">
                                    <div>电话确认进程</div>
                                    <div>
                                        <div class="flag-one">
                                            <el-radio v-model="sosInfo.confirm" :disabled="sosInfo.confirm == 1" :label="0">未确认</el-radio>
                                            <el-radio v-model="sosInfo.confirm" :label="1">已确认</el-radio>
                                        </div>
                                        <div v-if="sosInfo.confirm != 0" class="flag-one-box">
                                            <div>
                                                <div @click="sosInfo.operate=0,nextT=1,confirmFlg=false" :class="{'bg-f':sosInfo.operate == 0}">误操作</div>
                                                <div @click="sosInfo.operate=1,nextT=0" :class="{'bg-f':sosInfo.operate == 1}">危险事故</div>
                                                <div @click="sosInfo.operate=2,nextT=0" :class="{'bg-f':sosInfo.operate == 2}">电话无法接通</div>
                                            </div>
                                            <div>
                                                <el-input v-model="sosInfo.content" :disabled="confirmFlg && sosInfo.operate != 0" placeholder="详情情况备注..." type="textarea"></el-input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="confirmFlg && sosInfo.operate != 0">
                            <div>紧急联系人：</div>
                            <div class="congtentInfo">
                                <div class="congtentInfo-one">
                                    <div>
                                        <div>姓名</div>
                                        <div>称呼</div>
                                        <div>联系方式</div>
                                    </div>
                                    <div>
                                        <div>{{sosInfo.rss_name == '' || sosInfo.rss_name ==  null ? '---': sosInfo.rss_name}}</div>
                                        <div>{{sosInfo.rss_alias == '' || sosInfo.rss_alias ==  null ? '---': sosInfo.rss_alias}}</div>
                                        <div>{{sosInfo.rss_phone == '' || sosInfo.rss_phone ==  null ? '---': sosInfo.rss_phone}}</div>
                                    </div>
                                </div>
                                <div class="congtentInfo-one-flag">
                                    <div>&nbsp;&nbsp;&nbsp;&nbsp;通知结果</div>
                                    <div>
                                        <div class="flag-one">
                                            <el-radio v-model="sosInfo.inform" :label="0">未通知</el-radio>
                                            <el-radio v-model="sosInfo.inform" :label="1">已通知</el-radio>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="info-btn">
                            <el-button @click="sosConfirm(sosInfo.rss_id, sosInfo.confirm, sosInfo.operate, sosInfo.content),dialogDiv=false"  v-if="nextT == 1 && sosInfo.confirm == 1 && sosInfo.operate == 0" type="primary">完成</el-button>
                            <el-button @click="sosInform(sosInfo.rss_id, sosInfo.inform),dialogDiv=false" v-if="nextT == 0 && sosInfo.confirm == 1 && sosInfo.inform == 1 && sosInfo.operate != 0  && confirmFlg" type="primary">完成</el-button>
                            <button @click="sosConfirm(sosInfo.rss_id, sosInfo.confirm, sosInfo.operate, sosInfo.content), confirmFlg = !confirmFlg" v-if="nextT == 0 && sosInfo.operate != 0 && sosInfo.confirm == 1 && !confirmFlg" class="next">下一步</button>
                        </div>
                    </div>
                </div>
            </el-dialog>
            <el-dialog
            class="dialogDIv"
            width="0"
            align='center'
            :visible.sync="dialogDiv1"
            append-to-body>
                <div class="dialoBox dialoSos">
                    <div class="dialoTitle">
                        <div>求救用户地图定位</div>
                        <div @click="dialogDiv1 = false">X</div>
                    </div>
                    <div class="dialoSosBox map" id="allmap">
                        
                    </div>
                </div>
            </el-dialog>
    </div>
</template>

<script>
import Loading from './../../../loading/loading'
export default {
    data() {
        return{
            access_token:'',
            infrom: '',
            reSosData:{
                name: '',               //昵称
                sex: -1,                //性别
                occupation: '',         //职业
                speak_num: '',          //设备编号
                date: '',               //求救时间
                handle_schedule: '',    //处理进度
            },
            sosOccupation: {},          //职业类别
            sosList: {},
            sexFlags: [{name:'全部',id:-1},{name:'男',id:0},{name:'女',id:1}],
            schedule: {},                //进度类别
            currentPage: 1,
            pagesize: 20,
            dialogDiv: false,
            dialogDiv1: false,
            sosInfo: {},
            nextT: 0,
            handle_name: '',            //处理人
            haveInformed:false,         //是否通知
            confirmFlg: false,          //是否确认
            confirmContent: '',         //电话确认备注
            rightW: '',
            tableHeihgt: 'auto',
            loadingType: true,
        }
    },
    created() {
        let _that = this 
        this.access_token = localStorage.getItem('accessToken')
        if(this.access_token != null){
            this.access_token = JSON.parse(this.access_token)
            this.schedulesList()    //进度列表
            this.getSosList()
            //获取个人信息
            this.infrom = JSON.parse(localStorage.getItem('informData'));
            // console.log(this.infrom)
        }else{
            _that.$message({
                message: '登录已失效，请重新登录！',
                type: 'error',
                content: true
            })
            localStorage.clear();
            _that.$router.replace({
                path: '/'
            })
        }
        let flg = localStorage.getItem('leftW');
        if(flg == 'true'){
            var wid = 180;
        }else {
            var wid = 60;
        }
        if(window.innerWidth<=1200){
            this.rightW = (1200 - wid) +'px';
        }else if(window.innerWidth>1920){
            this.rightW = (1920 - wid) +'px';
        }
        else{
            this.rightW = (window.innerWidth - wid)+'px';
        }
        window.onresize = ()=>{
            let flg = localStorage.getItem('leftW');
            if(flg == 'true'){
                var wid = 180;
            }else {
                var wid = 60;
            }
            if(window.innerWidth<=1200){
                this.rightW = (1200 - wid) +'px';
                setTimeout(() => {
                    this.tableHeihgt = window.innerHeight - $('.sos_search').height() - 175;
                }, 0);
            }else if(window.innerWidth>1920){
                this.rightW = (1920 - wid) +'px';
                setTimeout(() => {
                    this.tableHeihgt = window.innerHeight - $('.sos_search').height() - 155;
                }, 0);
            }
            else{
                this.rightW = (window.innerWidth - wid)+'px';
                setTimeout(() => {
                    this.tableHeihgt = window.innerHeight - $('.sos_search').height() - 155;
                }, 0);
            }
        }
        window.addEventListener('keydown',this.EventEnter);
    },
    components: {
        Loading
    },
    props:[
        "rightT"
    ],
    watch: {
        'rightT'() {
            let ww
            if(window.innerWidth<=1200){
                ww = 1200
            }else if(window.innerWidth>1920){
                ww = 1920
            }else {
                ww = window.innerWidth
            }
            if(this.rightT){
                this.rightW = (ww-180)+'px'
            }else {
                this.rightW = (ww-60)+'px'
            }
        },
        
    },
    beforeRouteLeave(to, from, next){
        window.removeEventListener('keydown',this.EventEnter);
        next();
    },
    methods: {
        EventEnter(e) {
            const that = this;
            let ev = document.all ? window.event : e;
            if(ev.keyCode === 13) {
                that.GetSearchList();
            }
        },
        GetSearchList() {
            this.currentPage = 1;
            this.getSosList();
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 === 1) {
            return 'warning-row';
            }
            return '';
        },
        handleCurrentChange(page) {
            this.currentPage = page;
            this.getSosList() 
        },
        handleSizeChange(pagesize) {
            this.pagesize = pagesize;
            this.getSosList()
        },
        //清空条件
        searchClear() {
            this.reSosData = {
                name: '', 
                sex: -1, 
                occupation: '',  
                speak_num: '',  
                date: '',
                handle_schedule: ''
            }
        },
        //处理进度列表
        schedulesList() {
            const that = this
            that.$http({
                url: that.urlHost+'/man/sos/schedules',
                method: 'post',
                params: {
                    access_token: that.access_token
                }
            })
            .then((res)=>{
                if(res.data.success === "00000000"){
                    // console.log(res.data)
                    that.schedule = res.data.obj
                    that.schedule.unshift({
                        id: '',
                        name: '全部',
                        val: ''
                    })
                }else{
                    that.$base.err(res,that)
                }
            })
            .catch((err)=> {
                console.log(err)
            })
        },
        //sos列表
        getSosList() {
            const that = this
            this.loadingType = true
            this.$forceUpdate()
            this.$http({
                url: this.urlHost+'/man/sos/list',
                method: 'post',
                params: {
                    access_token: this.access_token,
                    phone: this.reSosData.name,
                    sex: this.reSosData.sex,
                    occupation: this.reSosData.occupation,
                    speak_num: this.reSosData.speak_num,
                    date: this.reSosData.date,
                    handle_schedule: this.reSosData.handle_schedule,
                    page: this.currentPage,
                    rows: this.pagesize
                },
                timeout: 10000
            })
            .then((res)=>{
                this.loadingType = false
                if(res.data.success === "00000000"){
                    this.sosList = res.data.obj
                    for(let i in this.sosList.data){
                        this.sosList.data[i].sex = this.sosList.data[i].sex == 1 ? '女' : '男'
                        this.sosList.data[i].guide_no = this.sosList.data[i].guide_no === '' || this.sosList.data[i].guide_no === null ? '---' : this.sosList.data[i].guide_no
                        this.sosList.data[i].company = this.sosList.data[i].company === '' || this.sosList.data[i].company === null ? '---' : this.sosList.data[i].company
                        this.sosList.data[i].rss_phone = this.sosList.data[i].rss_phone === '' || this.sosList.data[i].rss_phone === null ? '---' : this.sosList.data[i].rss_phone
                        this.sosList.data[i].age = this.$base.tampToTime(this.sosList.data[i].age, 2)
                        this.sosList.data[i].create_date = this.$base.tampToTime(this.sosList.data[i].create_date)
                        this.sosList.data[i].schedule_name = this.$base.ToN(this.sosList.data[i].schedule_name)
                        // console.log(this.sosList.data[i].rss_lat)
                    }
                    this.tableHeihgt = window.innerHeight - $('.sos_search').height() - 155
                }else{
                    that.$base.err(res,that)
                }
            })
            .catch((err)=> {
                this.loadingType = false
                this.$message.error("网络异常！")
            })
        },
        //删除
        delItem(data,index) {
            let _that = this
            let id = data[index].rss_id
            _that.$confirm('是否删除？','提示')
            .then(()=>{
                _that.$http({
                    url: _that.urlHost + '/man/sos/del',
                    method: 'post',
                    params: {
                        access_token: _that.access_token,
                        id: id
                    }
                })
                .then((res)=>{
                    if(res.data.success === '00000000'){
                        _that.$message({
                            message: '已删除！',
                            type: 'success',
                            center: true
                        })
                        data.splice(index,1)
                    }else{
                        _that.$base.err(res,_that)
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
            })
            .catch(()=>{

            })
        },
        //查看、处理列表
        view(data, index) {
            const _that = this
            let id = data[index].rss_id
            this.handle_name = data[index].handle_name == null || data[index].handle_name == "" ? this.infrom.access_name : data[index].handle_name
            _that.$http({
                url: _that.urlHost + '/man/sos/info',
                method: 'post',
                params: {
                    access_token: _that.access_token,
                    id: id
                }
            })
            .then((res)=>{
                if(res.data.success === '00000000'){
                     _that.dialogDiv = true
                    this.sosInfo = res.data.obj
                    // console.log(this.sosInfo)
                    
                    if(this.sosInfo.operate == 0){
                        this.nextT = 1
                    }else {
                        this.nextT = 0
                    }
                    this.confirmFlg = this.sosInfo.confirm
                    if(this.sosInfo.confirm == 0 || (this.sosInfo.confirm == 1 && this.sosInfo.operate == 0)){
                        this.confirmFlg = false
                    }else{
                        this.confirmFlg = true
                    }
                    this.haveInformed = this.sosInfo.inform
                    if(this.haveInformed == 1){
                        this.haveInformed = true
                    }else {
                        this.haveInformed = false
                    }
                    this.getSosList()
                }else{
                    _that.$base.err(res,_that)
                }
            })
            .catch((err)=>{
                console.log(err)
            })

        },
        nextBtn() {
            // this.nextT = 1
        },
        // sos确认处理
        /**
         * id~~~~~~~~ uuid
         * status~~~~ 0未确认1已确认
         * operate~~~ 0误操作1危险事故2电话无法接通
         * content~~~ 备注
         */
        sosConfirm(id, status, operate, content) {
            const that = this
            this.$http({
                url: this.urlHost+'/man/sos/confirm',
                method: 'post',
                params: {
                    access_token: this.access_token,
                    id,
                    status,
                    operate,
                    content
                }
            })
            .then((res)=> {
                if(res.data.success === "00000000"){
                    // console.log(res.data.obj)
                    this.sosConfirmData = res.data.obj
                    this.$message({
                        message: '操作成功！',
                        type: 'success'
                    })
                    this.getSosList()
                }else{
                    that.$base.err(res,that)
                }
            })
            .catch((err)=> {
                console.log(err)
            })
        },
        //sos通知处理
        sosInform(id, status) {
            const that = this
            this.$http({
                url: this.urlHost+'/man/sos/inform',
                method: 'post',
                params: {
                    access_token: this.access_token,
                    id,
                    status
                }
            })
            .then((res)=> {
                if(res.data.success === "00000000"){
                    // console.log(res.data.obj)
                    this.sosInformData = res.data.obj
                    this.$message({
                        message: '操作成功！',
                        type: 'success'
                    })
                    this.getSosList()
                }else{
                    that.$base.err(res,that)
                }
            })
            .catch((err)=> {
                console.log(err)
            })
        },
        //显示具体位置
        addr(lon, lat) {
            this.dialogDiv1 = true
            // lon = 121.414054
            // lat = 31.178362
            setTimeout(() => {
                this.GetMap(lon,lat)
            }, 100);
            // alert(lon, lat)
            
        },
        GetMap(lon, lat){
            const that = this
            var map = new BMap.Map("allmap");
            var marker = new BMap.Marker(new BMap.Point(lon, lat));
            var gc = new BMap.Geocoder(); 
            var point = new BMap.Point(lon, lat);
            // console.log(point)
            gc.getLocation(point, function(rs) {
                var addComp = rs.addressComponents;
                var mapAddress = addComp.province+addComp.city + addComp.district
                + addComp.street + addComp.streetNumber;
            
                map.centerAndZoom(new BMap.Point(lon, lat), 15);
                map.addControl(new BMap.NavigationControl());
                map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                map.addOverlay(marker);
                var str = 
                        '      <div class="sosCard-box" style="width:350px;height:21px;over-flow:hidden;">'+
                        '              <div style="text-align:center">具体位置：'+mapAddress+'</div>'+
                        '      </div>'
                var infoWindow = new BMap.InfoWindow(str);
                that.laodingType = false
                marker.addEventListener("click", function () {
                    this.openInfoWindow(infoWindow);
                });
                marker.openInfoWindow(infoWindow);
            })
        }
    }
}
</script>

<style>
    .sos{
        position: relative;
        height:100%;
        overflow: auto;
        /* overflow: hidden; */
    }
    .sos_top{
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        color: #999;
        border-bottom: 1px solid #aaa;
    }
    .sos_top span{
        font-size: 16px;
    }
    .sos_box{
        position: relative;
        padding-left: 20px;
        height: calc(100% - 45px);
        overflow-y: hidden;
        display: flex !important;
        flex-direction: column;
    }
    .sos_box .sos_search{
        padding-top: 15px;
        display: flex;
    }
    .sos_box .sos_search>div{
        /* flex: 1; */
        display: flex;
        flex-wrap: wrap;
        font-size: 14px;
    }
    .sos_box .sos_search>div>div{
        margin-right: 20px;
        padding-bottom: 15px;
        display: flex;
        align-items: center;
    }
    .sos_box .sos_search>div>div>span{
        white-space: nowrap;
    }
    .sos_box .sos_search>div>div .el-input__suffix-inner i,.sos_box .sos_search>div>div  .el-input__prefix i{
        height: 30px;
        line-height: 30px;
    }
    .sos_box .sos_search>div:nth-child(1) input{
        height: 30px;
        max-width: 150px;
    }
    .sos_box .sos_search>div:nth-child(1) .el-date-editor.el-input, .el-date-editor.el-input__inner{
        max-width: 150px;
        height: 30px;
        line-height: 30px;
    }
    .sos_box .sos_box .searchBtn{
        padding-bottom: 15px;
    }
    .sos_box .sos_table{
        position: relative;
        /* width: calc(100% - 5px); */
        width: 100%;
        overflow: auto;
        flex: 1;
    }
    .sos_table .el-table--mini td, .sos_table .el-table--mini th{
        padding: 5px 0;
    }
    .sos_table .el-table{
        border: 1px solid #ccc;
    }
    .sos_box .sos_table .el-table th{
        background: #E2EFF8 !important;
        color: #000 !important;
        border-left: 1px solid #ccc;
        border-bottom: 1px solid #ccc !important;
    }
    .sos_box .sos_table .el-table th:first-child{
        border-left: 0;
    }
    
    .sos_box .sos_table .el-table td:first-child{
        border-left: 0!important;
    }
    .sos_box .sos_table .el-table td{
        border:1px solid #ccc !important;
        border-right: 0 !important;
        border-top: 0 !important;
    }
    .sos_box .sos_table .el-table .warning-row {
        background: #F4F9FC;
    }
    .el-pagination__total{
        display: none !important;
    }
    .el-pagination{
        padding: 0;
        margin: 0;
    }
    .el-pagination .el-select .el-input{
        margin: 0;
    }
    .sos_pages{
        z-index: 1;
        position: relative;
        padding: 5px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        background-color: #fff;
        margin: -1px 0 0 .5px;
    }
    .sos_bottom{
        text-align: right;
        padding: 20px 30px;
    }
    .el-table__row .cell {
        white-space:pre !important;
    }
    .el-table__expand-icon{
        color: #3A9CF7 !important;
        font-size: 15px;
    }
    .apply-num{
        color: #3A9CF7;
        cursor: pointer;
    }
    .dialog-search{
        display: flex;
        margin: 20px
    }
    .dialog-search>div{
        display: flex;
        align-items: center;
        margin-right: 20px;
    }
    .dialog-search span{
        width: 60px;
    }
    .dialog-search>div:last-child>span{
        width: 120px;
    }
    .dialogBtn{
        margin: 20px;
    }
    .sos_table .el-dialog, .dialogDIv .el-dialog{
        background: rgba(0, 0, 0, 0) !important;
        height: 100%;
    }
    .sos_table .el-dialog__body, .dialogDIv .el-dialog__body{
        padding: 0 !important;
    }
    .sos_table .el-dialog__header, .dialogDIv .el-dialog__header{
        display: none;
    }
    .dialoBox{
        font-size: 16px;
        background: #fff;
        width: 800px;
    }
    .dialoTitle{
        display: flex;
        justify-content: space-between;
        background: #3A9CF7;
        color: #fff;
        padding: 10px 20px;
    }
    .dialoTitle>div:nth-child(2):hover{ 
        color: #ddd;
        cursor: pointer;
    }
    .dialoContent{
        color: #333;
        padding: 10px 20px;
    }
    .dialoContent>div{
        display: flex;
        margin-top: 20px;
    }
    .dialoContent>div>div:nth-child(1){
        width: 100px;
        margin-top: 5px;
    }
    .dialoContent>div>div:nth-child(2){
        flex: 1;
    }
    .congtentInfo-one{
        display: flex;
        border: 1px solid #ccc;
    }
    .congtentInfo-one-flag{
        background: #f9f9f9;
        display: flex;
        border: 1px solid #ccc;
    }
    .congtentInfo-one>div{
        padding: 30px 50px;
    }
    .congtentInfo-one>div:nth-child(2)>div{
        display: flex;
        align-items: center;
    }
    .congtentInfo-one-flag>div:nth-child(1){
        padding: 10px 50px;
        display: flex;
        align-items: center;
    }
    .congtentInfo-one>div:nth-child(1),.congtentInfo-one-flag>div:nth-child(1){
        border-right: 1px solid #ccc;
        text-align: right;

        width: 100px;
    }
    .congtentInfo-one-flag>div:nth-child(2){
        flex: 1;
    }
    .congtentInfo-one>div>div{
        margin-top: 10px;
    }
    .flag-one{
        margin: 10px 50px;
    }
    .flag-one-box>div:nth-child(1){
        display: flex;
        padding: 0;
    }
    .flag-one-box>div:nth-child(1)>div{
        width: 33.3%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid #ccc;
        border-left: 0;
        cursor: pointer;
    }
    .flag-one-box>div:nth-child(1)>div:nth-child(3){
        border-right: 0;
    }
    .flag-one-box>div:nth-child(1)>div:hover{
        color: #555;
        background: #fff;
    }
    .flag-one-box textarea{
        border: 0;
        resize: none;
        height: 130px;
        background: #f9f9f9;
        padding-top: 10px;
    }
    .info-btn button{
        margin: 0 auto;
        
    }
    .next{
        outline: none;
        padding: 8px 50px;
        border: 1px solid #3A9CF7;
        color: #3A9CF7;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
    }
    .next:hover{
        background: #f9f9f9;
    }
    .info-btn .el-button{
        padding: 8px 50px;
    }
    .bg-f{
        background: #fff;
        color: #3A9CF7 !important;
    }
    .map{
        margin-left: 20px;
        cursor: pointer;
    }
    .path{
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
    }
    .path:hover{
        opacity: .8;
    }
    .col_active{
        color: #3A9CF7;
    }
    .dialoSos{
        position: absolute;
        left: -400px;
    }
    .dialoSos .map{
        margin-left: 0;
        border: 2px solid #fff;
    }
    .dialoSosBox{
        height: 596px;
        width: 796px;
    }
    
    .BMap_cpyCtrl span,.anchorBL{
      display: none !important;
    }
    .col_red{
        color: red;
    }
    .col_green{
        color: green;
    }
</style>
