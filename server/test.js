TopClient = require('./3th-party/alidayu/topClient').TopClient;
var client = new TopClient({
  'appkey': '23370126',
  'appsecret': '6ab8182732cd5ba6c9f6ac7b7cfe7901',
  'REST_URL': 'http://gw.api.taobao.com/router/rest'
});

console.log(JSON.stringify({code: 1234, product: '百家渡拍卖师'}));

client.execute('alibaba.aliqin.fc.sms.num.send', {
  extend: '123456',
  sms_type: 'normal',
  sms_free_sign_name: '身份验证',
  sms_param: '{"code": "1234", "product": "百家渡拍卖师"}',
  rec_num: '13167181237',
  sms_template_code: 'SMS_5013429'
}, function (err, res) {
  if (!err) console.log(res);
  else console.log(err);
})
