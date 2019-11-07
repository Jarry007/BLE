// pages/component/line/line.js
Component({

   properties: {

   },
   options: {
      addGlobalClass: true
   },

   data: {
      color: ['#f25c5c', '#f2865c','#f2bd5c'],
      userList:[{
         name:'嘉园工业园一期',
         all:453,
         active:123
      }, {
         name: '嘉园工业园二期',
            all: 596,
            active: 456
         }, {
            name: '嘉园工业园三期',
            all: 545,
            active: 345
         }, {
            name: '嘉园工业园四期',
            all: 344,
            active: 294}]
   },
   attached() {
     const list = Array.from(this.data.userList ,({active})=>active)

      const ary = this.data.userList
     this.setData({
        sum:list.reduce((x,y)=>{
           return x+y
        }),
        userList: ary.sort((x, y) => {
           let a = x.active,
              b = y.active
           return b - a
        })
     })
   },
   methods:{
      refresh() {

         const ary = this.data.userList
         const active_ = new Array
         ary.forEach(item=>{
            item.active =Math.floor(item.all * Math.random())
            active_.push(item.active)
         })
         this.setData({
            userList: ary.sort((x, y) => {
               let a = x.active,
                  b = y.active
               return b - a
            }),
            sum: active_.reduce((x,y)=>{
               return x+y
            })
         })
      }
   }
  
})