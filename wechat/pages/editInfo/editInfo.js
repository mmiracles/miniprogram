// pages/editInfo/editInfo.js

const util = require('../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userName: null,
    },
    clickSubmit: function(e) {
        const userInfo = wx.getStorageSync('userInfo');
        util.ajax.post('/travel/user/changeInfo', {
            userId: userInfo.userId,
            userName: this.data.userName
        }, (res) => {
            userInfo.userName = this.data.userName;
            wx.setStorageSync('userInfo', userInfo);
            wx.navigateBack();
        });
    },
    userNameInput(e) {
        this.setData({
            userName: e.detail.value,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            userName: options.userName
        })
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