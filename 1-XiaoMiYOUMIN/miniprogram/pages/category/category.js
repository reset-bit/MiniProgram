// miniprogram/pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listMain: [],
    listSub: [],
    activeId: -1
  },

  toggleActiveId: function(e) {
    this.setData({activeId: e.currentTarget.dataset.id});
    this.toggleListSub(e.currentTarget.dataset.id);
  },

  toggleListSub: function(activeId) {
    let that = this;
    wx.request({
      url: 'http://localhost:2999/category/list/' + activeId,
      success: (res) => {
        if(res.statusCode === 200) {
          let {code, data, msg} = res.data;
          switch(code) {
            case 200:
              that.setData({listSub: data});
              break;
            case 199:
            case 401:
            case 404:
            case 500:
              console.log(msg);
              break;
          }
        } else {
          console.log(res.errMsg);
        }
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
    let that = this;
    wx.request({
      url: 'http://localhost:2999/category/list/0',
      success: res => {
        // console.log(res);
        if(res.statusCode === 200) {
          let {code, data, msg} = res.data;
          switch(code) {
            case 200:
              that.setData({listMain: data, activeId: data[0].id});
              that.toggleListSub(data[0].id);
              break;
            case 199:
            case 401:
            case 404:
            case 500:
              console.log(msg);
              break;
          }
        } else {
          console.log(res.errMsg);
        }
      }
    });
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