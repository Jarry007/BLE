function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进度
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
    list:''

  },

  //查找周围设备
  startSearch(){
    wx.startBluetoothDevicesDiscovery({
      success:res=>{
        this.blueList() 
      },
      fail:err=>{
        console.log({'搜索失败':err})
        wx.showToast({
          title: '搜索失败',
          icon:'none'
        })
      }
    })
  },

  //关闭蓝牙
  close(){
    wx.stopBluetoothDevicesDiscovery({
      success:res=>{
        console.log({'关闭成功':res})
      }
    })
  },

  //获取蓝牙列表
  blueList(){
    setTimeout(()=>{ //定时器，为了防止数据渲染不完整
    wx.getBluetoothDevices({
      success: res=>{
        console.log(res)
        this.setData({
          list:res.devices
        })
        if (res.devices[0]) {
         
        }
      }
    })
    },2000)
    var that = this;
    setTimeout(()=>{
    wx.onBluetoothDeviceFound(function (devices) {
      console.log(devices.devices)
    })
    let list_ = that.data.list
    for(let i=0;i<list_.length();i++){
      if (list_[i]){

      }
    }
    },2000)

  },
  onLoad: function (options) { //初始化蓝牙
    wx.openBluetoothAdapter({
      success: res=>{
        console.log({'初始化成功':res})
      },
      fail:err=>{
        console.log({'初始化失败':err})
        wx.showToast({
          title: '请检查蓝牙是否打开',
          icon: 'none'
        })
      }
    })
  },

  //连接设备
  connect(){
  wx.createBLEConnection({
    // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
    deviceId,
    success(res) {
      console.log(res)
    }
  })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})