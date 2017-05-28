<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<section ng-controller="analysis.MainCtrl">
    <div class="mu-row pivotHead">
        <!-- 정보 출력/버튼 컨트롤 -->
        <%@ include file="./info.jsp"%>
    </div>
    <div class="mu-row pivotBody">
        <!-- 메인 작업화면 -->
        <%@ include file="./chart/container.jsp"%>

        <!-- 로딩 중 오버레이 -->
        <div class="chart-overlay" ng-if="adv.isWaiting">
            <div class="center">
                <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                <span style="font-size:2.4em">결과를 기다리는 중 ......</span>
            </div>
        </div>

    </div>
</section>
