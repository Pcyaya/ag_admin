<template>
    <!-- 菜单设置 -->
    <div class="menu" @click="intName = -1,intChildName = -1">
        <Loading v-if="loading"></Loading>
        <div class="menu_top">
            <div><img src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png" alt=""> 当前位置：系统设置 > <span><el-button type="text">菜单管理</el-button></span></div>
        </div>
        <input v-show="0" type="file" @change="fileChanged" ref="file" multiple="multiple" accept="image/jpg,image/jpeg,image/png,image/bmp">
        <div class="box">
            <div class="">
                <div class="" v-for="(item, index) in menuShows" :key="index">
                    <div class="father">
                        <div class="father-name">
                            <span v-if="item.leaf_flg == 0" class="add" @click="taggleFather(menuShows,index)"  :class="{'cur':item.leaf_flg == 0}">+</span>
                            <span v-else class="add">-</span>
                            <p></p>
                            <img :src="OSSImg+item.icon" alt="">
                            <span class="name" :title="item.name" >{{item.name}}</span>
                            <div v-if="item.type"></div>
                        </div>
                        <div>
                            <el-button @click="editBtn(index, item)" size="mini">编辑 <i :class="{'iconUp': !edit,'iconDown': edit && int == index}" class="el-icon-caret-bottom"></i></el-button>
                            <el-button @click="addBtn(index, item)" size="mini">新建 <i :class="{'iconUp': !addChild,'iconDown': addChild && int == index}" class="el-icon-caret-bottom"></i></el-button>
                        </div>
                        <div class="father-sort">
                            <div>
                                <div>
                                    <el-button type="text" @click="GetSort(item.id, menuShows, index, index - 1 )" size="mini" :disabled="index == 0"><i class="el-icon-sort-up"></i></el-button> 
                                </div>
                                <div>
                                    <el-button type="text" @click="GetSort(item.id, menuShows, index, index + 1 )" size="mini" :disabled="index == menuShows.length-1"><i class="el-icon-sort-down"></i></el-button>
                                </div>
                            </div>
                        </div>
                        <div style="display:flex;align-items: center;">
                            <span>是否生成权限：</span>
                            <el-switch
                            v-model="item.right"
                            @change="GetviewFlg(menuShows, index, item.right, 0)"
                            active-text=""
                            inactive-text="">
                            </el-switch>
                            <!-- <div class="flag-one">
                                <el-radio v-model="item.right_flg" @change="GetviewFlg(menuShows, index, 1)" :label="1">是</el-radio>
                                <el-radio v-model="item.right_flg" @change="GetviewFlg(menuShows, index, 0)" :label="0">否</el-radio>
                            </div> -->
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>是否对所有人开放：</span>
                            <el-switch
                            v-model="item.view"
                            @change="GetviewFlg(menuShows, index, item.view, 1)"
                            active-text=""
                            inactive-text="">
                            </el-switch>
                        </div>
                    </div>
                    <!-- 编辑 -->
                    <div class="overH" :class="{'noneEdit': int != index || edit == false,'showEdit':  edit == true}">
                        <div class="edit">
                            <p v-if=" item.leaf_flg == 0"></p>
                            <div class="edit-box">
                                <div><span>菜单编辑：</span> <el-input v-model="editData.name"></el-input></div>
                                <!-- <div v-if="item.children.length<1"><span>路由编辑：</span> <el-input v-model="editData.url"></el-input></div> -->
                                <div>
                                    <span>是否生成权限：</span>
                                    <div class="flag-one">
                                        <el-radio v-model="editData.right_flg" :label="1">是</el-radio>
                                        <el-radio v-model="editData.right_flg" :label="0">否</el-radio>
                                    </div>
                                </div>
                                <div>
                                    <span>是否对所有人开放：</span>
                                    <div class="flag-one">
                                        <el-radio v-model="editData.view_flg" :label="1">是</el-radio>
                                        <el-radio v-model="editData.view_flg" :label="0">否</el-radio>
                                    </div>
                                </div>
                                <div class="edit-button">
                                    <div>
                                        <el-button @click="editBtn(index)">取消</el-button>
                                        <el-button @click="GetEdit(editData.id, editData.name, editData.url, editData.icon, editData.view_flg, editData.right_flg, index)" type="primary">确定</el-button>
                                    </div>
                                    <div>
                                        <el-button @click="GetDel(item.id, 0)" type="danger">删除</el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 新建 -->
                    <div class="overH" :class="{'noneEdit': int != index || addChild == false,'showAdd':  addChild == true}">
                        <div class="edit">
                            <p v-if=" item.leaf_flg == 0"></p>
                            <div class="edit-box" style="margin-left:100px">
                                <div>
                                    <div>隶属菜单:</div>
                                    <el-select v-model="editData.id" placeholder="">
                                        <el-option
                                        v-for="dd in addList"
                                        :key="dd.id"
                                        :label="dd.name"
                                        :value="dd.id">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div><div>菜单名称：</div> <el-input v-model="addChildData.name" placeholder="菜单名称"></el-input></div>
                                <div v-if="editData.id != ''"><div>路由地址：</div> <el-input v-model="addChildData.url" placeholder="/..."></el-input></div>
                                <div v-if="editData.id === ''">
                                    <div>图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标：</div>
                                    <div>
                                        <div v-if="!changeImgF" @click="changeIcon"><el-button>+</el-button></div>
                                        <img v-else @click="changeIcon" class="cur" :src="OSSImg+addChildData.icon" width="20px" alt="">
                                        
                                    </div>
                                </div>
                                <div>
                                    <div>是否生成权限：</div>
                                    <div class="flag-one">
                                        <el-radio v-model="addChildData.right_flg" :label="1">是</el-radio>
                                        <el-radio v-model="addChildData.right_flg" :label="0">否</el-radio>
                                    </div>
                                </div>
                                <div>
                                    <div>是否对所有人开放：</div>
                                    <div class="flag-one">
                                        <el-radio v-model="addChildData.view_flg" :label="1">是</el-radio>
                                        <el-radio v-model="addChildData.view_flg" :label="0">否</el-radio>
                                    </div>
                                </div>
                                <div>
                                    <el-button @click="addBtn(index)">取消</el-button>
                                    <el-button v-if="addChildData.type" @click="GetIssue('', addChildData.name, '', addChildData.icon, addChildData.view_flg, addChildData.right_flg, index)" type="primary">确定</el-button>
                                    <el-button v-else @click="GetIssue(editData.id, addChildData.name, addChildData.url, addChildData.icon, addChildData.view_flg, addChildData.right_flg, index)" type="primary">确定</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 子菜单 -->
                    <div class="overH"  v-for="(child, len) in menuShows[index].children" :key="len" >
                        <div :class="{'noneF': !item.type,'showF': item.type}" v-if="item.leaf_flg === 0"  class="child">
                            <div class="child-name">
                                <div :class="{'borLast': len == menuShows[index].children.length-1}"></div>
                                <span class="add">-</span>
                                <p>--------</p>
                                <span class="name" >{{child.name}}</span>
                            </div>
                            <div>
                                <div>
                                    <el-button @click="editChildBtn(len, child, index)" size="mini">编辑 <i :class="{'iconUp': !childEdit,'iconDown': childEdit && int == index && childInt == len}" class="el-icon-caret-bottom"></i></el-button>
                                    <el-dropdown trigger="click">
                                        <span class="el-dropdown-link">
                                            <el-button size="mini">更改父级 </el-button>
                                        </span>
                                        <el-dropdown-menu slot="dropdown" >
                                            <el-dropdown-item v-for="(item, index) in menuShows" :key="index" @click.native="GetParent(child.id, item.id)">{{item.name}}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                                <div class="child-sort">
                                    <div>
                                        <div>
                                            <el-button type="text" @click="GetSort(child.id, menuShows[index].children, len, len - 1 )" size="mini" :disabled="len == 0"><i class="el-icon-sort-up"></i></el-button> 
                                        </div>
                                        <div>
                                            <el-button type="text" @click="GetSort(child.id, menuShows[index].children, len, len + 1 )" size="mini" :disabled="len == menuShows[index].children.length-1"><i class="el-icon-sort-down"></i></el-button>
                                        </div>
                                    </div>
                                </div>
                                <div style="display:flex;align-items: center;">
                                    <span>是否生成权限：</span>
                                    <el-switch
                                    v-model="child.right"
                                    @change="GetviewFlg(menuShows[index].children, len, child.right, 0)"
                                    active-text=""
                                    inactive-text="">
                                    </el-switch>
                                    <!-- <div class="flag-one">
                                        <el-radio v-model="child.right_flg" @change="GetviewFlg(menuShows[index].children, len, 1)" :label="1">是</el-radio>
                                        <el-radio v-model="child.right_flg" @change="GetviewFlg(menuShows[index].children, len, 0)" :label="0">否</el-radio>
                                    </div> -->
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span>是否对所有人开放：</span>
                                    <el-switch
                                    v-model="child.view"
                                    @change="GetviewFlg(menuShows[index].children, len, child.view, 1)"
                                    active-text=""
                                    inactive-text="">
                                    </el-switch>
                                </div>
                            </div>
                        </div>
                        <div class="overH" :class="{'noneEdit': childInt != len || childEdit == false || int != index,'showEdit': childEdit && int == index && childInt == len}">
                            <div class="edit">
                                <p v-if=" item.leaf_flg == 0 && len != menuShows[index].children.length-1"></p>
                                <div class="edit-box" style="margin-left:50px">
                                    <div><span>菜单编辑：</span> <el-input v-model="editData.name"></el-input></div>
                                    <div><span>路由编辑：</span> <el-input v-model="editData.url" placeholder="/..."></el-input></div>
                                    <div>
                                        <span>是否生成权限：</span>
                                        <div class="flag-one">
                                            <el-radio v-model="editData.right_flg" :label="1">是</el-radio>
                                            <el-radio v-model="editData.right_flg" :label="0">否</el-radio>
                                        </div>
                                    </div>
                                    <div>
                                        <span>是否对所有人开放：</span>
                                        <div class="flag-one">
                                            <el-radio v-model="editData.view_flg" :label="1">是</el-radio>
                                            <el-radio v-model="editData.view_flg" :label="0">否</el-radio>
                                        </div>
                                    </div>
                                    <div class="edit-button">
                                        <div>
                                            <el-button @click="editChildBtn(len),GetShows()">取消</el-button>
                                            <el-button @click="GetEdit(editData.id, editData.name, editData.url, editData.icon, editData.view_flg, editData.right_flg, len)" type="primary">确定</el-button>
                                        </div>
                                        <div>
                                            <el-button @click="GetDel(child.id, 1)" type="danger">删除</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Loading from '../../../loading/loading'
