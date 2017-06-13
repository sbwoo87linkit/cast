<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<div ng-controller="analysis.chart.HeatmapCtrl" class="full-height"
     xmlns:spring="http://www.w3.org/1999/XSL/Transform">

    <div class="mu-row">
        <div class="mu-col mu-col-4">
            <%@ include file="choose_chart.jsp"%>
        </div>
        <div class="mu-col mu-col-8">
            <div class="mu-row">
                <div class="mu-col mu-col-3" style="padding-left: 20px; text-align: left" ng-controller="analysis.chart.ChartOptionCtrl">

                    <!--차트 옵션 버튼 및 다이얼로그-->
                    <%@ include file="./chart_option_dlg.jsp"%>

                </div>
                <div class="mu-col mu-col-6">
                </div>
                <div class="mu-col mu-col-3">
                    <button type="button" class="mu-btn mu-btn-icon" ng-click="save()"><i class="mu-icon save"></i>저장</button>
                </div>
            </div>
        </div>
    </div>

    <div class="main-container" style="margin-top: 10px;">

        <div class="mu-row">
            <div class="mu-col mu-col-1">
            </div>
            <div class="mu-col mu-col-11">
                <div class="mu-row">
                    <div class="mu-col mu-col-1" style="text-align: right; padding-right: 10px;">
                        <span style="display: inline-block; margin-top: 6px">값</span>
                    </div>
                    <div class="mu-col mu-col-3">

                        <div ui-on-Drop="onDropField($event, $data, 'valueField', 'bottom-left')" class="drop-container" layer-offset="{left: 2}">
                            <span class="field" ng-if="!adv.fieldOptions.drops.valueField" style="">없음</span>
                            <div class="field" ng-if="adv.fieldOptions.drops.valueField">
                                <button class="fr" ng-click="openPopup($event, 'adv.valueField.setting', 'top-right')"> > </button>
                                <button type="button" class="close fl" ng-click="clearField($event, 'valueField')"></button>
                                <div>{{adv.fieldOptions.drops.valueField.name}}</div>
                            </div>
                        </div>

                        <!-- 팝업 레이어: value Field 설정 -->
                        <div class="mu-tooltip top-right" style="width: 426px;" popup-layer="adv.valueField.setting">
                            <div class="arrow"></div>
                            <div class="mu-tooltip-inner">

                                <span class="title">{{adv.valueField.name}}</span>
                                <!-- selectbox: 모델 -->
                                <div class="mu-search-item timeRelative">

                                    <table class="mu-formbox">
                                        <colgroup>
                                            <col width="100px">
                                        </colgroup>
                                        <tbody>
                                        <tr>
                                            <th>
                                                <label>정렬:</label>
                                            </th>
                                            <td>
                                                <div class="mu-selectbox" mu-select="sb1" select-model="adv.fieldOptions.opts.xAxis.sort.selected"
                                                     select-items="adv.fieldOptions.opts.xAxis.sort.list" select-change="changeOption($model)">
                                                    <button class="mu-value">{{$model.text}}</button>
                                                    <ul class="mu-list">
                                                        <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                                                    </ul>
                                                </div>

                                            </td>
                                        </tr>

                                        <tr>
                                            <th>
                                                <label>범위만들기:</label>
                                            </th>
                                            <td>
                                                <div class="mu-btn-group">
                                                    <button class="mu-btn" ng-class="{'active': adv.fieldOptions.opts.xAxis.range.selected === 'userDefined'}"
                                                            ng-click="adv.fieldOptions.opts.xAxis.range.selected = 'userDefined'">사용자지정</button>
                                                    <button class="mu-btn" ng-class="{'active': adv.fieldOptions.opts.xAxis.range.selected === 'notUse'}"
                                                            ng-click="adv.fieldOptions.opts.xAxis.range.selected = 'notUse'">만들지 않음</button>
                                                </div>
                                                <div ng-show="adv.fieldOptions.opts.xAxis.range.selected === 'userDefined'">
                                                    <table>
                                                        <tr>
                                                            <td>
                                                                범위크기
                                                            </td>
                                                            <td>
                                                                <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                       ng-model="adv.fieldOptions.opts.xAxis.range.userDefined.size">

                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                범위시작
                                                            </td>
                                                            <td>
                                                                <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                       ng-model="adv.fieldOptions.opts.xAxis.range.userDefined.start">

                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                범위끝
                                                            </td>
                                                            <td>
                                                                <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                       ng-model="adv.fieldOptions.opts.xAxis.range.userDefined.end">

                                                            </td>
                                                        </tr>
                                                    </table>

                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>
                                                <label>최대개수:</label>
                                            </th>
                                            <td>
                                                <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                       ng-model="adv.fieldOptions.opts.xAxis.maxCount">
                                            </td>
                                        </tr>

                                        </tbody>
                                    </table>


                                </div>

                                <div class="mu-item-group" style="padding-top: 10px;height: 30px;">
                                    <button class="mu-btn btnApply fr" type="button" ng-click="saveXAxisFieldOption(timeField.sort.selected)"><spring:message code="save" /></button>
                                </div>
                            </div>
                        </div>
                        <!-- // 팝업 레이어: value Field 설정 -->


                        <!--<div ui-on-Drop="onDropValueField($event, $data)" class="drop-container">-->
                            <!--<div class="field bx-none" ng-if="!adv.valueField" style="">없음</div>-->
                            <!--<div class="field" ng-if="adv.valueField" popup-layer-area="adv.valueField.setting" layer-offset="{left: 2}">-->
                                <!--<button class="fr"> > </button>-->
                                <!--<button type="button" class="close fl" ng-click="clearValueField()"></button>-->
                                <!--<div>{{adv.valueField.name}}</div>-->
                            <!--</div>-->
                        <!--</div>-->

                        <!--&lt;!&ndash; 팝업 레이어: Group Field 설정 &ndash;&gt;-->
                        <!--<div class="mu-tooltip bottom-right" style="width: 426px;" popup-layer="adv.valueField.setting">-->
                            <!--<div class="arrow"></div>-->
                            <!--<div class="mu-tooltip-inner">-->

                                <!--<span class="title">{{adv.valueField.name}}</span>-->
                                <!--&lt;!&ndash; selectbox: 모델 &ndash;&gt;-->
                                <!--<div class="mu-search-item timeRelative">-->
                                    <!--<div class="mu-item-group">-->
                                        <!--<label>Summary 방식:</label>-->
                                        <!--<div class="mu-selectbox" mu-select="sb1" select-model="valueField.summaryMethodSelected"-->
                                             <!--select-items="valueField.summaryMethods" select-change="changeOption($model)">-->
                                            <!--<button class="mu-value">{{$model.text}}</button>-->
                                            <!--<ul class="mu-list">-->
                                                <!--<li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>-->
                                            <!--</ul>-->
                                        <!--</div>-->
                                        <!--<input ng-if="valueField.summaryMethodSelected.value==='userDefined'" type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"-->
                                               <!--ng-model="valueField.summaryTime">-->
                                        <!--<label ng-if="valueField.summaryMethodSelected.value==='userDefined'" ><i class="mu-icon-img help" style="cursor: pointer" mu-tooltip-area="anomaly.ttip.model" tooltip-placement="top" tooltip-trigger="click"></i></label>-->
                                        <!--&lt;!&ndash; text tooltip &ndash;&gt;-->
                                        <!--<div class="mu-tooltip" style="z-index: 30;" mu-tooltip="anomaly.ttip.model">-->
                                            <!--<div class="arrow"></div>-->
                                            <!--<div class="mu-tooltip-inner">-->
                                                <!--<spring:message code="anomaly.tooltip.model" var="ttip_model" />-->
                                                <!--<div ng-repeat="line in '${ttip_model}'.split('\n') track by $index">{{line}}<br/></div>-->
                                            <!--</div>-->
                                        <!--</div>-->
                                    <!--</div>-->
                                <!--</div>-->

                                <!--<div class="mu-item-group" style="padding-top: 10px;height: 30px;">-->
                                    <!--<button class="mu-btn btnApply fr" type="button" ng-click="saveValueFieldOption(valueField.summaryMethodSelected, groupField.summaryTime)"><spring:message code="save" /></button>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</div>-->
                        <!--&lt;!&ndash; // 팝업 레이어: Group Field 설정 &ndash;&gt;-->


                    </div>
                    <div class="mu-col mu-col-8">
                    </div>
                </div>
            </div>
        </div>

        <div class="mu-row chart-row">
            <div id="table-container" class="mu-col mu-col-11 full-height" style="overflow: scroll">

                <table class="mu-formbox mu-formbox-vertical" style="height: 100%">
                    <colgroup>
                        <col width="50px">
                    </colgroup>
                    <tr>
                        <td>
                            <div ui-on-Drop="onDropYAxisField($event, $data)" class="drop-container"
                                 style="height:100%;">
                                <div ng-if="!adv.yAxisField"
                                     style="height: 100%">
                                    <div style="height: calc(100% - 0px); position: relative">
                                        <div style="position: absolute;top: 50%; left: 50%;
                                         -webkit-transform: translateX(-50%) translateY(-50%) rotate(-90deg);
                                        transform:  translateX(-50%) translateY(-50%) rotate(-90deg);
                                        text-overflow: ellipsis; white-space: nowrap">
                                            없음
                                        </div>
                                    </div>
                                </div>
                                <div ng-if="adv.yAxisField"
                                     style="height: 100%"
                                     popup-layer-area="adv.axisField.setting_{{$index}}">
                                    <div>
                                        <button> > </button>
                                    </div>
                                    <div style="height: calc(100% - 50px); position: relative">
                                        <div style="position: absolute;top: 50%; left: 50%;
                                         -webkit-transform: translateX(-50%) translateY(-50%) rotate(-90deg);
                                        transform:  translateX(-50%) translateY(-50%) rotate(-90deg);
                                        text-overflow: ellipsis; white-space: nowrap">
                                            {{adv.yAxisField.name}}
                                        </div>
                                    </div>
                                    <div>
                                        <button type="button" class="close" ng-click="clearAxisField($index)"></button>
                                    </div>
                                </div>
                            </div>












                            <div ui-on-Drop="onDropField($event, $data, 'yAxisField', 'right-top')" class="drop-container" layer-offset="{left: 2}">
                                <span class="field" ng-if="!adv.fieldOptions.drops.yAxisField" style="">없음</span>
                                <div class="field" ng-if="adv.fieldOptions.drops.yAxisField">
                                    <button class="fr" ng-click="openPopup($event, 'adv.yAxisField.setting', 'right-top')"> > </button>
                                    <button type="button" class="close fl" ng-click="clearField($event, 'yAxisField')"></button>
                                    <div>{{adv.fieldOptions.drops.yAxisField.name}}</div>
                                </div>
                            </div>

                            <!-- 팝업 레이어: y축 Field 설정 -->
                            <div class="mu-tooltip top-right" style="width: 426px;" popup-layer="adv.yAxisField.setting">
                                <div class="arrow"></div>
                                <div class="mu-tooltip-inner">

                                    <span class="title">{{adv.yAxisField.name}}</span>
                                    <!-- selectbox: 모델 -->
                                    <div class="mu-search-item timeRelative">

                                        <table class="mu-formbox">
                                            <colgroup>
                                                <col width="100px">
                                            </colgroup>
                                            <tbody>
                                            <tr>
                                                <th>
                                                    <label>정렬:</label>
                                                </th>
                                                <td>
                                                    <div class="mu-selectbox" mu-select="sb1" select-model="adv.fieldOptions.opts.xAxis.sort.selected"
                                                         select-items="adv.fieldOptions.opts.xAxis.sort.list" select-change="changeOption($model)">
                                                        <button class="mu-value">{{$model.text}}</button>
                                                        <ul class="mu-list">
                                                            <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                                                        </ul>
                                                    </div>

                                                </td>
                                            </tr>

                                            <tr>
                                                <th>
                                                    <label>범위만들기:</label>
                                                </th>
                                                <td>
                                                    <div class="mu-btn-group">
                                                        <button class="mu-btn" ng-class="{'active': adv.fieldOptions.opts.xAxis.range.selected === 'userDefined'}"
                                                                ng-click="adv.fieldOptions.opts.xAxis.range.selected = 'userDefined'">사용자지정</button>
                                                        <button class="mu-btn" ng-class="{'active': adv.fieldOptions.opts.xAxis.range.selected === 'notUse'}"
                                                                ng-click="adv.fieldOptions.opts.xAxis.range.selected = 'notUse'">만들지 않음</button>
                                                    </div>
                                                    <div ng-show="adv.fieldOptions.opts.xAxis.range.selected === 'userDefined'">
                                                        <table>
                                                            <tr>
                                                                <td>
                                                                    범위크기
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                           ng-model="adv.fieldOptions.opts.xAxis.range.userDefined.size">

                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    범위시작
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                           ng-model="adv.fieldOptions.opts.xAxis.range.userDefined.start">

                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    범위끝
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                           ng-model="adv.fieldOptions.opts.xAxis.range.userDefined.end">

                                                                </td>
                                                            </tr>
                                                        </table>

                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <th>
                                                    <label>최대개수:</label>
                                                </th>
                                                <td>
                                                    <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                           ng-model="adv.fieldOptions.opts.xAxis.maxCount">
                                                </td>
                                            </tr>

                                            </tbody>
                                        </table>


                                    </div>

                                    <div class="mu-item-group" style="padding-top: 10px;height: 30px;">
                                        <button class="mu-btn btnApply fr" type="button" ng-click="saveYAxisFieldOption(timeField.sort.selected)"><spring:message code="save" /></button>
                                    </div>
                                </div>
                            </div>
                            <!-- // 팝업 레이어: y축 Field 설정 -->


                            <!-- 팝업 레이어: Axis Field 설정 -->
                            <!--<div class="mu-tooltip right-top" style="width: 365px;" popup-layer="adv.axisField.setting_{{$index}}">-->
                                <!--<div class="arrow"></div>-->

                                <!--<div class="mu-tooltip-inner">-->

                                    <!--<span class="title">{{field.axis.name}}</span>-->
                                    <!--&lt;!&ndash; selectbox: 모델 &ndash;&gt;-->
                                    <!--<div class="mu-search-item timeRelative">-->
                                        <!--<div class="mu-item-group">-->
                                            <!--<label>Summary 방식:</label>-->
                                            <!--<div class="mu-selectbox" mu-select="sb1" select-model="yAxisField.summaryMethodSelected"-->
                                                 <!--select-items="yAxisField.summaryMethods" select-change="changeOption($model)">-->
                                                <!--<button class="mu-value">{{$model.text}}</button>-->
                                                <!--<ul class="mu-list">-->
                                                    <!--<li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>-->
                                                <!--</ul>-->
                                            <!--</div>-->
                                        <!--</div>-->
                                        <!--<div class="mu-item-group">-->
                                            <!--<label>빠진값 채우기:</label>-->
                                            <!--<div class="mu-selectbox" mu-select="sb1" select-model="yAxisField.fillSelected"-->
                                                 <!--select-items="yAxisField.fills" select-change="changeOption($model)">-->
                                                <!--<button class="mu-value">{{$model.text}}</button>-->
                                                <!--<ul class="mu-list">-->
                                                    <!--<li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>-->
                                                <!--</ul>-->
                                            <!--</div>-->
                                            <!--<input ng-if="yAxisField.fillSelected.value==='userDefined'" type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"-->
                                                   <!--ng-model="yAxisField.fillValue">-->
                                        <!--</div>-->
                                    <!--</div>-->

                                    <!--<div class="mu-item-group" style="padding-top: 10px;height: 30px;">-->
                                        <!--<button class="mu-btn btnApply fr" type="button"-->
                                                <!--ng-click="saveYAxisFieldOption(yAxisField.summaryMethodSelected, yAxisField.fillSelected, yAxisField.fillValue)">-->
                                            <!--<spring:message code="save" /></button>-->
                                    <!--</div>-->
                                <!--</div>-->



                            <!--</div>-->
                            <!-- // 팝업 레이어: Axis Field 설정 -->


                        </td>
                        <td>
                            <div style="height:100%;border : 1px solid #999">
                                <div ng-if="!config" class="center">
                                    <span style="font-size:1.2em">결과가 이곳에 출력됩니다.</span>
                                </div>
                                <div ng-if="config" style="position:relative; height: 100%;">
                                    <highchart
                                            style="position: absolute; left:0; top:0px; bottom:0; right:0; height: 100%; margin: auto"
                                            config="config">
                                    </highchart>
                                </div>
                            </div>
                        </td>
                    </tr>

                </table>
            </div>
        </div>
        <div class="mu-row">
            <div class="mu-col mu-col-1"></div>
            <div class="mu-col mu-col-10">
                <div class="mu-row">
                    <div class="mu-col mu-col-1" style="text-align: right; padding-right: 10px;">
                        <span style="display: inline-block; margin-top: 6px">X축</span>
                    </div>
                    <div class="mu-col mu-col-10">


                        <div ui-on-Drop="onDropField($event, $data, 'xAxisField', 'top-right')" class="drop-container" layer-offset="{left: 2}">
                            <span class="field" ng-if="!adv.fieldOptions.drops.xAxisField" style="">없음</span>
                            <div class="field" ng-if="adv.fieldOptions.drops.xAxisField">
                                <button class="fr" ng-click="openPopup($event, 'adv.xAxisField.setting', 'top-right')"> > </button>
                                <button type="button" class="close fl" ng-click="clearField($event, 'xAxisField')"></button>
                                <div>{{adv.fieldOptions.drops.xAxisField.name}}</div>
                            </div>
                        </div>

                        <!-- 팝업 레이어: x축 Field 설정 -->
                        <div class="mu-tooltip top-right" style="width: 426px;" popup-layer="adv.xAxisField.setting">
                            <div class="arrow"></div>
                            <div class="mu-tooltip-inner">

                                <span class="title">{{adv.xAxisField.name}}</span>
                                <!-- selectbox: 모델 -->
                                <div class="mu-search-item timeRelative">

                                    <table class="mu-formbox">
                                        <colgroup>
                                            <col width="100px">
                                        </colgroup>
                                        <tbody>
                                        <tr>
                                            <th>
                                                <label>정렬:</label>
                                            </th>
                                            <td>
                                                <div class="mu-selectbox" mu-select="sb1" select-model="adv.fieldOptions.opts.xAxis.sort.selected"
                                                     select-items="adv.fieldOptions.opts.xAxis.sort.list" select-change="changeOption($model)">
                                                    <button class="mu-value">{{$model.text}}</button>
                                                    <ul class="mu-list">
                                                        <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                                                    </ul>
                                                </div>

                                            </td>
                                        </tr>

                                        <tr>
                                            <th>
                                                <label>범위만들기:</label>
                                            </th>
                                            <td>
                                                <div class="mu-btn-group">
                                                    <button class="mu-btn" ng-class="{'active': adv.fieldOptions.opts.xAxis.range.selected === 'userDefined'}"
                                                            ng-click="adv.fieldOptions.opts.xAxis.range.selected = 'userDefined'">사용자지정</button>
                                                    <button class="mu-btn" ng-class="{'active': adv.fieldOptions.opts.xAxis.range.selected === 'notUse'}"
                                                            ng-click="adv.fieldOptions.opts.xAxis.range.selected = 'notUse'">만들지 않음</button>
                                                </div>
                                                <div ng-show="adv.fieldOptions.opts.xAxis.range.selected === 'userDefined'">
                                                    <table>
                                                        <tr>
                                                            <td>
                                                                범위크기
                                                            </td>
                                                            <td>
                                                                <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                       ng-model="adv.fieldOptions.opts.xAxis.range.userDefined.size">

                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                범위시작
                                                            </td>
                                                            <td>
                                                                <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                       ng-model="adv.fieldOptions.opts.xAxis.range.userDefined.start">

                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                범위끝
                                                            </td>
                                                            <td>
                                                                <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                       ng-model="adv.fieldOptions.opts.xAxis.range.userDefined.end">

                                                            </td>
                                                        </tr>
                                                    </table>

                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>
                                                <label>최대개수:</label>
                                            </th>
                                            <td>
                                                <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                                       ng-model="adv.fieldOptions.opts.xAxis.maxCount">
                                            </td>
                                        </tr>

                                        </tbody>
                                    </table>


                                </div>

                                <div class="mu-item-group" style="padding-top: 10px;height: 30px;">
                                    <button class="mu-btn btnApply fr" type="button" ng-click="saveXAxisFieldOption(timeField.sort.selected)"><spring:message code="save" /></button>
                                </div>
                            </div>
                        </div>
                        <!-- // 팝업 레이어: x축 Field 설정 -->

                    </div>
                </div>

            </div>
        </div>

    </div>

</div>
