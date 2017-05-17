<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div  ng-controller="analysis.chart.OutlierCtrl">
    <div class="mu-row">
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
    </div>

    <div class="mu-row">
        <div class="mu-col mu-col-7" style="background: greenyellow; padding-right: 10px ">
            <div class="mu-row">
                <div class="fl">희스토그램 {{$id}}</div>
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
