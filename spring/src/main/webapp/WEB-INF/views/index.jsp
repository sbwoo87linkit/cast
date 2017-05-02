<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html>
<html lang="${systemLocale}">
<%@ include file="./head.jsp"%>
<body ng-controller="MainCtrl" style="background-color: #FFFFFF; min-height: 240px;">
    <%@ include file="./header.jsp"%>

    <div class="mu-container mu-scroll-h" ui-view></div>
    <iris-alert></iris-alert>
    <iris-confirm></iris-confirm>

    <!-- <%@ include file="./footer.jsp"%> -->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/highcharts/5.0.10/highcharts.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highcharts-ng/0.0.13/highcharts-ng.js"></script>
    <script src="https://code.highcharts.com/modules/heatmap.js"></script>
    <script src="https://blacklabel.github.io/custom_events/js/customEvents.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>


    <%@ include file="./scripts.jsp"%>
</body>
</html>
