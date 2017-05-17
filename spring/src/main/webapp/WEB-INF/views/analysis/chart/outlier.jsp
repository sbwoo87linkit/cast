<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div ng-controller="analysis.chart.OutlierCtrl" class="outlier">
    <div class="mu-row">
        <div class="mu-col mu-col-4">
            <%@ include file="choose_chart.jsp"%>
        </div>
        <div class="mu-col mu-col-8">
            <div class="mu-row">
                <div class="mu-col mu-col-3" style="text-align: right; padding-right: 10px;">
                    <span style="display: inline-block; margin-top: 6px">대상필드</span>
                </div>
                <div class="mu-col mu-col-3">
                    <div class='wrapper'>
                        <div class='tableRow'>
                            <div id="containerRight" class='containerVertical'>
                                <span ng-show="outlier_top.length == 0" class="dragular-none">없음</span>
                                <div ng-repeat="field in outlier_top track by $index"
                                     ng-dblclick="outlier_top.splice($index, 1)">{{field.name}}</div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="mu-col mu-col-6">
                </div>
            </div>
        </div>
    </div>

    <div class="mu-row" style="margin-top: 0px">
        <!--히스토그램-->
        <div class="mu-col mu-col-7" style="padding: 0px ">
            <div class="outlier-chart-container">

                <div class="mu-panel" style="margin:0px">
                    <div class="mu-panel-head"><span class="mu-title">히스토그램</span>

                        <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only fr"
                                ng-disabled="!histogram"
                                popup-layer-area="histogram"><i class="mu-icon-img more"></i></button>
                        <!-- contextmenu: 카드 메뉴 -->
                        <div class="mu-tooltip bottom-right" popup-layer="histogram">
                            <div class="arrow"></div>
                            <ul class="mu-popup-menu">
                                <li ng-click="export('histogram')">
                                    <a href="javascript:;"><i class="mu-icon-img saveas"></i><spring:message code="save" /></a>
                                </li>
                                <li ng-click="reload('histogram')">
                                    <a href="javascript:;"><i class="mu-icon-img rerun"></i><spring:message code="anomaly.retry" /></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="mu-panel-body">

                        <div ng-if="!histogram" style="width: 100%; height: 100%; border: 1px solid #999;">
                            <div class="center">
                                <span style="font-size:1.2em">no data</span>
                            </div>
                        </div>

                        <div ng-if="histogram">
                            <highchart style="position: absolute; left:0; top:0px; bottom:0; right:0"
                                       config="histogram.options">
                            </highchart>
                        </div>

                    </div>
                </div>
            </div>


        </div>
        <!--기술통계량-->
        <div class="mu-col mu-col-5" style="text-align: left;padding-right: 0px">
            <div class="outlier-chart-container">
                <div class="mu-panel">
                    <div class="mu-panel-head"><span class="mu-title">기술통계량</span>
                        <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only fr"
                                ng-disabled="!techstatic"
                                popup-layer-area="techstatic"><i class="mu-icon-img more"></i></button>
                        <!-- contextmenu: 카드 메뉴 -->
                        <div class="mu-tooltip bottom-right" popup-layer="techstatic">
                            <div class="arrow"></div>
                            <ul class="mu-popup-menu">
                                <li ng-click="export('techstatic')">
                                    <a ng-mousedown="techstatic_csv.generate()" ng-href="{{ techstatic_csv.link() }}"
                                       download="techstatic.csv">
                                        <i class="mu-icon-img saveas"></i><spring:message code="save" />
                                    </a>
                                </li>
                                <li ng-click="reload('techstatic')">
                                    <a href="javascript:;"><i class="mu-icon-img rerun"></i><spring:message code="anomaly.retry" /></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="mu-panel-body">

                        <div ng-if="!techstatic" style="width: 100%; height: 100%; border: 1px solid #999;">
                            <div class="center">
                                <span style="font-size:1.2em">no data</span>
                            </div>
                        </div>

                        <div ng-if="techstatic">
                            <table class="mu-grid" mu-table="t1" rows="techstatic" cols="techstaticKeys"  export-to-csv="techstatic_csv"
                                   style="position: absolute; height:100%; left:0; top:0px; bottom:0; right:0">
                            </table>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    </div>

    <div class="mu-row">
        <!--시계열 분포-->
        <div class="mu-col mu-col-7" style="padding-right: 0px ">
            <div class="outlier-chart-container">
                <div class="mu-panel">
                    <div class="mu-panel-head"><span class="mu-title">시계열 분포</span>
                        <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only fr"
                                ng-disabled="!timeseries"
                                popup-layer-area="timeseries"><i class="mu-icon-img more"></i></button>
                        <!-- contextmenu: 카드 메뉴 -->
                        <div class="mu-tooltip bottom-right" popup-layer="timeseries">
                            <div class="arrow"></div>
                            <ul class="mu-popup-menu">
                                <li ng-click="export('timeseries')">
                                    <a href="javascript:;"><i class="mu-icon-img saveas"></i><spring:message code="save" /></a>
                                </li>
                                <li ng-click="reload('timeseries')">
                                    <a href="javascript:;"><i class="mu-icon-img rerun"></i><spring:message code="anomaly.retry" /></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="mu-panel-body">

                        <div ng-if="!timeseries" style="width: 100%; height: 100%; border: 1px solid #999;">
                            <div class="center">
                                <span style="font-size:1.2em">no data</span>
                            </div>
                        </div>

                        <div ng-if="timeseries">
                            <highchart style="position: absolute; width: 100%; left:0; height: 100%;"
                                       config="timeseries.options">
                            </highchart>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <!--이상치(outlier)-->
        <div class="mu-col mu-col-5" style="text-align: left;padding-right: 0px">
            <div class="outlier-chart-container">
                <div class="mu-panel">
                    <div class="mu-panel-head"><span class="mu-title">이상치(outlier)</span>
                        <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only fr"
                                ng-disabled="!outlier"
                                popup-layer-area="outlier"><i class="mu-icon-img more"></i></button>
                        <!-- contextmenu: 카드 메뉴 -->
                        <div class="mu-tooltip bottom-right" popup-layer="outlier">
                            <div class="arrow"></div>
                            <ul class="mu-popup-menu">
                                <li ng-click="export('outlier')">
                                    <a ng-mousedown="outlier_csv.generate()" ng-href="{{ outlier_csv.link() }}"
                                       download="outlier.csv">
                                        <i class="mu-icon-img saveas"></i><spring:message code="save" />
                                    </a>
                                </li>
                                <li ng-click="reload('outlier')">
                                    <a href="javascript:;"><i class="mu-icon-img rerun"></i><spring:message code="anomaly.retry" /></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="mu-panel-body">

                        <div ng-if="!outlier" style="width: 100%; height: 100%; border: 1px solid #999;">
                            <div class="center">
                                <span style="font-size:1.2em">no data</span>
                            </div>
                        </div>

                        <div ng-if="outlier">
                            <table class="mu-grid" mu-table="t1" rows="outlier" cols="outlierKeys" export-to-csv="outlier_csv"
                                   style="position: absolute; height: 100%; left:0; top:0px; bottom:0; right:0">
                            </table>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </div>

</div>
