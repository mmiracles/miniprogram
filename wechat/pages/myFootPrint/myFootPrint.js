// pages/myFootPrint/myFootPrint.js
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        footPrint:[],
        pageNum:1,
        pageSize:10,
        isMore:true,
        userInfo: wx.getStorageSync('userInfo')
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList(true)
    },
    getList(isReload = false) {
        if (isReload) {
            this.setData({
                footPrint: [],
                pageNum: 1,
            });
        }
        util.ajax.get('/travel/view/myFootprint', {
            pageNum: this.data.pageNum,
            pageSize: this.data.pageSize,
            userId: this.data.userInfo.userId
        }, res => {
            if (res.length == 0) {
                this.setData({
                    isMore: false,
                });
            } else {
                this.setData({
                    isMore: true,
                });
            }
            res.forEach(v => {
                v.createTime = util.formatDate(new Date(v.createTime));
            });
            this.setData({
                footPrint: this.data.footPrint.concat(res),
                pageNum: this.data.pageNum + 1,
            });
        });
        },
    toDetail(e) {
        wx.navigateTo({
            url: '/pages/detail/detail?type=' + e.currentTarget.dataset.type,
        })
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
        this.getList(true);
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.isMore) {
            this.getList();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})