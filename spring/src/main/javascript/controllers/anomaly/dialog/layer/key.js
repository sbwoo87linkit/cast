'use strict';
/**
 *
 */
/**
 * Controller
 */
KeyFieldCtrl.$inject = ['$scope', 'DEFAULT', 'util', 'popupLayerStore', 'dataModel', 'searchCond', 'searchAgent'];
function KeyFieldCtrl($scope, DEFAULT, util, popupLayerStore, dataModel, searchCond, searchAgent) {
    /**
    *
    */
    var _dataIdx = -1;
    var _fieldStatsMap = {};
    /**
    *
    */
    $scope.withoutFields = [];

    $scope.currField = null;
    $scope.keyField = null;
    $scope.keyValueMode = 'all'; // radio
    /**
    *
    */
    $scope.add = function (keyField) {
        if (!validateForm(keyField)) {
            return;
        }

        $scope.formData.keyFields.push(keyField);
        closeLayer();
    };
    $scope.update = function (keyField) {
        if (!validateForm(keyField)) {
            return;
        }

        $scope.formData.keyFields[_dataIdx] = keyField;
        closeLayer();
    };
    $scope.cancel = function () {
        closeLayer();
    };
    $scope.remove = function () {
        var field = $scope.keyField.field;
        // checkbox 선택 해제
        if (_fieldStatsMap[field.name]) {
            var modes = _fieldStatsMap[field.name].modes;
            _.forEach(modes, function (mode) {
                mode.isSelected = false;
            });
        }
        $scope.formData.keyFields.splice(_dataIdx, 1);
        closeLayer();
    };
    /**
     *  Checkbox
     */
    $scope.isCheckedAll = function(arr) {
        return _.every(arr, ['isSelected', true]);
    };
    $scope.toggleAll = function(arr) {
        var isChecked = _.every(arr, ['isSelected', true]);

        _.each(arr, function(item) {
            item.isSelected = !isChecked;
        });

        $scope.setInputText();
    };
    $scope.setInputText = function () {
        $scope.keyField.values = _.chain($scope.currField.modes)
            .filter('isSelected')
            .map('value')
            .join(', ')
            .value();
    };
    $scope.$watch('keyField.values', function (strValues) {
        if (strValues) {
            syncModes(strValues, $scope.currField.modes);
        }
    });
    /**
    *
    */
    $scope.$on('anomaly.opt.key_field.init_form', function () {
        // NOTE: 필드 목록에서 중복 필드 제거
        var keyFields = $scope.formData.keyFields;
        var valFields = $scope.formData.valFields;
        var fieldNames = null;
        // key/value 선택된 필드를 제외
        if (keyFields.length || valFields.length) {
            fieldNames = _.concat([], _.map(keyFields, 'field.name'), _.map(valFields, 'field.name'));
        }
        // 현재 form의 필드는 다시 선택 가능하도록
        var keyField = $scope.keyField;
        if (keyField && keyField.field) {
            fieldNames = _.without(fieldNames, keyField.field.name);
        }
        $scope.withoutFields = fieldNames;
    });
    $scope.$on('anomaly.opt.key_field.set_form', function (e, keyField, index) {
        $scope.keyField = _.cloneDeep(keyField);
        _dataIdx = _.isNumber(index) ? index : _dataIdx;

        // load stats detail data
        var field = keyField.field;
        if (field && field.name) {
            $scope.currField = getStats(field);
        }

        $scope.keyField.limit_num = keyField.limit_num || DEFAULT.LIMIT_NUM;

        $scope.keyValueMode = 'all';
        if (keyField.values) {
            $scope.keyValueMode = 'input';
        }

        // init validation flag
        $scope.isInvalid = {};
    });
    /**
    *
    */
    function validateForm(fieldData) {
        var isInvalid = $scope.isInvalid;
        var limitNum = +(fieldData.limit_num);

        isInvalid.limitNum = (!util.isNumber(limitNum) || !util.isValidScope(limitNum, 0, DEFAULT.LIMIT_NUM));

        return !_.some(isInvalid);
    }
    function closeLayer() {
        $scope.keyField = null;
        $scope.isInvalid = {};
        $scope.currField = null;
        $scope.keyValueMode = 'all';

        popupLayerStore.get('anomaly.opt.key_field').closeEl();
    }
    function getStats(field) {
        if (!_fieldStatsMap[field.name]) {
            _fieldStatsMap[field.name] = field;
            fetchStats(field);
        }
        return _fieldStatsMap[field.name];
    }
    function fetchStats(field) {
        // case 1) _isFetching === false, _isFetchError === false: 데이터 수신 완료
        // case 2) _isFetching === true, _isFetchError === false: 데이터 받는 중
        // case 3) _isFetching === true, _isFetchError === true: 데이터 받다가 에러나서 중지됨
        // TODO: 실패했을 때는 재시도를 사용자가 해야 한다.
        if (field._isFetching !== undefined && !field._isFetchError) {
            return;
        }

        field._isFetching = true;
        field._isFetchError = false;

        var model = dataModel.get();
        var params = searchCond.get();

        // fetch data
        // NOTE: layer가 close 되어도 계속 진행
        searchAgent.statsDetail(params, model, field.name)
            // success callback은 반복적으로 호출된다.
            .success(function (data) {
                if ($scope.keyField.values) {
                    syncModes($scope.keyField.values, data.modes);
                }
                // 덮어쓰기
                field.modes = data.modes;
                field._isFetching = !data.isEnd;
            })
            .error(function (/*err*/) {
                // this.abort();
                field._isFetchError = true;
            })
            .fetch();
    }
    function syncModes(strValues, modes) {
        if (!modes || !modes.length) {
            return;
        }

        var values = strValues.split(/\s*,\s*/);
        _.forEach(modes, function (mode) {
            var value = mode.value;
            mode.isSelected = _.includes(values, value);
        });
    }
}

module.exports = KeyFieldCtrl;
