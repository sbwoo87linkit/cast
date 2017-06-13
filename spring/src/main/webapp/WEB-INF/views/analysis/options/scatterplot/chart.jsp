<div class="mu-dialog-body" ng-show="activeTabSet === 'defaultTab'">
    <!-- 탭 목록 (좌측) -->
    <ul class="mu-tab mu-tab-vertical" mu-tabset="defaultTab">
        <li mu-tab-item="" ng-repeat="group in tabs">
            <a href="javascript:;">{{group.res}}</a>
        </li>
    </ul>
    <!-- 탭 컨텐츠 (기본) -->
    <div class="mu-tab-body" mu-tabset="defaultTab">
        <!-- 일반 -->
        <div class="mu-tabCont" mu-tab-contents="">
            <table class="mu-formbox">
                <colgroup>
                    <col width="100px">
                </colgroup>
                <tbody>
                <!-- 드릴 다운 -->
                <tr>
                    <th>
                        <spring:message code="drilldown" />
                    </th>
                    <td>
                        <div class="mu-btn-group" ng-init="adv.chartOpts.opts.normal.drillDown = true">
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.drillDown}"
                                    ng-click="adv.chartOpts.opts.normal.drillDown = true"><spring:message code="yes" /></button>
                            <button class="mu-btn" ng-class="{'active': !adv.chartOpts.opts.normal.drillDown}"
                                    ng-click="adv.chartOpts.opts.normal.drillDown = false"><spring:message code="no" /></button>
                        </div>
                    </td>
                </tr>
                <!-- 데이터 값 표시 -->
                <tr class="mu-item-group">
                    <th>
                        <spring:message code="chart.show_data_values" />

                    </th>
                    <td>
                        <div class="mu-btn-group">
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.showValue === 'none'}"
                                    ng-click="adv.chartOpts.opts.normal.showValue = 'none'"><spring:message code="off" /></button>
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.showValue === 'all'}"
                                    ng-click="adv.chartOpts.opts.normal.showValue = 'all'"><spring:message code="on" /></button>
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.showValue === 'min.max'}"
                                    ng-click="adv.chartOpts.opts.normal.showValue = 'min.max'"><spring:message code="agg_func.min" />/<spring:message code="agg_func.max" /></button>
                        </div>
                    </td>
                </tr>
                <!-- 기본 색상 -->
                <tr class="mu-item-group">
                    <th>
                        기본색상
                    </th>
                    <td>
                        <input type="text" class="mu-input" ng-model="adv.chartOpts.opts.normal.color">
                        <div ng-style="{'background' : adv.chartOpts.opts.normal.color }"  style="display: inline-block; width:20px; height: 20px;"></div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!-- 컬럼 -->
        <div class="mu-tabCont" mu-tab-contents="">
            <table class="mu-formbox">
                <colgroup>
                    <col width="100px">
                </colgroup>
                <tbody>
                <!-- 제목 -->
                <tr>
                    <th>
                        <spring:message code="report.title" />
                    </th>
                    <td>
                        <div class="mu-item-group">
                            <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.xAxis.labels.text">
                            <div class="mu-checkbox">
                                <input type="checkbox" id="ckbXAxisTitle" ng-model="adv.chartOpts.opts.xAxis.labels.show">
                                <label for="ckbXAxisTitle"><spring:message code="pivot.show" /></label>
                            </div>
                        </div>
                    </td>
                </tr>
                <!-- 정렬 -->
                <tr>
                    <th>
                        정렬
                    </th>
                    <td>
                        <!--기본값 오름차순 내림차순-->

                        <div class="mu-selectbox" mu-select="sbOverlay" select-items="overlayFields" select-change="changeOverlayField('add', $model)">
                            <button class="mu-value">{{$model.text}}</button>
                            <ul class="mu-list">
                                <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                            </ul>
                        </div>
                        <div class="mu-item-group mu-input-btn" ng-repeat="field in adv.chartOpts.opts.overlay.fields">
                            <input type="text" class="mu-input" readonly="readonly" value="{{field}}">
                            <button type="button" class="mu-btn mu-btn-icon mu-btn-icon-only"
                                    ng-click="changeOverlayField('remove', field)">
                                <i class="mu-icon-img delete2"></i>
                            </button>
                        </div>


                    </td>
                </tr>
                <!-- NOTE: 추후 기능 구현 -->
                <!-- 레이블 잘라내기 -->
                <!-- <tr>
                    <th>레이블 잘라내기</th>
                    <td>
                        <div class="mu-btn-group">
                            <button class="mu-btn"><spring:message code="yes" /></button>
                            <button class="mu-btn active"><spring:message code="no" /></button>
                        </div>
                    </td>
                </tr> -->
                </tbody>
            </table>
        </div>
    </div>
</div>
