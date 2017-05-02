<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="anomalyCard" ng-controller="anomaly.card.CardCtrl">
    <div class="mu-panel">
        <div class="mu-panel-head">
            <span class="title" title="{{card.adeOptions.title}}">
                <i class="mu-icon-img info" mu-tooltip-area="anomaly.card_info_{{$index}}" tooltip-placement="bottom-left" tooltip-offset="{left:-6}"></i>
                {{card.adeOptions.title}}
            </span>
            <div class="mu-hgroup fr">
                <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" ng-click="card.isMaxSize=!card.isMaxSize;resetRows();"><i class="mu-icon-img" ng-class="{ true: 'collapse', false: 'expand' }[!!(card.isMaxSize)]"></i></button>
                <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" ng-click="" ng-disabled="card.state.running" popup-layer-area="anomaly.layer.cardmenu_{{$index}}"><i class="mu-icon-img more"></i></button>
            </div>
        </div>

        <%@ include file="./result.jsp"%>
    </div>

    <!-- tooltip: 카드 설정 정보 -->
    <div class="mu-tooltip pivotTooltip" mu-tooltip="anomaly.card_info_{{$index}}">
        <div class="arrow"></div>
        <div class="mu-tooltip-inner fieldList" ng-init="opt=card.adeOptions" style="height: 288px;">
            <table class="mu-formbox mu-slide-menu">
                <tbody>
                    <tr>
                        <th><spring:message code="anomaly.opt.analysis_options" /></th>
                        <td>
                            <ul>
                                <li>
                                    <span><spring:message code="anomaly.opt.key_field" />: </span>
                                    <span ng-repeat="keyField in opt.keyFields">{{keyField.field.name}}{{($last) ? '' : ', '}}</span>
                                </li>
                                <li>
                                    <span><spring:message code="anomaly.opt.val_field" />: </span>
                                    <span ng-repeat="valField in opt.valFields">{{valField.field.name}}{{($last) ? '' : ', '}}</span>
                                </li>
                                <li>
                                    <span><spring:message code="anomaly.opt.model" />: </span>
                                    <span ng-bind="opt.model | anomalyModel"></span>
                                </li>
                                <li>
                                    <spring:message code="anomaly.opt.processed_anomaly" var="processed_anomaly" />
                                    <spring:message code="anomaly.opt.do_not_process" var="do_not_process" />

                                    <span><spring:message code="anomaly.opt.include_new_key" />: </span>
                                    <span ng-bind="(opt.includeNewKey) ? '${processed_anomaly}' : '${do_not_process}'"></span>
                                </li>
                                <li>
                                    <span><spring:message code="anomaly.opt.missing_value" />: </span>
                                    <span ng-bind="opt.missingValue | anomalyMissing"></span>
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th><spring:message code="anomaly.opt.time_options" /></th>
                        <td>
                            <ul>
                                <li>
                                    <span><spring:message code="anomaly.opt.comparison_period" />: </span>
                                    <span ng-bind="opt.comTimeRange.start | allrange2text:opt.comTimeRange.end"></span>
                                </li>
                                <li>
                                    <span><spring:message code="unit" />: </span>
                                    <span ng-bind="opt.timeUnit | anomalyUnit"></span>
                                </li>
                                <li>
                                    <span><spring:message code="anomaly.opt.reference_period" />: </span>
                                    <span ng-bind="opt.refTimeRange.start | allrange2text:opt.refTimeRange.end"></span>
                                </li>
                                <li>
                                    <spring:message code="anomaly.opt.match" var="match" />
                                    <spring:message code="anomaly.opt.not_match" var="not_match" />

                                    <span><spring:message code="anomaly.opt.time_zone" />: </span>
                                    <span ng-bind="(opt.isMatchTimezone) ? '${match}' : '${not_match}'"></span>
                                </li>
                                <li>
                                    <span><spring:message code="anomaly.opt.date_classification" />: </span>
                                    <span ng-bind="opt.dateClassification | anomalyClassifyDate"></span>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- contextmenu: 카드 메뉴 -->
    <div class="mu-tooltip bottom" popup-layer="anomaly.layer.cardmenu_{{$index}}">
        <div class="arrow"></div>
        <ul class="mu-popup-menu">
            <li ng-click="changeOptions($index)">
                <a href="javascript:;"><i class="mu-icon-img option"></i><spring:message code="anomaly.change_option" /></a>
            </li>
            <li ng-click="copyCard($index, cards[$index])">
                <a href="javascript:;"><i class="mu-icon-img copy"></i><spring:message code="copy" /></a>
            </li>
            <li ng-click="restartJob($index)">
                <a href="javascript:;"><i class="mu-icon-img rerun"></i><spring:message code="anomaly.retry" /></a>
            </li>
            <li ng-click="removeCard($index)">
                <a href="javascript:;"><i class="mu-icon-img trash"></i><spring:message code="delete" /></a>
            </li>
        </ul>
    </div>
    <!-- //contextmenu : 카드 메뉴 -->
</div>
