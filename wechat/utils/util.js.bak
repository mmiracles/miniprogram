const config = {
    host: 'http://127.0.0.1'
};

const ajax = {
    get(route, data, successFunc = function() {}, failFunc = function() {}) {
        wx.request({
            url: config.host + route,
            data: data,
            method: 'GET',
            success: function(result) {
                console.log('微信成功回调啦', result)
                successFunc(result.data);
            },
            fail: function() {
                failFunc();
            }
        });
    },
    post(route, data, successFunc = function() {}, failFunc = function() {}) {
        wx.request({
            url: config.host + route,
            data: data,
            method: 'POST',
            success: function(res) {
                successFunc(res.data);
            },
            fail: function() {
                failFunc();
            }
        })
    },
};

module.exports = {
    ajax: ajax,
}