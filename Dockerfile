#制定node镜像的版本
FROM node
#移动当前目录下面的文件到app目录下
ADD . /app/
#进入到app目录下面，类似cd
WORKDIR /app
#镜像选择淘宝的镜像
RUN npm config set registry=http://registry.npm.taobao.org
#安装依赖
RUN npm install
#对外暴露的端口
EXPOSE 80 443
#程序启动脚本
CMD ["npm", "start"]
