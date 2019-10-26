// pages/editText/editText.js
var util = require('../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        signature: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.signature = options.signature
        this.setData({
            signature: this.data.signature
        });
    },
    signatureInput(e) {
        this.setData({
            signature: e.detail.value
        })
    },
    bindFormSubmit: function(e) {
        const userInfo = getApp().globalData.userInfo;
        util.ajax.post('/user/changeInfo', {
            signature: this.data.signature,
            userId: userInfo.userId,
        }, (res) => {
            if (res.code == 0) {
                userInfo.signature = this.data.signature;
                wx.navigateBack();
            }
        });
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

    }
})