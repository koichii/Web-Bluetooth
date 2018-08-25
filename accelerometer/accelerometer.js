/*********************************************************************************/

var mwb = {}
mwb.accelerometer ={
	service: {uuid: 'e95d0753-251d-470a-a062-fa1922dfa9a8'},
	data: {uuid: 'e95dca4b-251d-470a-a062-fa1922dfa9a8'},
	device: null,
	callback: null,
}
// callback(x, y, z)
mwb.accelerometer.start = function(callback) {
	var $this = this;
	$this.callback = callback
	navigator.bluetooth.requestDevice({
		filters: [{
			namePrefix: 'BBC micro:bit'
		}],
		optionalServices: [$this.service.uuid] // to avoid Security Error
	})
	.then(device => {
		$this.device = device
		return device.gatt.connect()
	})
	.then(server => {
		return server.getPrimaryService($this.service.uuid)
	})
	.then(service => {
		// 加速度センサーの値
		service.getCharacteristic($this.data.uuid)
		.then(characteristic => {
			characteristic.startNotifications()
			.then(() => {
				characteristic.addEventListener('characteristicvaluechanged', function (event) { // event handler
					var x = event.target.value.getInt16(0, true)
					var y = event.target.value.getInt16(2, true)
					var z = event.target.value.getInt16(4, true)
					$this.callback(x, y, z)
				})
			})
		})
	})
	.catch(error => {
		console.log(error)
		alert(error)
	})
}
mwb.accelerometer.stop = function() {
	if (!this.device || !this.device.gatt.connected)
		return
	this.device.gatt.disconnect()
	this.callback('', '', '')
}
