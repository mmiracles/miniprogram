// pages/rand/rand.js
import config from '../../utils/config.js'
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var wxApi = require('../../utils/wxApi.js');
var wxRequest = require('../../utils/wxRequest.js');
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postsList: [],
    loading: "nodisplay",
    isDidplay:"nodisplay",
    pageNum:1,   //当前页面
    pageSize:5,    //页面大小
    tempbackground:"/images/SearchImage.png"  //背景图片

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.fetchRandomPosts();    
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
    // wx.setStorageSync('openLinkCount', 0);
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
    console.log("lalal")
    var self = this;
    self.fetchRandomPosts();
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '“' + config.getAppSite + '”分享有趣旅行,发现文艺景点',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 获取滑动文章
   */
  fetchRandomPosts: function () {
    wx.showLoading({
      title: '正在获取',
    })
    var self = this;
    let url = app.globalData.serverAddress +'/essay/all'
    let requestData={
      pageNum: this.data.pageNum,
      pageSize:this.data.pageSize
    }
    //获取发现的文章列表（几大看点的混合排列）
    var getPostsRequest = wxRequest.postRequest(url,requestData);
    getPostsRequest.then(response => {
      console.log(response);
      if (response.statusCode == '200' && response.data.length > 0) {
        wx.hideLoading();
        self.data.pageNum++
        self.setData({
          // postsList: response.data,
          postsList: self.data.postsList.concat(response.data)
        });
      } else if(response.statusCode == '200' && (response.data == null || response.data.length==0)) {
       wx.showToast({
         title: '没有更多文章',
         icon:'none'
       }) 
      }
    })
    .then(response => {
      wx.hideLoading()
    })
    .catch(function (response) {
      //console.log(response);
      wx.showToast({
        title: response.errMsg,
      })
    })
    .finally(function () {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 跳转至查看文章详情
   */
  redictDetail: function (e) {
    console.log(e);
    var id = e.currentTarget.id,
      url = '../detail/detail?id='+id+'&type='+'文章';
    wx.navigateTo({
      url: url
    })
  }
})