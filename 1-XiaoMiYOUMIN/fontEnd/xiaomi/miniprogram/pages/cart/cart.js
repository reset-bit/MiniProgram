// miniprogram/pages/cart/cart.js
const computedBehavior = require("miniprogram-computed").behavior;

Component({
    behaviors: [computedBehavior],
    /**
     * 页面的初始数据
     */
    data: {
        list: [
            {id: 1, name: "电视机", count: 2, price: 100, checked: true},
            {id: 2, name: "电冰箱", count: 1, price: 2000, checked: true}
        ]
    },

    computed: {
        total(data) {
            let res = 0;
            data.list.forEach(item => {
                if(item.checked) {
                    res += item.count * item.price;
                }
            });
            return res;
        }
    },

    methods: {
        toggleChecked: function(e) {
            let i = this.data.list.findIndex(item => item.id === e.currentTarget.dataset.id);
            let key = `list[${i}].checked`;
            this.setData({[key]: !this.data.list[i].checked});
        },
        decrease: function(e) { 
            let i = this.data.list.findIndex(item => item.id === e.currentTarget.dataset.id);
            let key = `list[${i}].count`;
            this.setData({[key]: this.data.list[i].count - 1});
            },
        increase: function(e) { 
            let i = this.data.list.findIndex(item => item.id === e.currentTarget.dataset.id);
            let key = `list[${i}].count`;
            this.setData({[key]: this.data.list[i].count + 1});
            }
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