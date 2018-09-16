/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
// let baseUrl = '';
// let routerMode = 'hash';
let baseImgPath;
let ip1Conf = '';
let ip2Conf = '';

if (process.env.NODE_ENV == 'development') {
  // baseUrl = '';
  baseImgPath = '/img/';
  ip1Conf = 'api/manager';
} else {
  // baseUrl = '//elm.cangdu.org';
  baseImgPath = '';
  ip1Conf = '/manager';
}

export {
  // baseUrl,
  // routerMode,
  baseImgPath,
  ip1Conf,
  ip2Conf
}
