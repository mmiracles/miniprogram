//index.js
//获取应用实例
const app = getApp()
//console.log(app.globalData)
Page({
  data: { 
      //数据处理
  },
  //事件处理函数
  onLoad: function() {},
  toDetail(){
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },
  toList(){
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },
  

})