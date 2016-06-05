import Config from './config';

let QiniuUtil = {
  putb64(uptoken, base64, success, error) {
    const picdata = base64.split("base64,")[1];
    //var key = Math.random().toString(36).substring(7) + "_" + new Date().getTime();
    const url = "http://upload.qiniu.com/putb64/-1";
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange=function(){
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          try {
            var blkRet = JSON.parse(xhr.responseText);
            success && success(blkRet);
          } catch (e) {
            error && error('图片上传失败，请稍后再试！');
          }
        } else {
          error && error('图片上传失败，请稍后再试！');
        }
      }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.setRequestHeader("Authorization", "UpToken " + 'dTCDULTZM5MlAgj9vhDp7UCcAXLWDAAR8jKqxbu2:y60_6tDeSfxed2Efeawco1uXDV8=:eyJzY29wZSI6ImF1a3Rpb25hdG9yIiwiZGVhZGxpbmUiOjE0NjUxNTY1ODB9');
    xhr.send(picdata);
  }
}

export default QiniuUtil;
