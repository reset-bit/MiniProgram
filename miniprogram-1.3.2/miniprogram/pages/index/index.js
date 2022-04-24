// pages/index/index.js
var common = require('../../utils/common.js')
//通过require()获取其它文件导出的数据，仅支持相对路径
const db = wx.cloud.database()
const news = db.collection('news')//获取db中集合
const row = 2
var page = 0
// 当用户退出该页面时，只要该页面还驻留在内存中未被销毁，则当再次加载此页面时，变量的值不会改变。当前page=0；page++；再次进入page=1
// 在这种情况中，要想在重新加载页面时对在Page外部声明var变量重新初始化，可以在onUnload函数里对这些变量重新赋值。

// App()用来注册一个小程序
// Page()用来注册一个页面，接受一个object参数，指定页面初始数据、生命周期函数、事件处理函数等
// 后台：点击左上角关闭，或者按了设备 Home 键离开微信，并没有直接销毁，而是进入后台
// 前台：再次进入微信或再次打开小程序，相当于从后台进入前台。
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  goToDetail:function(e){
    // console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
    /*
      wx.navigateTo({url: 'url',}):保留当前页面，并在当前页面上方打开应用内指定新页面，url后可接参数'?&'
      并且可以通过左上方返回按钮/wx.navigateBack({delta:1})接口返回原页面(delta代表返回页面数)
      -------------------
      wx.redirectTo({url: 'url',}):关闭当前页面内容，重定向到应用内的某个页面，url后可接参数'?&'
      -------------------
      wx.reLaunch({url: 'url',}):关闭所有页面内容，重新打开应用内的某个页面
    */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    news.limit(row).get({//一次获取2条数据，limit指定查询结果集数量上限，上限100
      success:res=>{// ES6语法：=>箭头函数，res=>即function(res)，省略var that=this
        this.setData({
          newsList:res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示，每次打开页面都会调用一次。
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏，当navigateTo或底部tab切换时调用。
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载，当redirectTo或navigateBack的时候调用。
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
    page++
    news.skip(row*page).limit(row).get({//再次获得row条新闻
      success:res=>{
        let old_data = this.data.newsList
        let new_data = res.data
        this.setData({
          newsList:old_data.concat(new_data)//old与new进行拼接
        })
      }
    })
    // skip：指定查询返回结果时，从指定序列后的结果开始返回，常用于分页
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})