# microbit-web-bluetooth


## microbit を BLE で Web-bluetooth につなぐ

Android の Chrome ブラウザで動作テスト

### [加速度センサー](./accelerometer)
[加速度センサー ソース](./accelerometer/accelerometer.js)

### [LED](./microbit)
[LED ソース](./microbit/microbit.js)

### [IO ピン](./iopin)
[IO ピン ソース](./iopin/iopin.js)

### マイクロビットのプログラムソース
```microbit.js
bluetooth.onBluetoothConnected(() => {
    basic.showIcon(IconNames.Diamond)
})
bluetooth.onBluetoothDisconnected(() => {
    basic.showIcon(IconNames.No)
})
input.onButtonPressed(Button.A, () => {
    pins.digitalWritePin(DigitalPin.P0, 1)
})
input.onButtonPressed(Button.B, () => {
    pins.digitalWritePin(DigitalPin.P0, 0)
})
bluetooth.startAccelerometerService()
bluetooth.startButtonService()
bluetooth.startIOPinService()
bluetooth.startLEDService()
bluetooth.startTemperatureService()
basic.showIcon(IconNames.Heart)
```

### 参考資料
https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html
