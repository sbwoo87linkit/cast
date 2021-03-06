<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="mu-col mu-col-12" ng-controller="anomaly.TopInfoCtrl">
    <div class="mu-hgroup fl">
        <button type="button" class="mu-btn mu-btn-icon" ng-click="backToChoose()"><i class="mu-icon-img arrow-first"></i><span><spring:message code="prev" /></span></button>

        <div class="mu-item-group" style="margin-right: 12px;"><i class="mu-icon-img data"></i><span>{{dataName || '<spring:message code="anomaly.not_selected" />'}}</span></div>
        <button type="button" class="mu-btn mu-btn-icon" ng-class="{active: isToggleDate}" ng-show="existTime"
            popup-layer-area="anomaly.prop.t_range" layer-offset="{left: 2}" layer-open="openedTimeLayer()" layer-close="closedTimeLayer()">
            <i class="mu-icon-img date"></i><span ng-bind="startDate | allrange2text:endDate"></span>
        </button>
        <button type="button" class="mu-btn mu-btn-icon" ng-class="{active: isToggleQuery}"
            popup-layer-area="anomaly.prop.query" layer-offset="{left: 2}" layer-open="openedQueryLayer()" layer-close="closedQueryLayer()">
            <i class="mu-icon-img searchWord"></i><span ng-bind="query"></span>
        </button>
    </div>

    <!-- 팝업 레이어: 시간 설정 -->
    <div class="mu-tooltip bottom-left pivotTooltip" style="width: 745px;" popup-layer="anomaly.prop.t_range">
        <div class="arrow"></div>
        <div class="mu-tooltip-inner searchTime">
            <datetime-picker name="pivot.time_picker" change-datetime="changeDatetime(start, end, text)" start="startDate" end="endDate"></datetime-picker>
        </div>
    </div>
    <!-- 팝업 레이어: 검색어 설정 -->
    <div class="mu-tooltip bottom-left timeResearch" style="width: 360px;" popup-layer="anomaly.prop.query">
        <div class="arrow"></div>
        <div class="mu-tooltip-inner">
            <span class="title"><spring:message code="query" />: </span>
            <div class="mu-item-group">
                <textarea class="mu-area" ng-model="inputQuery"/>
            </div>
            <div class="mu-item-group" style="padding-top: 10px;height: 30px;">
                <button class="mu-btn btnApply fr" type="button" ng-click="changeQuery(inputQuery)"><spring:message code="save" /></button>
            </div>
        </div>
    </div>
</div>
