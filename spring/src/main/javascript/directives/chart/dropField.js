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

        // scope.onDropField = function ($event, $data, fieldOpts, popupLayer, position, type) {
        scope.onDropField = function ($event, $data, popupLayer) {


            if ( scope.restrict && $data.type != scope.restrict) {
                popupBox.alert(scope.restrict + ' Type Field만 적용 가능합니다.', function clickedOk() {
                });
                return false;
            }

            if ( scope.prevent && $data.name === scope.prevent) {
                popupBox.alert(scope.prevent + ' Field는 적용할 수 없습니다.', function clickedOk() {
                });
                return false;
            }

            console.log($data, popupLayer, scope.drops, scope.drops[popupLayer]);
            // scope.drops[popupLayer] = _.cloneDeep($data);
            //
            // // 드랍 후 팝업제어. 'false'인경우 팝업 보여주지 않음.
            // if ((scope.showPopup != 'false' )) {
            //     if (!scope.position) {
            //         popupBox.alert('HTML에 position 값이 없습니다.', function clickedOk() {
            //         });
            //         return false;
            //     } else {
            //         utility.openPopupLayer(popupLayer, scope.position, angular.element($event.target));
            //     }
            // }
        };


        // for sankey. delete fields
        scope.deleteField = function (columns, $index) {
            console.log(columns, $index);
            columns.splice($index, 1);
        }


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
            console.log(layer, position, angular.element($event.target))
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
            parentArray: '=',
            index: '@',
            showPopup: '@',
            showLabel: '@',
            position: '@',
            layout: '@',
            prevent: '@',
            restrict: '@',
            colWidth: '@',
            middle: '@'

        },
        link: link
    };
}

module.exports = dropField;
