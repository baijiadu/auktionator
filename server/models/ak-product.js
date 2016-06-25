var thirdParties = require('../3th-party');

module.exports = function(AkProduct) {
  // 监听拍品发布的动作
  AkProduct.observe('after save', function (ctx, next) {
    if (ctx.instance) {
      // 拍品创建
      var product = ctx.instance;

      switch (product.status) {
        case 0: // 创建
          thirdParties.JPush.notificationAuktionatorCheckProduct(product.auktionatorId);
          break;
        case 1: // 拍卖师审核通过
          thirdParties.JPush.notificationSellerProductPassed(product.ownerId);
          break;
        case 10: // 拍卖师审核不通过
          thirdParties.JPush.notificationSellerProductRejected(product.ownerId);
          break;
      }
    } else {
      console.log(ctx.Model.pluralModelName, ctx.where);
    }
    next();
  });
};
