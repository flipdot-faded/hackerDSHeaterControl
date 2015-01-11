var request = require('request');

module.exports = function(hackerDS) {
  var self = this;

  self.init = function() {
    console.log('init heater control');
  }

  hackerDS.on('setTemp', function(newTemp){
    request.post('http://hutschienenpi:8080/Hutschiene/Heater/SetTemp?temp='+newTemp, function(err){
      if(err) console.log(err);
    });
  })

  hackerDS.on('getTemp', function(){
    request('http://hutschienenpi:8080/Hutschiene/Heater/GetTemp', function(err, res, body){
      if(err) {
        console.log(err);
        return;
      }

      if(res.statusCode != 200) {
        console.log(body);
        return;
      }

      var temp = body;
      hackerDS.controller.send('updateTemp', temp);
    })
  })
}
