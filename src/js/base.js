
function tampToTime(timestamp,type){
    if(timestamp === '' || timestamp === null){
        return ''
    }else{
        let date = new Date(timestamp);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let h = date.getHours()<10?'0'+date.getHours():date.getHours();
        let m = ':' + (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
        let s = ':' + (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds());
        if(type == 0){
            return M+D;
        }else if(type == 1){
            return h+m;
        }else if(type == 2){
            return Y+M+D;
        }else if(type == 3){
            return Y+M+D+' '+h+m+s;  
        }
        else{
            return Y+M+D+' '+h+m+s;  
        }
    }
}
function timeToTamp(time){
    var d = new Date(time);  
    var date =  d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
    return Date.parse(date)
}
function ToN(str){
    if(str.indexOf('--') != -1){
        let l = str.substr(0,str.indexOf('--'))
        let r = str.substr(str.indexOf('--')+2,str.length)
        return l+'\n'+r
    }else{
        return str
    }
}
//对象深拷贝
function objDeepCopy(source){
    var sourceCopy = {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}
function err(res,_that){
    if(res.data.success === '00100003' || res.data.success === '00100002'){
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
    }else{
        _that.$message({
            message: res.data.msg,
            type: 'error',
            content: true
        })
    }
}
export default{
    tampToTime,
    timeToTamp,
    objDeepCopy,
    ToN,
    err
}