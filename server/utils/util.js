var crypto = require('crypto');
var dateFormat = require('dateformat');
var querystring = require('querystring');
var xml2js = require('xml2js');

var Util = {
  generateToken: function (content) {
    content += new Date().getTime();
    return Util.md5(content);
  },
  generateRandomStr: function (start) {
    start = start || 2;
    return Math.random().toString(36).substring(start);
  },
  generateRandomNumberCode: function (length) {
    length = length || 4;
    var res = '', num;
    while (--length >= 0) {
      num = parseInt(Math.random() * 10);
      res += num === 10 ? 0 : num;
    }
    return res;
  },
  md5: function (content) {
    var md5 = crypto.createHash('md5');
    md5.update(content);
    return md5.digest('hex');
  },
  generateOrderSuffix: function () {
    return dateFormat(new Date(), "yyyymmddHHMM") + Util.generateRandomStr(8).toUpperCase();
  },
  buildXML: function(json) {
    var builder = new xml2js.Builder();
    return builder.buildObject(json);
  },
  parseXML: function(xml, fn){
    var parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false });
    parser.parseString(xml, fn||function(err, result){});
  }
};

module.exports = Util;
