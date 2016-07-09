var thirdParties = require('../3th-party');
var loopback = require('loopback');
var _ = require('underscore');
var async = require('async');

module.exports = function(AkProduct) {
  // 监听拍品发布的动作
  AkProduct.observe('after save', function (ctx, next) {
    if (ctx.instance) {
      // 拍品创建
      var product = ctx.instance;

      switch (product.status) {
        case 0: // 创建
          thirdParties.JPush.notificationAuktionatorCheckProduct(product);
          break;
        case 14: // 卖家已取消
          thirdParties.JPush.notificationAuktionatorProductCanceled(product);
          break;
        case 1: // 拍卖师审核通过
          thirdParties.JPush.notificationSellerProductPassed(product);
          break;
        case 10: // 拍卖师审核不通过
          thirdParties.JPush.notificationSellerProductRejected(product);
          break;
        case 4: // 拍品正在热拍中
          // 通知拍品商家
          thirdParties.JPush.notificationSellerProductBeginning(product);
          break;
      }
    } else {
      console.log(ctx.Model.pluralModelName, ctx.where);
    }
    next();
  });


  AkProduct.addIntoGame = function (id, gid, done) {
    var AKGame = loopback.getModel('AKGame');

    async.auto({
      loadProduct: function (cb) { AkProduct.findById(id, cb); },
      loadGame: function (cb) { AKGame.findById(gid, cb); },
      updateInfo: ['loadProduct', 'loadGame', function (cb, results) {
        var product = results.loadProduct;
        var game = results.loadGame;
        var sections = game._sections || [];

        if (!product || !game) return cb('非法参数');
        if (!!_.find(sections, function (section) { return section.id == product.id.toString() })) return cb('拍品已加入拍场中');

        product.updateAttributes({
          status: 2,
          gameId: game.id,
        });

        sections.push({
          id: product.id,
          thumb: product.thumb,
        });
        game.updateAttributes({
          _sections: sections,
        });

        cb(null, [product, game]);
      }],
    }, function (err, results) {
      if (err) return done({status: 500, message: err, code: 100});
      done(null, new Date().getTime());
    });
  };
  AkProduct.remoteMethod('addIntoGame', {
    http: {path: '/:id/game/:gid/add', verb: 'put'},
    accepts: [{
      arg: 'id',
      type: 'string',
      required: true,
    }, {
      arg: 'gid',
      type: 'string',
      required: true
    }],
    description: '把产品加入拍场内',
    returns: {
      arg: 'ts',
      type: 'number'
    },
  });

  AkProduct.switchGame = function (id, gid, done) {
    var AKGame = loopback.getModel('AKGame');

    async.auto({
      loadProduct: function (cb) { AkProduct.findById(id, cb); },
      loadOldGame: ['loadProduct', function (cb, results) {
        var product = results.loadProduct;

        if (!product) return cb('非法参数');
        if (product.gameId) {
          AKGame.findById(product.gameId, cb);
        } else {
          cb(null);
        }
      }],
      loadGame: function (cb) { AKGame.findById(gid, cb); },
      updateInfo: ['loadProduct', 'loadOldGame', 'loadGame', function (cb, results) {
        var product = results.loadProduct;
        var oldGame = results.loadOldGame;

        var game = results.loadGame;
        var sections = game._sections || [];

        if (!product || !game) return cb('非法参数');
        if (!!_.find(sections, function (section) { return section.id == product.id.toString() })) return cb('拍品已加入拍场中');

        product.updateAttributes({
          status: 2,
          gameId: game.id,
        });

        sections.push({
          id: product.id,
          thumb: product.thumb,
        });
        game.updateAttributes({
          _sections: sections,
        });


        if (oldGame && oldGame.id != game.id) {
          var oldSections = oldGame._sections || [];
          var existed = _.find(oldSections, function (section) { return section.id == product.id.toString() });

          if (existed) {
            oldSections.splice(_.indexOf(oldSections, existed), 1);
            oldGame.updateAttributes({
              _sections: oldSections,
            });
          }
        }
        cb(null, [product, oldGame, game]);
      }],
    }, function (err, results) {
      if (err) return done({status: 500, message: err, code: 100});
      done(null, new Date().getTime());
    });
  };
  AkProduct.remoteMethod('switchGame', {
    http: {path: '/:id/game/:gid/switch', verb: 'put'},
    accepts: [{
      arg: 'id',
      type: 'string',
      required: true,
    }, {
      arg: 'gid',
      type: 'string',
      required: true
    }],
    description: '把产品加入另外一个拍场内',
    returns:  {
      arg: 'ts',
      type: 'number'
    },
  });
};
