<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="analysis-container" ng-controller="analysis.chart.ContainerCtrl" id="ade_div_chart_cont">
    <div class="analysis-filter">
        <div style="position: absolute; width: 20%; height:28px; border-bottom: 1px solid #ddd"></div>
        <ul class="mu-tab" mu-tabset="ts2">
            <li mu-tab-item="" tab-activated="true">
                <a href="javascript:;">필드</a>
            </li>
            <li mu-tab-item="">
                <a href="javascript:;">필터</a>
            </li>
        </ul>
        <div class="mu-tab-body" mu-tabset="ts2">
            <div class="mu-tabCont" mu-tab-contents="">
                <!--side menu</p>-->
                <h5 class="mu-title tc" style="padding: 10px;">Event Object의 개수 <span class="mu-badge">{{fieldList.length}}</span>
                </h5>
                <ul class="mu-slide-menu" id="containerLeft" class='containerVertical'>
                    <li ng-repeat="field in fieldList">
                        <a href="" ng-click="clickItem(field)">
                            <i class="mu-icon-img"
                               ng-class="{ TEXT: 'at', NUMBER: 'number', TIMESTAMP: 'time' }[field.type]"></i>
                            <span ng-bind="field.name"></span>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="mu-tabCont" mu-tab-contents="">
                <h5 class="mu-title tc">필터</h5>
                필터 UI
            </div>
        </div>
    </div>


    <!--<div>-->
        <!--<button>section1</button>-->
        <!--<button>section2</button>-->
        <!--<div>-->
            <!--<div>section1</div>-->
            <!--<dib>section2</dib>-->
        <!--</div>-->
    <!--</div>-->

    <!--<script type="text/ng-template" id="stringCondition">-->
        <!--Yes, yes it did. {{$id}} -  {{$parent.$id}}-->
    <!--</script>-->
    <!--Did it work? {{$id}} <ng-include src="'stringCondition'"></ng-include>-->

    <!--<div ng-include="'../views/analysis/chart/chart_chooser.html'">-->

    <!--</div>-->

    <!--<hr/>-->
    <!--<div>{{$id}}</div>-->
    <!--<div class="animate-switch-container"-->
         <!--ng-switch on="chart.selection">-->
        <!--<div class="animate-switch" ng-switch-when="settings|options" ng-switch-when-separator="|">Settings Div</div>-->
        <!--<div class="animate-switch" ng-switch-when="home">Home Span</div>-->
        <!--<div class="animate-switch" ng-switch-default>default</div>-->
    <!--</div>-->









    <div class="analysis-chart">

        <div class="mu-row analysis-chart-header" style="padding: 3px">
            <div class="mu-col mu-col-4">
                <div class="mu-selectbox" mu-select="sb1" select-model="selModel"
                     style="width:100%"
                     select-items="selOptions" select-change="changeOption($model)">
                    <button style="width: 100%" class="mu-value">
                        <i class="mu-icon-20-img" ng-class="analysis.chart.icon"></i>
                        {{analysis.chart.type}}
                    </button>
                    <ul class="mu-list">

                        <div class="mu-row">
                            <div class="mu-col mu-col-3" ng-repeat="group in chartGroups">
                                {{group.name}}
                                <hr>
                                <div class="chart-change-cell" ng-repeat="chartItem in group.items"
                                     ng-model-options="{ debounce: 2000 }"
                                     ng-mouseenter="showDescription(chartItem)"
                                     ng-mouseleave="hideDescription()"
                                     ng-click="changeChart(chartItem)">
                                    <i class="mu-icon-100-img" ng-class="chartItem.icon"></i>
                                    <p>{{chartItem.type}}</p>
                                </div>
                            </div>
                        </div>
                        <div ng-if="analysis.tempChart" style="margin-top: 10px" class="tl">
                            <p>설명</p>
                            <hr>
                            <div style="">
                                {{analysis.tempChart.description}}
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
            <div class="mu-col mu-col-4">
                <div class="mu-row" ng-show="analysis.chart.type === 'Outlier'">
                    <div class="mu-col mu-col-4">
                        대상필드
                    </div>
                    <div class="mu-col mu-col-8">
                        <div class='wrapper'>
                            <div class='tableRow'>
                                <!--<div id="containerLeft" class='containerVertical'>-->
                                <!--<div ng-repeat="item in items1">{{item.content}}</div>-->
                                <!--</div>-->
                                <div id="containerRight" class='containerVertical'>
                                    <div ng-repeat="field in outlier_top track by $index">{{field.name}}</div>
                                </div>
                            </div>
                            <!--<div class="tableRow">-->
                            <!--<div class='containerVertical'>-->
                            <!--<pre>Items1:<br/>{{items1 | json}}</pre>-->
                            <!--</div>-->
                            <!--<div class='containerVertical'>-->
                            <!--<pre>Items2:<br/>{{items2 | json}}</pre>-->
                            <!--</div>-->
                            <!--</div>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mu-row analysis-chart-main">

            <!--#############################-->
            <!--none-->
            <!--#############################-->
            <div class="analysis-chart-none" ng-if="analysis.chart.icon === 'none'">
                <div class="center">
                    <span style="font-size:2.4em">차트 유형을 선택해 주세요.</span>
                </div>
            </div>

            <!--#############################-->
            <!--Line plot-->
            <!--#############################-->
            <div ng-show="analysis.chart.type === 'Line plot'">
                Line plot
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
                <div>
                    Outlier
                </div>

                <div class="mu-row">
                    <div class="mu-col mu-col-7" style="background: greenyellow; padding-right: 10px ">
                        <div class="mu-row">
                            <div class="fl">희스토그램</div>
                            <!--<button class="fr">aa</button>-->
                            <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only fr"
                                    tooltip-placement="bottom-right"
                                    ng-click=""
                                    ng-disabled="card.state.running"
                                    popup-layer-area="outlier.histogram"><i class="mu-icon-img more"></i></button>
                            <!-- contextmenu: 카드 메뉴 -->
                            <div class="mu-tooltip bottom" popup-layer="outlier.histogram">
                                <div class="arrow"></div>
                                <ul class="mu-popup-menu">
                                    <li ng-click="saveHistogramChart()">
                                        <a href="javascript:;"><i class="mu-icon-img trash"></i><spring:message code="save" /></a>
                                    </li>
                                    <li ng-click="restartJob()">
                                        <a href="javascript:;"><i class="mu-icon-img rerun"></i><spring:message code="anomaly.retry" /></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div style="padding-left: 10px">
                            <highchart style="position: absolute; width: 100%; left:0; height: 300px;"
                                       config="outlierHistogramChart.options">
                            </highchart>
                        </div>
                    </div>
                    <div class="mu-col mu-col-5" style="background: pink; text-align: left">
                        <div class="mu-row">
                            <div class="fl">기술통계량</div>
                            <!--<button class="fr">aa</button>-->
                            <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only fr"
                                    tooltip-placement="bottom-right"
                                    ng-click=""
                                    ng-disabled="card.state.running"
                                    popup-layer-area="outlier.histogram"><i class="mu-icon-img more"></i></button>
                            <!-- contextmenu: 카드 메뉴 -->
                            <div class="mu-tooltip bottom" popup-layer="outlier.histogram">
                                <div class="arrow"></div>
                                <ul class="mu-popup-menu">
                                    <li ng-click="saveHistogramChart()">
                                        <a href="javascript:;"><i class="mu-icon-img trash"></i><spring:message code="save" /></a>
                                    </li>
                                    <li ng-click="restartJob()">
                                        <a href="javascript:;"><i class="mu-icon-img rerun"></i><spring:message code="anomaly.retry" /></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div style="padding-left: 10px">
                            <!--<table class="mu-grid mu-grid-sort" mu-table="t2" rows="techStatic" style="height: 100%">-->
                                <!--<thead mu-table-head="" sortable=""></thead>-->
                                <!--<tbody mu-table-body="" selectable="multiple"></tbody>-->
                            <!--</table>-->

                            <table class="mu-grid" mu-table="t1" rows="techStatic" cols="techStaticKeys" style="height: 300px">
                            </table>
                        </div>
                    </div>
                </div>




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


