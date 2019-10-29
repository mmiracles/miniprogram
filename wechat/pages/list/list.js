// pages/list/list.js
import config from '../../utils/config.js';
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var wxApi = require('../../utils/wxApi.js');
var wxRequest = require('../../utils/wxRequest.js');
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '文章列表',
    postsList: [], //存放文章的列表
    categoriesList: {}, //分类名
    page: 1, //当前索引页
    pagesize: 5, //一次请求5条数据
    search: '',
    per_page: 10,
    isKeyword: "",
    categories: 0,
    loading: false,
    isLastPage: false,
    isMore: false,
    isDisplay: "nodisplay",

    isCategory: false, //是景点、游记与攻略
    isSearch: false,
    categoriesName: '', //分类名
    categoriesImage: "", //分类背景图
    categoriesDescription: "", //分类的描述
    type: "搜索", //景点、攻略、游记、搜索
    pageNum: 1, //当前索引页
    pageSize: 4, //一次请求5条数据
    keyword: "武汉", //搜索的关键字
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    console.log(options);
    this.setData({
      type: options.type //景点、游记、攻略、搜索
    })
    //是通过分类所得到的列表
    if (this.data.type == "景点") {
      self.setData({
        categoriesName: "景点 scenery",
        isCategory: true,
        categoriesImage: "/images/scenery.jpg", //分类背景图
        categoriesDescription: "在武汉寻找 捕捉文艺的气息", //分类的描述
      });
      self.fetchCategoriesData();
    } else if (this.data.type == "游记") {
      self.setData({
        categoriesName: "游记 travel",
        isCategory: true,
        categoriesImage: "/images/travel.jpg", //分类背景图
        categoriesDescription: "来一场 说走就走的旅行吧", //分类的描述
      });
      self.fetchCategoriesData();
    } else if (this.data.type == "攻略") {
      self.setData({
        categoriesName: "攻略 strategy",
        isCategory: true,
        categoriesImage: "/images/strategy.jpg", //分类背景图
        categoriesDescription: "探索游玩攻略 放心肆意的去看世界", //分类的描述
      });
      self.fetchCategoriesData();
    } else {
      self.setData({
        categoriesName: "搜索 ",
        isCategory: true,
        categoriesImage: "/images/search.jpg", //分类背景图
        categoriesDescription: "搜索沿途风景 踏上属于你的旅行", //分类的描述
        keyword: options.searchWords //搜索的关键字
      });
      self.fetchSearchData()
    }

    //是通过搜索的到的列表
    if (options.search && options.search != '') {
      wx.setNavigationBarTitle({
        title: "搜索：【" + options.search + "】所有文章",
        success: function(res) {
          // success
        }
      });
      self.setData({
        search: options.search,
        isSearch: true,
        isKeyword: options.search
      })
      self.fetchPostsData(self.data); //获取搜索列表
    }


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
    var self = this;
    console.log('当前页' + self.data.page);
    if (this.data.type == "搜索") {
      this.fetchSearchData();
    } else {
      this.fetchCategoriesData();
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var title = '分享"' + config.getAppSite + '"';
    var path = "";
    var imageUrl = "";
    if (this.data.categories && this.data.categories != 0) {
      title += "【" + this.data.categoriesList.name + "】集合";
      path = 'pages/list/list?id=' + this.data.categoriesList.id;
      imageUrl = this.data.categoriesList.cover;
    } else {
      title += "查询【" + this.data.isKeyword + "】的结果";
      path = 'pages/list/list?search=' + this.data.isKeyword;
      imageUrl = '../../images/SearchTopImage.png';
    }
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  /**
   * 生命周期函数-重载数据
   */
  reLoad: function(e) {
    // var self = this;
    // if (self.data.categories && self.data.categories != 0) {
    //   self.setData({
    //     loading: false,
    //     isCategory: true,
    //     isDisplay: "nodisplay"
    //   });
    //   self.fetchCategoriesData(self.data.categories);
    // }
    // if (self.data.search && self.data.search != '') {
    //   self.setData({
    //     loading: false,
    //     isSearch: true,
    //     isDisplay: "nodisplay",
    //     isKeyword: self.data.search
    //   })
    // }
    // self.fetchPostsData(self.data);
  },

  /**
   * 获取分类列表,id传过来的列表类型
   */
  fetchCategoriesData: function(id) {
    wx.showLoading({
      title: '正在加载',
    })
    var self = this;
    self.setData({
      categoriesList: []
    });
    let url
    let requsetData
    if (this.data.type == "景点") {
      url = app.globalData.serverAddress + "/view/all"
      requsetData = {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
      }
    } else if (this.data.type == "攻略" || this.data.type == "游记") {
      url = app.globalData.serverAddress + "/essay/classify"
      requsetData = {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        classify: this.data.type,
      }
    }
    var getCategoryRequest = wxRequest.postRequest(url, requsetData);
    getCategoryRequest.then(response => {
        console.log(response)
        if (response.data.length != 0 && 　response.data != null) {
          this.data.pageNum++
            self.setData({
              // categoriesList: response.data,  
              pageNum: this.data.pageNum,
              postsList: self.data.postsList.concat(response.data)
            });

        } else if (response.statusCode == 200) {
          wx.showToast({
            title: '没有更多内容',
            icon: 'none',
          })
        }
      })
      .then(response => {
        wx.hideLoading()
      })
      .catch(function(response) {
        //console.log(response);
        wx.showToast({
          title: response.errMsg,
        })
      })
      .finally(function() {
        // wx.stopPullDownRefresh();
      });

  },

  /**
   * 获取搜索列表,id传过来的列表类型
   */
  fetchSearchData: function() {
    wx.showLoading({
      title: '正在加载',
    })
    var self = this;
    let url
    let requsetData

    url = app.globalData.serverAddress + "/essay/search"
    requsetData = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      keyword: this.data.keyword,
    }
    var getCategoryRequest = wxRequest.postRequest(url, requsetData);
    getCategoryRequest.then(response => {
        console.log(response)
        if (response.data.length != 0 && response.data != null) {
          this.data.pageNum++
            self.setData({
              // categoriesList: response.data,  
              pageNum: this.data.pageNum,
              postsList: self.data.postsList.concat(response.data)
            });
        } else if (response.statusCode == 200) {
          wx.showToast({
            title: '没有更多内容',
            icon: 'none',
          })
        }
      })
      .then(response => {
        wx.hideLoading()
      })
      .catch(function(response) {
        //console.log(response);
        wx.showToast({
          title: response.errMsg,
        })
      })
      .finally(function() {
        // wx.stopPullDownRefresh();
      });
  },


  /**
   * 查看文章详情
   */
  redictDetail: function(e) {
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id + '&type=文章';
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 查看景点详情
   */
  redictViewDetail: function(e) {
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id + '&type=景点';
    wx.navigateTo({
      url: url
    })
  }
})