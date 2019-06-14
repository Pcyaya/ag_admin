<template>
    <div class="personnel">
        <Loading v-if="loading" msg="加载中..."></Loading>
        <div class="personnel_top">
            <div><img src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png" alt=""> 当前位置：系统设置 > <span><el-button type="text">部门管理</el-button></span></div>
        </div>
        <div class="box">
            <div class="box-left">
                <div class="box-title">
                    <div>组织结构</div>
                    <div><el-button @click="addView" size="mini" type="primary"><i class="el-icon-plus"></i> 添加部门</el-button></div>
                </div>
                <div class="tree-box">
                    <div class="zTreeDemoBackground left">
                        <ul id="treeDemo" class="ztree"></ul>
                    </div>
                </div>
            </div>
            <div class="box-right">
                <div class="box-title">
                    <div class="box-title-nav">
                        <div @click="perFlg = 0" :class="{'col-active': perFlg === 0,'cur':perFlg === 1}">管理人员（{{personnelList == null? 0:personnelList.length}}）</div>
                        <i class="el-icon-minus"></i>
                        <div @click="perFlg = 1" :class="{'col-active': perFlg === 1,'cur':perFlg === 0}">部门权限</div>
                    </div>
                    <div class="box-title-add">
                        <el-button  @click="addPersonView"><i class="el-icon-plus"></i>添加部门人员</el-button>
                    </div>
                </div>
                <div class="box-content" :style="{'width':rightW}">
                    <div class="box-table" :class="{'showDiv':perFlg === 0,'noneDiv':perFlg === 1}">
                        
                        <el-table
                            :data="personnelList"
                            stripe
                            border
                            size="mini"
                            :row-class-name="tableRowClassName">
                            <el-table-column
                            align="center"
                            type="selection">
                            </el-table-column>
                            <el-table-column
                            prop="au_no"
                            align="center"
                            width="120"
                            label="工号">
                            </el-table-column>
                            <el-table-column
                            prop="au_name"
                            width="120"
                            align="center"
                            label="姓名">
                            </el-table-column>
                            <el-table-column
                            align="center"
                            label="部门">
                                <template slot-scope="scope">
                                    <div :title="scope.row.departs" style="max-height:50px">{{scope.row.departs}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="au_position"
                            align="center"
                            width="120"
                            label="职位">
                            </el-table-column>
                            <el-table-column
                            prop="au_phone"
                            align="center"
                            width="120"
                            label="手机号">
                            </el-table-column>
                            <el-table-column
                            prop="au_email"
                            align="center"
                            label="邮箱">
                            </el-table-column>
                            <el-table-column 
                            align="center"
                            fixed="right"
                            label="操作"
                            width="80">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(personnelList , scope.$index, 1)">移除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                    </div>
                    <div class="box-tree" :class="{'showDiv':perFlg === 1,'noneDiv':perFlg === 0}">
                        <div>
                            <div>部门名称：</div>
                            <div>{{clickInfo.name}}</div>
                        </div>
                        <div>
                            <div>部门权限：</div>
                            <div id="rightsTree" class="ztree"></div>
                        </div>
                        <div>
                            <el-button size="mini" type="primary" @click="GetDrissue(rightsList)">保存</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="dialogAll">
            <!-- 添加部门 -->
            <el-dialog :visible.sync="dialogFlg.add" width="10%">
                <div class="dialogAddBox">
                    <div class="dialogTitle">
                        <div>添加部门</div>
                        <div @click="dialogFlg.add = false" class="cur"><i class="el-icon-close"></i></div>
                    </div>
                    <div class="dialogAddContent">
                        <div>
                            <div>部门名称：</div>
                            <div><el-input v-model="reAddData.name" placeholder="请输入部门名称" maxlength="10"></el-input></div>
                        </div>
                        <div>
                            <div>选择父级：</div>
                            <div id="addTreeDemo" class="ztree"></div>
                        </div>
                        <div>
                            <el-button @click="GetIssue" type="primary">完成</el-button>
                        </div>
                    </div>
                </div>
            </el-dialog>
            <!-- 添加部门人员 -->
            <el-dialog :visible.sync="dialogFlg.addPerson" width="70%">
                <div class="dialogAddPersonBox">
                    <div class="dialogTitle">
                        <div>添加部门人员</div>
                        <div @click="dialogFlg.addPerson = false" class="cur"><i class="el-icon-close"></i></div>
                    </div>
                    <div class="dialogAddContent">
                        <div>
                            <el-table
                                :data="personnelUList"
                                stripe
                                border
                                style="width: 100%;"
                                :row-class-name="tableRowClassName">
                                <el-table-column
                                prop="au_no"
                                align="center"
                                width="120"
                                label="工号">
                                </el-table-column>
                                <el-table-column
                                prop="au_name"
                                width="120"
                                align="center"
                                label="姓名">
                                </el-table-column>
                                <el-table-column
                                align="center"
                                label="部门">
                                    <template slot-scope="scope">
                                        <div :title="scope.row.departs" style="max-height:50px">{{scope.row.departs}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="au_position"
                                align="center"
                                width="120"
                                label="职位">
                                </el-table-column>
                                <el-table-column
                                prop="au_phone"
                                align="center"
                                width="120"
                                label="手机号">
                                </el-table-column>
                                <el-table-column
                                prop="au_email"
                                align="center"
                                label="邮箱">
                                </el-table-column>
                                <el-table-column 
                                align="center"
                                label="操作">
                                    <template slot-scope="scope">
                                        <el-button
                                        size="mini"
                                        type="primary"
                                        @click="handleDelete(personnelUList , scope.$index, 0)">添加</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import './../../../../plugins/jquery-1.9.1.min.js'
import './../../../../plugins/zTree/css/zTreeStyle/zTreeStyle.css'
import './../../../../plugins/zTree/js/jquery.ztree.all'
import Loading from './../../../loading/loading'
export default {
    data(){
        return {
            departsData:[], //部门列表
            personnelList: [], //管理人员列表
            personnelUList: [],
            addData:[], //添加部门列表
            reAddData:{ //添加部门信息
                name: '',
                pid: ''
            },
            clickInfo: {},
            rightsTreeList: {},     //部门权限tree列表
            uListData:{},           //部门员工列表
            rightsList:[],
            loadingType: true,
            dialogFlg: {
                add: false,
                addPerson: false,
            },
            perFlg:0,
            setting:{
                data: {
                    simpleData: {
                        enable: true,
                    }
                },
               
                edit: {
                    enable: true,
                    editNameSelectAll: true,
                    showRenameBtn: false,
                    renameTitle: "编辑",
                    showRemoveBtn: true,
                    removeTitle: "删除",
                    drag: {
                        isCopy: false,
                        isMove: false
                    },
                },
                view:{
                    showLine: false,
                    showIcon: false,
                },
                callback: {
                    beforeClick: this.beforeClick,
                    onClick: this.zTreeOnClick,
                    onCheck: this.zTreeOnCheck,
                    beforeRename: this.setRenameBtn,
                    beforeRemove: this.setRemove
                }
            },
            addSetting:{
                check: {
                    enable: true,
                    nocheckInherit: false,
                    chkStyle: "radio",  //单选框
                    radioType: "all"   //对所有节点设置单选
                },
                view: {
                    showLine: false,
                    showIcon: false,
                    // dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true,
                    },
                },
                callback: {
                    beforeClick: this.addbeforeClick,
                    onClick: this.addzTreeOnClick,
                    onCheck: this.addzTreeOnCheck,
                }
            },
            rightsSetting: {
                check: {
                    enable: true,
                    nocheckInherit: false
                },
                view: {
                    showLine: false,
                    showIcon: false,
                    // dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true,
                    },
                },
                callback: {
                    beforeClick: this.rightsbeforeClick,
                    onClick: this.rightsTreeOnClick,
                    onCheck: this.rightsTreeOnCheck,
                }
            },
            rightW: '',
            loading: false
            
        }
    },
    created() {
        let _that = this
        this.access_token = localStorage.getItem('accessToken')
        if(this.access_token != null){
            this.access_token = JSON.parse(this.access_token)
            this.Getdeparts()
            //获取个人信息
            this.infrom = JSON.parse(localStorage.getItem('informData'));
        }else{
            _that.$message({
                message: '登录已失效，请重新登录！',
                type: 'error',
                content: true
            })
            setTimeout(()=>{
                localStorage.clear();
                _that.$router.replace({
                    path: '/'
                })
            },300)
        }
        let flg = localStorage.getItem('leftW');
        if(flg == 'true'){
            var wid = 180;
        }else {
            var wid = 60;
        }
        if(window.innerWidth<=1200){
            this.rightW = (1200 - wid-270) +'px';
        }else if(window.innerWidth>1920){
            this.rightW = (1920 - wid-270) +'px';
        }
        else{
            this.rightW = (window.innerWidth - wid-270)+'px';
        }
        window.onresize = ()=>{
            let flg = localStorage.getItem('leftW');
            if(flg == 'true'){
                var wid = 180;
            }else {
                var wid = 60;
            }
            if(window.innerWidth<=1200){
                this.rightW = (1200 - wid-270) +'px';
            }else if(window.innerWidth>1920){
                this.rightW = (1920 - wid-270) +'px';
            }
            else{
                this.rightW = (window.innerWidth - wid-270)+'px';
            }
        }
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
                this.rightW = (ww-180-270)+'px'
            }else {
                this.rightW = (ww-60-270)+'px'
            }
        },
    },
    components: {
        Loading
    },
    methods:{
        handleNodeClick(data){
            this.msg = data
            // console.log(data)
        },
        zTreeOnClick(e, id, dom){
            this.clickInfo = dom;
            this.GetRights(this.clickInfo.id);
            this.GetUList(this.clickInfo.id,0)
            this.GetUList(this.clickInfo.id,1)
            localStorage.setItem("treeId",dom.id);
        },
        setRenameBtn(treeId, treeNode) {
            // console.log(treeNode.name, treeNode.id)
        },
        setRemove(treeId, treeNode){
            // console.log(treeNode.name, treeNode.id)
            const that = this;
            var r=confirm("确认是否删除!");
            if (r==true)
            {
                that.$http({
                    url: that.urlHost + '/man/depart/del',
                    method: 'post',
                    params: {
                        access_token: that.access_token,
                        id: treeNode.id
                    }
                })
                .then((res)=>{
                    if(res.data.success === '00000000'){
                        that.$message({
                            message: '已删除！',
                            type: 'success',
                            center: true
                        })
                    }else if(res.data.success === '00100003'){
                        that.$message({
                            message: '登录已失效，请重新登录！',
                            type: 'error',
                            content: true
                        })
                        setTimeout(()=>{
                            localStorage.clear();
                            that.$router.replace({
                                path: '/'
                            })
                        },300)
                    }else{
                        that.$message({
                            message: res.data.msg,
                            type: 'error',
                            content: true
                        })
                    }
                })
                .catch((err)=>{
                    console.log(err)
                    return false
                })
            }
            else
            {
                return false
            }
        },
        //部门tree 列表
        Getdeparts() {
            const that = this
            that.loading = true
            that.$http({
                url: that.urlHost+"/man/depart/departs",
                method: "post",
                params: {
                    "access_token": that.access_token,
                    },
                timeout: 10000
            })
            .then((res)=> {
                that.loading = false
                if(res.data.success === "00000000"){
                    that.departsData = that.getJsonData(res.data.obj);
                    that.addData = that.departsData;
                    $.fn.zTree.init($("#treeDemo"), that.setting, that.departsData);
                    //默认选择第一个 
                    var treeId = localStorage.getItem("treeId");
                    var treeObj = $.fn.zTree.init($("#treeDemo"), that.setting, that.departsData);
                    var treeObj1 = $.fn.zTree.getZTreeObj("treeDemo");
                    var list = treeObj.getNodes();
                    if(treeId == null || that.isJSONData(treeId,treeObj.getNodes())){
                        var node = treeObj.getNodeByParam('id', treeObj.getNodes()[0].id);
                        treeObj.selectNode(treeObj.getNodes()[0]);
                    }else{
                        // console.log(treeObj.getNodes())
                        var node = treeObj.getNodeByParam('id', treeId);
                        that.getJsonNode(treeObj, list, treeId)
                    }
                    treeObj1.setting.callback.onClick(null, "treeDemo", node);//调用事件 
                }else {
                    that.$base.err(res,that)
                }
            })
            .catch((err)=> {
                that.loading = false
                that.$message.error("网络异常！")
            })
        },
        //递归children 空改null 全部展开
        getJsonData(data){
            for(let i=0;i<data.length;i++){
                data[i].open = true;
                data[i].checked = data[i].select_flg;
                if(data[i].children.length === 0){
                    data[i].children = null
                }else {
                    this.getJsonData(data[i].children)
                }
            }
            return data
        },
        isJSONData(id,data){
            for(let i=0;i<data.length;i++){
                if(id === data[i].id){
                    return false
                }else{
                    if(data[i].children != null){
                        this.isJSONData(id, data[i].children)
                    }
                }
            }
            return true
        },
        //--
        getJsonNode(dom, list, id){
            for(let i=0;i<list.length;i++){
                if(id === list[i].id){
                    dom.selectNode(list[i]);
                }else {
                    if(list[i].children != null){
                        this.getJsonNode(dom, list[i].children, id);
                    }
                }
            }
            // return data
        },
        //添加部门
        GetIssue() {
            // console.log(this.reAddData)
            const that = this;
            if($.trim(that.reAddData.name) == ""){
                that.$message.error("部门名称不可为空！");
            }else {
                that.$http({
                    url: that.urlHost+"/man/depart/issue",
                    method: "post",
                    params: {
                        "access_token": that.access_token,
                        "name": that.reAddData.name,
                        "pid": that.reAddData.pid
                        },
                    timeout: 10000
                })
                .then((res)=> {
                    that.loading = false;
                    if(res.data.success === "00000000"){
                        that.$message.success(res.data.msg)
                        that.dialogFlg.add = false
                        that.Getdeparts()
                    }else {
                        that.$base.err(res,that);
                    }
                })
                .catch((err)=> {
                    that.loading = false;
                    that.$message.error('网络异常！');
                })
            }
        },
        //部门权限tree 列表
        GetRights(id) {
            const that = this
            that.loading = true;
            that.$http({
                url: that.urlHost+"/man/depart/rights",
                method: "post",
                params: {
                    "access_token": that.access_token,
                    "id": id
                    },
                timeout: 10000
            })
            .then((res)=> {
                that.loading = false;
                if(res.data.success === "00000000"){
                    that.rightsTreeList = res.data.obj
                    that.rightsTreeList = that.getJsonData(that.rightsTreeList)
                    setTimeout(() => {
                        that.rrr = $.fn.zTree.init($("#rightsTree"), this.rightsSetting, this.rightsTreeList).getNodes(); 
                    }, 0);
                }else {
                    that.$base.err(res,that);
                }
            })
            .catch((err)=> {
                that.loading = false;
                that.$message.error('网络异常！');
            })
        },
        //更改部门权限
        GetDrissue(rights) {
            const that = this
            that.loading = true;
            let id = localStorage.getItem('treeId')
            that.$http({
                url: that.urlHost+"/man/depart/drissue",
                method: "post",
                params: {
                    "access_token": that.access_token,
                    "depart": id,
                    "rights":JSON.stringify(rights)
                    },
                timeout: 10000
            })
            .then((res)=> {
                that.loading = false;
                if(res.data.success === "00000000"){
                    
                }else {
                    that.$base.err(res,that);
                }
            })
            .catch((err)=> {
                that.loading = false;
                that.$message.error('网络异常！');
            })
        },
        //选择权限
        rightsTreeOnCheck(e, treeId, treeNode){
            var treeObj=$.fn.zTree.getZTreeObj("rightsTree"),
            nodes=treeObj.getCheckedNodes(true),
            v="";
            for(var i=0;i<nodes.length;i++){
                v+=nodes[i].id + ",";
            }
            var str = v.substr(0,v.length-1);
            this.rightsList = str.split(',')
        },
        //部门员工列表
        GetUList(id,flg){
            const that = this
            that.$http({
                url: that.urlHost+"/man/depart/ulist",
                method: "post",
                params: {
                    "access_token": that.access_token,
                    "depart": id,
                    "flg":flg,
                    "page": 1,
                    "rows": 100,
                    },
                timeout: 10000
            })
            .then((res)=> {
                that.loading = false;
                if(res.data.success === "00000000"){
                    if(flg === 0){
                        that.personnelList = res.data.obj.data
                    }else {
                        that.personnelUList = res.data.obj.data
                    }
                }else {
                    that.$base.err(res,that);
                }
            })
            .catch((err)=> {
                that.loading = false;
                that.$message.error('网络异常！');
            })
        },
        //移除
        handleDelete(data, index, type) {
            const that = this
            that.$http({
                url: that.urlHost+"/man/depart/uissue",
                method: "post",
                params: {
                    "access_token": that.access_token,
                    "did": that.clickInfo.id,
                    "uid": data[index].au_id,
                    "operate": type
                    },
                timeout: 10000
            })
            .then((res)=> {
                that.loading = false;
                if(res.data.success === "00000000"){
                    that.$message.success(res.data.msg);
                    if(type === 1){
                        // data.splice(index, 1);
                    }
                    
                    that.GetUList(that.clickInfo.id,0)
                    that.GetUList(that.clickInfo.id,1)
                }else {
                    that.$base.err(res,that);
                }
            })
            .catch((err)=> {
                that.loading = false;
                that.$message.error('网络异常！');
            })
        },


        //添加部门
        addView() {
            this.dialogFlg.add = true
            setTimeout(() => {
               $.fn.zTree.init($("#addTreeDemo"), this.addSetting, this.addData); 
            }, 100);
        },
        //添加部门人员
        addPersonView() {
            this.dialogFlg.addPerson = true
        },
        addzTreeOnCheck(e, id, dom){
            this.reAddData.pid = dom.id
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 === 1) {
            return 'warning-row';
            }
            return '';
        }
    }
}
</script>

