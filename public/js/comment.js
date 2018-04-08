var prepage=5;
var page=1;
var pages=0;
var comments=[];
//搜索文章
$('#searchBtn').on('click',function(){
    $.ajax({
        type:'post',
        url:'/api/search',
        data:{keyWord:$('#keyWord').val()},
        success:function(responseData){
            var html="";
            if(responseData.content[0]){
                var content=responseData.content[0];
                 html=`
                <div style="padding:20px 10px;background: #D9EDF7;border-radius: 3px; margin-bottom:10px;">
                    <h4>${content.title}</h4>
                    <hr/>
                    <p style="font-size: 10px">
                        <span style="background:#393939; color:white;border-radius: 3px; padding: 3px 4px"><span class="glyphicon glyphicon-user"></span><span>${responseData.username}</span></span>&nbsp;
                        <span style="background:#FFC219; color:white;border-radius: 3px; padding: 3px 4px"><span class="glyphicon glyphicon-time"> </span><span>${content.addTime}</span></span>&nbsp;
                        <span style="background:#E32551; color:white;border-radius: 3px; padding: 3px 4px"><span class="glyphicon glyphicon-eye-open"> </span><span>(${content.views})</span></span>&nbsp;
                        <span style="background:#73C8A9; color:white;border-radius: 3px; padding: 3px 4px"><span class="glyphicon glyphicon-comment"> </span><span>(${content.comments.length})</span></span>
                    </p>
                    <p style="font-size: 15px">${content.description}</p>
                    <p><a class="btn btn-primary btn-sm" href="/view?contentId=${content._id}" role="button">查看全文</a></p>
                 </div>
            `
            }else{
                html=`<div class="alert alert-warning text-center" role="alert">没有找到您要搜索的内容</div>`;
            }
            console.log(html);
            $(".testContent").html(html);
        }
    });
});
//提交评论
$('#messageBtn').on('click',function(){
    $.ajax({
        type:'post',
        url:'/api/comment/post',
        data:{
            contentid:$('#contentId').val(),
            content:$('#messageContent').val(),
        },
        success:function(responseData){
            //console.log(responseData);
            $('#messageContent').val('');
            comments=responseData.data.comments.reverse();
            renderComment();
        }
    });
});
//每次加载时获取文章下的所有评论
$.ajax({
    type:'get',
    url:'/api/comment',
    data:{
        contentid:$('#contentId').val()
    },
    success:function(responseData){
        comments=responseData.data.reverse();
        renderComment();
    }
});

$('.pager').delegate('a','click',function(){
    if($(this).parent().hasClass('previous')){
        page--
    }else{
        page++
    }
    renderComment();
})

function renderComment(){
    $('.messageCount').html(comments.length);
    var pages=Math.max(Math.ceil(comments.length/prepage),1);

    var pageList=$('.pager .pageList').html(page+"/"+pages);
    var start=Math.max(0,(page-1)*prepage);
    var end=Math.min(start+prepage,comments.length);
    var previous=$('.pager .previous');
    var next=$('.pager .next');

    if(page<=1){
        page=1;
        previous.html(`
        <span>
            <b aria-hidden="true">&larr;</b> 没有上一页了
        </span>
     `);
    }else{
        previous.html(`
        <li class="previous">
            <a href="javascript:;"><span aria-hidden="true">&larr;</span>上一页</a>
        </li>
     `);
    }
    if(page>=pages){
        page=pages;
        next.html(`
        <span>
            <b aria-hidden="true">&larr;</b> 没有下一页了
        </span>
        `);
    }else{
        next.html(`
        <li class="next">
            <a href="javascript:;"><span aria-hidden="true">&larr;</span>下一页</a>
        </li>
     `);
    }

    if(comments.length==0){
        $('.messageList').html(`
            <div class="alert" role="alert" style="text-align: center">
                还没有评论
            </div>
        `);
        $('.pager').hide();
    }else{
        var html='';
        for(var i=start;i<end;i++){
            html+=`
            <div class="panel-body">
                <div class="row">
                    <div class="col-xs-6">${comments[i].username}</div>
                    <div class="col-xs-6" style="text-align: right">
                        ${formatDate(comments[i].postTime)}
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        ${comments[i].content}
                    </div>
                </div>
            </div>
        `;
        }
        $('.messageList').html(html);
    }
}
//格式化日期
function formatDate(d){
    var date1=new Date(d);
    var CurrentDate = "";
   //初始化时间
    var Year= date1.getFullYear();//ie火狐下都可以
    var Month= date1.getMonth()+1;
    var Day = date1.getDate();
    var Hours = date1.getHours();
    var Minutes = date1.getMinutes();
    var Seconds = date1.getSeconds();
    CurrentDate += Year + "年";
    Month >= 10 ? (CurrentDate += Month + "月"):(CurrentDate += "0" + Month + "月");
    Day >= 10 ? (CurrentDate += Day +"日 "):(CurrentDate += "0" + Day+"日 ");
    Hours>=10 ? (CurrentDate += Hours +"："):(CurrentDate += "0"+Hours +"：");
    Minutes>=10 ? (CurrentDate += Minutes +"："):(CurrentDate += "0"+Minutes +"：");
    Seconds>=10 ? (CurrentDate += Seconds):(CurrentDate += "0"+Seconds);
    return CurrentDate;
}