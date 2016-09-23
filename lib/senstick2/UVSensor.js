'use strict';

// 紫外線センササービス
var SENSTICK2_UV_SENSOR_SERVICE_UUID       = 'f000210404514000b000000000000000';
var SENSTICK2_UV_MEASUREMENT_CONFIG_CHAR   = 'f000710404514000b000000000000000';
var SENSTICK2_UV_REALTIME_DATA_CHAR        = 'f000720404514000b000000000000000';
var SENSTICK2_UV_TARGET_LOGID_CHAR         = 'f000730404514000b000000000000000';
var SENSTICK2_UV_LOGMETADATA_CHAR          = 'f000740404514000b000000000000000';
var SENSTICK2_UV_LOGDATA_CHAR              = 'f000750404514000b000000000000000';

var SenStick2SensorService = require('./SensorService');

/**
 * SenStick2UVSensorServiceは，紫外線センサのセンシング及びロギングの動作指定，リアルタイムのセンサデータ読み出し，及びログデータの
 * 読み出し機能を提供する.
 */
function SenStick2UVSensorService()
{
}

/**
 * 紫外線センサの計測動作を取得する
 * @param       callback        コールバック関数
 *              callbackはfunction(error, operation_mode, sampling_period, measurement_range)の形をとる．
**/
SenStick2UVSensorService.prototype.readUVMeasurementConfig = function(callback)
{
    this.readMeasurementConfig(
        SENSTICK2_UV_SENSOR_SERVICE_UUID,
        SENSTICK2_UV_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 紫外線センサの計測動作を設定する
 * @param       operation_mode      動作モード
 *                                  (0x00:停止，0x01:センシング，0x03:センシング及びロギング)
 * @param       sampling_period     サンプル周期(ミリ秒)
 * @param       measurement_range   センサの測定レンジ．値の範囲と意味はセンサごとに定義される．
 * @param       callback            コールバック関数
 *              callbackはfunction(error)の形をとる．
**/
SenStick2UVSensorService.prototype.writeUVMeasurementConfig = function(operation_mode, sampling_period, measurement_range, callback)
{
    this.writeMeasurementConfig(
        SENSTICK2_UV_SENSOR_SERVICE_UUID,
        SENSTICK2_UV_MEASUREMENT_CONFIG_CHAR,
        operation_mode,
        sampling_period,
        measurement_range,
        callback
    );
};

/**
 * 紫外線センサを有効にする
 * @param       logging_flag        ロギングの有効・無効を表すフラグ
 *                                  @arg true  : ロギングを有効にする
 *                                  @arg false : ロギングを無効にする
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
*/
SenStick2UVSensorService.prototype.enableUVSensor = function(logging_flag, callback)
{
    this.enableSensor(
        SENSTICK2_UV_SENSOR_SERVICE_UUID,
        SENSTICK2_UV_MEASUREMENT_CONFIG_CHAR,
        logging_flag,
        callback
        );
};

/**
 * 紫外線センサを無効にする
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
*/
SenStick2UVSensorService.prototype.disableUVSensor = function(callback)
{
    this.disableSensor(
        SENSTICK2_UV_SENSOR_SERVICE_UUID,
        SENSTICK2_UV_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 紫外線センサのサンプル周期を設定する
 * @param       sampling_period     ミリ秒単位のサンプル周期
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる．
 */
SenStick2UVSensorService.prototype.writeUVSamplingPeriod = function(sampling_period, callback)
{
    this.writeSensorSamplingPeriod(
        SENSTICK2_UV_SENSOR_SERVICE_UUID,
        SENSTICK2_UV_MEASUREMENT_CONFIG_CHAR,
        sampling_period,
        callback
    );
};

/**
 * 紫外線センサのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
 */
SenStick2UVSensorService.prototype.notifyUV = function(callback)
{
    this.onUVChangeBinded = this.onUVChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_UV_SENSOR_SERVICE_UUID,
        SENSTICK2_UV_REALTIME_DATA_CHAR,
        true,
        this.onUVChangeBinded,
        callback
    );
};

/**
 * 紫外線センサのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
 */
SenStick2UVSensorService.prototype.unnotifyUV = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_UV_SENSOR_SERVICE_UUID,
        SENSTICK2_UV_REALTIME_DATA_CHAR,
        false,
        this.onUVChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた紫外線センサデータをリスナに送る
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2UVSensorService.prototype.onUVChange = function(data)
{
    this.emit('UVChange', data.readUInt16LE(0));
}

/**
 * 紫外線センサの読み出し対象のログIDを指定する
 * @param       target_log_id           読み出し対象のログID
 * @param       start_position          読み出し開始位置をサンプル数単位で指定する
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error)の形を取る
 */
SenStick2UVSensorService.prototype.writeUVLogReadoutTargetID = function(target_log_id, start_position, callback)
{
    this.writeSensorLogReadoutTargetID(
        SENSTICK2_UV_SENSOR_SERVICE_UUID,
        SENSTICK2_UV_TARGET_LOGID_CHAR,
        target_log_id,
        start_position,
        callback
    );
};

/**
 * 紫外線センサのログメタデータを取得する
 * @attention   このメソッドを呼び出す前に，writeUVLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．
 * @attention   SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error, target_log_id, sampling_period, measurement_range, number_of_samples, reading_position, remaining_storage)の形を取る
 */
SenStick2SensorService.prototype.readUVLogMetaData = function(callback)
{
    this.readSensorLogMetaData(
        SENSTICK2_UV_SENSOR_SERVICE_UUID,
        SENSTICK2_UV_LOGMETADATA_CHAR,
        callback
    );
};

/**
 * 紫外線センサのログデータのnotificationの受信要求を設定する
 * @param       callback            コールバック関数
 *                                  callbackはfunction(error)の形をとる
 */
SenStick2UVSensorService.prototype.notifyUVLogData = function(callback)
{
    this.onUVLogDataChangeBinded = this.onUVLogDataChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_UV_SENSOR_SERVICE_UUID,
        SENSTICK2_UV_LOGDATA_CHAR,
        true,
        this.onUVLogDataChangeBinded,
        callback
    );
};

/**
 * 紫外線センサのログデータのnotificationの受信要求を解除する
 * @param       callback        コールバック関数
 *                              callbackはfunction(error)の形をとる
 */
SenStick2UVSensorService.prototype.unnotifyUVLogData = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_UV_SENSOR_SERVICE_UUID,
        SENSTICK2_UV_LOGDATA_CHAR,
        false,
        this.onUVLogDataChangeBinded,
        callback
    );
};


/**
 * notificationで送られてきた紫外線センサログデータをリスナに送る
 * @note notificationを受信した際に自動的に呼び出される．
 * @param       data            受信したデータ
 */
SenStick2UVSensorService.prototype.onUVLogDataChange = function(data)
{
    var number_of_data = data.readUInt8(0);
    var sensor_data = [];
    for(var i = 0; i < number_of_data; i++)
    {
        sensor_data.push(data.readUInt16LE(1+i*2));
    }
    this.emit('UVLogDataReceived', number_of_data, sensor_data);
};

/**
 * 紫外線センサの測定レンジに対応する換算値を取得する
 * 紫外線センサから取得した数値を物理値[単位:uW/cm^2]に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param       range           測定レンジの値
 * @retval      null            対応する換算値は存在しない
 * @retval      その他           換算値
 */
SenStick2UVSensorService.prototype.getUVConversionValue = function(range)
{
    if(range == 0) return 1.0/5.0;
    return null;
};

module.exports = SenStick2UVSensorService;
