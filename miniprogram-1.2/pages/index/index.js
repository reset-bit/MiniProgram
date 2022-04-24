// pages/index/index.js
//生成随机颜色
function getRandomColor(){
  let rgb = []
  for(let i = 0; i < 3; ++i){
    let color = Math.floor(Math.random() * 256).toString(16)//一次生成2位数，不足补0
    color = (color.length == 1) ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')//join()用于将数组中所有元素放入一个字符串，可传连接符-->javascript语法
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        id:'1',
        title:'第一个视频',
        videoUrl:'http://www.w3school.com.cn//i/movie.mp4'
      },
      {
        id:'2',
        title:'第二个视频',
        videoUrl:'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
      },
      {
        id:'3',
        title:'第三个视频',
        videoUrl:'http://vjs.zencdn.net/v/oceans.mp4'
      },
      {
        id:'4',
        title:'第四个视频',
        videoUrl:'https://media.w3.org/2010/05/sintel/trailer.mp4'
      }
    ],
    src:'',
    danmuTxt:''
  },

  playVideo:function(e){
    this.videoContext.stop()//停止播放之前正在播放的视频
    this.setData({
      src:e.currentTarget.dataset.url
    })
    this.videoContext.play()//更新视频地址
  },

  getDanmu:function(e){
    this.setData({
      danmuTxt:e.detail.value//获取input输入值
    })
  },

  sendDanmu:function(e){
    //设置弹幕样式
    this.videoContext.sendDanmu({
      text:this.data.danmuTxt,
      color:getRandomColor()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.videoContext = wx.createVideoContext('myVideo')//关联video组件
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