const app = getApp()

function route_(route,info,appid) {

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.url}${route}`,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'appid': appid
      },
      method: 'POST',
      data: {
        info: JSON.stringify(info)
      },
      success: res => {
        if (res.data.code == 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: err => {
        reject('回调失败', res.data)
      }
    })
  })
}

module.exports = {
  route_: route_
}