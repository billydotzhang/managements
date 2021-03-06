import fetch from '@/config/fetch'

/*
 *登陆
 */

export const login = data => fetch('/login', data, 'POST')

/*
 *登陆
 */

export const loginInfo = () => fetch('/users/remark/info/self')


/**
 * 获取用户列表
 */

export const searchUser = data => fetch('/users/find', data);

/**
 * 用户列表搜索
 */

export const getUserList = data => fetch('/users/list', data);


/**
 * 退出
 */

export const signout = () => fetch('/logOut');

/**
 * 获取用户信息
 */

export const getAdminInfo = () => fetch('/users/remark/info/self');

/**
 * 获取异常数据
 */

export const getUnusualInfo = data => fetch('/customerService/list', data);

/**
 * 删除设备号
 */

export const delMac = data => fetch('/users/' + data.userId + '/hardwareEquipment', data, "POST");



/**
 * 返回一个生理周期的激素值列表
 */

export const physiologicals = data => fetch('/users/physiologicals/list', data);

/**
 * 获取所有例假开始周期
 */

export const allPeriod = data => fetch('/users/' + data.userId + '/menstruation/info');

/**
 * 获取指定周期图表渲染参数
 */

export const advancedQuery = data => fetch('/users/physiologicals/advancedQuery/list', data);

/**
 * 添加VIP参数
 */

export const vipDataQuery = data => fetch('/users/peak/addVip2/query', data);

/**
 * 是否加入千人计划
 */

export const thousandPlanStatus = data => fetch('/customerService/update/thousandPlanStatus', data, "POST");

/**
 * 客服是否操作
 */

export const customerStatus = data => fetch('/customerService/update/customerStatus', data, "POST");


/**
 * 异常数据搜索
 */

export const customerFind = data => fetch('/customerService/find', data);


/**
 * 异常数据搜索
 */

export const changePwd = data => fetch('/users/sysUser/password/update', data);

/**
 * 发送友盟推送
 */

export const sendUMsg = data => fetch('/informationPush/youmengPush', data, "POST");

/**
 * 获取短信模板
 */

export const fetchGetSMSTemplate = data => fetch('/informationPush/findAllMessageTemplate', data);

/**
 * 发送短信
 */

export const fetchSendSMS = data => fetch('/informationPush/sendMessage', data, "POST");

/**
 * 新建短信模板
 */

export const fetchNewSMSTemplate = data => fetch('/informationPush/saveMessageTemplate ', data, "POST");


export const fetchDeleteSMSTemplate = data => fetch('/informationPush/updatMessageTemplates  ', data, "POST");





// export const ovuPeriod = data => fetch('/users/record/ovuPeriod', data);
