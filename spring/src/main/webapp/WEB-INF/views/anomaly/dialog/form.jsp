<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div class="mu-dialog-body" mu-dialog-body="" ng-controller="anomaly.dialog.FormCtrl">
    <!-- 제목 -->
    <table class="mu-formbox">
        <colgroup>
            <col width="100px">
        </colgroup>
        <tbody>
            <tr>
                <th><spring:message code="anomaly.opt.title" /></th>
                <td>
                    <input type="text" class="mu-input" ng-model="formData.title">
                    <!-- 유효성 확인 -->
                    <div class="mt10" ng-show="isInvalidForm.title">
                        <i class="mu-icon-img alert"></i>
                        <span><spring:message code="anomaly.message.empty_title" /></span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <!-- 분석 설정 -->
    <table class="mu-formbox">
        <colgroup>
            <col width="100px">
        </colgroup>
        <tbody>
            <tr class="sect">
                <th></th>
                <td><span><spring:message code="anomaly.opt.analysis_options" /></span></td>
            </tr>
            <!-- 키 필드 -->
            <tr>
                <th><spring:message code="anomaly.opt.key_field" /></th>
                <td>
                    <div class="anomalySetting">
                        <div class="mu-item-group" ng-repeat="keyField in formData.keyFields">
                            <div class="mu-btn-group">
                                <input type="text" class="mu-input" readonly="readonly" value="{{keyField | anomalyKey}}">
                                <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"
                                    popup-layer-area="anomaly.opt.key_field" layer-open="showLayer('key_field', keyField, $index)"><i class="mu-icon-img modify"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"
                            popup-layer-area="anomaly.opt.key_field" layer-open="showLayer('key_field')"><i class="mu-icon-img add"></i>
                        </button>
                        <%@ include file="./layer/key.jsp"%>
                    </div>
                </td>
            </tr>
            <!-- 값 필드 -->
            <tr>
                <th><spring:message code="anomaly.opt.val_field" /></th>
                <td>
                    <div class="anomalySetting">
                        <div class="mu-item-group" ng-repeat="valField in formData.valFields">
                            <div class="mu-btn-group">
                                <input type="text" class="mu-input" readonly="readonly" value="{{valField | anomalyValue}}">
                                <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"
                                    popup-layer-area="anomaly.opt.val_field" layer-open="showLayer('val_field', valField, $index)"><i class="mu-icon-img modify"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"
                            popup-layer-area="anomaly.opt.val_field" layer-open="showLayer('val_field')"><i class="mu-icon-img add"></i>
                        </button>
                        <%@ include file="./layer/value.jsp"%>
                    </div>
                    <!-- 유효성 확인 -->
                    <div class="mt10" ng-show="isInvalidForm.valField">
                        <i class="mu-icon-img alert"></i>
                        <span><spring:message code="anomaly.message.empty_val_field" /></span>
                    </div>
                </td>
            </tr>
            <!-- 모델 -->
            <tr>
                <th><spring:message code="anomaly.opt.model" /></th>
                <td>
                    <!-- selectbox: 모델 -->
                    <div class="mu-selectbox" mu-select-v2="anomaly.sb.model" select-model="formData.model">
                        <button class="mu-value" title="{{models[formData.model]}}">{{models[formData.model]}}</button>
                        <ul class="mu-list">
                            <li ng-repeat="(value, name) in models" mu-option-v2="value" title="{{name}}">{{name}}</li>
                        </ul>
                    </div>

                    <label><i class="mu-icon-img help" style="cursor: pointer" mu-tooltip-area="anomaly.ttip.model" tooltip-placement="top" tooltip-trigger="click"></i></label>
                    <!-- text tooltip -->
                    <div class="mu-tooltip" style="z-index: 30;" mu-tooltip="anomaly.ttip.model">
                        <div class="arrow"></div>
                        <div class="mu-tooltip-inner">
                            <spring:message code="anomaly.tooltip.model" var="ttip_model" />
                            <div ng-repeat="line in '${ttip_model}'.split('\n') track by $index">{{line}}<br/></div>
                        </div>
                    </div>
                </td>
            </tr>
            <!-- 없는 key 값 -->
            <tr ng-show="formView.isMoreOpt">
                <th><spring:message code="anomaly.opt.include_new_key" /></th>
                <td>
                    <div class="mu-checkbox">
                        <input type="checkbox" name="include_new_key" id="lbl_ade_include_new_key" ng-model="formData.includeNewKey">
                        <label for="lbl_ade_include_new_key"><spring:message code="anomaly.opt.processed_anomaly" /></label>
                    </div>
                </td>
            </tr>
            <!-- 결측치 -->
            <tr ng-show="formView.isMoreOpt">
                <th><spring:message code="anomaly.opt.missing_value" /></th>
                <td>
                    <!-- selectbox: 결측치 -->
                    <div class="mu-selectbox" mu-select-v2="anomaly.sb.missing" select-model="formData.missingValue">
                        <button class="mu-value" title="{{missings[formData.missingValue]}}" style="width: 120px;">{{missings[formData.missingValue]}}</button>
                        <ul class="mu-list">
                            <li ng-repeat="(value, name) in missings" mu-option-v2="value" title="{{name}}">{{name}}</li>
                        </ul>
                    </div>
                </td>
                <td>
                    <div ng-show="formData.missingValue === 'custom_value'">
                        <input type="text" class="mu-input" ng-model="formData.customMissingValue">
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <!-- 시간 설정 -->
    <table class="mu-formbox">
        <colgroup>
            <col width="100px">
            <col width="230px">
            <col width="100px">
            <col>
        </colgroup>
        <tbody>
            <tr class="sect">
                <th></th>
                <td colspan="3"><span><spring:message code="anomaly.opt.time_options" /></span></td>
            </tr>
            <!-- 비교 기간, 단위 -->
            <tr>
                <th><spring:message code="anomaly.opt.comparison_period" /></th>
                <td>
                    <div class="anomalySetting">
                        <div class="mu-item-group">
                            <div class="mu-btn-group">
                                <input type="text" class="mu-input" readonly="readonly" value="{{toHumanize(formData.comTimeRange)}}"
                                    mu-tooltip-area="anomaly.ttip.com_period" tooltip-trigger="mouseover" tooltip-placement="top" tooltip-ignore="button">
                                <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" popup-layer-area="anomaly.opt.com_period" layer-open="showTimeLayer('com_period', formData.comTimeRange)"><i class="mu-icon-img modify"></i></button>
                            </div>
                            <!-- text tooltip -->
                            <div class="mu-tooltip top" mu-tooltip="anomaly.ttip.com_period">
                                <div class="arrow"></div>
                                <div class="mu-tooltip-inner">
                                    <span>{{toHumanize(formData.comTimeRange)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 팝업 레이어 -->
                    <div class="mu-tooltip top pivotTooltip" style="width: 745px;" popup-layer="anomaly.opt.com_period" ng-controller="anomaly.dialog.layer.TimeComCtrl">
                        <div class="arrow"></div>
                        <div class="mu-tooltip-inner searchTime">
                            <datetime-picker name="anomaly.tp.com_period" change-datetime="changeDatetime(start, end)" start="startDate" end="endDate"></datetime-picker>
                        </div>
                    </div>
                </td>
                <th><spring:message code="unit" /></th>
                <td>
                    <!-- selectbox: 단위 -->
                    <div class="mu-selectbox" mu-select-v2="anomaly.sb.unit" select-model="formData.timeUnit">
                        <button class="mu-value" title="{{units[formData.timeUnit]}}">{{units[formData.timeUnit]}}</button>
                        <ul class="mu-list">
                            <li ng-repeat="(value, name) in units" mu-option-v2="value" title="{{name}}">{{name}}</li>
                        </ul>
                    </div>
                </td>
            </tr>
            <!-- 유효성 확인: 비교 기간 -->
            <tr ng-show="isInvalidForm.comRange">
                <th></th>
                <td>
                    <div>
                        <i class="mu-icon-img alert"></i>
                        <span><spring:message code="anomaly.message.com_range_lt_unit" /></span>
                    </div>
                </td>
            </tr>
            <!-- 참조 기간, 시간대 -->
            <tr ng-show="formView.isMoreOpt">
                <th><spring:message code="anomaly.opt.reference_period" /></th>
                <td>
                    <div class="anomalySetting">
                        <div class="mu-item-group">
                            <div class="mu-btn-group">
                                <input type="text" class="mu-input" readonly="readonly" value="{{toHumanize(formData.refTimeRange)}}"
                                    mu-tooltip-area="anomaly.ttip.ref_period" tooltip-trigger="mouseover" tooltip-placement="top" tooltip-ignore="button">
                                <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" popup-layer-area="anomaly.opt.ref_period" layer-open="showTimeLayer('ref_period', formData.refTimeRange)"><i class="mu-icon-img modify"></i></button>
                            </div>
                            <!-- text tooltip -->
                            <div class="mu-tooltip top" mu-tooltip="anomaly.ttip.ref_period">
                                <div class="arrow"></div>
                                <div class="mu-tooltip-inner">
                                    <span>{{toHumanize(formData.refTimeRange)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 팝업 레이어 -->
                    <div class="mu-tooltip top pivotTooltip" style="width: 745px;" popup-layer="anomaly.opt.ref_period" ng-controller="anomaly.dialog.layer.TimeRefCtrl">
                        <div class="arrow"></div>
                        <div class="mu-tooltip-inner searchTime">
                            <datetime-picker name="anomaly.tp.ref_period" change-datetime="changeDatetime(start, end)" start="startDate" end="endDate"></datetime-picker>
                        </div>
                    </div>
                </td>
                <th><spring:message code="anomaly.opt.time_zone" /></th>
                <td>
                    <div class="mu-checkbox">
                        <input type="checkbox" name="time_zone" id="lbl_ade_time_zone" ng-model="formData.isMatchTimezone">
                        <label for="lbl_ade_time_zone"><spring:message code="anomaly.opt.match" /></label>
                    </div>

                    <label><i class="mu-icon-img help" style="cursor: pointer" mu-tooltip-area="anomaly.ttip.time_zone" tooltip-placement="top" tooltip-trigger="click"></i></label>
                    <!-- text tooltip -->
                    <div class="mu-tooltip" style="z-index: 30;" mu-tooltip="anomaly.ttip.time_zone">
                        <div class="arrow"></div>
                        <div class="mu-tooltip-inner">
                            <spring:message code="anomaly.tooltip.match_time_zone" var="ttip_match_time_zone" />
                            <div ng-repeat="line in '${ttip_match_time_zone}'.split('\n')">{{line}}<br/></div>
                        </div>
                    </div>
                </td>
            </tr>
            <!-- 유효성 확인: 참조 기간 -->
            <tr ng-show="isInvalidForm.refRange">
                <th></th>
                <td>
                    <div>
                        <i class="mu-icon-img alert"></i>
                        <span><spring:message code="anomaly.message.ref_range_lt_unit" /></span>
                    </div>
                </td>
            </tr>
            <!-- 요일 분류 -->
            <tr ng-show="formView.isMoreOpt">
                <th><spring:message code="anomaly.opt.date_classification" /></th>
                <td colspan="3">
                    <div class="mu-item-group">
                        <div class="mu-radio">
                            <input type="radio" name="day_classify" id="lbl_adb_sameday" ng-model="formData.dateClassification" value="sameday">
                            <label for="lbl_adb_sameday"><spring:message code="anomaly.opt.sameday" /></label>
                        </div>
                        <div class="mu-radio">
                            <input type="radio" name="day_classify" id="lbl_adb_weekday" ng-model="formData.dateClassification" value="weekday">
                            <label for="lbl_adb_weekday"><spring:message code="anomaly.opt.weekday" /></label>
                        </div>
                        <div class="mu-radio">
                            <input type="radio" name="day_classify" id="lbl_adb_weekend" ng-model="formData.dateClassification" value="weekend">
                            <label for="lbl_adb_weekend"><spring:message code="anomaly.opt.weekend" /></label>
                        </div>

                        <label><i class="mu-icon-img help" style="cursor: pointer" mu-tooltip-area="anomaly.ttip.classify_date" tooltip-placement="top" tooltip-trigger="click"></i></label>
                    </div>

                    <!-- text tooltip -->
                    <div class="mu-tooltip" style="z-index: 30;" mu-tooltip="anomaly.ttip.classify_date">
                        <div class="arrow"></div>
                        <div class="mu-tooltip-inner">
                            <spring:message code="anomaly.tooltip.classify_date" var="ttip_classify_date" />
                            <div ng-repeat="line in '${ttip_classify_date}'.split('\n')">{{line}}<br/></div>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="detailOption">
        <button class="mu-btn" type="button" ng-hide="formView.isMoreOpt" ng-click="formView.isMoreOpt=true"><spring:message code="anomaly.opt.show_more_options" /><i class="mu-icon-img arrow-bottom"></i></button>
        <button class="mu-btn" type="button" ng-show="formView.isMoreOpt" ng-click="formView.isMoreOpt=false"><spring:message code="anomaly.opt.hide_more_options" /><i class="mu-icon-img arrow-top"></i></button>
    </div>
</div>
