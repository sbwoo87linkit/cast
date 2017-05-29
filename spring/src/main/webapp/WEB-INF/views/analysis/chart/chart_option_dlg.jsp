
<!-- 차트 옵션 버튼 -->
<button id="btnShowChartOpts" type="button" class="mu-btn mu-btn-icon"
        ng-click="openChartOptsDlg()"
        xmlns:spring="http://www.w3.org/1999/XSL/Transform">
    <i class="mu-icon-img option"></i>
    <span><spring:message code="option" /></span>
</button>

<!-- 차트 옵션 다이얼로그 -->
<div id="dlgChartOpts" class="mu-dialog mu-tab-inner" mu-dialog="dlgChartOpts" dialog-offset="dlgOffset" style="width: 500px;">
    <div class="mu-dialog-head" mu-dialog-head="" movable="">
        <span class="title"><spring:message code="chart.visual.opts" /></span>
        <button type="button" class="mu-btn mu-btn-icon mu-btn-bg-non" mu-dialog-close="dlgChartOpts"
                ng-click="closeChartOptsDlg()">
            <i class="mu-icon-img"></i>
        </button>
    </div>




    <!-- 탭 (기본) -->
    <div class="mu-dialog-body" ng-show="activeTabSet === 'defaultTab'">
        <!-- 탭 목록 (좌측) -->
        <ul class="mu-tab mu-tab-vertical" mu-tabset="defaultTab">
            <li mu-tab-item="" ng-repeat="group in tabs">
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
                    <!-- Null 값 -->
                    <tr ng-show="adv.chart.type=== 'Line plot' || chartType === 'spline' || chartType === 'area'">
                        <th>
                            <spring:message code="chart.normal.null_values" />
                        </th>
                        <td>
                            <div class="mu-btn-group" ng-init="adv.chartOpts.opts.normal.connectNulls = 'gap'">
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.connectNulls === 'gap'}"
                                        ng-click="adv.chartOpts.opts.normal.connectNulls = 'gap'"><spring:message code="chart.gap" /></button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.connectNulls === 'show'}"
                                        ng-click="adv.chartOpts.opts.normal.connectNulls = 'show'"><spring:message code="pivot.show" /></button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.connectNulls === 'connect'}"
                                        ng-click="adv.chartOpts.opts.normal.connectNulls = 'connect'"><spring:message code="chart.link" /></button>
                            </div>
                        </td>
                    </tr>
                    <!-- 스택 모드 -->
                    <tr ng-show="adv.chart.type !== 'Line plot'">
                        <th>
                            <spring:message code="chart.stack_mode" />
                        </th>
                        <td>
                            <div class="mu-btn-group" ng-init="adv.chartOpts.opts.normal.stacking='none'">
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.stacking === 'none'}"
                                        ng-click="adv.chartOpts.opts.normal.stacking='none'"><spring:message code="off" /></button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.stacking === 'normal'}"
                                        ng-click="adv.chartOpts.opts.normal.stacking='normal'"><spring:message code="chart.stack_mode.stack" /></button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.stacking === 'percent'}"
                                        ng-click="adv.chartOpts.opts.normal.stacking='percent'"><spring:message code="chart.stack_mode.full_stack" /></button>
                            </div>
                        </td>
                    </tr>

                    <!-- NOTE: 추후 기능 구현 -->
                    <!-- 다중 열 모드 -->
                    <!-- <tr class="mu-item-group" ng-show="adv.chart.type !== 'pie'">
                        <th>
                            <spring:message code="chart.normal.split_series" />
                        </th>
                        <td>
                            <div class="mu-btn-group">
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.splitSeries}"
                                 ng-click="changeSplitSeries(true)"><spring:message code="on" /></button>
                                <button class="mu-btn" ng-class="{'active': !adv.chartOpts.opts.normal.splitSeries}"
                                 ng-click="changeSplitSeries(false)"><spring:message code="off" /></button>
                            </div>
                        </td>
                    </tr> -->
                    <!-- 드릴 다운 -->
                    <tr>
                        <th>
                            <spring:message code="drilldown" />
                        </th>
                        <td>
                            <div class="mu-btn-group" ng-init="adv.chartOpts.opts.normal.drillDown = true">
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.drillDown}"
                                        ng-click="adv.chartOpts.opts.normal.drillDown = true"><spring:message code="yes" /></button>
                                <button class="mu-btn" ng-class="{'active': !adv.chartOpts.opts.normal.drillDown}"
                                        ng-click="adv.chartOpts.opts.normal.drillDown = false"><spring:message code="no" /></button>
                            </div>
                        </td>
                    </tr>
                    <!-- 데이터 값 표시 -->
                    <tr class="mu-item-group">
                        <th>
                            <spring:message code="chart.show_data_values" />
                        </th>
                        <td>
                            <div class="mu-btn-group" ng-init="adv.chartOpts.opts.normal.showValue = 'none'">
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.showValue === 'none'}"
                                        ng-click="adv.chartOpts.opts.normal.showValue = 'none'"><spring:message code="off" /></button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.showValue === 'all'}"
                                        ng-click="adv.chartOpts.opts.normal.showValue = 'all'"><spring:message code="on" /></button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.showValue === 'min.max'}"
                                        ng-click="adv.chartOpts.opts.normal.showValue = 'min.max'"><spring:message code="agg_func.min" />/<spring:message code="agg_func.max" /></button>
                            </div>
                        </td>
                    </tr>
                    <!-- 최소 높이 -->
                    <tr class="table-row">
                        <th>
                            최소 높이
                        </th>
                        <td>
                            <div class="mu-item-group" ng-init="adv.chartOpts.opts.normal.minHeight=170">
                                <input type="text" class="mu-input" ng-model="adv.chartOpts.opts.normal.minHeight" >
                                <!--<div class="mu-checkbox">-->
                                <!--<input type="checkbox" id="ckbXAxisTitle" ng-model="adv.chartOpts.opts.xAxis.title.isShow"-->
                                <!--ng-click="changeXAxisTitle($event)">-->
                                <!--<label for="ckbXAxisTitle"><spring:message code="pivot.show" /></label>-->
                                <!--</div>-->
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
                                <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.xAxis.title.text">
                                <div class="mu-checkbox">
                                    <input type="checkbox" id="ckbXAxisTitle" ng-model="adv.chartOpts.opts.xAxis.title.isShow"
                                    ">
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
                            <div class="mu-btn-group" ng-init="adv.chartOpts.opts.xAxis.labels.rotation = -90">
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.xAxis.labels.rotation === -90}"
                                        ng-click="adv.chartOpts.opts.xAxis.labels.rotation = -90">-90</button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.xAxis.labels.rotation === -45}"
                                        ng-click="adv.chartOpts.opts.xAxis.labels.rotation = -45">-45</button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.xAxis.labels.rotation === 0}"
                                        ng-click="adv.chartOpts.opts.xAxis.labels.rotation = 0">0</button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.xAxis.labels.rotation === 45}"
                                        ng-click="adv.chartOpts.opts.xAxis.labels.rotation = 45">45</button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.xAxis.labels.rotation === 90}"
                                        ng-click="adv.chartOpts.opts.xAxis.labels.rotation = 90">90</button>
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
                            <!--<div>-->
                                <!--{{adv.chartOpts.opts.yAxis.title.isShow}}-->
                            <!--</div>-->
                            <div class="mu-item-group">
                                <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.yAxis.title.text">
                                <div class="mu-checkbox">
                                    <input type="checkbox" id="ckbYAxisTitle" ng-model="adv.chartOpts.opts.yAxis.title.isShow"
                                           ">
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
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.yAxis.type === 'linear'}"
                                 ng-click="changeYAxisType('linear')"><spring:message code="chart.linear" /></button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.yAxis.type === 'logarithmic'}"
                                 ng-click="changeYAxisType('logarithmic')"><spring:message code="chart.log" /></button>
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
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.yAxis.range === 'same'}"
                                 ng-click="changeYAxisRange('same')"><spring:message code="chart.linear" /></button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.yAxis.range === 'each'}"
                                 ng-click="changeYAxisRange('each')"><spring:message code="chart.log" /></button>
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
                                <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.yAxis.tickInterval" >
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
                                <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.yAxis.min">
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
                                <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.yAxis.max">
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
                                <div class="mu-item-group mu-input-btn" ng-repeat="field in adv.chartOpts.opts.overlay.fields">
                                    <input type="text" class="mu-input" readonly="readonly" value="{{field}}">
                                    <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"
                                     ng-click="changeOverlayField('remove', field)">
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
                                    <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.overlay.enabled}"
                                     ng-click="changeOverlayEnabled(true)"><spring:message code="on" /></button>
                                    <button class="mu-btn" ng-class="{'active': !adv.chartOpts.opts.overlay.enabled}"
                                     ng-click="changeOverlayEnabled(false)"><spring:message code="off" /></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <spring:message code="report.title" />
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.overlay.title.text" ng-change="changeOverlayTitle()">
                                    <div class="mu-checkbox">
                                        <input type="checkbox" id="ckbOverlayTitle" ng-model="adv.chartOpts.opts.overlay.title.isShow"
                                         ng-click="changeOverlayTitle()">
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
                                    <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.overlay.type === 'inherit'}"
                                     ng-click="changeOverlayType('inherit')"><spring:message code="chart.inherit" /></button>
                                    <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.overlay.type === 'linear'}"
                                     ng-click="changeOverlayType('linear')"><spring:message code="chart.linear" /></button>
                                    <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.overlay.type === 'logarithmic'}"
                                     ng-click="changeOverlayType('logarithmic')"><spring:message code="chart.log" /></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <spring:message code="chart.gap" />
                            </th>
                            <td>
                                <div class="mu-item-group">
                                    <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.overlay.tickInterval" ng-change="changeOverlayTickInterval()">
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
                                    <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.overlay.min" ng-change="changeOverlayMin()">
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
                                    <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.overlay.max" ng-change="changeOverlayMax()">
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
                            <div class="mu-item-group">
                                <!--<input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.legend.title.text">-->
                                <div class="mu-checkbox">
                                    <input type="checkbox" id="ckbLegendTitle" ng-model="adv.chartOpts.opts.legend.isShow"
                                    ">
                                    <label for="ckbLegendTitle"><spring:message code="pivot.show" /></label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <!-- 범례 위치 -->
                    <tr>
                        <th>
                            <spring:message code="chart.legned.position" />
                        </th>
                        <td>
                            <div class="mu-btn-group" ng-init="adv.chartOpts.opts.legend.location = 'right'">
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.legend.location === 'right'}"
                                        ng-click="adv.chartOpts.opts.legend.location = 'right'">right</button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.legend.location === 'bottom'}"
                                        ng-click="adv.chartOpts.opts.legend.location = 'bottom'">bottom</button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.legend.location === 'top'}"
                                        ng-click="adv.chartOpts.opts.legend.location = 'top'">top</button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.legend.location === 'left'}"
                                        ng-click="adv.chartOpts.opts.legend.location = 'left'">left</button>
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
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.legend.ellipsis === 'end'}"
                                 ng-click="changeLegendEllipsis('end')"><spring:message code="end" /></button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.legend.ellipsis === 'middle'}"
                                 ng-click="changeLegendEllipsis('middle')"><spring:message code="middle" /></button>
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.legend.ellipsis === 'start'}"
                                 ng-click="changeLegendEllipsis('start')"><spring:message code="start" /></button>
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
                                <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.drillDown}"
                                        ng-click="changeDrillDown(true)"><spring:message code="yes" /></button>
                                <button class="mu-btn" ng-class="{'active': !adv.chartOpts.opts.normal.drillDown}"
                                        ng-click="changeDrillDown(false)"><spring:message code="no" /></button>
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
                                <input type="text" class="mu-input" ng-model="adv.chartOpts.opts.size.minSize" ng-keydown="changeMinSize($event)" ng-blur="changeMinSize($event)">
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
