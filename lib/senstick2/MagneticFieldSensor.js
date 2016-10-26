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
SenStick2SensorService.prototype.writeAccelerometerMeasurementRange = function(measurement_range, callback)
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
 * 磁気センサのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
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
 * notificationで送られてきた磁気センサデータをリスナに送る
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2MagneticFieldSensorService.prototype.onMagneticFieldChange = function(data)
{
    this.emit('magneticfieldChange', data.readInt16LE(0));
};

/**
 * 磁気センサの読み出し対象のログIDを指定する
 * @param       target_log_id           読み出し対象のログID
 * @param       start_position          読み出し開始位置をサンプル数単位で指定する
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error)の形を取る
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
 * 磁気センサのログメタデータを取得する
 * @attention   このメソッドを呼び出す前に，writeMagneticFieldLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．
 * @attention   SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error, target_log_id, sampling_period, measurement_range, number_of_samples, reading_position, remaining_storage)の形を取る
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
 * 磁気センサのログデータのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
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
 * 磁気センサのログデータのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
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
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2MagneticFieldSensorService.prototype.onMagneticFieldLogDataChange = function(data)
{
    var number_of_data = data.readUInt8(0);
    var sensor_data = [];
    for(var i = 0; i < number_of_data; i++)
    {
        sensor_data.push(data.readInt16LE(1+i*2));
    }
    this.emit('magneticfieldLogDataReceived', number_of_data, sensor_data);
};

/**
 * 磁気センサの測定レンジに対応する換算値を取得する
 * 磁気センサから取得した数値を物理値[単位:uT]に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param       range           測定レンジの値
 * @retval      null            対応する換算値は存在しない
 * @retval      その他           換算値
 */
SenStick2MagneticFieldSensorService.prototype.getMagneticFieldConversionValue = function(range)
{
    if(range == 0) return 1.0/0.15;
    return null;
};

module.exports = SenStick2MagneticFieldSensorService;
