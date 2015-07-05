var request = require('request');

module.exports = function(hackerDS) {
  var self = this;

  self.init = function() {
    console.log('init heater control');
  }

  var intervalHandle = null;
  function resetInterval(){
    if(intervalHandle){
      clearInterval(intervalHandle);
    }

    intervalHandle = setInterval(function(){
      updateTemp();
    }, 1000 * 30);
  }

  function updateTemp() {
    var actTemp, targetTemp;

    request('http://hutschienenpi:8080/CanBus/theemin/GetActTemp', function(err, res, body){
      if(err) {
        console.log(err);
        hackerDS.controller.send('serverError');
        return;
      }

      if(res.statusCode != 200) {
        console.log(body);
        hackerDS.controller.send('serverError');
        return;
      }

      actTemp = body;
      request('http://hutschienenpi:8080/CanBus/theemin/GetTargetTemp', function(err, res, body){
        if(err) {
          console.log(err);
          hackerDS.controller.send('serverError');
          return;
        }

        if(res.statusCode != 200) {
          console.log(body);
          hackerDS.controller.send('serverError');
          return;
        }

        targetTemp = body;

        var state = {
          actTemp: actTemp,
          targetTemp: targetTemp
        }
        hackerDS.controller.send('updateTemp', JSON.stringify(state));
      })
    })
  }

  hackerDS.on('setTargetTemp', function(newTemp){
    resetInterval();
    request.get('http://hutschienenpi:8080/CanBus/theemin/SetTargetTemp?temp='+newTemp, function(err){
      if(err) console.log(err);
    });
  })

  hackerDS.on('sendUpdateTemp', function(){
    updateTemp();
  })

  resetInterval();
}
