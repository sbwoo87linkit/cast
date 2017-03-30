'use strict';
/**
*
*/
/**
 *
 */
function irisPopupBox(name) {
    controller.$inject = ['$scope', '$element', '$timeout'];
    function controller($scope, $element, $timeout) {
        /**
        *   locals
        */
        var _queue = [];
        var _fnYes = null;
        var _fnNo = null;
        var $child = $element.children();

        var _enqueue = function (message, fnYes, fnNo, type) {
            _queue.push({
                message: message,
                fnYes: fnYes,
                fnNo: fnNo,
                type: type
            });

            if (_queue.length === 1) {
                openBox();
            }
        };
        var _dequeue = function () {
            _queue.shift();

            if (_queue.length) {
                openBox();
            }
        };
        /**
        *   open/close
        */
        var _show = function () {
            $scope.$root.$broadcast('dialog.open.iris.' + name);
        };
        var _hide = function () {
            $scope.$root.$broadcast('dialog.close.iris.' + name);
        };
        var openBox = function () {
            // if (!_queue.length) {
            //     return;
            // }

            var item = _queue[0];
            var $btnNo = $child.find('.mu-alert-foot > .mu-btn').last();

            $scope.message = (item.message + '').split(/\n/g);
            $scope.type = item.type;

            $timeout(function () {
                _fnYes = item.fnYes;
                _fnNo = item.fnNo;

                _show();

                $btnNo.focus();
            });
        };
        var closeBox = function (bool, value) {
            if (bool) {
                if (_fnYes) {
                    _fnYes(value);
                    _fnYes = null;
                }
            } else {
                if (_fnNo) {
                    _fnNo(value);
                    _fnNo = null;
                }
            }

            $timeout(function () {
                _hide();
            });

            _dequeue();
        };
        this.open = openBox;
        this.close = closeBox;
        /**
         *   events
         */
        $scope.$root.$on('iris-' + name, function (evt, message, fnYes, fnNo, type) {
            evt.stopPropagation();

            _enqueue(message, fnYes, fnNo, type);
        });
        $scope.$root.$on('$routeChangeStart', function () {
            closeBox();
        });
    }
    function link(scope, element, attrs, ctrl) {
        /**
        *
        */
        scope.close = ctrl.close;
    }

    return {
        restrict: 'E',
        templateUrl: '/views/directives/popup_box/' + name + '.html',
        replace: true,
        scope: {},
        controller: controller,
        link: link
    };
}
/**
 *
 */
function irisAlert () {
    return irisPopupBox('alert');
}
function irisConfirm () {
    return irisPopupBox('confirm');
}
/**
 *
 */
module.exports = {
    irisAlert: irisAlert,
    irisConfirm: irisConfirm
};
