var _ = require('underscore');
var loopback = require('loopback');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');

var Util = require('../utils/util');
var thirdParties = require('../3th-party');
var wxOpen = thirdParties.wxOpen;
var alidayu = thirdParties.alidayu;

module.exports = function (AkUser) {
  AkUser.weixinAuth = function (code, tel, done) {
    if (_.isFunction(tel) && !done) {
      done = tel;
      tel = null;
    }

    wxOpen.auth(code, function (err, data) {
      if (err || !data) return done({status: 500, message: '授权失败', code: 100});

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

          // 如果手机号传入了则绑定手机号
          if (tel) data.tel = tel;

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
    accepts: [
      {arg: 'code', type: 'string', required: true},
      {arg: 'tel', type: 'string', required: false}
    ],
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
      where = {tel: account};
    } else if (/^\w{2,19}$/.test(account)) {
      where = {username: account};
    } else {
      return done({status: 400, message: '账户格式不正确', code: 100});
    }
    if (!/^[a-zA-Z]\w{5,17}$/.test(password)) return done({status: 400, message: '密码格式不正确', code: 103});

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

  AkUser.autoLogin = function (tel, done) {
    AkUser.findOne({
      where: {
        tel: tel
      }
    }, function (err, user) {
      if (err) return done({status: 500, message: '服务器内部错误', code: 100});
      if (!user) return done({status: 400, message: '用户不存在', code: 101});
      done(null, user);
    });
  };
  AkUser.remoteMethod('autoLogin', {
    http: {path: '/login/auto', verb: 'post'},
    accepts: [
      {arg: 'tel', type: 'string', required: true}
    ],
    description: '进入APP自动登录',
    returns: {
      arg: 'user',
      type: 'object'
    }
  });

  AkUser.register = function (username, tel, password, code, done) {
    if (!/^\w{2,19}$/.test(username)) return done({status: 400, message: '用户名格式不正确', code: 100});
    if (!/^1[3|4|5|7|8]\d{9}$/.test(tel)) return done({status: 400, message: '手机号格式不正确', code: 101});
    if (!/^\d{6}$/.test(code)) return done({status: 400, message: '验证码格式不正确', code: 106});
    if (!/^[a-zA-Z]\w{5,17}$/.test(password)) return done({status: 400, message: '密码格式不正确', code: 102});

    var TelVerifyCode = loopback.getModel('TelVerifyCode');
    async.auto({
      findByUserName: function (cb) {
        AkUser.findOne({where: {username: username}}, cb);
      },
      findByTel: function (cb) {
        AkUser.findOne({where: {tel: tel}}, cb);
      },
      findTelVerifyCode: function (cb) {
        TelVerifyCode.findById(tel, cb);
      },
      verify: ['findByUserName', 'findByTel', 'findTelVerifyCode', function (cb, results) {
        if (results.findByUserName) return cb({status: 400, message: '用户名已存在', code: 103});
        if (results.findByTel) return cb({status: 400, message: '手机已存在', code: 104});

        var verifyCode = results.findTelVerifyCode;
        if (verifyCode && verifyCode.code === code) {
          var now = new Date();

          if (now - verifyCode.created > verifyCode.exp * 1000) {
            // 时间过期
            cb({status: 400, message: '验证码已过期，请重新获取', code: 108});
          } else {
            AkUser.create({
              username: username,
              tel: tel,
              password: bcrypt.hashSync(password)
            }, cb);
          }
        } else {
          cb({status: 400, message: '验证码不正确', code: 107});
        }
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
      {arg: 'password', type: 'string', required: true},
      {arg: 'code', type: 'string', required: true}
    ],
    description: '注册',
    returns: {
      arg: 'user',
      type: 'object'
    }
  });

  AkUser.generateVerifyCode = function (tel, done) {
    if (!/^1[3|4|5|7|8]\d{9}$/.test(tel)) return done({status: 400, message: '手机号格式不正确', code: 100});

    var TelVerifyCode = loopback.getModel('TelVerifyCode');
    async.auto({
      findUserByTel: function (cb) {
        AkUser.findOne({
          where: {tel: tel}
        }, cb);
      },
      findTelVerifyCode: function (cb) {
        TelVerifyCode.findById(tel, cb);
      },
      checkTelVerifyCode: ['findUserByTel', 'findTelVerifyCode', function (cb, results) {
        var user = results.findUserByTel;
        if (user) return cb({status: 400, message: '手机号已注册', code: 101});

        var telVerifyCode = results.findTelVerifyCode;
        if (telVerifyCode) {
          // 如果缓存中有则直接返回
          var now = new Date();
          if (now - telVerifyCode.created < telVerifyCode.exp * 1000) {
            // 未过期，使用上一个验证码
            cb(null, telVerifyCode);
          } else {
            // 过期，更新验证码
            telVerifyCode.updateAttributes({
              code: Util.generateRandomNumberCode(6),
              created: new Date()
            }, cb);
          }
        } else {
          // 生成新的验证码
          TelVerifyCode.create({
            id: tel,
            code: Util.generateRandomNumberCode(6)
          }, cb);
        }
      }]
    }, function (err, results) {
      if (err) return done(err.code ? err : {status: 500, message: '服务器内部错误', code: 102});

      var verifyCode = results.checkTelVerifyCode;
      // 发送短消息（暂时注释掉）
      //alidayu.sendVerifyCode(tel, verifyCode.code, function (err) {
      //  if (err) return done({status: 500, message: '获取验证码失败，请稍后重试', code: 103});
      //  done(null, new Date().getTime());
      //});

      // 穷，只能打log了
      console.log('短信验证码：', verifyCode.code);
      done(null, new Date().getTime());
    });
  };
  AkUser.remoteMethod('generateVerifyCode', {
    http: {path: '/verify-code/g', verb: 'post'},
    accepts: [
      {arg: 'tel', type: 'string', required: true},
    ],
    description: '生成手机验证码',
    returns: {
      arg: 'ts',
      type: 'number'
    }
  });

  AkUser.matchVerifyCode = function (tel, code, done) {
    if (!/^1[3|4|5|7|8]\d{9}$/.test(tel)) return done({status: 400, message: '手机号格式不正确', code: 100});
    if (!/^\d{6}$/.test(code)) return done({status: 400, message: '验证码格式不正确', code: 101});

    var TelVerifyCode = loopback.getModel('TelVerifyCode');
    async.auto({
      findUserByTel: function (cb) {
        AkUser.findOne({
          where: {tel: tel}
        }, cb);
      },
      findTelVerifyCode: function (cb) {
        TelVerifyCode.findById(tel, cb);
      },
      checkTelVerifyCode: ['findUserByTel', 'findTelVerifyCode', function (cb, results) {
        var user = results.findUserByTel;
        if (user) return cb({status: 400, message: '手机号已被使用', code: 101});

        var telVerifyCode = results.findTelVerifyCode;
        if (!telVerifyCode) return cb({status: 400, message: '手机号不正确', code: 102});
        if (telVerifyCode.code !== code) return cb({status: 400, message: '验证码不正确', code: 103});

        var now = new Date();
        if (now - telVerifyCode.created >= telVerifyCode.exp * 1000) return cb({
          status: 400,
          message: '验证码已过期，请重新获取',
          code: 104
        });

        cb(null, telVerifyCode);
      }]
    }, function (err, results) {
      if (err) return done(err.code ? err : {status: 500, message: '服务器内部错误', code: 105});

      done(null, new Date().getTime());
    });
  };
  AkUser.remoteMethod('matchVerifyCode', {
    http: {path: '/verify-code/m', verb: 'post'},
    accepts: [
      {arg: 'tel', type: 'string', required: true},
      {arg: 'code', type: 'string', required: true},
    ],
    description: '检验验证码是否匹配',
    returns: {
      arg: 'ts',
      type: 'number'
    }
  });

  AkUser.qiniuUptoken = function (key, done) {
    done(null, thirdParties.qiniu.upToken(key));
  };
  AkUser.remoteMethod('qiniuUptoken', {
    http: {path: '/qiniu/uptoken', verb: 'post'},
    accepts: [{
      arg: 'key',
      type: 'string',
      required: true
    }],
    description: '获取七牛上传token',
    returns: {
      arg: 'token',
      type: 'string'
    }
  });
};
