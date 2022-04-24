// miniprogram/pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismap: false,//是否显示地图
    mapBtnColor: '#ffffff',//地图按钮颜色
    positioningIcon: 'positioning_2',//地图按钮图标
    barFont:[65,50,50,50],//bar字体大小
    barColor:['black','gray','gray','gray'],//bar字体颜色
  },

  changeBar:function(e){
    // console.log(e);
    var that = this;
    var font = that.data.barFont;
    var color = that.data.barColor;
    for(var i = 0; i < 4; ++i){
      if(i == e.detail.current){
        font[i] = 65;
        color[i] = 'black';
      }
      else{
        font[i] = 50;
        color[i] = 'gray';
      }
    }
    that.setData({
      barFont:font,
      barColor:color
    })
  },

  openMap:function(){
    var that = this;
    if(that.data.ismap){
      that.setData({
        ismap:false,
        mapBtnColor:'#ffffff',
        positioningIcon:'positioning_2'
      });
    }
    else{
      that.setData({
        ismap:true,
        mapBtnColor:'#A2E6BD',
        positioningIcon:'positioning'
      });
    }
    that.onShow();
  },

  goToChat:function(e){
    // console.log(e);
    wx.navigateTo({
      url: 'chats/chats?groupid='+e.currentTarget.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo == ''){
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: function (res) {
          if (res.confirm) {       
            wx.getUserProfile({
              desc: '完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写(不写不弹提示框)
              success: (res) => {
                wx.clearStorage();
                wx.setStorageSync('userInfo', res.userInfo);
              }
            })
          }
        }
      })
    }

    // 初始化对话框最后一条消息
    var lastContent = wx.getStorageSync('lastContent')
    that.setData({lastContent:lastContent});
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
    var that = this;
    // 初始化对话框最后一条消息
    var lastContent = wx.getStorageSync('lastContent')
    that.setData({lastContent:lastContent});

    // 将头像缓存到本地
    if(that.data.ismap){
      wx.getLocation({
        type:'gcj02',
        success:res=>{
          // console.log(res)
          var avatarUrl = wx.getStorageSync('userInfo').avatarUrl;
          wx.downloadFile({
            url: avatarUrl,
            success: (pathInfo) => {
              // pathInfo.path 这是下载成的缓存链接，模拟器marker有时不支持http开头，真机不影响，得去掉http:/
              var cachePath = pathInfo.tempFilePath.replace("http:/", '').replace("https:/", '')//真机中无需replace，都支持
              // var cachePath = pathInfo.tempFilePath
              that.setData({
                latitude:res.latitude,
                longitude:res.latitude,
                markers:[{
                  latitude:res.latitude,
                  longitude:res.longitude,
                  iconPath:cachePath,
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
        }
      })
      that.mapCtx = wx.createMapContext('myMap');
      that.mapCtx.moveToLocation();
    }
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