'use strict';

// 角速度センササービス
const SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID       = 'f000210104514000b000000000000000';
const SENSTICK2_GYROSCOPE_MEASUREMENT_CONFIG_CHAR   = 'f000710104514000b000000000000000';
const SENSTICK2_GYROSCOPE_REALTIME_DATA_CHAR        = 'f000720104514000b000000000000000';
const SENSTICK2_GYROSCOPE_TARGET_LOGID_CHAR         = 'f000730104514000b000000000000000';
const SENSTICK2_GYROSCOPE_LOGMETADATA_CHAR          = 'f000740104514000b000000000000000';
const SENSTICK2_GYROSCOPE_LOGDATA_CHAR              = 'f000750104514000b000000000000000';

/**
 * SenStick2GyroscopeSensorServiceは，角速度センサのセンシング及びロギングの動作指定，リアルタイムのセンサデータ読み出し，及びログデータの
 * 読み出し機能を提供する.
 * @mixin
 */
function SenStick2GyroscopeSensorService()
{
}

/**
 * 角速度センサの計測動作を取得する
 * @param {SensorConfigCallback}    callback        - コールバック関数
**/
SenStick2GyroscopeSensorService.prototype.readGyroscopeMeasurementConfig = function(callback)
{
    this.readMeasurementConfig(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 角速度センサの計測動作を取得した際に呼び出されるコールバック関数．
 * @callback readGyroscopeMeasurementConfigCallback
 * @param {?string}                         error - エラー内容．エラーが無ければnull．
 * @param {SensorOperationMode|undefined}   operation_mode - 動作モード．
 * @param {number|undefined}                sampling_period - ミリ秒単位のサンプル周期．
 * @param {number|undefined}                measurement_range - 角速度センサの測定レンジ．
 */

/**
 * 角速度センサの計測動作を設定する
 * @param {SensorOperationMode}             operation_mode      - 動作モード．
 * @param {number}                          sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number}                          measurement_range   - 角速度センサの測定レンジ．
 * @param {callback}                        callback            - コールバック関数．
**/
SenStick2GyroscopeSensorService.prototype.writeGyroscopeMeasurementConfig = function(operation_mode, sampling_period, measurement_range, callback)
{
    this.writeMeasurementConfig(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_MEASUREMENT_CONFIG_CHAR,
        operation_mode,
        sampling_period,
        measurement_range,
        callback
    );
};

/**
 * 角速度センサを有効にする
 * @param {boolean}     logging_flag        - ロギングの有効・無効を表すフラグ．
 * @param {callback}    callback            - コールバック関数．
*/
SenStick2GyroscopeSensorService.prototype.enableGyroscope= function(logging_flag, callback)
{
    this.enableSensor(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_MEASUREMENT_CONFIG_CHAR,
        logging_flag,
        callback
        );
};

/**
 * 角速度センサを無効にする
 * @param {callback}    callback        - コールバック関数．
*/
SenStick2GyroscopeSensorService.prototype.disableGyroscope = function(callback)
{
    this.disableSensor(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 角速度センサのサンプル周期を設定する
 * @param {number}      sampling_period - ミリ秒単位のサンプル周期．
 * @param {callback}    callback        - コールバック関数．
 */
SenStick2GyroscopeSensorService.prototype.writeGyroscopeSamplingPeriod = function(sampling_period, callback)
{
    this.writeSensorSamplingPeriod(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_MEASUREMENT_CONFIG_CHAR,
        sampling_period,
        callback
    );
};

/**
 * 角速度センサのnotificationの受信要求を設定する．
 * @param {callback}    callback    - コールバック関数．
 */
SenStick2GyroscopeSensorService.prototype.notifyGyroscope = function(callback)
{
    this.onGyroscopeChangeBinded = this.onGyroscopeChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_REALTIME_DATA_CHAR,
        true,
        this.onGyroscopeChangeBinded,
        callback
    );
};

/**
 * 角速度センサのnotificationの受信要求を解除する．
 * @param {callback}    callback    - コールバック関数．
 */
SenStick2GyroscopeSensorService.prototype.unnotifyGyroscope = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_REALTIME_DATA_CHAR,
        false,
        this.onGyroscopeChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた角速度センサデータをリスナに送る．
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}      data    - 受信したデータ．
 * @fires SenStick2GyroscopeSensorService#gyroscopeChange
 * @private
 */
SenStick2GyroscopeSensorService.prototype.onGyroscopeChange = function(data)
{
    this.convertGyroscope(
        data,
        function(x, y, z)
        {
            /**
             * gyroscopeChange イベント
             * @event SenStick2GyroscopeSensorService#gyroscopeChange
             * @param {number} x - X軸周りの角速度．
             * @param {number} y - Y軸周りの角速度．
             * @param {number} z - Z軸周りの角速度．
             */
            this.emit('gyroscopeChange', x, y, z);
        }.bind(this)
    );
};

/**
 * SenStickから送られてきたデータを角速度データに変換する．
 * @param {Buffer}  data        - 変換元のデータ．
 * @param {convertGyroscopeCallback} callback - コールバック関数．
 */
SenStick2GyroscopeSensorService.prototype.convertGyroscope = function(data, callback)
{
    var x = data.readInt16LE(0);
    var y = data.readInt16LE(2);
    var z = data.readInt16LE(4);
    callback(x, y, z);
};

/**
 * SenStickから送られてきたデータを角速度データに変換した際に呼び出されるコールバック関数．
 * @callback convertGyroscopeCallback
 * @param {number}  x - X軸周りの角速度．
 * @param {number}  y - Y軸回りの角速度．
 * @param {number}  z - Z軸回りの角速度．
 */

/**
 * 角速度センサの読み出し対象のログIDを指定する．
 * @param {number}      target_log_id   - 読み出し対象のログID．
 * @param {number}      start_position  - 読み出し開始位置をサンプル数単位で指定する．
 * @param {callback}    callback        - コールバック関数．
 */
SenStick2GyroscopeSensorService.prototype.writeGyroscopeLogReadoutTargetID = function(target_log_id, start_position, callback)
{
    this.writeSensorLogReadoutTargetID(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_TARGET_LOGID_CHAR,
        target_log_id,
        start_position,
        callback
    );
};

/**
 * 角速度センサのログメタデータを取得する．
 * <b>このメソッドを呼び出す前に，writeGyroscopeLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．</b>
 * <b>SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              ようにしている場合，ログデータが必要なければnotificationを無視すること．</b>
 * @param {readGyroscopeLogMetaDataCallback}    callback    - コールバック関数
 */
SenStick2GyroscopeSensorService.prototype.readGyroscopeLogMetaData = function(callback)
{
    this.readSensorLogMetaData(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_LOGMETADATA_CHAR,
        callback
    );
};

/**
 * 角速度センサのログメタデータを取得した際に呼び出されるコールバック関数．
 * @callback readGyroscopeLogMetaDataCallback
 * @param {?string}             error               - エラー内容．エラーが無ければnull．
 * @param {number|undefined}    target_log_id       - 読み出し対象のログID．
 * @param {number|undefined}    sampling_period     - このログのミリ秒単位のサンプリング周期．
 * @param {number|undefined}    measurement_range   - このログの測定レンジ．
 * @param {number|undefined}    number_of_samples   - このログに含まれるセンサデータの数．number_of_samplesはサンプル数単位で表される．
 * @param {number|undefined}    reading_position    - このログの現在の読み出し位置．reading_positionはサンプル数単位で表される．
 * @param {number|undefined}    remaining_storage   - 角速度センササービスのストレージの残量．remaining_storageはサンプル数単位で表される．
 */

/**
 * 角速度センサのログデータのnotificationの受信要求を設定する．
 * @param {callback}    callback    - コールバック関数
 */
SenStick2GyroscopeSensorService.prototype.notifyGyroscopeLogData = function(callback)
{
    this.onGyroscopeLogDataChangeBinded = this.onGyroscopeLogDataChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_LOGDATA_CHAR,
        true,
        this.onGyroscopeLogDataChangeBinded,
        callback
    );
};

/**
 * 角速度センサのログデータのnotificationの受信要求を解除する．
 * @param {callback}    callback    - コールバック関数
 */
SenStick2GyroscopeSensorService.prototype.unnotifyGyroscopeLogData = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_GYROSCOPE_SENSOR_SERVICE_UUID,
        SENSTICK2_GYROSCOPE_LOGDATA_CHAR,
        false,
        this.onGyroscopeLogDataChangeBinded,
        callback
    );
};


