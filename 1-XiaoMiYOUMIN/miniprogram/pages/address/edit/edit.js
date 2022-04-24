// miniprogram/pages/address/edit/edit.js
Page({

 /**
  * 页面的初始数据
  */
 data: {
  address: {id: 0, name: '', phone: '', region: ''}
 },

 inputNameHandler: function(e) {
  this.setData({address: {...this.data.address, name: e.detail.value}});
 }, 
 inputPhoneHandler: function(e) {
  this.setData({address: {...this.data.address, phone: e.detail.value}});
 }, 
 changeRegionHandler: function(e) {
  this.setData({address: {...this.data.address, region: e.detail.value.join(' ')}});
 }, 
 save: function() {
  let eventChannel = this.getOpenerEventChannel();
  eventChannel.emit(
   this.data.address.id ? 'update' : 'add',
   this.data.address
  );
  wx.navigateBack();
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function (options) {
  let eventChannel = this.getOpenerEventChannel();
  // 监听事件
  eventChannel.on('beginAdd');
  eventChannel.on('beginUpdate', address => {
   this.setData({address: {...address}});
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