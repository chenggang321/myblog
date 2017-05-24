var express = require('express');
var router = express.Router();
var Category=require('../models/Category');
var Content=require('../models/Content');
var data;

/*
* 处理全局数据
* */
router.use(function(req,res,next){
    data={
        userInfo:req.userInfo,
        categories:[]
    }
    Category.find().then(function(categories){
        data.categories=categories;
        next();
    });
});
router.get('/',function(req,res,next){
    data.category=req.query.category||'';
    data.page=req.query.page||0;
    data.contents=[];
    data.pages=0;
    data.limit=3;
    data.count=0;

    var where={};
    if(data.category){
        where.category=data.category;
    }
    //读取所有分类信息
    Content.where(where).count().then(function(count){
        data.count=count;
        //计算总页数
        data.pages=Math.ceil(count/data.limit);
        //取值不能超过pages
        data.page=Math.min(data.page,data.pages);
        //取值不能小于1
        data.page=Math.max(data.page,1);
        var skip=(data.page-1)*data.limit;
        return Content.where(where).find().sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','user']).sort({
            addTime:-1
        });
    }).then(function(contents){
        data.contents=contents;
        res.render('main/index_1',data);
    });
});
router.get('/view',function(req,res){
    var contentId=req.query.contentId||'';
    Content.findOne({
        _id:contentId
    }).then(function(content){
        console.log(content);
        data.content=content;
        content.views++;
        content.save();
        res.render('main/view',data);
    });
});
module.exports = router;