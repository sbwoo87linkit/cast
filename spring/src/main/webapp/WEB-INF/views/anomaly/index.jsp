<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<section ng-controller="anomaly.MainCtrl">
    <div class="mu-row pivotHead">
        <!-- 정보 출력/버튼 컨트롤 -->
        <%@ include file="./info.jsp"%>
    </div>

    <!-- 카드 영역 -->
    <%@ include file="./card/container.jsp"%>

    <!-- 카드 설정 폼 -->
    <%@ include file="./dialog/dialog.jsp"%>
</section>
