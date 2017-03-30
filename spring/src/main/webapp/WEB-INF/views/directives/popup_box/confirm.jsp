<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div>
    <div class="mu-background" mu-dialog="iris.confirm" style="z-index: 101;"></div>
    <div class="mu-alert etc" mu-dialog="iris.confirm" dialog-offset="auto" style="z-index: 102; min-width: 250px; max-width: 800px; width: auto;">
        <div class="mu-alert-head">
            <i class="mu-icon exclamation"></i>
        </div>
        <div class="mu-alert-body">
            <span ng-repeat="msg in message track by $index">{{msg}}<br></span>
        </div>
        <div class="mu-alert-foot">
            <button type="button" class="mu-btn" ng-click="close(true)"><spring:message code="yes" /></button>
            <button type="button" class="mu-btn cancel" ng-click="close(false)"><spring:message code="no" /></button>
        </div>
    </div>
</div>
