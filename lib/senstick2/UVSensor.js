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
 * @mixin
 */
function SenStick2UVSensorService()
{
}

/**
 * 紫外線センサの計測動作を取得する．
 * @param {readUVMeasurementConfigCallback} callback - コールバック関数．
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
 * 紫外線センサの計測動作を取得した際に呼び出されるコールバック関数．
 * @callback readUVMeasurementConfigCallback
 * @param {?string}                         error               - エラー内容．エラーが無ければnull．
 * @param {SensorOperationMode|undefined}   operation_mode      - 動作モード．
 * @param {number|undefined}                sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number|undefined}                measurement_range   - 紫外線センサの測定レンジ．
 */

/**
 * 紫外線センサの計測動作を設定する．
 * @param {SensorOperationMode} operation_mode      - 動作モード．
 * @param {number}              sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number}              measurement_range   - 紫外線センサの測定レンジ．
 * @param {callback}            callback            - コールバック関数．
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
 * 紫外線センサを有効にする．
 * @param {boolean}             logging_flag        - ロギングの有効・無効を表すフラグ．
 * @param {callback}            callback            - コールバック関数．
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
 * 紫外線センサを無効にする．
 * @param {callback}            callback            - コールバック関数．
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
 * 紫外線センサのサンプル周期を設定する．
 * @param {number}              sampling_period     - ミリ秒単位のサンプル周期．
 * @param {callback}            callback            - コールバック関数．
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
 * 紫外線センサの測定レンジを設定する．
 * @param {number}      measurement_range       - 紫外線センサの測定レンジ．
 * @param {callback}    callback                - コールバック関数．
 */
SenStick2UVSensorService.prototype.writeUVMeasurementRange = function(measurement_range, callback)
{
    this.writeSensorMeasurementRange(
        SENSTICK2_UV_SENSOR_SERVICE_UUID,
        SENSTICK2_UV_MEASUREMENT_CONFIG_CHAR,
        measurement_range,
        callback
    );
};

/**
 * 紫外線センサのnotificationの受信要求を設定する．
 * @param {callback}    callback - コールバック関数．
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
 * 紫外線センサのnotificationの受信要求を解除する．
 * @param {callback}    callback - コールバック関数．
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
 * notificationで送られてきた紫外線センサデータをリスナに送る．
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}    data - 受信したデータ．
 * @fires SenStick2UVSensorService#UVChange
 * @private
 */
SenStick2UVSensorService.prototype.onUVChange = function(data)
{
    /**
     * UVChange イベント．
     * @event SenStick2UVSensorService#UVChange
     * @param {number} uv - 紫外線．
     */
    this.emit('UVChange', data.readUInt16LE(0));
};

/**
 * 紫外線センサの読み出し対象のログIDを指定する．
 * @param {number}      target_log_id   - 読み出し対象のログID．
 * @param {number}      start_position  - 読み出し開始位置をサンプル数単位で指定する．
 * @param {callback}    callback        - コールバック関数．
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
 * 紫外線センサのログメタデータを取得する．
 * <b>このメソッドを呼び出す前に，writeUVLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．</b>
 * <b>SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．</b>
 * @param {readUVLogMetaDataCallback}       callback - コールバック関数
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
 * 紫外線センサのログメタデータを取得した際に呼び出されるコールバック関数．
 * @callback readUVLogMetaDataCallback
 * @param {?string}             error               - エラー内容．エラーが無ければnull．
 * @param {number|undefined}    target_log_id       - 読み出し対象のログID．
 * @param {number|undefined}    sampling_period     - このログのミリ秒単位のサンプリング周期．
 * @param {number|undefined}    measurement_range   - このログの測定レンジ．
 * @param {number|undefined}    number_of_samples   - このログに含まれるセンサデータの数．number_of_samplesはサンプル数単位で表される．
 * @param {number|undefined}    reading_position    - このログの現在の読み出し位置．reading_positionはサンプル数単位で表される．
 * @param {number|undefined}    remaining_storage   - 紫外線センササービスのストレージの残量．remaining_storageはサンプル数単位で表される．
 */

/**
 * 紫外線センサのログデータのnotificationの受信要求を設定する．
 * @param {callback}    callback - コールバック関数．
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
 * 紫外線センサのログデータのnotificationの受信要求を解除する．
 * @param {callback}    callback - コールバック関数．
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
 * notificationで送られてきた気圧センサログデータをリスナに送る．
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}  data - 受信したデータ
 * @fires SenStick2UVSensorService#UVLogDataReceived
 * @private
 */
SenStick2UVSensorService.prototype.onUVLogDataChange = function(data)
{
    var number_of_data = data.readUInt8(0);
    var sensor_data = [];
    for(var i = 0; i < number_of_data; i++)
    {
        sensor_data.push(data.readUInt16LE(1+i*2));
    }
    /**
     * UVLogDataReceived イベント．
     * @event SenStick2UVSensorService#UVLogDataReceived
     * @param {number} number_of_data - sensor_dataの要素数．
     * @param {number[]} sensor_data  - 紫外線センサのログデータ．
     */
    this.emit('UVLogDataReceived', number_of_data, sensor_data);
};

/**
 * 紫外線センサの測定レンジに対応する換算値を取得する．
 * 紫外線センサから取得した数値を物理値に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param {number}      range           測定レンジの値．
 * @returns {?number}   換算値．nullの場合は，対応する換算値は存在しないことを示す．
 */
SenStick2UVSensorService.prototype.getUVConversionValue = function(range)
{
    if(range == 0) return 1.0/5.0;
    return null;
};

module.exports = SenStick2UVSensorService;
