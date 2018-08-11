/* define Parameters **************************************************************/
const DEVICE_NAME_PREFIX = 'BBC micro:bit'
// micro:bit LEDサービス
const LED_SERVICE = "e95dd91d-251d-470a-a062-fa1922dfa9a8";
// micro:bit LEDステータスキャラクタリスティック
const LED_MATRIX_STATE = "e95d7b77-251d-470a-a062-fa1922dfa9a8";
// Messages
const MSG_CONNECTED = 'Connected!!'
const MSG_CONNECT_ERROR = 'Failed to Conect'
const MSG_DISCONNECTED = 'Disconnected'
/*********************************************************************************/

// connected device value
// 接続するBluetoothデバイス
let connectDevice = null;
// LEDステータスキャラクタリスティック
let ledMatrixStateCharacteristic = null;

// disconnect process
function onClickStopButton () {
	if (!connectDevice)
		return
	connectDevice.gatt.disconnect()
	connectDevice = null;
	ledMatrixStateCharacteristic = null;
	alert(MSG_DISCONNECTED)
}

// connect process
function onClickStartButton () {
	navigator.bluetooth.requestDevice({
		filters: [{
			namePrefix: DEVICE_NAME_PREFIX
		}]
	})
	.then(device => {
		connectDevice = device
		device.gatt.connect()
		.then(server => {
			server.getPrimaryService(LED_SERVICE)
			.then(service => {
				//chosenService = service;
				service.getCharacteristic(LED_MATRIX_STATE)
				.then(startService)
				.catch(error => {
					console.log(error)
					alert(error)
				})
			})
		})
		.catch(error => {
			console.log(error)
			alert(error)
		})
	})
}

// start service event
function startService (characteristic) {
	ledMatrixStateCharacteristic = characteristic;
	ledMatrixStateCharacteristic.writeValue(new Uint8Array(5))
	.catch(error => {
		alert(error);
	});
}

function onChangeCheckBox() {
  if (ledMatrixStateCharacteristic == null) {
    return;
  }

  ledMatrixStateCharacteristic.writeValue(generateUint8Array())
    .catch(error => {
      showModal(error);
    });
}

function generateUint8Array() {
  let array = new Uint8Array(5);

  for (let row = 0; row < 5; row++) {
    let value = 0;

    for (let index = 0; index < 5; index++) {
      value *= 2;
      if (document.getElementsByName("check" + row + index)[0].checked) {
        value += 1;
      }
    }

    array[row] = value;
  }


  return array;
}