<style lang="less">
    .personnel{
        position: relative;
        height:100%;
        overflow: auto;
        .personnel_top{
            padding: 0 20px;
            height: 40px;
            line-height: 40px;
            color: #999;
            border-bottom: 1px solid #aaa;
            display: flex;
            justify-content: space-between;
            
        }
        span{
            font-size: 15px;
        }
        .box{
            margin: 20px;
            height: calc(100% - 83px);
            width: calc(100% - 47px);
            background: #f3f3f3;
            box-shadow: 2px -2px 10px 1px #ccc;
            display: flex;
            .box-left{
                min-width: 220px;
                height: 100%;
                background: #fff;
                .box-title{
                    height: 50px;
                    line-height: 50px;
                    padding: 0 20px;
                    border-bottom: 3px solid #f3f3f3;
                    display: flex;
                    justify-content: space-between;
                    >div{
                        font-weight: bold;
                    }
                    >div:nth-child(2){
                        .el-button{
                            padding: 5px 10px;
                            >span{
                                font-size: 14px;
                            }
                        }
                    }
                }
                .tree-box{
                    height: calc(100% - 53px);
                    overflow: auto;
                    .ztree{
                        li{
                            padding-top: 15px;
                            span{
                                font-size: 16px;
                            }
                        }
                        .node_name{
                            margin-right: 10px;
                        }
                        li a.curSelectedNode{
                            background: rgba(0, 0, 0, 0) !important;
                            border: 0 !important;
                            color: #3A9CF7 !important;
                        }
                    }
                }
            }
            .box-right{
                background: #fff;
                margin-left: 7px;
                display: flex;
                flex-flow: column;
                flex: 1;
                .box-title{
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;
                    border-bottom: 3px solid #f3f3f3;
                    .box-title-nav{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 220px;
                        i{
                            font-size: 22px;
                            color: #999;
                            transform: rotate(90deg)
                        }
                    }
                    .box-title-add{
                        .el-button{
                            padding: 5px 20px;
                        }
                    }
                }
                .box-content{
                    height: calc(100% - 53px);
                    overflow: auto;
                    .box-table{
                        .warning-row {
                            background: #F9F9F9;
                        }
                        .el-table thead{
                            color: #333;
                        }
                        .el-button{
                            padding: 5px 10px;
                        }
                    }
                    .box-tree{
                        padding: 20px;
                        >div{
                            margin-bottom: 10px;
                            display: flex;
                            >div:nth-child(1){
                                width: 80px;
                            }
                        }
                        >div:nth-child(2){
                            >div:nth-child(1){
                                margin-top: 10px;
                            }
                        }
                        .ztree{
                            li{
                                margin-top: 10px;
                            }
                        }
                        >div:last-child{
                            margin-top: 50px;
                            display: flex;
                            justify-content: center;
                            .el-button{
                                padding: 5px 30px;
                            }
                        }
                    }
                }
            }
        }
        .dialogAll{
            .dialogAddBox{
                font-size: 16px;
                background: #fff;
                width: 400px;
                .dialogTitle{
                    display: flex;
                    justify-content: space-between;
                    background: #3A9CF7;
                    color: #fff;
                    padding: 10px 20px;
                }
                .dialogAddContent{
                    color: #333;
                    padding: 20px 0 20px 20px;
                    >div{
                        display: flex;
                        padding-bottom: 10px;
                        >span{
                            font-size: 14px;
                            width: 100px;
                            margin-top: 5px;
                        }
                        .el-input__inner{
                            height: 30px;
                            line-height: 30px;
                            width: 200px;
                            margin-left: 10px;
                        }
                    }
                    >div:nth-child(2){
                        min-height: 100px;
                    }
                    >div:last-child{
                        display: flex;
                        justify-content: center;
                        .el-button{
                            padding: 5px 50px;
                        }
                    }
                    #addTreeDemo{
                        max-height: 400px;
                        width: 290px;
                        overflow: auto;
                        li{
                            margin-top: 15px;
                        }
                        .noline_close, .noline_open{
                            margin-right: 5px;
                        }
                        
                    }
                }
            }
            .dialogAddPersonBox{
                font-size: 16px;
                background: #fff;
                width: 100%;
                .dialogTitle{
                    display: flex;
                    justify-content: space-between;
                    background: #3A9CF7;
                    color: #fff;
                    padding: 10px 20px;
                }
            }
            .el-pagination__total{
                display: none !important;
            }
            .el-dialog__header{
                display: none;
            }
            .el-dialog__body{
                padding: 0 !important;
            }
        }
    }
    .ztree li a.curSelectedNode{
        background: rgba(0, 0, 0, 0)!important;
        border: 0!important;
        // color: #3A9CF7;
    }
    a{
        text-decoration: none !important;
    }
    .col-active{
        color: #3A9CF7;
    }
    .showDiv{
        transition: .5s;
        opacity: 1;
    }
    .noneDiv{
        opacity: 0;
        height: 0;
        overflow: hidden;
    }
</style>

