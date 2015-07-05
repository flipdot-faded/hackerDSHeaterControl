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
  hackerDS.server.send('sendUpdateTemp');

  hackerDS.on('updateTemp', function(updatedTemps){
    updatedTemps = JSON.parse(updatedTemps);
    state.temps = updatedTemps;
    updateUi();
  })
}

function sendTemp() {
  hackerDS.server.send('setTemp', state.temp);
}

function updateUi() {
  var curTargetTemp = document.getElementById('curTargetTemp');
  var text = '';

  text += state.temps.actTemp;
  text += ' / ';
  text += state.temps.targetTemp;
  text += '°C';

  curTargetTemp.innerText = text;
}
