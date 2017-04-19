<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div>
    <div class="mu-background" mu-dialog="iris.alert" style="z-index: 101;"></div>
    <div class="mu-alert" ng-class="type" mu-dialog="iris.alert" dialog-offset="auto" style="z-index: 102; min-width: 250px; max-width: 800px; width: auto;">
        <div class="mu-alert-head" ng-switch on="type">
            <i class="mu-icon exclamation"></i>
            <p class="mu-alert-status" ng-switch-when="success"><spring:message code="success" /></p>
            <p class="mu-alert-status" ng-switch-when="error"><spring:message code="error" /></p>
        </div>
        <div class="mu-alert-body">
            <span style="word-break: break-all;" ng-repeat="msg in message track by $index">{{msg}}<br></span>
        </div>
        <div class="mu-alert-foot">
            <button type="button" class="mu-btn" ng-click="close(true)"><spring:message code="yes" /></button>
        </div>
    </div>
</div>
