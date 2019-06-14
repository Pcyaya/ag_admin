<template>
    <!-- 菜单设置 -->
    <div class="ushelp" @click="intName = -1,intChildName = -1">
        <Loading v-if="loadingType"></Loading>
        <div class="ushelp_top">
            <div><img src="https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/arrow_instructions.png" alt=""> 当前位置：APP维护 > <span><el-button type="text">使用帮助</el-button></span></div>
            <div><el-button type="text" @click="addType = 1,dialogDiv.add = true">添加</el-button></div>
        </div>
        <input v-show="0" type="file" class="icons" @change="IconChange" ref="icon" accept="image/jpg,image/jpeg,image/png,image/bmp">
        <input v-show="0" type="file" class="icons1" @change="IconChange1" ref="icon1" accept="image/jpg,image/jpeg,image/png,image/bmp">
        <div class="box">
            <div class="box-item" v-for="(box, len) in CategorysData.data" :key="len">
                <div class="item-title">
                    <div class="cur" @click="tlaggerShow(len)"> 
                        <div><img :src="box.icon" alt=""> </div>
                        {{box.name}} &nbsp;&nbsp;&nbsp;<i v-if="box.sync == 1" class="el-icon-success col_in"></i> 
                    </div>
                    <div>
                        <el-button @click="GetSync(box.id,1,1)" v-if="box.sync == 0" type="text" class="col_in">同步APP</el-button>
                        <el-button @click="GetSync(box.id,0,1)" v-else type="text" class="col_out">移出APP</el-button>
                        <el-button type="text" @click="editInfo(box,1)">添加</el-button>
                        <el-button type="text"  @click="addType = 12,dialogDiv.add = true,rsProblemType.id=box.id,rsProblemType.name = box.name,rsProblemType.iconUrl = box.icon,rsProblemType.opt = box.sync">编辑</el-button>
                        <el-button type="text" @click="GetDel(box.id, 1)">删除</el-button>

                        <el-button  @click="GetSort(box.id,0)" type="text" size="mini" :disabled="len == 0"><i class="el-icon-sort-up"></i></el-button>
                        <el-button  @click="GetSort(box.id,1)" type="text" size="mini" :disabled="len == CategorysData.data.length-1"><i class="el-icon-sort-down"></i></el-button>
                    </div>
                </div>
                <div class="items items-loading" :class="{'heightZAuto':showInt == len}" v-if="ListdataType == 0">
                    <i class="el-icon-loading"></i> 加载中...
                </div>
                <div class="items items-null" :class="{'heightZAuto':showInt == len}" v-if="ListdataType == null">
                    暂无信息
                </div>
                <div class="items" :class="{'heightZAuto':showInt == len}" v-for="(item, index) in ListData.data" :key="index">
                    <div class="cur" @click="tlagger(len,index)">{{index+1}}</div>
                    <div :class="{'heightAuto':int == index && fint == len}">
                        <div class="title">
                            <div @click="tlagger(len,index)">{{item.title}} &nbsp;&nbsp;&nbsp;<i v-if="item.sync == 1" class="el-icon-success col_in"></i></div>
                            <div class="btn">
                                <el-button @click="GetSync(item.id,1,0,box.id)" v-if="item.sync == 0" type="text" class="col_in">同步APP</el-button>
                                <el-button @click="GetSync(item.id,0,0,box.id)" v-else type="text" class="col_out">移出APP</el-button>
                                <el-button type="text"  @click="editInfo(item,12)">编辑</el-button>
                                <el-button type="text"  @click="GetDel(item.id, 2,box.id)">删除</el-button>
                                <el-button @click="GetSort(item.id,0,box.id)" type="text" size="mini" :disabled="index == 0"><i class="el-icon-sort-up"></i></el-button>
                                <el-button @click="GetSort(item.id,1,box.id)" type="text" size="mini" :disabled="index == ListData.data.length-1"><i class="el-icon-sort-down"></i></el-button>
                                <i @click="tlagger(len,index)" class="el-icon-arrow-down" :class="{'Icon':int == index && fint == len,'IconN':int != index || fint != len}"></i>
                            </div>
                        </div>
                        <div class="content-box">
                            <div v-for="(childItem, childIndex) in item.details" :key="childIndex">
                                <div class="content" v-html="childItem.content" v-if="childItem.content != ''">
                                    <!-- {{item.details[0].content}}  -->
                                </div>
                                <div class="img" v-if="childItem.url != null && childItem.url != ''">
                                    <img @click="viewBtn(childItem.url,1,'')" :src="childItem.url" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="">
            <el-dialog class="dialogDIv  add2" width="600px" title="" :visible.sync="dialogDiv.add">
                <div class="dialoBox">
                    <div class="dialoTitle">
                        <div v-if="addType == 1">添加——问题类型</div>
                        <div v-if="addType == 12">编辑——问题类型</div>
                        <div @click="dialogDiv.add = false" class="cur">X</div>
                    </div>
                    <div class="dialoContent">
                        <div>
                            <span>图标：</span>
                            <div>
                                <div v-if="rsProblemType.iconUrl == ''" @click="$refs.icon.click()" class="icon-btn cur">+</div>
                                <img class="cur" @click="$refs.icon.click()" :src="rsProblemType.iconUrl" height="25px" alt="">
                                <el-button  v-if="rsProblemType.iconUrl != ''" type="text" style="margin-left:5px" @click="rsProblemType.iconUrl = '',iconFile = ''">删除</el-button>
                            </div>
                        </div>
                        <div>
                            <span>问题类型名称：</span>
                            <div>
                                <el-input v-model="rsProblemType.name"></el-input>
                            </div>
                        </div>
                        <div>
                            <el-button v-if="addType == 1" size="mini" type="primary"  @click="submitBtn(1)">同步到app</el-button>
                            <el-button v-else size="mini" @click="dialogDiv.add = false">取消</el-button>
                            <el-button size="mini" type="primary" class="cur" :class="{'submit-active':addType == 1}" @click="submitBtn(rsProblemType.opt)">完成</el-button>
                        </div>
                    </div>
                </div>
            </el-dialog>
            <el-dialog class="dialogDIv" width="600px" title="" :visible.sync="dialogDiv.add1">
                <div class="dialoBox">
                    <div class="dialoTitle">
                        <div v-if="addType1 == 1">添加——账号问题</div>
                        <div v-else>编辑——账号问题</div>
                        <div @click="dialogDiv.add1 = false" class="cur">X</div>
                    </div>
                    <div class="dialoContent">
                        <div>
                            <span class="dialo-title">问题：</span>
                            <div>
                                <el-input v-model="rsList.title" placeholder="输入问题..."></el-input>
                            </div>
                        </div>
                        <div>
                            <span class="dialo-title">答案：</span>
                            <div class="anwser">
                                <div v-for="(item, index) in rsList.details" :key="index">
                                        <div class="close-div" @click="closeDiv(index)">
                                            <i class="el-icon-error"></i>
                                        </div>
                                    <div>
                                        <el-input v-model="item.content" type="textarea" rows="3" placeholder="输入答案..."></el-input>
                                    </div>
                                    <div class="up-img" v-if="typeof item.url != 'object' && item.url != ''">
                                            <div class="close-icon" @click="closeImg(index)">
                                                <i class="el-icon-error"></i>
                                            </div>
                                            <img class="item-img" :src="item.url" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cur addimg" @click="$refs.icon1.click()">
                            <div><i class="el-icon-circle-plus"></i></div>
                            <div>添加图片</div>
                        </div>
                        <div>
                            <el-button size="mini" type="primary"  v-if="addType1 == 1" @click="submitBtn1(1)">同步到app</el-button>
                            <el-button size="mini" @click="dialogDiv.add1 = false" v-else>取消</el-button>
                            <el-button size="mini" type="primary" :class="{'submit-active':addType1 == 1}" @click="submitBtn1(rsList.opt)">完成</el-button>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
        
    <viewimg v-if="imgType" :imgurl="imgurldata" @typeBy="typeBy"></viewimg>
    </div>
