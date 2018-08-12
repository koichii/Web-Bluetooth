/* define Parameters **************************************************************/
// BLEデバイス名
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

function connect() {
	navigator.bluetooth.requestDevice({
		filters: [{
			namePrefix: DEVICE_NAME_PREFIX
		}]
	})
	.then(device => {
		connectDevice = device
		return device.gatt.connect()
	})
	.then(server => {
		return server.getPrimaryService(IOPINSERVICE_SERVICE_UUID)
	})
	.then(service => {
		service.getCharacteristic(PINADCONFIGURATION_CHARACTERISTIC_UUID)
			.then(setPinAdConfiguration)
		service.getCharacteristic(PINIOCONFIGURATION_CHARACTERISTIC_UUID)
			.then(setPinIoConfiguration)
		service.getCharacteristic(PINDATA_CHARACTERISTIC_UUID)
			.then(startService)
	})
	.catch(error => {
		console.log(error)
		alert(error)
	})
}

function setPinAdConfiguration(characteristic) {
	alert("set AD");
	characteristic.writeValue(new Uint32Array([0x02])) // Configure pin 0 Digital, pin 1 Analog
	.catch(error => {
		alert(error);
	});
}
function setPinIoConfiguration(characteristic) {
	alert("set IO");
	characteristic.writeValue(new Uint32Array([0x02])) //   pin 0 Output, pin 1 Input
	.catch(error => {
		alert(error);
	});
}

var microbit = {} // microbit object
microbit.valueCallback = null	// event handler for value change
microbit.handleWriteValue = null

// Register callback function
function registerCallback(callback) {
	microbit.valueCallback = callback;
}
	 
// start service event
function startService (characteristic) {
	alert("start");
	characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', () => {
		let pin = event.target.value.getUint8(0)
		let value = event.target.value.getUint8(1)
		if (microbit.valueCallback) {
			microbit.valueCallback(pin, value);
		}
	});

	alert("start2");
	microbit.handleWriteValue = characteristic;
	setPinValue(0x00, 0x01) // P0 = 1
}

function setPinValue(pin, value) {
	if (!microbit.handleWriteValue) {
		return;
	}
	microbit.handleWriteValue.writeValue(new Uint8Array([pin, value]))
	.catch(error => {
		alert(error);
	});
}
