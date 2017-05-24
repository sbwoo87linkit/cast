'use strict';

var angular = require('angular');
var _ = require('lodash');
var moment = require('moment');

draggable.$inject = ['$rootScope', '$document'];
/**
 * https://codepen.io/aorian/pen/hDvAe/?editors=1111
 * @param $rootScope
 * @param $document
 * @returns {{restrict: string, scope: {drop: string, bin: string}, link: link}}
 */

function draggable($rootScope, $document) {


    function link(scope, element, attr) {
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function(e) {
                this.classList.remove('drag');
                return false;
            },
            false
        );
    }

    return {
        restrict: 'A',
        link: link
    };
}

module.exports = draggable;

