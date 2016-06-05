const Config = {
  env: 'dev', // 当前环境
  get isDev() { // 是否为开发环境
    return Config.env === 'dev';
  },
  get isStaging() { // 是否为测试环境
    return Config.env === 'staging';
  },
  get isProd() { // 是否为正式环境
    return Config.env === 'prod';
  },
  get host() { // 服务器地址
    return Config[Config.env + 'Host'];
  },
  devHost: 'http://192.168.0.102:3000', // 开发环境服务器地址
  stagingHost: 'http://www.baijiadu.com:3010', // 测试环境服务器地址
  prodHost: 'http://www.baijiadu.com:3020', // 正式环境服务器地址
  pageSize: 20, // 首页轮播大小
  whatsupLimit: 5, // 首页轮播大小
  whatsupOptions: { // 首页轮播图配置选项
    autoplay: 3000,
    pager: true,
  },
  productPublishImageLimit: 8,
  qiniu: {
    url: 'https://o89ix43hh.qnssl.com/',
    styles: {
      'product.thumb': 'product.thumb'
    }
  }
};

export default Config;
