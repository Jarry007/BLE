import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
var data_ = []
function addNum(){
  var num = Math.random()*10+15
  data_ = data_.concat([num])
  return data_ 
}
function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

 

  chart.setOption(option);
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      lazyLoad: true
      }
    
  },
  onLoad:function(){
    this.lineCharts = this.selectComponent('#mychart-line');
    console.log(this.lineCharts)
    setTimeout(this.initLine(),1000)
    
  },
  initLine(){
    this.lineCharts.init((canvas, width, height)=>{
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(this.getData());
      return chart
    })
  },
  getData(){
    console.log('ha')
    let option = {
      title: {
        text: '温度、湿度变化表',
        left: 'center',
        subtext: 'BLE4.0蓝牙'
      },
      color: ["#FF6666", "#3366FF", "#FF9933"],
      legend: {
        data: ['温度', '湿度', '浓度'],
        top: 20,
        left: 'center',
        z: 100
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        axisLable: {
          formatter: "{value} ℃"
        },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
        // show: false
      },
      series: [{
        name: '温度',
        type: 'line',
        smooth: true,
        data: setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            setTimeout(() => {
              addNum()
              console.log(addNum())
            }, 1000)
          }
          return addNum()
        }, 100),
        markLine: {
          symbol: "none",               //去掉警戒线最后面的箭头
          label: {
            position: "end"          //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
          },
          data: [{
            silent: false,             //鼠标悬停事件  true没有，false有
            lineStyle: {               //警戒线的样式  ，虚实  颜色
              type: "dotta",
              color: "#FA3934",
            },
            yAxis: 11.75           // 警戒线的标注值，可以有多个yAxis,多条警示线   或者采用   {type : 'average', name: '平均值'}，type值有  max  min  average，分为最大，最小，平均值
          }]
        }
      }, {
        name: '湿度',
        type: 'line',
        smooth: true,
        data: [15.1, 13.2, 17.3, 20.4, 16.9, 15.0, 14.3]
      },
      {
        name: '浓度',
        type: 'line',
        smooth: true,
        data: [16.1, 13.6, 11.3, 18.4, 18.9, 17.0, 18.2]
      },]
    }
    return option
  },
  changeValue(){
    
  }
});
