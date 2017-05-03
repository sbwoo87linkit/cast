<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="mu-row pivotBody anomalyWrap" ng-controller="anomaly.card.ContainerCtrl" id="ade_div_card_cont">

    <button ng-click="addItem()">ADD</button>
    <button ng-click="openOptionsDlg()">ADD card</button>
    <div style="width: 100%;  padding:20px; background: powderblue;  overflow: hidden">
        <div  ng-repeat="item in items track by $index" style="float:left; width:300px;">
            <highchart config="item.cfg" style="margin:5px;height: 250px;"></highchart>
            <button ng-click="removeItem($index)">Remove {{$index}}</button>
        </div>
    </div>

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
