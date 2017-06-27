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
                    <button type="button" class="mu-btn mu-btn-icon" ng-click="export(config)"><i class="mu-icon save"></i>저장</button>
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
            <div class="mu-col mu-col-10">

                <drop-field ng-repeat="field in fieldOpts.groupArr"
                            field="field.drop"
                            option="field.option"
                            show-popup="true"
                            show-label="true"
                            position="bottom-right"
                            col-width="3"
                            parent-array="fieldOpts.groupArr"
                            index="{{$index}}"
                            middle="{{$middle}}"
                            class="" ></drop-field>

            </div>
        </div>

        <div class="mu-row chart-row">
            <div id="table-container" class="mu-col mu-col-11 full-height" style="overflow: scroll">

                <table class="mu-formbox mu-formbox-vertical" style="height: 100%">
                    <colgroup>
                        <col width="50px">
                    </colgroup>
                    <tr ng-repeat="field in fieldOpts.yAxisArr">
                        <td ng-dblclick="removeRow($index)" style="height: 350px">


                            <drop-field class="verical-field"
                                        field="field.drop"
                                        option="field.option"
                                        show-popup="true"
                                        show-label="true"
                                        position="top-right"
                                        col-width="11"
                                        layout="vertical"
                                        parent-array="fieldOpts.yAxisArr"
                                        index="{{$index}}"
                                        middle="{{$middle}}"></drop-field>
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

                    <drop-field ng-repeat="field in fieldOpts.timeArr"
                                field="field.drop"
                                option="field.option"
                                show-popup="true"
                                show-label="true"
                                position="top-right"
                                col-width="11"
                                parent-array="fieldOpts.timeArr"
                                index="{{$index}}"
                                middle="{{$middle}}"
                                class="" ></drop-field>


                </div>

            </div>
        </div>

    </div>

</div>
