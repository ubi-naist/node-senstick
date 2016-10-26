'use strict';

// 気圧センササービス
var SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID       = 'f000210604514000b000000000000000';
var SENSTICK2_PRESSURE_MEASUREMENT_CONFIG_CHAR   = 'f000710604514000b000000000000000';
var SENSTICK2_PRESSURE_REALTIME_DATA_CHAR        = 'f000720604514000b000000000000000';
var SENSTICK2_PRESSURE_TARGET_LOGID_CHAR         = 'f000730604514000b000000000000000';
var SENSTICK2_PRESSURE_LOGMETADATA_CHAR          = 'f000740604514000b000000000000000';
var SENSTICK2_PRESSURE_LOGDATA_CHAR              = 'f000750604514000b000000000000000';

var SenStick2SensorService = require('./SensorService');

/**
 * SenStick2PressureSensorServiceは，気圧センサのセンシング及びロギングの動作指定，リアルタイムのセンサデータ読み出し，及びログデータの
 * 読み出し機能を提供する.
 * @mixin
 */
function SenStick2PressureSensorService()
{
}

/**
 * 気圧センサの計測動作を取得する．
 * @param {readPressureMeasurementConfigCallback}  callback - コールバック関数．
**/
SenStick2PressureSensorService.prototype.readPressureMeasurementConfig = function(callback)
{
    this.readMeasurementConfig(
        SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID,
        SENSTICK2_PRESSURE_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 気圧センサの計測動作を取得した際に呼び出されるコールバック関数．
 * @callback readPressureMeasurementConfigCallback
 * @param {?string}                         error               - エラー内容．エラーが無ければnull．
 * @param {SensorOperationMode|undefined}   operation_mode      - 動作モード．
 * @param {number|undefined}                sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number|undefined}                measurement_range   - 気圧センサの測定レンジ．
 */

/**
 * 気圧センサの計測動作を設定する．
 * @param {SensorOperationMode} operation_mode      - 動作モード．
 * @param {number}              sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number}              measurement_range   - 気圧センサの測定レンジ．
 * @param {callback}            callback            - コールバック関数．
**/
SenStick2PressureSensorService.prototype.writePressureMeasurementConfig = function(operation_mode, sampling_period, measurement_range, callback)
{
    this.writeMeasurementConfig(
        SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID,
        SENSTICK2_PRESSURE_MEASUREMENT_CONFIG_CHAR,
        operation_mode,
        sampling_period,
        measurement_range,
        callback
    );
};

/**
 * 気圧センサを有効にする．
 * @param {boolean}             logging_flag        - ロギングの有効・無効を表すフラグ．
 * @param {callback}            callback            - コールバック関数．
*/
SenStick2PressureSensorService.prototype.enablePressureSensor = function(logging_flag, callback)
{
    this.enableSensor(
        SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID,
        SENSTICK2_PRESSURE_MEASUREMENT_CONFIG_CHAR,
        logging_flag,
        callback
        );
};

/**
 * 気圧センサを無効にする．
 * @param {callback}            callback            - コールバック関数．
*/
SenStick2PressureSensorService.prototype.disablePressureSensor = function(callback)
{
    this.disableSensor(
        SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID,
        SENSTICK2_PRESSURE_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 気圧センサのサンプル周期を設定する．
 * @param {number}              sampling_period     - ミリ秒単位のサンプル周期．
 * @param {callback}            callback            - コールバック関数．
 */
SenStick2PressureSensorService.prototype.writePressureSamplingPeriod = function(sampling_period, callback)
{
    this.writeSensorSamplingPeriod(
        SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID,
        SENSTICK2_PRESSURE_MEASUREMENT_CONFIG_CHAR,
        sampling_period,
        callback
    );
};

/**
 * 気圧センサの測定レンジを設定する．
 * @param {number}      measurement_range       - 加速度センサの測定レンジ．
 * @param {callback}    callback                - コールバック関数．
 */
SenStick2SensorService.prototype.writeAccelerometerMeasurementRange = function(measurement_range, callback)
{
    this.writeSensorMeasurementRange(
        SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID,
        SENSTICK2_PRESSURE_MEASUREMENT_CONFIG_CHAR,
        measurement_range,
        callback
    );
};

/**
 * 気圧センサのnotificationの受信要求を設定する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2PressureSensorService.prototype.notifyPressure = function(callback)
{
    this.onPressureChangeBinded = this.onPressureChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID,
        SENSTICK2_PRESSURE_REALTIME_DATA_CHAR,
        true,
        this.onPressureChangeBinded,
        callback
    );
};

/**
 * 気圧センサのnotificationの受信要求を解除する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2PressureSensorService.prototype.unnotifyPressure = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID,
        SENSTICK2_PRESSURE_REALTIME_DATA_CHAR,
        false,
        this.onPressureChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた気圧センサデータをリスナに送る．
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}    data - 受信したデータ．
 * @fires SenStick2PressureSensorService#pressureChange
 * @private
 */
SenStick2PressureSensorService.prototype.onPressureChange = function(data)
{
    /**
     * pressureChange イベント．
     * @event SenStick2PressureSensorService#pressureChange
     * @param {number} pressure - 気圧．
     */
    this.emit('pressureChange', data.readUInt32LE(0));
};

/**
 * 気圧センサの読み出し対象のログIDを指定する．
 * @param {number}      target_log_id   - 読み出し対象のログID．
 * @param {number}      start_position  - 読み出し開始位置をサンプル数単位で指定する．
 * @param {callback}    callback        - コールバック関数．
 */
SenStick2PressureSensorService.prototype.writePressureLogReadoutTargetID = function(target_log_id, start_position, callback)
{
    this.writeSensorLogReadoutTargetID(
        SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID,
        SENSTICK2_PRESSURE_TARGET_LOGID_CHAR,
        target_log_id,
        start_position,
        callback
    );
};

/**
 * 気圧センサのログメタデータを取得する．
 * <b>このメソッドを呼び出す前に，writePressureLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．</b>
 * <b>SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．</b>
 * @param {readPressureLogMetaDataCallback}     callback - コールバック関数
 */
SenStick2SensorService.prototype.readPressureLogMetaData = function(callback)
{
    this.readSensorLogMetaData(
        SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID,
        SENSTICK2_PRESSURE_LOGMETADATA_CHAR,
        callback
    );
};

/**
 * 気圧センサのログメタデータを取得した際に呼び出されるコールバック関数．
 * @callback readPressureLogMetaDataCallback
 * @param {?string}             error               - エラー内容．エラーが無ければnull．
 * @param {number|undefined}    target_log_id       - 読み出し対象のログID．
 * @param {number|undefined}    sampling_period     - このログのミリ秒単位のサンプリング周期．
 * @param {number|undefined}    measurement_range   - このログの測定レンジ．
 * @param {number|undefined}    number_of_samples   - このログに含まれるセンサデータの数．number_of_samplesはサンプル数単位で表される．
 * @param {number|undefined}    reading_position    - このログの現在の読み出し位置．reading_positionはサンプル数単位で表される．
 * @param {number|undefined}    remaining_storage   - 気圧センササービスのストレージの残量．remaining_storageはサンプル数単位で表される．
 */

/**
 * 気圧センサのログデータのnotificationの受信要求を設定する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2PressureSensorService.prototype.notifyPressureLogData = function(callback)
{
    this.onPressureLogDataChangeBinded = this.onPressureLogDataChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID,
        SENSTICK2_PRESSURE_LOGDATA_CHAR,
        true,
        this.onPressureLogDataChangeBinded,
        callback
    );
};

/**
 * 気圧センサのログデータのnotificationの受信要求を解除する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2PressureSensorService.prototype.unnotifyPressureLogData = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_PRESSURE_SENSOR_SERVICE_UUID,
        SENSTICK2_PRESSURE_LOGDATA_CHAR,
        false,
        this.onPressureLogDataChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた気圧センサログデータをリスナに送る
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}  data - 受信したデータ
 * @fires SenStick2PressureSensorService#pressureLogDataReceived
 * @private
 */
SenStick2PressureSensorService.prototype.onPressureLogDataChange = function(data)
{
    var number_of_data = data.readUInt8(0);
    var sensor_data = [];
    for(var i = 0; i < number_of_data; i++)
    {
        sensor_data.push(data.readUInt32LE(1+i*4));
    }
    /**
     * pressureLogDataReceived イベント．
     * @event SenStick2PressureSensorService#pressureLogDataReceived
     * @param {number} number_of_data - sensor_dataの要素数．
     * @param {number[]} sensor_data  - 気圧センサのログデータ．
     */
    this.emit('pressureLogDataReceived', number_of_data, sensor_data);
};

/**
 * 気圧センサの測定レンジに対応する換算値を取得する．
 * 気圧センサから取得した数値を物理値に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param {number}      range           測定レンジの値．
 * @returns {?number}   換算値．nullの場合は，対応する換算値は存在しないことを示す．
 */
SenStick2PressureSensorService.prototype.getPressureConversionValue = function(range)
{
    if(range == 0) return 4096.0;
    return null;
};

module.exports = SenStick2PressureSensorService;
