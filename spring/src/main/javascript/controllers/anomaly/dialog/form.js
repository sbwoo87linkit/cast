'use strict';
/**
 *
 */
/**
 * Controller
 */
FormCtrl.$inject = ['$scope', '$filter', 'MESSAGE', 'OPTIONS.ANOMALY', 'dataModel'];
function FormCtrl($scope, $filter, MESSAGE, anomalyOpts, dataModel) {
    /**
    *
    */
    $scope.models = anomalyOpts.MODELS;
    $scope.missings = anomalyOpts.MISSINGS;
    $scope.units = anomalyOpts.UNITS;

    $scope.fields = dataModel.fields().selected;

    $scope.isShowForm = false; // 필드선택/입력폼 전환
    $scope.isUpdate = false; // 추가/업데이트 버튼 전환
    /**
    *
    */
    $scope.showTimeLayer = function (name, timeRange) {
        // send layer ctrl
        $scope.$root.$broadcast('anomaly.opt.' + name + '.set_time', timeRange);
    };

    $scope.showLayer = function (name, data, index) {
        // new
        if (!data) {
            $scope.isShowForm = false;
            $scope.isUpdate = false;

            // send layer ctrl
            $scope.$root.$broadcast('anomaly.opt.' + name + '.init_form');
        }
        // modify
        else {
            $scope.isShowForm = true;
            $scope.isUpdate = true;

            // send layer ctrl
            $scope.$root.$broadcast('anomaly.opt.' + name + '.set_form', _.cloneDeep(data), index);
        }
    };

    $scope.nextForm = function (name, field) {
        // send layer ctrl
        $scope.$root.$broadcast('anomaly.opt.' + name + '.set_form', { field: _.cloneDeep(field) });

        $scope.isShowForm = true;
    };

    $scope.prevForm = function (name) {
        // send layer ctrl
        $scope.$root.$broadcast('anomaly.opt.' + name + '.init_form');

        $scope.isShowForm = false;
    };
    /**
    *
    */
    // WARN: pivotProp의 코드와 동일
    $scope.toHumanize = function (range) {
        if (_.isNumber(range.start) && range.end === null) {
            return MESSAGE['pivot.after_time_range'];
        } else if (range.start === null && _.isNumber(range.end)) {
            return MESSAGE['pivot.before_time_range'];
        } else if (_.isNumber(range.start) && _.isNumber(range.end)) {
            return MESSAGE['pivot.between_time_range'];
        }
        return $filter('keyrange2text')(range.start, range.end);
    };
}

module.exports = FormCtrl;
