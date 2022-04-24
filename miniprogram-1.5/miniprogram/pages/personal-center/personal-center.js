// miniprogram/pages/personal-center/personal-center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userphoto:"../../images/admin-1.jpg",
    username:"点击头像登录",
    hasUserInfo:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo == ''){
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')            
            wx.getUserProfile({
              desc: '完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写(不写不弹提示框)
              success: (res) => {
                // console.log(res)
                that.setData({
                  hasUserInfo:true,
                  userphoto:res.userInfo.avatarUrl,
                  username:res.userInfo.nickName
                })
                wx.clearStorage();
                wx.setStorageSync('userInfo', res.userInfo);
              }
            })
          }
        }
      })
    }
    else{
      that.setData({
        hasUserInfo:true,
        userphoto:userInfo.avatarUrl,
        username:userInfo.nickName
      })
    }
  },

  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log(res)
        this.setData({
          hasUserInfo:true,
          userphoto:res.userInfo.avatarUrl,
          username:res.userInfo.nickName
        })
        wx.clearStorage();
        wx.setStorageSync('userInfo', res.userInfo);
      }
    })
  },

  goToOrder:function(){
    wx.navigateTo({
      url: 'order-btn/order-btn',
    })
  },

  goToPlan:function(){
    wx.navigateTo({
      url: 'plan-btn/plan-btn',
    })
  },

  exit:function(){
    wx.removeStorageSync('userInfo');
    wx.showToast({
      title: '已退出登录',
    });
    var that = this;
    that.setData({
      hasUserInfo:false,
      userphoto:"../../images/admin-1.jpg",
      username:"点击头像登录"
    })
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