</template>

<script>
import Loading from '../../../loading/loading'
import viewimg from './../../../viewimg/viewimg'
export default {
    data() {
        return {
            access_token: "",
            activeName: '',
            loadingType:false,
            page: 1,
            rows:10,
            ListData:{},    //使用帮助列表
            CategorysData:{},   //使用帮助类型 列表
            ListdataType: '',
            dialogDiv: {
                add: false,
                add1: false
            },
            addType: '',
            addType1: '',
            int: -1,
            fint: -1,
            showInt: -1,
            addType: '',
            rsProblemType: {
                iconUrl: '',
                url: '',
                name:'',
                id: '',
                opt: 0,
            },
            rsList:{
                id:'',
                category: '',
                opt: 0,
                title: '',
                details:[],
            },
            iconFile:'',
            files: [],
            imgurldata:{},
            imgType: false
        }
    },
    watch: {
        'addType'() {
            if(this.addType == 1){
                this.rsProblemType = {
                    iconUrl: '',
                    url: '',
                    name:'',
                    id: ''
                }
            }
        }
    },
    created() {
        let that = this
        that.access_token = localStorage.getItem('accessToken')
        if(that.access_token != null){
            that.access_token = JSON.parse(that.access_token)
            that.GetCategorys()
            //获取个人信息
            that.infrom = JSON.parse(localStorage.getItem('informData'));
        }else{
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
        }
    },
    components:{
        Loading,
        viewimg
    },
    methods: {
        typeBy(t) {
            this.imgType = t
        },
        viewBtn(data, index, url){
            let list = []
            // console.log(data)
            // for(let i=1;i<data.length;i++){
                list.push(data)
            // }
            this.imgurldata = {
                list,
                url
            }
            this.imgurldata.index = index -1
            this.imgType = true
            // console.log(this.imgurldata)
        },
        tlagger(len,index){
            const that = this;
            if(that.int == index && that.fint == len){
                that.int = -1;
                that.fint = -1; 
            }else{
                that.int = index;
                that.fint = len;   
                let info = that.ListData.data[index];
                for(let i=0;i<info.details.length;i++){
                    // if(info.details[i].type == 1){
                    //     that.files.push({
                    //         url:info.details[i].url
                    //     })
                    // }
                }   
                // console.log(that.files)
            }
        },
        tlaggerShow(len){
            if(this.showInt == len){
                this.showInt = -1;
            }else {
                this.ListData = ''
                this.GetList(this.CategorysData.data[len].id)
                this.showInt = len;
            }
        },
        IconChange() {
            const  that = this;
            let itemUrl = that.$refs.icon.files[0];
            that.iconFile = itemUrl;
            if (itemUrl.type.match(/image.*/)){
                var reader = new FileReader();
                reader.onload = ()=>{
                    var img = new Image();
                    img.src = reader.result;
                    that.rsProblemType.iconUrl = img.src
                }
                reader.readAsDataURL(itemUrl);
                $('.icons').val('')
            }else {
                that.$message.error('请上传正确的图标！')
            }
        },
        IconChange1() {
            const  that = this;
            let list = that.$refs.icon1.files[0];
            // for (let i = 0; i < list.length; i++) {
                if (!that.isContain(list)) {
                    let item = {
                        name: list.name,
                        size: list.size,
                        file: list
                    }
                    that.html5Reader(list, item)
                    that.files.push(item)
                    setTimeout(() => {
                        that.rsList.details.push({
                            content: '',
                            files: item,
                            url: item.url
                        })
                    }, 100);
                }
            // }
            // $('.icon1').val('')
        },
        isContain(file) {
            return this.files.find((item) => item.name === file.name && item.size === file.size)
        },
        closeImg(index){
            // this.rsList.details.splice(index,1);
            this.rsList.details[index].url = '';
            delete this.rsList.details[index].files;
        },
        closeDiv(index){
            this.rsList.details.splice(index,1);
        },
        // 将图片文件转成BASE64格式
        html5Reader(file, item){
            const reader = new FileReader()
            reader.onload = (e) => {
                this.$set(item, 'url', e.target.result)
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
        //上传图片到oss
        GetOSSUp(flg) {
            const that = this
            let itemUrl = that.iconFile
            let item = {
                    name: itemUrl.name,
                    size: itemUrl.size,
                    file: itemUrl
                }
            that.html5Reader(itemUrl,item)
            that.$http.post(that.urlHosts+'/anygo/common/ali_sts')
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
                    const obj= that.timestamp();
                    const storeAs = 'ushelp-imgs/'+obj+that.createRandomId()+suffix  //  路径+时间戳+随机命名+后缀名
                    client.multipartUpload(storeAs, f.file).then(function (result){
                            that.rsProblemType.url = result.url
                            that.Getissue(flg)
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
        //上传图片到oss
        GetOSSUp1(flg) {
            const that = this
            that.loadingType = true
            that.$http.post(that.urlHosts+'/anygo/common/ali_sts')
            .then((res)=>{
                if(res.status == 200){
                    let OSSData = res.data;
                    const client = new OSS.Wrapper({
                        region: 'oss-cn-beijing',  
                        accessKeyId: OSSData.AccessKeyId,
                        accessKeySecret: OSSData.AccessKeySecret,
                        stsToken: OSSData.SecurityToken,
                        bucket: 'ag-home'
                    });
                    let fNum = [];
                    let imgLen = 0
                    let loadLen = 0
                    console.log(fNum)
                    for(let i in that.rsList.details){
                        fNum.push(that.rsList.details[i])
                    }
                    for(let i=0;i<fNum.length;i++){
                        // console.log(fNum[i].file)
                        loadLen++
                        if(fNum[i].files == undefined){
                            // that.rsList.details.push({
                            //     content: '',
                            //     type: 1,
                            //     url: fNum[i].url
                            // })
                            that.rsList.details[i].url = fNum[i].url;
                            that.rsList.details[i].type = 1;
                            imgLen++ 
                            if(imgLen == fNum.length){
                                that.Getissue1(flg)
                            }
                        }else{
                            console.log(fNum[i].files)
                            var f=fNum[i].files
                            const Name=f.name
                            const suffix = Name.substr(Name.indexOf(".")); 
                            const obj=that.timestamp();
                            const storeAs = 'ushelp-imgs/'+obj+that.createRandomId()+suffix  //  路径+时间戳+后缀名
                            client.multipartUpload(storeAs, f.file).then(function (result){
                                // that.rsList.details.push({
                                //     content: '',
                                //     type: 1,
                                //     url: 'http://ag-home.oss-cn-beijing.aliyuncs.com/'+result.name
                                // });
                                that.rsList.details[i].url = 'http://ag-home.oss-cn-beijing.aliyuncs.com/'+result.name;
                                that.rsList.details[i].type = 1;
                                imgLen++
                                // console.log(imgLen)
                                // console.log(loadLen)
                                console.log(fNum)
                                if(imgLen == loadLen){
                                    that.Getissue1(flg)
                                }
                            })
                            .catch(err=>{
                                console.log(err)
                            })
                        }
                    }
                }else{

                }
            })
            .catch((err)=>{
                console.log(err);
                that.$message.error('网络异常！')
            })
        },
        //使用帮助类型 列表
        GetCategorys() {
            const that = this
            that.loadingType = true
            that.$http({
                url: that.urlHost+'/man/usehelp/categorys',
                method: 'post',
                params: {
                    access_token: that.access_token,
                    rows: 100,
                    page: 1,
                },
                timeout: 10000
            })
            .then((res)=>{
                that.loadingType = false
                if(res.data.success === "00000000"){
                    that.CategorysData = res.data.obj;
                    that.loadingType = false
                }else{
                    that.$base.err(res,that)
                }
            })
            .catch((err)=> {
                that.$message.error("网络异常！")
            })
        },
        //使用帮助 列表
        GetList(id) {
            const that = this
            // that.loadingType = true
            // that.ListData = ''
            that.ListdataType = 0;
            that.$http({
                url: that.urlHost+'/man/usehelp/list',
                method: 'post',
                params: {
                    access_token: that.access_token,
                    category: id,
                    rows: 100,
                    page: 1,
                },
                timeout: 10000
            })
            .then((res)=>{
                // that.loadingType = false
                if(res.data.success === "00000000"){
                    that.ListData = res.data.obj;
                    if(that.ListData.data != null){
                        that.ListdataType = 1;
                        for(let i=0;i<that.ListData.data.length;i++){
                            if(that.ListData.data[i].details != null){
                                for(let j=0;j<that.ListData.data[i].details.length;j++){
                                    that.ListData.data[i].details[j].content = that.ListData.data[i].details[j].content.replace(/\n/g, "<br>")
                                }
                            }
                        }
                    }else {
                        that.ListdataType = null;
                    }
                }else{
                    that.$base.err(res,that)
                }
            })
            .catch((err)=> {
                that.$message.error("网络异常！")
                // that.loadingType = false
            })
        },
        submitBtn(flg) {
            const that = this;
            if(that.iconFile == ''){
                //没添加图标或未改变图标
                that.Getissue(flg)
            }else {
                that.GetOSSUp(flg)
            }
        },
        submitBtn1(flg){
            const that = this
            // that.rsList.details.push(that.rsList.content)
            if(that.files.length == 0){
                that.Getissue1(flg)
            }else {
                that.GetOSSUp1(flg)
            }
        },
        //使用帮助类型 新增 1/编辑 12
        Getissue(flg) {
            const that = this;
            that.loadingType = true
            let opt = '', data = '';
            if(flg == 1){
                opt = 1;
            }else {
                opt = 0;
            }
            if(that.addType == 1){
                data = {
                    access_token: that.access_token,
                    icon: that.rsProblemType.url,
                    name: that.rsProblemType.name,
                    sync: opt
                }
            }else {
                if(that.iconFile == ''){
                    data = {
                        access_token: that.access_token,
                        icon: that.rsProblemType.iconUrl,
                        name: that.rsProblemType.name,
                        id: that.rsProblemType.id,
                        sync: opt
                    }
                }else{
                    data = {
                        access_token: that.access_token,
                        icon: that.rsProblemType.url,
                        name: that.rsProblemType.name,
                        id: that.rsProblemType.id,
                        sync: opt
                    }
                }
            }
            $.ajax({
                url: that.urlHost+'/man/usehelp/category/issue',
                type: 'post',
                dataType: 'json',
                data: data,
                timeout: 10000,
                success: function(res){
                    that.loadingType = false
                    if(res.success === "00000000"){
                        that.$message.success(res.msg)
                        that.loadingType = false
                        that.dialogDiv.add = false
                        that.GetCategorys()
                        // that.int= -1;
                        // that.fint= -1;
                        // that.showInt= -1,
                        that.rsProblemType = {
                            iconUrl: '',
                            url: '',
                            name:'',
                            id: ''
                        }
                    }else if(res.success === '00100003'){
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
                            message: res.msg,
                            type: 'error',
                            content: true
                        })
                    }
                },
                error:(err)=>{
                    that.loadingType = false
                    that.$message.error("网络异常！")
                }
            })
        },
        Getissue1(flg) {
            const that = this;
            // console.log(that.rsList)
            that.loadingType = true
            let opt = '', data = '';
            if(flg == 1){
                opt = 1;
            }else {
                opt = 0;
            }
            // console.log(that.rsList)
            if(that.addType1 == 1){
                data = {
                    access_token: that.access_token,
                    category: that.rsList.category,
                    title: that.rsList.title,
                    details: JSON.stringify(that.rsList.details),
                    sync: opt
                }
            }else {
                // if(that.iconFile == ''){
                //     data = {
                //         access_token: that.access_token,
                //         category: that.rsList.details,
                //         title: that.rsList.title,
                //         details: JSON.stringify(that.rsList.details),
                //         id: that.rsList.id
                //     }
                // }else{
                    data = {
                        access_token: that.access_token,
                        category: that.rsList.category,
                        title: that.rsList.title,
                        details: JSON.stringify(that.rsList.details),
                        id: that.rsList.id,
                        sync: opt
                    }
                // }
            }
            $.ajax({
                url: that.urlHost+'/man/usehelp/issue',
                type: 'post',
                dataType: 'json',
                data: data,
                timeout: 10000,
                success: function(res){
                    that.loadingType = false
                    if(res.success === "00000000"){
                        that.$message.success(res.msg)
                        that.loadingType = false
                        that.dialogDiv.add1 = false
                        that.GetList(that.rsList.category)
                        // that.int= -1;
                        // that.fint= -1;
                        // that.showInt= -1,
                        that.rsList = {
                            id:'',
                            category: '',
                            title: '',
                            content:{
                                content: '',
                                type: 0
                            },
                            details:[],
                        }
                        that.files = []; 
                    }else if(res.success === '00100003'){
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
                            message: res.msg,
                            type: 'error',
                            content: true
                        })
                    }
                },
                error:(err)=>{
                    that.loadingType = false
                    that.$message.error("网络异常！")
                }
            })
        },
        editInfo(item, flg){
            const that = this;
            that.dialogDiv.add1 = true;
            that.addType1 = flg;
            that.files = []
            if(flg == 1){
                that.rsList = {
                    id:'',
                    category: item.id,
                    title: '',
                    details:[],
                }
            }else {
                that.dialogDiv.add1 = true;
                that.rsList.title = item.title;
                that.rsList.category = item.category;
                that.rsList.id = item.id;
                that.rsList.opt = item.sync;
                that.rsList.details = [];
                let itemobj = that.$base.objDeepCopy(item.details);
                for(let i in itemobj){
                    itemobj[i].content = itemobj[i].content.replace(/<br>/g, "\n");
                    that.rsList.details.push(itemobj[i])
                }
            }
            // console.log(typeof that.rsList.details[0].url);
        },
        //删除
        GetDel(id, flg,uid){
            let that = this
            if(flg == 1){
                var url = that.urlHost + '/man/usehelp/category/del'
            }else {
                var url = that.urlHost + '/man/usehelp/del'
            }
            that.$confirm('是否删除？','提示')
            .then(()=>{
                that.$http({
                    url: url,
                    method: 'post',
                    params: {
                        access_token: that.access_token,
                        id: id
                    }
                })
                .then((res)=>{
                    if(res.data.success === '00000000'){
                        that.$message.success(res.data.msg)
                        if(flg == 1){
                            that.GetCategorys()
                        }else {
                            that.GetList(uid)
                        }
                    }else{
                        that.$base.err(res,that)
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
            })
            .catch(()=>{

            })
        },
         //app 同步
        GetSync(id,opt, flg,uid){
            let that = this
            if(flg == 1){
                var url = that.urlHost + '/man/usehelp/category/sync'
            }else {
                var url = that.urlHost + '/man/usehelp/sync'
            }
           
            that.$http({
                url: url,
                method: 'post',
                params: {
                    access_token: that.access_token,
                    id: id,
                    opt: opt
                }
            })
            .then((res)=>{
                if(res.data.success === '00000000'){
                    that.$message.success(res.data.msg)
                    if(flg == 1){
                        that.GetCategorys()
                    }else {
                        that.GetList(uid)
                    }
                }else{
                    that.$base.err(res,that)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
            
            
        },
        //排序
        /**
         * id ->ID
         * opt 
         * flg 0->父级 1->子级
         * uid 父级ID
         */
        GetSort(id, opt,uid){
            const that = this;
            that.loading = true
            if(uid == undefined){
                var data = {
                    "access_token": that.access_token,
                    "category": id,
                    "opt": opt,
                }
            }else {
                var data = {
                    "access_token": that.access_token,
                    "id": id,
                    "opt": opt,
                }
            }
            that.$http({
                url: that.urlHost+"/man/usehelp/sort",
                method: "post",
                params: data
            })
            .then((res)=> {
                that.loading = false
                if(res.data.success === "00000000"){
                    if(uid == undefined){
                        that.GetCategorys()
                        that.showInt= -1;
                    }else {
                        that.GetList(uid)
                    }
                }else{
                    that.$base.err(res,that);
                }
            })
            .catch((err)=> {
                that.loading = false;
                that.$message.error('网络异常！');
            })
        },
        
        
    }

}
</script>


<style lang="less">
    .ushelp{
        position: relative;
        height:100%;
        overflow: auto;
        .ushelp_top{
            padding: 0 20px;
            height: 40px;
            line-height: 40px;
            color: #999;
            border-bottom: 1px solid #aaa;
            display: flex;
            justify-content: space-between;
        }
        .box{
            margin: 20px;
            // height: calc(100% - 101px);
            // overflow: auto;
            .box-item{
                padding-bottom: 5px;
                .item-title{
                    user-select: none;
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 15px;
                    background: #fff;
                    margin-bottom: 5px;
                    >div:nth-child(1){
                        flex: 1;
                        padding: 10px 0;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        >div{
                            width: 20px;
                            height: 20px;
                            margin-right: 5px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            overflow: hidden;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
                .items-loading, 
                .items-null{
                    display: flex;
                    align-items: center;
                    margin-left: 20px;
                    i{
                        margin-right: 2px;
                    }
                }
                .items{
                    display: flex;
                    transition: 300ms;
                    height: 0;
                    opacity: 0;
                    overflow: auto;
                    >div:nth-child(1){
                        width: 45px;
                        height: 45px;
                        line-height: 45px;
                        background: #fff;
                        text-align: center;
                    }
                    >div:nth-child(2){
                        background: #fff;
                        // display: flex;
                        flex: 1;
                        margin-left: 5px;
                        height: 45px;
                        overflow: hidden;
                        transition: 300ms;
                        margin-bottom: 5px;
                    }
                    .title{
                        display: flex;
                        flex: 1;
                        align-items: center;
                        padding: 0 15px;
                        height: 45px;
                        justify-content: space-between;
                        border-bottom: 3px solid #f3f3f3;
                        >div:nth-child(1){
                            height: 45px;
                            line-height: 45px;
                            flex: 1;
                            cursor: pointer;
                        }
                        .btn{
                            .el-button{
                                padding: 0;
                            }
                            i{
                                margin-left: 24px;
                                cursor: pointer;
                            }
                        }
                    }
                    .content-box{
                        overflow: auto;
                        max-height:420px;
                        // min-height: 200px;
                    }
                    .content{
                        padding: 12px 15px;
                        // border-bottom: 3px solid #f3f3f3;
                        overflow: auto;
                        // max-height: 100px;
                    }
                    .img{
                        height: 300px;
                        overflow: auto;
                        padding: 12px 15px;
                        img{
                            border: 1px solid #ccc;
                            border-radius: 2px;
                            max-height: 95%;
                            max-width: 600px;
                            object-fit: cover;
                            margin-right: 5px;
                            cursor: pointer;
                        }
                    }
                    
                }
            }
            .box-item:last-child{
                padding: 0;
            }
            
        }
        .dialogDIv{
            .el-dialog__header{
                display: none;
            }
            .el-dialog__body{
                padding: 0 !important;
            }
            .dialoBox{
                font-size: 14px;
                background: #fff;
                width: 600px;
            }
            .dialoTitle{
                display: flex;
                justify-content: space-between;
                background: #3A9CF7;
                color: #fff;
                padding: 10px 20px;
            }
            .dialoContent{
                padding: 20px;
                flex: 1;
                >div{
                    display: flex;
                    // align-items: center;
                    padding-bottom: 15px;
                    >span{
                        text-align: right;
                        width: 100px;
                        margin-top: 10px;
                    }
                    .icon-btn{
                        border: 1px solid #dcdfe6;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 4px;
                    }
                    .dialo-title{
                        width: 50px;
                    }
                    >div{
                        flex: 1;
                        display: flex;
                        align-items: center;
                    }
                    .el-input__inner{
                        height: 35px;
                        line-height: 35px;
                        padding: 0 5px;
                    }
                    .anwser{
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        align-items:flex-start;
                        border: 1px solid #dcdfe6;
                        border-radius: 4px;
                        height: 420px;
                        overflow: auto;
                        >div{
                            position: relative;
                            width: calc(100% - 30px);
                            margin: 10px;
                            border: 1px dashed #ccc;
                            padding: 10px 0 10px 10px;
                        }
                        textarea{
                            border: 0;
                            padding: 0;
                            padding-right: 20px;
                        }
                        .up-img{
                            // height: 230px;
                            flex-wrap: wrap;
                            overflow: auto;
                            display: flex;
                            img{
                                width: 200px;
                                height: 175px;
                                border: 1px solid #ccc;
                            }
                            .close-icon{
                                position: relative;
                                height: 0;
                                width: 0;
                                i{
                                    position: absolute;
                                    left: 185px;
                                    top: 7px;
                                    color: #ccc;
                                    &:hover{
                                        cursor: pointer;
                                        opacity: .8;
                                    }
                                }
                            }
                        }
                        .close-div{
                            position: relative;
                            height: 0;
                            width: 100%;
                            i{
                                position: absolute;
                                right: 5px;
                                top: -5px;
                                color: #333;
                                &:hover{
                                    cursor: pointer;
                                    opacity: .8;
                                }
                            }
                        }
                    }
                }
                .addimg{
                    border: 1px dashed #bbb;
                    width: 80px ;
                    height: 80px;
                    padding: 0;
                    margin-left: 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-around;
                    color: #999;
                    i{
                        font-size: 40px;
                        color: #999;
                        background: #fff;
                    }
                }
                textarea{
                    resize: none;
                }
                >div:last-child{
                    display: flex;
                    width: 50%;
                    margin: 20px auto 0;
                    justify-content: space-around;
                    .el-button{
                        padding: 10px 30px;
                        margin-right: 30px;
                    }
                }
                .submit-active{
                    background: #fff;
                    color: #3A9CF7;
                }
            }
            
        }
        .col_in{
            color: #0cbd14 !important;
        }
        .col_out{
            color: #f8b33b !important;
        }
        .heightAuto{
            height: 450px !important;
            transition: .3s;
        }
        .heightAutoN{
            height: 400px !important;
            transition: .3s;
        }
        .heightZAuto{
            height: auto !important;
            opacity: 1 !important;
        }
        .Icon{
            transform:rotate(180deg);
            transition: all linear .3s;
        }
        .IconN{
            transform:rotate(0);
            transition: all linear .3s;
        }
        .add2{
            padding-top: 20vh;
        }
    }
   
</style>
