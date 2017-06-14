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

                    <!--{{adv.chartOpts.opts.normal.minHeight}}-->
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

                        <%@ include file="../options/sankey/weight.jsp"%>

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
                            <div style="position:absolute; top:0; left:0; bottom:0; right:0; border : 1px solid #999; text-align: left">
                                <div ng-if="!isReady" class="center">
                                    <span style="font-size:1.2em">결과가 이곳에 출력됩니다.</span>
                                </div>
                                <chart-sankey id="sankeyChart" options="config.options" data="config.data"></chart-sankey>
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

                <%@ include file="../options/sankey/xAxis.jsp"%>

            </div>
        </div>


        <!--<table class="mu-formbox mu-formbox-vertical" style="height: 100%">-->
            <!--<colgroup>-->
                <!--<col width="50px">-->
            <!--</colgroup>-->
            <!--<tr>-->
                <!--<td>-->
                <!--</td>-->
                <!--<td>-->
                    <!--<div style="position:absolute; top:0; left:0; bottom:0; right:0; border : 1px solid #999; text-align: left">-->
                        <!--<div ng-if="!isReady" class="center">-->
                            <!--<span style="font-size:1.2em">결과가 이곳에 출력됩니다.</span>-->
                        <!--</div>-->
                        <!--<chart-sankey id="sankeyChart" options="config.options" data="config.data"></chart-sankey>-->
                    <!--</div>-->
                <!--</td>-->
            <!--</tr>-->
            <!--<tr>-->
                <!--<td>-->
                <!--</td>-->
                <!--<td>-->
                    <!--<div style="position:absolute; top:0; left:0; bottom:0; right:0; border : 1px solid #999; text-align: left">-->
                        <!--<div ng-if="!isReady" class="center">-->
                            <!--<span style="font-size:1.2em">결과가 이곳에 출력됩니다.</span>-->
                        <!--</div>-->
                        <!--<chart-sankey id="sankeyChart" options="config.options" data="config.data"></chart-sankey>-->
                    <!--</div>-->
                <!--</td>-->
            <!--</tr>-->
            <!--<tr>-->
                <!--<td>+-->
                <!--</td>-->
                <!--<td>-->
                    <!--<div style="position:absolute; top:0; left:0; bottom:0; right:0; border : 1px solid #999; text-align: left">-->
                        <!--<div ng-if="!isReady" class="center">-->
                            <!--<span style="font-size:1.2em">결과가 이곳에 출력됩니다.</span>-->
                        <!--</div>-->
                        <!--<chart-sankey id="sankeyChart" options="config.options" data="config.data"></chart-sankey>-->
                    <!--</div>-->
                <!--</td>-->
            <!--</tr>-->

        <!--</table>-->


    </div>

</div>
