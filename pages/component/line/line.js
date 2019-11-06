// pages/component/line/line.js
Component({

   properties: {

   },
   options: {
      addGlobalClass: true
   },

   data: {
      color:['red','orange','yellow'],
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
     
   },
  
})