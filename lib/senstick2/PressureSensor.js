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
 */
function SenStick2PressureSensorService()
{
}

/**
 * 気圧センサの計測動作を取得する
 * @param       callback        コールバック関数
 *              callbackはfunction(error, operation_mode, sampling_period, measurement_range)の形をとる．
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
 * 気圧センサの計測動作を設定する
 * @param       operation_mode      動作モード
 *                                  (0x00:停止，0x01:センシング，0x03:センシング及びロギング)
 * @param       sampling_period     サンプル周期(ミリ秒)
 * @param       measurement_range   センサの測定レンジ．値の範囲と意味はセンサごとに定義される．
 * @param       callback            コールバック関数
 *              callbackはfunction(error)の形をとる．
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
 * 気圧センサを有効にする
 * @param       logging_flag        ロギングの有効・無効を表すフラグ
 *                                  @arg true  : ロギングを有効にする
 *                                  @arg false : ロギングを無効にする
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
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
 * 気圧センサを無効にする
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
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
 * 気圧センサのサンプル周期を設定する
 * @param       sampling_period     ミリ秒単位のサンプル周期
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
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
 * 気圧センサのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
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
 * 気圧センサのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
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
 * notificationで送られてきた気圧センサデータをリスナに送る
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2PressureSensorService.prototype.onPressureChange = function(data)
{
    this.emit('pressureChange', data.readUInt32LE(0));
};

/**
 * 気圧センサの読み出し対象のログIDを指定する
 * @param       target_log_id           読み出し対象のログID
 * @param       start_position          読み出し開始位置をサンプル数単位で指定する
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error)の形を取る
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
 * 気圧センサのログメタデータを取得する
 * @attention   このメソッドを呼び出す前に，writePressureLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．
 * @attention   SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error, target_log_id, sampling_period, measurement_range, number_of_samples, reading_position, remaining_storage)の形を取る
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
 * 気圧センサのログデータのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
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
 * 気圧センサのログデータのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
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
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2PressureSensorService.prototype.onPressureLogDataChange = function(data)
{
    var number_of_data = data.readUInt8(0);
    var sensor_data = [];
    for(var i = 0; i < number_of_data; i++)
    {
        sensor_data.push(data.readUInt32LE(1+i*4));
    }
    this.emit('pressureLogDataReceived', number_of_data, sensor_data);
};

/**
 * 気圧センサの測定レンジに対応する換算値を取得する
 * 気圧センサから取得した数値を物理値[単位:hPa]に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param       range           測定レンジの値
 * @retval      null            対応する換算値は存在しない
 * @retval      その他           換算値
 */
SenStick2PressureSensorService.prototype.getPressureConversionValue = function(range)
{
    if(range == 0) return 4096.0;
    return null;
};

module.exports = SenStick2PressureSensorService;
