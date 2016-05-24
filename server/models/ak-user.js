var async = require('async');

var Util = require('../utils/util');
var Config = require('../config.json');
var WXOpen = require('../3th-party/weixin/wxopen')({
  appId: Config.weixin.app.appId,
  appSecret: Config.weixin.app.appSecret
});

module.exports = function (AkUser) {
  AkUser.weixinAppAuth = function (code, done) {
    WXOpen.mobileAuth(code, function (err, userInfo) {
      if (err) return done({status: 500, message: '登陆失败', name: 'unknown error'});
      if (!userInfo) return done({status: 400, message: '获取用户信息失败', name: 'invalid error'});

      async.auto({
        findByOpenId: function (cb) {
          AkUser.findOne({
            where: {
              wx_openid: userInfo.openid
            }
          }, cb);
        },
        createOrUpdate: ['findByOpenId', function (cb, results) {
          var user = results.findByOpenId;
          var data = {
            nickname: userInfo.nickname,
            avatar: userInfo.headimgurl,
            sex: userInfo.sex === 1,
            country: userInfo.country,
            language: userInfo.language,
            province: userInfo.province,
            city: userInfo.city
          };

          if (user && user.id) {
            cb(null, user);
          } else {
            data.wx_openid = userInfo.openid;
            data.wx_unionid = userInfo.unionid;

            AkUser.create(data, cb);
          }
        }]
      }, function (err, results) {
        if (err) return done({status: 500, message: '数据保存失败', name: 'database error'});
        done(null, results.createOrUpdate);
      });
    });
  };
  AkUser.remoteMethod('weixinAppAuth', {
    http: {path: '/auth/weixin/app', verb: 'post'},
    accepts: {arg: 'code', type: 'string', required: true},
    description: '移动端APP微信授权登陆',
    returns: {
      arg: 'user',
      type: 'object'
    }
  });

  AkUser.weixinAppLogin = function (token, openid, done) {
    async.auto({
      findByOpenId: function (cb) {
        AkUser.findOne({
          where: {
            wx_openid: openid
          }
        }, cb);
      },
      checkToken: ['findByOpenId', function (cb, results) {
        var user = results.findByOpenId;

        if (!user) return cb({status: 400, message: '用户不存在', name: 'invalid error'});
        if (user.token != token) return cb({status: 400, message: 'token不匹配', name: 'invalid error'});
        if (user.token_created + user.token_ttl <= new Date().getTime()) {
          // 已过期
          user.token_created = new Date();
          user.token = Util.generateToken();
        }

      }]
    }, function (err, results) {
      if (err) return done({status: 500, message: '数据保存失败', name: 'database error'});
      done(null, results.createOrUpdate);
    });

  };
  AkUser.remoteMethod('weixinAppLogin', {
    http: {path: '/login/weixin/app', verb: 'post'},
    accepts: [
      {arg: 'token', type: 'string', required: true},
      {arg: 'openid', type: 'string', required: true}
    ],
    description: '移动端APP微信登陆，已授权过',
    returns: {
      arg: 'user',
      type: 'object'
    }
  });
};
