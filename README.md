# mybolg
采用nodejs+express+mongodb+mongoose,搭建一个个人博客系统，在项目中我们实现了用户注册、登录、博客文章列表、内容预览和评论功能，后台的：注册用户管理、博客分类管理、博客内容以及评论的管理功能。


## 部署方法

1. 安装nodejs，官网下载安装
[nodejs官网](https://nodejs.org/en/)
2. 安装mongodb，官网下载安装（如果查看数据库需要安装Robomongo）
[mongodb官网](https://www.mongodb.com)
mongodb图像化界面客户端Robomongo请自行百度安装
3. 安装开发环境

- 在项目主文件夹下打开cmd
输入命令：
npm install

4. 运行项目

- 运行mongodb
安装好mongodb后进入源文件夹的bin目录下打开cmd
输入命令 ：
mongod --dbpath=数据库数据保存地址 --port=端口

- 运行项目主文件
在项目主文件夹下打开cmd
输入命令：
node app.js

5.在浏览器查看项目

- 本地访问页面：http://localhost:8081/
- 服务器访问页面：http://服务器ip:8081/

