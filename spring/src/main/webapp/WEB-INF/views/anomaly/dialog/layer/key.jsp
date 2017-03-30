<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!-- 팝업 레이어: 키 필드 -->
<div class="mu-tooltip right pivotTooltip" popup-layer="anomaly.opt.key_field" ng-controller="anomaly.dialog.layer.KeyFieldCtrl" id="ade_pl_key_field">
    <spring:message code="optional" var="optional"/>

    <div class="arrow"></div>
    <div class="mu-tooltip-inner" ng-class="{ true: '', false: 'fieldList' }[isShowForm]">
        <field-list fields="fields" withouts="withoutFields" choose-field="nextForm('key_field', field)" ng-hide="isShowForm"></field-list>

        <table class="mu-formbox" ng-show="isShowForm">
            <thead>
                <tr>
                    <th><button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only" ng-click="prevForm('key_field')"><i class="mu-icon-img arrow-prev"></i></button></th>
                    <td ng-bind="keyField.field.name"></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th><spring:message code="label" /></th>
                    <td>
                        <input type="text" class="mu-input" placeholder="${optional}" ng-model="keyField.label">
                    </td>
                </tr>
                <tr>
                    <th><spring:message code="anomaly.opt.max_key" /></th>
                    <td>
                        <input type="text" class="mu-input" ng-model="keyField.limit_num">
                    </td>
                </tr>
                <tr>
                    <th></th>
                    <td class="sect"><span class=""></span></td>
                </tr>
                <tr>
                    <th></th>
                    <td>
                        <div class="mu-search-group">
                            <div class="mu-search-item">
                                <div class="mu-item-group">
                                    <div class="mu-radio">
                                        <input type="radio" name="key_field_values" id="lbl_adb_kf_all_val" ng-model="keyValueMode" value="all">
                                        <label for="lbl_adb_kf_all_val"><spring:message code="anomaly.opt.all_values" /></label>
                                    </div>
                                    <div class="mu-radio">
                                        <input type="radio" name="key_field_values" id="lbl_adb_kf_spec_val" ng-model="keyValueMode" value="spec">
                                        <label for="lbl_adb_kf_spec_val"><spring:message code="anomaly.opt.specify_value" /></label>
                                    </div>
                                    <div class="mu-radio">
                                        <input type="radio" name="key_field_values" id="lbl_adb_kf_dr_input" ng-model="keyValueMode" value="input">
                                        <label for="lbl_adb_kf_dr_input"><spring:message code="anomaly.opt.direct_input" /></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th></th>
                    <td ng-show="keyValueMode === 'spec'">
                        <table class="mu-grid" mu-table="anomaly.field_stats" rows="currField.modes">
                            <colgroup>
                                <col width="50px">
                                <col width="120px">
                                <col width="80px">
                            </colgroup>
                            <thead mu-table-head="">
                                <spring:message code="search.top_10_values" var="search_top_10_values" />
                                <spring:message code="search.values" var="search_values" />
                                <tr>
                                    <th class="none">
                                        <div class="mu-checkbox">
                                            <input type="checkbox" id="ade_kfs_ckb_all" ng-click="toggleAll(currField.modes)" ng-checked="isCheckedAll(currField.modes)">
                                            <label for="ade_kfs_ckb_all"></label>
                                        </div>
                                    </th>
                                    <th ng-bind="(currField.modes.length >= 10) ? '${search_top_10_values}' : '${search_values}'"></th>
                                    <th><spring:message code="search.count" /></th>
                                </tr>
                            </thead>
                            <tbody mu-table-body="">
                                <tr ng-repeat="row in $data">
                                    <td>
                                        <div class="mu-checkbox">
                                            <input type="checkbox" id="ade_kfs_ckb_{{$index}}" ng-model="row.isSelected" ng-change="setInputText()">
                                            <label for="ade_kfs_ckb_{{$index}}"></label>
                                        </div>
                                    </td>
                                    <td>{{row.value}}</td>
                                    <td>{{row.count | number}}</td>
                                </tr>
                                <tr ng-show="currField.modes.length <= 0 && currField._isFetching && !currField._isFetchError">
                                    <td colspan="{{$cols.length}}"><spring:message code="grid.fetching_data" /></td>
                                </tr>
                                <tr ng-show="currField.modes.length <= 0 && !currField._isFetching && !currField._isFetchError">
                                    <td colspan="{{$cols.length}}"><spring:message code="grid.no_data" /></td>
                                </tr>
                                <tr ng-show="currField._isFetchError">
                                    <td colspan="{{$cols.length}}"><spring:message code="grid.fetch_error" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td ng-show="keyValueMode === 'input'">
                        <input type="text" class="mu-input" style="width: 85%; display: inline-block;" ng-model="keyField.values">
                        <label style="display: inline-block;">
                            <i class="mu-icon-img help" style="cursor: pointer;" mu-tooltip-area="anomaly.ttip.key_field_values" tooltip-placement="bottom-right" tooltip-trigger="click" tooltip-offset="{left: 6}"></i>
                        </label>
                        <!-- text tooltip -->
                        <div class="mu-tooltip" style="z-index: 30;" mu-tooltip="anomaly.ttip.key_field_values">
                            <div class="arrow"></div>
                            <div class="mu-tooltip-inner">
                                <spring:message code="anomaly.tooltip.sep_comma" var="ttip_sep_comma" />
                                <div ng-repeat="line in '${ttip_sep_comma}'.split('\n')">{{line}}<br/></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <!-- 유효성 확인: 최대 키 개수 -->
                <tr ng-if="isInvalid.limitNum">
                    <th></th>
                    <td>
                        <div class="mt10" ng-show="isInvalid.limitNum"><i class="mu-icon-img alert"></i><span><spring:message code="anomaly.message.only_num_to_100" /></span></div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr ng-if="isShowForm">
                    <th></th>
                    <td>
                        <button class="mu-btn btnDelete" type="button" ng-click="cancel()"><spring:message code="cancel" /></button>
                        <button class="mu-btn btnDelete" type="button" ng-show="isUpdate" ng-click="remove()"><spring:message code="remove" /></button>

                        <button class="mu-btn btnApply fr" type="button" ng-hide="isUpdate" ng-click="add(keyField)"><spring:message code="select" /></button>
                        <button class="mu-btn btnApply fr" type="button" ng-show="isUpdate" ng-click="update(keyField)"><spring:message code="update" /></button>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</div>
