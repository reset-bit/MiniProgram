// miniprogram/pages/map/map.js
var app = getApp();
var common = require('../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      success:res=>{
        // console.log(res)
        this.setData({
          markers:[{
            latitude:res.latitude,
            longitude:res.longitude,
            iconPath:'../../images/marker.png',
            width:30,
            height:30,
            callout:{
              content:"当前位置",
              color:'black',
              fontSize:15,
              borderRadius:5,
              borderWidth:1,
              borderColor:'#6495ED',
              padding:2,
              display:'ALWAYS'
            }
            // callout气泡
          }]
        })
      }
    })
  },

  getTargetLocation:function(){
    var that = this
    var latitude = that.data.markers[0].latitude
    var longitude = that.data.markers[0].longitude
    wx.request({
      url: 'https://api.jisuapi.com/illegaladdr/coord?appkey='+app.globalData.appkey,
      data:{
        lat:latitude,
        lng:longitude,
        range:1000,
        num:10
      },
      // 点击气泡显示方向与距离
      success:res=>{
        // console.log(res)
        var result = res.data.result
        for(let i = 0; i < result.lengtht; ++i){
          let lat = result[i].lat
          let lng = result[i].lng
          var index = "markers["+(i+1)+"]"
          // i=0为本身，index表示下标

          //计算两点距离及(第二个点相对于第一个点的)方向
          var lat0 = that.data.markers[0].latitude;
          var lng0 = that.data.markers[0].longitude;
          var dis = Math.floor(common.getDistance(lng0, lat0, lng, lat));//取整
          var dir = common.getDirection(lng0, lat0, lng, lat);

          that.setData({
            [index]:{
              latitude:lat,
              longitude:lng,
              iconPath:'../../images/marker_normal.png',
              width:30,
              height:30,
              callout:{
                content:dir+"方向\t"+dis+"米",
                color:'red',
                fontSize:15,
                borderRadius:5,
                borderWidth:1,
                padding:2,
                display:'BYCLICK'
              }
            }
          })
        }
      }
    })
  },

  // 实现中心marker的定位改变
  moveCenter:function(res){
    // console.log(res)
    let index_lat = "markers[0].latitude"
    let index_lng = "markers[0].longitude"
    this.setData({
      [index_lat]:res.detail.latitude,
      [index_lng]:res.detail.longitude
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