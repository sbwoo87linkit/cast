<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="mu-panel" ng-controller="test.VisualChartCtrl">
    <div class="mu-panel-head">
        <div class="fl">
            <label><spring:message code="chart.chart_type"/></label>
            <div id="visualRowPerPage" class="mu-selectbox" mu-select="visual.sb1" select-items="selOptions" select-change="changeOption($model.value)">
                <button class="mu-value">{{$model.text}}</button>
                <ul class="mu-list">
                    <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                </ul>
            </div>
        </div>
        <div class="fl">
            <%@ include file="./visual_chart_opts.jsp"%>
        </div>
    </div>
    <div class="mu-panel-body" style="clear: both;">
        <div id="visualChartContainer" style="width: 98%;min-height: 90px;height:calc(100% - 100px);"></div>
    </div>
</div>

<!-- <div ng-controller="search.VisualChartCtrl"> -->

<!-- selectbox -->
<!-- <div id="visualRowPerPage" class="mu-selectbox fl" mu-select="visual.sb1" select-items="selOptions" select-change="changeOption($model.value)">
        <button class="mu-value">{{$model.text}}</button>
        <ul class="mu-list">
            <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
        </ul>
    </div> -->

<!-- chart -->
<!-- <div id="visualChartContainer" style="clear: both;width: 96%;"></div> -->

<!-- </div> -->
