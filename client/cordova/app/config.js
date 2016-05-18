const Config = {
  env: 'dev',
  get isDev() {
    return Config.env === 'dev';
  },
  get isStaging() {
    return Config.env === 'staging';
  },
  get isProd() {
    return Config.env === 'prod';
  },
  get host() {
    return Config[Config.env + 'Host'];
  },
  devHost: 'http://192.168.0.101:3000',
  stagingHost: 'http://www.baijiadu.com:3010',
  prodHost: 'http://www.baijiadu.com:3020',
};

export default Config;
