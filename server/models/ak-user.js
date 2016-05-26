var async = require('async');
var bcrypt = require('bcrypt-nodejs');

var Util = require('../utils/util');
var Config = require('../config.json');
var WXOpen = require('../3th-party/weixin/wxopen')({
  appId: Config.weixin.app.appId,
  appSecret: Config.weixin.app.appSecret
});

module.exports = function (AkUser) {
  AkUser.weixinAuth = function (code, done) {
    WXOpen.auth(code, function (err, data) {
      if (err || !data) return done({status: 500, message: '授权失败', code: 100 });

      var userInfo = data.userInfo;
      var accessToken = data.accessToken;
      if (!userInfo || !accessToken) return done({status: 400, message: '获取用户信息失败', code: 101});

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
        if (err) return done({status: 500, message: '数据保存失败', code: 102});
        done(null, results.createOrUpdate);
      });
    });
  };
  AkUser.remoteMethod('weixinAuth', {
    http: {path: '/weixin/auth', verb: 'post'},
    accepts: {arg: 'code', type: 'string', required: true},
    description: '微信授权登陆',
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
      if (err) return done({status: 500, message: '服务器内部错误', code: 100});
      if (!user) return done({status: 400, message: '用户不存在', code: 101});
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
        if (!user) return cb({status: 400, message: '用户不存在', code: 100});

        WXOpen.getUserInfo({
          openid: user.wx_openid,
          access_token: user.wx_access_token,
          refresh_token: user.wx_refresh_token,
        }, cb);
      }],
      updateAccessToken: ['findByOpenId', 'getUserInfo', function (cb, results) {
        var data = results.getUserInfo;
        if (!data) return done({status: 500, message: '授权失败', code: 101 });

        var userInfo = data.userInfo;
        var accessToken = data.accessToken;
        if (!userInfo || !accessToken) return done({status: 400, message: '获取用户信息失败', code: 102});

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
      if (err) return done({status: 500, message: '数据保存失败', code: 'database error'});
      done(null, results.createOrUpdate);
    });
    */
  };
  AkUser.remoteMethod('weixinLogin', {
    http: {path: '/weixin/login', verb: 'post'},
    accepts: [
      {arg: 'openid', type: 'string', required: true}
    ],
    description: '微信登陆，已授权过',
    returns: {
      arg: 'user',
      type: 'object'
    }
  });

  AkUser.login = function (account, password, done) {
    var where = {};
    if (/^1[3|4|5|7|8]\d{9}$/.test(account)) {
      where = { tel: account };
    } else if (/^\w+$/.test(account)) {
      where = { username: account };
    } else {
      return done({status: 400, message: '账户格式不正确', code: 100})
    }

    AkUser.findOne({
      where: where
    }, function (err, user) {
      if (err) return done({status: 500, message: '服务器内部错误', code: 101});
      if (!user) return done({status: 400, message: '用户名或密码错误', code: 102});
      if (!bcrypt.compareSync(password, user.password)) return done({status: 400, message: '用户名或密码错误', code: 102});
      done(null, user);
    });
  };

  AkUser.remoteMethod('login', {
    http: {path: '/login', verb: 'post'},
    accepts: [
      {arg: 'account', type: 'string', required: true},
      {arg: 'password', type: 'string', required: true}
    ],
    description: '使用账户、密码登陆',
    returns: {
      arg: 'user',
      type: 'object'
    }
  });

  AkUser.register = function (username, tel, password, done) {
    if (!/^\w{2,19}$/.test(username)) return done({status: 400, message: '用户名格式不正确', code: 100});
    if (!/^1[3|4|5|7|8]\d{9}$/.test(tel)) return done({status: 400, message: '手机号格式不正确', code: 101});
    if (!/^[a-zA-Z]\w{5,17}$/.test(password)) return done({status: 400, message: '密码格式不正确', code: 102});

    async.auto({
      findByUserName: function (cb) {
        AkUser.findOne({where: {username: username}}, cb);
      },
      findByTel: function (cb) {
        AkUser.findOne({where: {tel: tel}}, cb);
      },
      verify: ['findByUserName', 'findByTel', function (cb, results) {
        if (results.findByUserName) return cb({status: 400, message: '用户名已存在', code: 103});
        if (results.findByTel) return cb({status: 400, message: '手机已存在', code: 104});

        AkUser.create({
          username: username,
          tel: tel,
          password: bcrypt.hashSync(password)
        }, cb);
      }]
    }, function (err, results) {
      if (err) return done(err.code ? err : {status: 500, message: '服务器内部错误', code: 105});
      done(null, results.verify);
    });
  };

  AkUser.remoteMethod('register', {
    http: {path: '/register', verb: 'post'},
    accepts: [
      {arg: 'username', type: 'string', required: true},
      {arg: 'tel', type: 'string', required: true},
      {arg: 'password', type: 'string', required: true}
    ],
    description: '注册',
    returns: {
      arg: 'user',
      type: 'object'
    }
  });
};
