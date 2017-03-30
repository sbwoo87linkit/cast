'use strict';
/**
*
*/
/**
 *
 */
popupBox.$inject = ['$timeout', '$compile', '$rootScope'];
function popupBox($timeout, $compile, $rootScope) {
    // append common template
    // var tempScope = $rootScope.$new();
    // $('body').append($compile('<iris-alert></iris-alert>')(tempScope));
    // $('body').append($compile('<iris-confirm></iris-confirm>')(tempScope));
    /**
     *   methods
     */
    this.alert = function (message, fnYes) {
        $timeout(function () {
            $rootScope.$emit('iris-alert', message, fnYes);
        });
    };
    this.success = function (message, fnYes) {
        $timeout(function () {
           $rootScope.$emit('iris-alert', message, fnYes, null, 'success');
        });
    };
    this.error = function (message, fnYes) {
        $timeout(function () {
           $rootScope.$emit('iris-alert', message, fnYes, null, 'error');
        });
    };

    this.confirm = function (message, fnYes, fnNo) {
        $timeout(function () {
            $rootScope.$emit('iris-confirm', message, fnYes, fnNo);
        });
    };
}
/**
 *
 */
 module.exports = popupBox;
