/*
 * 应用程序启动（入口）文件
 * */
//加载express模块
var express = require('express')
// http 模块
var http = require('http')
var https = require('https')
var fs = require('fs')

//加载模板处理模块
var swig = require('swig')
//加载数据库模块
var mongoose = require('mongoose')
//加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser')

//加载cookies模块
var Cookies = require('cookies')
//创建app应用 =>NodeJs Http.creatServer()
var app = express()

var compression = require('compression')
app.use(compression()) // 需要位于 express.static 前面，否则不起作用
app.use(express.static('public')) // public 文件夹中的静态资源都将被做 gzip 处理

var User = require('./models/Users')

//配置应用模板
//定义当前应用所用的模板引擎
//第一个参数：模板引擎的名称，同时也是模板的后缀，第二个参数表示用于解析处理模板的方法
app.engine('html', swig.renderFile)
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views', './views')
//注册所使用的模板，第一个参数必须是views engine 第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine', 'html')
//开发过程中需要取消模板缓存
swig.setDefaults({ cache: false })

//bodyparse设置
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

//设置cookies
app.use(function(req, res, next) {
  req.cookies = new Cookies(req, res)
  //解析登录用户的cookies信息
  req.userInfo = {}
  if (req.cookies.get('userInfo')) {
    try {
      var userInfoString = new Buffer(
        req.cookies.get('userInfo'),
        'base64'
      ).toString() //str是base64编码的字符串
      req.userInfo = JSON.parse(userInfoString)
      //获取当前登录用户的类型，是否是管理员
      User.findById(req.userInfo._id).then(function(userInfo) {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
        next()
      })
    } catch (e) {
      next()
    }
  } else {
    next()
  }
})

app.get('/*', function(req, res, next) {
  res.setHeader('Last-Modified', new Date().toUTCString())
  next()
})

/*
 * 根据不同的功能划分模块
 * */
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))

//设置静态文件托管
//当前用户访问的URL以/public开始，那么直接返回对应__dirname+'/public'下的文件
app.use('/public', express.static(__dirname + '/public'))

//连接数据库
mongoose.connect(
  'mongodb://totrip.xin:27017/blog',
  // {
  //   user: 'blog',
  //   pass: '1129137164@qq.com',
  //   useMongoClient: true
  // },
  function(err) {
    if (err) {
      console.log('数据库连接失败')
    } else {
      console.log('数据库连接成功')
      //监听http请求重定向到https
      http
        .createServer((req, res) => {
          res.writeHead(301, { Location: 'https://totrip.xin/' })
          res.end()
        })
        .listen(80)
      // 监听https
      var httpsOption = {
        key: fs.readFileSync('./ssl/Nginx/5063496_totrip.xin.key'),
        cert: fs.readFileSync('./ssl/Nginx/5063496_totrip.xin.pem')
      }
      https.createServer(httpsOption, app).listen(443)
    }
  }
)
