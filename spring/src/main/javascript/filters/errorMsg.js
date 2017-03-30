'use strict';
/**
 *  module dependencies
 */
var angular = require('angular');
/**
*   서버의 에러 텍스트를 사용자에게 맞게 변경하는 필터
*/
errorMsg.$inject = ['MESSAGE'];
function errorMsg(MESSAGE) {
    // NOTE: 추후에는 판단 기준이 message -> code가 되어야 한다.
    // err: { code, message }
    return function(err) {
        if (!_.isObject(err)) {
            return err;
        }
        var code = err.code;
        var message = err.message;
        if (!message) {
            return angular.fromJson(err);
        }

        // TODO: code로 판별하도록 추후 수정
        if (message.indexOf('Token does not exist') !== -1) {
            return MESSAGE['err_msg.token_not_exist'];
        }

        if (!code) {
            return message;
        }

        var text = MESSAGE['error.sherman.' + code];
        if (!text) {
            return message;
        }

        return text;
    };
}

module.exports = errorMsg;
