<div class="mu-dialog-body" ng-show="activeTabSet === 'defaultTab'">
    <!-- 탭 목록 (좌측) -->
    <ul class="mu-tab mu-tab-vertical" mu-tabset="defaultTab">
        <li mu-tab-item="" ng-repeat="group in adv.fieldOptions.groups">
            <a href="javascript:;">{{group}}</a>
        </li>
    </ul>

    <div class="mu-tab-body" mu-tabset="defaultTab">
        <div class="mu-tabCont" mu-tab-contents="" ng-repeat="tab in adv.fieldOptions.tabs">

            <table class="mu-formbox">
                <colgroup>
                    <col width="100px">
                </colgroup>
                <tbody>
                <tr ng-repeat="row in tab.rows">
                    <th>
                        {{row.label}}
                    </th>
                    <td>
                        <div style="display:inline-block; border: 1px solid #999; margin: 2px;" ng-repeat="control in row.controls">

                            <div ng-if="control.type === 'buttonGroup'">
                                <div class="mu-btn-group" >
                                    <button ng-repeat="option in control.options" class="mu-btn" ng-class="{'active': option.value === control.selected}"
                                            ng-click="control.selected = option.value">
                                        {{option.text}}
                                    </button>
                                </div>
                            </div>

                            <div ng-if="control.type === 'input'">
                                <div class="mu-item-group">
                                    <input type="text" class="mu-input" ng-model="control.value">
                                </div>
                            </div>

                            <div ng-if="control.type === 'checkbox'">
                                <div class="mu-item-group">
                                    <div class="mu-checkbox">
                                        <input type="checkbox" id="ckb_{{$index}}"
                                               ng-model="control.value">
                                        <label for="ckb_{{$index}}">
                                            {{control.text}}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div ng-if="control.type === 'dropdown'">
                                <div class="mu-selectbox" mu-select="" select-model="control.selected" select-items="control.options"
                                     select-change="changeOverlayField('add', $model)">
                                    <button class="mu-value">{{$model.text}}</button>
                                    <ul class="mu-list">
                                        <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </td>
                </tr>
                </tbody>
            </table>


        </div>
    </div>
</div>



    <!-- 탭 컨텐츠 (기본) -->

    <!--<div class="mu-tab-body" mu-tabset="defaultTab">-->
        <!--&lt;!&ndash; 일반 &ndash;&gt;-->
        <!--<div class="mu-tabCont" mu-tab-contents="">-->
            <!--<table class="mu-formbox">-->
                <!--<colgroup>-->
                    <!--<col width="100px">-->
                <!--</colgroup>-->
                <!--<tbody>-->
                <!--&lt;!&ndash; 드릴 다운 &ndash;&gt;-->
                <!--<tr>-->
                    <!--<th>-->
                        <!--<spring:message code="drilldown" />-->
                    <!--</th>-->
                    <!--<td>-->
                        <!--<div class="mu-btn-group" ng-init="adv.chartOpts.opts.normal.drillDown = true">-->
                            <!--<button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.drillDown}"-->
                                    <!--ng-click="adv.chartOpts.opts.normal.drillDown = true"><spring:message code="yes" /></button>-->
                            <!--<button class="mu-btn" ng-class="{'active': !adv.chartOpts.opts.normal.drillDown}"-->
                                    <!--ng-click="adv.chartOpts.opts.normal.drillDown = false"><spring:message code="no" /></button>-->
                        <!--</div>-->
                    <!--</td>-->
                <!--</tr>-->
                <!--&lt;!&ndash; 데이터 값 표시 &ndash;&gt;-->
                <!--<tr class="mu-item-group">-->
                    <!--<th>-->
                        <!--<spring:message code="chart.show_data_values" />-->
                    <!--</th>-->
                    <!--<td>-->
                        <!--<div class="mu-btn-group">-->
                            <!--<button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.showValue === 'none'}"-->
                                    <!--ng-click="adv.chartOpts.opts.normal.showValue = 'none'"><spring:message code="off" /></button>-->
                            <!--<button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.showValue === 'all'}"-->
                                    <!--ng-click="adv.chartOpts.opts.normal.showValue = 'all'"><spring:message code="on" /></button>-->
                            <!--<button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.showValue === 'min.max'}"-->
                                    <!--ng-click="adv.chartOpts.opts.normal.showValue = 'min.max'"><spring:message code="agg_func.min" />/<spring:message code="agg_func.max" /></button>-->
                        <!--</div>-->
                    <!--</td>-->
                <!--</tr>-->
                <!--</tbody>-->
            <!--</table>-->
        <!--</div>-->
        <!--&lt;!&ndash; 컬럼 &ndash;&gt;-->
        <!--<div class="mu-tabCont" mu-tab-contents="">-->
            <!--<table class="mu-formbox">-->
                <!--<colgroup>-->
                    <!--<col width="100px">-->
                <!--</colgroup>-->
                <!--<tbody>-->
                <!--&lt;!&ndash; 제목 &ndash;&gt;-->
                <!--<tr>-->
                    <!--<th>-->
                        <!--<spring:message code="report.title" />-->
                    <!--</th>-->
                    <!--<td>-->
                        <!--<div class="mu-item-group">-->
                            <!--<input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.xAxis.labels.text">-->
                            <!--<div class="mu-checkbox">-->
                                <!--<input type="checkbox" id="ckbXAxisTitle" ng-model="adv.chartOpts.opts.xAxis.labels.show">-->
                                <!--<label for="ckbXAxisTitle"><spring:message code="pivot.show" /></label>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</td>-->
                <!--</tr>-->
                <!--&lt;!&ndash; 정렬 &ndash;&gt;-->
                <!--<tr>-->
                    <!--<th>-->
                        <!--정렬-->
                    <!--</th>-->
                    <!--<td>-->
                        <!--&lt;!&ndash;기본값 오름차순 내림차순&ndash;&gt;-->

                        <!--<div class="mu-selectbox" mu-select="sbOverlay" select-items="overlayFields" select-change="changeOverlayField('add', $model)">-->
                            <!--<button class="mu-value">{{$model.text}}</button>-->
                            <!--<ul class="mu-list">-->
                                <!--<li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>-->
                            <!--</ul>-->
                        <!--</div>-->
                        <!--<div class="mu-item-group mu-input-btn" ng-repeat="field in adv.chartOpts.opts.overlay.fields">-->
                            <!--<input type="text" class="mu-input" readonly="readonly" value="{{field}}">-->
                            <!--<button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"-->
                                    <!--ng-click="changeOverlayField('remove', field)">-->
                                <!--<i class="mu-icon-img delete2"></i>-->
                            <!--</button>-->
                        <!--</div>-->


                    <!--</td>-->
                <!--</tr>-->
                <!--&lt;!&ndash; NOTE: 추후 기능 구현 &ndash;&gt;-->
                <!--&lt;!&ndash; 레이블 잘라내기 &ndash;&gt;-->
                <!--&lt;!&ndash; <tr>-->
                    <!--<th>레이블 잘라내기</th>-->
                    <!--<td>-->
                        <!--<div class="mu-btn-group">-->
                            <!--<button class="mu-btn"><spring:message code="yes" /></button>-->
                            <!--<button class="mu-btn active"><spring:message code="no" /></button>-->
                        <!--</div>-->
                    <!--</td>-->
                <!--</tr> &ndash;&gt;-->
                <!--</tbody>-->
            <!--</table>-->
        <!--</div>-->
    <!--</div>-->
