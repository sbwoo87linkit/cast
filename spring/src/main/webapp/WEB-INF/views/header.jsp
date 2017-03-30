<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<header>
    <!-- <a href="?language=en_US">English</a> | <a href="?language=ko_KR">Korean</a> -->
    <nav class="mu-gnb" ng-controller="HeaderCtrl">
        <!-- Depth1 -->
        <ul class="mu-hMenu">
            <!-- 분석 -->
            <li ng-class="{ active : (routePaths[0] === 'analysis' || routePaths[0] === 'analysis_choose_data') }">
                <a ui-sref="analysis_choose_data">
                    <i class="mu-icon-img analysis"></i>
                    <span><spring:message code="menu.analysis" /></span>
                </a>
            </li>
            <!-- 이상탐지 -->
            <li ng-class="{ active : (routePaths[0] === 'anomaly' || routePaths[0] === 'anomaly_choose_data') }">
                <a ui-sref="anomaly_choose_data">
                    <i class="mu-icon-img anomaly"></i>
                    <span><spring:message code="menu.anomaly" /></span>
                </a>
            </li>
        </ul>
    </nav>
</header>
