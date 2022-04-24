// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    img_src:'',
    newsList:[],
    number:0
  },

  getMyInfo:function(e){
    // console.log(e.detail.userInfo);
    let info = e.detail.userInfo
    this.setData({
      isLogin:true,
      nickName:info.nickName,
      img_src:info.avatarUrl
    })

    this.getMyFavourites()
  },

  getMyFavourites:function(){
    let info = wx.getStorageInfoSync()//本地缓存
    let keys = info.keys//全部key
    let num = keys.length//新闻数量
    let myList = []
    for(var i = 0; i < num; ++i){//全部新闻
      var obj = wx.getStorageSync(keys[i])
      myList.push(obj)
    }
    this.setData({
      newsList:myList,
      number:num
    })
  },

  goToDetail:function(e){
    // console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },

  /**
   * 生命周期函数--监听页面加载，仅调用一次，传递参数
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示，可多次调用，不传递参数
   */
  onShow: function () {
    if(this.data.isLogin){
      this.getMyFavourites()
    }
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