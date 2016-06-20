var JPush = require('jpush-sdk');

module.exports = function (appKey, masterSecret, retryTimes, isDebug) {
  var client = JPush.buildClient(appKey, masterSecret, retryTimes, isDebug);

  return {
    // 通知拍卖师审核拍品
    notificationAuktionatorCheckProduct: function (auktionatorId, cb) {
      client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.alias(auktionatorId.toString()))
        .setNotification('尊敬的拍卖师，您有拍品需要审核，点击查看')
        .send(function(err, res) {
          if (err) return console.error('推送失败：', err.message);
          cb && cb(null, res);
        });
    }
  };
}
