var async = require('async');

var Util = require('../utils/util');
var Config = require('../config.json');
var WXOpen = require('../3th-party/weixin/wxopen')({
  appId: Config.weixin.app.appId,
  appSecret: Config.weixin.app.appSecret
});

module.exports = function (AkUser) {
  AkUser.weixinAuth = function (code, done) {
    WXOpen.auth(code, function (err, data) {
      if (err || !data) return done({status: 500, message: '授权失败', name: 100 });

      var userInfo = data.userInfo;
      var accessToken = data.accessToken;
      if (!userInfo || !accessToken) return done({status: 400, message: '获取用户信息失败', name: 101});

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
            wx_access_token: accessToken.access_token,
            wx_refresh_token: accessToken.refresh_token,
            wx_refresh_token_modified: new Date(),
            nickname: userInfo.nickname,
            avatar: userInfo.headimgurl,
            sex: userInfo.sex === 1,
            country: userInfo.country,
            language: userInfo.language,
            province: userInfo.province,
            city: userInfo.city
          };

          if (user) {
            cb(null, user);
          } else {
            data.wx_openid = userInfo.openid;
            data.wx_unionid = userInfo.unionid;

            AkUser.create(data, cb);
          }
        }]
      }, function (err, results) {
        if (err) return done({status: 500, message: '数据保存失败', name: 102});
        done(null, results.createOrUpdate);
      });
    });
  };
  AkUser.remoteMethod('weixinAuth', {
    http: {path: '/weixin/auth', verb: 'post'},
    accepts: {arg: 'code', type: 'string', required: true},
    description: '移动端APP微信授权登陆',
    returns: {
      arg: 'user',
      type: 'object'
    }
  });

  AkUser.weixinLogin = function (openid, done) {
    AkUser.findOne({
      where: {
        wx_openid: openid
      }
    }, function (err, user) {
      if (err) return done({status: 500, message: '服务器内部错误', name: 100});
      if (!user) return done({status: 400, message: '用户不存在', name: 101});
      done(null, user);
    });

    /*
    async.auto({
      findByOpenId: function (cb) {
        AkUser.findOne({
          where: {
            wx_openid: openid
          }
        }, cb);
      },
      getUserInfo: ['findByOpenId', function (cb, results) {
        var user = results.findByOpenId;
        if (!user) return cb({status: 400, message: '用户不存在', name: 100});

        WXOpen.getUserInfo({
          openid: user.wx_openid,
          access_token: user.wx_access_token,
          refresh_token: user.wx_refresh_token,
        }, cb);
      }],
      updateAccessToken: ['findByOpenId', 'getUserInfo', function (cb, results) {
        var data = results.getUserInfo;
        if (!data) return done({status: 500, message: '授权失败', name: 101 });

        var userInfo = data.userInfo;
        var accessToken = data.accessToken;
        if (!userInfo || !accessToken) return done({status: 400, message: '获取用户信息失败', name: 102});

        var user = results.findByOpenId;
        if (accessToken.expires_in || accessToken.scope) {
          // 刷新过token
          user.updateAttributes({
            wx_access_token: accessToken.access_token,
            wx_refresh_token: accessToken.refresh_token,
          }, cb);
        } else {
          cb(null, user);
        }
      }]
    }, function (err, results) {
      if (err) return done({status: 500, message: '数据保存失败', name: 'database error'});
      done(null, results.createOrUpdate);
    });
    */
  };
  AkUser.remoteMethod('weixinLogin', {
    http: {path: '/weixin/login', verb: 'post'},
    accepts: [
      {arg: 'openid', type: 'string', required: true}
    ],
    description: '移动端APP微信登陆，已授权过',
    returns: {
      arg: 'user',
      type: 'object'
    }
  });

  AkUser.login = function (account, password, done) {
    AkUser.findOne({
      where: {
        wx_openid: openid
      }
    }, function (err, user) {
      if (err) return done({status: 500, message: '服务器内部错误', name: 100});
      if (!user) return done({status: 400, message: '用户不存在', name: 101});
      done(null, user);
    });

    /*
     async.auto({
     findByOpenId: function (cb) {
     AkUser.findOne({
     where: {
     wx_openid: openid
     }
     }, cb);
     },
     getUserInfo: ['findByOpenId', function (cb, results) {
     var user = results.findByOpenId;
     if (!user) return cb({status: 400, message: '用户不存在', name: 100});

     WXOpen.getUserInfo({
     openid: user.wx_openid,
     access_token: user.wx_access_token,
     refresh_token: user.wx_refresh_token,
     }, cb);
     }],
     updateAccessToken: ['findByOpenId', 'getUserInfo', function (cb, results) {
     var data = results.getUserInfo;
     if (!data) return done({status: 500, message: '授权失败', name: 101 });

     var userInfo = data.userInfo;
     var accessToken = data.accessToken;
     if (!userInfo || !accessToken) return done({status: 400, message: '获取用户信息失败', name: 102});

     var user = results.findByOpenId;
     if (accessToken.expires_in || accessToken.scope) {
     // 刷新过token
     user.updateAttributes({
     wx_access_token: accessToken.access_token,
     wx_refresh_token: accessToken.refresh_token,
     }, cb);
     } else {
     cb(null, user);
     }
     }]
     }, function (err, results) {
     if (err) return done({status: 500, message: '数据保存失败', name: 'database error'});
     done(null, results.createOrUpdate);
     });
     */
  };
  AkUser.remoteMethod('login', {
    http: {path: '/weixin/login', verb: 'post'},
    accepts: [
      {arg: 'openid', type: 'string', required: true}
    ],
    description: '移动端APP微信登陆，已授权过',
    returns: {
      arg: 'user',
      type: 'object'
    }
  });

};
