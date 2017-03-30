'use strict';
/**
*
*/
/**
*
*/
fieldList.$inject = [];
function fieldList() {
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

        scope.ignoreByNames = function (field) {
            return !_.includes(scope.withouts, field.name);
        };

        scope.canChoiceTime = (_.get(scope, 'timeField.name')) ? true: false;
    }

    return {
        restrict: 'EA',
        templateUrl: '/views/directives/pivot/fieldList.html',
        scope: {
            name: '@',
            timeField: '=',
            fields: '=',
            withouts: '=',
            canChoiceCount: '=',
            chooseField: '&'
        },
        link: link
    };
}

module.exports = fieldList;
