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
    postsList: {},    //存放文章的列表
    categoriesList: {},   //分类名
    page: 1,   //当前索引页
    pagesize:5,  //一次请求5条数据
    search: '',
    per_page: 10,
    isKeyword: "",
    categories: 0,
    categoriesName: '',
    categoriesImage: "",
    loading: false,
    isCategory: false,    //是分类
    isSearch: false,
    isLastPage: false,
    isMore: false,
    isDisplay: "nodisplay"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    //console.log(options);

    //是通过分类所得到的列表
    if (options.id && options.id != 0) {
      self.setData({
        categories: options.id,
        isCategory: true
      });
      self.fetchCategoriesData(options.id);
    }

    //是通过搜索的到的列表
    if (options.search && options.search != '') {
      wx.setNavigationBarTitle({
        title: "搜索：【" + options.search + "】所有文章",
        success: function (res) {
          // success
        }
      });
      self.setData({
        search: options.search,
        isSearch: true,
        isKeyword: options.search
      })
      self.fetchPostsData(self.data);   //获取搜索列表
    }
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
    var self = this;
    if (!self.data.isLastPage) {
      self.setData({
        page: self.data.page + 1
      });
      console.log('当前页' + self.data.page);
      this.fetchPostsData(self.data);
    }
    else {
      wx.showToast({
        title: '没有更多内容',
        mask: false,
        duration: 1000
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
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
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 生命周期函数-重载数据
   */
  reLoad: function (e) {
    var self = this;
    if (self.data.categories && self.data.categories != 0) {
      self.setData({
        loading:false,
        isCategory: true,
        isDisplay: "nodisplay"
      });
      self.fetchCategoriesData(self.data.categories);
    }
    if (self.data.search && self.data.search != '') {
      self.setData({
        loading: false,
        isSearch: true,
        isDisplay: "nodisplay",
        isKeyword: self.data.search
      })
    }
    self.fetchPostsData(self.data);
  },

  /**
   * 获取分类列表,id传过来的列表类型
   */
  fetchCategoriesData: function (id) {
    var self = this;
    self.setData({
      categoriesList: []
    });
    let url = app.globalData.serverAddress + ""  //获取分类列表的url
    let requestdata ={
      pageindex:this.page,   //当前索引页
      pagesize:this.pagesize,   //页面大小
      id:id,   //分类的id
    }
    var getCategoryRequest = wxRequest.getRequest(url, requestdata);   
    getCategoryRequest.then(response => {
      console.log(response)

      self.setData({
        categoriesList: response.data,   //获取的list列表数据
        categoriesImage: cover,   //list列表的封面
        categoriesName: response.data.name,   //列表名
        postsList:self.data.postsList.concat(response.data.postsList)   //获取的列表数据  
      });

      wx.setNavigationBarTitle({
        title: response.data.name,
        success: function (res) {
          // success
        }
      });
    })
  },

  /**
   * 获取文章列表
   */
  fetchPostsData: function (data) {
    var self = this;
    if (!data) data = {};
    if (!data.page) data.page = 1;
    if (!data.per_page) data.per_page = 10;
    if (!data.categories) data.categories = 0;
    if (!data.search) data.search = '';
    if (data.page === 1) {
      self.setData({
        postsList: []
      });
    };
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    var getPostsRequest = wxRequest.getRequest(Api.getPosts(data));
    getPostsRequest.then(response => {
      if (response.statusCode === 200) {
        console.log(response)
        if (response.data.length < 5) {
          self.setData({
            isMore: true,
            isLastPage: true
          });
        };
        self.setData({
          isDisplay: "display",
          postsList: self.data.postsList.concat(response.data.map(function (item) {
            var strdate = item.date
            if (item.category != null) {
              if (item.cover == null || item.cover == '') {
                item.cover = "../../images/cover.png";   
              }
            } else {
              item.cover = "";
            }
            if (item.thumbnail == null || item.thumbnail == '') {
              item.thumbnail = '../../images/default.png';
            }
            item.date = util.cutstr(strdate, 10, 1);
            item.title.rendered = util.ellipsisHTML(item.title.rendered);
            return item;
          })),
        });
      } else {
        if (response.data.code == "rest_post_invalid_page_number") {
          self.setData({
            isLastPage: true
          });
        } else {
          wx.showToast({
            title: response.data.message,
            duration: 1500
          })
        }
      }
    })
    .catch(function () {
      if (data.page == 1) {
        self.setData({
          loading: true,
          isMore: false,
          isDisplay: "nodisplay"
        });
      } else {
        wx.showModal({
          title: '加载失败',
          content: '加载数据失败, 请重试.',
          showCancel: false,
        });
        self.setData({
          page: data.page - 1
        });
      }
    })
    .finally(function () {
      wx.hideLoading();
    })
  },
  /**
   * 查看文章详情
   */
  redictDetail: function (e) {
    var id = e.currentTarget.id,
    url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  }
})