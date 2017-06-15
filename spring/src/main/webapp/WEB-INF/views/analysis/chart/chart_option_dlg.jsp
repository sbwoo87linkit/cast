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

    <div>
    </div>
    <%@ include file="chartOpts.jsp"%>
    <!--Outlier는 옵션창 없으며, 구조가 다름-->

</div>
