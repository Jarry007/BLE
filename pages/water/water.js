// pages/water/water.js
Page({

   /**
    * 页面的初始数据
    */
   data: {
      device :''
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      const deviceList = wx.getStorageSync('device_list')

      if(deviceList.user){
         wx.navigateTo({
            url: 'home',
         })
      }
   },
   deviceNum(e){
      console.log(e)
      this.setData({
         device:e.detail.value
      })
   },
   bindGetUserInfo(){
      wx.login({
         success: res => {
            if (res.code) {
               wx.getUserInfo({
                  success: e => {
                     let info = {
                        code: res.code,
                     }
                     console.log(res.code)
                     wx.request({
                        url: 'http://192.168.2.22:8999/user/wx/phone',
                        method:'POST',
                        header: {
                           'content-type': 'application/x-www-form-urlencoded'
                        },
                        data:{
                           code:res.code
                        },
                        success:suc=>{
                          
                           let setIt = suc.data.data
                           setIt.timestamp = new Date().toLocaleString()
                           wx.setStorageSync('device_list', setIt)
                           wx.navigateTo({
                              // url: 'home?num=' + this.data.device,
                              url:'home'
                           })
                        },fail:f=>{
                           console.log(f)
                        }

                     })
                     // router.route_request('mp/login', info).catch(res => {
                     //    console.log('log', res)
                     //    wx.setStorageSync('final_data', res)
                     //    wx.navigateBack({
                     //       detal: 1
                     //    })
                     // })
                     // wx.navigateTo({
                     //    url: 'home?num=' + this.data.device,
                     // })
                  },
                  fail: f => {
                     console.log('fail,login_fail')
                     wx.showToast({
                        title: '失败',
                     })
                  }
               })
            }
         }
      })
      wx.checkSession({
         success() { },
         fail() {
            wx.login() // 重新登录
         }
      })
   },
   toHome(){
      wx.navigateTo({
         url: 'home?num='+this.data.device,
      })
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
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