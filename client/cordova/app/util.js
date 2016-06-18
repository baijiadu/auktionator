const Util = {
  generateRandomStr: (start) => {
    start = start || 2;
    return Math.random().toString(36).substring(start);
  },
};

export default Util;
