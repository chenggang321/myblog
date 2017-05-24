/*
* 应用程序启动（入口）文件
* */
//加载express模块
var express=require('express');

//加载模板处理模块
var swig=require('swig');
//创建app应用 =>NodeJs Http.creatServer();
var app=express();

//设置静态文件托管
//当前用户访问的URL以/public开始，那么直接返回对应__dirname+'/public'下的文件
app.use('/public',express.static(__dirname+'/public'));

//配置应用模板
//定义当前应用所用的模板引擎
//第一个参数：模板引擎的名称，同时也是模板的后缀，第二个参数表示用于解析处理模板的方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views','./views');
//注册所使用的模板，第一个参数必须是views engine 第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine','html');
//开发过程中需要取消模板缓存
swig.setDefaults({cache:false});

/*
 * 首页
 * req res next
 * */
app.get('/',function(req,res,next){
    //res.send('<h1>欢迎来到我的博客！</h1>');

    /*
     * 读取views目录下制定的文件
     * 第一个参数：表示模板文件，相对于views目录 views/index.html
     * 第二个参数：传递给模板使用的数据
     * */
    res.render('index');
});

app.listen(8081);