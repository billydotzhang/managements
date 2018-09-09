import fetch from '@/config/fetch'
import {
  ip1Conf
} from '@/config/env'

/*
 *登陆
 */

export const login = data => fetch(ip1Conf + '/login', data, 'POST')


/**
 * 获取用户列表
 */

export const getUserList = data => fetch(ip1Conf + '/users/find', data);

/**
 * 退出
 */

export const signout = () => fetch(ip1Conf + '/logOut');

/**
 * 获取用户信息
 */

export const getAdminInfo = () => fetch(ip1Conf + '/users/remark/info/self');

/**
 * 删除设备号
 */

export const delMac = data => fetch(ip1Conf + '/users/' + data.userId + '/hardwareEquipment');

/**
 * 用户列表搜索
 */

export const searchUser = data => fetch(ip1Conf + '/users/physiologicals/list', data);


/**
 * 返回一个生理周期的激素值列表
 */

export const physiologicals = data => fetch(ip1Conf + '/users/physiologicals/list', data);

/**
 * 获取所有例假开始周期
 */

export const allPeriod = data => fetch(ip1Conf + '/users/' + data.userId + '/menstruation/info');




// export const ovuPeriod = data => fetch(ip1Conf + '/users/record/ovuPeriod', data);
