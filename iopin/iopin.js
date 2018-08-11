/* define Parameters **************************************************************/
// BLEデバイス名接頭句
const DEVICE_NAME_PREFIX = 'BBC micro:bit'
// micro:bit BLE IO Pin UUID
const IOPINSERVICE_SERVICE_UUID = 'E95D127B-251D-470A-A062-FA1922DFA9A8'
const PINDATA_CHARACTERISTIC_UUID = 'E95D8D00-251D-470A-A062-FA1922DFA9A8'
const PINADCONFIGURATION_CHARACTERISTIC_UUID = 'E95D5899-251D-470A-A062-FA1922DFA9A8'
const PINIOCONFIGURATION_CHARACTERISTIC_UUID = 'E95DB9FE-251D-470A-A062-FA1922DFA9A8'

// Messages
const MSG_CONNECTED = 'BLE接続が完了しました。'
const MSG_CONNECT_ERROR = 'BLE接続に失敗しました。もう一度試してみてください'
const MSG_DISCONNECTED = 'BLE接続を切断しました。'
/*********************************************************************************/

let chosenIoPinService = null;

navigator.bluetooth.requestDevice({
  filters: [{
    services: [DEVICE_NAME_PREFIX],
  }]
}).then(device => device.gatt.connect())
.then(server => server.getPrimaryService(IOPINSERVICE_SERVICE_UUID))
.then(service => {
  chosenIoPinService = service;
  return Promise.all([
    service.getCharacteristic(PINDATA_CHARACTERISTIC_UUID)
      .then(handlePinDataCharacteristic),
    service.getCharacteristic(PINADCONFIGURATION_CHARACTERISTIC_UUID)
      .then(handlePinDataCharacteristic),
    service.getCharacteristic(PINIOCONFIGURATION_CHARACTERISTIC_UUID)
      .then(handlePinDataCharacteristic),
  ]);
});

function handlePinDataCharacteristic(characteristic) {
  if (characteristic === null) {
    console.log("Unknown location.");
    return Promise.resolve();
  }
  console.log("OK.");
  return Promise.resolve();
}

function setPinAdConfiguration(ad_flags) {
  if (!chosenIoPinService) {
    return Promise.reject(new Error('No service selected yet.'));
  }
  return chosenIoPinService.getCharacteristic(PINADCONFIGURATION_CHARACTERISTIC_UUID)
  .then(characteristic => {
    return characteristic.writeValue(ad_flags);
  });
}
function setPinIoConfiguration(io_flags_out) {
  if (!chosenIoPinService) {
    return Promise.reject(new Error('No service selected yet.'));
  }
  return chosenIoPinService.getCharacteristic(PINIOCONFIGURATION_CHARACTERISTIC_UUID)
  .then(characteristic => {
    return characteristic.writeValue(io_flags_out);
  });
}

function setPinIoConfiguration(pinio) {
  if (!chosenIoPinService) {
    return Promise.reject(new Error('No service selected yet.'));
  }
  return chosenIoPinService.getCharacteristic(PINDATA_CHARACTERISTIC_UUID)
  .then(characteristic => {
    return characteristic.writeValue(pinio);
  });
}

function connect() {
	// Configure pin 0
	//   Digital
    let ad_flags = new Uint8Array([0x00]);
	setPinAdConfiguration(ad_flags)
	//   Output
    let io_flags_out = new Uint8Array([0x00]);
	setPinIoConfiguration(io_flags_out)
}

function ledOn() {
    let switch_on_pin_0 = new Uint8Array([0x00, 0x01])
	setPinIoConfiguration(switch_on_pin_0)
}
function ledOff() {
    let switch_off_pin_0 = new Uint8Array([0x00, 0x00])
	setPinIoConfiguration(switch_off_pin_0)
}
