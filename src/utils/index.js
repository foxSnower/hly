import is from 'is-js';
import Vue from 'vue';
import { Toast } from 'mint-ui';
// 设置本地址存储
const $U = {
  setLocalStorage: (name, value) => {
    if (!name || !value) {
      console.log('params is invalid!')
    }
    if (is.object(value)) {
      value = JSON.stringify(value)
    }
    localStorage.setItem(name, value)
  },
  getLocalStorage: (name) => {
    if (!name) {
      console.log('param is empty!')
    }
    try {
      return JSON.parse(localStorage.getItem(name))
    } catch (err) {
      return localStorage.getItem(name)
    }
  },
  delLocalStorage: (name) => {
    if (!name) {
      console.log('param is empty!')
    }
    localStorage.removeItem(name)
  },
  // 验证规则
  validator: {
    normal: (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error(rule.name + '不能为空!'));
      } else {
        callback();
      }
    },
    phone: (rule, value, callback) => {
      if (!value) {
        return callback(new Error(rule.name + '不能为空!'));
      }
      let regex = new RegExp(/^1[34578]\d{9}$/);
      if (regex.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的' + rule.name));
      }
    },
    email: (rule, value, callback) => {
      if (!value) {
        return callback(new Error(rule.name + '不能为空!'));
      }
      let regex = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
      if (regex.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的' + rule.name));
      }
    },
    url: (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error(rule.name + '不能为空!'));
      }
      let regex = new RegExp(/(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/);
      if (regex.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的' + rule.name));
      }
    },
    number: (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error(rule.name + '不能为空!'));
      }
      if (isNaN(value)) {
        return callback(new Error('请输入数值'));
      } else {
        callback();
      }
    },
    /**
     * 台胞证
     * https://www.jb51.net/article/73496.htm
     */
    taiwan: (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error(rule.name + '不能为空!'));
      }
      var re1 = new RegExp(/^[0-9]{8}$/);
      var re2 = new RegExp(/^[0-9]{10}$/);
      if (re1.test(value) || re2.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的' + rule.name));
      }
    },
    homeCard: (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error(rule.name + '不能为空!'));
      }
      var re1 = new RegExp(/^[a-zA-Z]\d{8}$/);
      if (re1.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的' + rule.name));
      }
    },
    /**
     * 护照
     * https://www.jb51.net/article/73496.htm
     */
    passport: (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error(rule.name + '不能为空!'));
      }
      var re1 = new RegExp(/^[a-zA-Z]{5,17}$/);
      var re2 = new RegExp(/^[a-zA-Z0-9]{5,17}$/);
      if (re1.test(value) || re2.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的' + rule.name));
      }
    },
    /**
     * 身份证
     * https://www.jb51.net/article/73496.htm
     */
    identity: (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error(rule.name + '不能为空!'));
      }
      let isRight = $U.validateIdCard(value);
      if (isRight) {
        callback();
      } else {
        callback(new Error('请输入正确的' + rule.name));
      }
    },
  },
  //身份证验证 validateIdCard('452428199505020325')=====返回true
  //根据身份证判断性别以前出生年月 validateIdCard('452428199505020325',true)=====返回Object
  validateIdCard: (id, backInfo) => {
    let info = {
      y: "1900",
      m: "01",
      d: "01",
      sex: "male",
      valid: false,
      length: 0
    },
      initDate = function (length) {
        info.length = length;
        let a = length === 15 ? 0 : 2, // 15:18
          temp;
        info.y = (a ? "" : "19") + id.substring(6, 8 + a);
        info.m = id.substring(8 + a, 10 + a);
        info.d = id.substring(10 + a, 12 + a);
        info.sex = id.substring(14, 15 + a) % 2 === 0 ? "1" : "0"; //0男 1女
        temp = new Date(info.y, info.m - 1, info.d);
        return (temp.getFullYear() == info.y * 1) &&
          (temp.getMonth() + 1 == info.m * 1) &&
          (temp.getDate() == info.d * 1);
      },
      back = function () {
        return backInfo ? info : info.valid;
      };
    if (typeof id !== "string") return back();
    // 18
    if (/^\d{17}[0-9x]$/i.test(id)) {
      if (!initDate(18)) return back();
      id = id.toLowerCase().split("");
      let wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
        y = "10x98765432".split(""),
        sum = 0;
      for (let i = 0; i < 17; i++) sum += wi[i] * id[i];
      if (y[sum % 11] === id.pop().toLowerCase()) info.valid = true;
      return back();
    }
    // 15
    else if (/^\d{15}$/.test(id)) {
      if (initDate(15)) info.valid = true;
      return back();
    } else {
      return back();
    }
  },
  //16进制转10进制
  toParse16: (val) => {
    if (val != null) {
      return parseInt(val, 16);
    } else {
      return val;
    }
  },
  //10进制转16进制
  toParse10: (val) => {
    if (val != null) {
      let zero = '';
      val = val.toString(16);
      if (val.length != 6) {
        for (let i = 0; i < 6 - val.length; i++) {
          zero += '0';
        }
      }
      return zero + val.toString(16)
    } else {
      return val;
    }
  },
  theme: (val) => {
    let theme = $U.toParse16(val.split('#')[1]);
    let lightColor = '#' + $U.toParse10(theme + 4264434);
    let deepColor = '#' + $U.toParse10(theme - 3889035);
    return {
      theme: val,
      lightColor,
      deepColor
    };
  },
  validator: {
    name(val) {
      if (val == null) {
        Toast('姓名不能为空');
        return false
      } else {
        return true
      }
    },
    idCard(val) {
      if (val == null) {
        Toast('身份证不能为空');
        return false
      } else {
        let isRight = $U.validateIdCard(val);
        if (isRight) {
          return true
        } else {
          Toast('身份证不存在或格式错误');
          return false
        }
      }
    },
    phone(val) {
      if (val == null) {
        Toast('手机号不能为空');
        return false
      } else {
        let regex = new RegExp(/^1[34578]\d{9}$/);
        if (regex.test(val)) {
          return true
        } else {
          Toast('手机号格式错误');
          return false
        }
      }
    }
  },
  //日期转换---getDateStr(Sun Jul 14 2019 14:51:07 GMT+0800 (中国标准时间))
  getDateStr(dd) {
    dd.setDate(dd.getDate());//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    if (m < 10) m = "0" + m;
    if (d < 10) d = "0" + d;
    return y + "-" + m + "-" + d;
  },
  //日期相差天数 --getDays("2012-12-01","2012-12-25")
  getDays(strDateStart, strDateEnd) {
    var strSeparator = "-"; //日期分隔符
    var oDate1;
    var oDate2;
    var iDays;
    oDate1 = strDateStart.split(strSeparator);
    oDate2 = strDateEnd.split(strSeparator);
    var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
    var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
    iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数 
    return iDays;
  },
  getDate(strDate){
    var strSeparator = "-"; //日期分隔符
    var oDate;
    oDate = strDate.split(strSeparator);
    var strDateS = new Date(oDate[0], oDate[1] - 1, oDate[2]);
    return strDateS;
  }
}
Vue.prototype.$U = $U;

export default $U
