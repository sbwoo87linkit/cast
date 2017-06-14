<div ui-on-Drop="onDropField($event, $data, 'weightField', 'bottom-right')" class="drop-container" layer-offset="{left: 2}">
    <span ui-on-Drop="preventDrop($event)" class="field" ng-if="!adv.fieldOptions.drops.weightField" style="">없음</span>
    <div class="field" ng-if="adv.fieldOptions.drops.weightField">
        <button class="fr" ng-click="openPopup($event, 'adv.weightField.setting', 'bottom-right')"> > </button>
        <button ui-on-Drop="preventDrop($event)" type="button" class="close fl" ng-click="clearField($event, 'weightField')"></button>
        <div>{{adv.fieldOptions.drops.weightField.name}}</div>
    </div>
</div>

<div class="mu-tooltip top-right" style="width: 426px;" popup-layer="adv.weightField.setting">
    <div class="arrow"></div>
    <div class="mu-tooltip-inner">

        <span class="title">{{adv.fieldOptions.drops.weightField.name}}</span>
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
                        <div class="mu-selectbox" mu-select="sb1" select-model="adv.fieldOptions.opts.weight.summaryMethod.selected"
                             select-items="adv.fieldOptions.opts.weight.summaryMethod.list" select-change="changeOption($model)">
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
