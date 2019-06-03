const app = getApp()
// inArray 函数 找到返回index，找不到返回-1
// val 要查找的值 arr 被查找的列表 key列表中的值

function inArray(val, arr, key) {
   for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] === val) {
         return i
      }
   }
   return -1;
}

//ArrayBuffer 转16进制字符串

function tohex(buffer) {
   var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function(bit) {
         return ('00' + bit.toString(16)).slice(-2)
      }
   )
   return hexArr.join('');
}

Page({
   data: {
      device: '',
      devices: [],
      connected: '',
      canWrite:false
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
            if (err.errCode === 10001) {
               wx.onBluetoothAdapterStateChange(res => {
                  if (res.available) {
                     setTimeout(() => {
                        this.searchBLE()
                     }, 2000)
                  }
               })
            }else{
                wx.showToast({
                  title: '请检查蓝牙是否打开',
                  icon: 'none'
                })
            }
         }
      })
   },
   //关闭蓝牙
   closeBLE(){
      wx.closeBluetoothAdapter({
         success: res=>{
            wx.showToast({
               title: '关闭蓝牙',
            })
         },
      }),
      this._Start = false
   },
   //搜索设备
   searchBLE() {
      if (this._Start) {
         return
      }
      this._Start = true
      wx.showToast({
         title: '开始搜索',
         icon: 'none'
      })
      wx.startBluetoothDevicesDiscovery({
         allowDuplicatesKey: true,
         success: res => {
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
               if (!device.name && !device.localName) {
                  return
               }
               const allDevices = that.data.devices;
               const data = {}
               const index_ = inArray(device.deviceId, allDevices, 'deviceId')
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
      console.log(id)
      wx.showToast({
         title: '正在连接设备',
         icon: 'none'
      })

      wx.createBLEConnection({
         deviceId: id,
         success: res => {
            let info = {
               connected: true,
               name: name,
               deviceId: id
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
      let info = {
         connected: false,
      }
      this.setData({
         connected: info
      })
   },
   //获取设备服务
   getBLEdevice() {
      wx.getBLEDeviceServices({
         deviceId: this.data.connected.deviceId,
         success: res=>{
           console.log('services',res)
            for(let i = 0;i<res.services.length; i++){
               if (res.services[i].isPrimary){
                  this.getChara(res.services[i].uuid)
               }

            }
         },
      })

   },

   //所有服务类型
   getChara(uuid) {
      let deviceId = this.data.connected.deviceId
      wx.getBLEDeviceCharacteristics({
         deviceId:deviceId,
         serviceId:uuid,
         success:res=>{
           console.log(res)
            for(let i=0;i<res.characteristics.length;i++){
               let list = res.characteristics[i]
               console.log({'list':list.properties})
               if(list.properties.read){
                  wx.readBLECharacteristicValue({
                     deviceId: deviceId,
                     serviceId: uuid,
                     characteristicId:list.uuid ,
                     success: res=>{
                        wx.showToast({
                           title: '可以读取',
                           duration:2000
                        })
                     },
                  })
               }
              if (list.properties.write){
                wx.showToast({
                  title:'可以写入',
                  duration:2000
            
                })
                  this.setData({
                     canWrite:true
                  })
                this._deviceId = deviceId
                this._serviceId = uuid
                this._characteristicId = list.uuid
                this.writeBle()


               }
              if (list.properties.notify || list.properties.indicate){
                  wx.notifyBLECharacteristicValueChange({
                     deviceId: deviceId,
                     serviceId: uuid,
                     characteristicId: list.uuid,
                     state: true,
                     success: res=>{
                        wx.showToast({
                           title: '可以接收消息',
                        })
                     },
                  })
               }
            }
         }
      })
   },

   //数据写入
  writeBle(){
    wx.showToast({
      title: '写入中',
      icon: 'loading',
      duration: 2000
    })
    let buffer = new ArrayBuffer(1)
    let dataView = new DataView(buffer)
    dataView.setUint8(0, 0)
    console.log({
      "deviceId": this._deviceId,
      'servicedId': this._serviceId,
      'chara': this._characteristicId,
      'value': tohex(buffer)
    })
    setTimeout(() => {
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
        },
        complete(e) {
          console.log('e', e)
        }
      })
    }, 1000)
      ,
      wx.showToast({
        title: '写入完成 ',
      })
  }

})