/* define Parameters **************************************************************/
// BLEデバイス名接頭句 88
const DEVICE_NAME_PREFIX = 'BBC micro:bit'
// micro:bit BLE IO Pin UUID
const IOPINSERVICE_SERVICE_UUID = 'e95d127b-251d-470a-a062-fa1922dfa9a8'
const PINDATA_CHARACTERISTIC_UUID = 'e95d8d00-251d-470a-a062-fa1922dfa9a8'
const PINADCONFIGURATION_CHARACTERISTIC_UUID = 'e95d5899-251d-470a-a062-fa1922dfa9a8'
const PINIOCONFIGURATION_CHARACTERISTIC_UUID = 'e95db9fe-251d-470a-a062-fa1922dfa9a8'

// Messages
const MSG_CONNECTED = 'Connected!!'
const MSG_CONNECT_ERROR = 'Failed to Conect'
const MSG_DISCONNECTED = 'Disconnected'
/*********************************************************************************/

var ioPinDataCharacteristic = null;
var connectDevice = null;

// disconnect process
function disconnect () {
	if (!connectDevice)
		return
	connectDevice.gatt.disconnect()
	connectDevice = null;
	chosenIoPinService = null;
	alert(MSG_DISCONNECTED)
}

function connect(callback) {
	navigator.bluetooth.requestDevice({
		filters: [{
			namePrefix: DEVICE_NAME_PREFIX
		}]
	})
	.then(device => {
		connectDevice = device
		device.gatt.connect()
		.then(server => {
			server.getPrimaryService(IOPINSERVICE_SERVICE_UUID)
			.then(service => {
				//chosenService = service;
				service.getCharacteristic(PINADCONFIGURATION_CHARACTERISTIC_UUID)
				.then(setPinAdConfiguration)
				.catch(error => {
					console.log(error)
					alert(error)
				})
				service.getCharacteristic(PINIOCONFIGURATION_CHARACTERISTIC_UUID)
				.then(setPinIoConfiguration)
				.catch(error => {
					console.log(error)
					alert(error)
				})
				service.getCharacteristic(PINDATA_CHARACTERISTIC_UUID)
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

function setPinAdConfiguration(characteristic) {
	characteristic.writeValue(new Uint32Array([0x00])) // Configure pin 0 Digital
	.catch(error => {
		alert(error);
	});
}
function setPinIoConfiguration(characteristic) {
	characteristic.writeValue(new Uint32Array([0x00])) //   Output
	.catch(error => {
		alert(error);
	});
}

// start service event
function startService (characteristic) {
	ioPinDataCharacteristic = characteristic;
	ioPinDataCharacteristic.writeValue(new Uint8Array([0x00, 0x00]))
	.catch(error => {
		alert(error);
	});
}

function ledOn() {
	if (ioPinDataCharacteristic == null) {
		return;
	}
	ioPinDataCharacteristic.writeValue(new Uint8Array([0x00, 0x01]))
	.catch(error => {
		alert(error);
	});
}

function ledOff() {
	if (ioPinDataCharacteristic == null) {
		return;
	}
	ioPinDataCharacteristic.writeValue(new Uint8Array([0x00, 0x00]))
	.catch(error => {
		alert(error);
	});
}

