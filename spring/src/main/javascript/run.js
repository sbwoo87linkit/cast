'use strict';
/**
 *
 */
var $ = require('jquery');
var moment = require('moment');
require('moment/locale/ko');
/**
*   preprocess app
*/
Run.$inject = ['$rootScope', '$templateCache', '$http', '$state', '$log', 'LOCALE', 'MESSAGE', 'DEFAULT', 'popupBox', 'Report', 'dataModel', 'commonAgent', 'dataModelAgent', 'reportAgent', 'errorHandler', 'paramBuilder'];
function Run($rootScope, $templateCache, $http, $state, $log, LOCALE, MESSAGE, DEFAULT, popupBox, Report, dataModel, commonAgent, dataModelAgent, reportAgent, errorHandler, paramBuilder) {
    /**
    *   Changing locale globally
    */
    moment.locale(LOCALE);
    /**
    *   state events
    */
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        // case: ERR_CONNECTION_REFUSED
        if (error.status === -1) {
            popupBox.error(MESSAGE['err_msg.empty_response']);
        }
        // else {
        //     event.preventDefault();
        //     return $state.go('error.' + error.status);
        // }
    });
    // $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
    // });
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        // check report id
        if (toParams.rid) {
            if (toParams.rid !== Report.id()) {
                event.preventDefault(); // stop current execution

                reportAgent.getOnce(toParams.rid, function (data) {
                    Report.set(data);
                    $state.go(toState.name, toParams); // reload
                }, function () {
                    delete toParams.rid;
                    $state.go(toState.name, toParams); // reload
                });
                return;
            }
        }

        if (toParams.d) {
            if (toParams.d !== dataModel.id()) {
                event.preventDefault(); // stop current execution

                dataModelAgent.getOne(toParams.d, function (data) {
                    dataModel.set(data);
                    $state.go(toState.name, toParams); // reload
                }, function () {
                    delete toParams.d;
                    $state.go(toState.name, toParams); // reload
                });
                return;
            }
        }
        // TODO: 임시 처리. 원래는 searchCond or pivotProps와 같이 clean되어야 한다.
        else {
            dataModel.clean();
        }

        // redirect
        var isToPivot = (toState.name.indexOf('pivot.') !== -1);
        if (isToPivot) {
            // d: dataName
            if (_.isEmpty(toParams.d)) {
                event.preventDefault(); // stop current execution
                $state.go('pivot_choose_data');
                return;
            }
        }
        var isToAnomaly = (toState.name === 'anomaly');
        if (isToAnomaly) {
            // d: dataName
            if (_.isEmpty(toParams.d)) {
                event.preventDefault(); // stop current execution
                $state.go('anomaly_choose_data');
                return;
            }
        }

        // 피벗 첫 화면
        if (toState.name === 'pivot') {
            event.preventDefault();
            $state.transitionTo('pivot.grid');
        }
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
        // check report id
        if (toParams.rid) {
            if (toParams.rid === Report.id()) {
                var report = Report.get();
                var props = _.pick(report, 'query', 'modelId', 'timeRange');

                if (report.pivotState) {
                    _.defaults(props, report.pivotAttribute);
                }

                var params = paramBuilder.serialize(props);
                params.rid = toParams.rid;
                params.jt = toParams.jt;

                // NOTE: start 에서는 toParams를 덮어씌워야 제대로 동작한다.
                _.assign(toParams, params);
                $state.go(toState.name, toParams, { notify: false }); // set url params
            }
        }
    });
    /**
     * Angora 토큰 확인
     */
    commonAgent.confirmToken(function (res) {
        var token = res.data;
        if (!token) {
            popupBox.error(MESSAGE['angora.error.authorization']);
        }
    }, errorHandler.alert);
    /**
    *   pre-load common data
    */
    var fnEmpty = function () {};
    commonAgent.tableList(fnEmpty, fnEmpty);
    dataModelAgent.getList(fnEmpty, fnEmpty);
    /**
    *   ping (unlimited)
    */
    var pingInterval = null;

    var startPing = function () {
        pingInterval = setInterval(function () {
            $.get('/common/ping')
                .fail(function (res) {
                    // TODO: 에러시 notice 처리
                    $log.error('Angora ping error: ', res.data);
                    clearInterval(pingInterval);
                });
        }, DEFAULT.PING_INTERVAL);
    };

    startPing();
}
/**
*   exports
*/
module.exports = Run;
