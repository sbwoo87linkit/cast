'use strict';

var angular = require('angular');
var _ = require('lodash');
var moment = require('moment');

timePicker.$inject = ['$rootScope', '$document'];

function timePicker($rootScope, $document) {
    function controller() {
        var DEFAULT_INDEX = 0;
        var DEFAULT_LENGTH = 48;
        var DEFAULT_MIN_GAP = 30;

        var _model = [];

        this.initSelected = function() {
            _.each(_model, function(v) {
                v.isSelected = false;
            });
        };

        this.initSelData = function() {
            _model = [];

            for (var i = DEFAULT_INDEX; i < DEFAULT_LENGTH; i++) {
                var dt = moment('00:00:00', 'HH:mm:ss').add(DEFAULT_MIN_GAP * i, 'minutes');
                var text = dt.format('HH:mm');
                var value = dt.format('HH:mm:ss');

                _model.push({
                    text: text,
                    value: value
                });
            }

            return _model;
        };
    }

    function link(scope, element, attrs, ctrl) {
        /**
         * init
         */
        scope.isShow = false;
        scope.selTimeDatas = ctrl.initSelData();

        /**
         * click event
         */
        scope.selectItem = function(item) {
            scope.timeModel = item.value;
            ctrl.initSelected();
            item.isSelected = true;
        };

        /**
         * click listener
         */
        var openList = function() {
            scope.isShow = true;
            $document.bind('click', onClickDoc);
        };
        var closeList = function() {
            scope.isShow = false;
            $document.unbind('click', onClickDoc);
        };
        var onClickElm = function() {
            if (!scope.isShow) {
                openList();
            } else {
                closeList();
            }

            scope.$apply();
        };
        var onClickDoc = function(event) {
            var target = angular.element(event.target);

            if (target.closest(element).length) {
                return;
            } else {
                closeList();
            }

            scope.$apply();
        };

        element.bind('click', onClickElm);
    }

    return {
        restrict: 'EA',
        templateUrl: '/views/directives/timepicker.html',
        scope: {
            timeModel: '='
        },
        controller: controller,
        link: link
    };
}

module.exports = timePicker;
