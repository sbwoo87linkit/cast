<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="mu-col mu-col-12" ng-controller="anomaly.TopInfoCtrl">
    <div class="mu-hgroup fl">
        <button type="button" class="mu-btn mu-btn-icon" ng-click="backToChoose()"><i class="mu-icon-img arrow-first"></i><span><spring:message code="prev" /></span></button>

        <div class="mu-item-group"><i class="mu-icon-img data"></i><span>{{dataName || '<spring:message code="anomaly.not_selected" />'}}</span></div>
        <div class="mu-item-group" mu-tooltip-area="anomaly.tt_query" tooltip-placement="bottom-left" tooltip-offset="{left: 16, top: -10}"><i class="mu-icon-img searchWord"></i><span>{{query}}</span></div>
    </div>

    <!-- tooltip: 검색어 -->
    <div class="mu-tooltip" mu-tooltip="anomaly.tt_query">
        <div class="arrow"></div>
        <div class="mu-tooltip-inner" style="max-width: 600px;">
            <span style="word-break: break-word;"><spring:message code="query" />: {{query}}</span>
        </div>
    </div>
</div>
