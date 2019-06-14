<template>
    <div class="loading">
        <!-- <img src="https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/icon_send_loading.gif" alt=""> -->
        <i class="el-icon-loading"></i>
        &nbsp;加载中...
        <!-- {{msg}} -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    props:['msg']
}
</script>

 <style lang="less">
    .loading{
        position: fixed;
        z-index: 9999;
        width: 100%;
        height: 100%;
        overflow: auto;
        background: rgba(0, 0, 0, .5);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ddd;
        font-size: 16px;
        i{
            font-size: 20px;
            color: #ddd;
        }
        img{
            width: 30px;
            height: 30px;
        }
    }
</style>
