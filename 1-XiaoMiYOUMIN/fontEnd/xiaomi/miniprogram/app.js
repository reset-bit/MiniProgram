//app.js
App({
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                // env: 'my-env-id',
                traceUser: true,
            })
        }

        this.globalData = {
            num: 0,
            baseUrl: "http://localhost:2999/"
        }
    },
    http: function(userOptions) {
        userOptions.url = this.globalData.baseUrl + userOptions.url;
        userOptions.method = userOptions.method || "GET";
        userOptions.header = Object.assign({}, {Authorization: wx.getStorageSync('token')}, userOptions.header || {});
        userOptions.timeout = 3000;// 设置超时时间，超时将进入fail
        wx.showLoading({title: '加载中..'});// 发送ajax之前打开loading
        return new Promise((resolve, reject) => {
            wx.request({
                ...userOptions,
                success: res => {
                    if(res.statusCode === 200) {
                        let {code, data, msg} = res.data;
                        switch(code) {
                            case 200:
                                resolve(data);
                                break;
                            case 199:
                            case 401:
                            case 404:
                            case 500:
                                wx.showToast({title: msg});
                                reject(msg);
                        }
                    } else {
                        wx.showToast({title: res.errMsg});
                        reject(res.errMsg);
                    }
                },
                complete: () => wx.hideLoading(),// 关闭loading
                fail: error => {
                    wx.showToast({title: '服务器连接超时'});
                    reject(error.errMsg);
                }
            });
        });
    }
})
