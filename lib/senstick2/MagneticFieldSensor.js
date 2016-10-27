'use strict';

// 磁気センササービス
var SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID       = 'f000210204514000b000000000000000';
var SENSTICK2_MAGNETICFIELD_MEASUREMENT_CONFIG_CHAR   = 'f000710204514000b000000000000000';
var SENSTICK2_MAGNETICFIELD_REALTIME_DATA_CHAR        = 'f000720204514000b000000000000000';
var SENSTICK2_MAGNETICFIELD_TARGET_LOGID_CHAR         = 'f000730204514000b000000000000000';
var SENSTICK2_MAGNETICFIELD_LOGMETADATA_CHAR          = 'f000740204514000b000000000000000';
var SENSTICK2_MAGNETICFIELD_LOGDATA_CHAR              = 'f000750204514000b000000000000000';

var SenStick2SensorService = require('./SensorService');

/**
 * SenStick2MagneticFieldSensorServiceは，磁気センサのセンシング及びロギングの動作指定，リアルタイムのセンサデータ読み出し，及びログデータの
 * 読み出し機能を提供する.
 * @mixin
 */
function SenStick2MagneticFieldSensorService()
{
}

/**
 * 磁気センサの計測動作を取得する．
 * @param {readMagneticFieldMeasurementConfigCallback}  callback - コールバック関数．
**/
SenStick2MagneticFieldSensorService.prototype.readMagneticFieldMeasurementConfig = function(callback)
{
    this.readMeasurementConfig(
        SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID,
        SENSTICK2_MAGNETICFIELD_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 磁気センサの計測動作を取得した際に呼び出されるコールバック関数．
 * @callback readMagneticFieldMeasurementConfigCallback
 * @param {?string}                         error               - エラー内容．エラーが無ければnull．
 * @param {SensorOperationMode|undefined}   operation_mode      - 動作モード．
 * @param {number|undefined}                sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number|undefined}                measurement_range   - 磁気センサの測定レンジ．
 */

/**
 * 磁気センサの計測動作を設定する
 * @param {SensorOperationMode} operation_mode      - 動作モード．
 * @param {number}              sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number}              measurement_range   - 磁気センサの測定レンジ．
 * @param {callback}            callback            - コールバック関数．
**/
SenStick2MagneticFieldSensorService.prototype.writeMagneticFieldMeasurementConfig = function(operation_mode, sampling_period, measurement_range, callback)
{
    this.writeMeasurementConfig(
        SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID,
        SENSTICK2_MAGNETICFIELD_MEASUREMENT_CONFIG_CHAR,
        operation_mode,
        sampling_period,
        measurement_range,
        callback
    );
};

/**
 * 磁気センサを有効にする．
 * @param {boolean}             logging_flag        - ロギングの有効・無効を表すフラグ．
 * @param {callback}            callback            - コールバック関数．
*/
SenStick2MagneticFieldSensorService.prototype.enableMagneticFieldSensor = function(logging_flag, callback)
{
    this.enableSensor(
        SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID,
        SENSTICK2_MAGNETICFIELD_MEASUREMENT_CONFIG_CHAR,
        logging_flag,
        callback
        );
};

/**
 * 磁気センサを無効にする．
 * @param {callback}            callback            - コールバック関数．
*/
SenStick2MagneticFieldSensorService.prototype.disableMagneticFieldSensor = function(callback)
{
    this.disableSensor(
        SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID,
        SENSTICK2_MAGNETICFIELD_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 磁気センサのサンプル周期を設定する．
 * @param {number}              sampling_period     - ミリ秒単位のサンプル周期．
 * @param {callback}            callback            - コールバック関数．
 */
SenStick2MagneticFieldSensorService.prototype.writeMagneticFieldSamplingPeriod = function(sampling_period, callback)
{
    this.writeSensorSamplingPeriod(
        SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID,
        SENSTICK2_MAGNETICFIELD_MEASUREMENT_CONFIG_CHAR,
        sampling_period,
        callback
    );
};

/**
 * 磁気センサの測定レンジを設定する．
 * @param {number}      measurement_range       - 磁気センサの測定レンジ．
 * @param {callback}    callback                - コールバック関数．
 */
SenStick2MagneticFieldSensorService.prototype.writeMagneticFieldMeasurementRange = function(measurement_range, callback)
{
    this.writeSensorMeasurementRange(
        SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID,
        SENSTICK2_MAGNETICFIELD_MEASUREMENT_CONFIG_CHAR,
        measurement_range,
        callback
    );
};

/**
 * 磁気センサのnotificationの受信要求を設定する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2MagneticFieldSensorService.prototype.notifyMagneticField = function(callback)
{
    this.onMagneticFieldChangeBinded = this.onMagneticFieldChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID,
        SENSTICK2_MAGNETICFIELD_REALTIME_DATA_CHAR,
        true,
        this.onMagneticFieldChangeBinded,
        callback
    );
};

/**
 * 磁気センサのnotificationの受信要求を解除する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2MagneticFieldSensorService.prototype.unnotifyMagneticField = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID,
        SENSTICK2_MAGNETICFIELD_REALTIME_DATA_CHAR,
        false,
        this.onMagneticFieldChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた磁気センサデータをリスナに送る．
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}    data - 受信したデータ．
 * @fires SenStick2MagneticFieldSensorService#magneticfieldChange
 * @private
 */
SenStick2MagneticFieldSensorService.prototype.onMagneticFieldChange = function(data)
{
    this.convertMagneticField(
        data,
        function(x, y, z)
        {
            /**
             * magneticfieldChange イベント．
             * @event SenStick2MagneticFieldSensorService#magneticfieldChange
             * @param {number} x - X軸方向の磁場の強さ．
             * @param {number} y - Y軸方向の磁場の強さ．
             * @param {number} z - Z軸方向の磁場の強さ．
             */
            this.emit('magneticfieldChange', x, y, z);
        }.bind(this)
    );
};

/**
 * SenStickから送られてきたデータを磁気データに変換する．
 * @param {Buffer}                          data        - 変換元のデータ．
 * @param {convertMagneticFieldCallback}    callback    - コールバック関数．
 * @private
 */
SenStick2MagneticFieldSensorService.prototype.convertMagneticField = function(data, callback)
{
    var x = data.readInt16LE(0);
    var y = data.readInt16LE(2);
    var z = data.readInt16LE(4);
    callback(x, y, z);
};

/**
 * SenStickから送られてきたデータを磁気データに変換した際に呼び出されるコールバック関数．
 * @callback convertMagneticFieldCallback
 * @param {number}  x   - X軸方向の磁場の強さ．
 * @param {number}  y   - Y軸方向の磁場の強さ．
 * @param {number}  z   - Z軸方向の磁場の強さ．
 */


/**
 * 磁気センサの読み出し対象のログIDを指定する．
 * @param {number}      target_log_id   - 読み出し対象のログID．
 * @param {number}      start_position  - 読み出し開始位置をサンプル数単位で指定する．
 * @param {callback}    callback        - コールバック関数．
 */
SenStick2MagneticFieldSensorService.prototype.writeMagneticFieldLogReadoutTargetID = function(target_log_id, start_position, callback)
{
    this.writeSensorLogReadoutTargetID(
        SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID,
        SENSTICK2_MAGNETICFIELD_TARGET_LOGID_CHAR,
        target_log_id,
        start_position,
        callback
    );
};

/**
 * 磁気センサのログメタデータを取得する．
 * <b>このメソッドを呼び出す前に，writeMagneticFieldLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．</b>
 * <b>SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．</b>
 * @param {readMagneticFieldLogMetaDataCallback}    callback - コールバック関数
 */
SenStick2SensorService.prototype.readMagneticFieldLogMetaData = function(callback)
{
    this.readSensorLogMetaData(
        SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID,
        SENSTICK2_MAGNETICFIELD_LOGMETADATA_CHAR,
        callback
    );
};

/**
 * 磁気センサのログメタデータを取得した際に呼び出されるコールバック関数．
 * @callback readMagneticFieldLogMetaDataCallback
 * @param {?string}             error               - エラー内容．エラーが無ければnull．
 * @param {number|undefined}    target_log_id       - 読み出し対象のログID．
 * @param {number|undefined}    sampling_period     - このログのミリ秒単位のサンプリング周期．
 * @param {number|undefined}    measurement_range   - このログの測定レンジ．
 * @param {number|undefined}    number_of_samples   - このログに含まれるセンサデータの数．number_of_samplesはサンプル数単位で表される．
 * @param {number|undefined}    reading_position    - このログの現在の読み出し位置．reading_positionはサンプル数単位で表される．
 * @param {number|undefined}    remaining_storage   - 磁気センササービスのストレージの残量．remaining_storageはサンプル数単位で表される．
 */

/**
 * 磁気センサのログデータのnotificationの受信要求を設定する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2MagneticFieldSensorService.prototype.notifyMagneticFieldLogData = function(callback)
{
    this.onMagneticFieldLogDataChangeBinded = this.onMagneticFieldLogDataChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID,
        SENSTICK2_MAGNETICFIELD_LOGDATA_CHAR,
        true,
        this.onMagneticFieldLogDataChangeBinded,
        callback
    );
};

/**
 * 磁気センサのログデータのnotificationの受信要求を解除する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2MagneticFieldSensorService.prototype.unnotifyMagneticFieldLogData = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_MAGNETICFIELD_SENSOR_SERVICE_UUID,
        SENSTICK2_MAGNETICFIELD_LOGDATA_CHAR,
        false,
        this.onMagneticFieldLogDataChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた磁気センサログデータをリスナに送る
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}  data - 受信したデータ
 * @fires SenStick2MagneticFieldSensorService#magneticfieldLogDataReceived
 * @private
 */
SenStick2MagneticFieldSensorService.prototype.onMagneticFieldLogDataChange = function(data)
{
    var number_of_data = data.readUInt8(0);
    var sensor_data = [];
    for(var i = 0; i < number_of_data; i++)
    {
        var elm = [data.readInt16LE(1+i*6), data.readInt16LE(3+i*6), data.readInt16LE(5+i*6)];
        sensor_data.push(elm);
    }
    /**
     * magneticfieldLogDataReceived イベント．
     * @event SenStick2MagneticFieldSensorService#magneticfieldLogDataReceived
     * @param {number} number_of_data - sensor_dataの要素数．
     * @param {number[][]} sensor_data  - ログデータ．各要素の先頭から順にX軸方向の磁場の強さ，Y軸方向の磁場の強さ，Z軸方向の磁場の強さを表す．
     */
    this.emit('magneticfieldLogDataReceived', number_of_data, sensor_data);
};

/**
 * 磁気センサの測定レンジに対応する換算値を取得する．
 * 磁気センサから取得した数値を物理値に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param {number}      range           測定レンジの値．
 * @returns {?number}   換算値．nullの場合は，対応する換算値は存在しないことを示す．
 */
SenStick2MagneticFieldSensorService.prototype.getMagneticFieldConversionValue = function(range)
{
    if(range == 0) return 1.0/0.15;
    return null;
};

module.exports = SenStick2MagneticFieldSensorService;
