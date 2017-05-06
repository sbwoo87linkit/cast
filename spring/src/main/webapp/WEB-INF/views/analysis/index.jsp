<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<section ng-controller="analysis.MainCtrl">
    <div class="mu-row pivotHead">
        <!-- 정보 출력/버튼 컨트롤 -->
        <%@ include file="./info.jsp"%>
    </div>
    <div class="mu-row" style="height: 100%">
        <!-- 메인 작업화면 -->
        <div class="area-side" style="position: relative">
            <div style="position: absolute; width: 100%; height:28px; border-bottom: 1px solid #ddd"></div>
            <ul class="mu-tab" mu-tabset="ts2">
                <li mu-tab-item="" tab-activated="true">
                    <a href="javascript:;">필드</a>
                </li>
                <li mu-tab-item="">
                    <a href="javascript:;">필터</a>
                </li>
            </ul>
            <div class="mu-tab-body" mu-tabset="ts2">
                <div class="mu-tabCont" mu-tab-contents="">
                    <!--side menu</p>-->
                    <h5 class="mu-title tc" style="padding: 10px;">Event Object의 개수 <span class="mu-badge">{{fieldList.length}}</span></h5>
                    <ul class="mu-vMenu mu-slide-menu">
                        <li ng-repeat="field in fieldList">
                            <a href="" ng-click="clickItem(field)">
                                <i class="mu-icon-img"
                                   ng-class="{ TEXT: 'at', NUMBER: 'number', TIMESTAMP: 'time' }[field.type]"></i>
                                <span ng-bind="field.name"></span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="mu-tabCont" mu-tab-contents="">
                    <h4 class="mu-title tc">필터</h4>
                    <ul class="mu-vMenu">
                        <li class="active"><a href=""><i class="mu-icon ex"></i><span>Menu01</span></a></li>
                        <li><a href=""><i class="mu-icon ex"></i><span>Menu02</span></a></li>
                    </ul>
                </div>
            </div>
        </div>
        isWaiting {{isWaiting}} - {{$id}}
        <div class="area-main">
            <!--main content-->
            <%@ include file="./main.jsp"%>
        </div>
        <div class="chart-overlay" ng-if="isWaiting">
            <div id="container" ng-if="analysis.chart.type==='차트 유형 선택'" style="height: 100%; width: 100%;">
                <div id="content">
                    <!--<i class="mu-icon ex" style="font-size: 1.2em; margin-right:10px; "></i>-->
                    <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                    <span style="font-size:2.4em">결과를 기다리는 중 ......</span>
                </div>
            </div>
        </div>
    </div>
</section>
