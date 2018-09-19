import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const serviceList = r => require.ensure([], () => r(require('@/page/serviceList')), 'serviceList');
const pregnancyEcharts = r => require.ensure([], () => r(require('@/page/pregnancyEcharts')), 'pregnancyEcharts');
const changePassword = r => require.ensure([], () => r(require('@/page/changePassword')), 'changePassword');
const test = r => require.ensure([], () => r(require('@/page/test')), 'test');

export default new Router({
  routes: [{
    path: '/',
    component: login
  }, {
    path: '/manage',
    component: manage,
    name: '',
    children: [{
        path: '/userList',
        component: userList,
        meta: ['数据管理', '用户列表']
      },
      {
        path: '/serviceList',
        component: serviceList,
        meta: ['数据管理', '异常数据']
      },
      {
        path: '/pregnancyEcharts',
        component: pregnancyEcharts,
        meta: ['数据管理', '折线图']
      },
      {
        path: '/changePassword',
        component: changePassword,
        meta: ['修改密码']
      },
      {
        path: '/test',
        component: test,
        meta: ['数据管理', '图标']
      }
    ]
  }]
})
