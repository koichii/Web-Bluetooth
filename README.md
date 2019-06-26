# microbit-web-bluetooth

## なにをするものか

マイクロビットとGoogle（グーグル） Chrome（クローム）ブラウザをBluetooth（ブルートゥース）でつなぎます。
ブラウザからマイクロビットをコントロールしたり、マイクロビットのセンサーの値（あたい）をブラウザに表示（ひょうじ）したりできます。

## 動作環境（どうさかんきょう）

マイクロビットとGoogle（グーグル） Chrome（クローム）がひつようです。

### Mac（マック）

OS X Yosemite 以上がひつようです。

### Android（アンドロイド）
Android 6.0 Marshmallow 以上がひつようです。

### Windows（ウィンドウズ）
Windows 8.1 以上で、Google Chrome （バージョン70以上）がひつようです。

1. バージョン70は、いま開発中（かいはつちゅう）なので、[ココからカナリアバージョン](https://www.google.com/intl/ja_ALL/chrome/canary/)をダウンロードしてインストールします。
2. Chromeのアドレスに chrome://flags/#enable-experimental-web-platform-features をいれて、Experimental Web Platform features をEnable（イネーブル）にします。

参考（さんこう）：https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md

## マイクロビットのプログラム

マイクロビットでは、以下のプログラムを動かして、ブルートゥース通信（つうしん）ができるようにします。

[https://makecode.microbit.org/_TF8D3VL82WVt](https://makecode.microbit.org/_TF8D3VL82WVt)

[https://makecode.microbit.org/_01rV92fVMLiw](https://makecode.microbit.org/_01rV92fVMLiw)

## ブラウザのプログラム
Google Chromeブラウザでは、それぞれ以下URL（ユーアールエル）をひらいてプログラムを実行（じっこう）します。

### 加速度（かそくど）センサー
[サンプルプログラム](https://koichii.github.io/microbit-web-bluetooth/accelerometer/) 
### IOピン
[サンプルプログラム](https://koichii.github.io/microbit-web-bluetooth/iopin/) 

### プログラム作成（さくせい）の参考資料（さんこうしりょう）
[https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html](https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html)

