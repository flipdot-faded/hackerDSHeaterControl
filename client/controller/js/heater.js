var state = {};

init();

function incTemp() {
  state.temp += 1;

  sendTemp();
  updateUi();
}

function decTemp(){
  state.temp -= 1;

  sendTemp();
  updateUi();
}

function init() {
  hackerDS.server.send('getTemp');

  hackerDS.on('updateTemp', function(newTemp){
    state.temp = newTemp;
    updateUi();
  })
}

function sendTemp() {
  hackerDS.server.send('setTemp', state.temp);
}

function updateUi() {
  var curTargetTemp = document.getElementById('curTargetTemp');
  curTargetTemp.innerText = state.temp + '°C';
}
