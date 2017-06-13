<div ui-on-Drop="onDropField($event, $data, 'valueField', 'bottom-right')" class="drop-container" layer-offset="{left: 2}">
    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!adv.fieldOptions.drops.valueField" style="">없음</span>
    <div class="field" ng-if="adv.fieldOptions.drops.valueField">
        <button class="fr" ng-click="openPopup($event, 'adv.valueField.setting', 'bottom-right')"> > </button>
        <button ui-on-Drop="preventDrop($event)" type="button" class="close fl" ng-click="clearField($event, 'valueField')"></button>
        <div>{{adv.fieldOptions.drops.valueField.name}}</div>
    </div>
</div>

<div class="mu-tooltip top-right" style="width: 426px;" popup-layer="adv.valueField.setting">
    <div class="arrow"></div>
    <div class="mu-tooltip-inner">

        <span class="title">{{adv.fieldOptions.drops.valueField.name}}</span>
        <div class="mu-search-item timeRelative">

            <table class="mu-formbox">
                <colgroup>
                    <col width="100px">
                </colgroup>
                <tbody>
                <tr>
                    <th>
                        <label>Summary 방식:</label>
                    </th>
                    <td>
                        <div class="mu-selectbox" mu-select="sb1" select-model="adv.fieldOptions.opts.value.summaryMethod.selected"
                             select-items="adv.fieldOptions.opts.value.summaryMethod.list" select-change="changeOption($model)">
                            <button class="mu-value">{{$model.text}}</button>
                            <ul class="mu-list">
                                <li ng-repeat="opt in $data" mu-option="" value="{{opt.value}}">{{opt.text}}</li>
                            </ul>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>

        </div>
        <div class="mu-item-group" style="padding-top: 10px;height: 30px;">
            <button class="mu-btn btnApply fr" type="button" ng-click="closePopup()"><spring:message code="save" /></button>
        </div>
    </div>
</div>