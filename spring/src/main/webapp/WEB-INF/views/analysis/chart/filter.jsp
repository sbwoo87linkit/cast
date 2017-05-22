<div style="position: absolute; width: 20%; height:28px; border-bottom: 1px solid #ddd"></div>
<ul class="mu-tab" mu-tabset="ts2">
    <li mu-tab-item="" tab-activated="true">
        <a href="javascript:;">필드</a>
    </li>
    <li mu-tab-item="" tab-activated="false">
        <a href="javascript:;">필터</a>
    </li>
</ul>
<div class="mu-tab-body" mu-tabset="ts2">

    <!--필드목록 탭-->
    <div class="mu-tabCont" mu-tab-contents="">

        <!--side menu</p>-->
        <h5 class="mu-title tc" style="padding: 10px;">Event Object의 개수 <span class="mu-badge">{{fieldList.length}}</span>
        </h5>
        <ul class="mu-slide-menu" id="containerLeft" class='containerVertical' style="margin-bottom: 100px">
            <li ng-repeat="field in fieldList" ng-class="field.name === analysis.selectedField.name ? 'active' : '' ">
                <a href="" ng-click="analysis.selectedField = field;selectField(field)"
                   popup-layer-area="analysis.fieldList.add" layer-offset="{left: 2}"
                   layer-open="openedQueryLayer()" layer-close="closedQueryLayer()">
                    <i class="mu-icon-img"
                       ng-class="{ TEXT: 'at', NUMBER: 'number', TIMESTAMP: 'time' }[field.type]"></i>
                    <span ng-bind="field.name"></span>
                    <span ng-show="field.filters.length > 0" class="mu-badge fr" style="margin:5px; background: #2d93ec">F</span>
                </a>
            </li>
        </ul>

    </div>

    <!--필터 탭-->
    <div class="mu-tabCont" mu-tab-contents="">

        <div class="anomalySetting tc" style="margin-top:20px;">
            <div ng-repeat="field in fieldList | filter: hasFilters" style="width: 230px; margin: 0 auto">
                <div ng-repeat="filter in field.filters" style="margin-top: 5px;">
                    <div class="mu-item-group">
                        <div class="mu-btn-group" style="width: 200px;">
                            <div>
                                <input type="text" class="mu-input" readonly="readonly"
                                       value="{{field.name}} {{filter.key}} {{filter.value}}">
                                <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"
                                        ng-click=" analysis.selectedField = field; selectField(field)"
                                        popup-layer-area="analysis.filter.edit"
                                        layer-open="showLayer('key_field', keyField, $index)">
                                    <i class="mu-icon-img modify"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button"
                                style="padding: 5px"
                                ng-click="deleteFilter($index, field.filters)"
                                class="mu-btn mu-btn-icon mu-btn-bg-non"><i class="fa fa-minus-circle" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>

            <button type="button" ng-click="analysis.filter.isShowForm=false"
                    popup-layer-area="analysis.filter.add" layer-offset="{left: 2}"
                    style="background: #fff; border: 1px solid #ccc; padding: 3px" class="mu-btn mu-btn-icon mu-btn-icon-only">
                <i class="mu-icon-img add"></i> 추가 <i style="margin-left: 30px; color: black" class="mu-icon down"></i>
            </button>
        </div>
    </div>
</div>

<!-- 팝업 레이어: 필드리스트 추가 -->
<div class="mu-tooltip right-top" style="width: 360px;" popup-layer="analysis.fieldList.add">
    <div class="arrow"></div>
    <div class="mu-tooltip-inner">
        <span class="title">{{analysis.selectedField.name}}</span>
        <div class="mu-item-group">
            <table class="mu-formbox mu-formbox-vertical">
                <colgroup>
                    <col width="80">
                    <col width="100">
                    <col width="10">
                </colgroup>
                <tbody>
                <tr ng-repeat="tempFilter in analysis.tempFilters">
                    <td>
                        <div class="mu-selectbox" mu-select-v2="" select-model="tempFilter.key">
                            <button class="mu-value" title="{{models[tempFilter.key]}}">{{models[tempFilter.key]}}</button>
                            <ul class="mu-list">
                                <li ng-repeat="(value, name) in models" mu-option-v2="value" title="{{name}}">{{name}}</li>
                            </ul>
                        </div>
                    </td>
                    <td>
                        <input type="text" ng-change="$last && addTempFilter(analysis.tempFilters, inputFilter)" ng-model="tempFilter.value" class="mu-input mu-input-default">
                    </td>
                    <td>
                        <button type="button"
                                ng-click="deleteTempFilter($index, tempFilter)"
                                class="mu-btn mu-btn-icon mu-btn-bg-non"><i class="fa fa-minus-circle" aria-hidden="true"></i></button>
                    </td>
                </tr>
                </tbody>
            </table>
            <!--<button ng-click="addTempFilter(analysis.tempFilters, inputFilter)" style="padding-top: 5px; margin-top: 5px; margin-left: 10px;"><i class="mu-icon add"></i></button>-->
            <button type="button"
                    ng-click="addTempFilter(analysis.tempFilters, inputFilter)"
                    style="background: #fff; border: 1px solid #ccc; padding: 3px"
                    class="mu-btn mu-btn-icon mu-btn-icon-only">
                <i class="mu-icon-img add"></i>
            </button>
        </div>
        <div class="mu-item-group" style="padding-top: 10px;height: 30px;">
            <button class="mu-btn btnApply fr" type="button" ng-click="saveFilter(analysis.selectedField, analysis.tempFilters)"><spring:message code="save" /></button>
        </div>
    </div>
</div>

