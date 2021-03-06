<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="mu-row pivotBody anomalyWrap" ng-controller="anomaly.card.ContainerCtrl" id="ade_div_card_cont">

    <div class="mu-col" ng-class="{ true: 'mu-col-12', false: 'mu-col-4' }[card.isMaxSize]"
        ng-repeat="card in cards track by $index">
        <%@ include file="./card.jsp"%>
    </div>

    <!-- add card -->
    <div class="mu-col mu-col-4">
        <div class="anomalyCard anomalyBlank" ng-click="openOptionsDlg()">
            <div class="mu-panel">
                <div class="mu-panel-body">
                    <div class="anomalyWrap">
                        <a href="">
                            <i class="mu-icon-img anomalyAdd"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
