// miniprogram/pages/route-plan/part-plan/part-plan.js
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk');
var qqmapsdk= new QQMapWX({key:'DCPBZ-LQNL4-JRXUY-D2WQC-SPKJ6-44FSN'});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ori:['','',''],//名称+地址+lat&lng
    des:[{id:'0', placeName:'', placeLocation:'', latAndLng:''}],
    inputShow:[true],
    inputHeight: [],//[0]为【des-area】初始高度,[1]为当前高度
    startTime:'',
  },

  //定位图片响应函数
  getLocation:function(){
    //逆地址解析
    qqmapsdk.reverseGeocoder({
      location:'',
      success:res=>{
        console.log(res.result.formatted_addresses.recommend)
        var origin = [res.result.formatted_addresses.recommend, res.result.address];
        wx.getLocation({
          success:res=>{
            // console.log(res)
            var ll = res.latitude+","+res.longitude;
            origin.push(ll);
            // console.log(origin)
            var that = this;
            that.setData({
              ori:origin,
              sngCondition:'locationImg'
            });
            wx.setStorageSync('ori', origin);
          }
        })
      }
    })
  },

  //关键词提示输入事件
  getSuggest:function(e){
    var that = this;
    qqmapsdk.getSuggestion({
      keyword:e.detail.value,
      success:res=>{
        // console.log(res);
        var sug = [];
        for(let i = 0; i < res.data.length; ++i){
          sug.push({
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          })
        }
        that.setData({//将关键词搜索结果以列表形式展示
          suggestion:sug,
          sngCondition:e.target.id
        })
      }
    });
  },

  //数据回填
  backfill:function(e){
    var that = this;
    var id = e.currentTarget.id
    for(let i = 0; i < that.data.suggestion.length; ++i){
      if(i == id){
        // console.log(that.data.suggestion[i]);
        var ll = that.data.suggestion[i].latitude+","+that.data.suggestion[i].longitude;
        if(that.data.sngCondition == 'start'){
          that.setData({
            ori:[that.data.suggestion[i].title, that.data.suggestion[i].addr, ll],
            sngCondition:e.target.id
          });
        }
        else if(that.data.sngCondition == 'dest'){
          let d = {id:'0', placeName:'', placeLocation:'', latAndLng:''};
          d.placeName = that.data.suggestion[i].title;
          d.placeLocation = that.data.suggestion[i].addr;
          d.latAndLng = ll;
          let newdes = []
          newdes.push(d);
          that.setData({
            des:newdes,
            sngCondition:e.target.id
          })
        }
      }
    }
  },

  addDes:function(){
    var len = this.data.des.length;
    var newPlace = {id:len,place:''};
    var newDes = this.data.des;
    newDes.push(newPlace);
    var newShow = this.data.inputShow;
    newShow[newShow.length - 1] = false;
    newShow.push(true);
    // 获取控件高度并换算为rpx
    let query = wx.createSelectorQuery();
    query.select('.des-area').boundingClientRect(rect=>{
      let clientHeight = rect.height;
      let clientWidth = rect.width;
      let ratio = 750 / clientWidth;
      let height = clientHeight * ratio;
      // console.log(height);
      var newHeight = this.data.inputHeight;
      newHeight[1] = height + 40;
      var that = this;
      that.setData({
        des: newDes,
        inputHeight: newHeight,
        inputShow: newShow
      })
    }).exec();
    this.onShow();
  },

  subtractDes:function(e){
    // console.log(e);
    var imgID = e.target.id;
    var id = imgID.substring(4, imgID.length);
    console.log(id);
    var newDes = this.data.des;
    if(newDes.length > 1){
      newDes.pop(id);
    }
    var newShow = this.data.inputShow;
    if(newShow.length > 1){
      newShow.pop(id);
      newShow[newShow.length-1] = true;
    }
    // 获取控件高度并换算为rpx
    let query = wx.createSelectorQuery();
    query.select('.des-area').boundingClientRect(rect=>{
      let clientHeight = rect.height;
      let clientWidth = rect.width;
      let ratio = 750 / clientWidth;
      let height = clientHeight * ratio;
      // console.log(height);
      var newHeight = this.data.inputHeight;
      if(height - 110 > newHeight[0]){
        newHeight[1] = height - 110;
      }
      else{
        newHeight[1] = newHeight[0];
      }
      var that = this;
      that.setData({
        des: newDes,
        inputHeight: newHeight,
        inputShow: newShow
      })
    }).exec();
    this.onShow();
  },

  changeStartTime:function(e){
    // console.log(e)
    var str = e.detail.value;
    var time = str.split("-");
    var s = time[0] + '年' + time[1] + '月' + time[2] + '日';
    this.setData({startTime:s})
    wx.setStorageSync('startTime', e.detail.value);
  },

  goToDetail:function(){
    this.getPlan();
    // 延时跳转，否则数据尚未存入缓冲区
    setTimeout(function(){
      wx.navigateTo({
            url: '../plan-detail/plan-detail',
          })
    },1000);
  },

  getDayDifference:function(d1, d2){
    var startDate = Date.parse(d1);
    var endDate = Date.parse(d2);
    var days = (endDate - startDate) / (1*24*60*60*1000);
    // console.log("dayDiff:"+days);
    return  days;
  },

  getPlan:function(){
    wx.setStorageSync('ori', this.data.ori);
    wx.setStorageSync('des', this.data.des);
    var that = this;
    var ori = that.data.ori;
    var des = that.data.des[0];
    console.log("ori="+ori+"des[0]="+des);
    // 初始化plan-style&plan-styleCN
    qqmapsdk.calculateDistance({
      mode: 'straight',//计算直线距离
      from: ori[2],
      to: des.latAndLng,
      success: function(res) {
        console.log(res);
        var res = res.result;
        var dis = res.elements[0].distance;
        var spos = 0;
        if(dis <= 2500){ spos = 0; }
        else if(dis > 2500 && dis <= 10000){ spos = 1; }
        else if(dis > 10000){ spos = 2; }
        console.log("spos:"+spos);
        wx.setStorageSync('spos', spos);
      }
    });
    // 初始化plan-weather&plan-advice
    var startDay = that.data.startTime;
    var curDay = new Date(Date.parse(new Date())+ 60*60*1000*8).toISOString().substring(0,10);
    console.log("startDay:"+startDay+"\tcurDay:"+curDay)
    var wpos = -1;
    if(this.getDayDifference(curDay, startDay) > 3){ wpos = 0;}
    var ll = des.latAndLng.split(",");
    var newll = ll[1]+","+ll[0];
    if(wpos == -1){//在3天之内
      var url ="https://devapi.qweather.com/v7/weather/3d?location="+newll+"&key=de39afa0019a48ec91676ee813d179a2"
      wx.request({
        url: url,
        success: function(res) {
          console.log(JSON.stringify(res));
          var w = res.data.daily[0].textDay;
          console.log("w:"+w);
          wx.setStorageSync('weather', w);
          var a = '';
          if(w.indexOf('晴') != -1 || w.indexOf('云') != -1){
            a = '很适合游玩哦';
          }
          else if(w.indexOf('阴') != -1){
            a = '请注意带好保暖衣物';
          }
          else if(w.indexOf('雨') != -1){
            a = '一定带好雨具呀';
          }
          else{
            a = '要不要考虑换一天呢';
          }
          wx.setStorageSync('advice', a);
        }
      })
      // 初始化newplan-restaurant
      qqmapsdk.search({
        keyword:"餐厅",
        location:that.data.des[0].latAndLng,
        success:function(res){
          console.log(res);
          wx.setStorageSync('restaurant', res.data);
        }
      });
      // 初始化newplan-hotel
      qqmapsdk.search({
        keyword:"酒店",
        location:that.data.des[0].latAndLng,
        success:function(res){
          console.log(res);
          wx.setStorageSync('hotel', res.data);
        }
      });
    }
    else{
      var w = '未知';
      var a = '不如等过两天再查查看';
      wx.setStorageSync('weather', w);
      wx.setStorageSync('advice', a);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化inputHeight
    let query = wx.createSelectorQuery();
    query.select('.des-area').boundingClientRect(rect=>{
      let clientHeight = rect.height;
      let clientWidth = rect.width;
      let ratio = 750 / clientWidth;
      let height = clientHeight * ratio;
      // console.log(height);
      var oriHeight = [height,height];
      var that = this;
      that.setData({
        inputHeight: oriHeight
      })
    }).exec();
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