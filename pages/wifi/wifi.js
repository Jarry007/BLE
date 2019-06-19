import * as echarts from '../../ec-canvas/echarts';
const app = getApp()
var cover = require('../../utils/cover.js')
var chart = null
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
    " " + date.getHours() + seperator2 + date.getMinutes() +
    seperator2 + date.getSeconds();
  return currentdate;
}

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    call: '',
    device: '',
    devices: [],
    connected: '',
    canWrite: false,
    service: [],
    character: '',
    dialog: false,
    serviceID: '',
    notifyMsg: [],
    temperature:'',
    humidity:'',
    timestamp: ['17:12', '17:12', '17:12', '17:12', '17:12', '17:12', '17:12'],
    tl:[-25,-24,25,27,27,27,27],
    hl:[39,44,45,47,41,38,36] ,
    ColorList: app.globalData.ColorList
  },
  onReady:function(){
    this.lineCharts = this.selectComponent('#chart-line');
    console.log(this.lineCharts)
    this.judge()
  },
  judge() {
    if (!chart) {
      this.initLine()
    } else {
      this.setOption(chart)
    }
  },
  initLine() {
    this.lineCharts.init((canvas, width, height) => {
      chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(chart);
      return chart
    })
  },
  setOption: function (chart) {
    console.log(chart)
    //chart.clear();  // 清除
    chart.setOption(this.getData());  //获取新数据
  },
  getData() {
    let option = {
      title: {
        text: '温度、湿度变化表',
        left: 'center',
      },
      color: ["#FF6666", "#3366FF"],
      legend: {
        data: ['温度', '湿度'],
        top: 20,
        left: 'center',
        z: 100
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        nameRotate:30,
        data:this.data.timestamp,
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        axisLable: {
          formatter: "{value} ℃"
        },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
        // show: false
      },
      series: [{
        name: '温度',
        type: 'line',
        smooth: true,
        data: this.data.tl,
      }, {
        name: '湿度',
        type: 'line',
        smooth: true,
        data: this.data.hl
      },]
    }
    return option
  },
  //初始化蓝牙
  openBLE() {
    wx.openBluetoothAdapter({
      success: res => {
        wx.showToast({
          title: '初始化成功',
          icon: 'none'
        })
        this.searchBLE()
      },
      fail: err => {
        if (err.errCode === 10000) {
          wx.showToast({
            title: '蓝牙未打开',
            duration: 2000
          })
        }
        if (err.errCode === 10001) {
          wx.onBluetoothAdapterStateChange(res => {
            if (res.available) {
              this.searchBLE()
            }
          })
        } else {
          wx.showToast({
            title: '请检查蓝牙是否打开',
            icon: 'none'
          })
        }
      }
    })
  },
  //关闭蓝牙
  closeBLE() {
    wx.closeBluetoothAdapter({
        success: res => {
          wx.showToast({
            title: '关闭蓝牙',
          })
        },
      }),
      this._Start = false
    this.setData({
      devices: [],
      connected: '',
      properties: '',
      character: '',
      notifyMsg: []
    })
  },
  //搜索设备
  searchBLE() {
    this._Start = true
    wx.showToast({
      title: '开始搜索',
      icon: 'none'
    })
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: res => {
        console.log('搜索成功', res)
        wx.showToast({
          title: '结果如下',
          icon: 'none'
        })
        this.lisentBLE()

      },
    })
  },
  //停止蓝牙搜索
  stopSearch() {
    wx.stopBluetoothDevicesDiscovery({
      success: res => {
        wx.showToast({
          title: '停止蓝牙搜索',
          icon: 'none'
        })
      },
    })
  },
  //动态监听设备
  lisentBLE() {
    wx.onBluetoothDeviceFound(res => {
      var that = this;
      res.devices.forEach(
        device => {
          const allDevices = that.data.devices;
          const data = {}
          const index_ = cover.inArray(device.deviceId, allDevices, 'deviceId')
          if (index_ === -1) {
            data[`devices[${allDevices.length}]`] = device
          } else {
            data[`devices[${index_}]`] = device
          }
          that.setData(data)
        }
      )
    })

  },
  //连接设备
  connectBLE(e) {
    let id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name;
    //console.log(id)
    wx.showToast({
      title: '正在连接设备',
      icon: 'none'
    })

    wx.createBLEConnection({
      deviceId: id,
      timeout: 3500,
      success: res => {
        console.log('连接建立成功', res)
        let info = {
          connected: true, //显示该设备信息
          name: name,
          deviceId: id //从这里开始将 连接设备的id存入了data中
        }
        this.setData({
          connected: info
        })

        this.stopSearch()
        this.getBLEdevice()
      },
    })
  },
  //断开连接
  closeConnect() {
    wx.closeBLEConnection({
      deviceId: this.data.connected.deviceId,
      success: res => {
        wx.showToast({
          title: '成功断开连接',
          icon: 'success'
        })
      },
    })
    this.setData({
      properties: '',
      canWrite: false,
      character: ''
    })
    this.clearNote()
    console.log('无残留?', this.data.connected)
  },
  //获取设备服务
  getBLEdevice() {
    wx.getBLEDeviceServices({
      deviceId: this.data.connected.deviceId,
      success: res => {
        this.setData({
          service: res.services,
          dialog: true
        })
      },
    })

  },

  //所有服务类型(r,w,n,i)
  getChara(uuid) {
    let deviceId = this.data.connected.deviceId
    //获取服务类型需要两个参数（serviceId,通过数据绑定传过来的UUID；devicedId,从data中取来）
    wx.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: uuid,
      success: res => {
        console.log(res.characteristics)
        this.setData({
          character: res.characteristics,
          serviceID: uuid
        })
      },
      fail: err => {
        console.error('err', err)
      }
    })
  },
  readMsg() {

    wx.readBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId: this._serviceId,
      characteristicId: this._characteristicId,
      success: function(res) {
        console.log('成功', res)
      },
    })
  },
  notify() {
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: this._deviceId,
      serviceId: this._serviceId,
      characteristicId: this._characteristicId,
      success(res) {
        console.log('监听数据如下', res.errMsg)
      }
    })
    wx.onBLECharacteristicValueChange(res => {
      let str = cover.tohex(res.value) //将ArrayBuffer 转化成 hex 16进制
      console.log(str)
      let crc = cover.CRC.ToModbusCRC16(str.substring(0, 14)) //取前14位进行 crc 转化
      let head = crc.substring(0, 2), //取出地位信息
        getCrc = str.slice(-2).toLocaleUpperCase(), //取出数据中的crc低位信息
        fnc = str.substring(0, 2), //function code，状态码
        codeType = str.substring(2, 6), //数据类型
        hex = str.substring(6, 14); //hex 数据
      if (fnc === '06' && head === getCrc) {
        switch (codeType) {
          case '0001': //温度
            let temperature = cover.HexToSingle(hex) //转化为float类型
            let tl = [{
              time:getNowFormatDate(),
              temperature : temperature
            }]
            this.setData({
              tl: this.data.tl.concat(temperature),
              temperature:temperature,
              timestamp: this.data.timestamp.concat(getNowFormatDate())
            })
            console.log(this.data.tl)
            this.judge()
            console.log('ok')
            break;
          case '0002': //湿度
            let humidity = cover.HexToSingle(hex)
            let hl = [{
              time:getNowFormatDate(),
              humidity: Math.round(humidity * 1000) / 1000
            }]
            this.setData({
              hl: this.data.hl.concat([Math.round(humidity * 1000) / 1000]),
              humidity:humidity,
              timestamp: this.data.timestamp.concat(getNowFormatDate())
            })
            this.judge();
            break;
          case '0003': //温度上限
            let temUpper = cover.HexToSingle(hex)
            console.log('温度上限', temUpper)
            break;
          case '0004': //温度下限
            let temLower = cover.HexToSingle(hex)
            console.log('温度下限', temLower);
            break;
          case '0005': //湿度上限
            let humUpper = cover.HexToSingle(hex)
            console.log('湿度上限', humUpper)
            break;
          case '0006': //湿度下限
            let humLower = cover.HexToSingle(hex)
            console.log('湿度下限', humLower)
            break;
          default:
            console.log('无法找到')
        }
      }

      this.setData({
        notifyMsg: this.data.notifyMsg.concat(str)
      })
    })
  },
  //数据写入加了0.5秒的延迟
  writeBle(e) {
    let write = e.detail.value.write;
    console.log(write)
    let buffer = new ArrayBuffer(1);
    let dataView = new DataView(buffer);
    dataView.setUint8(0, write)

    wx.writeBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId: this._serviceId,
      characteristicId: this._characteristicId,
      value: buffer,
      success: res => {
        console.log('写入成功', res)
        this.setData({
          call: getNowFormatDate() + "写入" + cover.tohex(buffer)
        })
        console.log(getNowFormatDate() + "写入" + buffer)
      },
      fail: err => {
        console.log('写入失败', err)
      }
    })

    wx.showToast({
      title: '写入完成 ',
    })
  },
  chooseSer(e) {
    let uuid = e.currentTarget.dataset.uuid;
    this.getChara(uuid)
    this.setData({
      dialog: false
    })
  },
  hideModal() {
    this.setData({
      dialog: false,
    })
  },
  clearNote() {
    this.setData({
      notifyMsg: []
    })
  },
  choosePro(e) {
    let uuid = e.currentTarget.dataset.uuid,
      num = e.currentTarget.dataset.num,
      deviceId = this.data.connected.deviceId,
      serviceId = this.data.serviceID,
      character = this.data.character;

    this.setData({
      properties: character[num]
    })

    let list = character[num]
    this._deviceId = deviceId
    this._serviceId = serviceId
    this._characteristicId = list.uuid
    if (list.properties.read) {
      wx.readBLECharacteristicValue({
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: list.uuid,
        success: res => {
          wx.showToast({
            title: '可以读取',
            duration: 2000
          })
        },
      })
    }
    if (list.properties.write) {
      wx.showToast({
        title: '可以写入',
        duration: 2000

      })
      this.setData({
        canWrite: true
      })
      //this.writeBle()


    }
    if (list.properties.notify || list.properties.indicate) {
      this.setData({
        canNotify: true
      })
    }


  }

})