var loopback = require('loopback');
var async = require('async');
var request = require('request');
var md5 = require('MD5');
var _ = require('underscore');

var Util = require('../../utils/util');

// 微信接口常量
var WX_URL = {
  "snsapi_base": {
    "access_token": "https://api.weixin.qq.com/sns/oauth2/access_token",
    "refresh_token": "https://api.weixin.qq.com/sns/oauth2/refresh_token",
    "auth": "https://api.weixin.qq.com/sns/auth"
  },
  "snsapi_userinfo": {
    "userinfo": "https://api.weixin.qq.com/sns/userinfo"
  },
  "payment": {
    "unifiedorder": "https://api.mch.weixin.qq.com/pay/unifiedorder",
    "orderquery": "https://api.mch.weixin.qq.com/pay/orderquery",
    "closeorder": "https://api.mch.weixin.qq.com/pay/closeorder",
    "refund": "https://api.mch.weixin.qq.com/secapi/pay/refund",
    "refundquery": "https://api.mch.weixin.qq.com/pay/refundquery",
    "downloadbill": "https://api.mch.weixin.qq.com/pay/downloadbill",
    "report": "https://api.mch.weixin.qq.com/payitil/report"
  }
};

function WXOpen(opts) {
  opts = opts || {};
  if (!opts.appId || !opts.appSecret) return console.error('Invalid appId or appSecret.');
  opts = _.defaults(opts, {});

  this.appId = opts.appId;
  this.appSecret = opts.appSecret;
}

WXOpen.sign = function (param, key) {
  var querystring = Object.keys(param).filter(function (key) {
      return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key) < 0;
    }).sort().map(function (key) {
      return key + '=' + param[key];
    }).join("&") + "&key=" + key;
  return md5(querystring).toUpperCase();
};

/*
 * 用户首次授权获取用户信息
 */
WXOpen.prototype.auth = function (code, cb) {
  var appId = this.appId;
  var appSecret = this.appSecret;

  async.auto({
    getAccessToken: function (cb) {
      request.get({
        url: WX_URL.snsapi_base.access_token,
        qs: {
          appid: appId,
          secret: appSecret,
          code: code,
          grant_type: 'authorization_code'
        },
        json: true
      }, function (err, res, body) {
        if (err) return cb(err);
        if (body.errcode) return cb(body);
        cb(null, body);
      });
    },
    verifyAccessToken: ['getAccessToken', function (cb, results) {
      var accessToken = results.getAccessToken;

      request.get({
        url: WX_URL.snsapi_base.auth,
        qs: {
          access_token: accessToken.access_token,
          openid: accessToken.openid
        },
        json: true
      }, function (err, res, body) {
        if (err) return cb(err);
        cb(null, body);
      });
    }],
    verifyRefreshToken: ['getAccessToken', 'verifyAccessToken', function (cb, results) {
      var verifyAccessToken = results.verifyAccessToken;
      var accessToken = results.getAccessToken;

      if (verifyAccessToken.errcode) {
        request.get({
          url: WX_URL.snsapi_base.refresh_token,
          qs: {
            appid: appId,
            grant_type: 'refresh_token',
            refresh_token: accessToken.refresh_token
          },
          json: true
        }, function (err, res, body) {
          if (err) return cb(err);
          if (body.errcode) return cb(body);
          cb(null, body);
        });
      } else {
        cb(null, accessToken);
      }
    }],
    getUserInfo: ['verifyRefreshToken', function (cb, results) {
      var accessToken = results.verifyRefreshToken;

      request.get({
        url: WX_URL.snsapi_userinfo.userinfo,
        qs: {
          access_token: accessToken.access_token,
          openid: accessToken.openid,
          lang: 'zh_CN' // 语言为中文简体
        },
        json: true
      }, function (err, res, body) {
        if (err) return cb(err);
        if (body.errcode) return cb(body);
        cb(null, body);
      });
    }]
  }, function (err, results) {
    if (err) return cb(err);

    cb(null, {
      userInfo: results.getUserInfo,
      accessToken: results.verifyRefreshToken
    });
  });
}

/*
 * 为了定时刷新access_token时的调用，30天
 */
