//获取yy-mm-dd
const formatDate = function (time) {
  var date = new Date(time);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  return y + "-" + m + "-" + d;
}

//获取yy-mm-dd hh:mm:ss
const formatDateTime = function (time) {
  var date = new Date(time);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

//某个时间加一天
const dateAdd = function (time) {

  let startDate = new Date(time);

  startDate = +startDate + 1000 * 60 * 60 * 24;
  startDate = new Date(startDate);
  var nextStartDate = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
  return nextStartDate;
}

// 获取间隔天数
const getDays = function (day1, day2) {
  var d1 = day1.get_date();
  var d2 = day2.get_date();
  var dayMilliSeconds = 1000 * 60 * 60 * 24;
  var d1Ms = d1.getTime();
  var d2Ms = d2.getTime();
  var ret;
  for (d1Ms; d1Ms <= d2Ms; d1Ms += dayMilliSeconds) {
    if (!ret) {
      var day = new Date(d1Ms);
      ret = day.getYMD();
    } else {
      var day = new Date(d1Ms);
      ret = ret + ',' + day.getYMD();
    }
  }
  return ret;
}

// 根据某天算几天后的那个时间
const getDate = function (date, i) {
  var datt = date.split(/-/);
  var newDate = new Date(datt[0], datt[1] - 1, datt[2]);
  var befminuts = newDate.getTime() + 1000 * 60 * 60 * 24 * parseInt(i);
  var beforeDat = new Date;
  beforeDat.setTime(befminuts);
  var befMonth = beforeDat.getMonth() + 1;
  var mon = befMonth >= 10 ? befMonth : '0' + befMonth;
  var befDate = beforeDat.getDate();
  var da = befDate >= 10 ? befDate : '0' + befDate;
  var newDate = beforeDat.getFullYear() + '-' + mon + '-' + da;

  return newDate;
}


//获取几天后日期
const GetDateStr = function (AddDayCount, d) {
  var dd = new Date(d);
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1; //获取当前月份的日期
  var d = dd.getDate();
  return y + "-" + m + "-" + d;
}

// 兼容ios日期
function compatibility_ios(time) {
  //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式   
  return time.replace(/\-/g, "/");
}

//每天只取一个值，时间去重
const unique = function (arr) {
  // 反转倒序求重复项, 进行删除
  arr.reverse();
  for (var i = arr.length - 1; i >= 0; i--) {
    var timeStr = arr[i][0].substr(0, 10); // 2018-01-26
    for (var j = i - 1; j >= 0; j--) {
      var tempStr = arr[j][0].substr(0, 10);
      if (timeStr === tempStr) {
        arr.splice(j, 1);
        i--;
      }
    }
  }
  return arr.reverse();
}

//判断是否取整
const isInteger = function (obj) {
  return typeof obj === 'number' && obj % 1 === 0
}

// 给String对象添加getDate方法，使字符串形式的日期返回为Date型的日期
String.prototype.get_date = function () {
  var strArr = this.split('-');
  var date = new Date(strArr[0], strArr[1] - 1, strArr[2]);
  return date;
}

// 给Date对象添加getYMD方法，获取字符串形式的年月日
Date.prototype.getYMD = function () {
  var retDate = this.getFullYear() + "-"; // 获取年份。
  retDate += this.getMonth() + 1 + "-"; // 获取月份。
  retDate += this.getDate(); // 获取日。
  return retDate; // 返回日期。
}


export {
  formatDate,
  formatDateTime,
  compatibility_ios,
  getDays,
  dateAdd,
  getDate,
  GetDateStr,
  unique,
  isInteger
}
