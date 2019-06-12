const app = getApp()
var cover = require('../../utils/cover.js')


//16进制数转ASCLL码
function hexCharCodeToStr(hexCharCodeStr) {
  var trimedStr = hexCharCodeStr.trim();
  var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
  var len = rawStr.length;
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16);
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}

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
    call: '',
    device: '',
    devices: [],
    connected: '',
    canWrite: false,
    service: [],
    character: '',
    dialog: false,
    serviceID: '',
    ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
    ]
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
        if (err.errCode === 10000){
          wx.showToast({
            title: '蓝牙未打开',
            duration:2000
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
      character: ''

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
        wx.onBLEConnectionStateChange(err=>{
          wx.showModal({
            title: '错误',
            content: '蓝牙连接已断开',
          })
          console.log('蓝牙连接已断开',err)
        })
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
      properties: ''
    })
    this.setData({
      canWrite: false
    })
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
        //console.log('services',res)
        // for(let i = 0;i<res.services.length; i++){
        //    if (res.services[i].isPrimary){
        //       this.getChara(res.services[i].uuid)
        //    }

        // }
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
        //监听上面类型的变动
        wx.onBLECharacteristicValueChange(res => {
          // 写入成功回调
          console.log("characteristic", res)
          //解析蓝牙返回数据
          let buffer = res.value;
          let dataView = new DataView(buffer)
          //       console.log("接收字节长度:" + dataView.byteLength)
          var str = ""
          for (var i = 0; i < dataView.byteLength; i++) {
            // str += String.fromCharCode(dataView.getUint8(i))
            str += dataView.getUint8(i).toString(16) + ','
            // console.log(dataView.getUint8(i))
            // console.log(str)
          }
          //       console.log(parseInt(str, 16))
          str = getNowFormatDate() + "收到数据:" + str;
          console.log(hexCharCodeToStr(cover.tohex(buffer)))
          console.log(str)
          this._call = str
          //  that.setData({
          //    receivedata: that.data.receivedata + "\n" + str,
          //  })

        })
      },
      fail: err => {
        console.error('err', err)
      }
    })
  },
notify(){
  wx.notifyBLECharacteristicValueChange({
    state: true, 
    deviceId: this._deviceId,
    serviceId: this._serviceId,
    characteristicId: this._characteristicId,
    success(res) {
      console.log('notifyBLECharacteristicValueChange success', res.errMsg)
    }
  })
},
  //数据写入加了0.5秒的延迟
  writeBle(e) {
    let write = e.detail.value.write;
    console.log(write)
    let buffer = new ArrayBuffer(1);
    let dataView = new DataView(buffer);
    dataView.setUint8(0, write)
    setTimeout(() => {
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
            console.log(getNowFormatDate() + "写入" +buffer)
          },
          fail: err => {
            console.log('写入失败', err)
          }
        })
      }, 500),
      wx.showToast({
        title: '写入完成 ',
      })
  },
  readBle(){
    

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
      
      wx.notifyBLECharacteristicValueChange({
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: list.uuid,
        state: true,
        success: res => {
          wx.showToast({
            title: '可以接收消息',
          })
        },
      })
    }


  }

})