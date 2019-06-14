function FillString(t, c, n, b) {
  if ((t == "") || (c.length != 1) || (n <= t.length)) {
    return t;
  }
  var l = t.length;
  for (var i = 0; i < n - l; i++) {
    if (b == true) {
      t = c + t;
    } else {
      t += c;
    }
  }
  return t;
}

function HexToSingle(t) {
  t = t.replace(/\s+/g, "");
  if (t == "") {
    return "";
  }
  if (t == "00000000") {
    return "0";
  }
  if ((t.length > 8) || (isNaN(parseInt(t, 16)))) {
    return "Error";
  }
  if (t.length < 8) {
    t = FillString(t, "0", 8, true);
  }
  t = parseInt(t, 16).toString(2);
  t = FillString(t, "0", 32, true);
  var s = t.substring(0, 1);
  var e = t.substring(1, 9);
  var m = t.substring(9);
  e = parseInt(e, 2) - 127;
  console.log("e",e)
  m = "1" + m;
  console.log('m2',m)
  if (e >= 0) {
    m = m.substr(0, e + 1) + "." + m.substring(e + 1)
  } else {
    m = "0." + FillString(m, "0", m.length - e - 1, true)
  }
  if (m.indexOf(".") == -1) {
    m = m + ".0";
  }
  var a = m.split(".");
  var mi = parseInt(a[0], 2);
  var mf = 0;
  for (var i = 0; i < a[1].length; i++) {
    mf += parseFloat(a[1].charAt(i)) * Math.pow(2, -(i + 1));
  }
  m = parseInt(mi) + parseFloat(mf);
  if (s == 1) {
    m = 0 - m;
  }
  return m;
  ''
}


var CRC = {};

CRC.CRC16 = function (data) {
  var len = data.length;
  if (len > 0) {
    var crc = 0xFFFF;

    for (var i = 0; i < len; i++) {
      crc = (crc ^ (data[i]));
      for (var j = 0; j < 8; j++) {
        crc = (crc & 1) != 0 ? ((crc >> 1) ^ 0xA001) : (crc >> 1);
      }
    }
    var hi = ((crc & 0xFF00) >> 8);  //高位置
    var lo = (crc & 0x00FF);         //低位置

    return [hi, lo];
  }
  return [0, 0];
};

CRC.isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

CRC.ToCRC16 = function (str, isReverse) {
  return CRC.toString(CRC.CRC16(CRC.isArray(str) ? str : CRC.strToByte(str)), isReverse);
};

CRC.ToModbusCRC16 = function (str, isReverse) {
  return CRC.toString(CRC.CRC16(CRC.isArray(str) ? str : CRC.strToHex(str)), isReverse);
};

CRC.strToByte = function (str) {
  var tmp = str.split(''), arr = [];
  for (var i = 0, c = tmp.length; i < c; i++) {
    var j = encodeURI(tmp[i]);
    if (j.length == 1) {
      arr.push(j.charCodeAt());
    } else {
      var b = j.split('%');
      for (var m = 1; m < b.length; m++) {
        arr.push(parseInt('0x' + b[m]));
      }
    }
  }
  return arr;
};

CRC.convertChinese = function (str) {
  var tmp = str.split(''), arr = [];
  for (var i = 0, c = tmp.length; i < c; i++) {
    var s = tmp[i].charCodeAt();
    if (s <= 0 || s >= 127) {
      arr.push(s.toString(16));
    }
    else {
      arr.push(tmp[i]);
    }
  }
  return arr;
};

CRC.filterChinese = function (str) {
  var tmp = str.split(''), arr = [];
  for (var i = 0, c = tmp.length; i < c; i++) {
    var s = tmp[i].charCodeAt();
    if (s > 0 && s < 127) {
      arr.push(tmp[i]);
    }
  }
  return arr;
};

CRC.strToHex = function (hex, isFilterChinese) {
  hex = isFilterChinese ? CRC.filterChinese(hex).join('') : CRC.convertChinese(hex).join('');

  //清除所有空格
  hex = hex.replace(/\s/g, "");
  //若字符个数为奇数，补一个0
  hex += hex.length % 2 != 0 ? "0" : "";

  var c = hex.length / 2, arr = [];
  for (var i = 0; i < c; i++) {
    arr.push(parseInt(hex.substr(i * 2, 2), 16));
  }
  return arr;
};

CRC.padLeft = function (s, w, pc) {
  if (pc == undefined) {
    pc = '0';
  }
  for (var i = 0, c = w - s.length; i < c; i++) {
    s = pc + s;
  }
  return s;
};

CRC.toString = function (arr, isReverse) {
  if (typeof isReverse == 'undefined') {
    isReverse = true;
  }
  var hi = arr[0], lo = arr[1];
  return CRC.padLeft((isReverse ? hi + lo * 0x100 : hi * 0x100 + lo).toString(16).toUpperCase(), 4, '0');
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverd: '',
    crc:''

  },
  cover(e) {
    
    let data_ = e.detail.value
    let crc =  CRC.ToModbusCRC16(data_)
    let head = crc.substring(0,2)
    let foot = crc.substring(2)
    console.log(foot+head)
    let data_float = HexToSingle(data_)
    this.setData({
      coverd: data_float,
      crc:foot+head
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})