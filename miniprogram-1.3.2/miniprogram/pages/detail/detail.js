// pages/detail/detail.js
var common = require('../../utils/common.js')
const db = wx.cloud.database()
const news = db.collection('news')//获取db中集合

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  addFavorites:function(){
    let article = this.data.article
    wx.setStorageSync(article._id, article)//放入缓存区,_id
    /*
      storage：本地缓存，同一个微信用户，同一个小程序 storage 上限为 10MB。
      storage 以用户维度隔离，同一台设备上，A 用户无法读取到 B 用户的数据；不同小程序之间也无法互相读写数据。
      wx.setStorageSync(string key, any data),key为唯一标识,setStorage同步版本
      wx.setStorage({
        data: data,
        key: 'key',
        success:function(),
        fail:function(),
        compelete:function()
      })
      同理get\remove\clear
    */
    this.setData({
      isAdd:true
    })
  },

  cancelFavorites:function(){
    let article = this.data.article
    wx.removeStorageSync(article._id)
    this.setData({
      isAdd:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//options为传递过来的参量
    // console.log(options.id)
    let id = options.id//获取传递过来的参数id
    //检查当前新闻是否在本地缓冲区中，若存在则从缓冲区中加载，否则从云中加载
    var newArticle = wx.getStorageSync(id)
    if(newArticle != ''){//已存在
      this.setData({
        isAdd:true,
        article:newArticle
      })
    }
    else{
      news.doc(id).get({//doc查询，根据唯一标识符查询；get()只返回满足条件的记录
      // where条件查询，类doc
        success:res=>{
          this.setData({//更新新闻信息和收藏状态
            article:res.data,//临时变量data中可不加
            isAdd:false
          })
        }
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