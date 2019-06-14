import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login'  //登录
import index from '@/components/index/index'  //主页

import news from '@/components/index/website/news/newslist/news'  //新闻列表
import hiring from '@/components/index/website/hiri/hiringlist/hiring'  //编辑、添加新闻
import newsEdit from '@/components/index/website/news/newsEdit/newsEdit'  //招贤纳士
import hiringEdit from '@/components/index/website/hiri/hiringEdit/hiringEdit'  //编辑、添加招贤纳士
import agent from '@/components/index/website/agent/agent'  //代理商
import contactus from '@/components/index/website/contactus/contactus'  //联系我们
import product from '@/components/index/website/product/product'  //产品订购
import advice from '@/components/index/website/advice/advice'  //投诉建议 

import sos from '@/components/index/equipment/sos/sos'  //sos
import speaker from '@/components/index/equipment/speaker/speaker'  //设备

import report from '@/components/index/mobile/report/report' //举报
import identity from '@/components/index/mobile/identity/identity' //导游身份审核
import freeback from '@/components/index/mobile/freeback/freeback' //问题反馈
import coupon from '@/components/index/mobile/coupon/coupon' //优惠券
import appversion from '@/components/index/mobile/appversion/appversion' //APP版本管理
import kits from '@/components/index/mobile/kits/kits' //生存锦囊
import ushelp from '@/components/index/mobile/ushelp/ushelp' //使用帮助
import users from '@/components/index/mobile/users/users' //用户管理

import menu from '@/components/index/systemsetting/menu/menu' //菜单管理
import personnel from '@/components/index/systemsetting/personnel/personnel'  //部门管理
import user from '@/components/index/systemsetting/user/user' //管理人员管理


import order from '@/components/index/integralmall/order/order' //订单管理
import goods from '@/components/index/integralmall/goods/goods' //商品管理

import error from '@/components/error/err404'

Vue.use(Router)
export default new Router({
  mode: 'history',
  base: 'manweb',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      beforeEnter: (to, from, next) => {
        document.getElementById('titleId').innerHTML = '登录-后台管理-艾侗游'
        next()
      }
    },
    {
      path: '/index',
      // redirect: '/index',
      name: 'index',
      component: index,
      beforeEnter: (to, from, next) => {
        document.getElementById('titleId').innerHTML = '后台管理-艾侗游'
        next()
      },
      children: [
        {
          path: '/news',
          component: news,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '新闻列表-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/newsEdit',
          component: newsEdit,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '编辑新闻-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/hiring',
          component: hiring,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '招聘列表-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/hiringEdit',
          component: hiringEdit,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '编辑招聘-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/agent',
          component: agent,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '代理商-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/contactus',
          component: contactus,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '联系我们-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/product',
          component: product,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '产品订购-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/advice',
          component: advice,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '投诉建议-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/sos',
          component: sos,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = 'SOS键-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/speaker',
          component: speaker,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '设备-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/report',
          component: report,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '用户举报-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/identity',
          component: identity,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '身份认证-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/freeback',
          component: freeback,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '问题反馈-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/coupon',
          component: coupon,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '优惠券-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/appversion',
          component: appversion,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = 'APP版本-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/kits',
          component: kits,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '生存锦囊-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/ushelp',
          component: ushelp,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '使用帮助-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/users',
          component: users,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '用户管理-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/personnel',
          component: personnel,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '部门管理-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/user',
          component: user,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '管理人员管理-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/menu',
          component: menu,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '菜单管理-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/order',
          component: order,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '订单管理-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/goods',
          component: goods,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '商品管理-后台管理-艾侗游'
            next()
          }
        },
        {
          path: '/*',
          component: error,
          beforeEnter: (to, from, next) => {
            document.getElementById('titleId').innerHTML = '404'
            next()
          }
        }
      ]
    }
  ]
})
