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
   attached(){
      this.lineCharts = this.selectComponent('#charts-bar');
      // console.log(this.lineCharts.init)
     
      this.judge()

      // let sums = this.data.barData.reduce((x,y)=>{
      //    return x+y
      // })
      
      this.setData({
         sum:this.data.barData.reduce((x,y)=>{
            return x+y
         })
      })
   },
   methods:{
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

      getData(){
         let options = {
            color: ['#3B63D5'],
            tooltip: {
               show: true,
               backgroundColor: 'rgba(0,0,0,0.5)',
               borderRadius: 10,
               trigger: 'axis',
               formatter(params) {
                  const item = params[0]

                  return `区域: ${item.name}
收入： ${item.data} 元`
               },
               position: function (pos, params, dom, rect, size) {
                  // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。

                  var obj = { top: 60 };
                  // obj[['right','left'][+(pos[0] < size.viewSize[0] / 2)]] = pos[0]+5;
                  obj['left'] = pos[0] < size.viewSize[0] / 2 ? pos[0] + 10 : pos[0] - 80

                  return obj;
               }
               
            },
            xAxis: {
               type: 'category',
               axisTick: {
                  show: false
               },
               data: ['嘉园工业区一期', '嘉园工业区二期', '嘉园工业区三期', '嘉园工业区四期', '嘉园工业区五期']
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
               itemStyle: {
                  normal: {
                     label: {
                        show: true,
                        position: 'top',
                        // textStyle: {
                        //    color: '#3B63D5'
                        // }
                     }
                  }
               },
               data: this.data.barData,
               type: 'bar',
               barWidth :30
            }]
         }

         return options
      },

      refresh(){
         let randomData_ = randomData()
         this.setData({
            barData: randomData_,
            sum: randomData_.reduce((x, y) => {
               return x + y
            })
         })
         this.judge()
      }
   }
})