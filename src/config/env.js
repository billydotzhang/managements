/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = '';
let routerMode = 'hash';
let baseImgPath;
let ip1Conf = '';

if (process.env.NODE_ENV == 'development') {
  baseUrl = '';
  baseImgPath = '/img/';
  ip1Conf = 'api';
} else {
  baseUrl = '//elm.cangdu.org';
  baseImgPath = '//elm.cangdu.org/img/';
  ip1Conf = '';
}

export {
  baseUrl,
  routerMode,
  baseImgPath,
  ip1Conf
}