WXOpen.prototype.refreshToken = function (refreshToken, cb) {
  var appId = this.appId;
  var appSecret = this.appSecret;

  request.get({
    url: WX_URL.snsapi_base.refresh_token,
    qs: {
      appid: appId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    json: true
  }, function (err, res, body) {
    if (err) return cb(err);
    if (body.errcode) return cb(body);
    cb(null, body);
  });
}

/*
 * 当用户已经授权过，只需要使用accessToken来获取用户信息
 * accessToken
 *  - access_token
 *  - openid
 *  - refresh_token
 */
WXOpen.prototype.getUserInfo = function (accessToken, cb) {
  var appId = this.appId;
  var appSecret = this.appSecret;

  async.auto({
    verifyAccessToken: function (cb) {
      request.get({
        url: WX_URL.snsapi_base.auth,
        qs: {
          access_token: accessToken.access_token,
          openid: accessToken.openid
        },
        json: true
      }, function (err, res, body) {
        if (err) return cb(err);
        cb(null, body);
      });
    },
    verifyRefreshToken: ['verifyAccessToken', function (cb, results) {
      var verifyAccessToken = results.verifyAccessToken;

      if (verifyAccessToken.errcode) {
        request.get({
          url: WX_URL.snsapi_base.refresh_token,
          qs: {
            appid: appId,
            grant_type: 'refresh_token',
            refresh_token: accessToken.refresh_token
          },
          json: true
        }, function (err, res, body) {
          if (err) return cb(err);
          if (body.errcode) return cb(body);
          cb(null, body);
        });
      } else {
        cb(null, accessToken);
      }
    }],
    getUserInfo: ['verifyRefreshToken', function (cb, results) {
      var accessToken = results.verifyRefreshToken;

      request.get({
        url: WX_URL.snsapi_userinfo.userinfo,
        qs: {
          access_token: accessToken.access_token,
          openid: accessToken.openid,
          lang: 'zh_CN' // 语言为中文简体
        },
        json: true
      }, function (err, res, body) {
        if (err) return cb(err);
        if (body.errcode) return cb(body);
        cb(null, body);
      });
    }]
  }, function (err, results) {
    if (err) return cb(err);

    cb(null, {
      userInfo: results.getUserInfo,
      accessToken: results.verifyRefreshToken,
    });
  });
}

WXOpen.prototype.unifiedorder = function (data, cb) {
  data = data || {};

  var params = {
    appid: this.appId, // 应用ID
    attach: data.attach, // 附加数据
    body: data.body, // 商品描述
    detail: data.detail, // 商品详情
    mch_id: data.mch_id, // 商户号
    nonce_str: Util.generateRandomStr(), // 随机字符串
    notify_url: data.notify_url, // 通知地址
    out_trade_no: data.out_trade_no, // 商户订单号
    spbill_create_ip: data.spbill_create_ip, // 终端IP
    total_fee: data.total_fee, // 总金额
    trade_type: data.trade_type || 'APP', // 交易类型
  };

  params.sign = WXOpen.sign(params, data.key); // 签名
  request({
    url: WX_URL.payment.unifiedorder,
    method: 'POST',
    body: Util.buildXML(params),
    agentOptions: {
      pfx: data.pfx,
      passphrase: data.mch_id
    }
  }, function (err, response, body) {
    if (err) return cb({err: err, errcode: 500});

    Util.parseXML(body, function (err, body) {
      if (err) return cb({err: err, errcode: 500});
      if (body && body.return_code === 'SUCCESS' && body.result_code === 'SUCCESS') {
        var results = {
          appid: this.appId,
          noncestr: Util.generateRandomStr(),
          package: 'Sign=WXPay',
          partnerid: data.mch_id,
          prepayid: body.prepay_id,
          timestamp: new Date().getTime()
        };
        results.sign = WXOpen.sign(results, data.key);
        results.out_trade_no = data.out_trade_no;
        cb(null, results);
      } else {
        cb({err: 'unifiedorder err', errcode: body.err_code || 500});
      }
    });
  });
}

WXOpen.prototype.orderquery = function (data, cb) {
  data = data || {};

  var params = {
    appid: this.appId, // 应用ID
    mch_id: data.mch_id, // 商户号
    nonce_str: Util.generateRandomStr(), // 随机字符串
    out_trade_no: data.out_trade_no,
    transaction_id: data.transaction_id,
  };
  params.sign = WXOpen.sign(params, data.key);

  request({
    url: WX_URL.payment.orderquery,
    method: 'POST',
    body: Util.buildXML(params),
  }, function (err, response, body) {
    if (err) return cb({err: err, errcode: 500});

    Util.parseXML(body, function (err, body) {
      if (err) return cb({err: err, errcode: 500});
      if (body && body.return_code === 'SUCCESS' && body.result_code === 'SUCCESS') {
        cb(null, body);
      } else {
        cb({err: 'orderquery err', errcode: body.err_code || 500});
      }
    });
  });
}

WXOpen.prototype.closeorder = function (data, cb) {
  data = data || {};

  var params = {
    appid: this.appId, // 应用ID
    mch_id: data.mch_id, // 商户号
    nonce_str: Util.generateRandomStr(), // 随机字符串
    out_trade_no: data.out_trade_no
  };
  params.sign = WXOpen.sign(params, data.key);

  request({
    url: WX_URL.payment.closeorder,
    method: 'POST',
    body: Util.buildXML(params),
  }, function (err, response, body) {
    if (err) return cb({err: err, errcode: 500});

    Util.parseXML(body, function (err, body) {
      if (err) return cb({err: err, errcode: 500});
      if (body && body.return_code === 'SUCCESS') {
        cb(null, body);
      } else {
        cb({err: 'closeorder err', errcode: body.err_code || 500});
      }
    });
  });
}

WXOpen.prototype.refund = function (data, cb) {
  data = data || {};

  var params = {
    appid: this.appId, // 应用ID
    mch_id: data.mch_id, // 商户号
    nonce_str: Util.generateRandomStr(), // 随机字符串
    op_user_id: data.op_user_id,
    out_refund_no: data.out_refund_no,
    refund_fee: data.refund_fee,
    total_fee: data.total_fee,
    transaction_id: data.transaction_id
  };
  params.sign = WXOpen.sign(params, data.key);

  request({
    url: WX_URL.payment.refund,
    method: 'POST',
    body: Util.buildXML(params),
    agentOptions: {
      pfx: data.pfx,
      passphrase: data.mch_id
    },
  }, function (err, response, body) {
    if (err) return cb({err: err, errcode: 500});

    Util.parseXML(body, function (err, body) {
      if (err) return cb({err: err, errcode: 500});
      if (body && body.return_code === 'SUCCESS' && body.result_code === 'SUCCESS') {
        cb(null, body);
      } else {
        cb({err: 'refund err', errcode: body.err_code || 500});
      }
    });
  });
}

module.exports = function (opts) {
  return new WXOpen(opts);
};
