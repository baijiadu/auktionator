# 拍卖师APP

---

## 环境搭建

- Node.js安装
    > [参考Node官网](https://nodejs.org/en/download/)

- 安装cordova

        npm install -g cordova

- 安装Ionic
    > [参考Ionic官网](http://ionicframework.com/docs/v2/getting-started/installation/)

    > [Ionic命令](http://ionicframework.com/docs/v2/cli/)

        npm install -g ionic@beta

## 浏览器运行

    ionic serve

## 手机端运行（以下只针对window系统）

### Android

- JDK下载安装及环境搭建
    > [参考JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

- Android SDK安装及配置
    > [云盘地址](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

        打开环境变量
        1、添加系统变量 ANDROID_HOME=your/sdk/path
        2、追加%ANDROID_HOME%至Path中，注意‘,’号

- 添加Android平台

        ionic platform add android

- 运行APP

        ionic run android

### IOS

    TODO

## 开发技巧

- 浏览器开发模式下

      ionic serve

- 手机开发模式下

      ionic run xxx（参考[Ionic命令](http://ionicframework.com/docs/v2/cli/)）
