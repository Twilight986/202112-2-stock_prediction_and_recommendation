// http://momentjs.com/docs/

/** 
 * 
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10  20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10  08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10  08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, 
    "d+": this.getDate(), 
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, 
    "H+": this.getHours(), 
    "m+": this.getMinutes(), 
    "s+": this.getSeconds(), 
    "q+": Math.floor((this.getMonth() + 3) / 3), 
    "S": this.getMilliseconds() 
  };
  var week = {
    "0": "/u65e5",
    "1": "/u4e00",
    "2": "/u4e8c",
    "3": "/u4e09",
    "4": "/u56db",
    "5": "/u4e94",
    "6": "/u516d"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};

/**
 * 
 *
 * @param num 
 */
Date.prototype.plusDays = function (num) {
  var tmp = new Date();
  tmp.setDate(this.getDate() + num);
  return tmp;
};

const Utils = {
  isString(s) {
    return typeof(s) === 'string' || s instanceof String;
  },
  getAllQueryParams() {
    let str = window.location.href;
    if (!str) {
      return {};
    }

    let num = str.indexOf('?');
    str = str.substr(num + 1); 

    const res = {};
    let name;
    let value;

    const arr = str.split('&'); 
    for (let i = 0; i < arr.length; i++) {
      num = arr[i].indexOf('=');
      if (num > 0) {
        name = arr[i].substring(0, num).trim();
        value = arr[i].substr(num + 1).trim();
        res[name] = value;
      }
    }

    return res;
  },
};

export default Utils;
