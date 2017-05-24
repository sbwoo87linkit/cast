'use strict';

var angular = require('angular');
var _ = require('lodash');
var moment = require('moment');

droppable.$inject = ['$rootScope', '$document'];

/**
 * https://codepen.io/aorian/pen/hDvAe/?editors=1111
 * @param $rootScope
 * @param $document
 * @returns {{restrict: string, scope: {drop: string, bin: string}, link: link}}
 */

function droppable($rootScope, $document) {


    function link(scope, element, attr) {
        // again we need the native object
        var el = element[0];

        el.addEventListener(
            'dragover',
            function(e) {
                e.dataTransfer.dropEffect = 'move';
                // allows us to drop
                if (e.preventDefault) e.preventDefault();
                this.classList.add('over');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragenter',
            function(e) {
                this.classList.add('over');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragleave',
            function(e) {
                this.classList.remove('over');
                return false;
            },
            false
        );

        el.addEventListener(
            'drop',
            function(e) {
                // Stops some browsers from redirecting.
                if (e.stopPropagation) e.stopPropagation();

                this.classList.remove('over');

                var binId = this.id;
                var item = document.getElementById(e.dataTransfer.getData('Text')).cloneNode(true);
                item.classList.remove('drag');

                // 기존 Drag 된 아이템을 삭제
                $(this).empty();
                this.appendChild(item);
                // call the passed drop function
                scope.$apply(function(scope) {
                    var fn = scope.drop();
                    if ('undefined' !== typeof fn) {
                        fn(item.id, binId);
                    }
                });

                return false;
            },
            false
        );
    }

    return {
        restrict: 'A',
        scope: {
            drop: '&',
            bin: '='
        },
        link: link
    };
}

module.exports = droppable;
