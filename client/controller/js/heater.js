var state = {};

init();

function incTemp() {
  state.temps.targetTemp = parseInt(state.temps.targetTemp) + 1;

  sendTemp();
  updateUi();
}

function decTemp(){
  state.temps.targetTemp -= 1;

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

  hackerDS.on('serverError', function(err){
    var curTargetTemp = document.getElementById('curTargetTemp');
    curTargetTemp.innerHTML = 'Server Error :(';
  })
}

function sendTemp() {
  hackerDS.server.send('setTargetTemp', state.temps.targetTemp);
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
