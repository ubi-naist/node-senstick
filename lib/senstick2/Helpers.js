/**
 * @fileOverview あると便利そうな機能を記述するファイルです．
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
 * @param {number}      config.accelerometer.mode       - センサーの動作モード
 * @param {callback}    callback                        - コールバック関数
 */
SenStick2Helpers.prototype.setUpSensors = function(config, callback)
{
    const self = this;
    async.parallel({
        // 加速度センサ
        accelerometer: function(callback_)
        {
            const acc = config['accelerometer'];
            if(acc === null || acc === undefined)
            {
                callback_(null, null);
                return;
            }

            self.writeAccelerometerMeasurementConfig(acc.mode);
        },
        // ジャイロスコープ
        gyroscope: function(callback_)
        {
            
        },
        // 温湿度
        humidity: function(callback_)
        {
            
        },
        // 照度
        illuminance: function(callback_)
        {

        },
        // 磁気
        magnetic: function(callback_)
        {

        },
        // 圧力
        pressure: function(callback_)
        {

        }
    },
    function(err, result)
    {
        if(err)
        {
            callback(err);
            return;
        }
        callback(null, results);
    });
    callback();
};

/**
 * SenStickのデバイスの情報を取得した後に呼び出される．
 * @callback readDeviceInformationCallback
 * @param {?string}             error                   - エラー内容．エラーが無ければnull．
 * @param {Object|undefined}    info                    - デバイス情報．
 * @param {string|undefined}    info.device_name        - デバイス名．
 * @param {string|undefined}    info.serial_number      - シリアルナンバー．
 * @param {string|undefined}    info.manufacture        - 製造者名．
 * @param {string|undefined}    info.hardware_version   - ハードウェアのバージョン．
 * @param {string|undefined}    info.firmware_version   - ファームウェアのバージョン，
 * @param {number|undefined}    info.battery_level      - バッテリーレベル(0%〜100%)．
 */

module.exports = SenStick2Helpers;
