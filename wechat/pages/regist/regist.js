// pages/regist.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    sexgroup: [{
        name: '男',
        value: '男'
      },
      {
        name: '女',
        value: '女',
        checked: 'true'
      },
    ],

    illegalError: [false, false, false, false, false, false, false], //输入是否合法
    hasSubmitted: false, //是否已成功提交，防止重复提交
    loadingCompleted: true, //页面加载完成
    textnum: 0, //输入域的个数

    sex: '女', //默认性别
    selfIntroduce: "", //个人签名
    password: "", //密码
    confirmPassword: "", //确认密码
    account: "", //用户名
    nickName: "", //昵称
    wxcode: "", //微信号

  },

  //返回上一级页面
  backToLastPage: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  //单选框的值
  bindRadioBoxChange: function(event) {
    // console.log(event.detail.value)
    this.setData({
      sex: event.detail.value
    })
  },

  //文本域输入时，统计字数
  bindTextAreaInput: function(obj) {
    // console.log(obj)
    // var index = obj.currentTarget.dataset.index //表单项序号
    //统计字数
    var count = obj.detail.cursor
    //是否超出限制
    if (count <= 50) {
      this.setData({
        textnum: count
      })
    }
  },

  cancelIllegalError: function(obj) { //重新输入时，取消表单报错信息
    var id = obj.currentTarget.id
    if (this.data.illegalError[id] == true) {
      var key = "illegalError[" + id + "]"
      this.setData({
        [key]: false
      })
      if (id == 4 && this.data.illegalError[3] == true) {
        this.setData({
          ["illegalError[3]"]: false
        })
      } else if (id == 3 && this.data.illegalError[4] == true) {
        this.setData({
          ["illegalError[4]"]: false
        })
      }
    }
  },

  //向后台发送注册数据
  requestRegist: function(requestData, requestUrl) {
    console.log("后台注册数据")
    console.log(requestData)
    console.log(requestUrl)
    var that = this
    let requestUserInfo = {
      userAccount: requestData.username,
      userName: requestData.nickname,
      password: requestData.password,
      gender: requestData.usersex,
    }
    if (requestData.personaltext) {
      requestUserInfo['signature'] = requestData.personaltext
    }
    if (this.data.wxcode.length != 0) {
      requestUserInfo['wxcode'] = this.data.wxcode
    }
    console.log(requestUserInfo)
    wx.request({
      url: requestUrl,
      data: requestUserInfo,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res)
        console.log(res.data.msg)
        if (res.data.msg == 'success') {
          wx.showToast({
            title: "注册成功"
          })
          setTimeout(function() {
            //返回上一级页面
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        } else if (res.msg == "该用户名已被注册") {
          wx.showToast({
            title: '账号已注册',
            icon: 'none'
          })
          //若提交失败,允许再次提交
          that.setData({
            hasSubmitted: false
          })
        } else {
          wx.showToast({
            title: '注册失败',
            icon: 'none'
          })

          //若提交失败,允许再次提交
          that.setData({
            hasSubmitted: false
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '错误:' + res.errMsg,
          icon: 'none'
        })
        //若提交失败,允许再次提交
        that.setData({
          hasSubmitted: false
        })
      }
    })
  },

  //注册
  regist: function(obj) {
    console.log(obj.detail)

    //检查是否为空
    var i = 0
    for (var key in obj.detail.value) {
      //绑定微信与个性签名的值可以为空
      if ((key != "bindWechat") && (key != "personaltext") && (obj.detail.value[key].length == 0 || obj.detail.value[key] == null)) {
        var k = "illegalError[" + i + "]"
        this.setData({
          [k]: true
        })
        wx.showToast({
          title: '请确认信息填写完整!',
          icon: 'none'
        })
        return
      }
      i++
    }
    //检查密码和确认密码是否一致
    if (obj.detail.value['password'] != obj.detail.value['confirmPassword']) {
      this.setData({
        ["illegalError[3]"]: true,
        ["illegalError[4]"]: true
      })
      wx.showToast({
        title: '密码和确认密码不一致!',
        icon: 'none'
      })
      return
    }
    //检查非法输入值
    var usernameStr = /^[0-9a-zA-Z]{6,}$/; //账号格式
    if (!usernameStr.test(obj.detail.value['username'])) {
      this.setData({
        ["illegalError[0]"]: true
      })
      wx.showToast({
        title: '账号只能由字母和数字组成，且长度必须不小于6位!',
        icon: 'none'
      })
      return
    }
    if (obj.detail.value['password'].length < 6) { //检查密码长度是否符合要求
      this.setData({
        ["illegalError[3]"]: true
      })
      wx.showToast({
        title: '密码长度必须不小于6位!',
        icon: 'none'
      })
      return
    }

    //提交中
    wx.showLoading({
      title: "提交中",
    })
    //防止重复提交
    this.setData({
      hasSubmitted: true
    })

    var that = this
    //绑定微信
    if (obj.detail.value["bindWechat"] != null && obj.detail.value["bindWechat"].length > 0) {
      wx.login({ //获取登录code以便获取用户的OpenId
        success: function(res) {
          if (res.code) {
            //绑定微信注册
            delete obj.detail.value["bindWechat"]
            obj.detail.value["code"] = res.code
            that.setData({
              wxcode: res.code
            })
            //微信登录
            // that.requestRegist(obj.detail.value, app.globalData.serverAddress + '/user/loginByWx')
            that.requestRegist(obj.detail.value, app.globalData.serverAddress + '/user/register')
          } else {
            wx.showToast({
              title: "错误:" + res.errMsg,
              icon: 'none'
            })
            //若提交失败，允许再次提交
            that.setData({
              hasSubmitted: false
            })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
          })
          //若提交失败，允许再次提交
          that.setData({
            hasSubmitted: false
          })
        }
      })
    } else {
      //不绑定微信
      //发送数据 不绑定微信的数据以及url
      this.requestRegist(obj.detail.value, app.globalData.serverAddress + '/user/register')
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //页面加载中
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
    wx.stopPullDownRefresh()
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