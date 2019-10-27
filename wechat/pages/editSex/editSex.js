// pages/editSex/editSex.js
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        gender: null,
        items: [{
                name: '男',
                value: '男',
                checked: false
            },
            {
                name: '女',
                value: '女',
                checked: false
            },
        ]
    },
    requestSex(){
        let url ="/user/changeInfo"
        let data={
            sex:this.data.sex
        }
        util.ajax.get(url,data)
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.data.gender=e.detail.value
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
            this.data.sex = options.sex
        if (this.data.sex == "男") {
            console.log("男")
            this.data.items[0].checked = true
            
        } else {
            this.data.items[1].checked=true
        }
        this.setData({
            items: this.data.items
        })
        
    },
    bindFormSubmit: function (e) {
        const userInfo = getApp().globalData.userInfo;
        util.ajax.post('/user/changeInfo', {
            gender: this.data.gender,
            userId: userInfo.userId,
        }, (res) => {
            if (res.code == 0) {
                userInfo.gender = this.data.gender;
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