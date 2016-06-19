var JPush = require('jpush-sdk');
var client = JPush.buildClient('a94e0480938648913f966492', 'abbae1a6ce038a748fbac69b');

client.push().setPlatform(JPush.ALL)
  .setAudience(JPush.ALL)
  .setNotification('Hi, JPush', JPush.ios('ios alert', 'happy', 5))
  .send(function(err, res) {
    if (err) {
      console.log(err.message);
    } else {
      console.log('Sendno: ' + res.sendno);
      console.log('Msg_id: ' + res.msg_id);
    }
  });
