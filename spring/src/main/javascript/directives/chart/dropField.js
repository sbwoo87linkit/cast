'use strict';
/**
*
*/
/**
*
*/
dropField.$inject = ['utility', 'popupLayerStore', 'popupBox'];
function dropField(utility, popupLayerStore, popupBox) {
    /**
    *   directive link
    */
    function link(scope) {

/*
        scope.onDropField = function ($event, $data, fieldOpts, popupLayer, position, type) {

            console.log('scope.showPopup', scope.showPopup);

            if ( type && $data.type != type) {
                popupBox.alert('타입 Type Field만 적용 가능합니다.', function clickedOk() {
                });
                return false;
            }
            // console.log(scope.prevent, $data.name)
            if ( scope.prevent && $data.name === scope.prevent) {
                popupBox.alert(scope.prevent + ' Field는 적용할 수 없습니다.', function clickedOk() {
                });
                return false;
            }
            scope.drops[popupLayer] = _.cloneDeep($data);

            if (position) {
                utility.openPopupLayer(popupLayer, position, angular.element($event.target));
            }
        };
*/

        scope.onDropField = function ($event, $data, fieldOpts, popupLayer, position, type) {

            console.log('scope.showPopup', scope.showPopup);

            if ( type && $data.type != type) {
                popupBox.alert('타입 Type Field만 적용 가능합니다.', function clickedOk() {
                });
                return false;
            }
            // console.log(scope.prevent, $data.name)
            if ( scope.prevent && $data.name === scope.prevent) {
                popupBox.alert(scope.prevent + ' Field는 적용할 수 없습니다.', function clickedOk() {
                });
                return false;
            }
            scope.drops[popupLayer] = _.cloneDeep($data);

            if (position) {
                utility.openPopupLayer(popupLayer, position, angular.element($event.target));
            }
        };



        scope.clearField = function ($event, drops, field, index) {
            // console.log($event, fieldOpts, field, index)
            // $event.preventDefault();
            $event.stopPropagation();
            if (Number.isInteger(index)) {
                // sankey
                drops[field][index] = {};
            } else {
                drops[field] = null;
            }
            utility.closeAllLayers();
        };

        scope.closePopup = function () {
            utility.closeAllLayers();
        }

        scope.openPopup = function ($event, layer, position) {
            console.log($event, layer, position)
            $event.preventDefault();
            utility.openPopupLayer(layer, position, angular.element($event.target));
        };

    }

    return {
        restrict: 'EA',
        templateUrl: '/views/directives/chart/dropField.html',
        scope: {
            name: '@',
            field: '=',
            drops: '=',
            showPopup: '@',
            position: '@',
            layout: '@',
            prevent: '@',
            restrict: '@',

        },
        link: link
    };
}

module.exports = dropField;
