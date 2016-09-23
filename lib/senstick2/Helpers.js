/**
 * @fileOverview あると便利そうな機能を記述するファイルです．
 * @author Masashi Fujiwara
 */

'use strict';

const async = require('async');

/**
 * @mixin
 */
function SenStick2Helpers() { }

/**
 * SenStickのデバイスの情報を取得する．
 * このメソッドで取得可能な情報は，Device Name, Serial Number, Manufacture, Hardware Revision, Firmware revision, Battery Level
 * です．
 * @param {readDeviceInformationCallback} callback - コールバック関数．
 */
SenStick2Helpers.prototype.readDeviceInformation = function(callback)
{
    let self = this;
    async.parallel({
        device_name: function(callback_)
        {
            self.readSenStickDeviceName(callback_);
        },
        serial_number: function(callback_)
        {
            self.readSerialNumber(callback_);
        },
        manufacture: function(callback_)
        {
            self.readManufacturerName(callback_);
        },
        hardware_version: function(callback_)
        {
            self.readHardwareRevision(callback_);
        },
        firmware_version: function(callback_)
        {
            self.readFirmwareRevision(callback_);
        },
        battery_level: function(callback_)
        {
            self.readBatteryLevel(callback_);
        }
    },
    function(err, results)
    {
        if(err)
        {
            callback(err);
            return;
        }
        callback(null, results);
    });
};

/**
 * 各種センサをセットアップする．
 * @param {object}      config                          - センサのコンフィグ
 * @param {object}      config.accelerometer            - 加速度センサ
 * @param {number}      config.accelerometer.enable     - センサーの動作モード
 * @param {callback}    callback                        - コールバック関数
 */
SenStick2Helpers.prototype.setUpSensors = function(config, callback)
{
    callback();
};

/**
 * SenStickのデバイスの情報を取得した後に呼び出される．
 * @callback readDeviceInformationCallback
 * @param {string|null}     error                   - エラー内容．エラーが無ければnull．
 * @param {Object}          info                    - デバイス情報
 * @param {string}          info.device_name        - デバイス名
 * @param {string}          info.serial_number      - シリアルナンバー
 * @param {string}          info.manufacture        - 製造者名
 * @param {string}          info.hardware_version   - ハードウェアのバージョン
 * @param {string}          info.firmware_version   - ファームウェアのバージョン
 * @param {number}          info.battery_level      - バッテリーレベル(0%〜100%)
 */

module.exports = SenStick2Helpers;
