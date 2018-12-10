/**
 * 防抖函数
 * @param method 事件触发的操作
 * @param delay 多少毫秒内连续触发事件，不会执行
 * @returns {Function}
 */
function debounce(method,delay) {
  let timer = null;
  return function () {
	let self = this,
	  args = arguments;
	timer && clearTimeout(timer);
	timer = setTimeout(function () {
	  method.apply(self,args);
	},delay);
  }
}

//格式化日期
function dateFtt(fmt,date) {  
  var o = {   
	"M+" : date.getMonth()+1,                 //月份   
	"d+" : date.getDate(),                    //日   
	"h+" : date.getHours(),                   //小时   
	"m+" : date.getMinutes(),                 //分   
	"s+" : date.getSeconds(),                 //秒   
	"q+" : Math.floor((date.getMonth()+3)/3), //季度   
	"S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
	fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
	if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 

function formateDate(time,times){
	var newTime = +new Date(time)+times*60;
	return top.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(newTime));//直接调用公共JS里面的时间类处理的办法     
}

// ajax
var jsGetAjaxPromise = function(url){
	return new Promise(function(resolve, reject ){
		 var xhr = new XMLHttpRequest()
		xhr.open('GET', url, true)

		xhr.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status === 200) {
					resolve(this.responseText, this)
				} else {
					var resJson = { code: this.status, response: this.response }
					reject(resJson, this)
				}
			}
		}
		xhr.send()
	})
}

// getTemplate
var getTemplate = function(contents){
	if(contents.length===0) return "";
	var template = ``;
	for(content of contents){
		template += `
			<div class="blog-card">
				<h4>${content.title}</h4>
				<hr/>
				<p style="font-size: 10px">
					<span class="blog-tag blog-tag--info"><span class="glyphicon glyphicon-user blog-icon"></span><span>${content.user?content.user.username:''}</span></span>&nbsp;
					<span class="blog-tag blog-tag--success"><span class="glyphicon glyphicon-time blog-icon"> </span><span>${formateDate(content.addTime,-8*60)}</span></span>&nbsp;
					<span class="blog-tag blog-tag--warning"><span class="glyphicon glyphicon-eye-open blog-icon"> </span><span>(${content.views})</span></span>&nbsp;
					<span class="blog-tag blog-tag--danger"><span class="glyphicon glyphicon-comment blog-icon"> </span><span>(${content.comments?content.comments.length:0})</span></span>
				</p>
				<p style="font-size: 15px">${content.description}</p>
				<p><a class="btn-sm blog-button" href="/view?contentId=${content._id}" role="button">查看全文 >>></a></p>
			</div>
		`
	}
	return template;
}

// parse dom
function parseToDOM(str){
   var div = document.createElement("div");
   if(typeof str == "string")
	   div.innerHTML = str;
   return div.childNodes;
} 

//render dom
function renderDom(nodes){
	nodes.forEach(function(item){
		if(item.nodeType ===1 ){
			ContentBox.appendChild(item)
		}
	})
}

//是否到底部
function isReachBottom () {
	let bodyScrollHeight = 0
	let documentScrollHeight = 0
	if (document.body) {
		bodyScrollHeight = document.body.scrollHeight
	}
	if (document.documentElement) {
		documentScrollHeight = document.documentElement.scrollHeight
	}

	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 获取滚动条的高度
	var winHeight = document.documentElement.clientHeight || document.body.clientHeight // 一屏的高度
	var scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight // 获取文档总高度
	return scrollTop >= (parseInt(scrollHeight) - winHeight) - 200
} 

