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

                    <%@ include file="./chart_option_dlg.jsp"%>

                </div>
                <div class="mu-col mu-col-6">
                </div>
                <div class="mu-col mu-col-3">
                    <button type="button" class="mu-btn mu-btn-icon" ng-click="exportSankey()"><i class="mu-icon save"></i>저장</button>
                </div>
            </div>
        </div>
    </div>

    <div class="main-container" style="height: 100%">
        <div class="mu-col mu-col-11" style="height: 100%">
            <table style="width:100%; height: 100%">
                <colgroup>
                    <col width="50px">
                </colgroup>
                <tr style="height: 0;">
                    <td></td>
                    <td>
                        <div class="mu-row">
                            <div class="mu-col mu-col-1" style="text-align: right; padding-right: 10px;">
                                <span style="display: inline-block; margin-top: 6px">가중치</span>
                            </div>
                            <div class="mu-col mu-col-3">

                                <%@ include file="../options/sankey/weight.jsp"%>

                            </div>
                            <div class="mu-col mu-col-8">
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td style="background: blue">
                        <div id="chart" style="background: #fff; height: 100%; border: 1px solid #999; position:relative">
                            <div ng-if="!options" class="center">
                                <span style="font-size:1.2em">결과가 이곳에 출력됩니다.</span>
                            </div>
                            <div id="imagesave" ng-if="options" style="background-color:white; position:absolute; top:0; left:0; bottom:0; right:0; text-align: left">
                                <!--<chart-sankey id="sankeyChart"  options="config.options" data="config.data"></chart-sankey>-->

                                <div google-chart="Sankey"
                                     gc-data="chart"
                                     gc-options="options"
                                     gce-select="onSelect()"
                                     gce-ready="onReady()"
                                     gce-on-mouse-over="mouseOver()"
                                     gce-on-mouse-out="mouseOut()"
                                ></div>
                                <div ng-if="chartOpts.column.label.controls.checkbox.value" style="background: #fff; text-align: center; font-size: 16px;">
                                    {{chartOpts.column.label.controls.input.value}}
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr style="height: 0;">
                    <td>
                        <button type="button" ng-click="addField(fieldOpts.drops.columnFields)"><i class="mu-icon add"></i>
                        </button>
                    </td>
                    <td>
                        <%@ include file="../options/sankey/xAxis.jsp"%>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</div>
