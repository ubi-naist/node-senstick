'use strict';

const SENSTICK2_CONTROL_SERVICE_UUID                  = 'f000200004514000b000000000000000';
const SENSTICK2_CONTROL_STATUS_CONTROL_CHAR           = 'f000700004514000b000000000000000';
const SENSTICK2_CONTROL_ACTIVE_LOG_NUM_CHAR           = 'f000700104514000b000000000000000';
const SENSTICK2_CONTROL_INTERNAL_STRAGE_STATE_CHAR    = 'f000700204514000b000000000000000';
const SENSTICK2_CONTROL_DATETIME_CHAR                 = 'f000700304514000b000000000000000';
const SENSTICK2_CONTROL_LOG_ABSTRACT_TEXT_CHAR        = 'f000700404514000b000000000000000';
const SENSTICK2_CONTROL_DEVICE_NAME_CHAR              = 'f000700504514000b000000000000000';

/**
 * SenStick2ControlServiceはセンシングやロギングの開始や停止といった動作指示を提供します．
 * @mixin
**/
function SenStick2ControlService()
{
}

/**
 * SenStick本体の動作状態を取得する．
 * @param {readControlStatusCallback} callback - コールバック関数．
 */
SenStick2ControlService.prototype.readControlStatus = function(callback)
{
    this.readUInt8Characteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_STATUS_CONTROL_CHAR,
        callback
    );
};

/**
 * SenStickの動作状況を取得した後に呼び出される．
 * @callback readControlStatusCallback
 * @param {?string}                     error  - エラー内容．エラーが無ければnull．
 * @param {ControlStatus}               status - 動作状態．
 */

/**
 * SenStickのセンシング及びロギングを開始する．
 * @param {callback}     callback - コールバック関数．
 */
SenStick2ControlService.prototype.startSensingAndLogging = function(callback)
{
    this.writeUInt8Characteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_STATUS_CONTROL_CHAR,
        0x01,
        callback
    );
};

/**
 * SenStickのセンシング及びロギングを停止する．
 * @param {callback}     callback - コールバック関数．
 */
SenStick2ControlService.prototype.stopSensingAndLogging = function(callback)
{
    this.writeUInt8Characteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_STATUS_CONTROL_CHAR,
        0x00,
        callback
    );
};

/**
 * SenStickの内部ストレージをフォーマットする．
 * @param {callback}     callback - コールバック関数．
 */
SenStick2ControlService.prototype.formatInternalStorage = function(callback)
{
    this.writeUInt8Characteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_STATUS_CONTROL_CHAR,
        0x10,
        callback
    );
};

/**
 * SenStick本体をディープスリープモードに移行させる．
 * @param {callback}     callback - コールバック関数．
 */
SenStick2ControlService.prototype.deepSleep = function(callback)
{
    this.writeUInt8Characteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_STATUS_CONTROL_CHAR,
        0x20,
        callback
    );
};

/**
 * 有効ログ数を取得する．
 * @param {readActiveLogNumCallback}    callback - コールバック関数．
 */
SenStick2ControlService.prototype.readActiveLogNum = function(callback)
{
    this.readUInt8Characteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_ACTIVE_LOG_NUM_CHAR,
        callback
    );
};

/**
 * 有効ログ数を取得した際に呼び出されるコールバック関数．
 * @callback readActiveLogNumCallback
 * @param {?string}             error           - エラー内容．エラーが無ければnull．
 * @param {number}              active_log_num  - 有効ログ数．
 */

/**
 * 有効ログ数のnotificationの受信要求を設定する．
 * @param {callback}            callback        - コールバック関数．
 */
SenStick2ControlService.prototype.notifyActiveLogNum = function(callback)
{
    this.onActiveLogNumChangeBinded = this.onActiveLogNumChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_ACTIVE_LOG_NUM_CHAR,
        true,
        this.onActiveLogNumChangeBinded,
        callback
    );
};

