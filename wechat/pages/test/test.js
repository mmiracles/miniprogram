// pages/test/test.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '<div lass="pic-big"><img src="http://b4-q.mafengwo.net/s10/M00/38/75/wKgBZ1jSJZSAH0XYAAkCaZZNZZg27.jpeg?imageMogr2%2Fthumbnail%2F%21690x370r%2Fgravity%2FCenter%2Fcrop%2F%21690x370%2Fquality%2F100" width="730" height="370"/></div><h1>湖北省博物馆</h1><h2>地理位置：湖北省武汉市武昌区东湖路160号</h2><h2>开放时间：09:00-17:00</h2><p>介绍</p></br>  位于东湖畔，是我国重要的国家级博物馆，馆藏文物丰富，有中国规模最大的古乐器陈列馆。</br>越王勾践剑、曾侯乙编钟、郧县人头骨化石、元青花四爱图梅瓶是最值得看的是四大镇馆之宝。</br>由综合陈列馆、楚文化馆、编钟馆等仿古建筑构成，体现古楚国建筑的的建筑布局。</br>馆内的日常展览，具有鲜明的古楚文化和古长江文明的特征。</br>每天有编钟表演，馆内展出文物和陈列位可能会因需求而变动，可以依照馆内的指示牌进行参观。</br>'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    WxParse.wxParse('article', 'html', this.data.content, this, 5);
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