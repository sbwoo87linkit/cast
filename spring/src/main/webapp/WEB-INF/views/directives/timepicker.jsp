<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<div class="mu-selectbox"><!-- 2016-10-20 MOD -->
    <input type="text" class="mu-input" placeholder="00:00:00" ng-model="timeModel">
    <button class="mu-btn mu-btn-icon mu-btn-icon-only">
        <i class="mu-icon clock"></i>
    </button>
    <ul class="mu-list" ng-show="isShow" style="display: block;">
        <li ng-repeat="item in selTimeDatas" ng-click="selectItem(item)" ng-class="{ active: item.isSelected }">{{item.text}}</li>
    </ul>
</div>
