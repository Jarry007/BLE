const app = getApp()

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

Page({
  data: {
    devices: [],
    connected: false,
    chs: [],
  },
  hideModal(e) {
    this.setData({
      connected: null
    })
  },
 
  openBluetoothAdapter() {
    wx.openBluetoothAdapter({ //初始化蓝牙模块
      success: (res) => {
        // 查找周围蓝牙
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        if (res.errCode === 10001) {//当前设备不可用
          wx.onBluetoothAdapterStateChange(function (res) {//监听设备状态
            if (res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  },
  getBluetoothAdapterState() {
    wx.getBluetoothAdapterState({ //获取本机蓝牙适配器状态
      success: (res) => {
        console.log('getBluetoothAdapterState', res)
        if (res.discovering) {
          this.onBluetoothDeviceFound()
        } else if (res.available) {
          this.startBluetoothDevicesDiscovery()
        }
      }
    })
  },
  //查找周围蓝牙
  startBluetoothDevicesDiscovery() {
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,//RSSI动态上报
      success: (res) => {
        this.onBluetoothDeviceFound()
      },
    })
  },
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery()
  },

  //动态监听，持续上报
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.data.devices
        //inArray 查找指定值，返回index
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.setData(data)
      })
    })
  },

  //连接蓝牙
  createBLEConnection(e) {
    const deviceId = e.currentTarget.dataset.deviceId
    const name = e.currentTarget.dataset.name
    //连接低功耗
    wx.createBLEConnection({
      deviceId,
      success: (res) => {
        this.setData({
          connected: true,
          name,
          deviceId,
        })
        this.getBLEDeviceServices(deviceId)
      }
    })
    this.stopBluetoothDevicesDiscovery()
  },
  
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
      canWrite: false,
    })
  },

  //获取连接设备的所有服务
  getBLEDeviceServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        console.log(res)
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            console.log('services',res.services[i])
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
          }
        }
      }
    })
  },

  //服务的所有值（r,w,n,i）
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId, //uuid
      success: (res) => {
        for (let i = 0; i < res.characteristics.length; i++) {
         
          let item = res.characteristics[i]
          console.log('all',item)
          // 类型值
          if (item.properties.read) {
            wx.readBLECharacteristicValue({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              success(res){
                console.log('read',res)
              }
            })
          }
          if (item.properties.write) {
            this.setData({
              canWrite: true
            })
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
          //  this.writeBLECharacteristicValue()
          }
          if (item.properties.notify || item.properties.indicate) {
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
            })
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })

    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((characteristic) => {
      console.log(characteristic)
      console.log(`服务-${characteristic.characteristicId}发生了变化,${characteristic.value}`)
      console.log(ab2hex(characteristic.value))
      const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)

      const data = {}
      if (idx === -1) {
        data[`chs[${this.data.chs.length}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      } else {
        data[`chs[${idx}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      }
      // data[`chs[${this.data.chs.length}]`] = {
      //   uuid: characteristic.characteristicId,
      //   value: ab2hex(characteristic.value)
      // }
      this.setData(data)
    })
  },

  //写入数据
  writeBLECharacteristicValue() {
    // 向蓝牙设备发送一个0x00的16进制数据
    wx.showToast({
      title: '写入中',
      icon:'loading',
      duration:2000
    })
    let buffer = new ArrayBuffer(2)
    let dataView = new DataView(buffer)
    dataView.setUint8(0,2)
    console.log({
      "deviceId":this._deviceId,
      'servicedId':this._serviceId,
      'chara':this._characteristicId,
      'value':ab2hex(buffer)
    })
    setTimeout(()=>{
      wx.writeBLECharacteristicValue({
        deviceId: this._deviceId,
        serviceId: this._serviceId,
        characteristicId: this._characteristicId,
        value: buffer,
        success(res) {
          console.log('success', res)
        },
        fail(err) {
          console.log('fail', err)
        }
      })
    },1000)
    
  ,
    wx.showToast({
      title: '写入完成 ',
    })
  },

  //关闭蓝牙
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },
})

// let senddata = 'test'
// let buffer = new ArrayBuffer(senddata.length)
// let dataView = new DataView(buffer)
// for (var i = 0; i < senddata.length; i++) {
//   dataView.setUint8(i, senddata.charAt(i).charCodeAt())
// }