/**
 * notificationで送られてきた角速度センサログデータをリスナに送る．
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}      data    - 受信したデータ．
 * @fires SenStick2GyroscopeSensorService#gyroscopeLogDataReceived
 * @private
 */
SenStick2GyroscopeSensorService.prototype.onGyroscopeLogDataChange = function(data)
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
     * @event SenStick2GyroscopeSensorService#gyroscopeLogDataReceived
     * @param {number}      number_of_data  - sensor_dataの要素数．
     * @param {number[][]}  sensor_data     - ログデータ．各要素の先頭から順にX軸周りの角速度，Y軸周りの角速度，Z軸周りの角速度を表す．
     */
    this.emit('gyroscopeLogDataReceived', number_of_data, sensor_data);
};

/**
 * 角速度センサの測定レンジに対応する換算値を取得する．
 * 角速度センサから取得した数値を物理値に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param {number}  range   - 測定レンジの値．
 * @returns {?number}   換算値．nullの場合は，対応する換算値は存在しないことを示す．
 */
SenStick2GyroscopeSensorService.prototype.getGyroscopeConversionValue = function(range)
{
    switch(range)
    {
    case 0: return 131;
    case 1: return 65.5;
    case 2: return 32.8;
    case 3: return 16.4;
    }
    return null;
};

module.exports = SenStick2GyroscopeSensorService;
