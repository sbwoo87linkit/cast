'use strict';
/**
 *
 */
/**
 * Controller
 */
ValueFieldCtrl.$inject = ['$scope', 'MESSAGE', 'DEFAULT', 'OPTIONS.ANOMALY', 'util', 'popupLayerStore'];
function ValueFieldCtrl($scope, MESSAGE, DEFAULT, anomalyOpts, util, popupLayerStore) {
    /**
    *
    */
    var _dataIdx = -1;
    var _funcsOpts = anomalyOpts.FUNCS;
    /**
    *
    */
    $scope.withoutFields = [];

    $scope.valField = null;
    $scope.isInvalid = {};
    $scope.funcs = _funcsOpts.NUMBER; // default
    /**
    *
    */
    $scope.add = function (valField) {
        if (!validateForm(valField)) {
            return;
        }

        $scope.formData.valFields.push(valField);
        closeLayer();
    };
    $scope.update = function (valField) {
        if (!validateForm(valField)) {
            return;
        }

        $scope.formData.valFields[_dataIdx] = valField;
        closeLayer();
    };
    $scope.cancel = function () {
        closeLayer();
    };
    $scope.remove = function () {
        $scope.formData.valFields.splice(_dataIdx, 1);
        closeLayer();
    };
    /**
    *   events
    */
    $scope.$on('anomaly.opt.val_field.init_form', function () {
        // NOTE: 필드 목록에서 중복 필드 제거
        var keyFields = $scope.formData.keyFields;
        var valFields = $scope.formData.valFields;
        var fieldNames = null;
        // key/value 선택된 필드를 제외
        if (keyFields.length || valFields.length) {
            fieldNames = _.concat([], _.map(keyFields, 'field.name'), _.map(valFields, 'field.name'));
        }
        // 현재 form의 필드는 다시 선택 가능하도록
        var valField = $scope.valField;
        if (valField && valField.field) {
            fieldNames = _.without(fieldNames, valField.field.name);
        }
        $scope.withoutFields = fieldNames;
    });
    $scope.$on('anomaly.opt.val_field.set_form', function (e, valField, index) {
        $scope.valField = _.cloneDeep(valField);
        _dataIdx = _.isNumber(index) ? index : _dataIdx;

        var fieldType = (valField.field.type === 'NUMBER') ? 'NUMBER' : 'ETC';
        $scope.funcs = _funcsOpts[fieldType];

        $scope.valField.func = valField.func || _.first(_.keys($scope.funcs));

        // init validation flag
        $scope.isInvalid = {};
    });
    /**
    *
    */
    function validateForm(fieldData) {
        var isInvalid = $scope.isInvalid;

        // 최소/최대값 숫자 여부
        var min = fieldData.min;
        var max = fieldData.max;
        if (min) {
            isInvalid.onlyNum = !(util.isNumber(+min));
        }
        if (max) {
            isInvalid.onlyNum = isInvalid.onlyNum || !(util.isNumber(+max));
        }

        return !_.some(isInvalid);
    }
    function closeLayer() {
        $scope.valField = null;
        $scope.isInvalid = {};

        popupLayerStore.get('anomaly.opt.val_field').closeEl();
    }
}

module.exports = ValueFieldCtrl;
