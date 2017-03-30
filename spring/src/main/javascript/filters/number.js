'use strict';
/**
 *
 */
/**
*   ex1) 12.111111 | autoFixed:2 => 12.11
*   ex2) 12.00 | autoFixed:2 => 12
*/
autoFixed.$inject = [];
function autoFixed() {
    return function(num, x) {
        // not zero & not number
        if (num !== 0 && !num) {
            return num;
        }
        // no input x
        if (!x) {
            return num;
        }

        // var t = Math.pow(10, x);
        // var fixedNum = Math.floor(num * t) / t;
        var fixedNum = +(num.toFixed(x));
        if (fixedNum - Math.floor(fixedNum) === 0) {
            return num;
        }

        return fixedNum;
    };
}
/**
*   exports
*/
module.exports = {
    autoFixed: autoFixed
};
