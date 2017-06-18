'use strict';
/**
*
*/
/**
*
*/
dropField.$inject = ['utility', 'popupLayerStore'];
function dropField(utility, popupLayerStore) {
    /**
    *   directive link
    */
    function link(scope) {
        /**
        *   variables
        */
        scope.countField = { name: '*', type: '*' };
        scope.normalFields = scope.fields;
        if (!_.isEmpty(scope.timeField)) {
            scope.normalFields = _.reject(scope.fields, ['name', scope.timeField.name]);
        }
        /**
        *
        */
        scope.clickItem = function (field) {
            scope.chooseField({
                field: field
            });
        };

        // scope.onDropField = function () {
        //     console.log('onDropField - dropField directive')
        // }

        scope.onDropField = function ($event, $data, fieldOpts, popupLayer, position, type) {
            console.log('onDropField - dropField directive')

            console.log($event, $data, popupLayer, position, type)

            if ( type && $data.type != type) {
                popupBox.alert('타입 Type Field만 적용 가능합니다.', function clickedOk() {
                });
                return false;
            }
            scope.drops[popupLayer] = _.cloneDeep($data);

            if (position) {
                utility.openPopupLayer(popupLayer, position, angular.element($event.target));
            }
        };

        scope.closePopup = function (popupLayer) {
            console.log(popupLayer)
            // utility.closeAllLayers();


            // var layer;

            // var layer = popupLayerStore.get('adv.xAxisField.setting');
            // if (layer) {
            //     popupLayerStore.get('adv.xAxisField.setting').closeEl();
            // }

            var layer = popupLayerStore.get(popupLayer);
            if (layer) {
                popupLayerStore.get(popupLayer).closeEl();
            }


        }


        scope.ignoreByNames = function (field) {
            return !_.includes(scope.withouts, field.name);
        };

        scope.canChoiceTime = (_.get(scope, 'timeField.name')) ? true: false;
    }

    return {
        restrict: 'EA',
        templateUrl: '/views/directives/chart/dropField.html',
        scope: {
            name: '@',
            field: '=',
            drops: '=',
            fields: '=',
            withouts: '=',
            canChoiceCount: '=',
            chooseField: '&'
        },
        link: link
    };
}

module.exports = dropField;
