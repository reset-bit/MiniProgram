// pages/index/index.js

var amapFile = require('../../amap-wx.js');
//ES6中新增let语法，let所声明的变量仅在该变量所在代码块中有效（很适合for计数器）

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region:['请选择','请选择','请选择'],
    img_src:'wifi',
    now:''
  },

  changeRegion:function(e){
    this.setData({
      region:e.detail.value
    })
    this.getCurWeather();
  },

  //如果 city 属性值为空（或者没有city属性），默认返回定位位置的天气数据；如果 city 不为空，则返回指定位置的天气数据。
  getCurWeather:function(){
    var that = this;//this不可以在wxAPI中使用
    var myAmapFun = new amapFile.AMapWX({key:'5a60c4c77fe965983beca21d75ec507d'});//AMapWX为高德基础类
    myAmapFun.getWeather({
      type:'live',
      city:that.data.region[2],//将当前页面数据赋值给函数
      success:function(data){
        // console.log(data);
        var weather = data.liveData.weather;
        if(weather == '阴'){
          that.setData({img_src:'overcast'})
        }
        else if(weather == '晴'){
          that.setData({img_src:'sunny'})
        }
        else if(weather == '多云'){
          that.setData({img_src:'cloudy'})
        }
        else if(weather == '小雨'){
          that.setData({img_src:'rain_small'})
        }
        else if(weather == '大雨'){
          that.setData({img_src:'rain_big'})
        }
        else if(weather == '雷雨'){
          that.setData({img_src:'thunder'})
        }
        else if(weather == '降雪'){
          that.setData({img_src:'snowy'})
        }
        else{
          that.setData({img_src:'wifi'})
        }
        that.setData({
          now:data
        })
      },
      fail:function(info){
        console.log(info);
      }
    })
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