/**
 * 有効ログ数のnotificationの受信要求を解除する．
 * @param {callbacl}            callback        - コールバック関数．
 */
SenStick2ControlService.prototype.unnotifyActiveLogNum = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_ACTIVE_LOG_NUM_CHAR,
        false,
        this.onPressureLogDataChangeBinded,
        callback
    );
};


/**
 * notificationで送られてきた有効ログ数をリスナに送る．
 * @note notificationを受信した際に自動的に呼び出される．
 * @param {number}       data - 受信したデータ．
 * @fires SenStick2ControlService#activeLogNumChange
 * @private
 */
SenStick2ControlService.prototype.onActiveLogNumChange = function(data)
{
    var log_num = data.readUInt8(0);
    /**
     * activeLogNumChange イベント
     * @event SenStick2ControlService#activeLogNumChange
     * @param {number} log_num - 有効ログ数．
     */
    this.emit('activeLogNumChange', log_num);
};

/**
 * 内部ストレージのステート情報を取得する．
 * @param {readInternalStorageStateCallback}    callback    - コールバック関数．
 */
SenStick2ControlService.prototype.readInternalStorageState = function(callback)
{
    this.readUInt8Characteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_INTERNAL_STRAGE_STATE_CHAR,
        callback
    );
};

/**
 * 内部ストレージのステート情報を取得した際に呼び出されるコールバック関数．
 * @callback readInternalStorageStateCallback
 * @param {?string}             error - エラー内容．エラーが無ければnull．
 * @param {number}              storage_error_code - 内部ストレージの動作状態．
 * @see InternalStorageErrorCode
 */

/// TODO: notificationの実装

/**
 * SenStick本体の内蔵カレンダーの日付時刻情報を取得する．
 * @param {readInternalDatetimeCallback}    callback - コールバック関数．
 */
SenStick2ControlService.prototype.readInternalDatetime = function(callback)
{
    this.readDataCharacteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_DATETIME_CHAR,
        function(error, data)
        {
            if(error)
            {
                return callback(error);
            }
            this.convertSenstickDatetime(
                data,
                function(year, month, day, hour, minute, second)
                {
                    callback(null, [year, month, day, hour, minute, second]);
                }
            );
        }.bind(this)
    );
};

/**
 * SenStick本体の内蔵カレンダーの日付時刻情報を取得した後に呼び出されるコールバック関数．
 * @callback readInternalDatetimeCallback
 * @param {string|null}     error               - エラー内容．エラーが無ければnull．
 * @param {number[]}        datetime            - SenStick本体の内蔵カレンダーの日付時刻情報．
 * | Index | Description |
 * | :---- | :---------- |
 * |     0 | 年．0はunknownを示す．|
 * |     1 | 月(0から12)．0はunknownを示す．|
 * |     2 | 日(0から<I>month</I>の日数)．0はunknownを示す．|
 * |     3 | 時(0から23)．|
 * |     4 | 分(0から59)．|
 * |     5 | 秒(0から59)．|
 */

/**
 * SenStick本体の内蔵カレンダーの日付時刻情報を設定する
 * @param {number}  year        - 年．0はunknownを示す．
 * @param {number}  month       - 月(0から12)．0はunknownを示す．
 * @param {number}  day         - 日(0から<I>month</I>の日数)．0はunknownを示す．
 * @param {number}  hour        - 時(0から23)
 * @param {number}  minute      - 分(0から59)
 * @param {number}  second      - 秒(0から59)
 * @param {number}  callback    - コールバック関数
 */
