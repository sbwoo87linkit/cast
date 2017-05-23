<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div ng-controller="test.VisualChartOptsCtrl">
    <!-- 차트 옵션 버튼 -->
    <button id="btnShowChartOpts" type="button" class="mu-btn mu-btn-icon" ng-click="openChartOptsDlg()">
        <i class="mu-icon-img option"></i>
        <span><spring:message code="option" /></span>
    </button>

    <!-- 차트 옵션 다이얼로그 -->
    <div id="dlgChartOpts" class="mu-dialog mu-tab-inner" mu-dialog="dlgChartOpts" dialog-offset="dlgOffset" style="width: 500px;">
        <div class="mu-dialog-head" mu-dialog-head="" movable="">
            <span class="title"><spring:message code="chart.visual.opts" /></span>
            <button type="button" class="mu-btn mu-btn-icon mu-btn-bg-non" mu-dialog-close="dlgChartOpts" ng-click="closeChartOptsDlg()">
                <i class="mu-icon-img"></i>
            </button>
        </div>
        <!-- 탭 (기본) -->
        <div class="mu-dialog-body" ng-show="activeTabSet === 'defaultTab'">
            <!-- 탭 목록 (좌측) -->
            <ul class="mu-tab mu-tab-vertical" mu-tabset="defaultTab">
                <li mu-tab-item="" ng-repeat="group in chartOpts.groups">
                    <a href="javascript:;">{{group.res}}</a>
                </li>
            </ul>
            <!-- 탭 컨텐츠 (기본) -->
            <div class="mu-tab-body" mu-tabset="defaultTab">
                <!-- 일반 -->
                <div class="mu-tabCont" mu-tab-contents="">
                    <table class="mu-formbox">
                        <colgroup>
                            <col width="100px">
                        </colgroup>
                        <tbody>
                            <!-- 스택 모드 -->
                            <tr ng-show="chartType !== 'spline'">
                                <th>
                                    <spring:message code="chart.stack_mode" />
                                </th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.normal.stacking === 'none'}" ng-click="changeStacking('none')"><spring:message code="off" /></button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.normal.stacking === 'normal'}" ng-click="changeStacking('normal')"><spring:message code="chart.stack_mode.stack" /></button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.normal.stacking === 'percent'}" ng-click="changeStacking('percent')"><spring:message code="chart.stack_mode.full_stack" /></button>
                                    </div>
                                </td>
                            </tr>
                            <!-- Null 값 -->
                            <tr ng-show="chartType === 'spline' || chartType === 'area'">
                                <th>
                                    <spring:message code="chart.normal.null_values" />
                                </th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.normal.connectNulls === 'gap'}" ng-click="changeConnectNulls('gap')"><spring:message code="chart.gap" /></button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.normal.connectNulls === 'show'}" ng-click="changeConnectNulls('show')"><spring:message code="pivot.show" /></button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.normal.connectNulls === 'connect'}" ng-click="changeConnectNulls('connect')"><spring:message code="chart.link" /></button>
                                    </div>
                                </td>
                            </tr>
                            <!-- NOTE: 추후 기능 구현 -->
                            <!-- 다중 열 모드 -->
                            <!-- <tr class="mu-item-group" ng-show="chartType !== 'pie'">
                                <th>
                                    <spring:message code="chart.normal.split_series" />
                                </th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.normal.splitSeries}" ng-click="changeSplitSeries(true)"><spring:message code="on" /></button>
                                        <button class="mu-btn" ng-class="{'active': !chartOpts.opts.normal.splitSeries}" ng-click="changeSplitSeries(false)"><spring:message code="off" /></button>
                                    </div>
                                </td>
                            </tr> -->
                            <!-- 드릴 다운 -->
                            <tr>
                                <th>
                                    <spring:message code="drilldown" />
                                </th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.normal.drillDown}" ng-click="changeDrillDown(true)"><spring:message code="yes" /></button>
                                        <button class="mu-btn" ng-class="{'active': !chartOpts.opts.normal.drillDown}" ng-click="changeDrillDown(false)"><spring:message code="no" /></button>
                                    </div>
                                </td>
                            </tr>
                            <!-- 데이터 값 표시 -->
                            <tr class="mu-item-group">
                                <th>
                                    <spring:message code="chart.show_data_values" />
                                </th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.normal.showValue === 'none'}" ng-click="changeShowValue('none')"><spring:message code="off" /></button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.normal.showValue === 'all'}" ng-click="changeShowValue('all')"><spring:message code="on" /></button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.normal.showValue === 'min.max'}" ng-click="changeShowValue('min.max')"><spring:message code="agg_func.min" />/<spring:message code="agg_func.max" /></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- X축 -->
                <div class="mu-tabCont" mu-tab-contents="">
                    <table class="mu-formbox">
                        <colgroup>
                            <col width="100px">
                        </colgroup>
                        <tbody>
                            <!-- 제목 -->
                            <tr>
                                <th>
                                    <spring:message code="report.title" />
                                </th>
                                <td>
                                    <div class="mu-item-group">
                                        <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="chartOpts.opts.xAxis.title.text" ng-keydown="changeXAxisTitle($event)" ng-blur="changeXAxisTitle($event)">
                                        <div class="mu-checkbox">
                                            <input type="checkbox" id="ckbXAxisTitle" ng-model="chartOpts.opts.xAxis.title.isShow" ng-click="changeXAxisTitle($event)">
                                            <label for="ckbXAxisTitle"><spring:message code="pivot.show" /></label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <!-- 레이블 회전 -->
                            <tr>
                                <th>
                                    <spring:message code="pivot.labels_rotation" />
                                </th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.xAxis.labels.rotation === -90}" ng-click="changeXAxisLabelRotation(-90)">-90</button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.xAxis.labels.rotation === -45}" ng-click="changeXAxisLabelRotation(-45)">-45</button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.xAxis.labels.rotation === 0}" ng-click="changeXAxisLabelRotation(0)">0</button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.xAxis.labels.rotation === 45}" ng-click="changeXAxisLabelRotation(45)">45</button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.xAxis.labels.rotation === 90}" ng-click="changeXAxisLabelRotation(90)">90</button>
                                    </div>
                                </td>
                            </tr>
                            <!-- NOTE: 추후 기능 구현 -->
                            <!-- 레이블 잘라내기 -->
                            <!-- <tr>
                                <th>레이블 잘라내기</th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn"><spring:message code="yes" /></button>
                                        <button class="mu-btn active"><spring:message code="no" /></button>
                                    </div>
                                </td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
                <!-- Y축 -->
                <div class="mu-tabCont" mu-tab-contents="">
                    <table class="mu-formbox">
                        <colgroup>
                            <col width="100px">
                        </colgroup>
                        <tbody>
                            <!-- 제목 -->
                            <tr>
                                <th>
                                    <spring:message code="report.title" />
                                </th>
                                <td>
                                    <div class="mu-item-group">
                                        <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="chartOpts.opts.yAxis.title.text" ng-keydown="changeYAxisTitle($event)" ng-blur="changeYAxisTitle($event)">
                                        <div class="mu-checkbox">
                                            <input type="checkbox" id="ckbYAxisTitle" ng-model="chartOpts.opts.yAxis.title.isShow" ng-click="changeYAxisTitle($event)">
                                            <label for="ckbYAxisTitle"><spring:message code="pivot.show" /></label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <!-- 눈금 -->
                            <!-- NOTE: #394 이슈 관련 임시 처리 -->
                            <!-- <tr>
                                <th>
                                    <spring:message code="chart.scale" />
                                </th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.yAxis.type === 'linear'}" ng-click="changeYAxisType('linear')"><spring:message code="chart.linear" /></button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.yAxis.type === 'logarithmic'}" ng-click="changeYAxisType('logarithmic')"><spring:message code="chart.log" /></button>
                                    </div>
                                </td>
                            </tr> -->
                            <!-- NOTE: 추후 기능 구현 -->
                            <!-- 축범위 -->
                            <!-- <tr>
                                <th>
                                    <spring:message code="chart.yAxis.axis_range" />
                                </th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.yAxis.range === 'same'}" ng-click="changeYAxisRange('same')"><spring:message code="chart.linear" /></button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.yAxis.range === 'each'}" ng-click="changeYAxisRange('each')"><spring:message code="chart.log" /></button>
                                    </div>
                                </td>
                            </tr> -->
                            <!-- 간격 -->
                            <tr>
                                <th>
                                    <spring:message code="chart.gap" />
                                </th>
                                <td>
                                    <div class="mu-item-group">
                                        <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="chartOpts.opts.yAxis.tickInterval" ng-keydown="changeYAxisTickInterval($event)" ng-blur="changeYAxisTickInterval($event)">
                                    </div>
                                    <!-- 에러 메시지 -->
                                    <div ng-show="!optsValid.yAxisTickInterval">
                                        <i class="mu-icon-img alert"></i>
                                        <span>
                                            <spring:message code="chart.error.invalid_yAxis_tick_interval" />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <!-- 최소값 -->
                            <tr>
                                <th>
                                    <spring:message code="minimum" />
                                </th>
                                <td>
                                    <div class="mu-item-group">
                                        <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="chartOpts.opts.yAxis.min" ng-keydown="changeYAxisMin($event)" ng-blur="changeYAxisMin($event)">
                                    </div>
                                    <!-- 에러 메시지 -->
                                    <div ng-show="!optsValid.yAxisMin">
                                        <i class="mu-icon-img alert"></i>
                                        <span>
                                            <spring:message code="chart.error.invalid_yAxis_min" />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <!-- 최대값 -->
                            <tr>
                                <th>
                                    <spring:message code="maximum" />
                                </th>
                                <td>
                                    <div class="mu-item-group">
                                        <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="chartOpts.opts.yAxis.max" ng-keydown="changeYAxisMax($event)" ng-blur="changeYAxisMax($event)">
                                    </div>
                                    <!-- 에러 메시지 -->
                                    <div ng-show="!optsValid.yAxisMax">
                                        <i class="mu-icon-img alert"></i>
                                        <span>
                                            <spring:message code="chart.error.invalid_yAxis_max" />
                                        </span>
                                    </div>
                                    <div ng-show="!optsValid.yAxisMinLessThanMax">
                                        <i class="mu-icon-img alert"></i>
                                        <span>
                                            <spring:message code="chart.error.invalid_yAxis_min_less_than_max" />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- NOTE: 추후 기능 구현 -->
                <!-- 차트 오버레이 -->
                <!-- <div class="mu-tabCont" mu-tab-contents="">
                    <table class="mu-formbox">
                        <colgroup>
                            <col width="100px">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>
                                    <spring:message code="overlay" />
                                </th>
                                <td>
                                    <div class="mu-selectbox" mu-select="sbOverlay" select-items="overlayFields" select-change="changeOverlayField('add', $model)">
                                        <button class="mu-value">{{$model.text}}</button>
                                        <ul class="mu-list">
                                            <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                                        </ul>
                                    </div>
                                    <div class="mu-item-group mu-input-btn" ng-repeat="field in chartOpts.opts.overlay.fields">
                                        <input type="text" class="mu-input" readonly="readonly" value="{{field}}">
                                        <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" ng-click="changeOverlayField('remove', field)">
                                            <i class="mu-icon-img delete2"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <spring:message code="chart.overlay.view_as_axis" />
                                </th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.overlay.enabled}" ng-click="changeOverlayEnabled(true)"><spring:message code="on" /></button>
                                        <button class="mu-btn" ng-class="{'active': !chartOpts.opts.overlay.enabled}" ng-click="changeOverlayEnabled(false)"><spring:message code="off" /></button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <spring:message code="report.title" />
                                </th>
                                <td>
                                    <div class="mu-item-group">
                                        <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="chartOpts.opts.overlay.title.text" ng-change="changeOverlayTitle()">
                                        <div class="mu-checkbox">
                                            <input type="checkbox" id="ckbOverlayTitle" ng-model="chartOpts.opts.overlay.title.isShow" ng-click="changeOverlayTitle()">
                                            <label for="ckbOverlayTitle"><spring:message code="pivot.show" /></label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <spring:message code="chart.scale" />
                                </th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.overlay.type === 'inherit'}" ng-click="changeOverlayType('inherit')"><spring:message code="chart.inherit" /></button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.overlay.type === 'linear'}" ng-click="changeOverlayType('linear')"><spring:message code="chart.linear" /></button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.overlay.type === 'logarithmic'}" ng-click="changeOverlayType('logarithmic')"><spring:message code="chart.log" /></button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <spring:message code="chart.gap" />
                                </th>
                                <td>
                                    <div class="mu-item-group">
                                        <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="chartOpts.opts.overlay.tickInterval" ng-change="changeOverlayTickInterval()">
                                    </div>
                                    <div>
                                        <i class="mu-icon-img alert"></i>
                                        <span>
                                            <spring:message code="chart.error.invalid_yAxis_tick_interval" />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th><spring:message code="minimum" /></th>
                                <td>
                                    <div class="mu-item-group">
                                        <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="chartOpts.opts.overlay.min" ng-change="changeOverlayMin()">
                                    </div>
                                    <div>
                                        <i class="mu-icon-img alert"></i>
                                        <span>
                                            <spring:message code="chart.error.invalid_yAxis_min" />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th><spring:message code="maximum" /></th>
                                <td>
                                    <div class="mu-item-group">
                                        <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="chartOpts.opts.overlay.max" ng-change="changeOverlayMax()">
                                    </div>
                                    <div>
                                        <i class="mu-icon-img alert"></i>
                                        <span>
                                            <spring:message code="chart.error.invalid_yAxis_min_less_than_max" />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div> -->
                <!-- 범례 -->
                <div class="mu-tabCont" mu-tab-contents="">
                    <table class="mu-formbox">
                        <colgroup>
                            <col width="100px">
                        </colgroup>
                        <tbody>
                            <!-- 범례 위치 -->
                            <tr>
                                <th>
                                    <spring:message code="chart.legned.position" />
                                </th>
                                <td>
                                    <div class="mu-selectbox" mu-select="sbOverlay" select-items="legnedAligns" select-change="changeLegnedAlign($model)">
                                        <button class="mu-value">{{$model.text}}</button>
                                        <ul class="mu-list">
                                            <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            <!-- NOTE: 추후 기능 구현 -->
                            <!-- 범례 잘라내기 -->
                            <!-- <tr>
                                <th>
                                    <spring:message code="chart.legend.truncation" />
                                </th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.legend.ellipsis === 'end'}" ng-click="changeLegendEllipsis('end')"><spring:message code="end" /></button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.legend.ellipsis === 'middle'}" ng-click="changeLegendEllipsis('middle')"><spring:message code="middle" /></button>
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.legend.ellipsis === 'start'}" ng-click="changeLegendEllipsis('start')"><spring:message code="start" /></button>
                                    </div>
                                </td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- 탭 (pie 차트) -->
        <div class="mu-dialog-body" ng-show="activeTabSet === 'PieTab'">
            <!-- 탭 목록 (좌측) -->
            <ul class="mu-tab mu-tab-vertical" mu-tabset="PieTab">
                <li mu-tab-item="" ng-repeat="group in chartOpts.groups">
                    <a href="javascript:;">{{group.res}}</a>
                </li>
            </ul>
            <!-- 탭 컨텐츠 (pie 차트) -->
            <div class="mu-tab-body" mu-tabset="PieTab">
                <!-- 일반 -->
                <div class="mu-tabCont" mu-tab-contents="">
                    <table class="mu-formbox">
                        <colgroup>
                            <col width="100px">
                        </colgroup>
                        <tbody>
                            <!-- 드릴 다운 -->
                            <tr>
                                <th>
                                    <spring:message code="drilldown" />
                                </th>
                                <td>
                                    <div class="mu-btn-group">
                                        <button class="mu-btn" ng-class="{'active': chartOpts.opts.normal.drillDown}" ng-click="changeDrillDown(true)"><spring:message code="yes" /></button>
                                        <button class="mu-btn" ng-class="{'active': !chartOpts.opts.normal.drillDown}" ng-click="changeDrillDown(false)"><spring:message code="no" /></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 크기 -->
                <div class="mu-tabCont" mu-tab-contents="">
                    <table class="mu-formbox">
                        <colgroup>
                            <col width="100px">
                        </colgroup>
                        <tbody>
                            <!-- 최소 크기 -->
                            <tr>
                                <th>
                                    <spring:message code="chart.size.min_size" />
                                </th>
                                <td>
                                    <div class="mu-item-group">
                                        <input type="text" class="mu-input" ng-model="chartOpts.opts.size.minSize" ng-keydown="changeMinSize($event)" ng-blur="changeMinSize($event)">
                                        <label>%</label>
                                    </div>
                                    <!-- 도움말 -->
                                    <div>
                                        <i class="mu-icon-img help"></i>
                                        <span>
                                            <spring:message code="chart.message.size_min_size" />
                                        </span>
                                    </div>
                                    <!-- 에러 메시지 -->
                                    <div ng-show="!optsValid.sizeMinSize">
                                        <i class="mu-icon-img alert"></i>
                                        <span>
                                            <spring:message code="chart.error.invalid_size_min_size" />
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</div>
