// miniprogram/pages/list/edit/edit.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		people: { id: 0, name: '' }
	},

	changeName: function(e) {
		// console.log(e);
		this.setData({people: {...this.data.people, name: e.detail.value}});	
	},
	save: function() {
		let eventChannel = this.getOpenerEventChannel();
		eventChannel.emit(this.data.people.id ? 'update' : 'add', this.data.people);
		wx.navigateBack();
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let eventChannel = this.getOpenerEventChannel();
		eventChannel.on('beginAdd');
		eventChannel.on('beginUpdate', people => {
			this.setData({people});
		});
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