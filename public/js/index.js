$(function(){
    var $loginBox=$('#loginBox');
    var $registerBox=$('#registerBox');
    var $userInfo=$('#userInfo');
    //切换到注册面板
    $loginBox.find('a.colMint').on('click',function(){
        $registerBox.show();
        $loginBox.hide();
    });

    //切换到登陆面板
    $registerBox.find('a.colMint').on('click',function(){
        $registerBox.hide();
        $loginBox.show();
    });
    //注册事件
    $registerBox.find('input:button').on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$registerBox.find('[name="username"]').val(),
                password:$registerBox.find('[name="password"]').val(),
                repassword:$registerBox.find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function(res){
                console.log(res);
                $registerBox.find('.colWarning').html(res.message);
                if(!res.code){
                    //注册成功
                    setTimeout(function(){
                        $loginBox.show();
                        $registerBox.hide();
                    },1000);
                }
            }
        });
    });
    function login(){
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$loginBox.find('[name="username"]').val(),
                password:$loginBox.find('[name="password"]').val()
            },
            dataType:'json',
            success:function(res){
                $loginBox.find('.colWarning').html(res.message);
                if(!res.code){
                    window.location.reload();
                }
            }
        });
    }
    // 回车登陆
    $loginBox.find('input:password').keydown(function(e){
        if(e.keyCode==13){
            login();
        }
    });
    //登录模块
    $loginBox.find('input:button').on('click',function(){
        login();
    });
    //退出
    $('#logout').on('click',function(){
        $.ajax({
            url:'/api/user/logout',
            success:function(res){
                if(!res.code){
                    window.location.reload();
                }
            }
        });
    });
})
var hexToDec = function(str) {
    str=str.replace(/\\/g,"%");
    return unescape(str);
}