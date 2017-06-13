
<div ui-on-Drop="onDropField($event, $data, 'yAxisField', 'right-top')" class="drop-container" layer-offset="{left: 2}">
    <span class="field" ng-if="!adv.fieldOptions.drops.yAxisField" style="">없음</span>
    <div class="field" ng-if="adv.fieldOptions.drops.yAxisField">
        <button class="fr" ng-click="openPopup($event, 'adv.yAxisField.setting', 'right-top')"> > </button>
        <button type="button" class="close fl" ng-click="clearField($event, 'yAxisField')"></button>
        <div>{{adv.fieldOptions.drops.yAxisField.name}}</div>
    </div>
</div>

<!-- 팝업 레이어: y축 Field 설정 -->
<div class="mu-tooltip top-right" style="width: 426px;" popup-layer="adv.yAxisField.setting">
    <div class="arrow"></div>
    <div class="mu-tooltip-inner">

        <span class="title">{{adv.yAxisField.name}}</span>
        <!-- selectbox: 모델 -->
        <div class="mu-search-item timeRelative">

            <table class="mu-formbox">
                <colgroup>
                    <col width="100px">
                </colgroup>
                <tbody>
                <tr>
                    <th>
                        <label>정렬:</label>
                    </th>
                    <td>
                        <div class="mu-selectbox" mu-select="sb1" select-model="adv.fieldOptions.opts.xAxis.sort.selected"
                             select-items="adv.fieldOptions.opts.xAxis.sort.list" select-change="changeOption($model)">
                            <button class="mu-value">{{$model.text}}</button>
                            <ul class="mu-list">
                                <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                            </ul>
                        </div>

                    </td>
                </tr>

                <tr>
                    <th>
                        <label>범위만들기:</label>
                    </th>
                    <td>
                        <div class="mu-btn-group">
                            <button class="mu-btn" ng-class="{'active': adv.fieldOptions.opts.xAxis.range.selected === 'userDefined'}"
                                    ng-click="adv.fieldOptions.opts.xAxis.range.selected = 'userDefined'">사용자지정</button>
                            <button class="mu-btn" ng-class="{'active': adv.fieldOptions.opts.xAxis.range.selected === 'notUse'}"
                                    ng-click="adv.fieldOptions.opts.xAxis.range.selected = 'notUse'">만들지 않음</button>
                        </div>
                        <div ng-show="adv.fieldOptions.opts.xAxis.range.selected === 'userDefined'">
                            <table>
                                <tr>
                                    <td>
                                        범위크기
                                    </td>
                                    <td>
                                        <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                               ng-model="adv.fieldOptions.opts.xAxis.range.userDefined.size">

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        범위시작
                                    </td>
                                    <td>
                                        <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                               ng-model="adv.fieldOptions.opts.xAxis.range.userDefined.start">

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        범위끝
                                    </td>
                                    <td>
                                        <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                                               ng-model="adv.fieldOptions.opts.xAxis.range.userDefined.end">

                                    </td>
                                </tr>
                            </table>

                        </div>
                    </td>
                </tr>

                <tr>
                    <th>
                        <label>최대개수:</label>
                    </th>
                    <td>
                        <input type="text" class="mu-input ng-pristine ng-untouched ng-valid ng-not-empty"
                               ng-model="adv.fieldOptions.opts.xAxis.maxCount">
                    </td>
                </tr>

                </tbody>
            </table>


        </div>

        <div class="mu-item-group" style="padding-top: 10px;height: 30px;">
            <button class="mu-btn btnApply fr" type="button" ng-click="saveYAxisFieldOption(timeField.sort.selected)"><spring:message code="save" /></button>
        </div>
    </div>
</div>
<!-- // 팝업 레이어: y축 Field 설정 -->

