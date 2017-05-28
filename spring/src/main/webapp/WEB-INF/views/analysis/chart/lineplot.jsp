<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<div ng-controller="analysis.chart.LineplotCtrl" class="full-height"
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
                    <button type="button" class="mu-btn mu-btn-icon"><i class="mu-icon save"></i>저장</button>
                </div>
            </div>
        </div>
    </div>

    <div class="main-container" style="margin-top: 10px;">

        <div class="mu-row">
            <div class="mu-col mu-col-1">
                <button type="button" ng-click="addRow()" class="mu-btn mu-btn-icon fl" style="margin-left: 12px"><i class="mu-icon add"></i>
                </button>
            </div>
            <div class="mu-col mu-col-11">
                <div class="mu-row">
                    <div class="mu-col mu-col-1" style="text-align: right; padding-right: 10px;">
                        <span style="display: inline-block; margin-top: 6px">그룹</span>
                    </div>
                    <div class="mu-col mu-col-3">
                        <div ui-on-Drop="onDropGroupField($event, $data)" class="drop-container">
                            <div class="field bx-none" ng-if="!adv.groupField">없음</div>
                            <div class="field " ng-if="adv.groupField">
                                {{adv.groupField.name}}
                                <button type="button" class="close fr" ng-click="clearGroupField()"></button>
                            </div>
                        </div>
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
                    <tr ng-repeat="field in adv.chartData">
                        <td>
                            <div ui-on-Drop="onDropAxisField($event, $data, $index)"
                                 ng-style="{'min-height' : adv.chartOpts.opts.normal.minHeight - 4 + 'px'}"
                                 style="height:100%; border:1px solid #999;"
                                 >
                                <div ng-if="!field.axis"
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
                                <div ng-if="field.axis"
                                     style="height: 100%"
                                     popup-layer-area="adv.axisField.setting_{{$index}}">
                                    <div>
                                        <button> > </button>
                                    </div>
                                    <div style="height: calc(100% - 40px); position: relative">
                                        <div style="position: absolute;top: 50%; left: 50%;
                                        -webkit-transform: translateX(-50%) translateY(-50%) rotate(-90deg);
                                        transform:  translateX(-50%) translateY(-50%) rotate(-90deg);
                                        text-overflow: ellipsis; white-space: nowrap">
                                            {{field.axis.name}}
                                        </div>
                                    </div>
                                    <div>
                                        <button type="button" class="close" ng-click="clearAxisField($index)"></button>
                                    </div>
                                </div>
                            </div>

                            <!-- 팝업 레이어: Axis Field 설정 -->
                            <div class="mu-tooltip right-top" style="width: 360px;" popup-layer="adv.axisField.setting_{{$index}}">
                                <div class="arrow"></div>
                                <div class="mu-tooltip-inner">
                                    <span class="title">{{field.axis.name}}</span>
                                    <div class="mu-item-group">
                                        <table class="mu-formbox mu-formbox-vertical">
                                            <colgroup>
                                                <col width="80">
                                                <col width="100">
                                                <col width="10">
                                            </colgroup>
                                            <tbody>
                                            <tr ng-repeat="tempFilter in adv.tempFilters">
                                                <td>
                                                    <div class="mu-selectbox" mu-select-v2="" select-model="tempFilter.key">
                                                        <button class="mu-value" title="{{models[tempFilter.key]}}">{{models[tempFilter.key]}}</button>
                                                        <ul class="mu-list">
                                                            <li ng-repeat="(value, name) in models" mu-option-v2="value" title="{{name}}">{{name}}</li>
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td>
                                                    <input type="text" ng-change="$last && addTempFilter(adv.tempFilters, inputFilter)" ng-model="tempFilter.value" class="mu-input mu-input-default">
                                                </td>
                                                <td>
                                                    <button type="button"
                                                            ng-click="deleteTempFilter($index, tempFilter)"
                                                            class="mu-btn mu-btn-icon mu-btn-bg-non"><i class="fa fa-minus-circle" aria-hidden="true"></i></button>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <!--<button ng-click="addTempFilter(adv.tempFilters, inputFilter)" style="padding-top: 5px; margin-top: 5px; margin-left: 10px;"><i class="mu-icon add"></i></button>-->
                                        <button type="button"
                                                ng-click="addTempFilter(adv.tempFilters, inputFilter)"
                                                style="background: #fff; border: 1px solid #ccc; padding: 3px"
                                                class="mu-btn mu-btn-icon mu-btn-icon-only">
                                            <i class="mu-icon-img add"></i>
                                        </button>
                                    </div>
                                    <div class="mu-item-group" style="padding-top: 10px;height: 30px;">
                                        <button class="mu-btn btnApply fr" type="button" ng-click="saveFilter(adv.selectedField, adv.tempFilters)"><spring:message code="save" /></button>
                                    </div>
                                </div>
                            </div>
                            <!-- // 팝업 레이어: Axis Field 설정 -->


                        </td>
                        <td>
                            <div id="container_{{$index}}"
                                 ng-style="{'min-height' : adv.chartOpts.opts.normal.minHeight + 'px'}" style="height:100%;border : 1px solid #999">
                                <div  ng-if="!field.config" class="center">
                                    <span style="font-size:1.2em">결과가 이곳에 출력됩니다.</span>
                                </div>
                                <div ng-if="field.config" style="position:relative; height: 100%;">
                                    <highchart
                                            style="position: absolute; left:0; top:0px; bottom:0; right:0; height: 100%; margin: auto"
                                            config="field.config">
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
                        <span style="display: inline-block; margin-top: 6px">시간</span>
                    </div>
                    <div class="mu-col mu-col-10">


                        <div id="mytimefield" ui-on-Drop="onDropTimeField($event, $data)" class="drop-container">
                            <div class="field bx-none" ng-if="!adv.timeField" style="">없음</div>
                            <div class="field" ng-if="adv.timeField" popup-layer-area="adv.timeField.setting" layer-offset="{left: 2}">
                                <button class="fr"> > </button>
                                <button type="button" class="close fl" ng-click="clearTimeField()"></button>
                                <div>{{adv.timeField.name}}</div>
                            </div>
                        </div>

                        <!-- 팝업 레이어: Time Field 설정 -->
                        <div class="mu-tooltip top-right" style="width: 426px;" popup-layer="adv.timeField.setting">
                            <div class="arrow"></div>
                            <div class="mu-tooltip-inner">

                                <span class="title">{{adv.timeField.name}}</span>
                                <!-- selectbox: 모델 -->
                                <div class="mu-search-item timeRelative">
                                    <div class="mu-item-group">
                                        <label>Summary 시간단위:</label>
                                        <div class="mu-selectbox" mu-select="sb1" select-model="selModel" select-items="selOptions" select-change="changeOption($model)">
                                            <button class="mu-value">{{$model.text}}</button>
                                            <ul class="mu-list">
                                                <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                                            </ul>
                                        </div>
                                        <input ng-if="selModel.value==='userDefined'" type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty" ng-model="adv.xAxisSummary">
                                        <!--<div class="timeView ng-binding" ng-bind="choosedDate(relval.start, relStart.value)">2017/05/21 00:00:00</div>-->
                                        <label ng-if="selModel.value==='userDefined'" ><i class="mu-icon-img help" style="cursor: pointer" mu-tooltip-area="anomaly.ttip.model" tooltip-placement="top" tooltip-trigger="click"></i></label>
                                        <!-- text tooltip -->
                                        <div class="mu-tooltip" style="z-index: 30;" mu-tooltip="anomaly.ttip.model">
                                            <div class="arrow"></div>
                                            <div class="mu-tooltip-inner">
                                                <spring:message code="anomaly.tooltip.model" var="ttip_model" />
                                                <div ng-repeat="line in '${ttip_model}'.split('\n') track by $index">{{line}}<br/></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="mu-item-group" style="padding-top: 10px;height: 30px;">
                                    <button class="mu-btn btnApply fr" type="button" ng-click="saveXAxisOption(selModel, adv.xAxisSummary)"><spring:message code="save" /></button>
                                </div>
                            </div>
                        </div>
                        <!-- // 팝업 레이어: Time Field 설정 -->

                    </div>
                </div>

            </div>
        </div>

    </div>

</div>
