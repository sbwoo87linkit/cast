'use strict';
/**
*
*/
// var angular = require('angular');
/**
*
*/
commonNotice.$inject = ['$timeout', '$rootScope'];
function commonNotice ($timeout, $rootScope) {
    return {
        restrict: 'A',
        // template: '',
        // scope: {},
        link: function (scope, element) {
            var ALERT_SHOW_DURATION = 2000;

            var _queue = [];

            var _enqueue = function (type, message) {
                _queue.push({type: type, message: message});
                if (_queue.length === 1) {
                    _showNotice();
                }
            };
            var _dequeue = function () {
                _queue.shift();
                if (_queue.length) {
                    _showNotice();
                }
            };
            var _showNotice = function () {
                // if (!_queue.length) {
                //     return;
                // }
                var item = _queue[0];

                $timeout(function () {
                    scope.type = item.type;
                    scope.message = item.message;
                    scope.isShowNotice = true;
                });

                $timeout(function () {
                    scope.isShowNotice = false;
                    _dequeue();
                }, ALERT_SHOW_DURATION);
            };
            /**
            *   init
            */
            element.removeClass('hide');
            /**
            *   method
            */
            // this.info = function (message) {
            //     _enqueue('info', message);
            // };
            // this.warning = function (message) {
            //     _enqueue('warning', message);
            // };
            // this.error = function (message) {
            //     _enqueue('error', message);
            // };
            $rootScope.$on('CommonNotice', function (e, type, message) {
                _enqueue(type, message);
            });
        }
    };
}
/**
*
*/
CommonNotice.$inject = ['$rootScope', '$timeout'];
function CommonNotice ($rootScope, $timeout) {
    this.popup = function (type, message) {
        $timeout(function () {
            $rootScope.$emit('CommonNotice', type, message);
        });
    };
    this.success = function (message) {
        this.popup('success', message);
    };
    this.fail = function (message) {
        this.popup('fail', message);
    };
}

module.exports = {
    commonNotice: commonNotice,
    CommonNotice: CommonNotice
};
