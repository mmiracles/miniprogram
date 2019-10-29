// pages/edit/edit.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userName: '',
        sex: '',
        text: ''
    },
    editsex: function() {
        wx.navigateTo({
            url: '/pages/editSex/editSex?gender=' + this.data.gender
        })
    },
    clickMeedit: function() {
        wx.navigateTo({
            url: '/pages/editText/editText?signature=' + this.data.signature
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
        const userInfo = wx.getStorageSync('userInfo');
        this.setData({
            userName: userInfo.userName,
            gender: userInfo.gender,
            signature: userInfo.signature,
        });
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