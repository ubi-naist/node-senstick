'use strict';

// 加速度センササービス
var SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID       = 'f000210004514000b000000000000000';
var SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR   = 'f000710004514000b000000000000000';
var SENSTICK2_ACCELEROMETER_REALTIME_DATA_CHAR        = 'f000720004514000b000000000000000';
var SENSTICK2_ACCELEROMETER_TARGET_LOGID_CHAR         = 'f000730004514000b000000000000000';
var SENSTICK2_ACCELEROMETER_LOGMETADATA_CHAR          = 'f000740004514000b000000000000000';
var SENSTICK2_ACCELEROMETER_LOGDATA_CHAR              = 'f000750004514000b000000000000000';

var SenStick2SensorService = require('./SensorService');

/**
 * SenStick2AccelerometerSensorServiceは，加速度センサのセンシング及びロギングの動作指定，リアルタイムのセンサデータ読み出し，及びログデータの
 * 読み出し機能を提供する.
 * @mixin
 */
function SenStick2AccelerometerSensorService()
{
}

/**
 * 加速度センサの計測動作を取得する．
 * @param {readAccelerometerMeasurementConfigCallback}  callback - コールバック関数．
**/
SenStick2AccelerometerSensorService.prototype.readAccelerometerMeasurementConfig = function(callback)
{
    this.readMeasurementConfig(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 加速度センサの計測動作を取得した際に呼び出されるコールバック関数．
 * @callback readAccelerometerMeasurementConfigCallback
 * @param {?string}                         error               - エラー内容．エラーが無ければnull．
 * @param {SensorOperationMode|undefined}   operation_mode      - 動作モード．
 * @param {number|undefined}                sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number|undefined}                measurement_range   - 加速度センサの測定レンジ．
 */

/**
 * 加速度センサの計測動作を設定する．
 * @param {SensorOperationMode} operation_mode      - 動作モード．
 * @param {number}              sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number}              measurement_range   - 加速度センサの測定レンジ．
 * @param {callback}            callback            - コールバック関数．
**/
SenStick2AccelerometerSensorService.prototype.writeAccelerometerMeasurementConfig = function(operation_mode, sampling_period, measurement_range, callback)
{
    this.writeMeasurementConfig(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR,
        operation_mode,
        sampling_period,
        measurement_range,
        callback
    );
};

/**
 * 加速度センサを有効にする．
 * @param {boolean}             logging_flag        - ロギングの有効・無効を表すフラグ．
 * @param {callback}            callback            - コールバック関数．
*/
SenStick2AccelerometerSensorService.prototype.enableAccelerometer= function(logging_flag, callback)
{
    this.enableSensor(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR,
        logging_flag,
        callback
        );
};

/**
 * 加速度センサを無効にする．
 * @param {callback}            callback            - コールバック関数．
*/
SenStick2AccelerometerSensorService.prototype.disableAccelerometer = function(callback)
{
    this.disableSensor(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 加速度センサのサンプル周期を設定する．
 * @param {number}              sampling_period     - ミリ秒単位のサンプル周期．
 * @param {callback}            callback            - コールバック関数．
 */
SenStick2AccelerometerSensorService.prototype.writeAccelerometerSamplingPeriod = function(sampling_period, callback)
{
    this.writeSensorSamplingPeriod(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR,
        sampling_period,
        callback
    );
};

/**
 * 加速度センサの測定レンジを設定する．
 * @param {number}      measurement_range       - 加速度センサの測定レンジ．
 * @param {callback}    callback                - コールバック関数．
 */
SenStick2SensorService.prototype.writeAccelerometerMeasurementRange = function(measurement_range, callback)
{
    this.writeSensorMeasurementRange(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_MEASUREMENT_CONFIG_CHAR,
        measurement_range,
        callback
    );
};

/**
 * 加速度センサのnotificationの受信要求を設定する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2AccelerometerSensorService.prototype.notifyAccelerometer = function(callback)
{
    this.onAccelerometerChangeBinded = this.onAccelerometerChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_REALTIME_DATA_CHAR,
        true,
        this.onAccelerometerChangeBinded,
        callback
    );
};

/**
 * 加速度センサのnotificationの受信要求を解除する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2AccelerometerSensorService.prototype.unnotifyAccelerometer = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_REALTIME_DATA_CHAR,
        false,
        this.onAccelerometerChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた加速度センサデータをリスナに送る．
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}    data - 受信したデータ．
 * @fires SenStick2AccelerometerSensorService#accelerometerChange
 * @private
 */
SenStick2AccelerometerSensorService.prototype.onAccelerometerChange = function(data)
{
    this.convertAccelerometer(
        data,
        function(x, y, z)
        {
            /**
             * accelerometerChange イベント．
             * @event SenStick2AccelerometerSensorService#accelerometerChange
             * @param {number} x - X軸方向の加速度．
             * @param {number} y - Y軸方向の加速度．
             * @param {number} z - Z軸方向の加速度．
             */
            this.emit('accelerometerChange', x, y, z);
        }.bind(this)
    );
};

/**
 * SenStickから送られてきたデータを加速度データに変換する．
 * @param {Buffer}                          data        - 変換元のデータ．
 * @param {convertAccelerometerCallback}    callback    - コールバック関数．
 * @private
 */
SenStick2AccelerometerSensorService.prototype.convertAccelerometer = function(data, callback)
{
    var x = data.readInt16LE(0);
    var y = data.readInt16LE(2);
    var z = data.readInt16LE(4);
    callback(x, y, z);
};

/**
 * SenStickから送られてきたデータを加速度データに変換した際に呼び出されるコールバック関数．
 * @callback convertAccelerometerCallback
 * @param {number}  x   - X軸方向の加速度．
 * @param {number}  y   - Y軸方向の加速度．
 * @param {number}  z   - Z軸方向の加速度．
 */

/**
 * 加速度センサの読み出し対象のログIDを指定する．
 * @param {number}      target_log_id   - 読み出し対象のログID．
 * @param {number}      start_position  - 読み出し開始位置をサンプル数単位で指定する．
 * @param {callback}    callback        - コールバック関数．
 */
SenStick2AccelerometerSensorService.prototype.writeAccelerometerLogReadoutTargetID = function(target_log_id, start_position, callback)
{
    this.writeSensorLogReadoutTargetID(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_TARGET_LOGID_CHAR,
        target_log_id,
        start_position,
        callback
    );
};

/**
 * 加速度センサのログメタデータを取得する．
 * <b>このメソッドを呼び出す前に，writeAccelerometerLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．</b>
 * <b>SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．</b>
 * @param {readAccelerometerLogMetaDataCallback}    callback - コールバック関数
 */
SenStick2SensorService.prototype.readAccelerometerLogMetaData = function(callback)
{
    this.readSensorLogMetaData(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_LOGMETADATA_CHAR,
        callback
    );
};

/**
 * 加速度センサのログメタデータを取得した際に呼び出されるコールバック関数．
 * @callback readAccelerometerLogMetaDataCallback
 * @param {?string}             error               - エラー内容．エラーが無ければnull．
 * @param {number|undefined}    target_log_id       - 読み出し対象のログID．
 * @param {number|undefined}    sampling_period     - このログのミリ秒単位のサンプリング周期．
 * @param {number|undefined}    measurement_range   - このログの測定レンジ．
 * @param {number|undefined}    number_of_samples   - このログに含まれるセンサデータの数．number_of_samplesはサンプル数単位で表される．
 * @param {number|undefined}    reading_position    - このログの現在の読み出し位置．reading_positionはサンプル数単位で表される．
 * @param {number|undefined}    remaining_storage   - 加速度センササービスのストレージの残量．remaining_storageはサンプル数単位で表される．
 */

/**
 * 加速度センサのログデータのnotificationの受信要求を設定する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2AccelerometerSensorService.prototype.notifyAccelerometerLogData = function(callback)
{
    this.onAccelerometerLogDataChangeBinded = this.onAccelerometerLogDataChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_LOGDATA_CHAR,
        true,
        this.onAccelerometerLogDataChangeBinded,
        callback
    );
};

/**
 * 加速度センサのログデータのnotificationの受信要求を解除する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2AccelerometerSensorService.prototype.unnotifyAccelerometerLogData = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_ACCELEROMETER_SENSOR_SERVICE_UUID,
        SENSTICK2_ACCELEROMETER_LOGDATA_CHAR,
        false,
        this.onAccelerometerLogDataChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた加速度センサログデータをリスナに送る
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}  data - 受信したデータ
 * @fires SenStick2AccelerometerSensorService#accelerometerLogDataReceived
 * @private
 */
SenStick2AccelerometerSensorService.prototype.onAccelerometerLogDataChange = function(data)
{
    var number_of_data = data.readUInt8(0);
    var sensor_data = [];
    for(var i = 0; i < number_of_data; i++)
    {
        var elm = [data.readInt16LE(1+i*6), data.readInt16LE(3+i*6), data.readInt16LE(5+i*6)];
        sensor_data.push(elm);
    }
    /**
     * accelerometerLogDataReceived イベント．
     * @event SenStick2AccelerometerSensorService#accelerometerLogDataReceived
     * @param {number} number_of_data - sensor_dataの要素数．
     * @param {number[][]} sensor_data  - ログデータ．各要素の先頭から順にX軸方向の加速度，Y軸方向の加速度，Z軸方向の加速度を表す．
     */
    this.emit('accelerometerLogDataReceived', number_of_data, sensor_data);
};

/**
 * 加速度センサの測定レンジに対応する換算値を取得する．
 * 加速度センサから取得した数値を物理値に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param {number}      range           測定レンジの値．
 * @returns {?number}   換算値．nullの場合は，対応する換算値は存在しないことを示す．
 */
SenStick2AccelerometerSensorService.prototype.getAccelerometerConversionValue = function(range)
{
    switch(range)
    {
    case 0: return 16384;
    case 1: return 8192;
    case 2: return 4096;
    case 3: return 2048;
    }
    return null;
};

module.exports = SenStick2AccelerometerSensorService;
