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

    <%@ include file="./scripts.jsp"%>
</body>
</html>
