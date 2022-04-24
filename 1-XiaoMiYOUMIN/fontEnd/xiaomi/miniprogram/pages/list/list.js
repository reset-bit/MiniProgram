// miniprogram/pages/list/list.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [
            { id: 1, name: '张三' },
            { id: 2, name: '李四' },
            { id: 3, name: '王五' }
        ]
    },

    goToDetail: function () {
        // try {
        //   wx.setStorageSync("id", 100);
        // } catch(e) {}
        getApp().globalData.num = 99;
        wx.navigateTo({ url: '/pages/detail/detail' });
    },

    beginAdd: function() {
        wx.navigateTo({
            url: '/pages/list/edit/edit',
            events: {
                add: people => {
                    people.id = this.data.list[this.data.list.length - 1].id + 1;
                    this.setData({list: [...this.data.list, people]});
                    setTimeout(() => {
                        wx.showToast({title: '新增成功'});
                    }, 0);
                }
            },
            success: res => {
                res.eventChannel.emit('beginAdd');
            }
        });
    },
    beginUpdate: function(e) {
        let people = this.data.list.find(item => item.id === e.currentTarget.dataset.id);
        wx.navigateTo({
            url: '/pages/list/edit/edit',
            events: {
                update: people => {
                    let i = this.data.list.findIndex(item => item.id === people.id);
                    this.setData({list: [...this.data.list.slice(0, i), people, ...this.data.list.slice(i + 1)]});
                    setTimeout(() => {
                        wx.showToast({title: '修改成功'});
                    }, 0);
                }
            },
            success: res => {
                res.eventChannel.emit('beginUpdate', people);
            }
        });
    },
    removeHandler: function(e) {
        // console.log(e);
        wx.showModal({
            title: '提示',
            content: '确定删除吗？',
            success: res => {
                if(res.cancel) {return;}
                let id = e.currentTarget.dataset.id;
                let i = this.data.list.findIndex(item => item.id === id);
                this.setData({list: [...this.data.list.slice(0, i), ...this.data.list.slice(i + 1)]});
                wx.showToast({title: '删除成功'});
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
        console.log('list is onHide');
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        console.log('list is onUnload');
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