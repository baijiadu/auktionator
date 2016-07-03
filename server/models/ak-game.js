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
      var sections = game._sections;
      var AKProduct = loopback.getModel('AKProduct');

      switch (game.status) {
        case 0: // 创建
          async.auto({
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
            notifyProductOwners: function (cb) {
              AKProduct.find({
                fields: {
                  id: true,
                  ownerId: true,
                },
                where: {id: {inq: _.pluck(sections, 'id')}},
              }, function (err, products) {
                if (err) return cb(err);

                thirdParties.JPush.notificationGameProductOwnersOnline(game, products);
                cb(null, products);
              });
            },
          }, function (err, results) {
            if (err) return console.error('', err);
          });
          break;
      }
    } else {
      console.log(ctx.Model.pluralModelName, ctx.where);
    }
    next();
  });
};
