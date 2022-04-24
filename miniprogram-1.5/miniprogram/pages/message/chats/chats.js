// miniprogram/pages/message/chats/chats.js
Page({

  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: null,
    logged: false,
    takeSession: false,
    requestResult: '',
    chatRoomCollection: 'chatroom',
    chatRoomGroupId: '',
    chatRoomGroupName: '聊天室',

    // functions for used in chatroom components
    onGetUserInfo: null,
    getOpenID: null,
  },

  // 接收chat组件中最后一条消息并存入缓冲区
  getLastContent:function(e){
    // console.log(e);
    var lastContent = wx.getStorageSync('lastContent');
    if(lastContent == ''){
      lastContent = [{content:[]},{content:[]}];
    }
    var id = e.detail.doc.groupId;
    if(id.indexOf('cur') != -1){//一起去
      var index = id.substring(3);
      if(index < lastContent[0].content.length){
        lastContent[0].content[index] = e.detail.doc.textContent;
      }
      else{
        lastContent[0].content.push(e.detail.doc.textContent);
      }
    }
    else{//客服
      var index = id.substring(3);
      console.log(index);
      if(index < lastContent[1].content.length){
        lastContent[1].content[index] = e.detail.doc.textContent;
      }
      else{
        lastContent[1].content.push(e.detail.doc.textContent);
      }
    }
    wx.setStorageSync('lastContent', lastContent);
  },

  onLoad: function(options) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo == ''){
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: function (res) {
          if (res.confirm) {           
            wx.getUserProfile({
              desc: '完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写(不写不弹提示框)
              success: (res) => {
                // console.log(res);
                that.setData({
                  userInfo:res.userInfo,
                  avatarUrl:res.userInfo.avatarUrl
                })
                wx.clearStorage();
                wx.setStorageSync('userInfo', res.userInfo);
              }
            })
          }
        }
      })
    }
    that.setData({
      userInfo:userInfo,
      avatarUrl:userInfo.avatarUrl,
      chatRoomGroupId:options.groupid,
      onGetUserInfo: that.onGetUserInfo,
      getOpenID: that.getOpenID,
    })
  },

  getOpenID: async function() {
    if (this.openid) {
      return this.openid
    }
    const { result } = await wx.cloud.callFunction({
      name: 'login',
    })
    return result.openid
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      // console.log(e);
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
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