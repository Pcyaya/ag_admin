import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import "babel-polyfill"
import base from './js/base'
import VueLazyLoad from 'vue-lazyload'
// import $ from 'jquery'

global.$ = global.jQuery = $

Vue.config.productionTip = false

Vue.use(Element, $)
Vue.use(VueLazyLoad, {
    error: 'https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/icon_youji_default%403x.png',
    loading:'https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/icon_youji_default%403x.png',
    attempt: 1
})
Vue.prototype.adminUrl = ''
Vue.prototype.OSSImg = 'https://ag-home.oss-cn-beijing.aliyuncs.com/admin_imgs/'
Vue.prototype.OSSGuide = 'https://anygo-imag.oss-cn-beijing.aliyuncs.com/guide_authentication/'
Vue.prototype.OSSFreeback = 'https://anygo-imag.oss-cn-beijing.aliyuncs.com/imgs_travel_notes/'
Vue.prototype.$http = axios
Vue.prototype.$base = base
let str = window.location.href.substring(window.location.href.lastIndexOf('com') + 3, window.location.href.lastIndexOf('com') + 7)
// console.log(str)
if (str.indexOf(':80/') != -1 || str.indexOf(':') === -1) {
    //正式
    Vue.prototype.urlHost = 'http://aetosgo.com/dhome'
    Vue.prototype.urlHosts = 'http://aetosgo.com'
    Vue.prototype.serviceType = 1
} else {
    //测试
    Vue.prototype.urlHost = 'http://aetosgo.com:8080/dhome'
    Vue.prototype.urlHosts = 'http://aetosgo.com:8080'
    Vue.prototype.serviceType = 0
}
// Vue.prototype.urlHost = 'http://localhost:8888/dhome'
// Vue.prototype.urlHost = 'http://192.168.1.204:8888/dhome'


// Vue.prototype.urlHost = 'http://192.168.1.66:8888/dhome'

// Vue.prototype.urlHost = 'http://192.168.1.183:8888/dhome'


// Vue.prototype.urlHost = 'http://aetosgo.com/dhome'
// Vue.prototype.urlHosts = 'http://aetosgo.com'
// Vue.prototype.serviceType = 1
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
