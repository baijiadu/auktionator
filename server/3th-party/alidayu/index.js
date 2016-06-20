var TopClient = require('./topClient').TopClient;

module.exports = function (appkey, appsecret, REST_URL) {
  var client = new TopClient({
    appkey: appkey,
    appsecret: appsecret,
    REST_URL: REST_URL,
  });

  return {
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
          return cb && cb(err);
        }
        console.log('发送短信验证码成功：', res);
        cb && cb(null);
      })
    }
  }
}
