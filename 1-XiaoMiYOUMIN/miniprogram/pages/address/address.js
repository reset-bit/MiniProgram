// miniprogram/pages/address/address.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [
            { id: 1, name: '张三', phone: '13244444444', region: '山东省 青岛市 城阳区' },
            { id: 2, name: '李四', phone: '13299999999', region: '山东省 青岛市 市北区' }
        ]
    },

    beginAdd: function () {
        wx.navigateTo({
            url: '/pages/address/edit/edit',
            events: {
                add: address => {
                    address.id = this.data.list[this.data.list.length - 1].id + 1;
                    this.setData({ list: [...this.data.list, address] });
                    // 将showToast放在下一个时间片中
                    setTimeout(() => {
                        wx.showToast({ title: '新增成功' });
                    }, 0);
                }
            },
            success: function (res) {
                res.eventChannel.emit('beginAdd');
            }
        });
    },
    beginUpdate: function (e) {
        let address = this.data.list.find(item => item.id === e.currentTarget.dataset.id);
        wx.navigateTo({
            url: '/pages/address/edit/edit',
            events: {
                update: address => {
                    let i = this.data.list.findIndex(item => item.id === address.id);
                    this.setData({ list: [...this.data.list.slice(0, i), address, ...this.data.list.slice(i + 1)] });
                    setTimeout(() => {
                        wx.showToast({ title: '修改成功' });
                    }, 0);
                }
            },
            success: function (res) {
                res.eventChannel.emit('beginUpdate', address);
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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