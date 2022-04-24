// miniprogram/pages/route-plan/plan-detail/plan-detail.js
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk= new QQMapWX({key:'DCPBZ-LQNL4-JRXUY-D2WQC-SPKJ6-44FSN'});

var styles = ['walking','bicycling','driving','transit'];
var stylesCN = ['步行','骑行','驾车','公交'];
Page({
  data: {
    markers:[],
    points:[],
    sngCondition:'',//当前选中控件id
    stylePos:0,//当前出行方式下标，styles[]
    ismap:true,
    mapBtnColor:'#7697FA',
    positioningIcon:'positioning'
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
    // 若数据在操作过程中发生变化，需要将新数据重新绑定到该变量中
    var id = e.currentTarget.id;//获取点击条目的下标值
    // e.currentTarget 代表的是，注册了监听点击事件的组件。
    // e.target 代表的是，实际触发了点击事件的组件。
    for(let i = 0; i < that.data.suggestion.length; ++i){
      if(i == id){
        // console.log(that.data.suggestion[i]);
        var ll = that.data.suggestion[i].latitude+","+that.data.suggestion[i].longitude;
        if(that.data.sngCondition == 'start'){
          that.setData({
            ori:[that.data.suggestion[i].title, that.data.suggestion[i].addr, ll],
            sngCondition:e.target.id,
            oriName:that.data.suggestion[i].title
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
            sngCondition:e.target.id,
            desName:that.data.suggestion[i].title
          })
        }
      }
    }
  },

  // 获取出行方式
  getStyle:function(e){
    // console.log(e);
    var that = this;
    var id = e.target.id;
    var spos = 0;
    switch(id){
      case 'walking': spos = 0; break;
      case 'bicycling': spos = 1; break;
      case 'driving': spos = 2; break;
      case 'transit': spos = 3; break;
    }
    that.setData({
      stylePos:spos
    });
    that.initDirection();
    that.onShow();
  },

  onLoad: function(options) {
    var that = this;
    var ori = wx.getStorageSync('ori');
    var des = wx.getStorageSync('des');
    var spos = wx.getStorageSync('spos');
    var weather = wx.getStorageSync('weather');
    var advice = wx.getStorageSync('advice');
    var restaurant = wx.getStorageSync('restaurant');
    var newRes = [];
    for(var i = 0; i < restaurant.length; ++i){
      newRes.push({
        id:i,
        title:restaurant[i].title,
        selected:false
      })
    }
    var hotel = wx.getStorageSync('hotel');
    var newHot = [];
    for(var i = 0; i < hotel.length; ++i){
      newHot.push({
        id:i,
        title:hotel[i].title,
        selected:false
      })
    }
    // console.log(weather+advice+restaurant+hotel);
    that.setData({
      oriName:ori[0],
      desName:des[0].placeName,
      stylePos:spos,
      style:styles[spos],
      styleCN:stylesCN[spos],
      weather:weather,
      advice:advice,
      restaurant:newRes,
      hotel:newHot,
    })
    that.initDirection();
    that.onShow();
  },

  // 路线规划(按钮响应事件)
  initDirection:function(){
    var that = this;
    var spos = that.data.stylePos;
    var ori = wx.getStorageSync('ori');
    var des = wx.getStorageSync('des');
    var orill = ori[2];
    var desll = des[0].latAndLng;
    var steps = [];
    // console.log(typeof ori);
    console.log(orill+"    "+desll);
    // 调用距离计算接口
    qqmapsdk.direction({
      mode: styles[spos],
      from: orill,
      to: desll,
      success:res=>{
        console.log(res);
        //画线业务逻辑
        if(styles[spos] != 'transit'){
          var ret = res;
          var coors = ret.result.routes[0].polyline;
          var pl = [];
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          for (var i = 0; i < coors.length; i += 2) {
            pl.push({ latitude: coors[i], longitude: coors[i + 1] });
          }
          for(var i = 0; i < res.result.routes[0].steps.length; ++i){
            steps.push(res.result.routes[0].steps[i].instruction);
          }
        }
        else{
          var ret = res.result.routes[0];
          var count = ret.steps.length;
          var pl = [];
          var coors = [];
          //获取各个步骤的polyline
          for(var i = 0; i < count; i++) {
            if (ret.steps[i].mode == 'WALKING' && ret.steps[i].polyline) {
              coors.push(ret.steps[i].polyline);
            }
            if (ret.steps[i].mode == 'TRANSIT' && ret.steps[i].lines[0].polyline) {
              coors.push(ret.steps[i].lines[0].polyline);
            }
          }       
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 0 ; i < coors.length; i++){
            for (var j = 2; j < coors[i].length; j++) {
              coors[i][j] = Number(coors[i][j - 2]) + Number(coors[i][j]) / kr;
            }
          }
          //定义新数组，将coors中的数组合并为一个数组
          var coorsArr = [];
          for (var i = 0 ; i < coors.length; i ++){
            coorsArr = coorsArr.concat(coors[i]);
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coorsArr.length; i += 2) {
            pl.push({ latitude: coorsArr[i], longitude: coorsArr[i + 1] })
          }
          //汇总各路线步骤
          var allStep = res.result.routes[0].steps;
          for(var i = 0; i < allStep.length; ++i){
            if(allStep[i].mode == 'TRANSIT'){
              var busDeatil = allStep[i].lines[0];
              var str = "乘坐"+busDeatil.title+"公交车,";
              str += "在"+busDeatil.geton.title+"站上车，在"+busDeatil.getoff.title+"站下车";
              steps.push(str);
            }
            else{
              for(var j = 0; j < allStep[i].steps.length; ++j){
                steps.push(allStep[i].steps[j].instruction);
              }
            }
          }
        }
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        var start = orill.split(',');
        var end = desll.split(',');
        that.setData({
          polyline: [{
            points: pl,
            color: '#79CDCD',
            width: 4
          }],
          markers:[{
            latitude:start[0],
            longitude:start[1],
            iconPath:'../../../../images/marker_s.png',
            width:30,
            height:40
          },
          {
            latitude:end[0],
            longitude:end[1],
            iconPath:'../../../../images/marker_e.png',
            width:30,
            height:40
          }],
          points:pl,//页面缩放
          distance:res.result.routes[0].distance,
          duration:res.result.routes[0].duration,
          steps:steps
        })
        wx.setStorageSync('distance', res.result.routes[0].distance);
        wx.setStorageSync('duration', res.result.routes[0].duration);
        // console.log(that.data.steps);
        that.mapCtx = wx.createMapContext('myMap');
        that.mapCtx.includePoints(that.data.points);
      },
      fail: function (e) {
        console.error(e);
      }
    });
  },

  getAdvRestaurant:function(e){
    var that = this;
    var allRes = that.data.restaurant;    
    var id = e.currentTarget.id;
    for(let i = 0; i < allRes.length; ++i){
      if(i == id){
        allRes[i].selected = true;
      }
      else{
        allRes[i].selected = false;
      }
    }
    that.setData({
      restaurant:allRes
    })
    that.onShow();
  },

  getAdvHotel:function(e){
    var that = this;
    var allHot = that.data.hotel;    
    var id = e.currentTarget.id;
    for(let i = 0; i < allHot.length; ++i){
      if(i == id){
        allHot[i].selected = true;
      }
      else{
        allHot[i].selected = false;
      }
    }
    that.setData({
      hotel:allHot
    })
    that.onShow();
  },

  openMap:function(){
    var that = this;
    if(that.data.ismap){
      that.setData({
        ismap:false,
        mapBtnColor:'#ffffff',
        positioningIcon:'positioning_1'
      });
    }
    else{
      that.setData({
        ismap:true,
        mapBtnColor:'#7697FA',
        positioningIcon:'positioning'
      });
    }
  },

  createPlan:function(){
    var plan = {};
    plan.oriName = this.data.oriName;
    plan.desName = this.data.desName;
    plan.time = wx.getStorageSync('startTime');
    plan.style = this.data.style;
    for(let i = 0; i < this.data.restaurant.length; ++i){
      if(this.data.restaurant[i].selected == true){
        plan.restaurant = this.data.restaurant[i].title;
        break;
      }
    }
    for(let i = 0; i < this.data.hotel.length; ++i){
      if(this.data.hotel[i].selected == true){
        plan.hotel = this.data.hotel[i].title;
        break;
      }
    }
    var plans = wx.getStorageSync('plans');
    console.log(plans);
    if(plans == ""){
      plans = [];
    }
    plans.push(plan);
    console.log(plans);
    wx.setStorageSync('plans', plans);
    wx.showToast({
      title: '方案已添加',
    })
  }
})