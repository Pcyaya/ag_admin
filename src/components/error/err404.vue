<template>
    <div class="i404" :style="{'width':rightW}">
        <img src="https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/404.jpg" alt="">
    </div>
</template>

<script>
export default {
    data() {
        return {
            rightW: ''
        }
    },
    created() {
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
            }else if(window.innerWidth>1920){
                this.rightW = (1920 - wid) +'px';
            }
            else{
                this.rightW = (window.innerWidth - wid)+'px';
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
                this.rightW = (ww-180)+'px'
            }else {
                this.rightW = (ww-60)+'px'
            }
        },
    },
}
</script>

<style>
    .i404{
        background: #F3F6FF;
        position: fixed;
        /* overflow: auto; */
        width: 100%;
        height: 100%;
    }
    .i404 img{
        width: 100%;
        /* height: 100%; */
    }
</style>
