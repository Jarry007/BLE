const app = getApp()

var router = require('../../utils/promise.js')

Page({

  data: {
    isIOS: false

  },

  onLoad: function(options) {
    if (app.globalData.brand == 'iPhone') {
      this.setData({
        isIOS: true
      })
    }

    //初始化蓝牙
    wx.openBluetoothAdapter({
      success: res => {
        console.log({
          '初始化成功': res
        })
      },
      fail: err => {
        console.log({
          '初始化失败': err
        })
        wx.showToast({
          title: '请检查蓝牙是否打开',
          icon: 'none'
        })
      }
    })
  },
  getPhoneNumber(e) {
    console.log(e)
  },
  bindGetUserInfo(e) {
    wx.vibrateShort({})
    const accountInfo = wx.getAccountInfoSync();
    const appid = accountInfo.miniProgram.appId

    wx.login({
      success: res => {
        if (res.code) {
          wx.getUserInfo({
            success: e => {
              let info = {
                encryptedData: e.encryptedData,
                iv: e.iv,
                code: res.code
              }
              router.route_('mp/login', info, appid).then(res => {
                console.log('成功', res)
                wx.setStorageSync('userInfo', res)
              }).catch(
                err => {
                  console.log(err)
                }
              )
            },
            fail: f => {
              console.log('获取系统信息失败', f)
            }
          })
        }
      }
    })
    wx.checkSession({
      success() {},
      fail() {
        wx.login() // 重新登录
      }
    })
  },
  hideModal() {
    this.setData({
      isIOS: true
    })
  },
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