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
                        <div class="mu-btn-group" ng-init="adv.chartOpts.opts.normal.showValue = 'none'">
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.showValue === 'none'}"
                                    ng-click="adv.chartOpts.opts.normal.showValue = 'none'"><spring:message code="off" /></button>
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.showValue === 'all'}"
                                    ng-click="adv.chartOpts.opts.normal.showValue = 'all'"><spring:message code="on" /></button>
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.normal.showValue === 'min.max'}"
                                    ng-click="adv.chartOpts.opts.normal.showValue = 'min.max'"><spring:message code="agg_func.min" />/<spring:message code="agg_func.max" /></button>
                        </div>
                    </td>
                </tr>
                <!-- 최소 높이 -->
                <tr class="table-row">
                    <th>
                        최소 높이
                    </th>
                    <td>
                        <div class="mu-item-group" ng-init="adv.chartOpts.opts.normal.minHeight=170">
                            <input type="text" class="mu-input" ng-model="adv.chartOpts.opts.normal.minHeight" >
                            <!--<div class="mu-checkbox">-->
                            <!--<input type="checkbox" id="ckbXAxisTitle" ng-model="adv.chartOpts.opts.xAxis.title.isShow"-->
                            <!--ng-click="changeXAxisTitle($event)">-->
                            <!--<label for="ckbXAxisTitle"><spring:message code="pivot.show" /></label>-->
                            <!--</div>-->
                        </div>
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
                            <input type="text" class="mu-input" placeholder="<spring:message code="optional" />" ng-model="adv.chartOpts.opts.xAxis.title.text">
                            <div class="mu-checkbox">
                                <input type="checkbox" id="ckbXAxisTitle" ng-model="adv.chartOpts.opts.xAxis.title.isShow"
                                ">
                                <label for="ckbXAxisTitle"><spring:message code="pivot.show" /></label>
                            </div>
                        </div>
                    </td>
                </tr>
                <!-- 레이블 회전 -->
                <tr>
                    <th>
                        <spring:message code="pivot.labels_rotation" />
                    </th>
                    <td>
                        <div class="mu-btn-group" ng-init="adv.chartOpts.opts.xAxis.labels.rotation = -90">
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.xAxis.labels.rotation === -90}"
                                    ng-click="adv.chartOpts.opts.xAxis.labels.rotation = -90">-90</button>
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.xAxis.labels.rotation === -45}"
                                    ng-click="adv.chartOpts.opts.xAxis.labels.rotation = -45">-45</button>
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.xAxis.labels.rotation === 0}"
                                    ng-click="adv.chartOpts.opts.xAxis.labels.rotation = 0">0</button>
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.xAxis.labels.rotation === 45}"
                                    ng-click="adv.chartOpts.opts.xAxis.labels.rotation = 45">45</button>
                            <button class="mu-btn" ng-class="{'active': adv.chartOpts.opts.xAxis.labels.rotation === 90}"
                                    ng-click="adv.chartOpts.opts.xAxis.labels.rotation = 90">90</button>
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