SenStick2ControlService.prototype.writeInternalDatetime = function(year, month, day, hour, minute, second, callback)
{
    var err_fmt = this.checkSenstickDatetimeFormat(year, month, day, hour, minute, second);
    if(err_fmt)
    {
        callback(err_fmt);
        return;
    }
    var buf = new Buffer(7);
    buf.writeUInt16LE(year, 0);
    buf.writeUInt8(month, 2);
    buf.writeUInt8(day, 3);
    buf.writeUInt8(hour, 4);
    buf.writeUInt8(minute, 5);
    buf.writeUInt8(second, 6);
    this.writeDataCharacteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_DATETIME_CHAR,
        buf,
        callback
    );
};

/**
 *
 * @param       data
 * @param       callback        コールバック関数
 *              callbackはfunction(year, month, day, hour, minute, second)の形
**/
SenStick2ControlService.prototype.convertSenstickDatetime = function(data, callback)
{
    var year = data.readUInt16LE(0);
    var month = data.readUInt8(2);
    var day = data.readUInt8(3);
    var hour = data.readUInt8(4);
    var minute = data.readUInt8(5);
    var second = data.readUInt8(6);
    callback(year, month, day, hour, minute, second);
};

/**
 * SenStick本体の内蔵カレンダーの日付時刻情報のフォーマットをチェックする
 * @param[in]       year        年(0 <= year)
 * @param[in]       month       月(0 <= month <= 12)
 * @param[in]       day         日(0 <= day <= 31)
 * @param[in]       hour        時(0 <= hour <= 23)
 * @param[in]       minute      分(0 <= minute <= 59)
 * @param[in]       second      秒(0 <= second <= 59)
 * @retval          null        フォーマットにエラーはない
 * @retval          その他       フォーマットエラー
 * @private
 */
SenStick2ControlService.prototype.checkSenstickDatetimeFormat = function(year, month, day, hour, minute, second)
{
    if(!isFinite(year) || year < 0)                     return 'invalid year format';
    if(!isFinite(month) || month < 0 || month > 12)     return 'invalid month format';
    if(!isFinite(day) || day < 0 || day > 31)           return 'invalid day format';
    if(!isFinite(hour) || hour < 0 || hour > 23)        return 'invalid hour format';
    if(!isFinite(minute) || minute < 0 || minute > 59)  return 'invalid minute format';
    if(!isFinite(second) || second < 0 || second > 59)  return 'invalid second format';
    return null;
};

/**
 * ログ開始時に内部ストレージにメタ情報として書き込まれる概要テキストを取得する
 * @param       callback        コールバック関数
 *              callback関数はfunction(error, abstract_text)の形を取る．
 */
SenStick2ControlService.prototype.readLogAbstractText = function(callback)
{
    this.readStringCharacteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_LOG_ABSTRACT_TEXT_CHAR,
        callback
    );
};

/**
 * ログ開始時に内部ストレージにメタ情報として書き込まれる概要テキストを設定する
 * @param       abstract_text   設定する概要テキスト
 * @param       callback        コールバック関数
 *              callback関数はfunction(error)の形を取る．
 */
SenStick2ControlService.prototype.writeLogAbstractText = function(abstract_text, callback)
{
    this.writeStringCharacteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_LOG_ABSTRACT_TEXT_CHAR,
        abstract_text,
        callback
    );
};

/**
 * デバイス名を取得する
 * @param       callback        コールバック関数
 *              callback関数はfunction(error, device_name)の形を取る．
 */
SenStick2ControlService.prototype.readSenStickDeviceName = function(callback)
{
    this.readStringCharacteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_DEVICE_NAME_CHAR,
        callback
    );
};

/**
 * デバイス名を設定する
 * @param       device_name     設定するデバイス名
 * @param       callback        コールバック関数
 *              callback関数はfunction(error)の形を取る．
 */
SenStick2ControlService.prototype.writeSenStickDeviceName = function(device_name, callback)
{
    this.writeStringCharacteristic(
        SENSTICK2_CONTROL_SERVICE_UUID,
        SENSTICK2_CONTROL_DEVICE_NAME_CHAR,
        device_name,
        callback
    );
};

module.exports = SenStick2ControlService;
