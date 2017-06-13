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

    <div ng-if="adv.chart.type==='Line plot'">
        <%@ include file="../options/lineplot/chart.jsp"%>
    </div>

    <div ng-if="adv.chart.type==='Scatter plot'">
        <%@ include file="../options/scatterplot/chart.jsp"%>
    </div>

    <div ng-if="adv.chart.type==='Motion'">
        <%@ include file="../options/motion/chart.jsp"%>
    </div>

    <div ng-if="adv.chart.type==='Histogram'">
        <%@ include file="../options/histogram/chart.jsp"%>
    </div>

    <div ng-if="adv.chart.type==='Bar chart'">
        <%@ include file="../options/barchart/chart.jsp"%>
    </div>

    <div ng-if="adv.chart.type==='Pie chart'">
        <%@ include file="../options/piechart/chart.jsp"%>
    </div>

    <div ng-if="adv.chart.type==='Sankey'">
        <%@ include file="../options/sankey/chart.jsp"%>
    </div>

    <div ng-if="adv.chart.type==='Heatmap'">
        <%@ include file="../options/heatmap/chart.jsp"%>
    </div>

    <!--Outlier는 옵션창 없으며, 구조가 다름-->

</div>
