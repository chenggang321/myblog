/**
 * Created by Administrator on 2017/5/17.
 */
/*
 *js Unicode编码转换
 */
var decToHex = function(str) {
    var res=[];
    for(var i=0;i < str.length;i++)
        res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
    return "\\u"+res.join("\\u");
}
var hexToDec = function(str) {
    str=str.replace(/\\/g,"%");
    return unescape(str);
}
var str=decToHex("decToHex unicode 编码转换");
alert("编码后："+str+"\n\n解码后："+hexToDec(str));