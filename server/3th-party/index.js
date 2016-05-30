var WXOpen = require('./weixin/wxopen');
var TopClient = require('./alidayu/topClient').TopClient;
var Config = require('../config.json');

var thirdParties = {};

var wxOpen = thirdParties.wxOpen = WXOpen({
  appId: Config.weixin.app.appId,
  appSecret: Config.weixin.app.appSecret
})

var alidayu = thirdParties.alidayu = {
  client: new TopClient({
    appkey: Config.alidayu.appkey,
    appsecret: Config.alidayu.appsecret,
    REST_URL: 'http://gw.api.taobao.com/router/rest'
  }),
  sendVerifyCode: function (tel, code, cb) {
    alidayu.client.execute('alibaba.aliqin.fc.sms.num.send', {
      extend: '123456',
      sms_type: 'normal',
      sms_free_sign_name: '身份验证',
      sms_param: '{"code": "' + code + '", "product": "【百家渡·拍卖师】"}',
      rec_num: tel,
      sms_template_code: 'SMS_5013429'
    }, function (err, res) {
      if (err) {
        console.error('发送短信验证码异常：', err);
        return cb(err);
      }
      console.log('发送短信验证码成功：', res);
      cb(null);
    })
  }
}

module.exports = thirdParties;
