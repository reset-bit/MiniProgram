// miniprogram/pages/route-plan/route-plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    drawerTop: '',
    height: '', //屏幕高度
    swiperIndex: '',
    tabTop: '',//抽屉距离顶部位置高度
    tabFix: 'FixedBottom',//抽屉位置样式
    zOfSwiper: 999,//背景幻灯片等级
    isScroll: false,//抽屉是否可滑动
  },

  goToWholePlan:function(){
    wx.navigateTo({
      url: 'whole-plan-btn/plan-create/plan-create',
    })
  },

  goToPartPlan:function(){
    wx.navigateTo({
      url: 'part-plan-btn/plan-create/plan-create',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //获取tab的距离顶部高度
    const query = wx.createSelectorQuery();
    query.select('#tab').boundingClientRect(function (res) {
      // console.log(res.top)
      that.data.tabTop = res.top;
    }).exec();
    // SelectorQuery.boundingClientRect 是将当前选择节点的位置信息放入查询结果
    // SelectorQuery.exec 是将查询结果放入 callback 回调中。查询结果按请求次序构成数组，数组中每项为一次查询的结果。如果当前是节点列表，则单次查询结果也为数组。
    
  },

  /**
   * 页面滚动触发事件处理函数
  */
  onPageScroll: function (e) {
    let that = this;
    //tab的吸顶效果
    // console.log(e.scrollTop);
    if (e.scrollTop > 20) {
      if (that.data.tabFix != 'FixedTop') {
        that.setData({
          tabFix: 'FixedTop',
          zOfSwiper: 0,
          isScroll: true
        })
      }
    } 
    else{
      that.setData({
        tabFix: 'FixedBottom',
        zOfSwiper: 999,
        isScroll: false
      })
      // this.highTransition();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.animation = wx.createAnimation()
  },

  // 抽屉过渡动画，实现效果不佳
  // highTransition:function(){
  //   var that = this;
  //   that.animation.top(0.8 * this.data.tabTop).step()
  //   that.setData({animation: this.animation.export()})
  // },

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