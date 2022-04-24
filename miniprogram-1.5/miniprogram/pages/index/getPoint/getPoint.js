// miniprogram/pages/getPoint/getPoint.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk= new QQMapWX({key:'DCPBZ-LQNL4-JRXUY-D2WQC-SPKJ6-44FSN'});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:'',
    longitude:'',
    markers:[],
    points:[]
  },

  addPoint:function(res){
    // console.log(res)
    var indexMarkers = "markers["+this.data.markers.length+"]";
    var indexPoints = "points["+this.data.points.length+"]";
    var that = this;
    that.setData({
      [indexMarkers]:{
        latitude:res.detail.latitude,
        longitude:res.detail.longitude,
        iconPath:"../../images/marker_big.png",
        width:20,
        height:30
      },
      [indexPoints]:{
        latitude:res.detail.latitude,
        longitude:res.detail.longitude
      }
    })
  },

  getPoint:function(){
    var that = this;
    var maxMarkers = this.data.markers.length;
    var copypl = this.data.points;
    for(var m = 1; m < maxMarkers; ++m){
      qqmapsdk.direction({
        mode:'walking',
        from:this.data.markers[m-1].latitude+","+this.data.markers[m-1].longitude,
        to:this.data.markers[m].latitude+","+this.data.markers[m].longitude,
        success:res=>{
          // console.log(res);
          var ret = res;
          var coors = ret.result.routes[0].polyline;
          var pl = [];
          //坐标解压（返回的点串坐标，通过[前向差分]进行压缩）
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coors.length; i += 2) {
            pl.push({ latitude: coors[i], longitude: coors[i + 1] });
          }
          // console.log(pl)
          //拼接数组==>全拼接使用copypl.push.apply(copypl, pl);或copypl.push(...pl);
          for(var i = 1; i < pl.length-1; ++i){
            copypl.push(pl[i]);
          }
        }
      })
      // if(m == maxMarkers-1){
      //   // console.log(copypl);
      // }
    }
    that.setData({
      latitude:copypl[0].latitude,
      longitude:copypl[0].longitude,
      polyline: [{
        points: copypl,
        color: '#79CDCD',
        width: 4
      }],
      points:copypl//页面缩放
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      success:res=>{
        // console.log(res)
        this.setData({
          latitude:res.latitude,
          longitude:res.latitude,
          markers:[{
            latitude:res.latitude,
            longitude:res.longitude,
            iconPath:"../../images/marker_small.png",
            width:40,
            height:40
          }],
          points:[{
            latitude:res.latitude,
            longitude:res.latitude,
          }]
        })
      }
    })
    this.mapCtx = wx.createMapContext('getPoint');
    this.mapCtx.moveToLocation();
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