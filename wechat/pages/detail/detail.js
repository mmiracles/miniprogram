// pages/detail/detail.js
import config from '../../utils/config.js';
var util = require('../../utils/util.js');
var wxApi = require('../../utils/wxApi.js');
var wxRequest = require('../../utils/wxRequest.js');
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
let isFocusing = false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '文章内容',
    detail: {}, //文章的内容
    detailDate: '', //文章发布时间
    wxParseData: [], //文章的html解析内容   
    postID: null, //文章id
    prefixModal: false,
    dialog: {
      title: '',
      content: '',
      hidden: true
    },
    thumbsImage: "heart-o.png", //点赞的图片路径
    thumbsCount: 0, //点赞的数量
    collectCount:0,  //收藏的数量
    loginModal: false,
    userInfo: app.globalData.userInfo,
    type: null,
    id: null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      type: options.type,
      id: options.id
    })
    this.fetchDetailData();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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
    if (this.data.detail.thumbnail) {
      var image = this.data.detail.thumbnail;
    } else {
      var image = this.data.detail.meta.thumbnail;
    }
    return {
      title: '"' + config.getAppSite + '"：' + util.ellipsisHTML(this.data.detail.title.rendered),
      path: 'pages/detail/detail?id=' + this.data.detail.id,
      imageUrl: image,
      success: function(res) {
        // 转发成功
        console.log(res);
      },
      fail: function(res) {
        console.log(res);
        // 转发失败
      }
    }
  },

  /**
   * 点赞/喜欢
   */
  thumbsUpClick: function(e) {
    var id = e.target.id;
    var self = this;
    let data
    let url
    console.log(app.globalData.userInfo)
    if (this.data.type == "文章") { //文章点赞
      data = {
        userId: this.data.userInfo.userId,
        essayId: this.data.id,
      };
      url = app.globalData.serverAddress + "/essay/great"; //点赞接口请求,200点赞成功，501取消点赞，
    }
    // }else{        //景点点赞
    //   data = {
    //     userId: app.globalData.userInfo.userId,
    //     essayId: id
    //   };
    //   url = app.globalData.serverAddress + "/essay/great"; //点赞接口请求,200点赞成功，501取消点赞，
    // }
    console.log(data)
    console.log(url)
    var postThumbsRequest = wxRequest.postRequest(url, data);
    postThumbsRequest.then(response => {
      console.log(response)
      if (response.data.msg == '已点赞') {
        // console.log(response)
        var _thumbsCount = parseInt(self.data.thumbsCount) + 1;
        self.setData({
          thumbsCount: _thumbsCount, //点赞数量加1
        });
        wx.showToast({
          title: '感谢点赞',
          icon: 'success',
          duration: 900,
          success: function() {
            // 点赞成功
          }
        })
      } else if (response.data.msg == '已取消') {

        var _thumbsCount = parseInt(self.data.thumbsCount) - 1;
        self.setData({
          thumbsCount: _thumbsCount, //点赞数量减1
        });
        wx.showToast({
          title: '取消点赞',
          icon: 'none',
          duration: 900,
          success: function() {
            //取消点赞
          }
        })
      } else {
        console.log(response.data.message);
      }
      self.setData({
        thumbsImage: "heart.png"
      });
    })
  },

  /**
   * 收藏
   */
  collectClick: function(e) {
    var id = e.target.id;
    var self = this;
    let data
    let url
    if (this.data.type == "文章") { //文章收藏
      data = {
        userId: this.data.userInfo.userId,
        essayId: this.data.id,
      };
      url = app.globalData.serverAddress + "/essay/collection"; //点赞接口请求,200点赞成功，501取消点赞，
    }
    // }else{        //景点点赞
    //   data = {
    //     userId: app.globalData.userInfo.userId,
    //     essayId: id
    //   };
    //   url = app.globalData.serverAddress + "/essay/great"; //点赞接口请求,200点赞成功，501取消点赞，
    // }
    console.log(data)
    console.log(url)
    var postThumbsRequest = wxRequest.postRequest(url, data);
    postThumbsRequest.then(response => {
      console.log(response)
      if (response.data.msg == '已收藏') {
        // console.log(response)
        wx.showToast({
          title: '感谢收藏',
          icon: 'success',
          duration: 900,
          success: function() {
          }
        })
      } else if (response.data.msg == '已取消') {
        wx.showToast({
          title: '取消收藏',
          icon: 'none',
          duration: 900,
          success: function() {
          }
        })
      } else {
        console.log(response.data.message);
      }
     
    })
  },


  /**
   * 打卡
   */
  dakaClick: function (e) {
    var id = e.target.id;
    var self = this;
    let data = {
      userId: this.data.userInfo.userId,
      viewId: this.data.id
    }
    let url = app.globalData.serverAddress + "/view/daka"    
    console.log(data)
    console.log(url)
    var postThumbsRequest = wxRequest.postRequest(url, data);
    postThumbsRequest.then(response => {
      console.log(response)
      if (response.data.msg == '已打卡') {
        // console.log(response)
        wx.showToast({
          title: '又去了新地方！',
          icon: 'success',
          duration: 900,
          success: function () {
          }
        })
      } else if (response.data.msg == '已取消') {
        wx.showToast({
          title: '取消打卡',
          icon: 'none',
          duration: 900,
          success: function () {
          }
        })
      } else {
        console.log(response.data.message);
      }
      self.setData({
        thumbsImage: "heart.png"
      });
    })
  },

  /**
   * 是否点赞
   */
  getthumbed: function() { // 判断当前用户是否点赞
    var self = this;
    var data = { //传入用户id与文章id
      userid: this.data.userInfo.userId,
      articid: self.data.postID
    };
    var url = app.globalData.serverAddress + ""; //获取是否已经点赞的接口地址
    var postThumbedRequest = wxRequest.postRequest(url, data);
    postThumbedRequest.then(response => {
      if (response.data.status == '200') {
        self.setData({
          thumbsImage: "heart.png"
        });
        console.log(" 已赞过 ");
      }
    })
  },

  /**
   * 点击预览图
   */
  wxParseImg: function(e) {
    var self = this;
    var href = e.currentTarget.dataset.src;
    self.setData({
      previewList: href
    });
    wx.previewImage({
      current: href,
      urls: self.data.previewList
    })
  },

  /**
   * 返回首页
   */
  goHome: function() {
    wx.switchTab({
      url: '../index/index'
    })
  },

  /**
   * 获取文章内容
   */
  fetchDetailData: function() {
    var self = this;
    let url
    let requestData
    if (this.data.type == "文章") { //旅游与攻略调用这个接口
      url = app.globalData.serverAddress + "/essay/one"
      requestData = {
        essayId: this.data.id,
      }
    } else { //景点调用的接口
      url = app.globalData.serverAddress + "/view/one"
      requestData = {
        viewId: this.data.id,
      }
    }
    var getPostDetailRequest = wxRequest.postRequest(url, requestData);
    var res;
    getPostDetailRequest.then(response => {
        res = response;
        console.log(response.data);
        self.setData({
          detail: response.data
        })
        //解析传过来的html页面
        if (self.data.type == "文章") {

          WxParse.wxParse('article', 'html', response.data.content, self, 5);
          var _thumbsCount = response.data.greatNum; //点赞数量

          self.setData({
            detail: response.data,
            thumbsCount: _thumbsCount,
            // collectCount: response.data.col
            detailDate: util.cutstr(response.data.createTime, 10, 1), //解析日期  
          });
        } else if (self.data.type == "景点") {
          WxParse.wxParse('article', 'html', response.data.introducation, self, 5);
          self.setData({
            detail: response.data,
          });
        }
        //end 
      })
      .then(response => {
        let title
        if(self.data.type=="文章"){
          title = response.data.title
        }else{
          title = response.data.viewName
        }
        wx.setNavigationBarTitle({
          title: title
        });
      })
      .catch(function(response) {

      })
      .finally(function(response) {

      });
  },


  /**
   * 弹出框蒙层截断 touchmove 事件
   */
  preventTouchMove: function() {

  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      loginModal: false,
      prefixModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 确认数据
   */
  confirm: function() {
    this.setData({
      'dialog.hidden': true,
      'dialog.title': '',
      'dialog.content': ''
    })
  },


})