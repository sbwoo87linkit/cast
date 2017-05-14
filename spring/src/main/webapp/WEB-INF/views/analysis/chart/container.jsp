<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="analysis-container" ng-controller="analysis.chart.ContainerCtrl" id="ade_div_chart_cont">
    <div class="analysis-filter">
        <%@ include file="filter.jsp"%>
    </div>


    <div class="analysis-chart">

    <!--
         <div class="mu-row analysis-chart-header" style="padding: 3px">
            <div class="mu-col mu-col-4">
                <%@ include file="choose_chart.jsp"%>
            </div>
            <div class="mu-col mu-col-8">
                <div class="mu-row">
                    <div class="mu-col mu-col-3">
                        대상필드 {{$id}}
                    </div>
                    <div class="mu-col mu-col-3">
                        <div class='wrapper'>
                            <div class='tableRow'>
                                <div id="containerRight" class='containerVertical'>
                                    <div ng-repeat="field in outlier_top track by $index"
                                         ng-dblclick="outlier_top.splice($index, 1)">{{field.name}}-{{$id}}</div>
                                    <span ng-show="outlier_top.length == 0" class="dragular-none">없음</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="mu-col mu-col-6">
                        {{$id}}-{{outlier_top}}
                    </div>
                </div>
            </div>
        </div><
        -->

        <div class="mu-row analysis-chart-main">
            <!--<div>-->
                <!--{{$id}} - {{analysis.chart}}-->
            <!--</div>-->

            <!--#############################-->
            <!--none-->
            <!--#############################-->
            <div ng-if="analysis.chart.icon === 'none'" style="height: 100%">
                <%@ include file="none.jsp"%>
            </div>

            <!--#############################-->
            <!--Line plot-->
            <!--#############################-->
            <div ng-show="analysis.chart.type === 'Line plot'">
                <%@ include file="lineplot.jsp"%>
            </div>

            <!--#############################-->
            <!--Scatter plot-->
            <!--#############################-->
            <div ng-show="analysis.chart.type === 'Scatter plot'">
                Scatter plot
            </div>

            <!--#############################-->
            <!--Motion-->
            <!--#############################-->
            <div ng-show="analysis.chart.type === 'Motion'">
                Motion
            </div>

            <!--#############################-->
            <!--Histogram-->
            <!--#############################-->
            <div ng-show="analysis.chart.type === 'Histogram'">
                Histogram
            </div>

            <!--#############################-->
            <!--Bar chart-->
            <!--#############################-->
            <div ng-show="analysis.chart.type === 'Bar chart'">
                Bar chart
            </div>

            <!--#############################-->
            <!--Pie chart-->
            <!--#############################-->
            <div ng-show="analysis.chart.type === 'Pie chart'">
                Pie chart
            </div>

            <!--#############################-->
            <!--Shanky-->
            <!--#############################-->
            <div ng-show="analysis.chart.type === 'Shanky'">
                Shanky
            </div>

            <!--#############################-->
            <!--Heatmap-->
            <!--#############################-->
            <div ng-show="analysis.chart.type === 'Heatmap'">
                Heatmap
            </div>

            <!--#############################-->
            <!--Outlier-->
            <!--#############################-->
            <div ng-show="analysis.chart.type === 'Outlier'">
                <%@ include file="outlier.jsp"%>
            </div>
        </div>

        <!--<div class="analysis-chart-header" style="padding: 5px">-->



        <!--</div>-->
        <!---->
        <!---->
        <!--<div class="analysis-chart-main">-->


        <!--</div>-->
    </div>
</div>


