<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="analysis-container" ng-controller="analysis.chart.ContainerCtrl" id="ade_div_chart_cont">
    <div class="analysis-filter">
        <%@ include file="filter.jsp"%>
    </div>

    <div class="analysis-chart">

        <div class="mu-row analysis-chart-main">

            <!--none-->
            <div ng-if="adv.chart.icon === 'none'" class="full-height">
                <%@ include file="none.jsp"%>
            </div>

            <!--Line plot-->
            <div ng-if="adv.chart.type === 'Line plot'" class="full-height">
                <%@ include file="lineplot.jsp"%>
            </div>

            <!--Scatter plot-->
            <div ng-if="adv.chart.type === 'Scatter plot'" class="full-height">
                <%@ include file="scatterplot.jsp"%>
            </div>

            <!--Motion-->
            <div ng-if="adv.chart.type === 'Motion'" class="full-height">
                <%@ include file="motion.jsp"%>
            </div>

            <!--Histogram-->
            <div ng-if="adv.chart.type === 'Histogram'" class="full-height">
                <%@ include file="histogram.jsp"%>
            </div>

            <!--Bar chart-->
            <div ng-if="adv.chart.type === 'Bar chart'" class="full-height">
                <%@ include file="barchart.jsp"%>
            </div>

            <!--Pie chart-->
            <div ng-if="adv.chart.type === 'Pie chart'" class="full-height">
                <%@ include file="piechart.jsp"%>
            </div>

            <!--Shanky-->
            <div ng-if="adv.chart.type === 'Sankey'" class="full-height">
                <%@ include file="sankey.jsp"%>
            </div>

            <!--Heatmap-->
            <div ng-if="adv.chart.type === 'Heatmap'" class="full-height">
                <%@ include file="heatmap.jsp"%>
            </div>

            <!--Outlier-->
            <div ng-if="adv.chart.type === 'Outlier'" class="full-height">
                <%@ include file="outlier.jsp"%>
            </div>
        </div>

    </div>
</div>


