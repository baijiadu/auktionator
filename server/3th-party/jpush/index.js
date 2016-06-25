var JPush = require('jpush-sdk');

module.exports = function (appKey, masterSecret, retryTimes, isDebug) {
  var client = JPush.buildClient(appKey, masterSecret, retryTimes, isDebug);

  return {
    // 通知拍卖师审核拍品
    notificationAuktionatorCheckProduct: function (auktionatorId, cb) {
      client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.alias(auktionatorId.toString()))
        .setNotification(
          JPush.android('尊敬的拍卖师！您有拍品需要审核，点击查看详情', null, null, {code: 100}),
          JPush.ios('尊敬的拍卖师！您有拍品需要审核，点击查看详情', null, null, null, {code: 100})
        )
        .send(function(err, res) {
          if (err) return console.error('推送失败：', err.message);
          cb && cb(null, res);
        });
    },
    // 通知卖家审核通过
    notificationSellerProductPassed: function (ownerId, cb) {
      client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.alias(ownerId.toString()))
        .setNotification(
          JPush.android('恭喜您！您的拍品已审核通过，赶紧点击查看详情', null, null, {code: 101}),
          JPush.ios('恭喜您！您的拍品已审核通过，赶紧点击查看', null, null, null, {code: 101})
        )
        .send(function(err, res) {
          if (err) return console.error('推送失败：', err.message);
          cb && cb(null, res);
        });
    },
    // 通知卖家审核未通过
    notificationSellerProductRejected: function (ownerId, cb) {
      client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.alias(ownerId.toString()))
        .setNotification(
          JPush.android('很遗憾！您的拍品未能审核通过，点击查看详情', null, null, {code: 102}),
          JPush.ios('很遗憾！您的拍品未能审核通过，点击查看详情', null, null, null, {code: 102})
        )
        .send(function(err, res) {
          if (err) return console.error('推送失败：', err.message);
          cb && cb(null, res);
        });
    }
  };
}
