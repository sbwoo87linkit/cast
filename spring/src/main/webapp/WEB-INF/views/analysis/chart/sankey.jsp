<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<div ng-controller="analysis.chart.SankeyCtrl" class="full-height"
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
                        <span style="display: inline-block; margin-top: 6px">가중치</span>
                    </div>
                    <div class="mu-col mu-col-3">

                        <div ui-on-Drop="onDropWeightField($event, $data)" class="drop-container">
                            <div class="field bx-none" ng-if="!adv.weightField" style="">없음</div>
                            <div class="field" ng-if="adv.weightField" popup-layer-area="adv.weightField.setting" layer-offset="{left: 2}">
                                <button class="fr"> > </button>
                                <button type="button" class="close fl" ng-click="clearWeightField()"></button>
                                <div>{{adv.weightField.name}}</div>
                            </div>
                        </div>

                        <!-- 팝업 레이어: weightField 설정 -->
                        <div class="mu-tooltip bottom-right" style="width: 426px;" popup-layer="adv.weightField.setting">
                            <div class="arrow"></div>
                            <div class="mu-tooltip-inner">

                                <span class="title">{{adv.weightField.name}}</span>
                                <!-- selectbox: 모델 -->
                                <div class="mu-search-item timeRelative">
                                    <div class="mu-item-group">
                                        <label>Summary 방식:</label>
                                        <div class="mu-selectbox" mu-select="sb1" select-model="weightField.summaryMethodSelected"
                                             select-items="weightField.summaryMethods" select-change="changeOption($model)">
                                            <button class="mu-value">{{$model.text}}</button>
                                            <ul class="mu-list">
                                                <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                                            </ul>
                                        </div>
                                        <input ng-if="weightField.summaryMethodSelected.value==='userDefined'" type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                               ng-model="weightField.summaryMethod">
                                        <label ng-if="weightField.summaryMethodSelected.value==='userDefined'" ><i class="mu-icon-img help" style="cursor: pointer" mu-tooltip-area="anomaly.ttip.model" tooltip-placement="top" tooltip-trigger="click"></i></label>
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
                                    <button class="mu-btn btnApply fr" type="button" ng-click="saveWeightFieldOption(weightField.summaryMethodSelected, weightField.summaryMethod)"><spring:message code="save" /></button>
                                </div>
                            </div>
                        </div>
                        <!-- // 팝업 레이어: weightField 설정 -->


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


                        </td>
                        <td>
                            <div style="height:100%; width: 100%; border : 1px solid #999; text-align: left">
                                <div ng-if="!isReady" class="center">
                                    <span style="font-size:1.2em">결과가 이곳에 출력됩니다.</span>
                                </div>
                                <div id="chart-container" ng-if="isReady" style="position:relative; width:100%; height: 100%;">
                                    <ng-sankey id="sankeyChart" options="config.options" data="config.data" style="width:100%; height: 100%;"></ng-sankey>
                                </div>

                                <!--<ng-sankey id="sankeyChart" options="config.options" data="config.data" style="width:100%; height: 100%;"></ng-sankey>-->


                            </div>
                        </td>
                    </tr>

                </table>
            </div>
        </div>

        <div class="mu-row">
            <!--<div class="mu-col mu-col-1">-->
            <!--</div>-->
            <div class="mu-col mu-col-11 full-height" style="overflow: scroll">

                <table class="mu-formbox mu-formbox-vertical" style="height: 100%">
                    <colgroup>
                        <col width="50px">
                    </colgroup>
                    <tr>
                        <td>
                            <button type="button" ng-click="addXAxis()"><i class="mu-icon add"></i>
                            </button>
                        </td>
                        <td>
                            <div class="eqi-container">

                                <div ng-repeat="field in adv.chartData"
                                     ui-on-Drop="onDropXAxisField($event, $data, $index)" class="drop-container">
                                    <div class="field bx-none" ng-if="!field.name" style="">
                                        없음
                                        <button ng-if="$middle" type="button" class="close fr" ng-click="deleteXAxisField($index)"></button>
                                    </div>
                                    <div class="field" ng-if="field.name">
                                        <button type="button" class="close fr" ng-click="removeXAxisField($index)"></button>
                                        <div>{{field.name}}</div>
                                    </div>
                                </div>

                            </div>
                        </td>
                    </tr>

                </table>
            </div>
        </div>

    </div>

</div>