<!-- 팝업 레이어: 필터 추가 -->
<div class="mu-tooltip pivotTooltip right-top" style="width: 360px;" popup-layer="analysis.filter.add">
    <div class="arrow"></div>
    <div class="mu-tooltip-inner" style="margin: 0; padding: 0">
        <div class="mu-item-group">

            <!--필터추가 - 1단계 - 필드목록-->
            <table class="mu-formbox mu-slide-menu" ng-show="!analysis.filter.isShowForm">
                <tbody>
                <tr>
                    <th>필드</th>
                    <td>
                        <ul>
                            <li ng-repeat="field in fieldList">
                                <a href="" ng-click="analysis.filter.isShowForm=true; analysis.selectedField = field; selectField(field)">
                                    <i class="mu-icon-img at" ng-class="{ TEXT: 'at', NUMBER: 'number', TIMESTAMP: 'time' }[field.type]"></i>
                                    <span ng-bind="field.name" class="ng-binding">DATE</span>
                                </a>
                            </li>
                            <li ng-hide="fieldList.length">
                                <span>선택 가능한 필드가 없습니다.</span>
                            </li>
                        </ul>
                    </td>
                </tr>
                </tbody>
            </table>

            <!--필터추가 - 2단계 - 필터조건 선택-->
            <table class="mu-formbox" ng-show="analysis.filter.isShowForm" style="margin: 0">
                <thead>
                <tr>
                    <th>
                        <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"
                                ng-click="analysis.filter.isShowForm = false; prevForm('val_field')">
                            <i class="mu-icon-img arrow-prev"></i>
                        </button>
                    </th>
                    <td ng-bind="analysis.selectedField.name"></td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th></th>
                    <td style="margin: 0; padding: 0">

                        <table class="mu-formbox mu-formbox-vertical" style="padding: 0; margin: 0; height: auto">
                            <colgroup>
                                <col width="50">
                                <col width="70">
                                <col width="10">
                            </colgroup>
                            <tbody>
                            <tr ng-repeat="tempFilter in analysis.tempFilters">
                                <td>
                                    <div class="mu-selectbox" mu-select-v2="" select-model="tempFilter.key">
                                        <button class="mu-value" title="{{models[tempFilter.key]}}">{{models[tempFilter.key]}}</button>
                                        <ul class="mu-list">
                                            <li ng-repeat="(value, name) in models" mu-option-v2="value" title="{{name}}">{{name}}</li>
                                        </ul>
                                    </div>
                                </td>
                                <td>
                                    <input type="text" ng-change="$last && addTempFilter(analysis.tempFilters, inputFilter)" ng-model="tempFilter.value" class="mu-input mu-input-default">
                                </td>
                                <td>
                                    <button type="button"
                                            ng-click="deleteTempFilter($index, tempFilter)"
                                            class="mu-btn mu-btn-icon mu-btn-bg-non"><i class="fa fa-minus-circle" aria-hidden="true"></i></button>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <button type="button"
                                ng-click="addTempFilter(analysis.tempFilters, inputFilter)"
                                style="margin-left: 20px; background: #fff; border: 1px solid #ccc; padding: 3px"
                                class="mu-btn mu-btn-icon mu-btn-icon-only">
                            <i class="mu-icon-img add"></i>
                        </button>


                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <th></th>
                    <td>
                        <div class="mu-item-group tr" style="padding-top: 10px;height: 30px;">
                            <button class="mu-btn btnApply fr" type="button" ng-click="saveFilter(analysis.selectedField, analysis.tempFilters)"><spring:message code="save" /></button>
                        </div>
                    </td>
                </tr>
                </tfoot>
            </table>

        </div>
    </div>
</div>

<!-- 팝업 레이어: 필터 수정 -->
<div class="mu-tooltip pivotTooltip right-top" style="width: 360px;" popup-layer="analysis.filter.edit">
    <div class="arrow"></div>
    <div class="mu-tooltip-inner" style="margin: 0; padding: 0;">

        <table class="mu-formbox">
            <thead>
            <tr>
                <th>
                    <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"
                            ng-click="closeAllLayers()">
                        <i class="mu-icon-img arrow-prev"></i>
                    </button>
                </th>
                <td ng-bind="analysis.selectedField.name"></td>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th>
                </th>
                <td>

                    <table class="mu-grid">
                        <tr ng-repeat="tempFilter in analysis.tempFilters">
                            <td>
                                <div class="mu-selectbox" mu-select-v2="" select-model="tempFilter.key">
                                    <button class="mu-value" title="{{models[tempFilter.key]}}">{{models[tempFilter.key]}}</button>
                                    <ul class="mu-list">
                                        <li ng-repeat="(value, name) in models" mu-option-v2="value" title="{{name}}">{{name}}</li>
                                    </ul>
                                </div>
                            </td>
                            <td>
                                <input type="text" ng-change="$last && addTempFilter(analysis.tempFilters, inputFilter)" ng-model="tempFilter.value" class="mu-input mu-input-default">
                            </td>
                            <td>
                                <button type="button"
                                        ng-click="deleteTempFilter($index, tempFilter)"
                                        class="mu-btn mu-btn-icon mu-btn-bg-non"><i class="fa fa-minus-circle" aria-hidden="true"></i></button>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" class="tl vt">
                                <button type="button"
                                        ng-click="addTempFilter(analysis.tempFilters, inputFilter)"
                                        style="background: #fff; border: 1px solid #ccc; padding: 3px"
                                        class="mu-btn mu-btn-icon mu-btn-icon-only">
                                    <i class="mu-icon-img add"></i>
                                </button>

                            </td>
                        </tr>
                    </table>

                    <button class="mu-btn btnApply fr" type="button"
                            ng-click="saveFilter(analysis.selectedField, analysis.tempFilters)">
                        <spring:message code="save" />
                    </button>

                </td>
            </tr>
            </tbody>
        </table>
    </div>
</div>