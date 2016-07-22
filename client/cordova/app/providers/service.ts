export class Service {
  constructor() {

  }

  clone(obj) {
    // 简单的clone
    return JSON.parse(JSON.stringify(obj));
  }
}
