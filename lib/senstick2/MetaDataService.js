'use strict';

// Metadata読み出しサービス
var SENSTICK2_METADATA_SERVICE_UUID             = 'f000200104514000b000000000000000';
var SENSTICK2_METADATA_LOGID_CHAR               = 'f000701004514000b000000000000000';
var SENSTICK2_METADATA_LOGGINGSTARTEDTIME_CHAR  = 'f000701104514000b000000000000000';
var SENSTICK2_METADATA_ABSTRACTTEXT_CHAR        = 'f000701204514000b000000000000000';

/**
 * メタデータ読み出しサービス
 * SenStick2MetaDataReadoutServiceはログのメタ情報の読み出し機能を提供する．
 * @mixin
**/
function SenStick2MetaDataReadoutService() {}

/**
 * 読み出し対象のログIDを取得する．
 * @param {readTargetLogIdCallback} callback    - コールバック関数
**/
SenStick2MetaDataReadoutService.prototype.readTargetLogId = function(callback)
{
    this.readUInt8Characteristic(
        SENSTICK2_METADATA_SERVICE_UUID,
        SENSTICK2_METADATA_LOGID_CHAR,
        callback
    );
};

/**
 * 読み出し対象のログIDを取得した際に呼び出されるコールバック関数．
 * @callback readTargetLogIdCallback
 * @param {?string}             error   - エラー内容．エラーがなければnull．
 * @param {number|undefined}    logid   - 読み出し対象のログID．
 */

/**
 * 読み出し対象のログIDを設定する．
 * @param {number}              log_id      - ログID．
 * @param {callback}            callback    - コールバック関数．
**/
SenStick2MetaDataReadoutService.prototype.writeTargetLogId = function(log_id, callback)
{
    this.writeUInt8Characteristic(
        SENSTICK2_METADATA_SERVICE_UUID,
        SENSTICK2_METADATA_LOGID_CHAR,
        log_id,
        callback
    );
};

/**
 * ログ記録開始時間を取得する．
 * @param {readLogLoggingStartedTimeFromTargetLogCallback}  callback    - コールバック関数
**/
SenStick2MetaDataReadoutService.prototype.readLogLoggingStartedTimeFromTargetLog = function(callback)
{
    this.readDataCharacteristic(
        SENSTICK2_METADATA_SERVICE_UUID,
        SENSTICK2_METADATA_LOGGINGSTARTEDTIME_CHAR,
        function(error, data)
        {
            if(error)
            {
                return callback(error);
            }
            this.convertLogLoggingStartedTimeFromTargetLog(
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
 * ログ記録開始時間を取得した際に呼び出されるコールバック関数．
 * @callback readLogLoggingStartedTimeFromTargetLogCallback
 * @param {?string}             error       - エラー内容．エラーがなければnull．
 * @param {number[]|undefined}  datetime    - ログ開始時間．
 * 
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
 * SenStickから送られてきたデータをログ記録開始時間に変換する．
 * @param {Buffer}                                              data        - 変換元のデータ．
 * @param {convertLogLoggingStartedTimeFromTargetLogCallback}   callback    - コールバック関数．
**/
SenStick2MetaDataReadoutService.prototype.convertLogLoggingStartedTimeFromTargetLog = function(data, callback)
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
 * SenStickから送られてきたデータをログ記録開始時間に変換した際に呼び出されるコールバック関数．
 * @callback convertLogLoggingStartedTimeFromTargetLogCallback
 * @param {number}  year        - 年．0はunknownを示す．
 * @param {number}  month       - 月(0から12)．0はunknownを示す．
 * @param {number}  day         - 日(0から<I>month</I>の日数)．0はunknownを示す．
 * @param {number}  hour        - 時(0から23)．
 * @param {number}  minute      - 分(0から59)．
 * @param {number}  second      - 秒(0から59)．
 */

/**
 * 概要テキストを取得する．
 * @param {readLogAbstractTextFromTargetLogCallback}    callback    - コールバック関数．
**/
SenStick2MetaDataReadoutService.prototype.readLogAbstractTextFromTargetLog = function(callback)
{
    this.readStringCharacteristic(
        SENSTICK2_METADATA_SERVICE_UUID,
        SENSTICK2_METADATA_ABSTRACTTEXT_CHAR,
        function(error, data)
        {
            if(error)
            {
                return callback(error);
            }

            callback(null, data);
        }
    );
};

/**
 * ログの概要テキストを取得した際に呼び出されるコールバック関数．
 * @callback readLogAbstractTextFromTargetLogCallback
 * @param {?string}             error           - エラー内容．エラーがなければnull．
 * @param {string|undefined}    abstract_text   - 概要テキスト．
 */

module.exports = SenStick2MetaDataReadoutService;