<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div ng-controller="anomaly.dialog.DialogCtrl">
    <div class="mu-dialog-background" mu-dialog="anomaly.popup.edit"></div>
    <div class="mu-dialog mu-fix-foot mu-formbox-inner anomalyDialog" mu-dialog="anomaly.popup.edit" dialog-position="auto" style="width: 600px;" ng-style="{ height: dlgHeight }" id="ade_dlg_options">
        <!-- 상단 제목 -->
        <div class="mu-dialog-head" mu-dialog-head="" movable="">
            <span class="title"><spring:message code="anomaly.opt.run_options" /></span>
            <button type="button" class="mu-btn mu-btn-icon mu-btn-bg-non" mu-dialog-close="anomaly.popup.edit"><i class="mu-icon-img"></i></button>
        </div>
        <!-- form -->
        <%@ include file="./form.jsp"%>
        <!-- 하단 버튼 -->
        <div class="mu-dialog-foot" ng-switch on="status">
            <button class="mu-btn btnDelete" type="button" mu-dialog-close="anomaly.popup.edit"><spring:message code="cancel" /></button>
            <button class="mu-btn btnDelete" type="button" ng-click="resetOptions()"><spring:message code="reset" /></button>

            <button class="mu-btn btnApply fr" type="button" ng-switch-when="create" ng-click="runCard()"><spring:message code="run" /></button>
            <button class="mu-btn btnApply fr" type="button" ng-switch-when="update" ng-click="updateRunCard()"><spring:message code="run" /></button>
            <button class="mu-btn btnDelete fr" type="button" ng-switch-when="update" ng-click="updateCard()"><spring:message code="save" /></button>
        </div>
    </div>
</div>
