// miniprogram/pages/index/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '张三',
        listMain: []
    },

    tapHandler: function (e) {
        console.log('tap handler');
        console.log(e);
    },
    inputHandler: function (e) {
        this.setData({ name: e.detail.value });
    },

    goToTabBarPage: function () {
        wx.switchTab({ url: "/pages/profile/profile" });
    },
    goToNotTabBarPage: function () {
        wx.navigateTo({ url: "/pages/list/list" });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: async function () {
        let listMain = await app.http({url: 'category/list/0'});
        this.setData({listMain});
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
        console.log('home is onHide');
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        console.log('home is onUnload');
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})