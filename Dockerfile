#制定node镜像的版本
FROM node:12.18-alpine
#移动当前目录下面的文件到app目录下
ADD . /app/
#更改alpine的安装源指向阿里源
RUN echo "http://mirrors.aliyun.com/alpine/v3.9/main/" > /etc/apk/repositories
#安装 bash 和 busybox
RUN apk update \
        && apk upgrade \
        && apk add --no-cache bash \
        bash-doc \
        bash-completion \
        && /bin/bash \
        && apk add --no-cache busybox \
        && rm -rf /var/cache/apk/*
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
