var thirdParties = require('../3th-party');

module.exports = function(AkProduct) {
  // 监听拍品发布的动作
  AkProduct.observe('after save', function (ctx, next) {
    if (ctx.instance) {
      // 拍品创建
      var product = ctx.instance;
      thirdParties.JPush.notificationAuktionatorCheckProduct(product.auktionatorId);
    } else {
      console.log(ctx.Model.pluralModelName, ctx.where);
    }
    next();
  });
};
