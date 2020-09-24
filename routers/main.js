var express = require('express')
var crypto = require('crypto')
var router = express.Router()
var Category = require('../models/Category')
var Content = require('../models/Content')
var marked = require('marked')
var config = require('../config')
var request = require('request'),
  cache = require('memory-cache'),
  sha1 = require('sha1')
var data
// marked
var rendererMD = new marked.Renderer()
marked.setOptions({
  renderer: rendererMD,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
}) //基本设置

/*
 * 处理全局数据
 * */
router.use(function(req, res, next) {
  data = {
    userInfo: req.userInfo,
    categories: []
  }
  Category.find().then(function(categories) {
    data.categories = categories
    next()
  })
})
router.get('/', function(req, res, next) {
  data.category = req.query.category || ''
  data.page = req.query.page || 0
  data.contents = []
  data.pages = 0
  data.limit = 8
  data.count = 0

  var where = {}
  if (data.category) {
    where.category = data.category
  }
  //读取所有分类信息
  Content.where(where)
    .count()
    .then(function(count) {
      data.count = count
      //计算总页数
      data.pages = Math.ceil(count / data.limit)
      //取值不能超过pages
      data.page = Math.min(data.page, data.pages)
      //取值不能小于1
      data.page = Math.max(data.page, 1)
      var skip = (data.page - 1) * data.limit
      return Content.where(where)
        .find()
        .sort({ _id: -1 })
        .limit(data.limit)
        .skip(skip)
        .populate(['category', 'user'])
        .sort({
          addTime: -1
        })
    })
    .then(function(contents) {
      data.contents = contents
      if (data.page > 1) {
        return res.json(data)
      }
      res.render('main/index_1', data)
    })
})
router.get('/view', function(req, res) {
  var contentId = req.query.contentId || ''
  Content.findOne({
    _id: contentId
  }).then(function(content) {
    data.content = content
    content.views++
    content.save()
    res.render('main/view', data)
  })
})

// 微信sdk
// 验证服务器
router.get('/weixin', function(req, res) {
  //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
  var signature = req.query.signature, //微信加密签名
    timestamp = req.query.timestamp, //时间戳
    nonce = req.query.nonce, //随机数
    echostr = req.query.echostr //随机字符串

  //2.将token、timestamp、nonce三个参数进行字典序排序
  var array = [config.token, timestamp, nonce]
  array.sort()

  //3.将三个参数字符串拼接成一个字符串进行sha1加密
  var tempStr = array.join('')
  var hashCode = crypto.createHash('sha1') //创建加密类型
  var resultCode = hashCode.update(tempStr, 'utf8').digest('hex') //对传入的字符串进行加密
  console.log(signature)
  //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (resultCode === signature) {
    res.send(echostr)
  } else {
    res.send('mismatch')
  }
})

// 获取签名
router.get('/getsign', function(req, res) {
  var url = 'http://totrip.xin/demo'
  var noncestr = '123456',
    timestamp = Math.floor(Date.now() / 1000), //精确到秒
    jsapi_ticket
  var obj = {}
  if (cache.get('ticket')) {
    jsapi_ticket = cache.get('ticket')
    // console.log('1' + 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url);
    obj = {
      appId: config.appID,
      noncestr: noncestr,
      timestamp: timestamp,
      url: url,
      jsapi_ticket: jsapi_ticket,
      signature: sha1(
        'jsapi_ticket=' +
          jsapi_ticket +
          '&noncestr=' +
          noncestr +
          '&timestamp=' +
          timestamp +
          '&url=' +
          url
      )
    }
    res.send(obj)
  } else {
    request(
      'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' +
        config.appID +
        '&secret=' +
        config.appSecret,
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body)
          var tokenMap = JSON.parse(body)
          request(
            'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' +
              tokenMap.access_token +
              '&type=jsapi',
            function(error, resp, json) {
              if (!error && response.statusCode == 200) {
                var ticketMap = JSON.parse(json)
                cache.put('ticket', ticketMap.ticket, 1000 * 60 * 60 * 24) //加入缓存
                // console.log('jsapi_ticket=' + ticketMap.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url);
                obj = {
                  appId: config.appID,
                  noncestr: noncestr,
                  timestamp: timestamp,
                  url: url,
                  jsapi_ticket: ticketMap.ticket,
                  signature: sha1(
                    'jsapi_ticket=' +
                      ticketMap.ticket +
                      '&noncestr=' +
                      noncestr +
                      '&timestamp=' +
                      timestamp +
                      '&url=' +
                      url
                  )
                }
                res.send(obj)
              }
            }
          )
        }
      }
    )
  }
})

// 获取用户id
router.get('/getuser', function(req, res) {
  request(
    'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
      config.appID +
      '&redirect_uri=' +
      encodeURI('http://totrip.xin/demo') +
      '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
    function(error, response, body) {
      res.send(body)
    }
  )
})

router.get('/demo', function(req, res) {
  res.render('weixin/index')
})

module.exports = router
