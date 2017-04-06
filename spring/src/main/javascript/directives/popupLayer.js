'use strict';
/**
*
*/
var angular = require('angular');
/**
*
*/
popupLayer.$inject = ['$rootScope', '$document', '$window', '$timeout', 'popupLayerStore'];
function popupLayer($rootScope, $document, $window, $timeout, popupLayerStore) {
    /**
    *   functions
    */
    var getScrollbarWidth = function () {
        var parent, child, width;

        if (width === undefined) {
            parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
            child = parent.children();
            width = child.innerWidth() - child.height(99).innerWidth();
            parent.remove();
        }

        return width;
    };
    var getRawNode = function (el) {
        return el.nodeName ? el : el[0] || el;
    };
    var getRect = function(el) {
        el = getRawNode(el);

        var elBCR = el.getBoundingClientRect();

        return {
            width: Math.round(angular.isNumber(elBCR.width) ? elBCR.width : el.offsetWidth),
            height: Math.round(angular.isNumber(elBCR.height) ? elBCR.height : el.offsetHeight),
            top: Math.round(elBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)),
            left: Math.round(elBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft))
        };
    };
    var getPlacement = function (el) {
        var placements = [
            'top',
            'top-left',
            'top-right',
            'bottom',
            'bottom-left',
            'bottom-right',
            'left',
            'left-top',
            'left-bottom',
            'right',
            'right-top',
            'right-bottom'
        ];

        for (var i = 0; i < placements.length; i++) {
            if (el.hasClass(placements[i])) {
                return placements[i];
            }
        }
        return '';
    };
    var calcOffset = function (el, rect, placement) {
        var width = el.outerWidth();
        var height = el.outerHeight();

        var left = 0;
        var top = 0;

        var sp = placement.split('-');
        var placement_f = sp[0];
        var placement_l = sp[1];

        switch (placement_f) {
            case 'left':
                left = rect.left - width;
                break;
            case 'right':
                left = rect.left + rect.width;
                break;
            case 'top':
                top = rect.top - height;
                break;
            case 'bottom':
                top = rect.top + rect.height;
                break;
        }

        if (placement_f === 'left' || placement_f === 'right') {
            switch (placement_l) {
                case 'top':
                    top = rect.top;
                    break;
                case 'bottom':
                    top = rect.top + rect.height - height;
                    break;
                default:
                    top = rect.top + (rect.height / 2) - (height / 2);
                    break;
            }
        }
        else if (placement_f === 'top' || placement_f === 'bottom') {
            switch (placement_l) {
                case 'left':
                    left = rect.left;
                    break;
                case 'right':
                    left = rect.left + rect.width - width;
                    break;
                default:
                    left = rect.left + (rect.width / 2) - (width / 2);
                    break;
            }
        }

        var scrollbarWidth = getScrollbarWidth();
        var screenWidth = $($window).width();
        var screenHeight = $($window).height();
        var docScrollLeft = $document.scrollLeft();
        var docScrollTop = $document.scrollTop();
        var maxLeft = screenWidth - width - scrollbarWidth;
        var maxTop = screenHeight - height;

        return {
            left: Math.max(docScrollLeft, Math.min(left, maxLeft)),
            top: Math.max(docScrollTop, Math.min(top, maxTop))
        };
    };
    /**
    *   directive link
    */
    function link(scope, element, attrs, ctrl) {
        var key = scope.$eval(attrs.popupLayer) || attrs.popupLayer;

        // ...
        var docClickListener = function (evt) {
            if (!ctrl.isAutoClose) {
                return;
            }

            // NOTE: 임시방편. 레이어 바깥의 캘린더를 클릭했을 때도 닫히지 않는다.
            // is calender (from datepicker)
            var $clicked = $(document.elementFromPoint(evt.pageX, evt.pageY));
            if ($clicked.closest('.ui-datepicker.ui-widget').length) {
                return;
            }
            // is outer area
            var $target = angular.element(evt.target);
            if (!$target.closest(element).length) {
                scope.$apply(function () {
                    ctrl.closeEl();
                });
            }
        };

        // init
        ctrl.$body = $('.mu-container > section');
        ctrl.$element.appendTo(ctrl.$body).hide();

        // add & overwrite (not override)
        ctrl.isAutoClose = true;
        ctrl.openEl = function () {

            var $body = this.$body;
            if (!$body.is('body')) {
                // NOTE: position: absolute가 적용되려면 parent가 relative여야 한다.
                $body.css('position', 'relative');
            }

            // close all other layer (ignore this layer)
            popupLayerStore.callAll('closeEl', key);

            // open 동작은 위치 설정 이후에 해야한다.
            var _this = this;
            $timeout(function () {
                var $el = _this.$element;
                var $arrow = $el.find('.arrow').eq(0);
                var $inner = $el.find('.mu-tooltip-inner').eq(0);

                $el.show();
                $inner.scrollTop(0).scrollLeft(0);

                // arrow 위치를 현재 위치로 고정 (50% -> ...)
                var arrowPos = $arrow.position(); // relative pos

                var sp = _this._placement.split('-');
                var placement_f = sp[0];

                switch (placement_f) {
                    case 'top':
                    case 'bottom':
                        $arrow.css('left', arrowPos.left);
                        break;
                    case 'left':
                    case 'right':
                        $arrow.css('top', arrowPos.top);
                        break;
                }

                $document.on('click', docClickListener);

                // $rootScope.$broadcast('popupLayer.opened.' + key);
            });

            return this;
        };
        ctrl.closeEl = function () {
            $document.off('click', docClickListener);

            var $el = this.$element;
            var $arrow = $el.find('.arrow');

            $el.hide();
            // arrow 위치 고정 해제 (... -> 50%)
            $arrow.css({ 'left': '', 'top': '' });

            $rootScope.$broadcast('popupLayer.closed.' + key);

            return this;
        };
        // append new method
        ctrl.placeEl = function (target, customPlacement, customOffset) {
            var $el = this.$element;
            var $body = this.$body;
            var $arrow = $el.find('.arrow');
            var placement = customPlacement || getPlacement($el);

            this.$target = target;
            this._placement = placement;

            // 크기 및 위치 계산은 rendering 이후에 해야한다.
            $timeout(function () {
                var rect = getRect(target);
                var offset = calcOffset($el, rect, placement);

                if (customOffset) {
                    offset.left += (customOffset.left || 0);
                    offset.top += (customOffset.top || 0);
                }

                if (!$body.is('body')) {
                    var bodyOffset = getRect($body);

                    offset.left -= (bodyOffset.left);
                    offset.top -= (bodyOffset.top);
                }

                if (customPlacement) {
                    $el
                        // set arrow placement
                        .removeClass([
                            'top',
                            'top-left',
                            'top-right',
                            'bottom',
                            'bottom-left',
                            'bottom-right',
                            'left',
                            'left-top',
                            'left-bottom',
                            'right',
                            'right-top',
                            'right-bottom'
                        ].join(' '))
                        .addClass(placement);
                }

                $el.css(offset);
                $arrow.css({ 'left': '', 'top': '' });
            });

            return this;
        };
        ctrl.isOpened = function () {
            return (this.$element.is(':visible'));
        };

        // register
        popupLayerStore.append(key, ctrl);
    }

    return {
        restrict: 'A',
        scope: false,
        controller: 'muPopupCtrl',
        link: link
    };
}
/**
*
*/
popupLayerArea.$inject = ['popupLayerStore'];
function popupLayerArea(popupLayerStore) {
    function link (scope, element, attrs) {
        var key = scope.$eval(attrs.popupLayerArea) || attrs.popupLayerArea;
        var placement = scope.$eval(attrs.layerPlacement) || attrs.layerPlacement;
        var offset = scope.$eval(attrs.layerOffset) || attrs.layerOffset;

        element.click(function () {
            scope.$apply(function () {
                var layer = popupLayerStore.get(key);

                if (layer.isOpened() && layer.$target.is(element)) {
                    layer.closeEl();
                }
                else {
                    layer.placeEl(element, placement, offset).openEl();

                    scope.$eval(attrs.layerOpen, {});
                }
            });
        });

        scope.$on('popupLayer.closed.' + key, function () {
            scope.$eval(attrs.layerClose, {});
        });
    }

    return {
        restrict: 'A',
        scope: false,
        link: link
    };
}
/**
*
*/
popupLayerStore.$inject = [];
function popupLayerStore() {
    var controllers = {};

    this.append = function (key, ctrl) {
        controllers[key] = ctrl;
    };
    this.get = function (key) {
        return controllers[key];
    };

    this.callAll = function (methodName, ignore) {
        _.each(controllers, function (ctrl, name) {
            if (name === ignore) {
                return;
            }

            if (ctrl[methodName]) {
                ctrl[methodName]();
            }
        });
    };
}
/**
*   exports
*/
module.exports = {
    popupLayer: popupLayer,
    popupLayerArea: popupLayerArea,
    popupLayerStore: popupLayerStore
};
