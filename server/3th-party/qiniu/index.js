var qiniu = require("qiniu");

module.exports = function (AccessKey, SecretKey, Bucket) {
  qiniu.conf.ACCESS_KEY = AccessKey;
  qiniu.conf.SECRET_KEY = SecretKey;

  return {
    upToken: function (key) {
      var putPolicy = new qiniu.rs.PutPolicy(Bucket + ":" + key);
      return putPolicy.token();
    }
  };
}
