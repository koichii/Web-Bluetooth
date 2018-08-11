var gauge = null;
(window.onload = function() {
	var opts = {
	  angle: 0.15, // The span of the gauge arc
	  lineWidth: 0.44, // The line thickness
	  radiusScale: 1, // Relative radius
	  pointer: {
	    length: 0.6, // // Relative to gauge radius
	    strokeWidth: 0.035, // The thickness
	    color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support

	};
	var target = document.getElementById('foo'); // your canvas element
	gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
	gauge.maxValue = 1024; // set max gauge value
	gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
	gauge.animationSpeed = 32; // set animation speed (32 is default value)
	gauge.set(126); // set actual value
})();

/* define Parameters **************************************************************/
// BLEデバイス名接頭句 90
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

function handleCharacteristicValueChanged(event) {
	let value = event.target.value.getUint8(1);
	console.log(value);
	document.js.x.value = value
	if (gauge) {
		gauge.set(value);
	}
}
	 
// start service event
function startService (characteristic) {
	alert("start");
	characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);

	alert("start2");
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