export default {
    data() {
        return {
            access_token: "",
            menuShows: [],  //菜单列表
            int: -1,
            intName: -1,
            intChildName: -1,
            childInt: -1,
            edit: false,
            addChild:false,
            childEdit:false,
            loading: true,
            changeImgF: false,
            addList: [],
            addChildData:{
                type: 0,    //0子菜单 1菜单
                name: '',   //菜单名称
                url: '' ,    //菜单路由
                icon: '',
                right_flg: 0,   //是否生成权限
                view_flg: 0,    //是否对所有人开放
            },
            editData:{
                name: '',   //菜单名称
                url: '' ,    //菜单路由
                icon: '',
                right_flg: 0,   //是否生成权限
                view_flg: 0,    //是否对所有人开放
            }
        }
    },
    watch: {
        'int' () {
            this.edit = false
            this.addChild = false
            this.childEdit = false
        }
    },
    created() {
        let _that = this
        this.access_token = localStorage.getItem('accessToken')
        if(this.access_token != null){
            this.access_token = JSON.parse(this.access_token)
            this.GetShows()
            //获取个人信息
            this.infrom = JSON.parse(localStorage.getItem('informData'));
            // console.log(this.infrom)
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
    },
    components:{
        Loading
    },
    inject:['refresh'],
    methods: {
        //菜单
        GetShows(){
            const _that = this;
            _that.$http({
                url: _that.urlHost+"/man/menu/menus",
                method: "post",
                params: {"access_token": _that.access_token},
                timeout: 10000
            })
            .then((res)=> {
                _that.loading = false
                if(res.data.success === "00000000"){
                    _that.menuShows = res.data.obj
                    for(let i=0;i<_that.menuShows.length;i++){
                        _that.menuShows[i].type = true
                        _that.menuShows[i].right = _that.menuShows[i].right_flg == 1 ? true : false
                        _that.menuShows[i].view = _that.menuShows[i].view_flg == 1 ? true : false
                        if(_that.menuShows[i].children.length>0){
                            for(let j=0;j<_that.menuShows[i].children.length;j++){
                                _that.menuShows[i].children[j].right = _that.menuShows[i].children[j].right_flg == 1 ? true : false
                                 _that.menuShows[i].children[j].view = _that.menuShows[i].children[j].view_flg == 1 ? true : false
                            }
                        }
                    }
                    _that.refresh()
                }else {
                    _that.$base.err(res,_that)
                }
            })
            .catch((err)=> {
                _that.loading = false

            })
        },
        //菜单排序
        /**
         * id ->菜单ID
         * data ->排序数组
         * to>from 下
         * to<from 上
         */
        GetSort(id, data, to, from){
            const _that = this;
            _that.loading = true
            let opt;
            if(to>from){
                opt = 0;
            }else {
                opt = 1;
            }
            _that.$http({
                url: _that.urlHost+"/man/menu/sort",
                method: "post",
                params: {
                    "access_token": _that.access_token,
                    "id": id,
                    "opt": opt
                    }
            })
            .then((res)=> {
                _that.loading = false
                if(res.data.success === "00000000"){
                    // console.log(res.data);
                    _that.swapItems(data, to, from)
                    // _that.GetShows()
                    _that.refresh()
                }else{
                    _that.$base.err(res,_that)
                }
            })
            .catch((err)=> {

            })
        },
        /**
         * 新建菜单/子菜单
         * pid -> ''菜单  父id 子菜单
         * name 菜单名称
         * url 路由
         * icon 图标
         * view  1所有人可见
         * right_flg 1关联权限
         */
        GetIssue(pid, name, url, icon, view, right, index){
            const _that = this
            if($.trim(name) === ""){
                _that.$message.error("菜单名称不可为空！")
            }else {
                _that.$http({
                    url: _that.urlHost+"/man/menu/issue",
                    method: "post",
                    params: {
                        "access_token": _that.access_token,
                        "pid": pid,
                        "name": name,
                        "url": url,
                        "icon": icon,
                        "view": view,
                        "right_flg": right
                        },
                    timeout: 10000
                })
                .then((res)=> {
                    if(res.data.success === "00000000"){
                        _that.addBtn(index);
                        _that.GetShows();
                        _that.changeImgF = false
                        _that.addChildData = {
                            type: 0,    //0子菜单 1菜单
                            name: '',   //菜单名称
                            url: '' ,    //菜单路由
                            icon: '',
                            right_flg: 0,   //是否生成权限
                            view_flg: 0,    //是否对所有人开放
                        }
                    }else {
                        _that.$base.err(res,_that)
                    }
                })
                .catch((err)=> {

                })
            }
        },
        //关联菜单、是否可见
        GetviewFlg(data,index,opt,flg) {
            const _that = this
            _that.loading = true
            if(opt){
                opt = 1
            }else {
                opt = 0
            }
            if(flg == 0){
                var url = _that.urlHost+"/man/menu/right"
            }else {
                var url = _that.urlHost+"/man/menu/view"
            }
            _that.$http({
                url: url,
                method: "post",
                params: {
                    "access_token": _that.access_token,
                    "id": data[index].id,
                    "opt": opt
                    },
                timeout: 10000
            })
            .then((res)=> {
                _that.loading = false
                if(res.data.success === "00000000"){
                    _that.GetShows();
                    // _that.$forceUpdate()
                }else {
                    // console.log(res)
                    _that.$base.err(res,_that)
                    // data[index].right_flg = opt === 1 ? 0: 1
                    if(flg == 0){
                        data[index].right = opt == 1 ? false : true
                    }else {
                        data[index].view = opt == 1 ? false : true
                    }
                }
            })
            .catch((err)=> {
                _that.loading = false
                _that.$message.error('网络异常！')
                if(flg == 0){
                    data[index].right = opt == 1 ? false : true
                }else {
                    data[index].view = opt == 1 ? false : true
                }
                // data[index].right_flg = opt === 1 ? 0: 1

            })
        },
        //编辑
        GetEdit(id, name, url, icon, view, right, index){
            const _that = this
            if($.trim(name) === ""){
                _that.$message.error("菜单名称不可为空！")
            }else {
                _that.$http({
                    url: _that.urlHost+"/man/menu/issue",
                    method: "post",
                    params: {
                        "access_token": _that.access_token,
                        "id": id,
                        "name": name,
                        "url": url,
                        "icon": icon,
                        "view": view,
                        "right_flg": right
                        },
                    timeout: 10000
                })
                .then((res)=> {
                    if(res.data.success === "00000000"){
                        this.edit = false
                        this.childEdit = false
                        _that.GetShows();
                        _that.addChildData = {
                            type: 0,    //0子菜单 1菜单
                            name: '',   //菜单名称
                            url: '' ,    //菜单路由
                            icon: '',
                            right_flg: 0,   //是否生成权限
                            view_flg: 0,    //是否对所有人开放
                        }
                    }else {
                        _that.$base.err(res,_that)
                    }
                })
                .catch((err)=> {

                })
            }
        },
        /**
         * id   子id
         * pid  父id
         */
        GetParent(id, pid) {
            const _that = this
            _that.loading = true
            _that.$http({
                url: _that.urlHost+"/man/menu/parent",
                method: "post",
                params: {
                    "access_token": _that.access_token,
                    "pid": pid,
                    "id": id
                    },
                timeout: 10000
            })
            .then((res)=> {
                _that.loading = false
                if(res.data.success === "00000000"){
                    _that.GetShows();
                }else {
                    _that.$base.err(res,_that)
                }
            })
            .catch((err)=> {
                _that.loading = false

            })
        },
        //删除路由
        GetDel(id,type){
            const _that = this
            let msg;
            if(type === 0){
                msg = "确认是否删除该菜单及菜单内的所有子菜单？"
            }else {
                msg = "确认是否删除该菜单？"
            }
            _that.$confirm(msg,"提示",{
                confirmButtonText: "删除",
                concelButtonText: "取消",
                type: "warning"
            }).then(()=> {
                _that.$http({
                    url: _that.urlHost+"/man/menu/del",
                    method: "post",
                    params: {
                        "access_token": _that.access_token,
                        "id": id
                        },
                    timeout: 10000
                })
                .then((res)=> {
                    _that.loading = false
                    if(res.data.success === "00000000"){
                        _that.GetShows();
                        this.edit = false
                        this.childEdit = false
                    }else {
                        _that.$base.err(res,_that)
                    }
                })
                .catch((err)=> {
                    _that.loading = false

                })
            }).catch(()=> {

            })
            
        },

        //父元素展开
        taggleFather(data,index) {
            if(data[index].type){
                data[index].type = false
                if(this.int == index){
                    this.edit = false
                    this.addChild = false
                    this.childEdit = false
                }
            }else {
                data[index].type = true
            }
            this.$forceUpdate()
        },
        //数组上下移动
        swapItems(arr, to, from){
            if(arr == this.menuShows){
                if(this.int === to){
                    this.int = from
                }else if(this.int === from){
                    this.int = to
                }
                if(this.intName === to){
                    this.intName = from
                }else if(this.intName === from){
                    this.intName = to
                }
            }
                if(this.intChildName === to){
                    this.intChildName = from
                }else if(this.intChildName === from){
                    this.intChildName = to
                }
            this.childEdit = false
            arr[to] = arr.splice(from, 1, arr[to])[0];
            // console.log(this.menuShows)
            return arr
        },
        //父菜单编辑
        editBtn(index, data){
            this.editData = this.$base.objDeepCopy(data)
            if(this.int == index){
                if(this.edit){
                    this.edit = false
                }else {
                    this.int = index
                    this.edit = true
                    this.addChild = false
                    this.childEdit = false
                }
            }else{
                this.int = index
                this.addChild = false
                this.childEdit = false
                setTimeout(() => {
                   this.edit = true 
                }, 0);
            }
        },
        //父菜单新建
        addBtn(index, data) {
            this.editData = this.$base.objDeepCopy(data)
            let obj = this.$base.objDeepCopy(this.menuShows)
            this.addList = []
            this.addList.push({
                id: '',
                name: '无'
            })
            for(let i in obj){
                this.addList.push({
                    id: obj[i].id,
                    name: obj[i].name
                })
            }
            // console.log(this.addList)
            if(this.int == index){
                if(this.addChild){
                    this.addChild = false
                }else {
                    this.int = index
                    this.addChild = true
                    this.edit = false
                    this.childEdit = false
                }
            }else{
                this.int = index
                this.edit = false
                this.childEdit = false
                setTimeout(() => {
                   this.addChild = true
                }, 0);
            }
        },
        //二级子菜单编辑
        editChildBtn(index, data, findex){
            this.int = findex
            setTimeout(() => {
                this.editData = this.$base.objDeepCopy(data)
                if(this.childInt == index){
                    if(this.childEdit){
                        this.childEdit = false
                    }else {
                        this.childInt = index
                        this.childEdit = true
                        
                        this.addChild = false
                        this.edit = false
                    }
                }else{
                    this.childInt = index
                    this.childEdit = true
                    
                        this.addChild = false
                        this.edit = false
                }
            }, 0);
        },
        changeIcon() {
            this.$refs.file.click()
        },
        fileChanged() {
            const _that = this
            let itemUrl = _that.$refs.file.files[0];
            let item = {
                    name: itemUrl.name,
                    size: itemUrl.size,
                    file: itemUrl
                }
            _that.html5Reader(itemUrl,item)
            _that.$http.post(_that.urlHosts+'/anygo/common/ali_sts')
            .then((res)=>{
                if(res.status === 200){
                    let OSSData = res.data;
                    const client = new OSS.Wrapper({
                        region: 'oss-cn-beijing',  
                        accessKeyId: OSSData.AccessKeyId,
                        accessKeySecret: OSSData.AccessKeySecret,
                        stsToken: OSSData.SecurityToken,
                        bucket: 'ag-home'
                    });
                    let f = item;
                    const Name=f.name
                    const suffix = Name.substr(Name.indexOf("."));
                    const obj= _that.timestamp();
                    const storeAs = 'admin_imgs/'+obj+_that.createRandomId()+suffix  //  路径+时间戳+随机命名+后缀名
                        client.multipartUpload(storeAs, f.file).then(function (result){
                                _that.changeImgF = true
                                let name = result.name.substring(result.name.lastIndexOf('/')+1)
                                _that.addChildData.icon = name
                                // console.log(name)
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        // 将图片文件转成BASE64格式
        html5Reader(file, item){
            const reader = new FileReader()
            reader.onload = (e) => {
                this.$set(item, 'src', e.target.result)
            }
            reader.readAsDataURL(file)
        },
        //随机命名
        createRandomId() {
            return Math.random().toString(36).substr(2);
        },
        //  时间戳
        timestamp(){
            const time = new Date();  
            const y = time.getFullYear();  
            const m = time.getMonth()+1;  
            const d = time.getDate();  
            const h = time.getHours();  
            const mm = time.getMinutes();  
            const s = time.getSeconds();  
            const ms = time.getMilliseconds()  
            return ""+y+this.Add0(m)+this.Add0(d)+this.Add0(h)+this.Add0(mm)+this.Add0(s)+this.Add0(ms);  
        },
        Add0(m){  
            return m<10?'0'+m : m;  
        },
    }

}
</script>


<style lang="less">
    .menu{
        position: relative;
        height:100%;
        overflow: auto;
        .menu_top{
            padding: 0 20px;
            height: 40px;
            line-height: 40px;
            color: #999;
            border-bottom: 1px solid #aaa;
        }
        span{
            font-size: 15px;
        }
        .box{
            user-select: none;
            margin: 20px;
            padding: 0 0 20px 30px;
            height: calc(100% - 105px);
            overflow: auto;
            box-shadow: 2px -2px 10px 1px #ccc;
            background: #fff;
            display: flex;
            .father{
                display: flex;
                align-items: center;
                margin: 40px 0 10px 0;
                .father-name{
                    position: relative;
                    display: flex;
                    align-items: center;
                    width: 150px;
                    img{
                        width: 20px;
                        margin-right: 3px;
                    }
                    div{
                        position: absolute;
                        z-index: 10;
                        left: 29px;
                        top: 12px;
                        border-right: 1px dashed #999;
                        height: 25px;
                    }
                    p{
                        color: #999;
                        width: 33px;
                        border-top: 1px dashed #999;
                    }
                    .name{
                        width: 65px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .add{
                        border: 1px dashed #999;
                        width: 15px;
                        height: 15px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
                .father-sort{
                    width: 100px;
                    text-align: center;
                    >div{
                        display: flex;
                        justify-content: space-around;
                        i{
                            // font-weight: bold;
                            font-size: 18px;
                        }
                    }
                }
            }
            .child{
                padding-left: 22px;
                display: flex;
                align-items: center;
                >div{
                    display: flex;
                }
                .child-name{
                    position: relative;
                    z-index: 11;
                    width: 180px;
                    display: flex;
                    align-items: center;
                    div{
                        position: absolute;
                        z-index: 10;
                        // top: 20px;
                        left: 7px;
                        border-left: 1px dashed #999;
                        height: 40px;
                    }
                    p{
                        color: #999;
                    }
                    .add{
                        z-index: 12;
                        position: relative;
                        background: #fff;
                        border: 1px dashed #999;
                        width: 15px;
                        height: 15px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .name{
                        width: 100px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .child-sort{
                    width: 100px;
                    text-align: center;
                    >div{
                        display: flex;
                        justify-content: space-around;
                        i{
                            // font-weight: bold;
                            font-size: 18px;
                        }
                    }
                }
            }
            .edit{
                position: relative;
                // height: 300px;
                .edit-box{
                    >div:nth-child(1){
                        >div:nth-child(1){
                            width: 80px;
                        }
                    }
                    .el-input{
                        flex: 1;
                    }
                }
                p{
                    z-index: 11;
                    position: absolute;
                    left: 28px;
                    height: 280px;
                    width: 1px;
                    border-right: 1px dashed #999;
                }
                .edit-box>div{
                    margin-left: 150px;
                    display: flex;
                    align-items: center;
                    height: 40px;
                    line-height: 40px;
                    >span{
                        width: 150px;
                        height: 30px;
                        line-height: 30px;
                    }
                    >div{
                        display: flex;
                        align-items: center;
                        // margin-top: 10px;
                    }
                    .el-button{
                        padding: 5px 10px;
                    }
                    .el-input__inner{
                        height: 30px;
                        line-height: 30px;
                    }
                }
                .edit-button{
                    justify-content: space-between;
                }
            }
        }
    }
    .showF{
        height: 45px;
        transition: .1s;
    }
    .noneF{
        height: 0;
        transition: .1s;
    }
    .showEdit{
        height: 230px;
        transition: .1s;
    }
    .showAdd{
        height: 280px;
        transition: .1s;
    }
    .noneEdit{
        height: 0;
        transition: .1s;
    }
    .iconDown{
        transform:rotate(180deg);
        transition: all linear .1s;
    }
    .iconup{
        transform:rotate(0);
        transition: all linear .1s;
    }
    .cur:hover{
        opacity: .8;
        cursor: pointer;
    }
    .overH{
        overflow: hidden;
    }
    .borLast{
        top: -20px;
    }
</style>
