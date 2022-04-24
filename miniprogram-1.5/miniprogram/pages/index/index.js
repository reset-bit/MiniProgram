//index.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk= new QQMapWX({key:'DCPBZ-LQNL4-JRXUY-D2WQC-SPKJ6-44FSN'});

Page({
  data: {
    latitude:'',
    longitude:'',//保存当前位置经纬度
    markers:[],
    origin:[],//保存地点title\addr\lng+lat
    destination:[],    
    sngCondition:'',//当前选中控件
    style:'',//当前出行方式
    list_color:[],//list_border-bottom-color选中
    points:[]//map缩放所有点
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
        if(that.data.sngCondition == 'start'){
          that.setData({
            origin:[that.data.suggestion[i].title, that.data.suggestion[i].addr],
            sngCondition:e.target.id
          });
        }
        else if(that.data.sngCondition == 'dest'){
          that.setData({
            destination:[that.data.suggestion[i].title, that.data.suggestion[i].addr],
            sngCondition:e.target.id
          });
        }
      }
    }
  },

  // 获取出行方式
  getStyle:function(e){
    // console.log(e);
    var that = this;
    var id = e.target.id;
    var color = [];
    for(var i = 0; i < 4; ++i){
      color[i] = 0;
    }
    switch(id){
      case 'walking':
        that.setData({style:'walking'});
        color[0] = 1;
        break;
      case 'bicycling':
        that.setData({style:'bicycling'});
        color[1] = 1;
        break;
      case 'driving':
        that.setData({style:'driving'});
        color[2] = 1;
        break;
      case 'transit':
        that.setData({style:'transit'});
        color[3] = 1;
        break;
    }
    that.setData({list_color:color});
  },

  // 路线规划(按钮响应事件)
  planningRoute:function(){
    var that = this;
    // 地址解析
    qqmapsdk.geocoder({
      address: that.data.origin[1],
      success:res=>{
        // console.log(res)
        that.data.origin.push(res.result.location.lat + "," + res.result.location.lng);
      }
    })
    qqmapsdk.geocoder({
      address: that.data.destination[1],
      success:res=>{
        that.data.destination.push(res.result.location.lat + "," + res.result.location.lng);
      }
    })
    // 调用距离计算接口
    qqmapsdk.direction({
      mode: that.data.style,
      from: that.data.origin[2],
      to: that.data.destination[2],
      success:res=>{
        console.log(res);
        //画线业务逻辑
        if(that.data.style == 'transit'){
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
          //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
          that.setData({
            latitude:pl[0].latitude,
            longitude:pl[0].longitude,
            polyline: [{
              points: pl,
              color: '#79CDCD',
              width: 4
            }],
            markers:[{
              latitude:pl[0].latitude,
              longitude:pl[0].longitude,
              iconPath:'../../images/marker_s.png',
              width:30,
              height:40
            },
            {
              latitude:pl[pl.length-1].latitude,
              longitude:pl[pl.length-1].longitude,
              iconPath:'../../images/marker_e.png',
              width:30,
              height:40
            }],
            points:pl//页面缩放
          })
        }
        else{
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
          //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
          var start = that.data.origin[2].split(',');
          var end = that.data.destination[2].split(',');
          that.setData({
            latitude:pl[0].latitude,
            longitude:pl[0].longitude,
            polyline: [{
              points: pl,
              color: '#79CDCD',
              width: 4
            }],
            markers:[{
              latitude:start[0],
              longitude:start[1],
              iconPath:'../../images/marker_s.png',
              width:30,
              height:40
            },
            {
              latitude:end[0],
              longitude:end[1],
              iconPath:'../../images/marker_e.png',
              width:30,
              height:40
            }],
            points:pl//页面缩放
          })
        }
      }
    })
  },

  onLoad: function() {
    wx.getLocation({
      success:res=>{
        // console.log(res)
        this.setData({
          latitude:res.latitude,
          longitude:res.longitude,
          markers:[{
            latitude:res.latitude,
            longitude:res.longitude,
            iconPath:'../../images/marker_small.png',
            width:40,
            height:40
          }]
        })
      }
    })
    //逆地址解析
    qqmapsdk.reverseGeocoder({
      location:'',
      success:res=>{
        // console.log(res)
        this.setData({
          origin:[res.result.formatted_addresses.recommend, res.result.address]
        })
      }
    })
    // 出行方式初始化
    var color = [1,0,0,0];
    this.setData({list_color:color});
    // 转移map中心点到当前位置
    this.mapCtx = wx.createMapContext('myMap');
    this.mapCtx.moveToLocation();
  }
})