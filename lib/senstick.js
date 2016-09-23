const SenStick2 = require('./senstick2/senstick2');
const SenStickConstants = require('./constants');

/**
 * SenStickは，SenStick本体と通信を行い各種センサから測定値を取得したり，ログデータを取得するための
 * 機能などを有します．
 * @mixin
**/
var SenStick = function()
{
};

/**
 * SenStickデバイスを探索する．
 * デバイスが見つかるごとに，onDiscoverが呼ばれる．
 * @param {function(SenStick)} onDiscover - コールバック関数．
**/
SenStick.discoverAll = function(onDiscover)
{
    SenStick2.discoverAll(onDiscover);
};

/**
 * SenStickデバイスの探索を停止する
 * @param {function(SenStick)} onDiscover - コールバック関数．
**/
SenStick.stopDiscoverAll = function(onDiscover)
{
    SenStick2.stopDiscoverAll(onDiscover);
};

/**
 * SenStickデバイスを探索する．
 * 最初にSenStickデバイスを見つけた際に一度だけonDiscoverが呼ばれ，以降の探索を停止する．
 * @param {function(SenStick)} onDiscover - コールバック関数．
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

module.exports = SenStick;
