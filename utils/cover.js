//ArrayBuffer 转16进制字符串

function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

//inArray (要查找的值，数组，数组中的值)
// 找不到返回 -1
function inArray(val, arr, key) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i
    }
  }
  return -1;
}

//16进制转为string
function hex2ab(hex){

}


module.exports={
  tohex:ab2hex,
  inArray : inArray
}