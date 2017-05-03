<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="mu-panel-body" ng-controller="anomaly.card.ResultCtrl" style="position: relative; display:block; height: 100%; width:100%; min-width: 100%">

    <div id="container_{{$index}}" style="position: relative; display: block; height: 310px; width:100%; min-width: 100%">

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
        <div ng-show="!card.state.running && card.state.success">
            <!--<pre style="position: absolute; height: 300px; width: calc(100% - 30px); text-align: left;">{{card.data | json:4}}</pre>-->

            <!--<div id="container_{{$index}}" style="height: 100%; width: 100%; position: absolute"></div>-->
            <!--<highchart config="card.cfg" style="height: 100%; width: 100%; position: absolute"></highchart>-->
            <highchart id="chart_{{$index}}" config="card.cfg" style=""></highchart>
            <!--<ng-view>-->
            <!--<highchart config="card.cfg" style="position: absolute; width: 100%; height: 100%"></highchart>-->
            <!--</ng-view>-->

            <div style="display: none; position: absolute; margin: 10px; padding: 5px;text-align: left; background: pink">
                <p>$index : {{$index}}</p>
                <p>$id : {{$id}}</p>
                <p>card.chartType : {{card.chartType}}</p>
                <p>card.isRowScale : {{card.isRowScale}}</p>
                <p>card.rowIndex : {{card.rowIndex}}</p>
                <p>card.valueIndex : {{card.valueIndex}}</p>
            </div>

        </div>

        <!-- contextmenu : 차트 메뉴 -->
        <ul id="popup{{$index}}" class="popup">
            <li>
                <a href="" ng-click="splitClick(rowIndex)">카드 분리</a>
            </li>
            <li>
                <a href="">검색</a>
            </li>
            <li>
                <a href="">피벗</a>
            </li>
        </ul>
        <!-- //contextmenu : 차트 메뉴 -->

    </div>




</div>
