//index.js
//获取应用实例
const util = require('../../utils/util.js');
const app = getApp()
//console.log(app.globalData)
Page({
    data: {
        viewList:[],
        pageNum: 1,
        pageSize: 10,
        isMore: true,
        searchWords: '',
        userInfo: wx.getStorageSync('userInfo')

        //数据处理
    },
    //事件处理函数
    onLoad: function() {},
    getList(isReload = false) {
        if (isReload) {
            this.setData({
                viewList: [],
                pageNum: 1,
            });
        }
        util.ajax.get('/travel/view/all', {
            pageNum: this.data.pageNum,
            pageSize: this.data.pageSize
        }, res => {
            console.log(res)
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
                viewList: this.data.viewList.concat(res),
                pageNum: this.data.pageNum + 1,
            });
        });
    },
    formSubmit(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/list/list?type=' + e.currentTarget.dataset.type + '&searchWords=' + this.data.searchWords,
        })
    },
    searchInput(e) {
     //   console.log(e)
        this.setData({
            searchWords: e.detail.value
        })
    },

    toDetail() {
        wx.navigateTo({
            url: '/pages/detail/detail',
        })
    },
    toList(e) {
        wx.navigateTo({
            url: '/pages/list/list?type=' + e.currentTarget.dataset.type,
        })
    },
})