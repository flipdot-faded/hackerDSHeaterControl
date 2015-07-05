var request = require('request');

module.exports = function(hackerDS) {
  var self = this;

  self.init = function() {
    console.log('init heater control');
  }

  function updateTemp() {
    var actTemp, targetTemp;

    request('http://hutschienenpi:8080/CanBus/theemin/GetActTemp', function(err, res, body){
      if(err) {
        console.log(err);
        return;
      }

      if(res.statusCode != 200) {
        console.log(body);
        return;
      }

      actTemp = body;
      request('http://hutschienenpi:8080/CanBus/theemin/GetTargetTemp', function(err, res, body){
        if(err) {
          console.log(err);
          return;
        }

        if(res.statusCode != 200) {
          console.log(body);
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
    request.post('http://hutschienenpi:8080/CanBus/theemin/SetTargetTemp?temp='+newTemp, function(err){
      if(err) console.log(err);
    });
  })

  hackerDS.on('sendUpdateTemp', function(){
    updateTemp();
  })

  setInterval(function(){
    updateTemp();
  }, 2500);
}
