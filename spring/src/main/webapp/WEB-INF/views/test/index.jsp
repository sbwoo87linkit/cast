<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<section ng-controller="anomaly.MainCtrl">
    <div class="mu-row pivotHead"></div>
    <div class="mu-row pivotBody anomalyWrap">
        <%@ include file="./stats/visual_chart.jsp"%>
    </div>
</section>
