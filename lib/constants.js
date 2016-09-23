/**
 * @fileOverview 定数を宣言するファイルです．
 * @author Masashi Fujiwara
 */
'use strict';

/**
 * SenStickの動作状態を示す定数
 * @readonly
 * @enum {number}
 */
const ControlStatus = {
    /** センシングおよびロギング停止 */
    STOP_LOGGING_AND_SENSING : 0x00,
    /** センシングおよびロギング動作 */
    RUN_LOGING_AND_SENSING : 0x01,
    /** ストレージフォーマット */
    FORMAT_STORAGE : 0x10,
    /** ディープスリープモード */
    DEEP_SLEEP : 0x20,
    /** DFUモード */
    DFU_MODE : 0x40
};

module.exports = {ControlStatus:ControlStatus};
