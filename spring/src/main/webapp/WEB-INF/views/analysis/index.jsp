<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<section ng-controller="analysis.MainCtrl">
    <div class="mu-row pivotHead">
        <!-- 정보 출력/버튼 컨트롤 -->
        <%@ include file="./info.jsp"%>
    </div>

    <div class="mu-row main">
        <!-- 메인 작업화면 -->
        <%@ include file="./main.jsp"%>
    </div>

    <!-- ... -->


</section>
