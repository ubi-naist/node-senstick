const SenStick2 = require('./senstick2/senstick2');
const SenStickConstants = require('./constants');

/**
 * SenStick名前空間
 * @namespace
**/
var SenStick = function()
{
};

/**
 * SenStickデバイスを探索する．
 * デバイスが見つかるごとに，onDiscoverが呼ばれる．
 * @param {onDiscover} onDiscover - コールバック関数．
 * @static
**/
SenStick.discoverAll = function(onDiscover)
{
    SenStick2.discoverAll(onDiscover);
};

/**
 * SenStickデバイスの探索を停止する
 * @param {onDiscover} onDiscover - コールバック関数．
 * @static
**/
SenStick.stopDiscoverAll = function(onDiscover)
{
    SenStick2.stopDiscoverAll(onDiscover);
};

/**
 * SenStickデバイスを探索する．
 * 最初にSenStickデバイスを見つけた際に一度だけonDiscoverが呼ばれ，以降の探索を停止する．
 * @param {onDiscover} onDiscover - コールバック関数．
 * @static
**/
SenStick.discover = function(onDiscover)
{
    const callback = function(senstick)
    {
        SenStick.stopDiscoverAll(onDiscover);
        onDiscover(senstick);
    };
    SenStick.discoverAll(callback);
};

SenStick.SenStick2 = SenStick2;

// SenStickに定数を追加する
const constants_ = Object.keys(SenStickConstants);
for(let i = 0, len = constants_.length; i < len; ++i)
{
    SenStick[constants_[i]] = SenStickConstants[constants_[i]];
}

/**
 * SenStickが見つかった際に呼び出されるコールバック関数．
 * @callback onDiscover
 * @param {SenStick2} senstick - 発見されたSenStickのインスタンス
 */
module.exports = SenStick;
