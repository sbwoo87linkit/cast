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
        /**
        *   variables
        */

/*

        scope.countField = { name: '*', type: '*' };
        scope.normalFields = scope.fields;
        if (!_.isEmpty(scope.timeField)) {
            scope.normalFields = _.reject(scope.fields, ['name', scope.timeField.name]);
        }
        /!**
        *
        *!/
        scope.clickItem = function (field) {
            scope.chooseField({
                field: field
            });
        };

*/

        scope.onDropField = function ($event, $data, fieldOpts, popupLayer, position, type) {
            if ( type && $data.type != type) {
                popupBox.alert('타입 Type Field만 적용 가능합니다.', function clickedOk() {
                });
                return false;
            }
            console.log(scope.prevent, $data.name)
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





        /*
        scope.ignoreByNames = function (field) {
            return !_.includes(scope.withouts, field.name);
        };

        scope.canChoiceTime = (_.get(scope, 'timeField.name')) ? true: false;
        */

    }

    return {
        restrict: 'EA',
        templateUrl: '/views/directives/chart/dropField.html',
        scope: {
            name: '@',
            field: '=',
            drops: '=',
            position: '@',
            layout: '@',
            prevent: '@'
            // fields: '=',
            // withouts: '=',
            // canChoiceCount: '=',
            // chooseField: '&'
        },
        link: link
    };
}

module.exports = dropField;
