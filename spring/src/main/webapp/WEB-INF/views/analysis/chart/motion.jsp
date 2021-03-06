<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<div ng-controller="analysis.chart.MotionCtrl" class="full-height"
     xmlns:spring="http://www.w3.org/1999/XSL/Transform">

    <div class="mu-row">
        <div class="mu-col mu-col-4">
            <%@ include file="choose_chart.jsp"%>
        </div>
        <div class="mu-col mu-col-8">
            <div class="mu-row">
                <div class="mu-col mu-col-3" style="padding-left: 20px; text-align: left" ng-controller="analysis.chart.ChartOptionCtrl">

                    <!--차트 옵션 버튼 및 다이얼로그-->
                    <%@ include file="./chart_option_dlg.jsp"%>

                </div>
                <div class="mu-col mu-col-6">
                </div>
                <div class="mu-col mu-col-3">
                    <button type="button" class="mu-btn mu-btn-icon" ng-click="exportMotion()"><i class="mu-icon save"></i>저장</button>
                </div>
            </div>
        </div>
    </div>

    <div>


        <!--<div class="visualization" style="background: #fff">-->
            <!--<svg xmlns="http://www.w3.org/2000/svg" class="chart-container" width="900" height="440"  style='stroke-width: 0px; background-color: #fff;'>-->
                <!--<g transform="translate(90, 10)">-->
                    <!--<g transform="translate(0, 302)">-->
                        <!--<path fill="none" stroke="#777" d="M 0 6 V 0 H 779 V 6" />-->
                    <!--</g>-->
                    <!--<g>-->
                        <!--<line stroke="#2e9ccc" stroke-width="50" transform="translate(253)" x1="0" y1="302" x2="0" y2="14" />-->
                        <!--<line stroke="#2e9ccc" stroke-width="100" transform="translate(253)" x1="150" y1="302" x2="150" y2="119" />-->
                    <!--</g>-->
                <!--</g>-->
            <!--</svg>-->
        <!--</div>-->

    </div>

    <div class="main-container" style="margin-top: 10px;">

        <div class="mu-row">
            <div class="mu-col mu-col-1">
            </div>
            <div class="mu-col mu-col-11">
                <div class="mu-row">
                    <div class="mu-col mu-col-1" style="text-align: right; padding-right: 10px;">
                        <span style="display: inline-block; margin-top: 6px">그룹</span>
                    </div>
                    <div class="mu-col mu-col-3">
                        <%@ include file="../options/motion/group.jsp"%>
                    </div>
                    <div class="mu-col mu-col-1" style="text-align: right; padding-right: 10px;">
                        <span style="display: inline-block; margin-top: 6px">사이즈</span>
                    </div>
                    <div class="mu-col mu-col-3">
                        <%@ include file="../options/motion/size.jsp"%>
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

                            <%@ include file="../options/motion/yAxis.jsp"%>

                        </td>
                        <td>
                            <div class="visualization"  ng-show="data" style="height:100%; width:600px; border : 1px solid #999">

                                <div class="mu-line-group">
                                    <button type="button" class="mu-btn mu-btn-icon" ng-click="play()" ng-class="{ active: isState('play') }" id="btnPlay"><i class="mu-icon play"></i><strong>Play</strong></button>
                                    <span class="mu-dotted-line"></span>
                                    <button type="button" class="mu-btn mu-btn-icon" ng-click="pause()" ng-class="{ active: isState('pause') }" id="btnPause"><i class="mu-icon pause"></i><strong>Pause</strong></button>
                                    <button type="button" class="mu-btn mu-btn-icon" ng-click="resume()" ng-class="{ active: isState('resume') }" id="btnResume"><i class="mu-icon arrow-right"></i><strong>Resume</strong></button>
                                    <span class="mu-dotted-line"></span>
                                    <button type="button" class="mu-btn mu-btn-icon" ng-click="stop()" ng-class="{ active: isState('stop') }" id="btnStop"><i class="mu-icon stop"></i><strong>Stop</strong></button>
                                </div>

                                <div id="chart1" class="mu-motion-chart"></div>

                            </div>
                        </td>
                    </tr>

                </table>
            </div>
        </div>

        <div class="mu-row">
            <div class="mu-col mu-col-1"></div>
            <div class="mu-col mu-col-11">
                <div class="mu-row">
                    <div class="mu-col mu-col-1" style="text-align: right; padding-right: 10px;">
                        <span style="display: inline-block; margin-top: 6px">x축</span>
                    </div>
                    <div class="mu-col mu-col-3">
                        <%@ include file="../options/motion/xAxis.jsp"%>
                    </div>
                    <div class="mu-col mu-col-1" style="text-align: right; padding-right: 10px;">
                        <span style="display: inline-block; margin-top: 6px">시간</span>
                    </div>
                    <div class="mu-col mu-col-3">
                        <%@ include file="../options/motion/time.jsp"%>
                    </div>
                </div>
            </div>
        </div>

    </div>

</div>
