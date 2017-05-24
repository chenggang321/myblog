var express = require('express');
var router = express.Router();
var User = require('../models/Users');
var Content=require('../models/Content');

//返回统一格式
var responseData;

router.use(function(req,res,next){
    responseData={
        code:0,
        message:''
    }
    next();
});

/*
* 注册
*   注册逻辑
*   1.用户名不能为空
*   2.密码不能为空
*   3.两次密码不不一致
*
*   1、用户已注册
*       数据库查询
*
* */
router.post('/user/register',function(req,res,next){
    console.log(req.body);
    var username=req.body.username;
    var password=req.body.password;
    var repassword=req.body.repassword;
    //用户名是否为空
    if(username==''){
        responseData.code=1;
        responseData.message="用户名为空";
        res.json(responseData);
        return;
    }
    //密码是否为空
    if(password==''){
        responseData.code=2;
        responseData.message="密码为空";
        res.json(responseData);
        return;
    }
    //密码是否为空
    if(repassword==''){
        responseData.code=2;
        responseData.message="密码为空2";
        res.json(responseData);
        return;
    }
    //密码是否一致
    if(repassword!=password){
        responseData.code=3;
        responseData.message="密码输入不一致";
        res.json(responseData);
        return;
    }

    //用户名是否注册
    User.findOne({
        username:username
    }).then(function(userInfo){
        //console.log(userInfo);
        if(userInfo){
            responseData.code = 4;
            responseData.message="用户已注册";
            res.json(responseData);
            return;
        }
        //保存用户注册信息
        var user =new User({
            username:username,
            password:password
        });
        return user.save();
    }).then(function(newUserInfo){
        //console.log(newUserInfo);
        responseData.message="注册成功";
        res.json(responseData);
    });

});

/*
*
* 登录
* */
router.post('/user/login',function(req,res,next){
    var username=req.body.username;
    var password=req.body.password;
    console.log(username,password)
    if(username==''||password==''){
        responseData.code=1;
        responseData.message='用户名和密码不能为空'
        res.json(responseData);
        return;
    }
    //查询数据库中用户名和密码是否存在
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code=2;
            responseData.message='用户名或密码错误'
            res.json(responseData);
            return;
        }
        //用户名和密码正确
        responseData.message='登录成功';
        responseData.userInfo={
            _id:userInfo._id,
            username:userInfo.username
        }
        //console.log(userInfo);
        //var data = JSON.stringify({_id:userInfo._id,username:userInfo.username});
        //console.log(data);

        req.cookies.set('userInfo',JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        }));
        res.json(responseData);
        return;
    });
});
/*
* 退出
* */
router.get('/user/logout',function(req,res){
    req.cookies.set('userInfo',null);
    res.json(responseData);
});

/*
* 获取指定文章的所有评论
* */
router.get('/comment',function(req,res){
    var contentId=req.query.contentid||'';
    Content.findOne({
        _id:contentId
    }).then(function(content){
        responseData.data=content.comments;
        res.json(responseData);
    })
});
/*
 * 评论提交
 * */
router.post('/comment/post',function(req,res){
    //内容的id
    var contentId=req.body.contentid||'';
    var postData={
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    }
    //查询当前这篇内容的信息
    Content.findOne({
        _id:contentId
    }).then(function(content){
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent){
        responseData.message='评论成功';
        responseData.data=newContent;
        res.json(responseData);
    });
});
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
//var str=decToHex("decToHex unicode 编码转换");
//alert("编码后："+str+"\n\n解码后："+hexToDec(str));
module.exports = router;