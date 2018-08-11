/* define Parameters **************************************************************/
const DEVICE_NAME_PREFIX = 'BBC micro:bit'
const ACCELEROMETERSERVICE_SERVICE_UUID = 'e95d0753-251d-470a-a062-fa1922dfa9a8'
const ACCELEROMETERDATA_CHARACTERISTIC_UUID = 'e95dca4b-251d-470a-a062-fa1922dfa9a8'
// Messages
const MSG_CONNECTED = 'Connected!'
const MSG_CONNECT_ERROR = 'Failed to Conect'
const MSG_DISCONNECTED = 'Disconnected'
/*********************************************************************************/

// connected device value
var connectDevice = null
var chosenService = null

// disconnect process
function disconnect () {
	if (!connectDevice || !connectDevice.gatt.connected)
		return
	connectDevice.gatt.disconnect()
	alert(MSG_DISCONNECTED)
	document.js.x.value = ''
	document.js.y.value = ''
	document.js.z.value = ''
}

// connect process
function connect () {
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
		server.getPrimaryService(ACCELEROMETERSERVICE_SERVICE_UUID)
		.then(service => {
			chosenService = service;
			service.getCharacteristic(ACCELEROMETERDATA_CHARACTERISTIC_UUID)
			.then(startService)
			.catch(error => {
				console.log(error)
				alert(MSG_CONNECT_ERROR)
			})
		})
	})
	.catch(error => {
		console.log(error)
		alert(MSG_CONNECT_ERROR)
	})
}

// start service event
function startService (characteristic => {
	characteristic.startNotifications()
	.then(char => {
		alert(MSG_CONNECTED)
		characteristic.addEventListener('characteristicvaluechanged', function (event) { // event handler
			var AcceleratorX = event.target.value.getUint16(0) / 1000.0
			console.log('x:' + AcceleratorX)
			document.js.x.value = AcceleratorX
			var AcceleratorY = event.target.value.getUint16(2) / 1000.0
			console.log('y:' + AcceleratorY)
			document.js.y.value = AcceleratorY
			var AcceleratorZ = event.target.value.getUint16(4) / 1000.0
			console.log('z:' + AcceleratorZ)
			document.js.z.value = AcceleratorZ
		})
		console.log('Accelerometer:', char)
	})
})
