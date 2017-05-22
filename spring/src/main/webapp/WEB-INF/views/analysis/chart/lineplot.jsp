<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<div ng-controller="analysis.chart.LineplotCtrl" class="outlier">
    <div class="mu-row">
        <div class="mu-col mu-col-4">
            <%@ include file="choose_chart.jsp"%>
        </div>
        <div class="mu-col mu-col-8">
            <div class="mu-row">
                <div class="mu-col mu-col-3" style="padding-left: 20px; text-align: left">
                    <button type="button" ng-disabled="histogram"
                            popup-layer-area="lineplot.chart.option"
                            class="mu-btn mu-btn-icon"><i class="mu-icon setting2"></i>차트옵션</button>
                    <!-- Popup layer: 차트 옵션 -->
                    <div class="mu-tooltip bottom-left chart-option" popup-layer="lineplot.chart.option">
                        <div class="arrow" style="display: none"></div>
                        <div class="mu-popup-menu">
                            <div class="mu-panel">
                                <div class="mu-panel-head"><span class="mu-title">차트옵션</span></div>
                                <div class="mu-panel-body">
                                    pannel boddy




                                    <div class="tab">
                                        <button class="tablinks" onclick="openCity(event, 'London')">London</button>
                                        <button class="tablinks" onclick="openCity(event, 'Paris')">Paris</button>
                                        <button class="tablinks" onclick="openCity(event, 'Tokyo')">Tokyo</button>
                                    </div>

                                    <div>
                                        <div id="London" class="tabcontent">
                                            <h3>London</h3>
                                            <p>London is the capital city of England.</p>
                                        </div>

                                        <div id="Paris" class="tabcontent">
                                            <h3>Paris</h3>
                                            <p>Paris is the capital of France.</p>
                                        </div>

                                        <div id="Tokyo" class="tabcontent">
                                            <h3>Tokyo</h3>
                                            <p>Tokyo is the capital of Japan.</p>
                                        </div>
                                    </div>








                                </div>
                            </div>
                        </div>
                    </div>





                    <!--<button type="button" class="mu-btn" mu-dialog-open="dlg3">Open</button>-->

                    <!--<div class="mu-dialog-background" mu-dialog="dlg3"></div>-->
                    <!--<div class="mu-dialog mu-fix-foot" mu-dialog="dlg3" dialog-offset="auto" resizable="{animate: true}">-->
                        <!--<div class="mu-dialog-head" mu-dialog-head="" movable="">-->
                            <!--<span class="title">Create new user</span>-->
                            <!--<button type="button" class="mu-btn mu-btn-icon mu-btn-bg-non" mu-dialog-close="dlg3"><i class="mu-icon cancel"></i></button>-->
                        <!--</div>-->
                        <!--<div class="mu-dialog-body" mu-dialog-body="">-->
                            <!--<p>All form fields are required.</p>-->
                        <!--</div>-->
                        <!--<div class="mu-dialog-foot" mu-dialog-foot="">-->
                            <!--<button type="button" class="mu-btn mu-pop-btn mu-btn-icon"><i class="mu-icon add"></i>create an account</button>-->
                            <!--<button type="button" class="mu-btn mu-btn-icon" mu-dialog-close="dlg3"><i class="mu-icon cancel"></i>cancel</button>-->
                        <!--</div>-->
                    <!--</div>-->


                </div>
                <div class="mu-col mu-col-6">
                </div>
                <div class="mu-col mu-col-3">
                    <button type="button" class="mu-btn mu-btn-icon"><i class="mu-icon save"></i>저장</button>
                </div>
            </div>
        </div>
    </div>

    <div class="mu-row" style="margin-top: 0px; background: pink ; overflow: scroll">
        main
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>a</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>
        <p>b</p>


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
