export default {
  second2hms: (second) => {
    let s = second / 1000;
    s = parseInt(s % 60, 10);
    let m = parseInt(s / 60, 10);
    let h = parseInt(m / 60, 10);
    
    s = s < 10 ? '0' + s : s;
    m = m < 10 ? '0' + m : m;
    h = h < 10 ? '0' + h : h;

    return `${h}:${m}:${s}`;
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
    return m + '-' + d+' '+h+':'+minute;  
  }
}