// pages/editText/editText.js
var util = require('../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        signature: '',
        textnum: 0
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
        var count = e.detail.cursor
        //是否超出限制
        if (count <= 50) {
            this.setData({
                textnum: count
            })
        }
    },
    bindFormSubmit: function(e) {
        const userInfo = wx.getStorageSync('userInfo');
        util.ajax.post('/travel/user/changeInfo', {
            signature: this.data.signature,
            userId: userInfo.userId,
        }, (res) => {
            userInfo.signature = this.data.signature;
            wx.setStorageSync('userInfo', userInfo);
            wx.navigateBack();
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