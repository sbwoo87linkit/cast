
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

    <!--{{adv.chart.type}}-->
    <!-- 탭 (기본) -->

    <!-- 탭 (Sankey) -->
    <div ng-if="adv.chart.type==='Sankey'">
        <%@ include file="../chart_option/sankey.jsp"%>
    </div>


    <!-- 탭 (pie 차트) -->




</div>
