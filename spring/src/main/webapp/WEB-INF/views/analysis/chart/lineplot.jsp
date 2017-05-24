<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<div ng-controller="analysis.chart.LineplotCtrl" class="full-height">
    <div class="mu-row">
        <div class="mu-col mu-col-4">
            <%@ include file="choose_chart.jsp"%>
        </div>
        <div class="mu-col mu-col-8">
            <div class="mu-row">
                <div class="mu-col mu-col-3" style="padding-left: 20px; text-align: left">

                    <button type="button" class="mu-btn" mu-dialog-open="dlg3"><i class="mu-icon setting2"></i>차트옵션
                    </button>

                    <div class="mu-dialog-background transparent" mu-dialog="dlg3" style="display: none"></div>
                    <div class="mu-dialog mu-fix-foot" mu-dialog="dlg3" dialog-offset="auto"
                         resizable="{animate: true}">
                        <div class="mu-dialog-head" mu-dialog-head="" movable="">
                            <span class="title">차트옵션 $id :  {{$id}}</span>
                            <button type="button" class="mu-btn mu-btn-icon mu-btn-bg-non" mu-dialog-close="dlg3"><i
                                    class="mu-icon cancel"></i></button>
                        </div>
                        <div class="mu-dialog-body" mu-dialog-body="">
                            <p>All form fields are required.</p>
                            <p>{{option}}</p>
                        </div>
                        <div class="mu-dialog-foot" mu-dialog-foot="">
                            <button type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon add"></i>create
                                an account
                            </button>
                            <button type="button" class="mu-btn mu-btn-icon" mu-dialog-close="dlg3"><i
                                    class="mu-icon cancel"></i>cancel
                            </button>
                        </div>
                    </div>

                </div>
                <div class="mu-col mu-col-6">
                </div>
                <div class="mu-col mu-col-3">
                    <button type="button" class="mu-btn mu-btn-icon"><i class="mu-icon save"></i>저장</button>
                </div>
            </div>
        </div>
    </div>

    <div class="main-container" style="margin-top: 10px; ; overflow: scroll">

        <div class="mu-row">
            <div class="mu-col mu-col-1">
                <button type="button" ng-click="addAxisY()" class="mu-btn mu-btn-icon"><i class="mu-icon add"></i>
                </button>
            </div>
            <div class="mu-col mu-col-11">

                <div class="mu-row">
                    <div class="mu-col mu-col-1" style="text-align: right; padding-right: 10px;">
                        <span style="display: inline-block; margin-top: 6px">그룹</span>
                    </div>
                    <div class="mu-col mu-col-3">

                        <div class='wrapper'>
                            <div class='tableRow'>
                                <div id="containerRight" class='containerVertical' style="">
                                    <span ng-show="outlier_top.length == 0" class="dragular-none">없음</span>
                                    <div ng-repeat="field in outlier_top track by $index"
                                         ng-dblclick="outlier_top.splice($index, 1)">
                                        <span>{{field.name}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mu-col mu-col-8">
                        Debug : {{outlier_top.length}} - {{outlier_top[0].name}}
                    </div>
                </div>


            </div>
        </div>
        <div class="mu-row chart-row">
            <div class="mu-col mu-col-1 full-height">
                <!--<div class="outer full-height" ng-repeat="axis in axisContainerX">-->
                <!--<div class="inner rotate">Centered?</div>-->
                <!--</div>-->
                <table class="mu-grid mu-grid-border full-height">
                    <tr ng-repeat="axis in axisContainerX">
                        <td class="vm">
                            <div style="height: 100%; line-height: 100%; background: green; margin: 2px">
                                A
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="mu-col mu-col-11 full-height">



                <div class="mu-row">


                </div>



            </div>
        </div>
        <div class="mu-row">
            <div class="mu-col mu-col-1">시간</div>
            <div class="mu-col mu-col-11">
                <div class="mu-row">
                    <div class="mu-col mu-col-1" style="text-align: right; padding-right: 10px;">
                        <span style="display: inline-block; margin-top: 6px">시간</span>
                    </div>
                    <div class="mu-col mu-col-11">
                        <div class='wrapper'>
                            <div class='tableRow'>
                                <div id="containerBottom" class='containerVertical' style="">
                                    <span ng-show="outlier_top.length == 0" class="dragular-none">없음</span>
                                    <div ng-repeat="field in outlier_top track by $index"
                                         ng-dblclick="outlier_top.splice($index, 1)">
                                        <span>{{field.name}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>

</div>


<!--<div class="mu-row" xmlns:spring="http://www.w3.org/1999/XSL/Transform">-->
<!--<div class="mu-col mu-col-4">-->
<!--<%@ include file="choose_chart.jsp"%>-->
<!--</div>-->
<!--<div class="mu-col mu-col-4">-->
<!--</div>-->
<!--</div>-->

<!--<div class="mu-row">-->

<!--line plot-->


<!--</div>-->
