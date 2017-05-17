<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="analysis-container" ng-controller="analysis.chart.ContainerCtrl" id="ade_div_chart_cont">
    <div class="analysis-filter">
        <%@ include file="filter.jsp"%>
    </div>

    <div class="analysis-chart">

        <div class="mu-row analysis-chart-main">

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

    </div>
</div>


