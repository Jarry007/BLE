import * as echarts from '../../../ec-canvas/echarts';
var chart = null;

const randomData = function () {
   const arry = new Array
   for (let i = 0; i < 5; i++) {
      arry.push(Math.floor(Math.random() * 100))
   }
   return arry

}
Component({

   properties: {

   },
   options: {
      addGlobalClass: true
   },

   data: {
      ec: {
         lazyLoad: true
      },
      barData: [120, 200, 150, 80, 70]
   },
   attached() {
      this.lineCharts = this.selectComponent('#charts-radar');
      console.log(this.lineCharts.init)

      this.judge()
   },
   methods: {
      judge() {
         if (!chart) {
            this.initLine()
         } else {
            this.setOption(chart)
         }
      },
      initLine() {
         this.lineCharts.init((canvas, width, height) => {

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
         let options = {
           
            tooltip: {
               show: true,
               backgroundColor: 'rgba(0,0,0,0.5)',
               borderRadius: 10,
               trigger: 'axis',

            },
            radar: [
               {
                  indicator: [
                     { text: '电站一' },
                     { text: '电站二' },
                     { text: '电站三' },
                     { text: '电站四' }
                  ],
                
                  // radius: 120,
                  startAngle: 90,
                  splitNumber: 4,
                  shape: 'circle',
                  name: {
                     // formatter: '【{value}】',
                     textStyle: {
                        color: '#bbb'
                     }
                  },
                  // splitArea: {
                  //    areaStyle: {
                  //       color: ['rgba(114, 172, 209, 0.2)',
                  //          'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
                  //          'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
                  //       shadowColor: 'rgba(0, 0, 0, 0.3)',
                  //       shadowBlur: 10
                  //    }
                  // },
                  // axisLine: {
                  //    lineStyle: {
                  //       color: 'rgba(255, 255, 255, 0.5)'
                  //    }
                  // },
                  // splitLine: {
                  //    lineStyle: {
                  //       color: 'rgba(255, 255, 255, 0.5)'
                  //    }
                  // }
               }
              
            ],
            series: [
               {
                  name: '雷达图',
                  type: 'radar',
                  itemStyle: {
                     emphasis: {
                        // color: 各异,
                        lineStyle: {
                           width: 4
                        }
                     }
                  },
                  data: [
                     {
                        value: [100, 8, 0.40, -80],
                        name: '图一',
                        symbol: 'rect',
                        symbolSize: 5,
                        areaStyle: {
                           normal: {
                              color: 'rgba(255,170,0, 0.5)'
                           }
                        },
                        lineStyle: {
                           normal: {
                             color:'orange'
                           }
                        },
                        label: {
                           normal: {
                              show: true,
                              formatter: function (params) {
                                 return params.value;
                              }
                           }
                        }
                     },
                     {
                        value: [60, 5, 0.30, 70],
                        name: '图二',
                        areaStyle: {
                           normal: {
                              color: 'rgba(255, 255, 255, 0.5)'
                           }
                        },
                        label: {
                           normal: {
                              show: true,
                              formatter: function (params) {
                                 return params.value;
                              }
                           }
                        }
                     }
                  ]
               }]
         }

         return options
      },

      refresh() {
         this.setData({
            barData: randomData()
         })
         this.judge()
      }
   }
})