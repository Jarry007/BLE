import * as echarts from '../../../ec-canvas/echarts';
var chart = null;

const randomData = function () {
   const arry = new Array
   for (let i = 0; i < 4; i++) {
      arry.push(Math.floor(Math.random() * 500))
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
      pieData: [
         { value: 335, name: '支付宝' },
         { value: 310, name: '微信' },
         { value: 234, name: '余额' },
         { value: 135, name: '储值卡' },
         // { value: 548, name: '嘉业工业园区五期' },
         // { value: 348, name: '嘉业工业园区六期' }
      ]
   },
   attached() {
      this.lineCharts = this.selectComponent('#charts-pie');
     
      this.judge()
      const list = Array.from(this.data.pieData,({value})=>value)

      this.setData({
         sum:list.reduce((x,y)=>{
            return x+y
         })
      })
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
         chart.setOption(this.getData()); //获取新数据
      },

      getData() {
         let options = {
            color: ['#5f7ce4', '#32b8f5', '#639bfa', '#65dfe2', '#9287e7','#ff7c7c'],
            tooltip: {
               trigger: 'item',
               formatter: " {b}: {c} ({d}%)",
               position: function (pos, params, dom, rect, size) {
                  // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。

                  var obj = { top: 60 };
                  console.log(pos)
                  // obj[['right','left'][+(pos[0] < size.viewSize[0] / 2)]] = pos[0]+5;
                  obj['left'] = pos[0] < size.viewSize[0] /2.4 ? pos[0] + 10 : pos[0] - 100

                  return obj;
               }
            },
            legend: {
               orient: 'vertical',
               left:20,
               top:50,
               // formatter:function(c) {
                 
               //    return 'Legend ';
               // },
               data: ['支付宝', '微信', '余额', '储值卡'],
               textStyle:{
                  fontSize:'11'
               }
            },
            series: [
               {
                  type: 'pie',
                  radius: ['45%', '80%'],
                  center: ['65%', '50%'],
                  avoidLabelOverlap: false,
                  label: {
                     show:false,
                     position: 'inside',
                     formatter:'{b}:({d}%)',
                     fontSize: 10,///
                     textShadowColor:'none',
                     textBorderWidth:'1',
                 
                     // color:'inherit'
                     // textBorderColor:  'none'
                     // normal: {
                     //    show: false,
                     //    position: 'center'
                     // },
                     // emphasis: {
                     //    show: true,
                     //    textStyle: {
                     //       fontSize: '11'
                     //    }
                     // }
                  },
                  // labelLine: {
                  //    normal: {
                  //       show: false
                  //    }
                  // },
                  data: this.data.pieData
               }
            ]
         }
         return options
      },

      refresh() {
         const pie = this.data.pieData
         const val_ = new Array
         // pie.map(({value})=>{
         //    console.log(value)
         //    value = Math.floor(Math.random()*500)
         //    val_.push(value)
         // })
         pie.forEach(item=>{
            item.value = Math.floor(Math.random() * 500)
            val_.push(item.value)
         })
       
         this.setData({
            pieData:pie,
            sum:val_.reduce((x,y)=>{
               return x+y
            })
         })
         this.judge()
      }
   }
})