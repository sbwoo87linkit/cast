<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!-- 팝업 레이어: 키 필드 -->
<div class="mu-tooltip right pivotTooltip" popup-layer="anomaly.opt.val_field" ng-controller="anomaly.dialog.layer.ValueFieldCtrl" id="ade_pl_val_field">
    <spring:message code="optional" var="optional"/>

    <div class="arrow"></div>
    <div class="mu-tooltip-inner" ng-class="{ true: '', false: 'fieldList' }[isShowForm]">
        <field-list fields="fields" withouts="withoutFields" choose-field="nextForm('val_field', field)" ng-hide="isShowForm"></field-list>

        <table class="mu-formbox" ng-show="isShowForm">
            <thead>
                <tr>
                    <th><button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" ng-click="prevForm('val_field')"><i class="mu-icon-img arrow-prev"></i></button></th>
                    <td ng-bind="valField.field.name"></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th><spring:message code="minimum" /></th>
                    <td>
                        <input type="text" class="mu-input" style="width: 85%;" ng-model="valField.min">
                    </td>
                </tr>
                <tr>
                    <th><spring:message code="maximum" /></th>
                    <td>
                        <input type="text" class="mu-input" style="width: 85%;" ng-model="valField.max">
                    </td>
                </tr>
                <tr>
                    <th><spring:message code="anomaly.opt.exclude_values" /></th>
                    <td>
                        <input type="text" class="mu-input" style="width: 85%; display: inline-block;" ng-model="valField.excludes">
                        <label style="display: inline-block;">
                            <i class="mu-icon-img help" style="cursor: pointer;" mu-tooltip-area="anomaly.ttip.val_field_values" tooltip-placement="bottom-right" tooltip-trigger="click" tooltip-offset="{left: 6}"></i>
                        </label>
                        <!-- text tooltip -->
                        <div class="mu-tooltip" style="z-index: 30;" mu-tooltip="anomaly.ttip.val_field_values">
                            <div class="arrow"></div>
                            <div class="mu-tooltip-inner">
                                <spring:message code="anomaly.tooltip.sep_comma" var="ttip_sep_comma" />
                                <div ng-repeat="line in '${ttip_sep_comma}'.split('\n')">{{line}}<br/></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th><spring:message code="anomaly.opt.agg_func" /></th>
                    <td>
                        <!-- selectbox: 함수 -->
                        <div class="mu-selectbox" mu-select-v2="anomaly.sb.vf.agg_func" select-model="valField.func">
                            <button class="mu-value" title="{{funcs[valField.func]}}">{{funcs[valField.func]}}</button>
                            <ul class="mu-list">
                                <li ng-repeat="(value, name) in funcs" mu-option-v2="value" title="{{name}}">{{name}}</li>
                            </ul>
                        </div>
                    </td>
                </tr>
                <!-- 유효성 확인: 최소/최대값 -->
                <tr ng-if="isInvalid.onlyNum">
                    <th></th>
                    <td>
                        <div>
                            <i class="mu-icon-img alert"></i>
                            <span><spring:message code="anomaly.message.only_num" /></span>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr ng-if="isShowForm">
                    <th></th>
                    <td>
                        <button class="mu-btn btnDelete" type="button" ng-click="cancel()"><spring:message code="cancel" /></button>
                        <button class="mu-btn btnDelete" type="button" ng-show="isUpdate" ng-click="remove()"><spring:message code="remove" /></button>

                        <button class="mu-btn btnApply fr" type="button" ng-hide="isUpdate" ng-click="add(valField)"><spring:message code="select" /></button>
                        <button class="mu-btn btnApply fr" type="button" ng-show="isUpdate" ng-click="update(valField)"><spring:message code="update" /></button>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</div>
