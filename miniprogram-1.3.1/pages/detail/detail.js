// pages/detail/detail.js
var common = require('../../utils/common.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    article:{},
    isAdd:false
  },

  addFavorites:function(){
    let article = this.data.article
    wx.setStorageSync(article.id, article)//放入缓存区
    this.setData({
      isAdd:true
    })
  },

  cancelFavorites:function(){
    let article = this.data.article
    wx.removeStorageSync(article.id)
    this.setData({
      isAdd:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//options为传递过来的参量
    // console.log(options.id)
    let id = options.id
    //检查当前新闻是否在收藏夹中
    var newArticle = wx.getStorageSync(id)
    if(newArticle != ''){//已存在
      this.setData({
        isAdd:true,
        article:newArticle
      })
    }
    else{
      let result = common.getNewsDetail(id)
      if(result.code == '200'){//成功获取
        this.setData({
          isAdd:false,
          article:result.news
        })
      }
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