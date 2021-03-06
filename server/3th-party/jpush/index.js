var JPush = require('jpush-sdk');
var _ = require('underscore');

module.exports = function (appKey, masterSecret, retryTimes, isDebug) {
  var client = JPush.buildClient(appKey, masterSecret, retryTimes, isDebug);

  return {
    // 通知拍卖师审核拍品
    notificationAuktionatorCheckProduct: function (product, cb) {
      var pid = product.id;

      client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.alias('u_' + product.auktionatorId.toString()))
        .setNotification(
          JPush.android('尊敬的拍卖师！您有拍品需要审核，点击查看详情', null, null, {code: 100, pid: pid}),
          JPush.ios('尊敬的拍卖师！您有拍品需要审核，点击查看详情', null, null, null, {code: 100, pid: pid})
        )
        .send(function(err, res) {
          if (err) return console.error('notificationAuktionatorCheckProduct-推送失败：', err.message);
          cb && cb(null, res);
        });
    },
    // 通知卖家审核通过
    notificationSellerProductPassed: function (product, cb) {
      var pid = product.id;

      client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.alias('u_' + product.ownerId.toString()))
        .setNotification(
          JPush.android('恭喜您！您的拍品已审核通过，赶紧点击查看详情', null, null, {code: 101, pid: pid}),
          JPush.ios('恭喜您！您的拍品已审核通过，赶紧点击查看', null, null, null, {code: 101, pid: pid})
        )
        .send(function(err, res) {
          if (err) return console.error('notificationSellerProductPassed-推送失败：', err.message);
          cb && cb(null, res);
        });
    },
    // 通知卖家审核未通过
    notificationSellerProductRejected: function (product, cb) {
      var pid = product.id;

      client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.alias('u_' + product.ownerId.toString()))
        .setNotification(
          JPush.android('很遗憾！您的拍品未能审核通过，点击查看详情', null, null, {code: 102, pid: pid}),
          JPush.ios('很遗憾！您的拍品未能审核通过，点击查看详情', null, null, null, {code: 102, pid: pid})
        )
        .send(function(err, res) {
          if (err) return console.error('notificationSellerProductRejected-推送失败：', err.message);
          cb && cb(null, res);
        });
    },
    // 通知拍场内拍品的商家拍场发布消息
    notificationGameProductOwnersOnline: function (game, products, cb) {
      var gid = game.id;
      var time = game.dateNo + ' ' + game.begin;
      var aliases = _.map(products, function (p) {return 'u_' + p.ownerId.toString()});

      client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.alias(aliases.join(',')))
        .setNotification(
          JPush.android('恭喜您！您的拍品已被加入拍场，将于' + time + '时进行，点击查看详情', null, null, {code: 103, gid: gid}),
          JPush.ios('恭喜您！您的拍品已被加入拍场，将于' + time + '时进行，点击查看详情', null, null, null, {code: 103, gid: gid})
        )
        .send(function(err, res) {
          if (err) return console.error('notificationGameProductOwnersOnline-推送失败：', err.message);
          cb && cb(null, res);
        });
    },
    // 通知关注了拍场的拍卖师的用户开拍的消息
    notificationGameAKFollowersBeginning: function (game, cb) {
      var gid = game.id;
      var tags = ['ak_followers_' + game.auktionatorId.toString()];

      client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.tag(tags.join(',')))
        .setNotification(
          JPush.android('您关注的拍卖师发布了拍场，赶紧去查看吧！', null, null, {code: 104, gid: gid}),
          JPush.ios('您关注的拍卖师发布了拍场，赶紧去查看吧！', null, null, null, {code: 104, gid: gid})
        )
        .send(function(err, res) {
          if (err) return console.error('notificationGameAKFollowersBeginning-推送失败：', err.message);
          cb && cb(null, res);
        });
    },
    // 通知卖家有拍品正在热拍
    notificationSellerProductBeginning: function (product, cb) {
      var pid = product.id;

      client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.alias('u_' + product.ownerId.toString()))
        .setNotification(
          JPush.android('您的拍品<' + product.title + '>正在热拍中，点击查看详情', null, null, {code: 105, pid: pid}),
          JPush.ios('您的拍品<' + product.title + '>正在热拍中，点击查看详情', null, null, null, {code: 105, pid: pid})
        )
        .send(function(err, res) {
          if (err) return console.error('notificationSellerProductBeginning-推送失败：', err.message);
          cb && cb(null, res);
        });
    },
    // 通知拍卖师卖家已取消
    notificationAuktionatorProductCanceled: function (product, cb) {
      var pid = product.id;

      client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.alias('u_' + product.auktionatorId.toString()))
        .setNotification(
          JPush.android('尊敬的拍卖师！您有拍品被取消了，如有疑问请联系商家或联系我们', null, null, {code: 106, pid: pid}),
          JPush.ios('尊敬的拍卖师！您有拍品被取消了，如有疑问请联系商家或联系我们', null, null, null, {code: 106, pid: pid})
        )
        .send(function(err, res) {
          if (err) return console.error('notificationAuktionatorProductCanceled-推送失败：', err.message);
          cb && cb(null, res);
        });
    },
  };
}
