'use strict';
/**
 *
 */
var angular = require('angular');
/**
 * Controller
 */
DialogCtrl.$inject = ['$scope', '$filter', '$timeout', 'DEFAULT', 'ADE_PARAMS', 'util', 'searchCond'];
function DialogCtrl($scope, $filter, $timeout, DEFAULT, ADE_PARAMS, util, searchCond) {
    /**
    *
    */
    // NOTE: 상세 옵션 숨기기 상태의 height 값.
    var DEFAULT_DLG_HEIGHT = 364;

    var _cardId = '';

    var untitledNum = 0;
    /**
    *
    */
    $scope.status = '';

    $scope.formData = {};
    $scope.formView = {};

    $scope.isInvalidForm = {}; // 실행 버튼을 눌렀을 때 form의 invalid 여부

    // $scope.dlgHeight = getDlgHeight();
    /**
    *
    */
    $scope.resetOptions = function () {
        initForm();
    };
    $scope.runCard = function () {
        var formData = $scope.formData;
        if (!validateForm(formData)) {
            return;
        }

        $scope.$root.$broadcast('dialog.close.anomaly.popup.edit');
        $scope.$root.$broadcast('anomaly.card.add', formData);
    };
    $scope.updateCard = function () {
        var formData = $scope.formData;
        if (!validateForm(formData)) {
            return;
        }

        $scope.$root.$broadcast('dialog.close.anomaly.popup.edit');
        $scope.$root.$broadcast('anomaly.card.update.' + _cardId, formData);
    };
    $scope.updateRunCard = function () {
        var formData = $scope.formData;
        if (!validateForm(formData)) {
            return;
        }

        $scope.$root.$broadcast('dialog.close.anomaly.popup.edit');
        $scope.$root.$broadcast('anomaly.card.update.' + _cardId, formData);
        $scope.$root.$broadcast('anomaly.card.run.' + _cardId);
    };
    /**
    *   events
    */
    // 다이얼로그 폼 설정 (생성/수정)
    $scope.$on('anomaly.popup.edit.setForm', function (event, status, cardId, adeOptions) {
        $scope.status = status;

        if (status === 'create') {
            initForm();
        }
        else if (status === 'update') {
            $scope.formData = _.cloneDeep(adeOptions);

            _cardId = cardId; // save

            // init validation flag
            $scope.isInvalidForm = {};

            // hide more options
            $scope.formView.isMoreOpt = false;
        }
    });

    $scope.$watch('formData', function () {
        if (isVisible()) {
            $timeout(function () {
                $scope.dlgHeight = getDlgHeight();
            });
        }
    }, true);
    $scope.$watch('isInvalidForm', function () {
        if (isVisible()) {
            $timeout(function () {
                $scope.dlgHeight = getDlgHeight();
            });
        }
    }, true);
    $scope.$watch('formView.isMoreOpt', function () {
        if (isVisible()) {
            $timeout(function () {
                $scope.dlgHeight = getDlgHeight();
            });
        }
    });
    /**
    *   init
    */
    initForm();
    /**
    *
    */
    function initForm() {
        untitledNum += 1;

        var timeRange = searchCond.timeRange();
        var formData = _.cloneDeep(ADE_PARAMS);

        formData.title = 'Untitled ' + (_.padStart((untitledNum + ''), 2, '0'));
        formData.comTimeRange = {
            start: timeRange.start,
            end: timeRange.end
        };

        $scope.formData = formData;
        $scope.formView.isMoreOpt = false;
        $scope.dlgHeight = DEFAULT_DLG_HEIGHT;
    }

    function validateForm(formData) {
        var isInvalidForm = $scope.isInvalidForm;

        // 제목 입력 여부
        isInvalidForm.title = !formData.title;
        // 값 필드 선택 여부
        isInvalidForm.valField = !formData.valFields.length;

        // 비교/참조 기간 단위 비교
        var timeUnit = formData.timeUnit;
        var comRange = formData.comTimeRange;
        var refRange = formData.refTimeRange;
        isInvalidForm.comRange = isLtRangeUnit(comRange, timeUnit);
        isInvalidForm.refRange = isLtRangeUnit(refRange, timeUnit);

        return !_.some(isInvalidForm);
    }
    function isLtRangeUnit(range, unit) {
        var start = range.start;
        var end = range.end;

        // start === null: ...이전 (range 측정 불가)
        if (!start) {
            return false;
        }
        // start !== null && end === null: ...이후
        if (!end) {
            end = 'now';
        }

        var nStart = $filter('all2moment')(range.start).valueOf();
        var nEnd = $filter('all2moment')(range.end).valueOf();
        var rangeSec = (nEnd - nStart) / 1000;
        // NOTE: form ctrl의 selectbox 데이터를 참조
        var unitSec = {
            '1m': 60,
            '10m': 10 * 60,
            '1h': 60 * 60
        }[unit];

        return rangeSec < unitSec;
    }

    function getDlg() {
        return angular.element('[mu-dialog="anomaly.popup.edit"]');
    }
    function isVisible() {
        return getDlg().is(':visible');
    }
    function getDlgHeight() {
        var elDlg = getDlg();
        var elHead = elDlg.find('.mu-dialog-head');
        var elBody = elDlg.find('.mu-dialog-body');
        var elFoot = elDlg.find('.mu-dialog-foot');
        var height = _.sumBy(elBody.children(), function (el) {
            return angular.element(el).outerHeight();
        });
        return height + elHead.outerHeight() + elFoot.outerHeight() + 2;
    }
}

module.exports = DialogCtrl;
