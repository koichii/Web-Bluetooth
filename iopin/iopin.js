/* define Parameters **************************************************************/
// BLEデバイス名接頭句 78
const DEVICE_NAME_PREFIX = 'BBC micro:bit'
// micro:bit BLE IO Pin UUID
const IOPINSERVICE_SERVICE_UUID = 'e95d127b-251d-470a-a062-fa1922dfa9a8'
const PINDATA_CHARACTERISTIC_UUID = 'e95d8d00-251d-470a-a062-fa1922dfa9a8'
const PINADCONFIGURATION_CHARACTERISTIC_UUID = 'e95d5899-251d-470a-a062-fa1922dfa9a8'
const PINIOCONFIGURATION_CHARACTERISTIC_UUID = 'e95db9fe-251d-470a-a062-fa1922dfa9a8'

// Messages
const MSG_CONNECTED = 'BLE接続が完了しました。'
const MSG_CONNECT_ERROR = 'BLE接続に失敗しました。もう一度試してみてください'
const MSG_DISCONNECTED = 'BLE接続を切断しました。'
/*********************************************************************************/

var chosenIoPinService = null;
var connectDevice = null;

// disconnect process
function disconnect () {
  document.js.x.value = 'disconnect'
	if (!connectDevice || !connectDevice.gatt.connected)
	  return
  connectDevice.gatt.disconnect()
  alert(MSG_DISCONNECTED)
}

function StartService(callback) {
  document.js.x.value = 'start'
	navigator.bluetooth.requestDevice({
	    filters: [{
	      namePrefix: DEVICE_NAME_PREFIX
	    }]
	})
	.then(device => {
	  document.js.x.value = 'device'
	  connectDevice = device
	  return device.gatt.connect()
	})
	.then(server => {
	  document.js.x.value = 'server'
	  server.getPrimaryService(IOPINSERVICE_SERVICE_UUID)
	.then(service => {
	  document.js.x.value = 'service'
	  chosenIoPinService = service;
	  callback(service);
	  return Promise.all([
	    service.getCharacteristic(PINDATA_CHARACTERISTIC_UUID)
	      .then(handlePinDataCharacteristic1),
	  ]);
	});
     })
}

function handlePinDataCharacteristic1(characteristic) {
  if (characteristic === null) {
   document.js.y.value = 'Unknown'
   console.log("Unknown location.");
    return Promise.resolve();
  }
  document.js.x.value = 'OK1'
  return Promise.resolve();
}
function handlePinDataCharacteristic2(characteristic) {
  if (characteristic === null) {
   document.js.y.value = 'Unknown'
   console.log("Unknown location.");
    return Promise.resolve();
  }
  document.js.y.value = 'OK2'
  return Promise.resolve();
}
function handlePinDataCharacteristic3(characteristic) {
  if (characteristic === null) {
   document.js.y.value = 'Unknown'
   console.log("Unknown location.");
    return Promise.resolve();
  }
  document.js.y.value = 'OK3'
  return Promise.resolve();
}

function setPinAdConfiguration(ad_flags) {
  if (!chosenIoPinService) {
    document.js.y.value = 'ad_flags NG'
    return Promise.reject(new Error('No service selected yet.'));
  }
  return chosenIoPinService.getCharacteristic(PINADCONFIGURATION_CHARACTERISTIC_UUID)
  .then(characteristic => {
    document.js.y.value = 'ad_flags'
    return characteristic.writeValue(ad_flags);
  });
}
function setPinIoConfiguration(io_flags_out) {
  if (!chosenIoPinService) {
    document.js.y.value = 'io_flags_out NG'
    return Promise.reject(new Error('No service selected yet.'));
  }
  return chosenIoPinService.getCharacteristic(PINIOCONFIGURATION_CHARACTERISTIC_UUID)
  .then(characteristic => {
    document.js.y.value = 'io_flags_out'
    return characteristic.writeValue(io_flags_out);
  });
}

function setPinData(pindata) {
  if (!chosenIoPinService) {
    return Promise.reject(new Error('No service selected yet.'));
  }
  return chosenIoPinService.getCharacteristic(PINDATA_CHARACTERISTIC_UUID)
  .then(characteristic => {
    document.js.z.value = pindata
    return characteristic.writeValue(pindata);
  });
}

function connect() {
	StartService(function () {
		document.js.y.value = 'OKOK'
		// Configure pin 0
		//   Digital
	    let ad_flags = new Uint32Array([0x00]);
		setPinAdConfiguration(ad_flags).then(()=>{
			//   Output
		    let io_flags_out = new Uint32Array([0x00]);
			setPinIoConfiguration(io_flags_out)
		});
	});
}

function ledOn() {
    let switch_on_pin_0 = new Uint8Array([0x00, 0x01])
	setPinData(switch_on_pin_0)
}
function ledOff() {
    let switch_off_pin_0 = new Uint8Array([0x00, 0x00])
	setPinData(switch_off_pin_0)
}
