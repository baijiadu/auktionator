var Config = require('../config.json');

module.exports = {
  WXOpen: require('./weixin/wxopen')(Config.weixin.app.appId, Config.weixin.app.appSecret),// 微信开放平台
  alidayu: require('./alidayu/index')(Config.alidayu.appkey, Config.alidayu.appsecret, Config.alidayu.REST_URL),// 阿里大鱼
  qiniu: require('./qiniu/index')(Config.qiniu.AccessKey, Config.qiniu.SecretKey, Config.qiniu.bucket),// 七牛云储存
  JPush: require('./jpush/index')(Config.jpush.appKey, Config.jpush.masterSecret),// 极光推送
};
