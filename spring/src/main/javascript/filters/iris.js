'use strict';
/**
 *
 */
/**
*
*/
partitionRange.$inject = ['MESSAGE', '$filter'];
function partitionRange(MESSAGE, $filter) {
    var DAY = 86400;
    var HOUR = 3600;
    var MINUTE = 60;

    var autoFixed = $filter('autoFixed');

    return function(num) {
        // partition range는 분단위 (1440 = 1일)
        var sec = num * 60;
        var str = '';

        // partition range: 0인 경우는 보통 GLOBAL 테이블.
        if (!sec) {
            return '';
        }

        if (sec >= DAY) {
            str = autoFixed(sec / DAY, 2) + MESSAGE['days'];
        }
        else if (sec >= HOUR) {
            str = autoFixed(sec / HOUR, 2) + MESSAGE['hours'];
        }
        else /*if (sec >= MINUTE)*/ {
            str = autoFixed(sec / MINUTE, 2) + MESSAGE['minutes'];
        }

        return str;
    };
}

module.exports = {
    partitionRange: partitionRange
};
