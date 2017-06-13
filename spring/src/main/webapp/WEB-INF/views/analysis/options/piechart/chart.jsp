<div class="mu-dialog-body" ng-show="activeTabSet === 'PieTab'">
    <!-- 탭 목록 (좌측) -->
    <ul class="mu-tab mu-tab-vertical" mu-tabset="PieTab">
        <li mu-tab-item="" ng-repeat="group in chartOpts.groups">
            <a href="javascript:;">{{group.res}}</a>
        </li>
    </ul>
    <!-- 탭 컨텐츠 (pie 차트) -->
    <div class="mu-tab-body" mu-tabset="PieTab">
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
                        <div class="mu-btn-group">
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.drillDown}"
                                    ng-click="changeDrillDown(true)"><spring:message code="yes" /></button>
                            <button class="mu-btn" ng-class="{'active': !adv.chartOpts.opts.normal.drillDown}"
                                    ng-click="changeDrillDown(false)"><spring:message code="no" /></button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!-- 크기 -->
        <div class="mu-tabCont" mu-tab-contents="">
            <table class="mu-formbox">
                <colgroup>
                    <col width="100px">
                </colgroup>
                <tbody>
                <!-- 최소 크기 -->
                <tr>
                    <th>
                        <spring:message code="chart.size.min_size" />
                    </th>
                    <td>
                        <div class="mu-item-group">
                            <input type="text" class="mu-input" ng-model="adv.chartOpts.opts.size.minSize" ng-keydown="changeMinSize($event)" ng-blur="changeMinSize($event)">
                            <label>%</label>
                        </div>
                        <!-- 도움말 -->
                        <div>
                            <i class="mu-icon-img help"></i>
                            <span>
                                            <spring:message code="chart.message.size_min_size" />
                                        </span>
                        </div>
                        <!-- 에러 메시지 -->
                        <div ng-show="!optsValid.sizeMinSize">
                            <i class="mu-icon-img alert"></i>
                            <span>
                                            <spring:message code="chart.error.invalid_size_min_size" />
                                        </span>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
