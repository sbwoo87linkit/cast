'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
/**
 * Controller
 */

LineplotCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'popupLayerStore', 'dataModel', 'dragularService', '$rootScope'];
function LineplotCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, popupLayerStore, dataModel, dragularService, $rootScope) {

    console.log('lineplotCtrl')


    $scope.dragOptions = {
        start: function(e) {
            console.log("STARTING");
        },
        drag: function(e) {
            console.log("DRAGGING");
        },
        stop: function(e) {
            console.log("STOPPING");
        },
        container: 'container'
    }

}

module.exports = LineplotCtrl;
