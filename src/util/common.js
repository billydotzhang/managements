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
  startDate = new Date(time);
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


export {
  formatDate,
  formatDateTime
}
