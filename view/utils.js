/**
 * 时间格式化，工具。
 */
export default {
  second2hms: (totalSeconds) => {
    let formatTime = (dt) => {
      let h = dt.getHours(),
        m = dt.getMinutes(),
        s = dt.getSeconds(),
        r = "";
      r += (h > 9 ? h.toString() : "0" + h.toString()) + ":";
      r += (m > 9 ? m.toString() : "0" + m.toString()) + ":";
      r += (s > 9 ? s.toString() : "0" + s.toString());
      return r;
    };

    if (totalSeconds < 86400) {
      let dt = new Date("01/01/2000 0:00");
      dt.setMilliseconds(totalSeconds);
      return formatTime(dt);
    } else {
      return '00:00:00';
    }
  },
  formatDateTime: (date) => {
    date = new Date(date);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    // return y + '-' + m + '-' + d+' '+h+':'+minute;
    return m + '-' + d + ' ' + h + ':' + minute;
  }
};