var loopback = require('loopback');
var async = require('async');

var Util = require('../utils/util');
var thirdParties = require('../3th-party');
var qiniu = thirdParties.qiniu;

module.exports = function (server) {
  var router = server.loopback.Router();

  router.get('/home', function (req, res) {
    var AKGame = loopback.getModel('AKGame');
    var AKEntrance = loopback.getModel('AKEntrance');

    var gameInclude = {
      relation: 'auktionator',
      scope: {
        fields: ['id', 'username', 'nickname', 'avatar', 'score'],
      }
    };
    async.auto({
      carousels: function (cb) {
        AKEntrance.find({
          where: {
            type: 'carousel', // 轮播图
            enabled: true,
          },
          limit: 5,
          order: 'created DESC'
        }, cb);
      },
      icons: function (cb) {
        AKEntrance.find({
          where: {
            type: 'icon', // 图标
            enabled: true,
          },
          limit: 4,
          order: 'created ASC'
        }, cb);
      },
      recommendGames: function (cb) {
        AKGame.find({
          where: {status: 2},
          limit: 1, // 目前只推荐1条
          order: ['onlineNum DESC'], // 根据在线人数推荐
          include: gameInclude,
        }, cb);
      },
      livingGames: function (cb) {
        AKGame.find({
          where: {status: 2}, // 进行中
          limit: 5,
          order: ['onlineNum DESC'],
          include: gameInclude,
        }, cb);
      },
      notStartedGames: function (cb) {
        AKGame.find({
          where: {status: 1}, // 未开始
          limit: 5,
          order: ['onlineNum DESC'],
          include: gameInclude,
        }, cb);
      },
    }, function (err, results) {
      if (err) return res.jsonError(err, 100);

      res.jsonSuccess({
        carousels: results.carousels,
        icons: results.icons,
        recommendGames: results.recommendGames,
        livingGames: results.livingGames,
        notStartedGames: results.notStartedGames,
      });
    });
  });

  router.get('/qiniu-uptoken/:count', function (req, res) {
    var count = req.param('count') || 1;

    var tokens = [], key;
    for (var i = 0; i < count; i++) {
      key = Util.generateRandomStr() + '_' + new Date().getTime();
      tokens.push({
        key: key,
        token: qiniu.upToken(key),
      });
    }
    res.jsonSuccess({tokens: tokens});
  });

  server.use('/api/v1', function (req, res, next) {
    res.jsonError = function (errMsg, errCode) {
      return res.json({API_RESULT: 'error', ERR_MSG: errMsg, ERR_CODE: errCode});
    };

    res.jsonSuccess = function (data) {
      data = data || {};
      data['API_RESULT'] = 'success';
      return res.json(data);
    };

    next();
  }, router);
};
