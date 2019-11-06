import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

const randomData = function(){
   const arry = new Array
   for(let i=0;i<12;i++){
      arry.push(Math.floor(Math.random() * 100))
   }
   return arry
   
}

var chart = null;

Page({
   data: {
      ec: {
         lazyLoad: true
      },
      x: ['10-1', '10-2', '10-3', '10-4', '10-5', '10-6', '10-7', '10-8', '10-9', '10-10', '10-11', '10-12',],
      temperature: [17.3, 20.4, 16.9, 15.0, 14.3, 13.2, 17.3, 20.4, 16.9, ],
      y:[25,24,43,45,43,14,53,21,35,25,62]

   },
   onLoad: function() {
      this.lineCharts = this.selectComponent('#mychart-line');
      console.log(this.lineCharts.init)
      this.judge()

   },
   judge() {
      if (!chart) {
         this.initLine()
      } else {
         this.setOption(chart)
      }
   },
   initLine() {
      this.lineCharts.init((canvas, width, height) => {
         console.log('www',canvas)
         
         chart = echarts.init(canvas, null, {
            width: width,
            height: height
         });
         this.setOption(chart);
         return chart
      })
   },
   setOption(chart) {
      // chart.clear(); // 清除
      chart.setOption(this.getData()); //获取新数据
   },
   getData() {
      let option = {
         grid: {
            containLabel: true
         },
         tooltip: {
            show: true,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 10,
            trigger: 'axis',
            formatter(params) {
               const item = params[0]

               return `${item.name}
${item.data}度`
            },
            position: function (pos, params, dom, rect, size) {
               // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
              
               var obj = { top: 60 };
               // obj[['right','left'][+(pos[0] < size.viewSize[0] / 2)]] = pos[0]+5;
               obj['left'] = pos[0] < size.viewSize[0] / 2?pos[0]+10:pos[0]-50
               
               return obj;
            }
         },

         xAxis: {
            type: 'category',
            boundaryGap: false,
            axisTick: {
               show: false
            },
            data: this.data.x,
            // show: false
         },
         yAxis: {
            x: 'center',
            type: 'value',
            axisLabel: {
               show: false
            },
            axisLine: {
               show: false
            },
            axisTick: {
               show: false
            },
            splitLine: {
               show: false
            }

         },

         series: [{

            type: 'line',
            smooth: true,
            symbol: 'none',
            label: {

            },
            data: this.data.y,
            itemStyle: {
               normal: {
                  lineStyle: {
                     width: 0,
                     color: 'blue'
                  }
               }
            },
            areaStyle: {
               normal: {
                  color: {
                     type: 'linear',
                     x: 0,
                     y: 0,
                     x2: 0,
                     y2: 1,
                     colorStops: [{
                        offset: 0,
                        color: '#7f8de6' // 0% 处的颜色

                     }, 
                        {offset: 0.5,
                           color: '#a7afe2' // 0% 处的颜色

                     }, {
                        offset: 1,
                        color: 'white' // 100% 处的颜色
                     }],
                  }

               }
            },

         }]
      }
      return option
   },

   refresh() {
     
      this.setData({
         active: !this.data.active
      })

      setTimeout(() => {
         this.setData({
            active: !this.data.active,
            nowTime:new Date().toLocaleString()
         })
         
      }, 500)
      this.getlineData()

   },
   getlineData() {
      this.setData({
         y: randomData()

      })
      // console.log(chart)
      this.judge()
   }
});