<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="mu-panel-body" ng-controller="anomaly.card.ResultCtrl">
    <!-- 작업 중 (waiting response)-->
    <div class="anomalyWrap" ng-show="card.state.running">
        <div class="dotWrap"><i class="mu-icon-img loading"></i><br><spring:message code="anomaly.message.waiting_results" /></div>
        <button type="button" class="mu-btn mu-btn-icon" ng-click="cancelAde()"><i class="mu-icon-img cancel"></i><span><spring:message code="cancel" /></span></button>
        <div class="mu-progress" mu-progress="card.state.current" progress-min="0" progress-max="card.state.total">
            <div class="mu-pbar" mu-progress-bar=""></div>
        </div>
    </div>

    <!-- 에러 발생 -->
    <div class="anomalyWrap" ng-show="!card.state.running && card.state.error">
        <div class="dotWrap"><i class="mu-icon-img err"></i><br><spring:message code="anomaly.message.no_results" /></div>
        <button type="button" class="mu-btn mu-btn-icon" ng-click="changeOptions()"><i class="mu-icon-img option"></i><span><spring:message code="anomaly.change_option" /></span></button>
        <button type="button" class="mu-btn mu-btn-icon" ng-click="restartJob()"><i class="mu-icon-img rerun"></i><span><spring:message code="anomaly.retry" /></span></button>
        <div class="errorMsg" ng-show="errorMsg">
            <i class="mu-icon-img alert"></i><span ng-bind="errorMsg"></span>
        </div>
    </div>

    <!-- 결과(차트) -->
    <div ng-show="!card.state.running && card.state.success" style="position:relative; height:100%">
    <!--<pre style="position: absolute; height: 300px; width: calc(100% - 30px); text-align: left;">{{card.data | json:4}}</pre>-->
    <!--
    <div style="width: 100%;height: 50px;padding: 16px;border: 1px solid #000;" mu-popupmenu-area="pm1_1">
    selected option: {{selectedOption}}
    </div>
    -->

        <div id="container_{{$index}}" style="width:100%; height:100%;"></div>
        <div ng-if="app.chartType === 'heatmap'" style="background:#cbe1f8;position:absolute; border:1px solid blue; top:0; left:0; bottom:80px; width:20px;">
            <div>1</div>
            <div>2</div>
            <div>3</div>
        </div>
    </div>

    <!-- contextmenu : 차트 메뉴 -->

    <!--
    <div mu-popupmenu="pm1_1" popupmenu-open="openMenu(target)" popupmenu-select="selectItem(item)">
    <ul class="mu-popup-menu" mu-popupmenu-list="">
    <li mu-popupmenu-item=""><a href="">분리</a></li>
    </ul>
    </div>
    -->
    <!--
    <div class="mu-tooltip" popup-layer="anomaly.layer.chartmenu_{{$index}}">
    <div class="arrow"></div>
    <ul class="mu-popup-menu">
    <li><a href=""><i class="mu-icon-img divide"></i><spring:message code="anomaly.split_card" /></a></li>
    <li><a href=""><i class="mu-icon-img search"></i><spring:message code="menu.search" /></a><a href=""><i class="mu-icon-img link"></i></a></li>
    <li><a href=""><i class="mu-icon-img pivot"></i><spring:message code="menu.pivot" /></a><a href=""><i class="mu-icon-img link"></i></a></li>
    </ul>
    </div>-->
    <!-- //contextmenu : 차트 메뉴 -->
</div>
