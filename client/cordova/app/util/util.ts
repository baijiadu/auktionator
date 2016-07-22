export const Util = {
  generateRandomStr(start) {
    start = start || 2;
    return Math.random().toString(36).substring(start);
  },
  isIdNumber(idNumber) {
    if (!/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(idNumber)) return '身份证号格式不正确';

    const idNumberWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
      idNumberY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    let idNumberWiSum = 0;

    if (idNumber.length != 18) return '请输入有效的身份证号';
    for (var i = 0; i < 17; i++) {
      idNumberWiSum += idNumber.substring(i, i + 1) * idNumberWi[i];
    }

    const idNumberMod = idNumberWiSum % 11, idNumberLast = idNumber.substring(17);
    if (idNumberMod == 2) {
      if (idNumberLast.toUpperCase() != 'X') return '请输入有效的身份证号';
    } else {
      if (idNumberLast != idNumberY[idNumberMod]) return '请输入有效的身份证号';
    }
    return 'yes';
  }
};
