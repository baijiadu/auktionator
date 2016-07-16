var loopback = require('loopback');
var async = require('async');
var _ = require('underscore');

var thirdParties = require('../3th-party');

module.exports = function (AkGame) {
  // 监听拍品发布的动作
  AkGame.observe('after save', function (ctx, next) {
    if (ctx.instance) {
      // 拍场创建
      var game = ctx.instance;
      var sections = game._sections || [];
      var AKProduct = loopback.getModel('AKProduct');

      switch (game.status) {
        case 0: // 创建、编辑中
          async.auto({
            updateRemovedProductStatus: function (cb) {
              AKProduct.find({
                where: {
                  id: {nin: _.pluck(sections, 'id')},
                  gameId: game.id,
                },
              }, function (err, products) {
                if (err) return cb(err);

                if (products && products.length > 0) {
                  async.parallel(_.map(products, function (product) {
                    return function (cb) {
                      product.updateAttributes({
                        status: 6,
                        gameId: null,
                      }, cb);
                    }
                  }), cb);
                } else {
                  cb(null, products);
                }
              });
            },
            updateProductStatus: function (cb) {
              async.parallel(_.map(sections, function (section) {
                return function (cb) {
                  AKProduct.findById(section.id, function (err, product) {
                    if (err) return cb(err);
                    if (!product) return cb('Invalid Product');

                    product.updateAttributes({
                      status: 2,
                      gameId: game.id,
                    }, cb);
                  });
                }
              }), cb);
            },
          }, function (err, results) {
            if (err) return console.error('拍场创建、为正式发布：', err);
          });
          break;
        case 1: // 确认已发布
          async.auto({
            updateRemovedProductStatus: function (cb) {
              AKProduct.find({
                where: {
                  id: {nin: _.pluck(sections, 'id')},
                  gameId: game.id,
                },
              }, function (err, products) {
                if (err) return cb(err);

                if (products && products.length > 0) {
                  async.parallel(_.map(products, function (product) {
                    return function (cb) {
                      product.updateAttributes({
                        status: 6,
                        gameId: null,
                      }, cb);
                    }
                  }), cb);
                } else {
                  cb(null, products);
                }
              });
            },
            updateProductStatus: function (cb) {
              async.parallel(_.map(sections, function (section) {
                return function (cb) {
                  AKProduct.findById(section.id, function (err, product) {
                    if (err) return cb(err);
                    if (!product) return cb('Invalid Product');

                    product.updateAttributes({
                      status: 3,
                      gameId: game.id,
                    }, cb);
                  });
                }
              }), cb);
            },
          }, function (err, results) {
            if (err) return console.error('拍场发布', err);

            var products = results.updateProductStatus;
            thirdParties.JPush.notificationGameProductOwnersOnline(game, products);
          });
          break;
        case 2: // 开拍
          // 通知拍场所属拍卖师的关注者开拍消息
          thirdParties.JPush.notificationGameAKFollowersBeginning(game);
          break;
      }
    } else {
      console.log(ctx.Model.pluralModelName, ctx.where);
    }
    next();
  });
};
