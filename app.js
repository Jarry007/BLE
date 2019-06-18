//app.js
App({
  onLaunch: function () {
    
    wx.getSystemInfo({
      success: res=>{
        this.globalData.StatusBar = res.statusBarHeight
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - res.statusBarHeight;
        this.globalData.brand = res.brand
      },
    })
    

  },
  globalData: {
    userInfo: null,
    url :''
  }
})                                                            